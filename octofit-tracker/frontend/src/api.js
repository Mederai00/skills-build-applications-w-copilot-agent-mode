const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

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
  const response = await fetch(url, { signal })
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
  const response = await fetch(url, { method: 'DELETE' })
  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.error ?? `Request failed with status ${response.status}`)
  }
}

async function sendResource(url, method, payload) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? `Request failed with status ${response.status}`)
  return result
}