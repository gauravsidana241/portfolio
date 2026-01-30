"use client"

import './Experience.scss'
import React, { useState, useMemo } from 'react'

export interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string[];
  companyLink?: string;
}

type ExperienceProps = {
  experienceList: ExperienceItem[];
  isMobile?: boolean;
  sectionNumber?: string;
  numberPosition?: 'left' | 'right';
}

export default function ExperienceComponent({
  experienceList,
  isMobile = false,
  sectionNumber = '02',
  numberPosition = 'right',
}: ExperienceProps) {
  
  // Extract unique start years from experience list
  const years = useMemo(() => {
    const uniqueYears = [...new Set(
      experienceList.map(exp => {
        // Extract year from startDate (e.g., "Sept 2025" -> "2025")
        const match = exp.startDate.match(/\d{4}/);
        return match ? match[0] : '';
      }).filter(Boolean)
    )].sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending (newest first)
    
    return uniqueYears;
  }, [experienceList]);
  
  // Default to the latest year (first in sorted array)
  const [activeFilter, setActiveFilter] = useState<string>(years[0] || '');
  
  const filteredExperience = experienceList.filter(exp => exp.startDate.includes(activeFilter));

  return (
    <div className={`experience-section-wrapper ${numberPosition === 'right' ? 'experience-section-wrapper--number-right' : ''}`}>
      {/* Section Number - Desktop only */}
      {!isMobile && (
        <div className={`experience-section__number experience-section__number--${numberPosition}`}>
          <span className="experience-section__number-text">{sectionNumber}</span>
        </div>
      )}
      
      {/* Main Content */}
      <div className="experience-section__content">
        {/* Header with Title and Mobile Number */}
        <div className="experience__header">
          <h1 className="experience__title">Where I've Worked</h1>
          {isMobile && (
            <span className="experience__title-number">{sectionNumber}</span>
          )}
        </div>
        
        {/* Filter Tabs - Text only with underline */}
        <div className="experience__tabs">
          <div className="experience__tabs-list">
            {years.map((year) => (
              <button
                key={year}
                className={`experience__tab ${activeFilter === year ? 'experience__tab--active' : ''}`}
                onClick={() => setActiveFilter(year)}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="experience__tabs-line"></div>
        </div>
        
        {/* Experience Items */}
        <div className="experience__list">
          {filteredExperience.map((exp, index) => (
            <div className="experience__item" key={index}>
              <h2 className="experience__role">{exp.position}</h2>
              
              <div className="experience__meta">
                <a 
                  href={exp.companyLink || '#'} 
                  className="experience__company"
                  target="_blank" 
                  rel="noreferrer"
                >
                  {exp.company}
                </a>
                <span className="experience__duration">
                  {exp.startDate} – {exp.endDate || 'Present'}
                </span>
              </div>

              <ul className="experience__description">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
          
          {filteredExperience.length === 0 && (
            <p className="experience__empty">No experience for {activeFilter}.</p>
          )}
        </div>
      </div>
    </div>
  )
}