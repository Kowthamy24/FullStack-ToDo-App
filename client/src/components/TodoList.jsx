import TodoItem from './TodoItem'

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return <p className="status">No TODOs yet. Add your first one above.</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        // "key" lets React track each row between renders.
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}
