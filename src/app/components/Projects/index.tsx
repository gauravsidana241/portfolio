"use client"

import './Projects.scss'
import React from 'react'
import { FolderIcon, GithubIcon, ExternalLinkIcon } from '../Icons'
import GlassButton from '../GlassButton';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
}

type ProjectsProps = {
  projects: Project[];
  isMobile?: boolean;
  sectionNumber?: string;
  numberPosition?: 'left' | 'right';
}

export default function Projects({
  projects,
  isMobile = false,
  sectionNumber = '03',
  numberPosition = 'left',
}: ProjectsProps) {
  
  return (
    <div className={`projects-section-wrapper ${numberPosition === 'right' ? 'projects-section-wrapper--number-right' : ''}`}>
      {/* Section Number - Desktop only */}
      {!isMobile && (
        <div className={`projects-section__number projects-section__number--${numberPosition}`}>
          <span className="projects-section__number-text">{sectionNumber}</span>
        </div>
      )}
      
      {/* Main Content */}
      <div className="projects-section__content">
        {/* Header */}
        <div className="projects__header">
          <h1 className="projects__title">Recent Projects</h1>
          {isMobile && (
            <span className="projects__title-number">{sectionNumber}</span>
          )}
        </div>
        
        {/* Projects Grid */}
        <div className="projects__grid">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              {/* Card Header - Folder icon and links */}
              <div className="project-card__header">
                <FolderIcon size={40} className="project-card__folder" />
                <div className="project-card__links">
                  {project.repoUrl && (
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-card__link"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon size={20} />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-card__link"
                      aria-label="Live Demo"
                    >
                      <ExternalLinkIcon size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="project-card__body">
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__description">{project.description}</p>
              </div>
              
              {/* Card Footer - Tech stack */}
              <div className="project-card__footer">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="project-card__tech">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* View Archive Button */}
        <div className="projects__footer">
          <GlassButton 
            text="View Full Archive" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>} 
            iconPosition="right"
            href="https://github.com/gauravsidana241?tab=repositories"
          />
        </div>
      </div>
    </div>
  )
}