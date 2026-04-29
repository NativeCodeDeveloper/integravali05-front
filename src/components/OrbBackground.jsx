'use client';

import { useEffect, useRef } from 'react';

export default function OrbBackground({ children, orbX = 0.60, orbY = 0.58 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ROWS = 92;
    const COLS = 92;
    const particles = [];

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        particles.push({ i, j });
      }
    }

    const getColor = (ny, nx, t) => {
      // ny va de -1 (bottom) a 1 (top)
      const norm = (ny + 1) / 2; // 0 (bottom) → 1 (top)

      // Bottom: teal profundo → Mid: cyan brillante → Top: aqua electrico
      let r, g, b;
      if (norm < 0.38) {
        const t2 = norm / 0.38;
        r = Math.round(8 + t2 * 12);
        g = Math.round(110 + t2 * 85);
        b = Math.round(145 + t2 * 75);
      } else if (norm < 0.72) {
        const t2 = (norm - 0.38) / 0.34;
        r = Math.round(20 + t2 * 28);
        g = Math.round(195 + t2 * 35);
        b = Math.round(220 + t2 * 25);
      } else {
        const t2 = (norm - 0.72) / 0.28;
        r = Math.round(48 + t2 * 24);
        g = Math.round(230 + t2 * 18);
        b = Math.round(245 + t2 * 10);
      }

      // Variación marcada para que el orbe respire sobre fondo blanco
      const shimmer = Math.sin(nx * 4.5 + t * 1.2) * 14;
      const pulse = Math.cos(ny * 5 - t * 0.9) * 10;
      r = Math.min(255, Math.max(0, r + shimmer * 0.25));
      g = Math.min(255, Math.max(0, g + shimmer + pulse * 0.4));
      b = Math.min(255, Math.max(0, b + pulse));

      return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * orbX;
      const cy = canvas.height * orbY;
      const radius = Math.min(canvas.width, canvas.height) * 0.48;

      // Glow ambiental detrás del orbe
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.12, cx, cy, radius * 1.9);
      glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.26)');
      glowGrad.addColorStop(0.32, 'rgba(14, 165, 233, 0.18)');
      glowGrad.addColorStop(0.62, 'rgba(6, 182, 212, 0.10)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotación lenta en Y + ligera inclinación en X
      const rotY = time * 0.12;
      const rotX = Math.sin(time * 0.08) * 0.3;
      const breathe = 1 + Math.sin(time * 0.15) * 0.08;
      const cosRY = Math.cos(rotY);
      const sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX);
      const sinRX = Math.sin(rotX);

      for (const p of particles) {
        const phi = (p.i / (ROWS - 1)) * Math.PI;
        const theta = (p.j / (COLS - 1)) * 2 * Math.PI;

        // Distorsión orgánica más pronunciada
        const noiseA = Math.sin(phi * 3.5 + time * 0.6 + p.j * 0.12) * 0.22;
        const noiseB = Math.cos(theta * 2.5 + time * 0.4 + p.i * 0.10) * 0.20;
        const noiseC = Math.sin(phi * 2 + theta * 1.5 + time * 0.8) * 0.15;
        const noiseD = Math.cos(phi + theta * 3 + time * 0.3) * 0.08;

        const nx = Math.sin(phi + noiseA) * Math.cos(theta + noiseB);
        const ny = Math.cos(phi + noiseB + noiseD);
        const nz = Math.sin(phi + noiseC) * Math.sin(theta + noiseA);

        // Rotación Y
        let x3d = nx * cosRY - nz * sinRY;
        let z3d = nx * sinRY + nz * cosRY;
        let y3d = ny;

        // Rotación X (inclinación)
        const y3dRot = y3d * cosRX - z3d * sinRX;
        const z3dRot = y3d * sinRX + z3d * cosRX;
        y3d = y3dRot;
        z3d = z3dRot;

        const perspective = 1 / (1 + z3d * 0.35);
        const r = radius * breathe;
        const sx = cx + x3d * r * perspective;
        const sy = cy - y3d * r * perspective;

        // Profundidad
        const depth = (z3d + 1) / 2;
        const dotSize = (0.65 + depth * 1.35) * perspective;
        const alpha = 0.42 + depth * 0.58;

        const color = getColor(ny, nx, time);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      time += 0.01;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#fff' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
