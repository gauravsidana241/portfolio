"use client"

import * as THREE from 'three'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, MeshDistortMaterial, ContactShadows } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/three'

const AnimatedMaterial = a(MeshDistortMaterial)

interface SceneProps {
  isMobile: boolean
}

export default function Scene({ isMobile }: SceneProps) {
  const sphere = useRef<THREE.Mesh>(null!)
  const light = useRef<THREE.PointLight>(null!)
  
  const [down, setDown] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Cursor logic
  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'none'
      : `url('data:image/svg+xml;base64,${btoa(
          '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="10" fill="#e74c3c"/></svg>'
        )}'), auto`
  }, [hovered])

  useFrame((state) => {
    if (light.current) {
      light.current.position.x = state.mouse.x * 20
      light.current.position.y = state.mouse.y * 20
    }

    if (sphere.current) {
      sphere.current.position.x = THREE.MathUtils.lerp(sphere.current.position.x, hovered ? state.mouse.x / 2 : 0, 0.2)
      sphere.current.position.y = THREE.MathUtils.lerp(
        sphere.current.position.y,
        Math.sin(state.clock.elapsedTime / 1.5) / 6 + (hovered ? state.mouse.y / 2 : 0),
        0.2
      )
    }
  })

  // Pop-in and interaction springs
  const baseScale = isMobile ? 1 : 1.5
  const [{ scale, color }] = useSpring(
    {
      from: { scale: 0 },
      to: {
        scale: down ? baseScale * 1.2 : hovered ? baseScale * 1.05 : baseScale,
        color: hovered ? '#801111' : '#000000',
      },
      config: { mass: 1.5, tension: 800, friction: 40 }
    },
    [hovered, down, isMobile]
  )

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={75}>
        <ambientLight intensity={0.5} />
        <pointLight ref={light} position={[0, 0, -15]} intensity={1} color="#bf082e" />
      </PerspectiveCamera>
      
      <Suspense fallback={null}>
        <a.mesh
          ref={sphere}
          scale={scale as any}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setDown(true)}
          onPointerUp={() => setDown(false)}
        >
          <sphereGeometry args={[1, 64, 64]} />
          <AnimatedMaterial
            color={color as any}
            envMapIntensity={1}
            clearcoat={0.1}
            clearcoatRoughness={0}
            metalness={0}
            distort={0.7}
            speed={4}
          />
        </a.mesh>
        
        <Environment preset="warehouse" />
        
        <ContactShadows
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -1.6, 0]}
          opacity={0.4}
          width={15}
          height={15}
          blur={2.5}
          far={1.6}
        />
      </Suspense>
    </>
  )
}