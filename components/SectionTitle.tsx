
import React from 'react';
import { COLORS } from '../constants';
import Reveal from './Reveal';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
  overlayColor?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, bgImage, overlayColor = 'rgba(0,0,0,0.4)' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover scale-110 animate-slowZoom" />
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor }}></div>
        </div>
      )}
      <div className="relative z-10 text-center text-white px-4">
        <Reveal animation="reveal-scale">
          <h2 className="text-6xl md:text-8xl font-script mb-4 drop-shadow-2xl">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base uppercase tracking-[0.6em] font-light opacity-80 drop-shadow-md">
              {subtitle}
            </p>
          )}
          <div className="w-24 h-[1px] bg-white/40 mx-auto mt-8"></div>
        </Reveal>
      </div>
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        .animate-slowZoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default SectionTitle;
