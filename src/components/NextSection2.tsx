import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';

import awsIcon from '../assets/skills/AWS.png';
import blenderIcon from '../assets/skills/Blender.png';
import dockerIcon from '../assets/skills/Docker.png';
import expressIcon from '../assets/skills/Express.png';
import figmaIcon from '../assets/skills/Figma.png';
import githubIcon from '../assets/skills/GitHub.png';
import javascriptIcon from '../assets/skills/JavaScript.png';
import jenkinsIcon from '../assets/skills/Jenkins.png';
import kubernetesIcon from '../assets/skills/Kubernetes.png';
import mongodbIcon from '../assets/skills/MongoDB.png';
import nginxIcon from '../assets/skills/NGINX.png';
import nextjsIcon from '../assets/skills/Next.js.png';
import nodejsIcon from '../assets/skills/Node.js.png';
import postgresqlIcon from '../assets/skills/PostgresSQL.png';
import pythonIcon from '../assets/skills/Python.png';
import reactIcon from '../assets/skills/React.png';
import redisIcon from '../assets/skills/Redis.png';
import reduxIcon from '../assets/skills/Redux.png';
import tensorflowIcon from '../assets/skills/TensorFlow.png';
import threejsIcon from '../assets/skills/Three.js.png';
import typescriptIcon from '../assets/skills/TypeScript.png';
import vitejsIcon from '../assets/skills/Vite.js.png';
import flowerBgVideo from '../assets/back.webm';

interface CardData {
  id: number;
  color: string;
  label: string;
  icon: string;
  description: string;
}

interface CardState {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  rotateZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetRotateY: number;
  targetRotateZ: number;
  velX: number;
  velY: number;
  velZ: number;
  velRotateY: number;
  velRotateZ: number;
  zIndex: number;
}

const CARDS: CardData[] = [
  { id: 1, color: '#161b22', label: 'JavaScript', icon: javascriptIcon, description: 'The language of the web' },
  { id: 2, color: '#161b22', label: 'TypeScript', icon: typescriptIcon, description: 'Type-safe JavaScript' },
  { id: 3, color: '#161b22', label: 'React', icon: reactIcon, description: 'UI library for the web' },
  { id: 4, color: '#161b22', label: 'Next.js', icon: nextjsIcon, description: 'React framework for production' },
  { id: 5, color: '#161b22', label: 'Node.js', icon: nodejsIcon, description: 'JavaScript runtime built on V8' },
  { id: 6, color: '#161b22', label: 'Express', icon: expressIcon, description: 'Fast, unopinionated web framework' },
  { id: 7, color: '#161b22', label: 'PostgresSQL', icon: postgresqlIcon, description: 'Advanced open source database' },
  { id: 8, color: '#161b22', label: 'MongoDB', icon: mongodbIcon, description: 'NoSQL document database' },
  { id: 9, color: '#161b22', label: 'Redis', icon: redisIcon, description: 'In-memory data structure store' },
  { id: 10, color: '#161b22', label: 'Docker', icon: dockerIcon, description: 'Containerization platform' },
  { id: 11, color: '#161b22', label: 'Kubernetes', icon: kubernetesIcon, description: 'Container orchestration' },
  { id: 12, color: '#161b22', label: 'AWS', icon: awsIcon, description: 'Cloud computing platform' },
  { id: 13, color: '#161b22', label: 'Jenkins', icon: jenkinsIcon, description: 'Automation server for CI/CD' },
  { id: 14, color: '#161b22', label: 'NGINX', icon: nginxIcon, description: 'Web server and reverse proxy' },
  { id: 15, color: '#161b22', label: 'Python', icon: pythonIcon, description: 'Versatile programming language' },
  { id: 16, color: '#161b22', label: 'TensorFlow', icon: tensorflowIcon, description: 'Machine learning framework' },
  { id: 17, color: '#161b22', label: 'Three.js', icon: threejsIcon, description: '3D library for the web' },
  { id: 18, color: '#161b22', label: 'Blender', icon: blenderIcon, description: '3D creation suite' },
  { id: 19, color: '#161b22', label: 'Figma', icon: figmaIcon, description: 'Collaborative interface design' },
  { id: 20, color: '#161b22', label: 'GitHub', icon: githubIcon, description: 'Code hosting platform' },
  { id: 21, color: '#161b22', label: 'Redux', icon: reduxIcon, description: 'Predictable state container' },
  { id: 22, color: '#161b22', label: 'Vite.js', icon: vitejsIcon, description: 'Next generation frontend tooling' },
];

const CARD_WIDTH = 400;
const CARD_HEIGHT = 300;
const SPRING_STRENGTH = 0.08;
const SPRING_DAMPING = 0.75;
const ROPE_COUPLING = 0.035;
const MAX_SCROLL = CARDS.length - 1;
const INITIAL_OFFSET = -1; // Push cards back so they enter after scroll starts

