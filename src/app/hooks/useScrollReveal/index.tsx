"use client"

import { useEffect, useRef, useState } from 'react'

type ScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options
  
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])
  
  return { ref, isVisible }
}

// Wrapper component for easy use
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function Reveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up' 
}: RevealProps) {
  const { ref, isVisible } = useScrollReveal()
  
  const directionClass = `reveal--${direction}`
  
  return (
    <div 
      ref={ref}
      className={`reveal ${directionClass} ${isVisible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}