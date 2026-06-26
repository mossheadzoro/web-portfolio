import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: name,
          email: email,
          message: message,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="bg-[#0a0a0a] text-white min-h-screen relative flex flex-col justify-center py-24 overflow-hidden border-t border-white/5">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        
        {/* Left Side: Typography & Info */}
        <div className="w-full md:w-1/2 flex flex-col space-y-10">
          <div>
            <h2 className="text-xs md:text-sm tracking-[0.5em] text-neonGreen uppercase mb-6 font-mono">
              Contact
            </h2>
            <h3 
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase mb-6"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Let's<br/>Talk.
            </h3>
            <p className="text-gray-400 font-light text-lg md:text-xl max-w-md leading-relaxed">
              I am currently available for freelance work and full-time opportunities. If you have a project that needs some creative magic or just want to say hi, my inbox is open.
            </p>
          </div>

          <div className="space-y-6">
            <a href="mailto:hello@example.com" className="group flex items-center space-x-6 w-max cursor-pointer">
              <span className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neonGreen transition-colors duration-500">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-neonGreen transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-lg font-mono text-gray-300 group-hover:text-white transition-colors duration-500">
                dasankan210@gmail.com
              </span>
            </a>
          </div>
        </div>

        {/* Right Side: Sleek Contact Form */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="bg-[#111]/50 backdrop-blur-md border border-white/5 p-8 md:p-12 flex flex-col space-y-8 relative group overflow-hidden">
            
            {/* Subtle hover glow on form */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col space-y-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-neonGreen transition-colors duration-500" 
                placeholder="John Doe"
              />
            </div>
            
            <div className="relative z-10 flex flex-col space-y-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Your Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-neonGreen transition-colors duration-500" 
                placeholder="john@example.com"
              />
            </div>

            <div className="relative z-10 flex flex-col space-y-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Your Message</label>
              <textarea 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="bg-transparent border-b border-white/10 py-3 text-white font-light focus:outline-none focus:border-neonGreen transition-colors duration-500 resize-none" 
                placeholder="Tell me about your project..."
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="relative z-10 w-max mt-4 text-xs uppercase tracking-[0.3em] font-bold border-b border-neonGreen text-neonGreen pb-2 hover:text-white hover:border-white transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Error. Try Again' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Minimal Footer */}
      <div className="absolute bottom-8 w-full text-center">
        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">
          © 2026 Ankan Das. Designed & Developed with Passion.
        </p>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-[#0a0a0a] border border-neonGreen/30 backdrop-blur-md px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(110,231,183,0.15)]"
          >
            <div className="w-10 h-10 rounded-full bg-neonGreen/10 flex items-center justify-center border border-neonGreen/20">
              <svg className="w-5 h-5 text-neonGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-mono text-sm tracking-widest uppercase">Message Sent</span>
              <span className="text-gray-400 text-xs mt-1">I'll get back to you soon.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
