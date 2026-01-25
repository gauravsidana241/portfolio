"use client"

import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying float vDisplacement;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform float uTime;
uniform vec3 uRippleCenter;

void main() {
    vPosition = position;
    
    float dist = distance(position, uRippleCenter);
    float speed = 1.0;
    float interval = 5.0;
    float pulseCenter = mod(uTime * speed, interval); 
    float distToPulse = abs(dist - pulseCenter);
    float waveWidth = 0.5;
    float waveMask = smoothstep(waveWidth, 0.0, distToPulse);
    float singleWave = sin(waveMask * 3.14159);
    float startEase = smoothstep(0.0, 2.0, pulseCenter);
    float falloff = exp(-dist * 0.6); 
    
    vDisplacement = singleWave * startEase * falloff;
    
    float distortionHeight = 0.35; 
    vec3 newPosition = position + normal * (vDisplacement * distortionHeight);
    
    // Pass normal for lighting
    vNormal = normalMatrix * normal;
    
    // View position for specular
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
precision highp float;

varying float vDisplacement;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform sampler2D uGradient;
uniform float uTime;

void main() {
    // Gradient animation
    float axis1 = (vPosition.x * 1.1 + vPosition.y * 0.9 + vPosition.z * 1.2);
    float pattern1 = sin(axis1 * 1.5 + uTime * 2.0);
    float axis2 = (vPosition.z * 1.8 - vPosition.x * 1.1 + vPosition.y * 0.7);
    float pattern2 = sin(axis2 * 1.2 - uTime * 1.5);
    float combinedSlide = (pattern1 + pattern2) * 0.5 + 0.5;
    
    vec2 uv = vec2(combinedSlide, 0.5);
    vec3 gradientColor = texture2D(uGradient, uv).rgb;
    
    float brightnessMask = smoothstep(0.0, 0.9, vDisplacement);
    brightnessMask = pow(brightnessMask, 0.5);
    
    vec3 baseColor = vec3(0.01, 0.01, 0.02);
    vec3 materialColor = mix(baseColor, gradientColor, brightnessMask);
    
    // Lighting setup
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Ambient
    vec3 ambient = materialColor * 0.4;
    
    // Main light (front-top-right)
    vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
    float NdotL1 = max(dot(normal, lightDir1), 0.0);
    vec3 diffuse1 = materialColor * NdotL1 * 0.8;
    
    // Specular
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    float NdotH1 = max(dot(normal, halfDir1), 0.0);
    float specular1 = pow(NdotH1, 32.0);
    vec3 specColor1 = vec3(0.3) * specular1;
    
    // Fill light (back-bottom-left)
    vec3 lightDir2 = normalize(vec3(-0.5, -0.5, -1.0));
    float NdotL2 = max(dot(normal, lightDir2), 0.0);
    vec3 diffuse2 = materialColor * NdotL2 * 0.3;
    
    // Rim light
    float rimPower = 1.0 - max(dot(viewDir, normal), 0.0);
    rimPower = pow(rimPower, 3.0);
    vec3 rim = gradientColor * rimPower * 0.4;
    
    // Combine
    vec3 finalColor = ambient + diffuse1 + diffuse2 + specColor1 + rim;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`

export default function Mesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const gradientTexture = useLoader(THREE.TextureLoader, '/textures/gradient.png');
  gradientTexture.magFilter = THREE.LinearFilter;
  gradientTexture.minFilter = THREE.LinearMipmapLinearFilter;
  gradientTexture.generateMipmaps = true;
  gradientTexture.wrapS = gradientTexture.wrapT = THREE.RepeatWrapping;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uGradient: { value: gradientTexture },
    uRippleCenter: { value: new THREE.Vector3(1, 1, 1) }
  }), [gradientTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}