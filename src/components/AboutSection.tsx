import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useMemo } from 'react';
import bgImage from '../assets/guts.webp';

const QUOTE = "I believe anything that gets our blood racing is probably worth doing.";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress while the section is pinned
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- Sync timeline ---
  // 0.00 → 0.40  Pixel curtain dissolves away
  // 0.35 → 0.65  Text + overlay fade IN  (overlaps slightly, extremely slow cinematic fade)
  // 0.65 → 0.75  Everything holds (enjoy the view)
  // 0.75 → 1.00  Text + overlay fade OUT smoothly into black

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.65, 0.75, 1.00],
    [0,    1,    1,    0]
  );

  const textOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.65, 0.75, 1.00],
    [0,    1,    1,    0]
  );

  const textScale = useTransform(
    scrollYProgress,
    [0.35, 0.65, 0.75, 1.00],
    [0.96, 1,    1,    1.05]
  );

  return (
    <section
      ref={containerRef}
      className="bg-[#0a0a0a] text-white min-h-[250vh] relative"
    >
      {/* Sticky container that stays fixed while scrolling through the 300vh */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background Image (revealed once curtain dissolves) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Dark overlay — fades in just before text, matched to text timeline */}
        <motion.div
          className="absolute inset-0 bg-black/60 pointer-events-none z-10"
          style={{ opacity: overlayOpacity }}
        />

        {/* Pixel Curtain — dissolves during the FIRST third of scroll */}
        <PixelCurtain scrollProgress={scrollYProgress} />

        {/* Main Quote Text */}
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 relative z-30 flex items-center justify-center">
          <motion.h2
            className="text-lg md:text-xl lg:text-3xl leading-tight text-center font-sans font-thin tracking-[0.2em] text-white/90"
            style={{ opacity: textOpacity, scale: textScale }}
          >
            {QUOTE}
          </motion.h2>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pixel Curtain
// ---------------------------------------------------------------------------

function PixelCurtain({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const cols = 25;
  const rows = 15;
  const totalPixels = cols * rows;

  const pixels = useMemo(() => {
    return Array.from({ length: totalPixels }).map((_, i) => {
      // Curtain dissolves between scroll 0.0 → 0.40 (slower reveal)
      // Each pixel gets a random window inside that range so they pop off
      // at staggered times rather than all at once.
      const windowSize = 0.40;      // total range the dissolve spans
      const pixelDuration = 0.10;   // how long each individual pixel takes to fade

      const start = Math.random() * (windowSize - pixelDuration);
      const end = start + pixelDuration;

      return { id: i, start, end };
    });
  }, [totalPixels]);

  return (
    <div
      className="absolute inset-0 z-20 grid pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {pixels.map((p) => (
        <Pixel key={p.id} progress={scrollProgress} start={p.start} end={p.end} />
      ))}
    </div>
  );
}

function Pixel({
  progress,
  start,
  end,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  // Pixel goes from fully opaque (curtain visible) → transparent (curtain gone)
  const opacity = useTransform(progress, [start, end], [1, 0]);

  return (
    <motion.div
      // Slight oversize prevents anti-aliasing gaps between grid cells
      className="bg-[#0a0a0a] w-[102%] h-[102%]"
      style={{ opacity }}
    />
  );
}