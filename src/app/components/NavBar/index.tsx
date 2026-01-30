"use client"

import './NavBar.scss'
import React, { useState, useEffect, useRef } from 'react'

interface NavItem {
    label: string;
    action: () => void;
    highlight?: boolean;
}

type NavBarProps = {
    items: NavItem[];
    isMobile?: boolean;
}

export default function NavBar({ items, isMobile = false }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;
          
          // Show navbar when scrolling up or at top
          // Hide when scrolling down past threshold
          if (currentScrollY < 50) {
            setIsVisible(true);
          } else if (scrollDelta > 5) {
            setIsVisible(false);
            setIsOpen(false); // Close mobile menu when hiding
          } else if (scrollDelta < -5) {
            setIsVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <nav className={`mobile-navbar ${!isVisible ? 'hidden' : ''}`}>
        <button 
          className={`burger-btn ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          {items.map((item, index) => (
            <button 
              key={index} 
              className="mobile-nav-btn"
              onClick={() => handleItemClick(item.action)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className={`glass-navbar ${!isVisible ? 'hidden' : ''}`}>
      {items.map((item, index) => (
        <button 
          key={index} 
          className={`nav-btn ${item.highlight ? 'highlight' : ''}`} 
          onClick={item?.action ? item.action : () => {}}
        >
          {item.label}
          {item.highlight && <span className="shine"></span>}
        </button>
      ))}
    </nav>
  )
}