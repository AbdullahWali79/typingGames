import { useState, useEffect } from 'react';
import { getAchievementStats } from '../achievements';
import { getWpmStats } from '../wpmHistory';

export default function HomePage({ onPlayGames, onTakeTest, selectedDifficulty }) {
  const [streak, setStreak] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [achievements, setAchievements] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);

  useEffect(() => {
    const achievementStats = getAchievementStats();
    setStreak(achievementStats.streak || 0);
    setTotalGames(achievementStats.gamesCompleted || 0);
    
    const unlocked = localStorage.getItem('typingGame_achievements');
    if (unlocked) {
      try {
        const list = JSON.parse(unlocked);
        setAchievements(list.length);
      } catch {
        setAchievements(0);
      }
    }
    
    const wpmStats = getWpmStats();
    setBestWpm(wpmStats.best);
  }, []);

  return (
    <section className="page home-page">
      <div className="hero-card">
        <p className="kicker">Fun typing for ages 5-12</p>
        <h1>Build speed, accuracy, and confidence.</h1>
        <p>
          Pick a game, race your score, then take a typing test and save your
          result card as a PNG image.
        </p>
        <p className="difficulty-pill">Current level: {selectedDifficulty}</p>
        
        {/* Quick Stats */}
        {(streak > 0 || totalGames > 0) && (
          <div className="quick-stats">
            {streak > 0 && (
              <span className="stat-chip streak">
                🔥 {streak} day streak
              </span>
            )}
            {totalGames > 0 && (
              <span className="stat-chip games">
                🎮 {totalGames} games played
              </span>
            )}
            {achievements > 0 && (
              <span className="stat-chip achievements">
                🏆 {achievements} achievements
              </span>
            )}
            {bestWpm > 0 && (
              <span className="stat-chip wpm">
                ⚡ {bestWpm} WPM best
              </span>
            )}
          </div>
        )}
        
        <div className="hero-actions">
          <button className="cta-btn play" type="button" onClick={onPlayGames}>
            🎮 Play Games
          </button>
          <button className="cta-btn test" type="button" onClick={onTakeTest}>
            📝 Take Typing Test
          </button>
        </div>
      </div>
      
      <div className="feature-grid">
        <article className="feature-card">
          <h3>🎯 20+ Games</h3>
          <p>Letter Pop, Word Race, Typing Ninja, and more fun games!</p>
        </article>
        <article className="feature-card">
          <h3>🏆 Achievements</h3>
          <p>Unlock badges as you improve your typing skills.</p>
        </article>
        <article className="feature-card">
          <h3>📈 Track Progress</h3>
          <p>View your WPM history and keyboard heatmap.</p>
        </article>
        <article className="feature-card">
          <h3>🔊 Sound Effects</h3>
          <p>Fun audio feedback for every key you press.</p>
        </article>
        <article className="feature-card">
          <h3>💾 Auto-Save</h3>
          <p>Your progress is saved automatically. No login needed!</p>
        </article>
        <article className="feature-card">
          <h3>📱 Install App</h3>
          <p>Add to your home screen for quick access.</p>
        </article>
      </div>
    </section>
  );
}
