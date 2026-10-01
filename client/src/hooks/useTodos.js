import { useEffect, useState } from 'react'
import * as api from '../api/todos'

// A custom hook: keeps the list of TODOs in state and exposes the actions
// that change it. Components call these functions and never touch the API.
export function useTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null) // the list could not be loaded
  const [actionError, setActionError] = useState(null) // a toggle/delete failed

  // State is only updated inside the callbacks, i.e. after the response arrives.
  function fetchTodos() {
    return api
      .getTodos()
      .then((data) => {
        setTodos(data)
        setLoadError(null)
      })
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }

  // Load the list once, when the page first opens (isLoading starts as true).
  useEffect(() => {
    fetchTodos()
  }, [])

  // Used by the "Try again" button after a failed load.
  function reload() {
    setIsLoading(true)
    setLoadError(null)
    fetchTodos()
  }

  // Create and edit wait for the server, because the server assigns the id
  // and may reject the input. Errors are re-thrown so the form can show them.
  async function addTodo(values) {
    const created = await api.createTodo(values)
    setTodos((current) => [created, ...current])
  }

  async function editTodo(id, values) {
    const updated = await api.updateTodo(id, values)
    setTodos((current) => current.map((t) => (t.id === id ? updated : t)))
  }

  // Toggle and delete are "optimistic": the screen updates immediately,
  // then we call the API. If the call fails, we undo the change.
  async function toggleTodo(id) {
    setActionError(null)
    const flip = (current) => current.map((t) => (t.id === id ? { ...t, done: !t.done } : t))

    setTodos(flip)
    try {
      const updated = await api.toggleTodoDone(id)
      setTodos((current) => current.map((t) => (t.id === id ? updated : t)))
    } catch (error) {
      setTodos(flip) // flip back
      setActionError(error.message)
    }
  }

  async function removeTodo(id) {
    setActionError(null)
    const removed = todos.find((t) => t.id === id)

    setTodos((current) => current.filter((t) => t.id !== id))
    try {
      await api.deleteTodo(id)
    } catch (error) {
      // Put it back in its original position (the list is sorted newest first).
      setTodos((current) => [...current, removed].sort((a, b) => b.id - a.id))
      setActionError(error.message)
    }
  }

  return {
    todos,
    isLoading,
    loadError,
    actionError,
    clearActionError: () => setActionError(null),
    reload,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
  }
}
