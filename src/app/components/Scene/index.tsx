"use client"

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Mesh from "../Mesh";

export default function Scene() {
  return (
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light (like sunlight) */}
      <directionalLight position={[5, 5, 5]} intensity={10} />
      
      {/* Fill light from the opposite side */}
      <directionalLight position={[-5, -5, -5]} intensity={10} />
      
      {/* Point light for highlights */}
      <pointLight position={[0, 5, 0]} intensity={10} />
      
      <Mesh />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}