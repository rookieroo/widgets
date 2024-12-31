import React, { useState, useEffect } from 'react';

const HideOnScroll = (
  {
                        children,
                        distance = 100,
                        direction = 'down',
                        hideOnScroll = true,
                        fixed = false,
                        static: isStatic = false
                      }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!hideOnScroll) return;

      const currentScrollY = window.scrollY;

      if (direction === 'down') {
        if (currentScrollY > lastScrollY && currentScrollY > distance) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else if (direction === 'up') {
        if (currentScrollY < lastScrollY && currentScrollY < distance) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    if (!isStatic) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (!isStatic) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [distance, direction, lastScrollY, hideOnScroll, isStatic]);

  const positionClass = fixed ? 'fixed top-0 left-0 right-0' : '';
  const visibilityClass = hideOnScroll ? (isVisible ? 'opacity-100' : 'opacity-0 invisible') : 'opacity-100';

  return (
    <div className={`transition-opacity duration-300 ${visibilityClass} ${positionClass}`}>
      {children}
    </div>
  );
};

export default HideOnScroll;