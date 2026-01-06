
import React from 'react';
import { COLORS, WEDDING_DETAILS } from '../constants';
import Reveal from './Reveal';

const formatName = (name: string) => {
  // Convert the name to Proper Case, showing full first and last names, but capitalize all
  // "PTR." and "Sis." are kept uppercase, everything else is title-cased
  return name.split(' ').map(word => {
    if (
      ['PTR.', 'SIS.', 'PTR', 'SIS', 'COOR.'].includes(word.toUpperCase())
    )
      return word.toUpperCase();
    if (word.length === 1 && word === word.toUpperCase())
      return word;
    // Handle initials like A. or B.
    if (/^[A-Z]\.$/.test(word)) return word.toUpperCase();
    // Otherwise, capitalize
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

const DetailsSection: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Delicate Corner Decorations */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-[#A67346]/20"></div>
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-[#A67346]/20"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* "Details" Header */}
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.6em] font-cinzel mb-4 block" style={{ color: COLORS.accent }}>Essential Info</span>
          <h1 className="text-8xl md:text-9xl font-script mb-20" style={{ color: COLORS.dark }}>
            Details
          </h1>
        </Reveal>

        <div className="w-full flex flex-col md:flex-row gap-16 md:gap-0 justify-between items-center md:items-start mb-24 max-w-3xl">
          {/* GIFT Section */}
          <Reveal delay={200} className="md:w-5/12 text-center md:text-right">
            <h2 className="text-2xl md:text-3xl font-serif-elegant tracking-[0.2em] mb-6 font-bold" style={{ color: COLORS.accent }}>G I F T</h2>
            <p className="text-base md:text-lg italic font-serif-elegant leading-relaxed opacity-80" style={{ color: COLORS.text }}>
              With all that we have,<br /> we've been truly blessed.<br />
              Your presence and prayers<br /> are all that we request.<br />
              But if you desire to give nonetheless,<br />
              <span className="font-bold">Monetary gift</span> is one we suggest.
            </p>
          </Reveal>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-48 bg-gradient-to-b from-transparent via-[#A67346]/10 to-transparent"></div>

          {/* ATTIRE Section */}
          <Reveal delay={350} className="md:w-5/12 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-serif-elegant tracking-[0.2em] mb-6 font-bold" style={{ color: COLORS.accent }}>A T T I R E</h2>
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold mb-8" style={{ color: COLORS.dark }}>SEMI-FORMAL / SMART CASUAL</p>
            
            {/* Palette Circles */}
            <div className="flex justify-center md:justify-start space-x-3 mb-10">
              {COLORS.palette.map((color, idx) => (
                <div 
                  key={idx}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-inner border border-white/40 transform transition-transform duration-500 hover:scale-125 hover:z-10 cursor-help"
                  style={{ backgroundColor: color }}
                  title={`Color ${idx + 1}`}
                />
              ))}
            </div>
            
            <p className="text-sm md:text-base italic font-serif-elegant leading-relaxed opacity-70" style={{ color: COLORS.text }}>
              We are kindly asking our favorite people to join us<br />
              in wearing our <span className="font-bold">wedding colors</span>.
            </p>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <img
            src="/images/details.jpg"
            alt="Wedding Details"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-20 object-cover object-center"
          />
        </Reveal>

        {/* PROGRAM SECTION BEGIN */}
        <Reveal delay={200}>
          <div className="w-full max-w-3xl mx-auto bg-white/70 rounded-lg shadow-xl p-8 md:p-16 mb-16 border border-[#A67346]/10 text-left">
            <h2 className="text-2xl md:text-3xl font-serif-elegant tracking-[0.2em] text-center mb-6 font-bold" style={{ color: COLORS.accent }}>
              Program
            </h2>
            <div className="space-y-10">
              {/* PART I */}
              <div>
                <h3 className="text-xl md:text-2xl font-serif-elegant font-bold text-left mb-2" style={{ color: COLORS.dark }}>
                  PART I
                </h3>
                <dl className="mb-4 space-y-1">
                  <div>
                    <dt className="font-bold inline">I. PROCESSIONAL</dt>{' '}
                    <dd className="inline opacity-60 italic text-sm">(Song / Audio Piece)</dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">II. WELCOME &amp; INTRODUCTION</dt>{' '}
                    <dd className="inline font-serif-elegant">{formatName('Sis. AGATHA CRISTIE P. BARLAN')}</dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">Congregational Singing</dt>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">
                      III. SCRIPTURE READING &amp; OPENING PRAYER
                    </dt>{' '}
                    <dd className="inline font-serif-elegant">{formatName('ISAIAH MARK VALDEZ')}</dd>
                    <div className="pl-5 text-[12px] opacity-70">
                      Assoc. Minister<br />
                      Perth, Australia
                    </div>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">Song of Praise I</dt>{' '}
                    <dd className="inline font-serif-elegant">{formatName('JUNNELLE V. AMIDO')}</dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">IV. OFFERATORY MESSAGE</dt>{' '}
                    <dd className="inline font-serif-elegant">{formatName('PTR. NIÑO MARPA')}</dd>
                    <div className="pl-5 text-[12px] opacity-70">
                      Head Pastor, Sariaya Locale
                    </div>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">Song of Praise II</dt>{' '}
                    <dd className="inline font-serif-elegant">{formatName('DARRIE MAE B. ESCRITOR & CHELSEA MARI B. ESCRITOR')}</dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">V. MESSAGE</dt>{' '}
                    <dd className="inline font-serif-elegant">{formatName('PTR. RONALD R. RUIZ')}</dd>
                    <div className="pl-5 text-[12px] opacity-70">
                      Lucena Locale Head Pastor<br />
                      Quezon-Marinduque Coor.
                    </div>
                  </div>
                </dl>
              </div>
              {/* PART II */}
              <div>
                <h3 className="text-xl md:text-2xl font-serif-elegant font-bold text-left mb-2" style={{ color: COLORS.dark }}>
                  PART II
                </h3>
                <dl className="mb-2 space-y-1">
                  <div>
                    <dt className="font-bold inline">VI. FIRST KNEELING</dt>
                    <dd className="inline ml-1 opacity-60 italic text-sm">
                      (Serenade: {formatName('Aubrey Ann A. Carneo')})
                    </dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">VII. SECOND KNEELING</dt>
                    <dd className="inline ml-1 opacity-60 italic text-sm">
                      (Serenade: {formatName('Junnelle & Arma Amido')})
                    </dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">VIII. VOWS AND RING EXCHANGE</dt>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">IX. SIGNING OF CONTRACT</dt>
                    <dd className="inline ml-1 opacity-60 italic text-sm">
                      (Serenade: {formatName('Ptr. Reshen V. Valdez')})
                    </dd>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">X. PRONOUNCEMENT OF MARRIAGE</dt>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">XI. RECESSIONAL</dt>
                  </div>
                  <div className="mt-2">
                    <dt className="font-bold inline">XII. PHOTO OPPORTUNITY WITH THE NEWLY WED</dt>
                  </div>
                </dl>
              </div>
              {/* OFFICIANTS */}
              <div className="pt-8 border-t border-[#A67346]/10 mt-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                  <div className="flex-1 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-50 mb-1">OFFICIATING MINISTER</p>
                    <p className="font-serif-elegant text-lg font-bold" style={{ color: COLORS.dark }}>
                      {formatName('PTR. RONALD R. RUIZ')}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-50 mb-1">MASTER OF CEREMONY</p>
                    <p className="font-serif-elegant text-lg font-bold" style={{ color: COLORS.dark }}>
                      {formatName('Sis. AGATHA CRISTIE P. BARLAN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        {/* PROGRAM SECTION END */}

        {/* Decorative flourish */}
        <Reveal delay={500} className="opacity-40">
          <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20C40 20 60 5 100 5C140 5 160 20 200 20" stroke={COLORS.accent} strokeWidth="0.5" />
            <path d="M0 25C40 25 60 10 100 10C140 10 160 25 200 25" stroke={COLORS.primary} strokeWidth="0.5" />
            <circle cx="100" cy="15" r="4" fill={COLORS.accent} fillOpacity="0.5" />
          </svg>
        </Reveal>
      </div>
    </div>
  );
};

export default DetailsSection;
