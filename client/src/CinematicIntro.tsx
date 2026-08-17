import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CinematicIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Total intro duration: 1.8 seconds max
    const timer = setTimeout(() => setVisible(false), 1750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cinematic-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            clipPath: 'inset(0 0 100% 0)' 
          }}
          transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
        >
          <div className="cinematic-intro-content">
            {/* Logo Reveal */}
            <motion.div
              className="intro-logo-wrapper"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src="/7bit-media-logo.png" alt="7bit Media" className="intro-logo" />
            </motion.div>

            {/* Subtle Timeline / Scan line */}
            <motion.div
              className="intro-timeline-line"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
