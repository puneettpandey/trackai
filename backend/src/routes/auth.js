import { Router } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import authenticate from '../middleware/authenticate.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function databaseReady(response) {
  if (mongoose.connection.readyState === 1) return true
  response.status(503).json({ error: 'Database is unavailable. Please try again shortly.' })
  return false
}

function createToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured.')
  return jwt.sign({}, secret, { subject: user.id, issuer: 'trackai-api', expiresIn: '7d' })
}

function userResponse(user) {
  return { id: user.id, name: user.name, email: user.email }
}

router.post('/register', async (request, response, next) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : ''
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''

  if (!name || name.length > 60 || !emailPattern.test(email) || email.length > 254 || password.length < 8 || password.length > 72) {
    response.status(400).json({ error: 'Enter a name, valid email, and password between 8 and 72 characters.' })
    return
  }
  if (!process.env.JWT_SECRET) {
    response.status(503).json({ error: 'Authentication is not configured on the server.' })
    return
  }
  if (!databaseReady(response)) return

  try {
    const user = await User.create({ name, email, passwordHash: password })
    response.status(201).json({ token: createToken(user), user: userResponse(user) })
  } catch (error) {
    if (error.code === 11000) {
      response.status(409).json({ error: 'An account with this email already exists.' })
      return
    }
    next(error)
  }
})

router.post('/login', async (request, response, next) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''

  if (!emailPattern.test(email) || email.length > 254 || !password || password.length > 72) {
    response.status(400).json({ error: 'Enter a valid email address and password.' })
    return
  }
  if (!process.env.JWT_SECRET) {
    response.status(503).json({ error: 'Authentication is not configured on the server.' })
    return
  }
  if (!databaseReady(response)) return

  try {
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user || !(await user.verifyPassword(password))) {
      response.status(401).json({ error: 'Email or password is incorrect.' })
      return
    }
    response.json({ token: createToken(user), user: userResponse(user) })
  } catch (error) {
    next(error)
  }
})

router.get('/me', authenticate, (request, response) => {
  response.json({ user: userResponse(request.user) })
})

export default router
