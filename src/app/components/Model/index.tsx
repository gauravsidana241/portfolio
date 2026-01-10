import { useGLTF, Text, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'
import './Model.scss'

type ModelProps = {
  isMobile?: boolean;
}

const desktopScaleFactor = 5.5;
const mobileScaleFactor = 2.2;

export default function Model({ isMobile }: ModelProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const { nodes } = useGLTF('/models/coolsphere4.0.glb')
  const { viewport } = useThree()

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.003
      mesh.current.rotation.x += 0.001
    }
  })

  const meshNode = Object.values(nodes).find(
    (node) => node instanceof THREE.Mesh
  ) as THREE.Mesh | undefined

  if (!meshNode) {
    console.warn('No mesh found in GLB')
    return null
  }

  // 1. Define a tight margin
  const margin = 0.35 
  
  // 2. Calculate positions based on viewport (At Z=0)
  const textX = -viewport.width / 2 + margin
  const textY = viewport.height / 2 - margin

  return (
    <>
      {/* 3D Text - Top Left */}
      {/* Changed Z to 0 to align perfectly with viewport edges */}
      <group position={[textX, textY, 0]}>
        <Text
          fontSize={Math.min(viewport.width / 8, 1)} // Adjusted size slightly
          textAlign="left"
          anchorX="left"
          anchorY="top" // Anchors top-left corner of text to position
          color="#6461619a"
          fillOpacity={0.3}
          lineHeight={1}
        >
          FULL STACK
        </Text>
        <Text
          fontSize={Math.min(viewport.width / 8, 1)}
          textAlign="left"
          anchorX="left"
          anchorY="top"
          color="#6461619a"
          fillOpacity={0.2}
          lineHeight={1}
          // Position relative to the parent group (which is already top-left)
          position={[0, -Math.min(viewport.width / 8, 1), 0]}
        >
          DEVELOPER
        </Text>
      </group>

      {/* Glass Model - Centered */}
      <group scale={viewport.width / (isMobile ? mobileScaleFactor : desktopScaleFactor)}>
        <mesh ref={mesh} geometry={meshNode.geometry}>
          <MeshTransmissionMaterial
            thickness={0.2}
            roughness={0}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.02}
            backside={true}
          />
        </mesh>
      </group>
    </>
  )
}

useGLTF.preload('/models/coolsphere4.0.glb')