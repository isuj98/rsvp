
import React, { useState, useEffect } from 'react';
import { COLORS, GALLERY_IMAGES } from '../constants';
import Reveal from './Reveal';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [shuffledImages, setShuffledImages] = useState<typeof GALLERY_IMAGES>([]);

  // Shuffle images using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle images on component mount
  useEffect(() => {
    const imagesToShow = GALLERY_IMAGES.slice(0, 6);
    setShuffledImages(shuffleArray(imagesToShow));
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage !== null) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Prevent image download
  const preventDownload = (e: React.MouseEvent | React.DragEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Prevent context menu (right-click)
  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent keyboard shortcuts for saving/printing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+I, F12, etc.
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'i' || e.key === 'I')
      ) {
        e.preventDefault();
        return false;
      }
      // Prevent F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
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
            {shuffledImages.map((image, index) => (
              <Reveal 
                key={index} 
                animation="reveal-scale" 
                delay={index * 100} 
                className="w-full"
              >
                <div 
                  className="group relative overflow-hidden shadow-2xl rounded-sm bg-white p-1.5 md:p-3 aspect-[3/4] sm:aspect-square md:aspect-[4/5] cursor-pointer select-none"
                  onClick={() => openModal(index)}
                  onContextMenu={preventContextMenu}
                  onDragStart={preventDownload}
                  onSelectStart={preventDownload}
                >
                  <img 
                    src={image.url} 
                    alt={(image as any).caption || `Gallery image ${index + 1}`} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 pointer-events-none select-none"
                    loading="lazy"
                    draggable={false}
                    onContextMenu={preventContextMenu}
                    onDragStart={preventDownload}
                    onSelectStart={preventDownload}
                  />
                  {/* Invisible overlay to prevent direct image access */}
                  <div 
                    className="absolute inset-0 z-10"
                    onContextMenu={preventContextMenu}
                    onDragStart={preventDownload}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8 animate-fadeIn"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button - moved to left */}
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 md:top-8 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all duration-300 group"
              aria-label="Close modal"
            >
              <svg 
                className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:rotate-90 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image with protection overlay */}
            {selectedImage !== null && shuffledImages[selectedImage] && (
              <>
                <div className="relative max-w-full max-h-full">
                  <img 
                    src={shuffledImages[selectedImage].url} 
                    alt={(shuffledImages[selectedImage] as any).caption || `Gallery image ${selectedImage + 1}`}
                    className="max-w-full max-h-full object-contain rounded-sm shadow-2xl pointer-events-none select-none"
                    draggable={false}
                    onContextMenu={preventContextMenu}
                    onDragStart={preventDownload}
                    onSelectStart={preventDownload}
                  />
                  {/* Invisible overlay to prevent direct image access */}
                  <div 
                    className="absolute inset-0 z-10"
                    onContextMenu={preventContextMenu}
                    onDragStart={preventDownload}
                    onMouseDown={preventDownload}
                    onTouchStart={preventDownload}
                  />
                </div>

                {/* Caption */}
                {(shuffledImages[selectedImage] as any).caption && (
                  <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 md:px-8 py-3 md:py-4 rounded-sm">
                    <p className="text-white font-serif-elegant text-sm md:text-lg italic tracking-widest text-center">
                      {(shuffledImages[selectedImage] as any).caption}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        /* Prevent image selection and dragging */
        #gallery img,
        #gallery img::selection,
        #gallery img::-moz-selection {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }
        /* Prevent text selection on gallery container */
        #gallery {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        /* Prevent image download in modal */
        [class*="fixed inset-0 z-50"] img,
        [class*="fixed inset-0 z-50"] img::selection,
        [class*="fixed inset-0 z-50"] img::-moz-selection {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default Gallery;
