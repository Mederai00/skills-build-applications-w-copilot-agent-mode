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

export default router