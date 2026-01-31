"use client"

import './Footer.scss'
import { GithubIcon, LinkedinIcon, MailIcon } from '../Icons'

type FooterProps = {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function Footer({
  email = "gauravsidana241@gmail.com",
  githubUrl = "https://github.com/gauravsidana241",
  linkedinUrl = "https://www.linkedin.com/in/gaurav-sidana-7a5118242",
}: FooterProps) {
  
  return (
    <footer className="footer">
      {/* Social Icons */}
      <div className="footer__socials">
        <a 
          href={githubUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label="GitHub"
        >
          <GithubIcon size={20} />
        </a>
        <a 
          href={linkedinUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={20} />
        </a>
      </div>
      
      {/* Credit Line */}
      <p className="footer__credit">
        Designed & Built by Gaurav Sidana
      </p>
    </footer>
  )
}