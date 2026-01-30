"use client"

import './GlassButton.scss'
import React from 'react'

type GlassButtonProps = {
  text: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export default function GlassButton({
  text,
  icon,
  href,
  onClick,
  iconPosition = 'left',
  className = '',
}: GlassButtonProps) {
  
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="glass-btn__icon">{icon}</span>}
      <span className="glass-btn__text">{text}</span>
      {icon && iconPosition === 'right' && <span className="glass-btn__icon">{icon}</span>}
    </>
  )
  
  if (href) {
    return (
      <a 
        href={href}
        className={`glass-btn ${className}`}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }
  
  return (
    <button 
      className={`glass-btn ${className}`}
      onClick={onClick}
    >
      {content}
    </button>
  )
}