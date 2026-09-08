import { Router } from 'express'
import User from '../models/User.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await User.find().sort({ totalPoints: -1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load users', details: String(error) })
  }
})

router.post('/', async (request, response) => {
  try {
    response.status(201).json(await User.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create user', details: String(error) })
  }
})

router.put('/:id', async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
    if (!user) return response.status(404).json({ error: 'User not found' })
    response.json(user)
  } catch (error) {
    response.status(400).json({ error: 'Unable to update user', details: String(error) })
  }
})

router.delete('/:id', async (request, response) => {
  try {
    const user = await User.findByIdAndDelete(request.params.id)
    if (!user) return response.status(404).json({ error: 'User not found' })
    response.status(204).send()
  } catch (error) {
    response.status(400).json({ error: 'Unable to delete user', details: String(error) })
  }
})

export default router