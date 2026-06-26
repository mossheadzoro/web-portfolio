import { useEffect, useRef } from 'react';

export default function MouseTrackingOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let orbState: 'WAITING' | 'FORMING' | 'ACTIVE' = 'WAITING';
    
    // Fit canvas to parent
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        if (particleArray.length === 0) {
           init();
        }
      }
    };
    
    // Mouse state
    let mouse = {
      x: -1000,
      y: -1000,
      radius: 120
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (orbState !== 'ACTIVE') return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle class
    class Particle {
      orbitRadius: number;
      angle: number;
      speed: number;
      size: number;
      x: number;
      y: number;
      hasFormed: boolean;
      
      constructor(orbitRadius: number, angle: number) {
        this.orbitRadius = orbitRadius;
        this.angle = angle;
        this.speed = (Math.random() * 0.002) + 0.001; 
        this.size = Math.random() * 2 + 1;
        this.hasFormed = false;
        
        // Spawn far outside the screen
        this.x = (Math.random() - 0.5) * 3000;
        this.y = (Math.random() - 0.5) * 3000;
      }

      draw() {
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.closePath();
        ctx!.fill();
      }

      update(centerX: number, centerY: number) {
        if (orbState === 'WAITING') return;

        // Maintain constant revolution
        this.angle += this.speed;
        let baseX = centerX + Math.cos(this.angle) * this.orbitRadius;
        let baseY = centerY + Math.sin(this.angle) * this.orbitRadius;

        if (orbState === 'FORMING') {
          // Fly in from all directions (faster easing)
          this.x += (baseX - this.x) * 0.06;
          this.y += (baseY - this.y) * 0.06;
          
          let dist = Math.sqrt((baseX - this.x)**2 + (baseY - this.y)**2);
          // Increased threshold to 30 so they register as formed even while chasing a moving target
          if (dist < 30) {
            this.hasFormed = true;
          }
        } 
        else if (orbState === 'ACTIVE') {
          let dx = mouse.x - baseX;
          let dy = mouse.y - baseY;
          let distance = Math.sqrt(dx * dx + dy * dy);

          let targetX = baseX;
          let targetY = baseY;

          if (distance > 0 && distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let maxDeviation = 60;
            let pullX = (dx / distance) * force * maxDeviation;
            let pullY = (dy / distance) * force * maxDeviation;

            targetX = baseX + pullX;
            targetY = baseY + pullY;
          }

          this.x += (targetX - this.x) * 0.1;
          this.y += (targetY - this.y) * 0.1;
        }
      }
    }

    let particleArray: Particle[] = [];
    
    const init = () => {
      particleArray = [];
      const numberOfParticles = 400;
      for (let i = 0; i < numberOfParticles; i++) {
        const orbitRadius = Math.sqrt(Math.random()) * 220; 
        const angle = Math.random() * Math.PI * 2;
        particleArray.push(new Particle(orbitRadius, angle));
      }
    };

    // Intersection Observer to trigger formation and reset
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (orbState === 'WAITING') {
            // Start the sequence
            orbState = 'FORMING';
          }
        } else {
          // Section left the view, reset the animation
          orbState = 'WAITING';
          for (let p of particleArray) {
            p.x = (Math.random() - 0.5) * 3000;
            p.y = (Math.random() - 0.5) * 3000;
            p.hasFormed = false;
          }
        }
      },
      // 0.4 threshold means it triggers when the section is mostly visible
      { threshold: 0.4 } 
    );
    observer.observe(container);

    resize();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update(centerX, centerY);
      }

      // Check if all particles have formed the orb
      if (orbState === 'FORMING') {
        let allFormed = true;
        for (let i = 0; i < particleArray.length; i++) {
          if (!particleArray[i].hasFormed) {
            allFormed = false;
            break;
          }
        }
        if (allFormed) {
          orbState = 'ACTIVE';
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-crosshair">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto" 
      />
      
      {/* Background soft glow to illuminate the static orb shape */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.4em] uppercase pointer-events-none font-mono">
        Hover over the swarm
      </div>
    </div>
  );
}
