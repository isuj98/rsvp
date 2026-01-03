
import React from 'react';
import { COLORS, WEDDING_DETAILS } from '../constants';
import Reveal from './Reveal';

const Venue: React.FC = () => {
  return (
    <div id="venue" className="w-full h-full min-h-screen max-w-7xl mx-auto flex flex-col justify-center items-center py-16 px-6 md:px-12">
      {/* Centered Header with more vertical margin */}
      <Reveal className="text-center mb-12 md:mb-20">
        <h2 className="text-5xl md:text-8xl font-script" style={{ color: COLORS.dark }}>The Venue</h2>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-light opacity-60 mt-3">Where we say I Do</p>
        <div className="w-16 h-[1px] bg-slate-200 mx-auto mt-8"></div>
      </Reveal>

      {/* Main Content Area: Responsive Grid/Flex */}
      <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16 lg:gap-24 w-full h-full max-h-[80vh]">
        
        {/* Map Section: Takes more space on large screens */}
        <div className="w-full lg:w-3/5">
          <Reveal animation="reveal-scale">
            <div className="relative p-2 md:p-3 bg-white shadow-2xl rounded-sm">
              <div className="absolute -inset-3 md:-inset-6 border-[1px] rotate-1 opacity-10 pointer-events-none" style={{ borderColor: COLORS.accent }}></div>
              <div className="absolute -inset-2 md:-inset-4 border-[1px] -rotate-1 opacity-5 pointer-events-none" style={{ borderColor: COLORS.primary }}></div>
              
              <div className="relative z-10 w-full aspect-video lg:aspect-[16/10] rounded-sm overflow-hidden border border-stone-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.460977052753!2d121.59793877586691!3d13.931129093114798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd4b608a17f057%3A0xff4506b324f10942!2sVilla%20Adelaida%20Lucena!5e0!3m2!1sen!2sph!4v1766979125883!5m2!1sen!2sph" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Map"
                ></iframe>
              </div>
            </div>
          </Reveal>
        </div>
        
        {/* Info Section */}
        <div className="w-full lg:w-2/5 text-center lg:text-left space-y-8 md:space-y-10">
          <Reveal delay={200}>
            <p className="text-3xl md:text-5xl font-serif-elegant mb-2" style={{ color: COLORS.accent }}>{WEDDING_DETAILS.venue}</p>
            <p className="text-base md:text-xl font-light opacity-70 tracking-wide font-serif-elegant italic">{WEDDING_DETAILS.address}</p>
          </Reveal>
          
          <div className="space-y-8 md:space-y-12">
            {[
              { title: 'The Ceremony', detail: 'Villa Adelaida • 1:30 PM' },
            ].map((item, idx) => (
              <Reveal key={idx} delay={300 + idx * 150}>
                <div className="group">
                  <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold mb-2 opacity-30 group-hover:opacity-60 transition-opacity">{item.title}</h4>
                  <p className="text-xl md:text-3xl font-serif-elegant font-medium leading-tight">{item.detail}</p>
                  {/* Removed non-existent item.sub property call */}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={600} className="pt-6">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WEDDING_DETAILS.venue + ' ' + WEDDING_DETAILS.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 border-[1px] text-[10px] md:text-[11px] uppercase tracking-[0.5em] transition-all duration-700 hover:text-white rounded-full whitespace-nowrap overflow-hidden group relative"
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
            >
              <span className="relative z-10">Explore Map Location</span>
              <div 
                className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-0"
                style={{ backgroundColor: COLORS.primary }}
              ></div>
            </a>
          </Reveal>
        </div>
      </div>

      {/* Bottom Flourish */}
      <div className="mt-auto pt-12 md:pt-20 opacity-20">
         <div className="w-[1px] h-16 bg-gradient-to-b from-stone-400 to-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default Venue;
