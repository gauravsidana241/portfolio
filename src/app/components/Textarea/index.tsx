import './Textarea.scss'
import React from 'react'
import classNames from 'classnames'

type TextareaProps = {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  error?: string
  className?: string
  rows?: number
}

export default function Textarea({
  label,
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error,
  className,
  rows = 4
}: TextareaProps) {
  return (
    <div className="textarea-wrapper">
      {label && <label>{label}</label>}
      <textarea
        className={classNames('textarea', className)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
      />
      {error && <div className="error">{error}</div>}
    </div>
  )
}
