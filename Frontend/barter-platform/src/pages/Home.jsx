import { Button } from "@/components/ui/button";
import { Handshake, Sparkles, Zap, Coins, Globe, Code, PlayCircle, Palette, Megaphone, MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const floatingAnimation = (delay = 0, yOffset = 15) => ({
  y: [0, -yOffset, 0],
  rotate: [0, 2, -2, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
    delay,
  },
});

// Keyframes injection for strict generic marquee styling
const styleInjection = (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes infinite-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes infinite-scroll-reverse {
      from { transform: translateX(-50%); }
      to { transform: translateX(0); }
    }
  `}} />
);

export default function Home() {
  const containerRef = useRef(null);
  const parallaxRef = useRef(null);
  
  // Parallax for Hero
  const { scrollYProgress: heroProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // Parallax for Dynamic Stacking Cards Strategy
  const { scrollYProgress: cardsProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });

  return (
    <div ref={containerRef} className="relative bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary selection:text-white">
      
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-20">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen translate-x-1/3 -translate-y-1/3" 
          />
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />

        <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left Hero Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 mb-8 backdrop-blur-md shadow-lg shadow-primary/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-primary text-sm font-bold tracking-wide uppercase">The Future of Digital Barter</span>
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tighter text-zinc-900 dark:text-white leading-[1.05]">
              Trade <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-primary via-indigo-500 to-primary">Skills</motion.span>.<br />
              Keep Your <br className="hidden lg:block"/> Cash.
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-zinc-600 dark:text-zinc-400 max-w-xl mb-12 text-lg sm:text-xl leading-relaxed font-medium">
              Join the world's most exclusive network for digital professionals. Code a landing page, get a stunning logo. No money transfers, just pure value exchange.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/register">
                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 w-full bg-primary text-white border border-primary hover:bg-primary/90 transition-colors">
                  Start Exchanging Now
                 </motion.button>
              </Link>
              <Link to="/listings">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 h-16 px-10 rounded-2xl text-lg font-bold bg-card border border-border text-foreground hover:bg-secondary transition-colors shadow-lg">
                  <Globe className="w-5 h-5" /> Explore Network
                 </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right Floating Elements Canvas */}
          <div className="relative hidden lg:block h-[600px] w-full perspective-1000">
             <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
                {/* Floating Card 1 */}
                <motion.div animate={floatingAnimation(0, 20)} className="absolute top-[10%] left-[5%] w-72 bg-white/80 dark:bg-zinc-900/80 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl shadow-black/10 dark:shadow-black/60 z-20 backdrop-blur-2xl">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shadow-inner"><Code className="w-6 h-6"/></div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-base">Fullstack React App</h4>
                      <p className="text-primary font-bold text-sm">Offering • 500 Credits</p>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-primary rounded-full"/></div>
                </motion.div>

                {/* Floating Card 2 */}
                <motion.div animate={floatingAnimation(1.5, 25)} className="absolute top-[45%] right-[0%] w-80 bg-white/80 dark:bg-zinc-900/80 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl shadow-black/10 dark:shadow-black/60 z-30 backdrop-blur-2xl">
                  <div className="flex gap-4 items-center">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-lg" alt="Avatar"/>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-lg">Sarah Jenkins</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Accepting Graphic Design</p>
                      <div className="flex gap-1 mt-2">
                         {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-sm" />)}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Image */}
                <motion.div animate={floatingAnimation(0.5, 15)} className="absolute bottom-[5%] left-[15%] w-[380px] h-[240px] rounded-[2rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl z-10 ring-1 ring-zinc-200 dark:ring-zinc-900">
                   <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Coding Setup" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                   <h3 className="absolute bottom-5 left-5 text-white font-bold text-xl flex items-center gap-2">
                     <MonitorPlay className="w-5 h-5 text-primary" /> High-End Engineering
                   </h3>
                </motion.div>
             </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ SINGLE MARQUEE ═══════ */}
      <section className="py-16 border-y border-border bg-background overflow-hidden relative flex flex-col gap-6">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

        <div className="flex w-[200vw] sm:w-[150vw] items-center gap-12 font-black text-5xl sm:text-7xl uppercase tracking-tighter relative left-0 animate-[infinite-scroll_25s_linear_infinite]">
          {[1,2,3,4].map((i) => (
             <div key={i} className="flex items-center gap-12 shrink-0 text-zinc-900 dark:text-white">
                <span className="text-transparent" style={{ WebkitTextStroke: "2px currentColor", color: "var(--color-primary)" }}>UI/UX DESIGN</span><Palette className="w-10 h-10 text-primary" />
                <span>WEB DEVELOPMENT</span><Code className="w-10 h-10 text-zinc-300 dark:text-zinc-800" />
                <span className="text-transparent" style={{ WebkitTextStroke: "2px currentColor", color: "var(--color-primary)" }}>COPYWRITING</span><Megaphone className="w-10 h-10 text-primary" />
                <span>VIDEO EDITING</span><MonitorPlay className="w-10 h-10 text-zinc-300 dark:text-zinc-800" />
                <span className="text-transparent" style={{ WebkitTextStroke: "2px currentColor", color: "var(--color-primary)" }}>SEO OPTIMIZATION</span><Globe className="w-10 h-10 text-primary" />
                <span>BRAND STRATEGY</span><Zap className="w-10 h-10 text-zinc-300 dark:text-zinc-800" />
             </div>
          ))}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS (ANIMATED STEPS) ═══════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24 cursor-default">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }} className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary"><Handshake className="w-8 h-8" /></motion.div>
          <h2 className="text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-6">How Value is Exchanged</h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">A seamless workflow designed to guarantee fair trades, secure deliveries, and high-quality results.</p>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 z-0 opacity-20" />

          {[
            { tag: "01", title: "Offer Your Skills", desc: "List what you do best. From writing to programming, your time is your currency.", icon: <Palette /> },
            { tag: "02", title: "Earn XERV Credits", desc: "Complete requests for other founders and safely lock in credits through escrow.", icon: <Zap /> },
            { tag: "03", title: "Spend on Services", desc: "Use your hard-earned credits to hire world-class talent to build your own venture.", icon: <Coins /> }
          ].map((step, index) => (
             <motion.div key={step.tag} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-48 h-48 mb-10 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full blur-2xl transition-all duration-500" />
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="w-32 h-32 rounded-[2rem] bg-card border-2 border-border shadow-2xl flex items-center justify-center z-10 text-primary">
                    <div className="scale-[2.5]">{step.icon}</div>
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-primary rounded-full flex items-center justify-center font-black text-white text-2xl z-20 shadow-xl shadow-primary/40 pt-1 border-4 border-white dark:border-black">
                    {step.tag}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">{step.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium px-2 text-lg">{step.desc}</p>
             </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════ PARALLAX STACKING CARDS (REPLACES BENTO) ═══════ */}
      <section ref={parallaxRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary border-y border-border relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative">
           
           {/* Sticky Left Sidebar */}
           <div className="lg:w-1/3 relative">
             <div className="sticky top-32">
               <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once:true }}>
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8">
                   <Megaphone className="w-8 h-8" />
                 </div>
                 <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-6 leading-tight">Engineered for <br/>Creators.</h2>
                 <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium mb-10">
                   Stop paying massive platform fees. Everything you need to successfully execute digital trades securely.
                 </p>
                 <Link to="/listings">
                   <Button size="lg" className="rounded-xl px-8 shadow-lg bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-lg font-bold">
                     View All Features
                   </Button>
                 </Link>
               </motion.div>
             </div>
           </div>

           {/* Stacking Cards on Right */}
           <div className="lg:w-2/3 flex flex-col gap-12 pb-32">
              
              <motion.div 
                style={{ y: useTransform(cardsProgress, [0, 1], ["0%", "-5%"]) }}
                 className="bg-card rounded-[3rem] p-8 sm:p-12 border border-border shadow-2xl sticky top-32 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
                <h3 className="relative z-10 text-4xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">Built-in Delivery Tracking</h3>
                <p className="relative z-10 text-zinc-600 dark:text-zinc-400 text-xl font-medium max-w-lg mb-12">Submit links, files, and design assets securely through our transaction modal. Escrow ensures fair play.</p>
                <div className="relative z-10 w-full h-80 rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Code Tracker" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                style={{ y: useTransform(cardsProgress, [0, 1], ["0%", "-15%"]) }}
                className="bg-primary rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-primary/20 sticky top-40 overflow-hidden text-white group"
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                <h3 className="relative z-10 text-4xl font-bold mb-4 tracking-tight">Zero Platform Fees.</h3>
                <p className="relative z-10 text-primary-foreground/80 text-xl font-medium max-w-lg mb-12">Because no money is changing hands, we take 0% of your credits. 100% of your effort stays yours.</p>
                <div className="relative z-10 w-full h-80 rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Data" />
                </div>
              </motion.div>

              <motion.div 
                style={{ y: useTransform(cardsProgress, [0, 1], ["0%", "-30%"]) }}
                className="bg-zinc-900 rounded-[3rem] p-8 sm:p-12 border border-zinc-800 shadow-2xl sticky top-48 overflow-hidden group text-white"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-4xl font-bold mb-4 tracking-tight">100% Digital Focus</h3>
                <p className="relative z-10 text-zinc-400 text-xl font-medium max-w-lg mb-12">From UX Design to Backend Architecture, focus purely on modern technical deliverables.</p>
                <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {['React', 'Node.js', 'Figma', 'Marketing', 'Content', 'UI/UX', 'SEO', 'Video'].map((skill) => (
                      <div key={skill} className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 flex items-center justify-center text-center font-bold text-lg group-hover:bg-primary transition-colors duration-300">
                        {skill}
                      </div>
                   ))}
                </div>
              </motion.div>

           </div>
        </div>
      </section>

      {styleInjection}

    </div>
  );
}