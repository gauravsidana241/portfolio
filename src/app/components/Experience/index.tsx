import './Experience.scss'
import React from 'react'

export interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string[];
  companyLink?: string;
}

type ExperienceProps = {
  children?: React.ReactNode;
  experienceList: ExperienceItem[];
}

export default function ExperienceComponent({
  experienceList,
  children,
}: ExperienceProps) {
  
  return (
    <div className="experience-container">
      <div className="experience-scroll-wrapper">
        {experienceList.map((exp, index) => (
          <div className="experience-section" key={index}>
            
            {/* Left Timeline */}
            <div className="timeline-col">
              <div className="timeline-dot"></div>
              {/* Only show line if it's not the last item, or show fade out */}
              <div className="timeline-line"></div>
            </div>
            
            {/* Right Content Card */}
            <div className="content-col">
              <h2 className="role-title">{exp.position}</h2>
              
              <div className="company-info">
                <a 
                  href={exp.companyLink || '#'} 
                  className="company-name"
                  target="_blank" 
                  rel="noreferrer"
                >
                  {exp.company}
                </a>
                <span className="duration">
                  {exp.startDate} – {exp.endDate || 'Current'}
                </span>
              </div>

              <ul className="description-list">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {children}
      </div>
    </div>
  )
}