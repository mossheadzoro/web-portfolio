import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import jwelVideo from '../assets/jwel-vid.webm';
import portfolioImg from '../assets/3d.png';
import MouseTrackingOrb from './MouseTrackingOrb';

const PROJECTS = [
  {
    title: "Moual: A complete JwelRP",
    description: "A High Featured Cloud Based Jewellery ERP that handles Complete Workflow of Jewellery Retail Business with Role Based control and Multi Branch Management at one Click Dashboard. It includes Inventory, Billing, RFID system, Karigar Management,Tonch Managment,Customer Reports,Feedback and many more all combined at one ERP ready to use for all sector of Jwellery Retail Buisness.",
    video: jwelVideo,
    link: "#",
  },
  {
    title: "Event-Swarm: A multi-agent AI Orchestration System",
    description: "EventSwarm is a dynamic AI orchestration platform designed to streamline and automate complex workflows through the intelligent interaction of multiple AI agents. It bridges the gap between simple chatbot interfaces and complex enterprise automation tools by allowing users to define custom agents that can create and organise events at one go. ",
    video: null,
    link: "https://event-swarm.vercel.app/",
  },
  {
    title: "3D-Portfolio",
    description: "A stunning 3D portfolio website for a web developer. This project features a fully immersive 3D environment built with Three.js and React Three Fiber,Blender, showcasing the my projects, skills, and experience in a visually gamified one-piece world.",
    image: portfolioImg,
    link: "https://3-d-portfolio-seven-delta.vercel.app/",
  }
];

export default function ProjectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background fixed heading */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h2 
          className="text-[18vw] md:text-[12vw] font-bold text-white/10 mb-9 tracking-tighter uppercase leading-none text-center px-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Top 3 Projects
        </h2>
      </div>

      {/* Project Sections */}
      <div className="relative z-10 -mt-[100vh] pt-[50vh]">
        {PROJECTS.map((project, idx) => (
          <ProjectCard key={idx} project={project} index={idx} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Animate vertically in and out, and fade in and out based on scroll progress
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [150, 0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Sequence Animations (scrubbed via scrollbar)
  
  // 1. Text appearance: from 25% to 35% of scroll
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.25, 0.35], [50, 0]);

  // 2. Spotlight fall: from 35% to 42% (starts EXACTLY after text finishes)
  const spotlightY = useTransform(scrollYProgress, [0.35, 0.42], ["-100%", "0%"]);
  const spotlightOpacity = useTransform(scrollYProgress, [0.35, 0.42], [0, 1]);

  // 3. Ring fall: from 42% to 52% (starts EXACTLY after spotlight finishes)
  const ringY = useTransform(scrollYProgress, [0.42, 0.52], [-500, 0]);
  const ringOpacity = useTransform(scrollYProgress, [0.42, 0.45], [0, 1]);

  // 4. Sharp Image Slide (Project 3) - Slides from left to right
  const p3ImageX = useTransform(scrollYProgress, [0.40, 0.45], [-800, 0]);
  const p3ImageOpacity = useTransform(scrollYProgress, [0.40, 0.45], [0, 1]);

  return (
    <section ref={cardRef} className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        style={{ y, opacity, scale }}
        className="w-full min-h-[85vh] lg:h-[85vh] max-w-[1400px] flex flex-col lg:flex-row items-center"
      >
        {/* Project Information Side */}
        <motion.div 
          className="w-full lg:w-1/2 lg:flex-1 p-8 lg:p-16 flex flex-col justify-center space-y-6 z-10"
          style={{ opacity: textOpacity, y: textY }}
        >
           <div className="space-y-2">
              <span className="text-gray-500 font-mono tracking-widest text-sm uppercase">
                0{index + 1} / 03
              </span>
              <h3 
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >
                {project.title}
              </h3>
           </div>
           
           <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-xl">
             {project.description}
           </p>
           
           <div className="pt-2">
             <a 
               href={project.link}
               target="_blank"
               rel="noreferrer"
               className="inline-block px-10 py-4 bg-white text-black font-semibold tracking-wide uppercase text-sm rounded-full hover:scale-105 transition-transform duration-300"
             >
               Visit Project
             </a>
           </div>
        </motion.div>

        {/* 3D Model / Video Side */}
        <div className="w-full h-[40vh] lg:h-full lg:w-1/2 lg:flex-1 relative flex items-center justify-center overflow-hidden mix-blend-screen z-0">
           {index === 1 ? (
             <MouseTrackingOrb />
           ) : index === 2 ? (
             <div className="relative w-full h-full flex items-center justify-center">
               {/* Background Green Glow */}
               <motion.div 
                 style={{ opacity: p3ImageOpacity }}
                 className="absolute w-[300px] h-[300px] bg-emerald-500/30 blur-[100px] rounded-full"
               />
               
               {/* 3D Image */}
               <motion.img 
                 src={(project as any).image} 
                 alt="3D Portfolio" 
                 style={{ x: p3ImageX, opacity: p3ImageOpacity }}
                 className="relative z-10 w-full h-full object-contain scale-110 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]"
               />
             </div>
           ) : project.video ? (
             <>
               {/* Spotlight Effect */}
               <motion.div 
                 style={{ y: spotlightY, opacity: spotlightOpacity }}
                 className="absolute top-0 w-3/4 h-[80%] bg-gradient-to-b from-white/30 via-white/5 to-transparent blur-3xl rounded-t-full pointer-events-none"
               />

               {/* Falling Ring (Video) */}
               <motion.video 
                 src={project.video}
                 style={{ y: ringY, opacity: ringOpacity }}
                 className="w-full h-full object-cover scale-110 pointer-events-none"
                 autoPlay
                 loop
                 muted
                 playsInline
               />
             </>
           ) : (
             <div className="text-white/30 tracking-widest uppercase">
               Next Project Visual Placeholder
             </div>
           )}
        </div>
      </motion.div>
    </section>
  );
}
