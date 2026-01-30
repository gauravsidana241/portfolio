"use client"

import * as THREE from 'three'
import React, { Suspense, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, MeshDistortMaterial, ContactShadows } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/three'

const AnimatedMaterial = a(MeshDistortMaterial)

interface SceneProps {
  isMobile: boolean;
  onReady?: () => void;
}

// Inner component that renders after Suspense resolves
function SceneContent({ isMobile, onReady }: SceneProps) {
  const sphere = useRef<THREE.Mesh>(null!)
  const light = useRef<THREE.PointLight>(null!)
  const hasCalledReady = useRef(false)

  // Call onReady once when this component mounts (meaning Suspense resolved)
  useEffect(() => {
    if (onReady && !hasCalledReady.current) {
      hasCalledReady.current = true
      onReady()
    }
  }, [onReady])

  useFrame((state) => {
    // Light follows mouse purely for environmental depth
    if (light.current) {
      light.current.position.x = state.mouse.x * 20
      light.current.position.y = state.mouse.y * 20
    }

    // Passive floating animation
    if (sphere.current) {
      sphere.current.position.y = Math.sin(state.clock.elapsedTime / 1.5) / 6
    }
  })

  // Initial pop-in animation only
  const baseScale = isMobile ? 1 : 1.5
  const [{ scale }] = useSpring(
    {
      from: { scale: 0 },
      to: { scale: baseScale },
      config: { mass: 1.5, tension: 800, friction: 40 }
    },
    [isMobile]
  )

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={75}>
        <ambientLight intensity={0.5} />
        <pointLight ref={light} position={[0, 0, -15]} intensity={1} color="#bf082e" />
      </PerspectiveCamera>
      
      <a.mesh
        ref={sphere}
        scale={scale as any}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <AnimatedMaterial
          color="#000000"
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
    </>
  )
}

export default function Scene({ isMobile, onReady }: SceneProps) {
  return (
    <Suspense fallback={null}>
      <SceneContent isMobile={isMobile} onReady={onReady} />
    </Suspense>
  )
}