import { Router } from 'express'
import Team from '../models/Team.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await Team.find().populate('members', 'name email avatar').sort({ totalPoints: -1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load teams', details: String(error) })
  }
})

router.post('/', async (request, response) => {
  try {
    response.status(201).json(await Team.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create team', details: String(error) })
  }
})

export default router