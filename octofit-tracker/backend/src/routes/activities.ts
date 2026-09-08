import { Router } from 'express'
import Activity from '../models/Activity.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await Activity.find().populate('user', 'name email avatar').sort({ completedAt: -1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load activities', details: String(error) })
  }
})

router.post('/', async (request, response) => {
  try {
    response.status(201).json(await Activity.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create activity', details: String(error) })
  }
})

export default router