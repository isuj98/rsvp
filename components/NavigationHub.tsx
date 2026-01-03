
import React from 'react';
import { COLORS, WEDDING_DETAILS } from '../constants';
import Reveal from './Reveal';

interface NavigationHubProps {
  onNavigate: (section: 'moments' | 'venue' | 'details' | 'rsvp') => void;
  onBackToHero: () => void;
}

const NavigationHub: React.FC<NavigationHubProps> = ({ onNavigate, onBackToHero }) => {
  const menuItems = [
    { id: 'moments', title: 'Our Moments', subtitle: 'The Memories', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'venue', title: 'The Venue', subtitle: 'The Setting', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'details', title: 'Details', subtitle: 'The Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'rsvp', title: 'RSVP', subtitle: 'The Response', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <div className="w-full h-screen min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] px-6 py-12 relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-stone-900 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115vw] h-[115vw] border border-stone-900 rounded-full"></div>
      </div>

      <Reveal className="text-center mb-8 md:mb-16 z-10">
        <h3 className="text-[10px] uppercase tracking-[0.5em] font-cinzel opacity-40 mb-2" style={{ color: COLORS.accent }}>The Wedding Invitation</h3>
        <h2 className="text-5xl md:text-8xl font-script" style={{ color: COLORS.dark }}>{WEDDING_DETAILS.names}</h2>
        <div className="w-12 h-[1px] bg-slate-200 mx-auto mt-6"></div>
      </Reveal>

      {/* Responsive Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-6xl z-10">
        {menuItems.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 50} className="w-full h-full">
            <button
              onClick={() => onNavigate(item.id as any)}
              className="group w-full h-40 md:h-72 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-stone-100 rounded-sm overflow-hidden relative transition-all duration-700 hover:shadow-[0_25px_70px_rgba(0,0,0,0.1)] hover:-translate-y-3 flex flex-col items-center justify-center p-4"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#BDD3E3]/5 to-[#F1CBA4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 md:space-y-6">
                <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-slate-50 transition-colors duration-700 group-hover:bg-white mb-1 shadow-sm">
                  <svg className="w-5 h-5 md:w-7 md:h-7 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-125" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={item.icon} />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-base md:text-2xl font-serif-elegant italic tracking-widest text-stone-900 transition-colors duration-700 group-hover:text-[#5C3D2E] font-bold">
                    {item.title}
                  </h3>
                  <p className="hidden md:block text-[8px] uppercase tracking-[0.3em] font-black opacity-30 transition-all duration-700 group-hover:opacity-60 mt-2">{item.subtitle}</p>
                </div>
                
                <div className="w-8 md:w-12 h-[1.5px] bg-slate-100 transition-all duration-700 group-hover:w-full group-hover:bg-stone-300"></div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
      
      <Reveal delay={600} className="mt-12 md:mt-24 z-10">
        <button 
          onClick={onBackToHero}
          className="group flex flex-col items-center space-y-4 opacity-40 hover:opacity-100 transition-all duration-500"
        >
          <div className="w-[1px] h-12 bg-stone-300 transition-all group-hover:h-16"></div>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Return to Cover</span>
        </button>
      </Reveal>
    </div>
  );
};

export default NavigationHub;
