
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useIsMobile } from '@/hooks/use-mobile';

export const ConfettiEffect = () => {
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={isMobile ? 100 : 200}
        recycle={false}
      />
    </div>
  );
};
