
import React from 'react';
import { COLORS, WEDDING_DETAILS } from '../constants';
import Reveal from './Reveal';

const StorySection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto text-center px-6 md:px-12 py-10">
      <Reveal>
        <span className="text-[11px] uppercase tracking-[0.6em] font-cinzel mb-8 block" style={{ color: COLORS.accent }}>The Union</span>
        <h2 className="text-6xl md:text-9xl font-script mb-14 leading-none" style={{ color: COLORS.dark }}>
          Our Story
        </h2>
      </Reveal>
      
      <Reveal delay={200}>
        <div className="relative inline-block mb-24 group">
          <p className="text-2xl md:text-4xl leading-relaxed font-light max-w-3xl mx-auto font-serif-elegant italic px-12 transition-all duration-700 group-hover:tracking-wider" style={{ color: COLORS.text }}>
            "In all the world, there is no heart for me like yours. <br className="hidden md:block"/> In all the world, there is no love for you like mine."
          </p>
          <div className="absolute -top-10 -left-4 text-7xl text-[#F1CBA4] opacity-40 font-serif-elegant font-light">“</div>
          <div className="absolute -bottom-10 -right-4 text-7xl text-[#F1CBA4] opacity-40 font-serif-elegant font-light rotate-180">“</div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-stone-100/50">
        {[
          { label: 'The Ceremony', value: WEDDING_DETAILS.date, sub: WEDDING_DETAILS.time, color: COLORS.primaryDark },
          { label: 'The Venue', value: WEDDING_DETAILS.venue, sub: 'Lucena City', color: COLORS.accent },
          { label: 'The Attire', value: 'Semi-formal', sub: 'Wedding Earth Tones', color: COLORS.dark }
        ].map((item, idx) => (
          <Reveal key={idx} delay={400 + idx * 100} className="py-10 md:px-10">
            <div className="group cursor-default">
              <span className="block text-[10px] uppercase tracking-[0.4em] mb-6 font-bold transition-all duration-500 group-hover:tracking-[0.6em]" style={{ color: item.color }}>{item.label}</span>
              <p className="text-3xl md:text-4xl font-serif-elegant mb-2 font-medium" style={{ color: COLORS.text }}>{item.value}</p>
              <p className="text-[11px] opacity-50 uppercase tracking-[0.3em] font-cinzel">{item.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
      
      <div className="mt-32 opacity-10 flex flex-col items-center space-y-4">
        <div className="w-px h-24 bg-gradient-to-b from-stone-400 to-transparent"></div>
        <div className="w-1 h-1 rounded-full bg-stone-400"></div>
      </div>
    </div>
  );
};

export default StorySection;
