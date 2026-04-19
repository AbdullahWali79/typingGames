import { useState, useEffect } from 'react';
import SoundToggle from './SoundToggle';

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "games", label: "Games Library" },
  { id: "test", label: "Typing Test" },
  { id: "result", label: "Result Card" },
  { id: "progress", label: "My Progress" },
  { id: "about", label: "About" }
];

function StreakCounter() {
  const [streak, setStreak] = useState(0);
  
  useEffect(() => {
    const stats = localStorage.getItem('typingGame_achievementStats');
    if (stats) {
      try {
        const parsed = JSON.parse(stats);
        setStreak(parsed.streak || 0);
      } catch {
        setStreak(0);
      }
    }
  }, []);
  
  if (streak < 2) return null;
  
  return (
    <div className="streak-counter" title="Day streak!">
      <span className="flame">🔥</span>
      <span>{streak}</span>
    </div>
  );
}

export default function NavBar({ route, onNavigate }) {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-badge" />
        <span className="brand-text">Typing Adventure Kids</span>
      </div>
      <a
        className="nav-credit"
        href="https://muhammadabdullahwali.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Designed and Developed by Muhamamd Abdullah
      </a>
      <div className="nav-extras">
        <StreakCounter />
        <SoundToggle />
      </div>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${route === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
