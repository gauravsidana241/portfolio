"use client"

import "./ProjectScroller.scss"
import { useState, useEffect, useCallback } from "react"

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
}

type ProjectScrollerProps = {
  projects: Project[];
  autoRotateInterval?: number;
}

export default function ProjectScroller({ 
  projects, 
  autoRotateInterval = 10000 
}: ProjectScrollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)

  const displayedProjects = projects.slice(0, 6)
  const currentProject = displayedProjects[currentIndex]
  
  // Create grid cells - 3 columns x 2 rows = 6 cells max
  const techStack = currentProject?.techStack || []
  const gridCells = Array.from({ length: 6 }, (_, i) => techStack[i] || null)

  // Get row from cell index (0-2 = row 0, 3-5 = row 1)
  const getRow = (index: number) => Math.floor(index / 3)

  // Navigate to specific project
  const goToProject = useCallback((index: number) => {
    if (index === currentIndex || isTransitioning) return
    setIsTransitioning(true)
    setHoveredCell(null)
    
    setTimeout(() => {
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 400)
    }, 300)
  }, [currentIndex, isTransitioning])

  // Auto-rotate timer
  useEffect(() => {
    if (displayedProjects.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setHoveredCell(null)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % displayedProjects.length)
        setTimeout(() => setIsTransitioning(false), 400)
      }, 300)
    }, autoRotateInterval)

    return () => clearInterval(timer)
  }, [displayedProjects.length, autoRotateInterval])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToProject((currentIndex - 1 + displayedProjects.length) % displayedProjects.length)
      } else if (e.key === 'ArrowRight') {
        goToProject((currentIndex + 1) % displayedProjects.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, displayedProjects.length, goToProject])

  return (
    <div className="project-showcase">
      <div className="showcase-belt">
        {/* Left side - Glass section with project info */}
        <div className="info-section">
          <div className={`info-content ${isTransitioning ? 'transitioning' : ''}`}>
            <span className="project-number">
              {String(currentIndex + 1).padStart(2, '0')} / {String(displayedProjects.length).padStart(2, '0')}
            </span>
            
            <h2 className="project-title">{currentProject?.title}</h2>
            
            <p className="project-description">{currentProject?.description}</p>
            
            <div className="project-links">
              {currentProject?.demoUrl && (
                <a 
                  href={currentProject.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link demo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </a>
              )}
              {currentProject?.repoUrl && (
                <a 
                  href={currentProject.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link repo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="nav-dots">
            {displayedProjects.map((_, idx) => (
              <button
                key={idx}
                className={`nav-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToProject(idx)}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right side - Black grid section */}
        <div className="grid-section">
          <div className={`tech-grid ${isTransitioning ? 'transitioning' : ''}`}>
            {/* Row 1 */}
            <div 
              className="grid-row"
              onMouseLeave={() => setHoveredCell(null)}
            >
              {gridCells.slice(0, 3).map((tech, idx) => (
                <div 
                  key={idx}
                  className={`grid-cell ${tech ? 'has-content' : 'empty'}`}
                  onMouseEnter={() => tech && setHoveredCell(idx)}
                >
                  {tech && <span className="tech-name">{tech}</span>}
                </div>
              ))}
              
              {/* Expanded overlay for row 1 */}
              <div 
                className={`row-expand ${hoveredCell !== null && getRow(hoveredCell) === 0 ? 'active' : ''}`}
              >
                <span className="expanded-tech-name">
                  {hoveredCell !== null && getRow(hoveredCell) === 0 ? gridCells[hoveredCell] : ''}
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div 
              className="grid-row"
              onMouseLeave={() => setHoveredCell(null)}
            >
              {gridCells.slice(3, 6).map((tech, idx) => (
                <div 
                  key={idx + 3}
                  className={`grid-cell ${tech ? 'has-content' : 'empty'}`}
                  onMouseEnter={() => tech && setHoveredCell(idx + 3)}
                >
                  {tech && <span className="tech-name">{tech}</span>}
                </div>
              ))}
              
              {/* Expanded overlay for row 2 */}
              <div 
                className={`row-expand ${hoveredCell !== null && getRow(hoveredCell) === 1 ? 'active' : ''}`}
              >
                <span className="expanded-tech-name">
                  {hoveredCell !== null && getRow(hoveredCell) === 1 ? gridCells[hoveredCell] : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}