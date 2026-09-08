import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export type AuthUser = { id: string; role: 'user' | 'admin' }

declare global {
  namespace Express {
    interface Request { authUser?: AuthUser }
  }
}

const jwtSecret = process.env.JWT_SECRET ?? 'octofit-development-secret'

export function authenticate(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.slice(7)
    : undefined
  if (!token) return response.status(401).json({ error: 'Authentication required' })
  try {
    request.authUser = jwt.verify(token, jwtSecret) as AuthUser
    next()
  } catch {
    response.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: AuthUser['role'][]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.authUser || !roles.includes(request.authUser.role)) return response.status(403).json({ error: 'Insufficient permissions' })
    next()
  }
}

export { jwtSecret }