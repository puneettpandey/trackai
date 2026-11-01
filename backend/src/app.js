import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import groupRoutes from './routes/groups.js'

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (request, response) => {
  const databaseConnected = mongoose.connection.readyState === 1

  response.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: databaseConnected ? 'connected' : 'disconnected',
    },
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error)
    return
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json({ error: 'Invalid JSON body' })
    return
  }

  if (error.name === 'ValidationError') {
    response.status(400).json({ error: 'The submitted data is invalid.' })
    return
  }

  console.error('Unhandled request error:', error.name || 'UnknownError')
  response.status(500).json({ error: 'Internal server error' })
})

export default app
