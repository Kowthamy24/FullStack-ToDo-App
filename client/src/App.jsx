import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'

export default function App() {
  const {
    todos,
    isLoading,
    loadError,
    actionError,
    clearActionError,
    reload,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
  } = useTodos()

  return (
    <main className="app">
      <h1>TODO App</h1>

      <section className="card">
        <TodoForm submitLabel="Add TODO" onSubmit={addTodo} clearOnSubmit />
      </section>

      {actionError && (
        <div className="banner error" role="alert">
          <span>{actionError}</span>
          <button type="button" className="button" onClick={clearActionError}>
            Dismiss
          </button>
        </div>
      )}

      <section className="card">
        {isLoading ? (
          <p className="status">Loading TODOs…</p>
        ) : loadError ? (
          <div className="status">
            <p className="form-error">{loadError}</p>
            <button type="button" className="button" onClick={reload}>
              Try again
            </button>
          </div>
        ) : (
          <TodoList todos={todos} onToggle={toggleTodo} onEdit={editTodo} onDelete={removeTodo} />
        )}
      </section>
    </main>
  )
}
