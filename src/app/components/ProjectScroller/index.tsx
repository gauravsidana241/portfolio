"use client"

import "./ProjectScroller.scss"
import { useRef } from "react"

interface Project {
  id?: number;
  title: string;
  image: string;
}

type ProjectScrollerProps = {
  children?: React.ReactNode,
  projects?: Project[],
}

export default function ProjectScroller({projects}: ProjectScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = 320;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="project-scroller-wrapper">
      <button className="scroll-arrow left" onClick={() => scroll('left')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="project-scroller">
        <div className="scroller-track" ref={trackRef}>
          {(projects || []).map((project) => (
            <div key={project.id} className="project-card">
              <div className="card-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="card-title">{project.title}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="scroll-arrow right" onClick={() => scroll('right')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}