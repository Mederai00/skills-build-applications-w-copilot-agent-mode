import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { jwtSecret } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (request, response) => {
  const email = String(request.body.email ?? '').trim().toLowerCase()
  const password = String(request.body.password ?? '')
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ error: 'Invalid email or password' })
  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '8h' })
  response.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

export default router