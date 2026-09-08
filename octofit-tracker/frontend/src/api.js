const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function currentAuth() {
  try { return JSON.parse(localStorage.getItem('octofit_auth') ?? 'null') } catch { return null }
}

export function setAuth(auth) {
  localStorage.setItem('octofit_auth', JSON.stringify(auth))
  window.dispatchEvent(new Event('octofit-auth-change'))
}

export function clearAuth() {
  localStorage.removeItem('octofit_auth')
  window.dispatchEvent(new Event('octofit-auth-change'))
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? 'Unable to sign in')
  setAuth(result)
  return result
}

export function collectionFromResponse(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.results)) return payload.results
  return []
}

export async function fetchCollection(endpoint, signal) {
  return fetchFromUrl(`${API_BASE_URL}/api/${endpoint}/`, signal)
}

export async function fetchFromUrl(url, signal) {
  const response = await fetch(url, { signal, headers: authHeaders() })
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return collectionFromResponse(await response.json())
}

export async function createResource(url, payload) {
  return sendResource(url, 'POST', payload)
}

export async function updateResource(url, payload) {
  return sendResource(url, 'PUT', payload)
}

export async function deleteResource(url) {
  const response = await fetch(url, { headers: authHeaders(), method: 'DELETE' })
  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.error ?? `Request failed with status ${response.status}`)
  }
}

async function sendResource(url, method, payload) {
  const response = await fetch(url, {
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    method,
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? `Request failed with status ${response.status}`)
  return result
}

function authHeaders() {
  const auth = currentAuth()
  return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}
}