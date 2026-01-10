'use client'

import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Model from '../Model'

type SceneProps = {
    isMobile?: boolean;
}
export default function Scene({ isMobile }: SceneProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'default'
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          
          <pointLight
            color="#bd2a2a"
            intensity={15}
            position={[5, 3, 3]}
            distance={50}
          />
          
          <pointLight
            color="#b5b5b5"
            intensity={15}
            position={[-5, -3, 3]}
            distance={50}
          />
          
          <pointLight
            color="#b5b5b5"
            intensity={8}
            position={[0, 0, -5]}
            distance={50}
          />
          
          <Environment preset="city" />
          
          <Model isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}