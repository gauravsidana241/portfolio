"use client"

import GlassButton from '../GlassButton';
import './Contact.scss'
import React from 'react'

type ContactProps = {
  email?: string;
  isMobile?: boolean;
  sectionNumber?: string;
}

export default function Contact({
  email = "gauravsidana241@gmail.com",
  isMobile = false,
  sectionNumber = "04",
}: ContactProps) {
  
  return (
    <section className="contact-section">
      {/* Section Number */}
      {!isMobile && (
        <div className="contact-section__number">
          <span className="contact-section__number-text">{sectionNumber}</span>
        </div>
      )}
      
      <div className="contact__content">
        {/* Section Label */}
        <p className="contact__label">
          What's Next?
        </p>
        
        {/* Title with mobile number */}
        <div className="contact__header">
          <h2 className="contact__title">Get In Touch</h2>
          {isMobile && (
            <span className="contact__title-number">{sectionNumber}</span>
          )}
        </div>
        
        {/* Description */}
        <p className="contact__description">
          Currently open to new roles and looking for my next big challenge in AI and Development. 
          Whether you have a job opportunity in mind or just want to say hello, I'm only an email away and will get back to you shortly!
        </p>
        
        {/* CTA Button */}
        <GlassButton 
        text="Say Hello" 
        href="mailto:gauravsidana241@gmail.com"
        />
      </div>
    </section>
  )
}