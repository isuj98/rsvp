
import React from 'react';
import { COLORS, GALLERY_IMAGES } from '../constants';
import Reveal from './Reveal';

const Gallery: React.FC = () => {
  return (
    <div id="gallery" className="w-full py-12 md:py-20 lg:py-24 px-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Title Area */}
        <div className="text-center mb-10 md:mb-16">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-script leading-tight font-bold" style={{ color: COLORS.dark }}>
              Our Moments
            </h2>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black opacity-60 mt-4">
              A Journey of Love & Laughter
            </p>
            <div className="w-16 md:w-24 h-[2px] bg-stone-200 mx-auto mt-8"></div>
          </Reveal>
        </div>

        {/* Grid Area - Natural height grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-10">
          {GALLERY_IMAGES.slice(0, 6).map((image, index) => (
            <Reveal 
              key={index} 
              animation="reveal-scale" 
              delay={index * 100} 
              className="w-full"
            >
              <div className="group relative overflow-hidden shadow-2xl rounded-sm bg-white p-1.5 md:p-3 aspect-[3/4] sm:aspect-square md:aspect-[4/5]">
                <img 
                  src={image.url} 
                  alt={image.caption} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-8">
                  <p className="text-white font-serif-elegant text-sm md:text-lg italic tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-700 font-bold">
                    {image.caption}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
