import { motion, useAnimationFrame, useMotionValue, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const OTHER_PROJECTS = [
  { title: "Civic Fix", description: "A cutting-edge experimental mobile app that connects citizen with there municipal area helps to solve every small to serious problem,User can track report upvote problems in there local area", color: "#ef4444" },
  { title: "Eco-home", description: "AI based energy saving system for homes and  apartment to track electricity bills,appliance,recommending every oppurtunity to save money reducing carbon footprint.", color: "#3b82f6" },
  { title: "Chillies-n-Spices", description: "A Full-Stack Pizza Ordering System: My First FullStack Project", color: "#10b981" },
  { title: "Hire Junc", description: "A Freelance app that supports realtime escrow system and an algorithm based work-suggestion for new-freelancers", color: "#f59e0b" },
];

export default function OtherProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const x = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(0);

  // Measure the width of one exact set of cards to know exactly when to wrap
  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        setHalfWidth(contentRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Frame-by-frame auto-scroll
  useAnimationFrame((_t, delta) => {
    // Only auto-scroll if it's in view, not hovered, not dragged, and we have measured the width
    if (!isInView || isHovered || isDragging || halfWidth === 0) return;

    let moveBy = 0.05 * delta; // Speed of the auto-scroll
    let currentX = x.get();
    
    currentX -= moveBy;
    
    // Infinite loop wrap left
    if (currentX <= -halfWidth) {
      currentX += halfWidth;
    }
    
    x.set(currentX);
  });

  // Handle manual dragging infinite wrap
  const handleDrag = () => {
    let currentX = x.get();
    if (currentX <= -halfWidth) {
      x.set(currentX + halfWidth);
    } else if (currentX > 0) {
      x.set(currentX - halfWidth);
    }
  };

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white py-32 overflow-hidden relative min-h-screen flex flex-col justify-center">
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 mb-20 z-10">
        <h2 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase"
          style={{ fontFamily: "'Bodoni Moda', serif" }}
        >
          My Other Projects
        </h2>
      </div>

      {/* Full width Carousel Container */}
      <div className="w-full overflow-hidden py-32 -my-24">
        <motion.div 
          className="flex flex-nowrap w-max cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -10000, right: 10000 }} // Allow massive drag distances
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* We render the set of projects twice to create a seamless infinite loop */}
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} ref={setIdx === 0 ? contentRef : null} className="flex gap-10 pr-10">
              {OTHER_PROJECTS.map((project, idx) => (
                <div 
                  key={`${setIdx}-${idx}`}
                  className="relative group cursor-pointer"
                  style={{
                    // 3 width : 4 height ratio
                    width: '300px',
                    height: '400px',
                  }}
                >
                  {/* Card Body - Sharp corners (no rounded), removed border */}
                  <div className="w-full h-full bg-[#111] flex flex-col relative z-10 transition-transform duration-500 ease-out group-hover:scale-[1.05]">
                    
                    {/* Top Half: Image Placeholder (Colors for now) */}
                    <div 
                      className="h-1/2 w-full relative overflow-hidden"
                      style={{ backgroundColor: project.color }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    {/* Bottom Half: Content */}
                    <div className="h-1/2 w-full p-6 flex flex-col justify-between bg-[#111]">
                      <div>
                        <h3 className="text-xl font-bold mb-2 tracking-tight text-white">{project.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                      <button className="text-[10px] uppercase tracking-widest font-bold border-b border-white/30 text-white/70 w-max pb-1 hover:text-white hover:border-white transition-colors">
                        Visit Project
                      </button>
                    </div>
                  </div>

                  {/* White Glow on Hover (positioned absolutely behind the card) */}
                  <div className="absolute inset-0 bg-white opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30 pointer-events-none scale-[1.1]" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
