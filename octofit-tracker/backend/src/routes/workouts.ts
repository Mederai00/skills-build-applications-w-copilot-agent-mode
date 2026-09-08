import { Router } from 'express'
import Workout from '../models/Workout.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await Workout.find().sort({ createdAt: -1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load workouts', details: String(error) })
  }
})

router.post('/', async (request, response) => {
  try {
    response.status(201).json(await Workout.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create workout', details: String(error) })
  }
})

router.put('/:id', async (request, response) => {
  try {
    const workout = await Workout.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
    if (!workout) return response.status(404).json({ error: 'Workout not found' })
    response.json(workout)
  } catch (error) {
    response.status(400).json({ error: 'Unable to update workout', details: String(error) })
  }
})

router.delete('/:id', async (request, response) => {
  try {
    const workout = await Workout.findByIdAndDelete(request.params.id)
    if (!workout) return response.status(404).json({ error: 'Workout not found' })
    response.status(204).send()
  } catch (error) {
    response.status(400).json({ error: 'Unable to delete workout', details: String(error) })
  }
})

export default router