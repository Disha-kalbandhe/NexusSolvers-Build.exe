'use client';

import { useEffect, useRef } from 'react';

export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Particle class with proper canvas reference
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedZ = Math.random() * 2;
        const colors = ['#00d4ff', '#00ff88', '#ff0080'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.z -= this.speedZ;

        if (this.z <= 0) {
          this.z = 1000;
          this.x = Math.random() * canvasWidth;
          this.y = Math.random() * canvasHeight;
        }

        if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;
      }

      draw(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        const scale = 1000 / (1000 - this.z);
        const x2d = (this.x - canvasWidth / 2) * scale + canvasWidth / 2;
        const y2d = (this.y - canvasHeight / 2) * scale + canvasHeight / 2;
        const size2d = this.size * scale;

        context.beginPath();
        context.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowBlur = 15;
        context.shadowColor = this.color;
        context.fill();
      }
    }

    // Initialize
    const init = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx, canvas.width, canvas.height);
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start
    init();
    animate();

    // Event listeners
    const handleResize = () => {
      resizeCanvas();
      // Reinitialize particles on resize
      particles = [];
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #0a0e27 100%)',
        width: '100%',
        height: '100%'
      }}
    />
  );
}
