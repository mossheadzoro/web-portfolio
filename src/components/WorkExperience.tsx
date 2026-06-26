import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EXPERIENCES = [
  {
    company: "Techno India University",
    role: "Student",
    period: "2023 - Present",
    description: "Undergoing B.Tech in Computer Science & Engineering ",
  },
  {
    company: "Finalist at Neurathon 2026",
    role: "Frontend and Integration Developer",
    period: "Feb 2026",
    description: "Built and Deployed a working MVP of 'Event-Swarm' a event management platform, in 48 Hours non-stop coding",
  },
  {
    company: "Moual",
    role: "CEO and Lead Developer",
    period: "2026 - present",
    description: "Leading the Development of a revolutionary India's First AI-powered Modern Jwellery ERP  Platform",
  }
];

export default function WorkExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through the entire timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="bg-[#0a0a0a] text-white py-32 min-h-screen relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <h2 
          className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase mb-24 text-center"
          style={{ fontFamily: "'Bodoni Moda', serif" }}
        >
          Work Experience
        </h2>

        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />

          {/* Animated Glow Line that fills up as you scroll */}
          <motion.div 
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-neonGreen -translate-x-1/2 origin-top"
            style={{ 
              scaleY: useTransform(scrollYProgress, [0.2, 0.8], [0, 1]),
              boxShadow: "0 0 20px 2px rgba(16, 185, 129, 0.5)"
            }}
          />

          <div className="space-y-24">
            {EXPERIENCES.map((exp, idx) => (
              <TimelineItem key={idx} experience={exp} index={idx} total={EXPERIENCES.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ experience, index, total }: { experience: typeof EXPERIENCES[0], index: number, total: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 80%", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  const isEven = index % 2 === 0;

  return (
    <div ref={itemRef} className={`relative flex items-center justify-between w-full ${isEven ? 'flex-row-reverse' : ''} md:flex-row`}>
      
      {/* Left side (empty on small screens, alternating on desktop) */}
      <div className={`hidden md:block w-5/12 ${isEven ? 'text-left' : 'text-right'}`}>
        {isEven ? (
          <motion.div style={{ opacity, y }} className="pr-8">
            <ExperienceContent experience={experience} />
          </motion.div>
        ) : null}
      </div>

      {/* Central Node */}
      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
        <motion.div 
          className="w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-neonGreen z-10"
          style={{ scale }}
        />
        <motion.div 
          className="absolute w-12 h-12 rounded-full bg-neonGreen/20 blur-md z-0"
          style={{ scale, opacity }}
        />
      </div>

      {/* Right side (content on small screens, alternating on desktop) */}
      <div className={`w-full pl-8 md:pl-0 md:w-5/12 ${isEven ? 'text-left' : 'text-left'}`}>
        {!isEven || typeof window !== 'undefined' && window.innerWidth < 768 ? (
          <motion.div style={{ opacity, y }} className={!isEven ? 'md:pl-8' : ''}>
            <ExperienceContent experience={experience} />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function ExperienceContent({ experience }: { experience: typeof EXPERIENCES[0] }) {
  return (
    <div className="bg-[#111] border border-white/5 p-8 hover:border-white/20 transition-colors duration-300">
      <span className="text-neonGreen font-mono text-sm tracking-widest uppercase mb-2 block">
        {experience.period}
      </span>
      <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">
        {experience.role}
      </h3>
      <h4 className="text-lg text-gray-400 font-light mb-4">
        {experience.company}
      </h4>
      <p className="text-sm text-gray-500 leading-relaxed font-light">
        {experience.description}
      </p>
    </div>
  );
}
