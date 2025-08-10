import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import ParticleSystem from './ParticleSystem';

const OrbCore = ({ isActive, isListening }) => {
  const meshRef = useRef();
  const lightRef = useRef();
  
  // Animate rotation and distortion
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.007;
      
      // Pulse effect when active
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else if (isListening) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
    
    // Animate light intensity
    if (lightRef.current) {
      lightRef.current.intensity = isActive ? 2 + Math.sin(state.clock.elapsedTime * 5) : 1.5;
    }
  });

  const distortSpeed = isActive ? 5 : isListening ? 2 : 1;
  const distortAmount = isActive ? 0.4 : isListening ? 0.2 : 0.1;

  return (
    <>
      {/* Main Orb */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#00ffff"
          emissive="#0080ff"
          emissiveIntensity={isActive ? 0.5 : 0.2}
          roughness={0.1}
          metalness={0.8}
          distort={distortAmount}
          speed={distortSpeed}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Inner Core */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#0080ff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Outer Glow */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        color="#00ffff"
        intensity={1.5}
        distance={10}
      />
    </>
  );
};

const WillyOrb = ({ isActive = false, isListening = false }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Ambient Light */}
        <ambientLight intensity={0.2} color="#0080ff" />
        
        {/* Directional Lights */}
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00ffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#0080ff" />
        
        {/* Orb Core */}
        <OrbCore isActive={isActive} isListening={isListening} />
        
        {/* Particle System */}
        <ParticleSystem count={isActive ? 200 : 100} isActive={isActive} />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* HTML Overlay Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan Line Effect */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-willy-primary to-transparent animate-scan"></div>
        </div>
        
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-willy-primary/30"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-willy-primary/30"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-willy-primary/30"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-willy-primary/30"></div>
      </div>
    </div>
  );
};

export default WillyOrb;