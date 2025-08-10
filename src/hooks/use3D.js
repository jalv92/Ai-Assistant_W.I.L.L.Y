import { useState, useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';

export const use3D = () => {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [performance, setPerformance] = useState({
    fps: 60,
    memory: 0,
    drawCalls: 0
  });
  const frameRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  // Monitor performance
  useEffect(() => {
    const measurePerformance = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      
      if (delta >= 1000) {
        setPerformance(prev => ({
          ...prev,
          fps: Math.round((frameRef.current * 1000) / delta)
        }));
        
        frameRef.current = 0;
        lastTimeRef.current = now;
      }
      
      frameRef.current++;
    };

    const interval = setInterval(measurePerformance, 100);
    return () => clearInterval(interval);
  }, []);

  const createMaterial = useCallback((options = {}) => {
    const {
      color = '#00ffff',
      emissive = '#0080ff',
      emissiveIntensity = 0.2,
      metalness = 0.8,
      roughness = 0.2,
      transparent = true,
      opacity = 0.9
    } = options;

    return new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity,
      metalness,
      roughness,
      transparent,
      opacity
    });
  }, []);

  const createGlowMaterial = useCallback((color = '#00ffff', intensity = 1) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float intensity;
        uniform float time;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float glow = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 glowColor = color * intensity * glow;
          glowColor *= 1.0 + sin(time * 2.0) * 0.2;
          gl_FragColor = vec4(glowColor, glow);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending
    });
  }, []);

  const createParticleSystem = useCallback((count = 100, color = '#00ffff') => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      
      velocities[i] = (Math.random() - 0.5) * 0.01;
      velocities[i + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const material = new THREE.PointsMaterial({
      color,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    return new THREE.Points(geometry, material);
  }, []);

  const animateParticles = useCallback((particles, time) => {
    if (!particles || !particles.geometry) return;
    
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      // Keep particles within bounds
      const distance = Math.sqrt(
        positions[i] ** 2 + 
        positions[i + 1] ** 2 + 
        positions[i + 2] ** 2
      );
      
      if (distance > 5 || distance < 2) {
        velocities[i] *= -1;
        velocities[i + 1] *= -1;
        velocities[i + 2] *= -1;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.001;
  }, []);

  const optimizeScene = useCallback((scene, camera, renderer) => {
    // Enable shadows selectively
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set pixel ratio for retina displays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Optimize camera
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
    
    // Add fog for depth
    scene.fog = new THREE.Fog(0x0a0a0a, 5, 20);
    
    setIsSceneReady(true);
  }, []);

  const dispose = useCallback((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
    
    if (object.texture) {
      object.texture.dispose();
    }
    
    if (object.children) {
      object.children.forEach(child => dispose(child));
    }
  }, []);

  return {
    isSceneReady,
    performance,
    createMaterial,
    createGlowMaterial,
    createParticleSystem,
    animateParticles,
    optimizeScene,
    dispose
  };
};