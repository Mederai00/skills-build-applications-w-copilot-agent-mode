import { Router } from 'express'
import User from '../models/User.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await User.find().sort({ totalPoints: -1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load users', details: String(error) })
  }
})

router.post('/', authenticate, async (request, response) => {
  try {
    response.status(201).json(await User.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create user', details: String(error) })
  }
})

router.put('/:id', authenticate, async (request, response) => {
  try {
    if (request.authUser?.role !== 'admin' && request.authUser?.id !== request.params.id) return response.status(403).json({ error: 'You can only update your own profile' })
    const updates = { ...request.body }
    delete updates.passwordHash
    if (request.authUser?.role !== 'admin') delete updates.role
    const user = await User.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true })
    if (!user) return response.status(404).json({ error: 'User not found' })
    response.json(user)
  } catch (error) {
    response.status(400).json({ error: 'Unable to update user', details: String(error) })
  }
})

router.delete('/:id', authenticate, requireRole('admin'), async (request, response) => {
  try {
    const user = await User.findByIdAndDelete(request.params.id)
    if (!user) return response.status(404).json({ error: 'User not found' })
    response.status(204).send()
  } catch (error) {
    response.status(400).json({ error: 'Unable to delete user', details: String(error) })
  }
})

export default router