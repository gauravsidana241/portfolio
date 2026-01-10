"use client"

import "./main.scss"
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import ProjectScroller from "./components/ProjectScroller";
import StatsBar from "./components/StatsBar";
import Footer from "./components/Footer";
import TechStack from "./components/TechStack";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const roleTextRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const modelRef = useRef<THREE.Group | null>(null);

  // Mobile check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll sync for role text - makes it scroll with the page while staying behind the model
  useEffect(() => {
    const handleScroll = () => {
      if (roleTextRef.current) {
        const scrollY = window.scrollY;
        roleTextRef.current.style.transform = `translateY(-${scrollY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4; 
    camera.position.y = 0.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    canvasRef.current.appendChild(renderer.domElement);

    // 2. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xbd2a2a, 15, 50);
    redLight.position.set(5, 3, 3);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0xb5b5b5, 15, 50);
    blueLight.position.set(-5, -3, 3);
    scene.add(blueLight);

    const backLight = new THREE.PointLight(0xb5b5b5, 8, 50);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    // 3. LOAD MODEL
    const loader = new GLTFLoader();
    loader.load(
      '/models/coolsphere4.0.glb', 
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.3,
              metalness: 0.4,
              side: THREE.DoubleSide,
              envMapIntensity: 1.0
            });
          }
        });

        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    // 4. ANIMATION LOOP
    const animate = () => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.003;
        modelRef.current.rotation.x += 0.001;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // 5. RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

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

  const stack = {
    languages: ["Python", "Java", "C++", "JavaScript", "React"],
    backend: ["Kafka", "Temporal", "Redis", "BullMQ"],
    databases: ["PostgreSQL", "MySQL", "MongoDB"],
    devops: ["Kubernetes", "Docker", "GCP", "Git", "OpenTelemetry", "Grafana"],
    creative: ["Blender", "Maya", "Unreal Engine 5"]
  }

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
    { label: "Home", action: () => scrollToSection('intro') },
    { label: "Projects", action: () => scrollToSection('projects') },
    { label: "Skills", action: () => scrollToSection('techstack') },
    { label: "Contact", action: () => scrollToSection('footer') },
  ];

  const stats = [
    { value: "2+", label: "Years Experience" },
    { value: "3+", label: "Projects Completed" },
  ];

  return (
    <>
      {/* Z-INDEX 1: Fixed background gradient */}
      <div className="background-gradient"></div>
      
      {/* Z-INDEX 1.5: Role text - fixed position but synced to scroll via JS */}
      {!isMobile && (
        <div className="role-text-background" ref={roleTextRef}>
          <span className="role-line">FULL STACK</span>
          <span className="role-line">DEVELOPER</span>
        </div>
      )}
      
      {/* Z-INDEX 2: 3D Model Canvas - Fixed position, stays in place */}
      <div className="canvas-container" ref={canvasRef}></div>
      
      {/* Z-INDEX 3: Content Layer - Scrolls with page */}
      <div className="content-container" id="intro">
        <NavBar items={navItems} isMobile={isMobile} />
        
        {/* Hero Section with layered layout */}
        <div className="hero-section">
          {/* Z-INDEX 3: Intro content on the right */}
          <div className="intro-content">
            {isMobile ? (
              <div className="intro-mobile">
                <h1>Hi, I am <span className="name-highlight">Gaurav <span className="name-highlight__red">Sidana</span></span></h1>
                <h2>Full Stack Developer</h2>
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/gaurav-sidana-7a5118242" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/gauravsidana241" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
                <button className="resume-btn" onClick={handleDownloadResume}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download CV
                </button>
                <a href="mailto:gauravsidana241@gmail.com" className="email-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  gauravsidana241@gmail.com
                </a>
              </div>
            ) : (
              <div className="intro-desktop">
                <div className="intro-right">
                  <p className="intro-greeting">Hi, I am</p>
                  <h1 className="intro-name">
                    Gaurav <span className="name-highlight">Sidana</span>
                  </h1>
                  <p className="intro-brief">
                    Full Stack Developer with 2+ years of experience engineering scalable backend solutions and web applications. Currently pursuing a Master's in CS at Glasgow, I focus on optimizing distributed pipelines and building high-impact software at scale.
                  </p>
                  <div className="social-links">
                    <a href="https://www.linkedin.com/in/gaurav-sidana-7a5118242" target="_blank" rel="noopener noreferrer" className="social-btn">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="https://github.com/gauravsidana241" target="_blank" rel="noopener noreferrer" className="social-btn">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <button className="resume-btn" onClick={handleDownloadResume}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Download CV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats at bottom left */}
          <div className="stats-container">
            <StatsBar stats={stats} isMobile={isMobile} />
          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <span>SCROLL</span>
          </div>
        </div>

        <div className="main-content">
          <div className="projects-section" id="projects">
            <ProjectScroller 
              projects={projects} 
              autoRotateInterval={20000}
            />
          </div>
          <div className="techstack-section" id="techstack">
            <TechStack stack={stack}/>
          </div>
        </div>
        <div className="footer-section" id="footer">
          <Footer 
            email="gauravsidana241@gmail.com" 
            phone="+44 75536 85160" 
            linkedIn="https://www.linkedin.com/in/gaurav-sidana-7a5118242" 
            github="https://github.com/gauravsidana241" 
            isMobile={isMobile} 
          />
        </div>
      </div>
    </>
  );
}