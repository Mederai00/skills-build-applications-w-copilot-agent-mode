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