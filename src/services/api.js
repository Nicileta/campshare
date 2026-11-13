const endpoint = '/api/resources'

async function request(path = '', options) {
  const response = await fetch(`${endpoint}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  if (response.status === 204) return null
  return response.json()
}

export function getResources() {
  return request()
}

export function createResource(resource) {
  return request('', { method: 'POST', body: JSON.stringify(resource) })
}

export function updateResource(id, changes) {
  return request(`/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
}

export function deleteResource(id) {
  return request(`/${id}`, { method: 'DELETE' })
}