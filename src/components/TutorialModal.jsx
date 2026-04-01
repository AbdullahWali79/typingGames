import { useState, useEffect } from 'react';

const TUTORIALS = {
  'letter-pop': {
    title: '🎯 Letter Pop',
    steps: [
      { emoji: '👀', text: 'Watch the letters that appear on screen' },
      { emoji: '⌨️', text: 'Type each letter quickly before it floats away!' },
      { emoji: '💨', text: 'The faster you type, the more points you get' }
    ]
  },
  'word-race': {
    title: '🏎️ Word Race',
    steps: [
      { emoji: '🏁', text: 'Race against time to type words' },
      { emoji: '⚡', text: 'Type each word completely and press Enter' },
      { emoji: '🏆', text: 'Build speed to win the race!' }
    ]
  },
  'typing-ninja': {
    title: '🥷 Typing Ninja',
    steps: [
      { emoji: '👆', text: 'Words will fall from the top' },
      { emoji: '⚔️', text: 'Type them quickly to slice them!' },
      { emoji: '🛡️', text: 'Don\'t let them reach the bottom' }
    ]
  },
  'memory-typing-flip': {
    title: '🧠 Memory Typing',
    steps: [
      { emoji: '👁️', text: 'Memorize the word shown' },
      { emoji: '🫥', text: 'The word will hide after a few seconds' },
      { emoji: '✍️', text: 'Type what you remember!' }
    ]
  },
  'math-plus-type': {
    title: '🔢 Math + Type',
    steps: [
      { emoji: '🧮', text: 'Solve the math problem' },
      { emoji: '💭', text: 'Calculate the answer in your head' },
      { emoji: '⌨️', text: 'Type the correct answer' }
    ]
  },
  default: {
    title: '🎮 How to Play',
    steps: [
      { emoji: '👀', text: 'Read the prompt shown on screen' },
      { emoji: '⌨️', text: 'Type exactly what you see' },
      { emoji: '↩️', text: 'Press Enter to submit' },
      { emoji: '⭐', text: 'Get points for speed and accuracy!' }
    ]
  }
};

export default function TutorialModal({ gameId, onClose, onStart }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const tutorial = TUTORIALS[gameId] || TUTORIALS.default;

  useEffect(() => {
    // Check if user has disabled tutorials
    const skipTutorials = localStorage.getItem('typingGame_skipTutorials') === 'true';
    if (skipTutorials) {
      onStart();
    }
  }, [onStart]);

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('typingGame_skipTutorials', 'true');
    }
    onStart();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div className="tutorial-modal" onClick={e => e.stopPropagation()}>
        <h2>{tutorial.title}</h2>
        
        <div className="tutorial-steps">
          {tutorial.steps.map((step, index) => (
            <div key={index} className="tutorial-step">
              <span className="step-emoji">{step.emoji}</span>
              <span className="step-number">{index + 1}</span>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <div className="finger-tips">
          <h4>💡 Finger Tips</h4>
          <p>
            Use your <strong>left hand</strong> for keys on the left side (A, S, D, F)<br/>
            Use your <strong>right hand</strong> for keys on the right side (J, K, L, ;)<br/>
            Keep your fingers on the <strong>home row</strong>!
          </p>
        </div>

        <label className="skip-checkbox">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={e => setDontShowAgain(e.target.checked)}
          />
          Don't show tutorials again
        </label>

        <div className="tutorial-actions">
          <button className="secondary-btn" onClick={handleSkip}>
            Skip
          </button>
          <button className="primary-btn" onClick={handleStart}>
            Got it! Let's play 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
