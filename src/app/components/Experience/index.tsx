"use client"

import './Experience.scss'
import React from 'react'

export interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string[];
  companyLink?: string;
  /** Stack of tech used in this role, e.g. ['TypeScript', 'Temporal', 'Kafka'] */
  technologies?: string[];
  /** Earlier titles held at the same company, oldest last. Rendered under the current title. */
  previousPositions?: string[];
}

type ExperienceProps = {
  experienceList: ExperienceItem[];
  isMobile?: boolean;
  sectionNumber?: string;
  numberPosition?: 'left' | 'right';
}

/** "Sept 2025" -> "2025". Falls back to the raw string if no year is present. */
const toYear = (value?: string) => {
  if (!value) return '';
  const match = value.match(/\d{4}/);
  return match ? match[0] : value;
};

const formatRange = (startDate: string, endDate?: string) => {
  const start = toYear(startDate);
  const end = endDate ? toYear(endDate) : 'Present';
  return start === end ? start : `${start} — ${end}`;
};

export default function ExperienceComponent({
  experienceList,
  isMobile = false,
  sectionNumber = '02',
  numberPosition = 'right',
}: ExperienceProps) {

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
          <h1 className="experience__title">Where I&apos;ve Worked</h1>
          {isMobile && (
            <span className="experience__title-number">{sectionNumber}</span>
          )}
        </div>

        {/* Experience Items */}
        {experienceList.length > 0 ? (
          <ol className="experience__list">
            {experienceList.map((exp, index) => (
              <li className="experience__item" key={`${exp.company}-${exp.position}-${index}`}>
                <div className="experience__rail">
                  <span className="experience__node" aria-hidden="true" />
                  <span className="experience__years">
                    {formatRange(exp.startDate, exp.endDate)}
                  </span>
                </div>

                <div className="experience__body">
                  <h2 className="experience__role">
                    {exp.companyLink ? (
                      <a
                        href={exp.companyLink}
                        className="experience__link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="experience__position">{exp.position}</span>
                        <span className="experience__separator" aria-hidden="true">·</span>
                        <span className="experience__company">{exp.company}</span>
                        <svg
                          className="experience__arrow"
                          viewBox="0 0 14 14"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M3 11L11 3M11 3H4.5M11 3V9.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    ) : (
                      <>
                        <span className="experience__position">{exp.position}</span>
                        <span className="experience__separator" aria-hidden="true">·</span>
                        <span className="experience__company">{exp.company}</span>
                      </>
                    )}
                  </h2>

                  {exp.previousPositions && exp.previousPositions.length > 0 && (
                    <div className="experience__previous">
                      {exp.previousPositions.map((title) => (
                        <span className="experience__previous-title" key={title}>{title}</span>
                      ))}
                    </div>
                  )}

                  {/* Full dates, kept for the detail the year rail drops */}
                  <span className="experience__duration">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>

                  <ul className="experience__description">
                    {exp.description.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <ul className="experience__tags" aria-label={`Technologies used at ${exp.company}`}>
                      {exp.technologies.map((tech) => (
                        <li className="experience__tag" key={tech}>{tech}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="experience__empty">Nothing here yet.</p>
        )}
      </div>
    </div>
  )
}