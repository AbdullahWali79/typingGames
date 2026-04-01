import { useState, useEffect } from 'react';

const MASCOT_EMOJIS = {
  idle: '🦊',
  happy: '🎉',
  cheering: '🌟',
  thinking: '🤔',
  encouraging: '💪',
  celebrating: '🏆',
  sleepy: '😴'
};

const MESSAGES = {
  idle: [
    "Ready to type?",
    "Let's practice!",
    "Click Start when ready!"
  ],
  encouraging: [
    "You're doing great!",
    "Keep it up!",
    "Almost there!",
    "Nice typing!",
    "Focus on accuracy!"
  ],
  celebrating: [
    "Amazing work!",
    "You're a typing star!",
    "Fantastic job!",
    "New record!",
    "Incredible!"
  ],
  perfect: [
    "PERFECT! 💯",
    "Flawless typing!",
    "100% amazing!"
  ],
  combo: [
    "Combo! 🔥",
    "Keep the streak!",
    "Unstoppable!"
  ],
  mistake: [
    "No worries, try again!",
    "Mistakes help us learn!",
    "Stay focused!"
  ]
};

export default function Mascot({ 
  status = 'idle', 
  combo = 0, 
  accuracy = 0,
  justMadeMistake = false,
  justUnlockedAchievement = false
}) {
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState(MASCOT_EMOJIS.idle);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    let newEmoji = MASCOT_EMOJIS.idle;
    let messages = MESSAGES.idle;

    if (justUnlockedAchievement) {
      newEmoji = MASCOT_EMOJIS.celebrating;
      messages = ["New achievement! 🏆"];
    } else if (status === 'finished') {
      if (accuracy === 100) {
        newEmoji = MASCOT_EMOJIS.celebrating;
        messages = MESSAGES.perfect;
      } else if (accuracy >= 90) {
        newEmoji = MASCOT_EMOJIS.happy;
        messages = MESSAGES.celebrating;
      } else {
        newEmoji = MASCOT_EMOJIS.happy;
        messages = ["Good job! Keep practicing!"];
      }
    } else if (status === 'running') {
      if (justMadeMistake) {
        newEmoji = MASCOT_EMOJIS.thinking;
        messages = MESSAGES.mistake;
      } else if (combo >= 10) {
        newEmoji = MASCOT_EMOJIS.cheering;
        messages = MESSAGES.combo;
      } else if (combo >= 5) {
        newEmoji = MASCOT_EMOJIS.encouraging;
        messages = MESSAGES.combo;
      } else {
        newEmoji = MASCOT_EMOJIS.encouraging;
        messages = MESSAGES.encouraging;
      }
    }

    setEmoji(newEmoji);
    setMessage(messages[Math.floor(Math.random() * messages.length)]);

    // Auto-hide bubble after 5 seconds if idle
    if (status === 'idle') {
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowBubble(true);
    }
  }, [status, combo, accuracy, justMadeMistake, justUnlockedAchievement]);

  const handleClick = () => {
    setShowBubble(!showBubble);
    // Wiggle animation
    const mascot = document.querySelector('.mascot-character');
    if (mascot) {
      mascot.classList.add('wiggle');
      setTimeout(() => mascot.classList.remove('wiggle'), 500);
    }
  };

  return (
    <div className="mascot-container" onClick={handleClick}>
      {showBubble && message && (
        <div className="mascot-bubble">
          {message}
        </div>
      )}
      <div className="mascot-character">
        <span className="mascot-emoji">{emoji}</span>
        {combo > 1 && status === 'running' && (
          <span className="combo-indicator">×{combo}</span>
        )}
      </div>
    </div>
  );
}
