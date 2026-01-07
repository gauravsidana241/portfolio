"use client"

import "./main.scss"
import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import ProjectScroller from "./components/ProjectScroller";
import StatsBar from "./components/StatsBar";
import Footer from "./components/Footer";

export default function Home() {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const animationRef = useRef<{ target: any, current: any }>({
    target: {},
    current: {}
  });
  const hoverRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // A4 aspect ratio (1:1.414)
    const panelWidth = 10;
    const panelHeight = 14.14;
    const geometry = new THREE.PlaneGeometry(panelWidth, panelHeight);

    const textureLoader = new THREE.TextureLoader();
    const resumeTexture = textureLoader.load('/resumes/resume.jpg');
    
    resumeTexture.minFilter = THREE.LinearFilter;
    resumeTexture.magFilter = THREE.LinearFilter;
    resumeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const material = new THREE.MeshBasicMaterial({
      map: resumeTexture,
      side: THREE.DoubleSide,
      color: 0xe0e0e0
    });

    const panel = new THREE.Mesh(geometry, material);
    panelRef.current = panel;
    
    panel.rotation.x = -0.4;
    panel.rotation.y = -0.4;
    panel.rotation.z = -0.4;
    panel.position.set(0, 0, 0);
    
    animationRef.current = {
      current: {
        panelRotation: { x: -0.4, y: -0.4, z: -0.4 },
        panelPosition: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: -1, y: 2, z: 6 }
      },
      target: {
        panelRotation: { x: -0.4, y: -0.4, z: -0.4 },
        panelPosition: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: -1, y: 2, z: 6 }
      }
    };
    
    scene.add(panel);

    camera.position.z = 6;
    camera.position.y = 2;
    camera.position.x = -1;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(panel);

      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        hoverRef.current.target = 1;
      } else {
        renderer.domElement.style.cursor = 'default';
        hoverRef.current.target = 0;
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    function animate() {
      const anim = animationRef.current;
      const lerpFactor = 0.08;

      panel.rotation.x = lerp(panel.rotation.x, anim.target.panelRotation.x, lerpFactor);
      panel.rotation.y = lerp(panel.rotation.y, anim.target.panelRotation.y, lerpFactor);
      panel.rotation.z = lerp(panel.rotation.z, anim.target.panelRotation.z, lerpFactor);

      panel.position.x = lerp(panel.position.x, anim.target.panelPosition.x, lerpFactor);
      panel.position.y = lerp(panel.position.y, anim.target.panelPosition.y, lerpFactor);
      panel.position.z = lerp(panel.position.z, anim.target.panelPosition.z, lerpFactor);

      camera.position.x = lerp(camera.position.x, anim.target.cameraPosition.x, lerpFactor);
      camera.position.y = lerp(camera.position.y, anim.target.cameraPosition.y, lerpFactor);
      camera.position.z = lerp(camera.position.z, anim.target.cameraPosition.z, lerpFactor);

      // Smooth color transition for hover
      hoverRef.current.current = lerp(hoverRef.current.current, hoverRef.current.target, 0.1);
      const brightness = 0.88 + (0.12 * hoverRef.current.current);
      material.color.setRGB(brightness, brightness, brightness);

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      animationRef.current.target = {
        panelRotation: { x: 0, y: 0, z: 0 },
        panelPosition: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: 0, y: 0, z: 10 }
      };
    } else {
      animationRef.current.target = {
        panelRotation: { x: -0.4, y: -0.4, z: -0.4 },
        panelPosition: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: -1, y: 2, z: 6 }
      };
    }
  }, [isFullscreen]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resumes/resume.pdf';
    link.download = 'resume.pdf';
    link.click();
  };

  const projects = [
    { id: 1, title: "Project Alpha", image: "/placeholder.jpg" },
    { id: 2, title: "Project Beta", image: "/placeholder.jpg" },
    { id: 3, title: "Project Gamma", image: "/placeholder.jpg" },
    { id: 4, title: "Project Delta", image: "/placeholder.jpg" },
    { id: 5, title: "Project Epsilon", image: "/placeholder.jpg" },
  ];

  const navItems = [
  { label: "Home", action: () => scrollToSection('intro') },
  { label: "Projects", action: () => scrollToSection('projects') },
  { label: "Resume", action: () => setIsFullscreen(prev => !prev), highlight: true },
  { label: "Contact", action: () => scrollToSection('footer') },
];

  const stats = [
    { value: "2+", label: "Years Experience" },
    { value: "3+", label: "Projects Completed" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed Three.js canvas */}
      <div className="canvas-container" ref={canvasRef}></div>

      {/* Fullscreen overlay */}
      <div className={`resume-overlay ${isFullscreen ? 'visible' : ''}`}>
        <button className="close-btn" onClick={() => setIsFullscreen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <button className="download-btn" onClick={handleDownload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Scrollable content */}
      <div className={`content-container ${isFullscreen ? 'hidden' : ''}`} id="intro">
        <NavBar items={navItems} />
        <div className="main-content" >
          <div className="intro-section">
            <div className="intro-text">
              <h1>Hi, I am <span className="name-highlight">Gaurav Sidana</span>,</h1>
              <h2>Full Stack Developer | AI Enthusiast</h2>
              <p className="intro-brief">
                Full Stack Developer with 2+ years of experience engineering scalable backend solutions and web applications. Currently pursuing a Master’s in AI at Glasgow, 
                I focus on optimizing distributed pipelines and building high-impact software at scale.              
              </p>
            </div>
            
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

            <StatsBar stats={stats} />
          </div>
          <div className="projects-section" id="projects">
            <ProjectScroller projects={projects} />
          </div>
        </div>
        <div className="footer-section" id="footer">
          <Footer 
            email="gauravsidana241@gmail.com"
            phone="+44 75536 85160"
            linkedIn="https://www.linkedin.com/in/gaurav-sidana-7a5118242"
            github="https://github.com/gauravsidana241"
          />
        </div>
      </div>
    </>
  );
}