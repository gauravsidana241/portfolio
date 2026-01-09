import React, { useState } from 'react';
import './TechStack.scss';

interface Stack {
  [category: string]: string[];
}

type TechStackProps = {
  stack: Stack
}

export default function TechStack({ stack }: TechStackProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section className="techstack">
      <div className="techstack__container">
        <div className="techstack__header">
          <h2 className="techstack__title">Tech Stack</h2>
          <p className="techstack__subtitle">Technologies I work with daily</p>
        </div>

        <div className="techstack__grid">
          {Object.entries(stack).map(([category, techs], index) => (
            <div
              key={category}
              className={`techstack__card ${activeCategory === category ? 'techstack__card--active' : ''}`}
              onMouseEnter={() => setActiveCategory(category)}
              onMouseLeave={() => setActiveCategory(null)}
              style={{ '--card-index': index } as React.CSSProperties}
            >
              <div className="techstack__card-glow" />
              
              <div className="techstack__card-header">
                <h3 className="techstack__card-title">{category}</h3>
              </div>

              <div className="techstack__card-divider" />

              <ul className="techstack__card-list">
                {techs.map((tech, techIndex) => (
                  <li
                    key={tech}
                    className="techstack__card-item"
                    style={{ '--item-index': techIndex } as React.CSSProperties}
                  >
                    <span className="techstack__card-dot" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}