import { useState, useEffect } from 'react';
import { getAllAchievements, resetAchievements } from '../achievements';

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setAchievements(getAllAchievements());
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  const handleReset = () => {
    if (confirm('Reset all achievements? This cannot be undone.')) {
      resetAchievements();
      setAchievements(getAllAchievements());
    }
  };

  const displayAchievements = showAll ? achievements : achievements.filter(a => a.unlocked).slice(0, 6);

  return (
    <div className="achievements-panel">
      <div className="achievements-header">
        <h3>🏆 Achievements</h3>
        <div className="achievement-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{unlockedCount}/{totalCount}</span>
        </div>
      </div>

      <div className="achievements-grid">
        {displayAchievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            title={achievement.description}
          >
            <span className="achievement-icon">{achievement.icon}</span>
            <span className="achievement-title">{achievement.title}</span>
            {!achievement.unlocked && <span className="lock-icon">🔒</span>}
          </div>
        ))}
      </div>

      {achievements.filter(a => a.unlocked).length > 6 && !showAll && (
        <button 
          className="text-btn show-more"
          onClick={() => setShowAll(true)}
        >
          Show all achievements
        </button>
      )}

      {showAll && (
        <button 
          className="text-btn show-less"
          onClick={() => setShowAll(false)}
        >
          Show less
        </button>
      )}

      <button className="text-btn reset-btn" onClick={handleReset}>
        Reset achievements
      </button>
    </div>
  );
}
