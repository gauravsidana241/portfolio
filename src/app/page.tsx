"use client"

import "./main.scss"
import { useEffect, useRef, useState } from "react";

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// components
import NavBar from "./components/NavBar";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import About from "./components/About";
import ExperienceComponent from "./components/Experience";
import Scene from "./components/Scene";
import Loader from "./components/Loader";
import Contact from "./components/Contact";
import GlassButton from "./components/GlassButton";
import { Reveal } from "./hooks/useScrollReveal";
import { LinkedinIcon, GithubIcon, MailIcon, DownloadIcon } from "./components/Icons";

export default function Home() {
  const roleTextRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [blurActive, setBlurActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll sync for role text AND blur overlay activation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.50; // 50% of viewport height
      
      if (roleTextRef.current) {
        roleTextRef.current.style.transform = `translateY(-${scrollY}px)`;
      }
      
      setBlurActive(scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Callback when mesh/scene is ready
  const handleSceneReady = () => {
    // Add a small delay for smoother transition
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resumes/resume.pdf';
    link.download = 'Gaurav_Sidana_Resume.pdf';
    link.click();
  };

  const projects = [
    {
      "id": 1,
      "title": "FormHook Delivery System",
      "description": "Fault-tolerant webhook infrastructure featuring distributed job queues, exponential backoff retries, and real-time failure simulation.",
      "techStack": ["Next.js 16", "TypeScript", "BullMQ", "Redis", "Node.js"],
      "demoUrl": "https://formhook.vercel.app/",
      "repoUrl": "https://github.com/gauravsidana241/formhook"
    },
    {
      "id": 2,
      "title": "Crime Alert System",
      "description": "Full-stack reporting platform featuring role-based access control (RBAC) and interactive mapping for real-time public safety monitoring.",
      "techStack": ["React.js", "Node.js", "Sequelize", "Mapbox"],
      "repoUrl": "https://github.com/gauravsidana241/crimealert"
    },
    {
      "id": 3,
      "title": "Virtual Programming Lab",
      "description": "Interactive online coding environment with multi-tier user management designed to streamline workflows for students and instructors.",
      "techStack": ["JavaScript", "PHP", "CSS"],
    }
  ]

  const navItems = [
    { label: "About", action: () => scrollToSection('about') },
    { label: "Experience", action: () => scrollToSection('experience') },
    { label: "Projects", action: () => scrollToSection('projects') },
    { label: "Contact", action: () => scrollToSection('contact') },
  ];

  const experienceList = [
    {
      position: "MSc Computing Science (AI Focus)",
      company: "University of Glasgow",
      startDate: "Sept 2025",
      endDate: undefined,
      description: [
        "Specializing in Artificial Intelligence and Machine Learning, with a focus on advanced algorithms and system design.",
        "Deepening theoretical and practical knowledge in large-scale computing systems."
      ],
      companyLink: "https://www.gla.ac.uk/"
    },
    {
      position: "Software Development Engineer",
      company: "Fynd (Shopsense Retail)",
      startDate: "Jan 2024",
      endDate: "Aug 2025",
      description: [
        "Acted as a key developer in the architectural overhaul of 9 marketplace integrations, migrating from siloed applications to a unified platform orchestrated by Temporal workflows.",
        "Designed and implemented a resilient, event-driven integration for the Amazon VDF marketplace, utilizing BullMQ and KafkaJS to process high-volume feed APIs.",
        "Enhanced system-wide reliability by authoring the complete testing suite (using Jest and Specmatic) and integrating OpenTelemetry for distributed tracing.",
        "Supported the infrastructure and deployment pipeline by managing containerized applications with Kubernetes and Docker."
      ],
      companyLink: "https://www.fynd.com/"
    },
    {
      position: "Intern",
      company: "Fynd (Shopsense Retail)",
      startDate: "Oct 2023",
      endDate: "Jan 2024",
      description: [
        "Completed 3 months of training in Full Stack Development with JavaScript.",
        "Learned key technologies including MongoDB, Express, Vue.js, and Node.js."
      ],
      companyLink: "https://www.fynd.com/"
    }
  ];

  return (
    <>
      {/* Loader - shows until mesh is ready */}
      <Loader isLoading={isLoading} />
      
      {/* Z-INDEX 1: Fixed background gradient */}
      <div className="background-gradient"></div>
      
      {/* Z-INDEX 1.5: Role text */}
      <div className="role-text-background" ref={roleTextRef}>
        <span className="role-line">FULL STACK</span>
        <span className="role-line">DEVELOPER</span>
        {/* <span className="role-line-tall">2026</span> */}
      </div>
      
      {/* Z-INDEX 2: 3D Model Canvas */}
      <div className="canvas-container">
        <Canvas dpr={[1, 2]}>
          <Scene isMobile={isMobile} onReady={handleSceneReady} />
          <OrbitControls 
            makeDefault
            enablePan={false} 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 2} 
          />
        </Canvas>
      </div>
      
      {/* Z-INDEX 2.5: Blur overlay */}
      <div className={`blur-overlay ${blurActive ? 'active' : ''}`}></div>
      
      {/* Z-INDEX 3: Content Layer */}
      <div className="content-container" id="intro">
        <NavBar items={navItems} isMobile={isMobile} />
        
        {/* Hero Section */}
        <div className="hero-section">
          <div className="intro-content">
            {isMobile ? (
              <div className="intro-mobile">
                <div className="bottom-anchor">
                  <div className="greeting-container">
                    <h1>
                      Hi, I am 
                      <span className="name-highlight">
                        Gaurav <span className="name-highlight__red">Sidana</span>
                      </span>
                    </h1>
                    <p className="intro-brief">
                      Software engineer focused on building exceptional digital experiences; currently pursuing a Master's 
                      at Glasgow to combine backend expertise with AI innovation.
                    </p>
                    <div className="social-links">
                      <a href="https://www.linkedin.com/in/gaurav-sidana-7a5118242" target="_blank" rel="noopener noreferrer" className="social-btn">
                        <LinkedinIcon size={20} />
                      </a>
                      <a href="https://github.com/gauravsidana241" target="_blank" rel="noopener noreferrer" className="social-btn">
                        <GithubIcon size={20} />
                      </a>
                      <GlassButton 
                        text="Download CV" 
                        icon={<DownloadIcon size={16} />} 
                        onClick={handleDownloadResume}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Reveal direction="right" delay={200}>
                <div className="intro-desktop">
                  <div className="intro-right">
                    <p className="intro-greeting">Hi, I am</p>
                    <h1 className="intro-name">
                      Gaurav <span className="name-highlight">Sidana</span>
                    </h1>
                    <p className="intro-brief">
                      Software engineer focused on building exceptional digital experiences; currently pursuing a Master's 
                      at Glasgow to combine backend expertise with AI innovation.
                    </p>
                    <div className="social-links">
                      <a href="https://www.linkedin.com/in/gaurav-sidana-7a5118242" target="_blank" rel="noopener noreferrer" className="social-btn">
                        <LinkedinIcon size={22} />
                      </a>
                      <a href="https://github.com/gauravsidana241" target="_blank" rel="noopener noreferrer" className="social-btn">
                        <GithubIcon size={22} />
                      </a>
                      <GlassButton 
                        text="Download CV" 
                        icon={<DownloadIcon size={18} />} 
                        onClick={handleDownloadResume}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            )}  
          </div>
        </div>

        <div className="main-content">
          {/* About Section */}
          <Reveal>
            <div className="my-about-section" id="about">
              <About isMobile={isMobile} sectionNumber="01" numberPosition="left" />
            </div>
          </Reveal>
          
          {/* Experience Section */}
          <Reveal>
            <div className="experience-section" id="experience">
              <ExperienceComponent 
                experienceList={experienceList}
                isMobile={isMobile}
                sectionNumber="02"
                numberPosition="right"
              />
            </div>
          </Reveal>
          
          {/* Projects Section */}
          <Reveal>
            <div className="projects-section" id="projects">
              <Projects 
                projects={projects}
                isMobile={isMobile}
                sectionNumber="03"
                numberPosition="left"
              />
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal>
          <div className="contact-section" id="contact">
            <Contact 
              email="gauravsidana241@gmail.com"
              isMobile={isMobile}
              sectionNumber="04"
            />
          </div>
          </Reveal>
          
          {/* Footer */}
          <Reveal direction="none">
            <Footer 
              email="gauravsidana241@gmail.com"
              githubUrl="https://github.com/gauravsidana241"
              linkedinUrl="https://www.linkedin.com/in/gaurav-sidana-7a5118242"
            />
          </Reveal>
        </div>
      </div>
    </>
  );
}