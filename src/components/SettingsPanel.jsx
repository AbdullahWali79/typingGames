import { useState, useEffect } from 'react';
import { getReducedMotion, setReducedMotion, getSoundEnabled, setSoundEnabled } from '../storage';
import { downloadProgressReport } from '../wpmHistory';

export default function SettingsPanel() {
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setReducedMotionState(getReducedMotion());
    setSoundEnabledState(getSoundEnabled());
  }, []);

  const handleReducedMotionChange = (e) => {
    const value = e.target.checked;
    setReducedMotionState(value);
    setReducedMotion(value);
    
    // Apply immediately
    if (value) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };

  const handleSoundChange = (e) => {
    const value = e.target.checked;
    setSoundEnabledState(value);
    setSoundEnabled(value);
  };

  const handleExport = () => {
    downloadProgressReport();
  };

  const handleResetAll = () => {
    if (showResetConfirm) {
      // Clear all localStorage
      localStorage.clear();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="settings-panel">
      <h3>⚙️ Settings</h3>
      
      <div className="settings-section">
        <h4>Accessibility</h4>
        
        <label className="setting-toggle">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={handleReducedMotionChange}
          />
          <span className="toggle-label">
            <span className="toggle-title">Reduced Motion</span>
            <span className="toggle-desc">Disable animations and confetti</span>
          </span>
        </label>

        <label className="setting-toggle">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={handleSoundChange}
          />
          <span className="toggle-label">
            <span className="toggle-title">Sound Effects</span>
            <span className="toggle-desc">Enable typing sounds and music</span>
          </span>
        </label>
      </div>

      <div className="settings-section">
        <h4>Data</h4>
        
        <button className="secondary-btn export-btn" onClick={handleExport}>
          📥 Export Progress Report
        </button>
        
        <button 
          className={`text-btn reset-btn ${showResetConfirm ? 'confirm' : ''}`}
          onClick={handleResetAll}
        >
          {showResetConfirm ? 'Click again to confirm reset' : '🗑️ Reset All Progress'}
        </button>
      </div>

      <div className="settings-footer">
        <p>Typing Adventure Kids v1.0</p>
        <p>No data leaves your device - everything is stored locally!</p>
      </div>
    </div>
  );
}
