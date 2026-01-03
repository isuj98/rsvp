
import React from 'react';
import { COLORS, WEDDING_DETAILS } from '../constants';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative h-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Editorial Background Image with Textural Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="images/FrontPage-min.jpg" 
          alt="Wedding Background" 
          className="w-full h-full object-cover md:object-contain scale-105 animate-subtlePan"
        />
        {/* Soft Sepia/Parchment Overlay */}
        <div className="absolute inset-0 bg-[#2C3E50]/30 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      {/* Main Content Container - Centered with -1rem negative margin as requested (-mt-4) */}
      <div className="relative -mt-4 z-20 w-full max-w-6xl px-8 flex flex-col items-center h-full text-white">
        
        {/* Centered Names and Date */}
        <div className="text-center animate-fadeIn my-auto">
          {/* Poetic Subheader */}
          <div className="flex items-center justify-center space-x-4 mb-6 md:mb-12 opacity-80 overflow-hidden">
             <div className="h-[0.5px] w-8 md:w-16 bg-white/40"></div>
             <h2 className="text-[10px] md:text-sm uppercase tracking-[0.6em] font-medium">
               The Beginning of Forever
             </h2>
             <div className="h-[0.5px] w-8 md:w-16 bg-white/40"></div>
          </div>
          
          {/* Main Names - Overlapping Typography */}
          <div className="relative mb-8 md:mb-12">
            <h1 className="text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-script leading-[0.8] md:leading-[0.7] drop-shadow-2xl">
              Johnsean <span className="text-3xl md:text-6xl font-serif-elegant italic opacity-60 block md:inline md:mx-4 font-light">&</span> Kristine
            </h1>
          </div>
          
          <p className="text-xl md:text-4xl font-serif-elegant italic tracking-widest drop-shadow-lg font-light">
            {WEDDING_DETAILS.date}
          </p>
        </div>

        {/* Enter Invitation Button at the Very Bottom */}
        <div className="animate-fadeIn pb-10 md:pb-16 mt-auto">
          <button 
            onClick={onExplore}
            className="px-12 py-5 bg-white text-stone-900 rounded-full text-[11px] uppercase tracking-[0.5em] font-bold shadow-2xl transition-all duration-700 hover:scale-110 hover:bg-[#F1CBA4] group relative overflow-hidden"
          >
            <span className="relative z-10">Enter Invitation</span>
            <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtlePan {
          from { transform: scale(1.05) translateX(-1%); }
          to { transform: scale(1.05) translateX(1%); }
        }
        .animate-fadeIn {
          animation: fadeIn 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-subtlePan {
          animation: subtlePan 20s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default Hero;
