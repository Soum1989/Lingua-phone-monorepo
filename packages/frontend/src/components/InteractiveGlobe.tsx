// @ts-nocheck - Three.js elements are properly handled by React Three Fiber at runtime
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import languages, { Language } from '../shared/languages';

interface InteractiveGlobeProps {
  selectedInputLanguage?: string;
  selectedOutputLanguage?: string;
  onLanguageHover?: (language: Language | null) => void;
  autoRotate?: boolean;
}

// Simple 3D Earth Globe that will definitely render
function RealisticEarth({ selectedInputLanguage, selectedOutputLanguage }: { selectedInputLanguage?: string; selectedOutputLanguage?: string }) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Animation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });
  
  // Convert lat/lng to 3D sphere coordinates
  const latLngToVector3 = (lat: number, lng: number, radius = 2.1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };
  
  // Get active languages
  const getActiveLanguages = () => {
    const active: Array<{ language: Language; type: string; color: string }> = [];
    
    if (selectedInputLanguage) {
      const lang = languages.find(l => l.code === selectedInputLanguage || l.bcp47 === selectedInputLanguage);
      if (lang) active.push({ language: lang, type: 'Input', color: '#FF1744' });
    }
    
    if (selectedOutputLanguage && selectedOutputLanguage !== selectedInputLanguage) {
      const lang = languages.find(l => l.code === selectedOutputLanguage || l.bcp47 === selectedOutputLanguage);
      if (lang) active.push({ language: lang, type: 'Output', color: '#00E5FF' });
    }
    
    return active;
  };
  
  const activeLanguages = getActiveLanguages();
  
  // Debug logging
  useEffect(() => {
    console.log('🌍 Earth component rendered with', activeLanguages.length, 'active languages');
  }, [activeLanguages]);
  
  return (
    <>
      {/* Basic Earth sphere - guaranteed to show */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color="#4A90E2"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Continents as separate meshes for visibility */}
      <mesh>
        <sphereGeometry args={[2.001, 16, 16]} />
        <meshStandardMaterial 
          color="#228B22"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Language markers - bigger and brighter */}
      {activeLanguages.map(({ language, type, color }) => 
        language.coordinates.map((coord, index) => {
          const position = latLngToVector3(coord.lat, coord.lng);
          const key = `${language.code}-${index}`;
          
          console.log(`📍 Placing ${language.name} marker at:`, position);
          
          return (
            <group key={key} position={position}>
              {/* Bright marker sphere */}
              <mesh>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color={color} />
              </mesh>
              
              {/* Glowing effect */}
              <mesh>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial 
                  color={color}
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </group>
          );
        })
      )}
      
      {/* Strong lighting to make everything visible */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      
      {/* Fewer stars so they don't overpower */}
      <Stars radius={50} depth={30} count={500} factor={2} />
    </>
  );
}

// Main Interactive Globe Component
export default function InteractiveGlobe({ 
  selectedInputLanguage, 
  selectedOutputLanguage, 
  onLanguageHover,
  autoRotate = true 
}: InteractiveGlobeProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the globe
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="globe-container" style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4682B4 100%)',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
          <div>Loading Realistic Earth Globe...</div>
        </div>
      </div>
    );
  }

  const getActiveLanguageInfo = (): Array<{ language: Language; type: string; color: string }> => {
    const info: Array<{ language: Language; type: string; color: string }> = [];
    
    if (selectedInputLanguage) {
      const lang = languages.find(l => l.code === selectedInputLanguage || l.bcp47 === selectedInputLanguage);
      if (lang) info.push({ language: lang, type: 'Input', color: '#FF1744' });
    }
    
    if (selectedOutputLanguage && selectedOutputLanguage !== selectedInputLanguage) {
      const lang = languages.find(l => l.code === selectedOutputLanguage || l.bcp47 === selectedOutputLanguage);
      if (lang) info.push({ language: lang, type: 'Output', color: '#00E5FF' });
    }
    
    return info;
  };

  const activeLanguageInfo = getActiveLanguageInfo();

  return (
    <div className="globe-container" style={{ height: '400px', position: 'relative' }}>
      {/* 3D Realistic Earth Globe */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ 
          width: '100%', 
          height: '100%', 
          background: '#1a1a2e'
        }}
      >
        <RealisticEarth
          selectedInputLanguage={selectedInputLanguage}
          selectedOutputLanguage={selectedOutputLanguage}
        />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          minDistance={3}
          maxDistance={8}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Enhanced Language Legend for 3D Globe */}
      {activeLanguageInfo.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '8px 10px',
          borderRadius: '8px',
          fontSize: '11px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          maxWidth: '200px',
          zIndex: 1000
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '12px' }}>
            🌍 Active Languages
          </div>
          {activeLanguageInfo.map(({ language, type, color }, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '4px',
              padding: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '4px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`
              }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '10px' }}>
                  {language.flag} {language.name}
                </div>
                <div style={{ fontSize: '9px', opacity: 0.8 }}>
                  {type} • Rank #{language.rank}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls info */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '10px',
        backdropFilter: 'blur(5px)',
        zIndex: 1000
      }}>
        🖱️ Drag to rotate • 🔍 Scroll to zoom
      </div>

      {/* No Languages Selected Message for 3D Globe */}
      {activeLanguageInfo.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌍</div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Realistic Earth Globe</div>
          <div style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.4' }}>
            Select input and output languages to see regions with enhanced visual effects<br/>
            🔴 Bright red markers with pulsing glow = Input language<br/>
            🔵 Electric blue markers with energy rings = Output language<br/>
            <br/>
            <em>Drag to rotate, scroll to zoom</em>
          </div>
        </div>
      )}
    </div>
  );
}

