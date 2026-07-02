import React from 'react';
import { PHILOSOPHY } from '../data';
import { motion } from 'motion/react';
import { ShieldCheck, Leaf, Globe, Flame } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <section 
      id="our-story-section"
      className="max-w-6xl mx-auto px-6 md:px-12 py-24 sm:py-32 bg-[#080808]"
    >
      {/* Visual Campaign Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        {/* Left column: Campaign editorial quote */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] tracking-[0.3em] font-medium text-gold-400 uppercase">
            AESTHETIC MANIFESTO
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.15] text-[#F5F5F0] tracking-wide">
            Simplicity is the <br />
            <span className="italic font-medium text-gold-400">Ultimate Luxury</span>
          </h2>
          <div className="w-16 h-[1px] bg-gold-400 my-4" />
          <p className="font-serif italic text-lg text-[#F5F5F0]/80 font-light leading-relaxed">
            {PHILOSOPHY.quote}
          </p>
          <p className="text-[#F5F5F0]/60 font-light text-sm leading-relaxed tracking-wide">
            {PHILOSOPHY.paragraphs[0]}
          </p>
        </div>

        {/* Right column: Campaign image */}
        <div className="lg:col-span-6 relative aspect-[4/5] bg-stone-900 overflow-hidden border border-white/5">
          <img 
            id="story-campaign-img"
            src="/src/assets/images/isabella_sofia_hero_1783020773311.jpg" 
            alt="Isabella Sofia fine jewelry artisan craftsmanship campaign" 
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-950/20" />
        </div>
      </div>

      {/* Philosophy Pillars (Bento Grid Style) */}
      <div className="border-t border-white/10 pt-16">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.3em] font-medium text-gold-400 uppercase block mb-2">
            OUR SACRED PILLARS
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F5F5F0] tracking-wide">
            Integrity in Every Facet
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-[#0D0D0D] p-8 border border-white/10 text-center flex flex-col items-center rounded-none shadow-md">
            <div className="w-12 h-12 rounded-full bg-gold-400/5 flex items-center justify-center text-gold-400 mb-6 border border-gold-400/20">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-medium text-[#F5F5F0] tracking-wide mb-3 uppercase text-[12px]">
              Ethical Sourcing
            </h4>
            <p className="text-[#F5F5F0]/60 font-light text-xs leading-relaxed tracking-wide">
              We pledge 100% full traceability. Every round brilliant diamond and rare blue sapphire is certified conflict-free, traceably audited from mines that uphold advanced environmental and humanitarian standards.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#0D0D0D] p-8 border border-white/10 text-center flex flex-col items-center rounded-none shadow-md">
            <div className="w-12 h-12 rounded-full bg-gold-400/5 flex items-center justify-center text-gold-400 mb-6 border border-gold-400/20">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-medium text-[#F5F5F0] tracking-wide mb-3 uppercase text-[12px]">
              Artisan Craft
            </h4>
            <p className="text-[#F5F5F0]/60 font-light text-xs leading-relaxed tracking-wide">
              Each piece is completely handcrafted, individually sized, and hand-certified in our boutique atelier. We reject the mass-manufactured molds of modern fast jewelry to protect authentic artisan pride.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#0D0D0D] p-8 border border-white/10 text-center flex flex-col items-center rounded-none shadow-md">
            <div className="w-12 h-12 rounded-full bg-gold-400/5 flex items-center justify-center text-gold-400 mb-6 border border-gold-400/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-medium text-[#F5F5F0] tracking-wide mb-3 uppercase text-[12px]">
              Designed to Outlast
            </h4>
            <p className="text-[#F5F5F0]/60 font-light text-xs leading-relaxed tracking-wide">
              {PHILOSOPHY.paragraphs[1].slice(0, 160)}... cast in solid 18-karat gold and premium PT950 platinum to serve as a modern heirloom that endures for generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
