"use client"

import React from 'react'
import './About.scss'

// Tech categories with items
const TECHNOLOGIES = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript']

interface AboutProps {
  isMobile?: boolean;
  sectionNumber?: string;
  numberPosition?: 'left' | 'right';
}

export default function About({ 
  isMobile = false, 
  sectionNumber = '01',
  numberPosition = 'left' 
}: AboutProps) {
  return (
    <div className={`about-section ${numberPosition === 'right' ? 'about-section--number-right' : ''}`}>
      {/* Section Number - positioned in margin */}
      {!isMobile && (
        <div className={`about-section__number about-section__number--${numberPosition}`}>
          <span className="about-section__number-text">{sectionNumber}</span>
        </div>
      )}
      
      {/* Main Content - Centered */}
      <div className="about-section__content">
        {/* Title with mobile number */}
        <div className="about__header">
          <h1 className="about__title">About Me</h1>
          {isMobile && (
            <span className="about__title-number">{sectionNumber}</span>
          )}
        </div>
        
        {/* Story Section */}
        <div className="about__story">
          <p>
            I'm a <strong>Full Stack Developer</strong> with a deep fascination for building 
            systems that scale. My journey started with curiosity about how things work 
            under the hood—now I spend my days architecting distributed pipelines and 
            crafting interfaces that feel alive.
          </p>
          
          <p>
            Currently pursuing my <strong>Master's in Computing Science</strong> at the 
            <a href="https://www.gla.ac.uk/" target="_blank" rel="noopener noreferrer"> University of Glasgow</a>, 
            specializing in AI and Machine Learning. Before this, I spent two years at 
            <a href="https://www.fynd.com/" target="_blank" rel="noopener noreferrer"> Fynd (Shopsense Retail)</a> where 
            I led the architectural overhaul of marketplace integrations—migrating from 
            siloed applications to a unified platform orchestrated by Temporal workflows.
          </p>
          
          <p>
            I thrive at the intersection of <strong>complex backend systems</strong> and 
            <strong> polished user experiences</strong>. Whether it's designing event-driven 
            architectures with Kafka, implementing distributed tracing with OpenTelemetry, 
            or obsessing over the micro-interactions of a 3D interface—I believe great 
            software is built with intention at every layer.
          </p>
          
          <p>
            When I'm not coding, you'll find me exploring the latest in AI research, 
            experimenting with creative coding, or diving deep into system design rabbit holes.
          </p>
        </div>

        {/* Technologies Section */}
        <div className="about__tech">
          <h3 className="about__tech-title">Technologies I've been working with</h3>
          
          <div className="about__tech-grid">
            {TECHNOLOGIES.map((item) => (
              <div key={item} className="about__tech-item">
                <span className="about__tech-bullet" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}