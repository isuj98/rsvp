
import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Set volume to half (0.5) explicitly
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }

    const startPlayback = () => {
      if (audioRef.current && !hasStartedRef.current && isUnlockedRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            hasStartedRef.current = true;
            cleanupListeners();
          })
          .catch(e => {
            console.debug("Playback attempt blocked by browser policy. Waiting for interaction...");
          });
      }
    };

    const handleInteraction = () => {
      if (!isUnlockedRef.current) {
        isUnlockedRef.current = true;
        startPlayback();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction, { capture: true });
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
    };

    // Attempt immediate playback
    startPlayback();

    // Setup interaction listeners to trigger playback as soon as user engages with the page
    const interactionEvents = ['click', 'scroll', 'touchstart', 'touchmove', 'wheel', 'mousedown'];
    interactionEvents.forEach(event => {
      window.addEventListener(event, handleInteraction, { passive: true, capture: event === 'scroll' });
    });

    return () => {
      cleanupListeners();
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        isUnlockedRef.current = true; // Manual click always unlocks
        audioRef.current.play().catch(e => console.error("Playback failed", e));
        setIsPlaying(true);
        hasStartedRef.current = true;
      }
    }
  };

  return (
    <div className="flex items-center group">
      <audio 
        ref={audioRef} 
        loop 
        src="TangingIkaw.mp3" 
      />
      
      {/* Track label */}
      <div className={`mr-4 px-5 py-2 bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 rounded-full text-[8px] uppercase tracking-[0.3em] transition-all duration-1000 ease-out overflow-hidden whitespace-nowrap ${isPlaying ? 'opacity-100 max-w-[200px] translate-x-0' : 'opacity-0 max-w-0 translate-x-4 pointer-events-none'}`} style={{ color: COLORS.dark }}>
        Tanging Ikaw - Sugarcane
      </div>

      {/* Toggle button */}
      <button
        onClick={togglePlay}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl border border-stone-50 transition-all duration-500 hover:scale-110 active:scale-95 relative z-50"
        style={{ color: COLORS.accent }}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <div className="flex items-end space-x-[3px] h-3.5">
            <div className="w-[1.5px] bg-current animate-[music_1.2s_ease-in-out_infinite] h-3.5"></div>
            <div className="w-[1.5px] bg-current animate-[music_0.8s_ease-in-out_infinite] h-2"></div>
            <div className="w-[1.5px] bg-current animate-[music_1.5s_ease-in-out_infinite] h-3"></div>
            <div className="w-[1.5px] bg-current animate-[music_1.0s_ease-in-out_infinite] h-2.5"></div>
          </div>
        ) : (
          <div className="relative">
            <svg className="w-5 h-5 ml-1 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <div className="absolute -inset-4 border border-current rounded-full animate-ping opacity-10"></div>
          </div>
        )}
      </button>

      <style>{`
        @keyframes music {
          0%, 100% { height: 3px; }
          50% { height: 14px; }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
