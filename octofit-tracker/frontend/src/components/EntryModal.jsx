import { useState } from 'react'

function EntryModal({ fields, initialValues: providedValues, onClose, onSubmit, title }) {
  const initialValues = Object.fromEntries(fields.map((field) => [field.name, providedValues?.[field.name] ?? field.defaultValue ?? '']))
  const [values, setValues] = useState(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submitForm(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(values)
      onClose()
    } catch (reason) {
      setError(reason.message)
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div aria-labelledby="entry-modal-title" aria-modal="true" className="entry-modal" role="dialog">
      <div className="modal-heading"><div><p className="eyebrow">{providedValues ? 'EDIT ENTRY' : 'NEW ENTRY'}</p><h2 id="entry-modal-title">{title}</h2></div><button aria-label="Close form" className="modal-close" onClick={onClose} type="button">×</button></div>
      <form onSubmit={submitForm}>
        <div className="modal-fields">{fields.map((field) => <label key={field.name}>{field.label}<input autoComplete="off" name={field.name} onChange={updateValue} placeholder={field.placeholder} required={field.required !== false} type={field.type ?? 'text'} value={values[field.name]} /></label>)}</div>
        {error && <p className="error-state">{error}</p>}
        <div className="modal-actions"><button className="btn btn-outline-dark rounded-0" onClick={onClose} type="button">Cancel</button><button className="btn btn-dark rounded-0" disabled={submitting} type="submit">{submitting ? 'Saving...' : providedValues ? 'Update entry' : 'Save entry'}</button></div>
      </form>
    </div>
  </div>
}

export default EntryModal