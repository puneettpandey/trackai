import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import app from '../src/app.js'

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-auth-tests'
}

let server
let baseUrl

before(async () => {
  server = app.listen(0)
  await new Promise((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
  })
})

test('health reports that the service is not ready when MongoDB is disconnected', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  const body = await response.json()

  assert.equal(response.status, 503)
  assert.equal(body.status, 'degraded')
  assert.equal(body.database.status, 'disconnected')
  assert.equal(typeof body.timestamp, 'string')
})

test('unknown routes return a JSON not-found response', async () => {
  const response = await fetch(`${baseUrl}/api/missing`)
  const body = await response.json()

  assert.equal(response.status, 404)
  assert.deepEqual(body, { error: 'Route not found' })
})

test('registration rejects invalid input before touching the database', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: 'short' }),
  })

  assert.equal(response.status, 400)
  assert.match((await response.json()).error, /valid email/)
})

test('group endpoints require an authenticated account', async () => {
  const response = await fetch(`${baseUrl}/api/groups`)

  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), { error: 'Authentication required.' })
})
