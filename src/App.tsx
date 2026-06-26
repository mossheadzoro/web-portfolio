import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import type { MouseEvent } from 'react';
import { useRef, useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import SkillSection from './components/SkillSection';
import ProjectSection from './components/ProjectSection';
import OtherProjects from './components/OtherProjects';
import WorkExperience from './components/WorkExperience';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import NextSection from './components/NextSection2';

function App() {
  // ── existing 3D parallax state ──
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-15px", "15px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-15px", "15px"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // ── scroll-driven zoom/blur/fade ──
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth out the raw scroll value for buttery animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // as you scroll down through the hero: scale up, blur, fade out
  const heroScale   = useTransform(smoothProgress, [0, 1], [1, 1.4]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const heroBlur    = useTransform(smoothProgress, [0, 0.8], [0, 18]);
  // convert blur number → CSS filter string
  const heroFilter  = useTransform(heroBlur, (v) => `blur(${v}px)`);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    // outer wrapper — needs to be tall enough to scroll through
    <div className="bg-black text-white font-sans selection:bg-neonGreen selection:text-black">

      {/* ── SECTION 1: Hero (sticky so it stays while scrolling) ── */}
      <div ref={containerRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Initial page load animation wrapper */}
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, filter: "blur(20px)", scale: 1.15 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >

          {/* Everything inside scales/blurs/fades together */}
          <motion.div
            className="absolute inset-0"
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              filter: heroFilter,
            }}
          >
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-neonGreen/30 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vw] h-[25vw] bg-neonGreen/60 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>

          {/* Nav — fades out too */}
          <motion.nav
            className="absolute top-0 left-0 right-0 flex justify-between items-center p-8 z-10"
            style={{ opacity: heroOpacity }}
          >
            {/* Nav content removed as requested */}
          </motion.nav>

          {/* Main hero content — scales + fades */}
          <motion.main
            className="absolute inset-0 flex flex-col items-start lg:items-center justify-start px-4 md:px-8 pt-2 md:pt-4 z-10"
            style={{ scale: heroScale, opacity: heroOpacity }}
          >
            <div className="w-full max-w-7xl relative z-20 mt-4 md:mt-8 md:-ml-4 lg:-ml-12 text-left">
              {/* Name */}
              <h1 className="flex items-baseline gap-2 md:gap-4 flex-wrap">
                <span className="text-[14vw] md:text-[10vw] leading-[1] font-normal text-white tracking-tight" style={{ fontFamily: "'Italiana', serif" }}>
                  Ankan
                </span>
                <span className="text-[14vw] md:text-[10vw] leading-[1] font-normal text-white italic tracking-tight" style={{ fontFamily: "'Italiana', serif" }}>
                  Das
                </span>
              </h1>

              {/* Skills with sibling-dim hover */}
              {(() => {
                return (
                  <motion.div
                    className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4 text-base md:text-3xl"
                    style={{ fontFamily: "'Italiana', serif" }}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
                    }}
                  >
                    {["Full Stack Web Developer", "Full Stack App Developer", "DevOps Engineer", "3D Designer",].map((skill, i) => (
                      <div
                        key={skill}
                        className="overflow-hidden"
                      >
                        <motion.p
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="cursor-pointer inline-block py-1 md:py-2"
                          variants={{
                            hidden: { y: "100%", opacity: 0 },
                            visible: {
                              y: "0%", opacity: 1,
                              transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                            },
                          }}
                          animate={{
                            opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.2,
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <span className="text-neonGreen mr-2">a</span> {skill}
                        </motion.p>
                      </div>
                    ))}
                  </motion.div>
                );
              })()}
            </div>

            {/* Profile image with 3D parallax */}
            <div className="absolute bottom-0 left-0 w-full flex items-end justify-center pointer-events-none z-10 h-[90vh]">
              <motion.div
                className="relative w-[180vw] sm:w-[130vw] md:w-[85vw] lg:w-[75vw] h-full pointer-events-auto cursor-crosshair perspective-1000 flex items-end justify-center"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0 overflow-visible flex items-end justify-center"
                  style={{ x: translateX, y: translateY, transformStyle: "preserve-3d" }}
                >
                  <img
                    src="/profile.png"
                    alt="Profile"
                    className="w-full h-full object-contain object-bottom scale-[1.35] md:scale-90 origin-bottom "
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.main>

          {/* Scroll indicator */}
          <motion.div
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-10 text-xs tracking-widest text-gray-400"
            style={{ opacity: heroOpacity }}
          >
            <div className="h-16 w-[1px] bg-gray-600" />
            <span className="rotate-90 origin-center mt-6">SCROLL</span>
          </motion.div>

          </motion.div>

        </div>
      </div>

      {/* ── SECTION 2: Whatever comes next ── */}
      {/* <NextSection /> */}
      <NextSection/>
      
      {/* ── SECTION 3: Skills ── */}
      <SkillSection />
      <ProjectSection />
      <OtherProjects />
      <WorkExperience />
      <AboutSection />
      <ContactSection />

      {/* ── Fixed Social Icons ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
        <a href="https://www.linkedin.com/in/ankan-das-240082328/" className="text-white/30 hover:text-neonGreen transition-colors duration-300">
          <FiLinkedin className="w-5 h-5" />
        </a>
        <a href="https://github.com/mossheadzoro" className="text-white/30 hover:text-neonGreen transition-colors duration-300">
          <FiGithub className="w-5 h-5" />
        </a>
        <a href="https://leetcode.com/u/hWfYalhfgG/" className="text-white/30 hover:text-neonGreen transition-colors duration-300">
          <Code2 className="w-5 h-5" />
        </a>
        <a href="https://www.instagram.com/roronoa_d_lost/" className="text-white/30 hover:text-neonGreen transition-colors duration-300">
          <FiInstagram className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

export default App;
