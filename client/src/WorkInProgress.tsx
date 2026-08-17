import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';

interface WorkInProgressProps {
  platformName: string;
  onBack: () => void;
}

export function WorkInProgress({ platformName, onBack }: WorkInProgressProps) {
  return (
    <div className="wip-container">
      <div className="wip-overlay" />
      <motion.div 
        className="wip-card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button onClick={onBack} className="wip-back-btn" aria-label="Back to main page">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="wip-badge">
          <Sparkles size={14} />
          <span>COMING SOON</span>
        </div>

        <h1 className="wip-title">
          {platformName} <span>Presence</span>
        </h1>

        <p className="wip-description">
          We are currently crafting our official {platformName} experience. Stay tuned for curated edits, behind-the-scenes breakdowns, and exclusive visual content.
        </p>

        <div className="wip-status-box">
          <div className="wip-pulse" />
          <Clock size={16} className="wip-clock" />
          <span>Work In Progress — Launching Soon</span>
        </div>

        <div className="wip-footer-links">
          <a href="#contact" onClick={onBack} className="button button--small">
            Contact Us Directly
          </a>
          <a 
            href="https://www.instagram.com/7bit.media" 
            target="_blank" 
            rel="noreferrer"
            className="text-link"
          >
            Visit Instagram @7bit.media
          </a>
        </div>
      </motion.div>
    </div>
  );
}
