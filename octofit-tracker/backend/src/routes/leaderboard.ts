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

export default router