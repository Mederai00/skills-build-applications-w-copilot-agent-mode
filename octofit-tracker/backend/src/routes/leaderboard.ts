import { Router } from 'express'
import Leaderboard from '../models/Leaderboard.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await Leaderboard.find().populate('user', 'name email avatar').sort({ rank: 1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load leaderboard', details: String(error) })
  }
})

router.post('/', async (request, response) => {
  try {
    response.status(201).json(await Leaderboard.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create leaderboard entry', details: String(error) })
  }
})

router.put('/:id', async (request, response) => {
  try {
    const entry = await Leaderboard.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
    if (!entry) return response.status(404).json({ error: 'Leaderboard entry not found' })
    response.json(entry)
  } catch (error) {
    response.status(400).json({ error: 'Unable to update leaderboard entry', details: String(error) })
  }
})

router.delete('/:id', async (request, response) => {
  try {
    const entry = await Leaderboard.findByIdAndDelete(request.params.id)
    if (!entry) return response.status(404).json({ error: 'Leaderboard entry not found' })
    response.status(204).send()
  } catch (error) {
    response.status(400).json({ error: 'Unable to delete leaderboard entry', details: String(error) })
  }
})

export default router