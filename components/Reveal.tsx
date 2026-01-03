
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  animation?: 'reveal' | 'reveal-scale';
  delay?: number;
  className?: string;
}

const Reveal: React.FC<RevealProps> = ({ 
  children, 
  animation = 'reveal', 
  delay = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          // observer.unobserve(entry.target); // Optional: stay animated once seen
        } else {
          setIsVisible(false); // Reset animation when scrolled away for per-screen feel
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
