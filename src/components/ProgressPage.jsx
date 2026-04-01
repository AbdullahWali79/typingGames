import { useState } from 'react';
import { GAME_LIBRARY } from "../data";
import { formatResultDate } from "../utils";
import AchievementsPanel from './AchievementsPanel';
import WpmGraph from './WpmGraph';
import KeyboardHeatmap from './KeyboardHeatmap';
import SettingsPanel from './SettingsPanel';
import { getWpmStats, getPersonalBest } from '../wpmHistory';
import { getAchievementStats } from '../achievements';

const TABS = [
  { id: 'overview', label: '📊 Overview', icon: '📊' },
  { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
  { id: 'progress', label: '📈 Progress', icon: '📈' },
  { id: 'keyboard', label: '⌨️ Keyboard', icon: '⌨️' },
  { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
];

export default function ProgressPage({ snapshot }) {
  const [activeTab, setActiveTab] = useState('overview');
  const favorite = GAME_LIBRARY.find((game) => game.id === snapshot.favoriteGame);
  const recent = snapshot.recentResult;
  const wpmStats = getWpmStats();
  const personalBest = getPersonalBest();
  const achievementStats = getAchievementStats();

  const renderOverview = () => (
    <>
      <div className="progress-grid">
        <article className="progress-card">
          <h3>Best WPM</h3>
          <p>{snapshot.bestWpm.toFixed(1)}</p>
          {personalBest && (
            <small>on {new Date(personalBest.date).toLocaleDateString()}</small>
          )}
        </article>
        <article className="progress-card">
          <h3>Best Accuracy</h3>
          <p>{snapshot.bestAccuracy.toFixed(1)}%</p>
        </article>
        <article className="progress-card">
          <h3>Favourite Game</h3>
          <p>{favorite ? favorite.title : "Play some games first"}</p>
        </article>
        <article className="progress-card">
          <h3>Total Games Played</h3>
          <p>{snapshot.totalGamesPlayed}</p>
        </article>
        <article className="progress-card">
          <h3>Average WPM</h3>
          <p>{wpmStats.average}</p>
        </article>
        <article className="progress-card">
          <h3>Current Streak</h3>
          <p>{achievementStats.streak || 0} 🔥</p>
        </article>
      </div>

      <div className="recent-result-card">
        <h3>Recent Typing Test Result</h3>
        {recent ? (
          <div>
            <p>Name: {recent.name}</p>
            <p>WPM: {recent.wpm}</p>
            <p>Accuracy: {recent.accuracy}%</p>
            <p>Mistakes: {recent.mistakes}</p>
            <p>Level: {recent.level}</p>
            <p>Date: {formatResultDate(recent.date)}</p>
          </div>
        ) : (
          <p>No test yet. Take one from the Typing Test page.</p>
        )}
      </div>

      <div className="games-stats-table">
        <h3>Game High Scores</h3>
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Best Score</th>
              <th>Best Accuracy</th>
              <th>Best Speed</th>
              <th>Plays</th>
            </tr>
          </thead>
          <tbody>
            {GAME_LIBRARY.map((game) => {
              const stat = snapshot.gameStats[game.id] ?? {
                bestScore: 0,
                bestAccuracy: 0,
                bestSpeed: 0,
                plays: 0
              };
              return (
                <tr key={game.id}>
                  <td>{game.title}</td>
                  <td>{stat.bestScore}</td>
                  <td>{stat.bestAccuracy.toFixed(1)}%</td>
                  <td>{stat.bestSpeed.toFixed(1)} WPM</td>
                  <td>{stat.plays}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <section className="page">
      <div className="section-head">
        <div>
          <h2>My Progress</h2>
          <p>All progress is saved only in this browser with localStorage.</p>
        </div>
      </div>

      <div className="progress-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`progress-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="progress-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && <AchievementsPanel />}
        {activeTab === 'progress' && <WpmGraph />}
        {activeTab === 'keyboard' && <KeyboardHeatmap />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </section>
  );
}
