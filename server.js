import { createServer as createHttpServer } from 'node:http'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createServer as createViteServer } from 'vite'
import react from '@vitejs/plugin-react'

const scrypt = promisify(scryptCallback)
const dataDirectory = join(process.cwd(), 'data')
const dataFile = join(dataDirectory, 'users.json')
const sessions = new Map()
const sessionLifetime = 7 * 24 * 60 * 60 * 1000
const authAttempts = new Map()

async function readDatabase() {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return { users: [], runs: [] }
  }
}

async function saveDatabase(database) {
  await mkdir(dataDirectory, { recursive: true })
  const temporaryFile = `${dataFile}.tmp`
  await writeFile(temporaryFile, JSON.stringify(database, null, 2), 'utf8')
  await rename(temporaryFile, dataFile)
}

function sendJson(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  })
  response.end(JSON.stringify(payload))
}

async function readBody(request) {
  let raw = ''
  for await (const chunk of request) {
    raw += chunk
    if (raw.length > 16_384) throw new Error('İstek çok büyük.')
  }
  try {
    return JSON.parse(raw || '{}')
  } catch {
    throw new Error('Gönderilen bilgiler okunamadı.')
  }
}

function cookieValue(request, name) {
  const cookies = request.headers.cookie || ''
  const match = cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function publicUser(user) {
  return { id: user.id, name: user.name, createdAt: user.createdAt }
}

function getSessionUser(request, database) {
  const token = cookieValue(request, 'kosu_session')
  if (!token) return null
  const key = createHash('sha256').update(token).digest('hex')
  const session = sessions.get(key)
  if (!session) return null
  if (session.expiresAt <= Date.now()) {
    sessions.delete(key)
    return null
  }
  return database.users.find((user) => user.id === session.userId) || null
}

function setSession(response, userId) {
  const token = randomBytes(32).toString('base64url')
  sessions.set(createHash('sha256').update(token).digest('hex'), { userId, expiresAt: Date.now() + sessionLifetime })
  const secure = response.req?.socket?.encrypted ? '; Secure' : ''
  response.setHeader('Set-Cookie', `kosu_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionLifetime / 1000}${secure}`)
}

function clearSession(request, response) {
  const token = cookieValue(request, 'kosu_session')
  if (token) sessions.delete(createHash('sha256').update(token).digest('hex'))
  response.setHeader('Set-Cookie', 'kosu_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0')
}

function validEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function handleApi(request, response, url) {
  try {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && request.headers.origin) {
      const origin = new URL(request.headers.origin)
      const host = request.headers.host
      if (origin.host !== host) return sendJson(response, 403, { error: 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar dene.' })
    }

    const database = await readDatabase()
    const route = `${request.method} ${url.pathname}`

    if (route === 'GET /api/session') {
      const user = getSessionUser(request, database)
      return sendJson(response, 200, { user: user ? publicUser(user) : null })
    }

    if (route === 'POST /api/register' || route === 'POST /api/login') {
      const now = Date.now()
      for (const [key, value] of authAttempts) if (value.resetAt <= now) authAttempts.delete(key)
      const attemptKey = `${request.socket.remoteAddress || 'local'}:${url.pathname}`
      const attempts = authAttempts.get(attemptKey) || { count: 0, resetAt: now + 10 * 60 * 1000 }
      if (attempts.count >= 12) return sendJson(response, 429, { error: 'Çok fazla deneme yapıldı. 10 dakika sonra tekrar dene.' }, { 'Retry-After': String(Math.ceil((attempts.resetAt - now) / 1000)) })
      attempts.count += 1
      authAttempts.set(attemptKey, attempts)

      const body = await readBody(request)
      const email = String(body.email || '').trim().toLocaleLowerCase('en-US')
      const password = String(body.password || '')
      if (!validEmail(email)) return sendJson(response, 400, { error: 'Geçerli bir e-posta adresi gir.' })
      if (password.length > 200 || (route === 'POST /api/register' && password.length < 12) || (route === 'POST /api/login' && password.length < 1)) {
        return sendJson(response, 400, { error: route === 'POST /api/register' ? 'Şifren en az 12 karakter olmalı.' : 'E-posta ya da şifre hatalı.' })
      }

      let user = database.users.find((item) => item.email === email)
      if (route === 'POST /api/register') {
        const name = String(body.name || '').trim()
        if (name.length < 2 || name.length > 40) return sendJson(response, 400, { error: 'Adın 2–40 karakter arasında olmalı.' })
        if (password !== String(body.confirmPassword || '')) return sendJson(response, 400, { error: 'Şifreler birbiriyle eşleşmiyor.' })
        if (user) return sendJson(response, 409, { error: 'Bu e-posta ile zaten hesap açılmış.' })
        const salt = randomBytes(16).toString('hex')
        const passwordHash = (await scrypt(password, salt, 64)).toString('hex')
        user = { id: randomBytes(16).toString('hex'), name, email, salt, passwordHash, createdAt: new Date().toISOString() }
        database.users.push(user)
        await saveDatabase(database)
        authAttempts.delete(attemptKey)
      } else {
        if (!user) return sendJson(response, 401, { error: 'E-posta ya da şifre hatalı.' })
        const candidate = await scrypt(password, user.salt, 64)
        const saved = Buffer.from(user.passwordHash, 'hex')
        if (saved.length !== candidate.length || !timingSafeEqual(saved, candidate)) {
          return sendJson(response, 401, { error: 'E-posta ya da şifre hatalı.' })
        }
        authAttempts.delete(attemptKey)
      }
      setSession(response, user.id)
      return sendJson(response, 200, { user: publicUser(user) })
    }

    if (route === 'POST /api/logout') {
      clearSession(request, response)
      return sendJson(response, 200, { ok: true })
    }

    if (route === 'GET /api/runs') {
      const user = getSessionUser(request, database)
      if (!user) return sendJson(response, 401, { error: 'Koşu günlüğü için giriş yapmalısın.' })
      const runs = database.runs.filter((run) => run.userId === user.id).sort((a, b) => b.date.localeCompare(a.date))
      return sendJson(response, 200, { runs })
    }

    if (route === 'GET /api/feed') {
      const feed = database.runs.filter((run) => run.isPublic).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50)
        .map(({ id, userId, date, distanceKm, durationSeconds, paceSeconds, note, createdAt }) => ({
          id, name: database.users.find((user) => user.id === userId)?.name || 'Koşucu', date, distanceKm, durationSeconds, paceSeconds, note, createdAt,
        }))
      return sendJson(response, 200, { runs: feed })
    }

    if (route === 'POST /api/runs') {
      const user = getSessionUser(request, database)
      if (!user) return sendJson(response, 401, { error: 'Koşunu kaydetmek için giriş yapmalısın.' })
      const body = await readBody(request)
      const distanceKm = Number(body.distanceKm)
      const durationSeconds = Number(body.durationSeconds)
      const date = String(body.date || '')
      const note = String(body.note || '').trim().slice(0, 180)
      if (!Number.isFinite(distanceKm) || distanceKm < 0.2 || distanceKm > 300) return sendJson(response, 400, { error: 'Mesafe 0,2 ile 300 km arasında olmalı.' })
      if (!Number.isInteger(durationSeconds) || durationSeconds < 30 || durationSeconds > 36 * 3600) return sendJson(response, 400, { error: 'Süre 30 saniye ile 36 saat arasında olmalı.' })
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00Z`)) || date > new Date().toISOString().slice(0, 10)) return sendJson(response, 400, { error: 'Geçerli bir koşu tarihi seç.' })
      const run = {
        id: randomBytes(12).toString('hex'), userId: user.id, date, distanceKm: Math.round(distanceKm * 100) / 100,
        durationSeconds, paceSeconds: Math.round(durationSeconds / distanceKm), note,
        isPublic: body.isPublic === true, createdAt: new Date().toISOString(),
      }
      database.runs.push(run)
      await saveDatabase(database)
      const { userId, ...safeRun } = run
      return sendJson(response, 201, { run: safeRun })
    }

    return sendJson(response, 404, { error: 'Bu adres bulunamadı.' })
  } catch (error) {
    console.error('API error:', error.message)
    return sendJson(response, 400, { error: error.message || 'İşlem tamamlanamadı.' })
  }
}

const appPort = Number(process.env.PORT) || 5173
const vite = await createViteServer({ configFile: false, plugins: [react()], cacheDir: join(process.cwd(), '.vite-local'), server: { middlewareMode: true, allowedHosts: ['kosu-istanbul.onrender.com'], hmr: { port: appPort + 10_000 } }, appType: 'spa' })
const server = createHttpServer((request, response) => {
  const url = new URL(request.url, 'http://localhost')
  if (url.pathname.startsWith('/api/')) {
    void handleApi(request, response, url)
    return
  }
  vite.middlewares(request, response, () => {
    response.writeHead(404)
    response.end('Not found')
  })
})

server.listen(appPort, '0.0.0.0', () => {
  console.log(`Koşu İstanbul hazır: http://127.0.0.1:${appPort}`)
})

process.on('SIGINT', async () => {
  await vite.close()
  server.close(() => process.exit(0))
})
