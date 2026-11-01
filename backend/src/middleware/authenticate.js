import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

export default async function authenticate(request, response, next) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    response.status(503).json({ error: 'Authentication is not configured on the server.' })
    return
  }

  const authorization = request.get('authorization') || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) {
    response.status(401).json({ error: 'Authentication required.' })
    return
  }
  if (mongoose.connection.readyState !== 1) {
    response.status(503).json({ error: 'Database is unavailable. Please try again shortly.' })
    return
  }

  try {
    const payload = jwt.verify(token, secret, { issuer: 'trackai-api' })
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      response.status(401).json({ error: 'Invalid or expired session.' })
      return
    }

    const user = await User.findById(payload.sub).select('_id name email')
    if (!user) {
      response.status(401).json({ error: 'Invalid or expired session.' })
      return
    }

    request.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      response.status(401).json({ error: 'Invalid or expired session.' })
      return
    }
    next(error)
  }
}
