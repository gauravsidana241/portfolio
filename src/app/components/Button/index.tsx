import './Button.scss'
import React from 'react'
import classNames from 'classnames'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className
}: ButtonProps) {
  const buttonClass = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    { 'button--disabled': disabled },
    className
  )

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
