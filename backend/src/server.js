import 'dotenv/config'
import dns from 'node:dns'
import mongoose from 'mongoose'
import app from './app.js'

const port = Number(process.env.PORT || 5000)
const mongoUri = process.env.MONGODB_URI
const mongoDnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(',')
  .map(server => server.trim())
  .filter(Boolean)
const retryDelayMs = 5000

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.')
  process.exit(1)
}

if (!mongoUri) {
  console.error('MONGODB_URI is required. Copy .env.example to .env and configure it.')
  process.exit(1)
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to a random secret of at least 32 characters.')
  process.exit(1)
}

if (mongoDnsServers?.length) {
  try {
    dns.setServers(mongoDnsServers)
  } catch {
    console.error('MONGODB_DNS_SERVERS must contain valid DNS server addresses separated by commas.')
    process.exit(1)
  }
}

let shuttingDown = false
let retryTimer

async function connectDatabase() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    console.info('MongoDB connected.')
  } catch (error) {
    if (shuttingDown) return

    console.error(`MongoDB connection failed (${error.name || 'UnknownError'}); retrying in ${retryDelayMs / 1000}s.`)
    retryTimer = setTimeout(connectDatabase, retryDelayMs)
    retryTimer.unref()
  }
}

const server = app.listen(port, () => {
  console.info(`TrackAI API listening on port ${port}.`)
  void connectDatabase()
})

server.on('error', error => {
  console.error(`HTTP server failed to start (${error.code || error.name}).`)
  process.exitCode = 1
})

function shutdown(signal) {
  if (shuttingDown) return

  shuttingDown = true
  clearTimeout(retryTimer)
  console.info(`${signal} received; shutting down.`)

  server.close(async error => {
    if (error) {
      console.error(`HTTP server shutdown failed (${error.code || error.name}).`)
      process.exitCode = 1
    }

    try {
      await mongoose.disconnect()
    } catch (disconnectError) {
      console.error(`MongoDB disconnect failed (${disconnectError.name || 'UnknownError'}).`)
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
