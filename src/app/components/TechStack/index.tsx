"use client"

import "./TechStack.scss"
import { useState, useEffect, useCallback } from "react"

interface TechStackProps {
  stack: Record<string, string[]>;
  autoScrollInterval?: number;
}

export default function TechStack({ 
  stack, 
  autoScrollInterval = 4000 
}: TechStackProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayedText, setDisplayedText] = useState<string[]>([])
  
  const sections = Object.entries(stack)
  const currentSectionData = sections[currentSection]
  const sectionTitle = currentSectionData?.[0] || ""
  const sectionTechs = currentSectionData?.[1] || []

  // Typing effect for tech items
  useEffect(() => {
    setDisplayedText([])
    
    const timers: NodeJS.Timeout[] = []
    
    sectionTechs.forEach((tech, index) => {
      const timer = setTimeout(() => {
        setDisplayedText(prev => [...prev, tech])
      }, index * 120)
      timers.push(timer)
    })
    
    return () => timers.forEach(t => clearTimeout(t))
  }, [currentSection, sectionTechs])

  // Auto-scroll sections
  useEffect(() => {
    if (sections.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSection(prev => (prev + 1) % sections.length)
        setTimeout(() => setIsTransitioning(false), 100)
      }, 300)
    }, autoScrollInterval)

    return () => clearInterval(timer)
  }, [sections.length, autoScrollInterval])

  // Navigate to section
  const goToSection = useCallback((index: number) => {
    if (index === currentSection || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSection(index)
      setTimeout(() => setIsTransitioning(false), 100)
    }, 300)
  }, [currentSection, isTransitioning])

  return (
    <div className="tech-stack">
      <div className="terminal-container">
        {/* Subtle noise overlay */}
        <div className="noise-overlay" />
        
        {/* Header bar */}
        <div className="terminal-header">
          <div className="header-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <span className="header-title">~/.skills</span>
        </div>
        
        {/* Terminal content */}
        <div className="terminal-content">
          {/* Command line with section */}
          <div className={`command-line ${isTransitioning ? 'transitioning' : ''}`}>
            <span className="prompt">$</span>
            <span className="command">cat</span>
            <span className="path">{sectionTitle}.json</span>
          </div>
          
          {/* Output - Tech grid */}
          <div className={`output-block ${isTransitioning ? 'transitioning' : ''}`}>
            <span className="bracket">[</span>
            <div className="tech-list">
              {displayedText.map((tech, i) => (
                <span 
                  key={`${currentSection}-${i}`}
                  className="tech-item"
                >
                  "{tech}"{i < sectionTechs.length - 1 ? ',' : ''}
                </span>
              ))}
              {displayedText.length < sectionTechs.length && (
                <span className="cursor" />
              )}
            </div>
            <span className="bracket">]</span>
          </div>
        </div>
        
        {/* Footer navigation */}
        <div className="terminal-footer">
          {sections.map(([name], idx) => (
            <button
              key={name}
              className={`tab ${idx === currentSection ? 'active' : ''}`}
              onClick={() => goToSection(idx)}
            >
              <span className="tab-index">{idx + 1}</span>
              <span className="tab-name">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}