import { useState } from 'react'
import TodoForm from './TodoForm'

// Formats an ISO date from the API in the user's own locale and time zone,
// e.g. "29 Sept 2026, 21:33".
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

function formatDate(isoString) {
  return dateFormat.format(new Date(isoString))
}

// One row in the list. Switches between "view" and "edit" mode.
export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <li className="todo-item">
        <TodoForm
          initialTitle={todo.title}
          initialDescription={todo.description ?? ''}
          submitLabel="Save"
          onSubmit={async (values) => {
            await onEdit(todo.id, values) // if this throws, the form shows the error
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className={`todo-item${todo.done ? ' done' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.done ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
      />

      <div className="todo-text">
        <span className="todo-title">{todo.title}</span>
        {todo.description && <p className="todo-description">{todo.description}</p>}
        <p className="todo-meta">
          Created <time dateTime={todo.createdAt}>{formatDate(todo.createdAt)}</time>
          {/* Both dates are equal until the TODO is changed for the first time. */}
          {todo.updatedAt !== todo.createdAt && (
            <>
              {' · '}
              Updated <time dateTime={todo.updatedAt}>{formatDate(todo.updatedAt)}</time>
            </>
          )}
        </p>
      </div>

      <div className="todo-actions">
        <button type="button" className="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button type="button" className="button danger" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}
