type TextFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  inputMode?: 'numeric' | 'text'
}

export function TextField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  inputMode = 'numeric',
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="mt-6">
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        className="mt-2 w-full min-h-12 border-2 border-line bg-card px-3 py-2 text-ink"
        value={value}
        inputMode={inputMode}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
