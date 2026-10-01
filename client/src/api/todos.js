// All HTTP calls to the backend live here, one function per endpoint.
// Components never call fetch directly.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5167'
const TODOS_URL = `${API_URL}/api/todos`

// Sends a request and returns the parsed JSON body.
// Throws an Error with a user-friendly message if anything goes wrong.
async function request(url, options = {}) {
  let response
  try {
    response = await fetch(url, {
      ...options,
      // Only requests with a JSON body need this header.
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch {
    // fetch only throws when the server can't be reached at all.
    throw new Error('Could not reach the server. Is the API running?')
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  // 204 No Content (DELETE) has no body to parse.
  return response.status === 204 ? null : response.json()
}

// The API returns errors as ProblemDetails JSON, e.g.
// { "title": "...", "errors": { "Title": ["Title is required."] } }
async function getErrorMessage(response) {
  if (response.status === 404) {
    return 'This TODO no longer exists. It may have been deleted.'
  }

  try {
    const problem = await response.json()
    if (problem.errors) {
      return Object.values(problem.errors).flat().join(' ')
    }
    if (problem.title) {
      return problem.title
    }
  } catch {
    // Body was not JSON; fall through to the generic message.
  }

  return `Something went wrong (HTTP ${response.status}). Please try again.`
}

export function getTodos() {
  return request(TODOS_URL)
}

export function createTodo({ title, description }) {
  return request(TODOS_URL, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  })
}

export function updateTodo(id, { title, description }) {
  return request(`${TODOS_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description }),
  })
}

export function toggleTodoDone(id) {
  return request(`${TODOS_URL}/${id}/done`, { method: 'PATCH' })
}

export function deleteTodo(id) {
  return request(`${TODOS_URL}/${id}`, { method: 'DELETE' })
}
