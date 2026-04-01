import { useState, useEffect } from 'react';
import { getSoundEnabled, setSoundEnabled, resumeAudioContext } from '../sound';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getSoundEnabled());
  }, []);

  const toggle = () => {
    resumeAudioContext();
    const newValue = !enabled;
    setEnabled(newValue);
    setSoundEnabled(newValue);
  };

  return (
    <button 
      className="sound-toggle"
      onClick={toggle}
      title={enabled ? 'Sound On' : 'Sound Off'}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
    >
      <span className="sound-icon">{enabled ? '🔊' : '🔇'}</span>
    </button>
  );
}
