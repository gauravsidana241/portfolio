import './Input.scss'
import React from 'react'
import classNames from 'classnames'

type InputProps = {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  disabled?: boolean
  error?: string
  className?: string
}

export default function Input({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  disabled = false,
  error,
  className,
}: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <input
        className={classNames('input', className)}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <div className="error">{error}</div>}
    </div>
  )
}
