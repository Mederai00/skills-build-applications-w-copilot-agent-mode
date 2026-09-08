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

export default router