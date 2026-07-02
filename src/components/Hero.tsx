import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <section 
      id="editorial-hero"
      className="relative min-h-screen pt-20 flex flex-col lg:flex-row bg-[#080808] overflow-hidden"
    >
      {/* Editorial Content Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 py-12 lg:py-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          {/* Subtle Collection Note */}
          <span className="text-[10px] tracking-[0.4em] font-medium text-gold-400 block mb-4 uppercase">
            SIGNATURE CAPSULE COLLECTION
          </span>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#F5F5F0] tracking-tight leading-[1.1] mb-6">
            The Poetry of <br />
            <span className="italic font-medium text-gold-400">Pure Form</span>
          </h1>

          {/* Description */}
          <p className="text-[#F5F5F0]/60 text-sm sm:text-base leading-relaxed tracking-wide font-light mb-10 max-w-lg">
            Sculptural contours, responsibly-mined solid gold, and conflict-free gemstones. 
            Isabella Sofia fine jewellery marries mid-century architectural volume with modern minimal grace. 
            Each piece is masterfully handcrafted to become an extension of your individual narrative.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-shop-btn"
              onClick={() => setActiveTab('shop')}
              className="group bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[11px] tracking-[0.25em] font-bold px-8 py-4 flex items-center justify-center transition-all duration-500 ease-out focus:outline-none"
            >
              EXPLORE THE COLLECTION
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <button
              id="hero-consult-btn"
              onClick={() => setActiveTab('consult')}
              className="border border-white/20 hover:border-gold-400 hover:text-gold-400 text-[#F5F5F0] text-[11px] tracking-[0.25em] font-medium px-8 py-4 transition-all duration-500 focus:outline-none bg-transparent"
            >
              BOOK PRIVATE SALON
            </button>
          </div>

          {/* Small Feature Footnote */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 mt-16 pt-8 text-[10px] tracking-[0.15em] font-light text-[#F5F5F0]/40 uppercase">
            <div>
              <span className="font-medium text-[#F5F5F0] block mb-1">RECYCLED GOLD</span>
              100% Traceable
            </div>
            <div>
              <span className="font-medium text-[#F5F5F0] block mb-1">CONFLICT-FREE</span>
              Ethically Sourced
            </div>
            <div>
              <span className="font-medium text-[#F5F5F0] block mb-1">MASTER CRAFT</span>
              Bespoke Atelier
            </div>
          </div>
        </motion.div>
      </div>

      {/* Editorial Image Side */}
      <div className="w-full lg:w-1/2 relative min-h-[60vh] lg:min-h-0 bg-[#080808] flex-1 flex items-center justify-center p-8 lg:p-12 border-l border-white/10">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, #2a2a2a 0%, transparent 80%)" }}></div>
        
        <div className="z-10 w-full max-w-md aspect-[4/5] lg:aspect-square xl:aspect-[4/5] border border-white/5 flex flex-col items-center justify-center relative shadow-2xl shadow-black/80">
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-white/20"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-white/20"></div>
          
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            whileHover={{ opacity: 1, scale: 1.02 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-[#111111] overflow-hidden relative group"
          >
            <img 
              id="hero-main-img"
              src="/src/assets/images/isabella_sofia_hero_1783020773311.jpg" 
              alt="Isabella Sofia fine gold jewellery campaign model portrait" 
              className="w-full h-full object-cover object-center filter grayscale contrast-125 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Glowing visual overlay mimicking the mockup's gold circular visual on hover or static */}
            <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
            
            {/* Subtle gold halo glow inside */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-700">
              <div className="w-48 h-48 rounded-full border border-gold-400/30 flex items-center justify-center bg-transparent shadow-[0_0_50px_rgba(197,160,89,0.15)]">
                <div className="w-24 h-24 rounded-full border-2 border-gold-400 opacity-85 shadow-[0_0_20px_rgba(197,160,89,0.4)]"></div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Atelier Badge */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 bg-[#111111]/85 backdrop-blur-md px-5 py-4 border border-white/10 shadow-2xl hidden sm:block">
          <p className="font-serif italic text-xs text-[#F5F5F0] font-light leading-tight">
            "A collection of pure symmetry and quiet confidence."
          </p>
          <p className="text-[9px] tracking-widest text-gold-400 font-semibold uppercase mt-1.5">
            — British Vogue Editorial, June 2026
          </p>
        </div>
      </div>
    </section>
  );
};
