import React, { useRef, useEffect } from 'react';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  className?: string;
}

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0.05,
  scanlineIntensity = 0.1,
  speed = 0.5,
  scanlineFrequency = 2,
  warpAmount = 0.2,
  className = ""
}: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      time += 0.01 * speed;
      const { width, height } = canvas.getBoundingClientRect();

      ctx.clearRect(0, 0, width, height);

      // 1. Base Dark Layer
      ctx.fillStyle = '#0F1115';
      ctx.fillRect(0, 0, width, height);

      // 2. Animated "Veil" / Ethereal Clouds
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createRadialGradient(
          width / 2 + Math.cos(time * 0.5 + i) * (width * 0.3),
          height / 2 + Math.sin(time * 0.3 + i) * (height * 0.3),
          0,
          width / 2 + Math.cos(time * 0.5 + i) * (width * 0.3),
          height / 2 + Math.sin(time * 0.3 + i) * (height * 0.3),
          width * 0.8
        );

        const hue = (220 + hueShift + i * 20) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 70%, 10%, 0.3)`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Scanlines
      if (scanlineIntensity > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = `rgba(255, 255, 255, ${scanlineIntensity * 0.1})`;
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 4 / scanlineFrequency) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 4. Noise / Grain
      if (noiseIntensity > 0) {
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255 * noiseIntensity;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = 20; // Subtle opacity
        }
        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
