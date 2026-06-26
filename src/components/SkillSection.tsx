import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import wpBg from '../assets/wp.jpg';

const SKILLS = [
  { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Redux", "Next.js"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"] },
  { category: "Design", items: ["Figma", "Framer Motion", "Prototyping", "Wireframing", "Design Systems"] },
  { category: "DevOps", items: ["Kubernetes", "Docker", "AWS", "Jenkins", "Git"] },
];

export default function SkillSection() {
  const CURTAINS = 5;
  const wrapperRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  // Map 0.7 - 1.0 of scroll to the exit animation (zoom/blur/fade)
  const sectionScale = useTransform(smoothProgress, [0.7, 1], [1, 1.4]);
  const sectionOpacity = useTransform(smoothProgress, [0.7, 0.95], [1, 0]);
  const sectionBlur = useTransform(smoothProgress, [0.7, 1], [0, 18]);
  const sectionFilter = useTransform(sectionBlur, (v) => `blur(${v}px)`);

  return (
    <section ref={wrapperRef} style={{ minHeight: '300vh', position: 'relative' }}>
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center py-32 px-8 text-white"
        style={{
          backgroundImage: `url(${wpBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          scale: sectionScale,
          opacity: sectionOpacity,
          filter: sectionFilter,
        }}
      >
      {/* Slight dark overlay so text stays readable against wp.jpg */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Staggered Curtains Wipe */}
      <motion.div 
        className="absolute inset-0 z-10 flex"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }} // Start wipe shortly after entering viewport
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        {Array.from({ length: CURTAINS }).map((_, i) => (
          <motion.div 
            key={i}
            // #0e0e0e perfectly matches the previous section's background color
            className="flex-1 bg-[#0e0e0e] origin-top"
            variants={{
              hidden: { scaleY: 1 },
              visible: { 
                scaleY: 0, 
                transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] } 
              }
            }}
          />
        ))}
      </motion.div>

      {/* Text Content - Appears when reaching center */}
      <motion.div 
        className="w-full max-w-6xl relative z-20"
        initial="hidden"
        whileInView="visible"
        // triggers exactly when the element crosses the middle 20% of the screen
        viewport={{ once: false, margin: "-40% 0px -40% 0px" }}
        variants={{
          hidden: { opacity: 0, y: 80, filter: 'blur(10px)' },
          visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { duration: 1, ease: "easeOut" } 
          }
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
          <h2 
            className="text-[8vw] md:text-[4.5vw] font-bold leading-none tracking-tighter lg:w-1/2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            EXPERTISE <br className="hidden lg:block" /><span className="text-gray-500 italic font-light">&</span> SKILLS
          </h2>
          
          <div className="lg:w-5/12 flex flex-col gap-8">
            <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed border-l-2 border-emerald-500 pl-6 italic">
              "I thrive on solving real-world problems, turning ideas into clean, maintainable code, and learning through experimentation. You'll find me building side projects, diving into new tech stacks, or simply exploring what's next in the world of web development."
            </p>
            <div>
              <button 
                className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                My Resume
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {SKILLS.map((skillGroup, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 pb-4 border-b border-white/10 text-gray-300">
                {skillGroup.category}
              </h3>
              <ul className="flex flex-col gap-4">
                {skillGroup.items.map((item, itemIdx) => (
                  <li 
                    key={itemIdx}
                    className="text-lg md:text-xl text-gray-400 hover:text-white transition-colors duration-300 cursor-default"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
      </motion.div>
    </section>
  );
}
