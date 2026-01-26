"use client"

import * as THREE from 'three'
import React, { Suspense, useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { PerspectiveCamera, Environment, ContactShadows, Edges, shaderMaterial, useGLTF } from '@react-three/drei'
import { LayerMaterial, Depth, Fresnel, Noise } from 'lamina'

// Custom grid material with distance-based fade
const FadingGridMaterial = shaderMaterial(
  {
    color: new THREE.Color('#787878'),
    fadeDistance: 3.0,
    fadeStrength: 1.0,
  },
  // Vertex shader
  `
    varying vec3 vWorldPosition;
    
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float fadeDistance;
    uniform float fadeStrength;
    
    varying vec3 vWorldPosition;
    
    void main() {
      // Calculate distance from origin (center of grid)
      float dist = length(vWorldPosition.xz);
      
      // Create smooth fade based on distance
      float fade = 1.0 - smoothstep(0.0, fadeDistance, dist * fadeStrength);
      
      // Apply fade to alpha
      gl_FragColor = vec4(color, fade);
    }
  `
)

extend({ FadingGridMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fadingGridMaterial: any
    }
  }
}

// Custom fading grid component
function FadingGrid({ 
  size = 10, 
  divisions = 40, 
  color = '#787878',
  fadeDistance = 3.0,
  fadeStrength = 1.0,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number]
}) {
  const gridRef = useRef<THREE.LineSegments>(null!)
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices: number[] = []
    
    const step = size / divisions
    const halfSize = size / 2
    
    // Create grid lines
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step
      
      // Lines along X
      vertices.push(-halfSize, 0, pos)
      vertices.push(halfSize, 0, pos)
      
      // Lines along Z
      vertices.push(pos, 0, -halfSize)
      vertices.push(pos, 0, halfSize)
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geo
  }, [size, divisions])
  
  return (
    <lineSegments ref={gridRef} geometry={geometry} position={position} rotation={rotation}>
      <fadingGridMaterial 
        color={color} 
        fadeDistance={fadeDistance}
        fadeStrength={fadeStrength}
        transparent={true}
        depthWrite={false}
      />
    </lineSegments>
  )
}

interface GradientCursorProps {
  scale?: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  gradient?: number
}

function GradientCursor({ 
  scale = [0.5, 1, 0.5], 
  position = [-0.25, 0.2, -0.2],
  rotation = [0, 0, -Math.PI / 2],
  gradient = 0.7,
}: GradientCursorProps) {
  const materialRef = useRef<any>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const { nodes } = useGLTF('/models/ChessBoard2.glb') as any

  useFrame((state) => {
  if (materialRef.current?.layers) {
    // Increase frequency for faster cycles
    const t = state.clock.elapsedTime * 1.5; 
    
    // Increase amplitude (the multiplier) to push origins further out
    // Using powers or absolute values can also create "sharper" turns
    const sin = Math.sin(t/2); 
    const cos = Math.cos(t/2);
    
    // layer[0]: subtle drift
    materialRef.current.layers[0].origin.set(cos, 0, 0);
    
    // layers[1-3]: aggressive, high-peak movement
    // Adding offsets (like + 1 or * 2) prevents layers from overlapping perfectly
    materialRef.current.layers[1].origin.set(cos * 2, sin * 2, cos);
    materialRef.current.layers[2].origin.set(sin * 1.5, cos * 2, sin * 1.5);
    materialRef.current.layers[3].origin.set(cos * 2.5, sin * 2.5, cos * 2.5);

    // Force the material to recognize the change
    materialRef.current.needsUpdate = true;
  }
});

  // Find the first mesh geometry in the GLB
  const geometry = useMemo(() => {
    const meshNode = Object.values(nodes).find(
      (node: any) => node.type === 'Mesh' || node.isMesh
    ) as THREE.Mesh | undefined
    return meshNode?.geometry
  }, [nodes])

  if (!geometry) return null

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      scale={scale} 
      position={position} 
      rotation={rotation}
    >
      
      <LayerMaterial 
        ref={materialRef} 
        toneMapped={false}
        lighting="basic"
        >
        <Depth 
          colorA="#ff0080" 
          colorB="black" 
          alpha={1} 
          mode="normal" 
          near={0.5 * gradient} 
          far={0.5} 
          origin={[0, 0, 0]} 
        />
        <Depth 
          colorA="blue" 
          colorB="#f7b955" 
          alpha={1} 
          mode="subtract" 
          near={2 * gradient} 
          far={2} 
          origin={[0, 1, 1]} 
        />
        <Depth 
          colorA="green" 
          colorB="#f7b955" 
          alpha={1} 
          mode="add" 
          near={3 * gradient} 
          far={3} 
          origin={[0, 1, -1]} 
        />
        <Depth 
          colorA="white" 
          colorB="red" 
          alpha={1} 
          mode="overlay" 
          near={1.5 * gradient} 
          far={1.5} 
          origin={[1, -1, -1]} 
        />
        <Fresnel 
          mode="add" 
          color="white" 
          intensity={0.5} 
          power={1.5} 
          bias={0.05} 
        />
      </LayerMaterial>
      
      <Edges color="white" threshold={15} />
    </mesh>
  )
}

interface SceneProps {
  isMobile: boolean
}

export default function Scene({ isMobile }: SceneProps) {
  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 2, 2]} 
        fov={30} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Suspense fallback={null}>
        <group 
          rotation={[Math.PI / 5, -Math.PI / 5, Math.PI / 2]}
          position={[0, 0, 0]}
        >
          <GradientCursor 
            scale={isMobile ? [0.4, 0.8, 0.4] : [0.5, 1, 0.5]} 
            gradient={0.7}
          />
          <FadingGrid 
            size={10}
            divisions={40}
            color="#787878"
            fadeDistance={4.0}
            fadeStrength={0.8}
            position={[-0.25, 0, 0]} 
            rotation={[0, 0, Math.PI / 2]} 
          />
        </group>
        
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

// Preload the model
useGLTF.preload('/models/cursor.glb')