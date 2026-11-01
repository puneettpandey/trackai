import { Router } from 'express'
import mongoose from 'mongoose'
import Group from '../models/Group.js'
import authenticate from '../middleware/authenticate.js'

const router = Router()
router.use(authenticate)

function databaseReady(response) {
  if (mongoose.connection.readyState === 1) return true
  response.status(503).json({ error: 'Database is unavailable. Please try again shortly.' })
  return false
}

function groupResponse(group, userId) {
  const membership = group.members.find(member => member.user.toString() === userId.toString())
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    isPrivate: group.isPrivate,
    members: group.members.length,
    role: membership?.role || 'Member',
    color: '#635bff',
    active: true,
  }
}

router.get('/', async (request, response, next) => {
  if (!databaseReady(response)) return
  try {
    const groups = await Group.find({ 'members.user': request.user._id }).sort({ createdAt: -1 })
    response.json({ groups: groups.map(group => groupResponse(group, request.user._id)) })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request, response, next) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : ''
  const description = typeof request.body?.description === 'string' ? request.body.description.trim() : ''
  const isPrivate = request.body?.isPrivate

  if (!name || name.length > 40 || description.length > 100 || typeof isPrivate !== 'boolean') {
    response.status(400).json({ error: 'Enter a group name (up to 40 characters), description (up to 100), and privacy setting.' })
    return
  }
  if (!databaseReady(response)) return

  try {
    const group = await Group.create({
      name,
      description,
      isPrivate,
      owner: request.user._id,
      members: [{ user: request.user._id, role: 'Admin' }],
    })
    response.status(201).json({ group: groupResponse(group, request.user._id) })
  } catch (error) {
    next(error)
  }
})

export default router
