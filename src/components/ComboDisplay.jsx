import { useEffect, useState } from 'react';

export default function ComboDisplay({ combo, multiplier }) {
  const [animate, setAnimate] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (combo > 1) {
      setAnimate(true);
      setShowPulse(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      const pulseTimer = setTimeout(() => setShowPulse(false), 500);
      return () => {
        clearTimeout(timer);
        clearTimeout(pulseTimer);
      };
    }
  }, [combo]);

  if (combo <= 1) return null;

  const getComboText = () => {
    if (combo >= 20) return 'UNSTOPPABLE!';
    if (combo >= 15) return 'INCREDIBLE!';
    if (combo >= 10) return 'AMAZING!';
    if (combo >= 5) return 'GREAT!';
    return 'Combo!';
  };

  const getComboClass = () => {
    if (combo >= 20) return 'combo-gold';
    if (combo >= 15) return 'combo-purple';
    if (combo >= 10) return 'combo-red';
    if (combo >= 5) return 'combo-orange';
    return 'combo-blue';
  };

  return (
    <div className={`combo-display ${getComboClass()} ${animate ? 'animate' : ''} ${showPulse ? 'pulse' : ''}`}>
      <div className="combo-text">{getComboText()}</div>
      <div className="combo-count">×{combo}</div>
      {multiplier > 1 && (
        <div className="multiplier-badge">
          {multiplier.toFixed(1)}× Score
        </div>
      )}
    </div>
  );
}