function cardLayout(relIndex: number) {
  const x = relIndex * 320;
  const y = relIndex * -220;
  const z = Math.abs(relIndex) * -120;
  const rotateY = relIndex * -12;
  const rotateZ = relIndex * 1.5;
  return { x, y, z, rotateY, rotateZ };
}

function createInitialStates(): CardState[] {
  return CARDS.map((_, i) => {
    const layout = cardLayout(i - INITIAL_OFFSET);
    return {
      x: layout.x,
      y: layout.y,
      z: layout.z,
      rotateY: layout.rotateY,
      rotateZ: layout.rotateZ,
      targetX: layout.x,
      targetY: layout.y,
      targetZ: layout.z,
      targetRotateY: layout.rotateY,
      targetRotateZ: layout.rotateZ,
      velX: 0,
      velY: 0,
      velZ: 0,
      velRotateY: 0,
      velRotateZ: 0,
      zIndex: CARDS.length - i,
    };
  });
}

export default function NextSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardStatesRef = useRef<CardState[]>(createInitialStates());
  const scrollRef = useRef(INITIAL_OFFSET);
  const targetScrollRef = useRef(INITIAL_OFFSET);
  const selectedCardRef = useRef<number | null>(null);
  const selectAmtRef = useRef<number[]>(new Array(CARDS.length).fill(0));
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const flowerVideoRef = useRef<HTMLVideoElement>(null);

  // Sync targetScrollRef with native scrolling
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  // Map 0 - 0.8 of scroll to the 3D cards animation
  const previousScrollY = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Cap the cards animation before the exit transition starts
    const cardProgress = Math.min(1, latest / 0.8);
    // Move from INITIAL_OFFSET to MAX_SCROLL
    targetScrollRef.current = INITIAL_OFFSET + cardProgress * (MAX_SCROLL - INITIAL_OFFSET);
    // Deselect card when user scrolls
    selectedCardRef.current = null;

    // Trigger video playback natively (perfectly smooth, no scrub lag)
    if (previousScrollY.current === 0 && latest > 0) {
      if (flowerVideoRef.current) {
        flowerVideoRef.current.currentTime = 0;
        flowerVideoRef.current.play().catch(() => {});
      }
    }
    previousScrollY.current = latest;
  });

  // Map 0.8 - 1.0 of scroll to the exit animation (zoom/blur/fade)
  const sectionScale = useTransform(smoothProgress, [0.8, 1], [1, 1.4]);
  const sectionOpacity = useTransform(smoothProgress, [0.8, 0.95], [1, 0]);
  const sectionBlur = useTransform(smoothProgress, [0.8, 1], [0, 18]);
  const sectionFilter = useTransform(sectionBlur, (v) => `blur(${v}px)`);

  const handleCardClick = useCallback((index: number) => {
    selectedCardRef.current = selectedCardRef.current === index ? null : index;
  }, []);

  // Apply transforms directly to DOM nodes
  const applyTransforms = useCallback(() => {
    const states = cardStatesRef.current;
    const selectAmt = selectAmtRef.current;
    const activeCardFloat = scrollRef.current;

    for (let i = 0; i < CARDS.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const state = states[i];
      const sel = selectAmt[i];

      const selScale = 1 + sel * 0.18;
      const selRotateY = state.rotateY * (1 - sel);
      const selZ = state.z + sel * 150;
      const selLift = sel * -30;
      const selSlide = sel * 350; // slide right
      
      const relIndex = i - activeCardFloat;
      let opacity = 1;
      if (relIndex < -5) opacity = 0;
      else if (relIndex < -3) opacity = (relIndex - -5) / 2;
      else if (relIndex > 5) opacity = 0;
      else if (relIndex > 3) opacity = 1 - (relIndex - 3) / 2;

      el.style.transform = `translate3d(calc(15vw + ${state.x + selSlide}px), calc(55vh + ${state.y + selLift}px), ${selZ}px) scale(${selScale}) rotateY(${selRotateY}deg) rotateZ(${state.rotateZ}deg)`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(state.zIndex + (sel > 0.1 ? 1000 : 0));
    }
  }, []);

  const updatePhysics = useCallback((dt: number) => {
    const states = cardStatesRef.current;
    const timeScale = Math.min(dt * 60, 3);

    // Smooth scroll follow with slower global tracking for "slow down" feel
    const scrollDiff = targetScrollRef.current - scrollRef.current;
    scrollRef.current += scrollDiff * 1 * timeScale;
    
    const activeCardFloat = scrollRef.current;

    for (let i = 0; i < states.length; i++) {
      const relIndex = i - activeCardFloat;
      const layout = cardLayout(relIndex);

      states[i].targetX = layout.x;
      states[i].targetY = layout.y;
      states[i].targetZ = layout.z;
      states[i].targetRotateY = layout.rotateY;
      states[i].targetRotateZ = layout.rotateZ;

      const dx = states[i].targetX - states[i].x;
      const dy = states[i].targetY - states[i].y;
      const dz = states[i].targetZ - states[i].z;
      const dRy = states[i].targetRotateY - states[i].rotateY;
      const dRz = states[i].targetRotateZ - states[i].rotateZ;

      states[i].velX += dx * SPRING_STRENGTH * timeScale;
      states[i].velY += dy * SPRING_STRENGTH * timeScale;
      states[i].velZ += dz * SPRING_STRENGTH * timeScale;
      states[i].velRotateY += dRy * SPRING_STRENGTH * timeScale;
      states[i].velRotateZ += dRz * SPRING_STRENGTH * timeScale;

      // Rope coupling - each card gets pushed by its left neighbor's lag
      if (i > 0) {
        const neighborLagX = states[i - 1].x - states[i - 1].targetX;
        const neighborLagY = states[i - 1].y - states[i - 1].targetY;
        states[i].velX += neighborLagX * ROPE_COUPLING * timeScale;
        states[i].velY += neighborLagY * ROPE_COUPLING * timeScale;
      }

      states[i].velX *= Math.pow(SPRING_DAMPING, timeScale);
      states[i].velY *= Math.pow(SPRING_DAMPING, timeScale);
      states[i].velZ *= Math.pow(SPRING_DAMPING, timeScale);
      states[i].velRotateY *= Math.pow(SPRING_DAMPING, timeScale);
      states[i].velRotateZ *= Math.pow(SPRING_DAMPING, timeScale);

      states[i].x += states[i].velX * timeScale;
      states[i].y += states[i].velY * timeScale;
      states[i].z += states[i].velZ * timeScale;
      states[i].rotateY += states[i].velRotateY * timeScale;
      states[i].rotateZ += states[i].velRotateZ * timeScale;

      states[i].zIndex = CARDS.length - i;
    }
  }, []);

  const updateSelection = useCallback((dt: number) => {
    const timeScale = Math.min(dt * 60, 3);
    const selectAmt = selectAmtRef.current;

    for (let i = 0; i < CARDS.length; i++) {
      const target = selectedCardRef.current === i ? 1 : 0;
      const diff = target - selectAmt[i];
      selectAmt[i] += diff * 0.15 * timeScale;
      selectAmt[i] = Math.max(0, Math.min(1, selectAmt[i]));
    }
  }, []);

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    updatePhysics(dt);
    updateSelection(dt);
    applyTransforms();

    rafRef.current = requestAnimationFrame(animate);
  }, [updatePhysics, updateSelection, applyTransforms]);

  useEffect(() => {
    // Apply initial transforms
    applyTransforms();

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, applyTransforms]);

  return (
    <section ref={wrapperRef} style={{ minHeight: '1000vh', position: 'relative', background: '#0e0e0e' }}>
      <motion.div
        ref={containerRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
          userSelect: 'none',
          scale: sectionScale,
          opacity: sectionOpacity,
          filter: sectionFilter,
        }}
      >
      {/* Ambient Green Glow (Matching Landing Page) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          zIndex: 1, // Behind cards (zIndex: 10) and text
          pointerEvents: 'none',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Flower Background Video Container */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: '2vw',
          width: '30vw', // Increased by 20%
          maxWidth: '420px', // Increased by 20%
          height: '70vh', // Scaled up
          zIndex: 5, // Under text but among cards
          pointerEvents: 'none',
          overflow: 'hidden', // Ensure video doesn't spill
        }}
      >
        <video
          ref={flowerVideoRef}
          src={flowerBgVideo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.9,
          }}
          muted
          playsInline
          autoPlay
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '8vh',
          left: '4vw',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          MY TECHSTACK
        </h1>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.05em',
            marginTop: 8,
          }}
        >
          STACK COLLECTION<span style={{ fontSize: '0.7em', verticalAlign: 'super', marginLeft: 4 }}>({CARDS.length})</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '4vh',
          right: '4vw',
          zIndex: 100,
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        SCROLL TO SURF
      </div>

      {/* 3D Card Container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          perspective: '1200px',
          perspectiveOrigin: '30% 70%',
        }}
      >
        {CARDS.map((card, i) => {
          return (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                left: 0,
                top: 0,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                cursor: 'pointer'
              }}
              onClick={() => handleCardClick(i)}
            >
              {/* Card content */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  backgroundColor: card.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <img 
                  src={card.icon} 
                  alt={card.label} 
                  style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '20px', pointerEvents: 'none' }}
                />

                {/* Card info */}
                <div style={{ textAlign: 'center', padding: '0 20px', pointerEvents: 'none' }}>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 600, color: '#fff', margin: '0 0 8px 0' }}>
                    {card.label}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    {card.description}
                  </p>
                </div>

                {/* Card number */}
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontFamily: "'Inter', monospace",
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </motion.div>
    </section>
  );
}
