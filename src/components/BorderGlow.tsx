import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface BorderGlowProps {
  children: React.ReactNode;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  className?: string;
  key?: React.Key;
}

export default function BorderGlow({
  children,
  edgeSensitivity = 30,
  glowColor = "255 31 38", // Default to brand red
  backgroundColor = "transparent",
  borderRadius = 28,
  glowRadius = 60,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#FF1F26', '#3B82F6', '#FF1F26'],
  className = ""
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseEnter = () => setOpacity(glowIntensity);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        backgroundColor: backgroundColor,
      }}
    >
      {/* Glow Layer */}
      <motion.div
        className="absolute inset-[-1px] pointer-events-none z-0 overflow-hidden"
        style={{
          borderRadius: `${borderRadius}px`,
          opacity: opacity,
          background: animated 
            ? `conic-gradient(from 0deg at ${smoothX}px ${smoothY}px, ${colors.join(', ')})`
            : `radial-gradient(${glowRadius * 2}px circle at ${smoothX}px ${smoothY}px, rgba(${glowColor}, 0.15), transparent 80%)`,
        }}
      />

      {/* Border Stroke Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          borderRadius: `${borderRadius}px`,
          opacity: opacity,
          boxShadow: `inset 0 0 0 1px rgba(${glowColor}, 0.1)`,
          background: `radial-gradient(${glowRadius}px circle at ${smoothX}px ${smoothY}px, rgba(${glowColor}, 0.3), transparent 100%)`,
          WebkitMaskImage: `radial-gradient(${glowRadius}px circle at ${smoothX}px ${smoothY}px, black, transparent 100%)`,
          maskImage: `radial-gradient(${glowRadius}px circle at ${smoothX}px ${smoothY}px, black, transparent 100%)`,
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
