import { Router } from 'express'
import Activity from '../models/Activity.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_request, response) => {
  try {
    response.json(await Activity.find().populate('user', 'name email avatar').sort({ completedAt: -1 }))
  } catch (error) {
    response.status(500).json({ error: 'Unable to load activities', details: String(error) })
  }
})

router.post('/', authenticate, async (request, response) => {
  try {
    response.status(201).json(await Activity.create(request.body))
  } catch (error) {
    response.status(400).json({ error: 'Unable to create activity', details: String(error) })
  }
})

router.put('/:id', authenticate, async (request, response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
    if (!activity) return response.status(404).json({ error: 'Activity not found' })
    response.json(activity)
  } catch (error) {
    response.status(400).json({ error: 'Unable to update activity', details: String(error) })
  }
})

router.delete('/:id', authenticate, requireRole('admin'), async (request, response) => {
  try {
    const activity = await Activity.findByIdAndDelete(request.params.id)
    if (!activity) return response.status(404).json({ error: 'Activity not found' })
    response.status(204).send()
  } catch (error) {
    response.status(400).json({ error: 'Unable to delete activity', details: String(error) })
  }
})

export default router