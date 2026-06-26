import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";

// ─── card data (15 Cards) ──────────────────────────────────────────────────
const CARDS = [
  { id: 0, title: "Brand Identity", tag: "Design", color: "#1a1a2e" },
  { id: 1, title: "Motion Systems", tag: "Animation", color: "#16213e" },
  { id: 2, title: "3D Interfaces", tag: "WebGL", color: "#0f3460" },
  { id: 3, title: "Interaction Design", tag: "UX", color: "#1b262c" },
  { id: 4, title: "Design Systems", tag: "Tokens", color: "#162447" },
  { id: 5, title: "Generative Art", tag: "Creative", color: "#1a1a2e" },
  { id: 6, title: "Data Visualization", tag: "Data", color: "#0d1b2a" },
  { id: 7, title: "E-Commerce", tag: "Web", color: "#1b263b" },
  { id: 8, title: "Mobile Apps", tag: "App", color: "#415a77" },
  { id: 9, title: "Spatial Computing", tag: "AR/VR", color: "#778da9" },
  { id: 10, title: "Creative Coding", tag: "Code", color: "#0d0d0d" },
  { id: 11, title: "Type Design", tag: "Typography", color: "#14213d" },
  { id: 12, title: "Sound Design", tag: "Audio", color: "#000000" },
  { id: 13, title: "Installation Art", tag: "Physical", color: "#1a1a1a" },
  { id: 14, title: "Machine Learning", tag: "AI", color: "#112233" },
];

const CARD_W = 460;
const CARD_H = 640;

// ─── component ────────────────────────────────────────────────────────────────
export default function NextSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track the scroll progress of the container (0 to 1)
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track if the user is currently scrolling
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<any>(null);

  useMotionValueEvent(scrollY, "change", () => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150); // Scrolling is considered "done" 150ms after the last scroll event
  });

  // Smooth out the scroll progress for spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <>
      <style>{`
        .ns-section {
          /* Tall container allows for long scrolling */
          min-height: 800vh;
          background: #0a0a0f;
          position: relative;
        }
        .ns-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }
        .ns-card {
          position: absolute;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 20px;
          transform-style: preserve-3d;
          box-shadow: 
            0 24px 60px rgba(0,0,0,0.6), 
            0 1px 0 rgba(255,255,255,0.08) inset;
          overflow: hidden;
          background: linear-gradient(145deg, var(--card-bg) 0%, #0d0d18 100%);
        }
        .ns-card-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 34px 30px;
          position: relative;
        }
        .ns-card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .ns-card-tag {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 8px 14px;
          width: fit-content;
        }
        .ns-card-title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-top: auto;
        }
        .ns-card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
        }
        .ns-card-num {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
          letter-spacing: 0.1em;
        }
        .ns-card-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
        }
      `}</style>
      
      <section className="ns-section" ref={containerRef}>
        <div className="ns-sticky">
          {CARDS.map((card, i) => (
            <Card 
              key={card.id} 
              card={card} 
              index={i} 
              total={CARDS.length} 
              progress={smoothProgress}
              isScrolling={isScrolling}
            />
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Individual Card ──────────────────────────────────────────────────────────
type CardProps = {
  card: typeof CARDS[0];
  index: number;
  total: number;
  progress: MotionValue<number>;
  isScrolling: boolean;
};

function Card({ card, index, total, progress, isScrolling }: CardProps) {
  // Map progress (0 to 1) to the active card index (0 to total - 1)
  const activeIndex = useTransform(progress, [0, 1], [0, total - 1]);
  
  // Relative index: 0 means this card is currently centered.
  // > 0 means it's waiting (top-right)
  // < 0 means it's passed (bottom-left)
  const relIndex = useTransform(activeIndex, (v) => index - v);

  // Map relIndex to base 3D space
  const baseX = useTransform(relIndex, (v) => v * 320); // Spacing horizontally
  const baseY = useTransform(relIndex, (v) => v * -220); // Spacing vertically
  const baseZ = useTransform(relIndex, (v) => Math.abs(v) * -120); // Push non-active cards back
  const baseRotateY = useTransform(relIndex, (v) => v * -12); // Rome-like perspective twist
  const baseRotateZ = useTransform(relIndex, (v) => v * 1.5); // Slight twist along the arc
  
  // Smoothly fade cards in and out when they are far away from the center
  const opacity = useTransform(relIndex, [-5, -3, 3, 5], [0, 1, 1, 0]);

  // Selection state (0 to 1) controlled by spring for smooth in/out
  const [isSelected, setIsSelected] = useState(false);
  const hoverProgress = useSpring(0, { stiffness: 400, damping: 30 });

  // Reset selection if the user starts scrolling
  useEffect(() => {
    if (isScrolling) {
      setIsSelected(false);
    }
  }, [isScrolling]);

  useEffect(() => {
    // Open if selected and not scrolling
    if (isSelected && !isScrolling) {
      hoverProgress.set(1);
    } else {
      hoverProgress.set(0);
    }
  }, [isSelected, isScrolling, hoverProgress]);

  // Combine base scroll transforms with selection offsets using array-based useTransform
  const x = useTransform([baseX, hoverProgress], ([b, h]) => (b as number) + (h as number) * -300);
  const y = useTransform([baseY, hoverProgress], ([b, h]) => (b as number) + (h as number) * -30);
  const z = useTransform([baseZ, hoverProgress], ([b, h]) => (b as number) + (h as number) * 150);
  const rotateY = useTransform([baseRotateY, hoverProgress], ([b, h]) => (b as number) * (1 - (h as number)) + (h as number) * 0);
  const rotateZ = useTransform([baseRotateZ, hoverProgress], ([b, h]) => (b as number) * (1 - (h as number)) + (h as number) * -5);

  return (
    <motion.div
      className="ns-card cursor-pointer"
      onClick={() => setIsSelected(!isSelected)}
      style={{
        x,
        y,
        z,
        rotateY,
        rotateZ,
        opacity,
        "--card-bg": card.color
      } as any}
    >
      <div className="ns-card-inner">
        <div className="ns-card-shine" />
        <span className="ns-card-tag">{card.tag}</span>
        <div>
          <div className="ns-card-title">{card.title}</div>
          <div className="ns-card-foot">
            <span className="ns-card-num">{(index + 1).toString().padStart(2, '0')}</span>
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}