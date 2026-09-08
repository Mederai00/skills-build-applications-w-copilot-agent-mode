import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from './app.js'

describe('API routes', () => {
  it('reports API health and its base URL', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
    expect(response.body.apiBaseUrl).toMatch(/8000/)
  })

  it('allows the configured frontend origin through CORS', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173')

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })

  it('rejects protected writes without a bearer token', async () => {
    const response = await request(app)
      .post('/api/activities')
      .send({ type: 'Running' })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Authentication required')
  })
})