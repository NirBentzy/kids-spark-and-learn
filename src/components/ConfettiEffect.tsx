
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useIsMobile } from '@/hooks/use-mobile';

export const ConfettiEffect = () => {
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500); // Increased duration

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Left side confetti */}
      <Confetti
        width={window.innerWidth / 2}
        height={window.innerHeight}
        numberOfPieces={isMobile ? 75 : 150}
        recycle={false}
        gravity={0.3}
        initialVelocityX={15}
        colors={['#D946EF', '#F97316', '#8B5CF6', '#E5DEFF', '#FFDEE2', '#FEC6A1']}
        confettiSource={{
          x: 0,
          y: window.innerHeight / 2,
          w: 0,
          h: 0
        }}
      />
      {/* Right side confetti */}
      <Confetti
        width={window.innerWidth / 2}
        height={window.innerHeight}
        numberOfPieces={isMobile ? 75 : 150}
        recycle={false}
        gravity={0.3}
        initialVelocityX={-15}
        colors={['#D946EF', '#F97316', '#8B5CF6', '#E5DEFF', '#FFDEE2', '#FEC6A1']}
        confettiSource={{
          x: window.innerWidth,
          y: window.innerHeight / 2,
          w: 0,
          h: 0
        }}
      />
    </div>
  );
};
