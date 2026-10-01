import { useState } from 'react'

const TITLE_MAX = 200
const DESCRIPTION_MAX = 1000

// Returns an error message, or null if the values are valid.
// Mirrors the rules in the API's TodoRequest so users get instant feedback.
function validate(title, description) {
  if (title.trim() === '') return 'Title is required.'
  if (title.trim().length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer.`
  if (description.trim().length > DESCRIPTION_MAX) {
    return `Description must be ${DESCRIPTION_MAX} characters or fewer.`
  }
  return null
}

// Used both to add a new TODO and to edit an existing one.
//  - onSubmit: async function receiving { title, description }; may throw.
//  - onCancel: optional; shows a Cancel button (used in edit mode).
//  - clearOnSubmit: empty the fields after a successful submit (add mode).
export default function TodoForm({
  initialTitle = '',
  initialDescription = '',
  submitLabel,
  onSubmit,
  onCancel,
  clearOnSubmit = false,
}) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault() // stop the browser from reloading the page

    const validationError = validate(title, description)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || null })
      if (clearOnSubmit) {
        setTitle('')
        setDescription('')
      }
    } catch (submitError) {
      setError(submitError.message) // e.g. server validation or connection error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span className="label-text">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          placeholder="What needs to be done?"
          aria-invalid={error ? 'true' : 'false'}
        />
      </label>

      <label>
        <span className="label-text">Description (optional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={DESCRIPTION_MAX}
          rows={2}
          placeholder="Add some details"
        />
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
