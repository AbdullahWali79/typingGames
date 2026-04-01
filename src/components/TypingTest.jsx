import { useEffect, useMemo, useRef, useState } from "react";
import DifficultySelector from "./DifficultySelector";
import VirtualKeyboard from "./VirtualKeyboard";
import Mascot from "./Mascot";
import Confetti from "./Confetti";
import { DIFFICULTY_LEVELS, TEST_PASSAGES, TEST_STORIES } from "../data";
import {
  calculateAccuracy,
  calculateWpm,
  countMatchingCharacters,
  getMotivationMessage,
  getRandomPassage,
  getTypingLevel,
  round
} from "../utils";
import { recordTypingSession } from '../keyboardStats';
import { addWpmEntry, compareToPersonalBest } from '../wpmHistory';
import { updateStreak } from '../achievements';
import {
  playTypeSound,
  playSuccessSound,
  playCompleteSound,
  resumeAudioContext
} from '../sound';
import { getReducedMotion } from '../storage';

export default function TypingTest({ difficulty, onDifficultyChange, onComplete }) {
  const settings = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS.Beginner;
  const [status, setStatus] = useState("setup");
  const [name, setName] = useState("");
  const [contentMode, setContentMode] = useState("passage");
  const [passage, setPassage] = useState("");
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(settings.testTime);
  const [showConfetti, setShowConfetti] = useState(false);
  const [personalBestComparison, setPersonalBestComparison] = useState(null);
  
  const textAreaRef = useRef(null);
  const startTimeRef = useRef(null);
  const reducedMotion = useRef(getReducedMotion());

  useEffect(() => {
    if (status !== "running") return;
    
    const timer = setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft === 0) {
      finishTest();
    }
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === "setup") {
      setTimeLeft(settings.testTime);
    }
  }, [difficulty, settings.testTime, status]);

  useEffect(() => {
    if (status === "running") {
      setTimeout(() => textAreaRef.current?.focus(), 0);
    }
  }, [status]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && status === "setup") {
        e.preventDefault();
        startTest();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  const liveAccuracy = useMemo(() => {
    const correct = countMatchingCharacters(passage.slice(0, typedText.length), typedText);
    return round(calculateAccuracy(correct, typedText.length));
  }, [passage, typedText]);

  const liveWpm = useMemo(() => {
    if (!startTimeRef.current) return 0;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const correct = countMatchingCharacters(passage.slice(0, typedText.length), typedText);
    return round(calculateWpm(correct, elapsed));
  }, [passage, typedText]);

  function startTest() {
    resumeAudioContext();
    
    const source = contentMode === "story" ? TEST_STORIES : TEST_PASSAGES;
    setPassage(getRandomPassage(source, difficulty));
    setTypedText("");
    setTimeLeft(settings.testTime);
    startTimeRef.current = Date.now();
    setStatus("running");
    updateStreak();
    setPersonalBestComparison(null);
  }

  function finishTest() {
    const testDuration = settings.testTime - timeLeft || settings.testTime;
    const expectedPart = passage.slice(0, typedText.length);
    const correctChars = countMatchingCharacters(expectedPart, typedText);
    const mistakes = Math.max(typedText.length - correctChars, 0);
    const accuracy = round(calculateAccuracy(correctChars, typedText.length));
    const wpm = round(calculateWpm(correctChars, testDuration));
    const level = getTypingLevel(wpm);
    
    // Track keyboard stats
    recordTypingSession(passage, typedText);
    
    // Add to WPM history
    addWpmEntry(wpm, accuracy, contentMode);
    
    // Check personal best
    const comparison = compareToPersonalBest(wpm, accuracy);
    setPersonalBestComparison(comparison);
    
    // Play sounds
    if (comparison.isNewBest) {
      playCompleteSound();
      if (!reducedMotion.current) {
        setShowConfetti(true);
      }
    }
    
    const result = {
      name: name.trim() || "Guest",
      wpm,
      accuracy,
      mistakes,
      totalTypedCharacters: typedText.length,
      level,
      difficulty,
      testMode: contentMode,
      date: new Date().toISOString(),
      message: getMotivationMessage(wpm, accuracy),
      isNewBest: comparison.isNewBest
    };

    setStatus("setup");
    onComplete(result);
  }

  function handleTyping(e) {
    const newText = e.target.value;
    const addedChar = newText[newText.length - 1];
    
    if (newText.length > typedText.length && addedChar) {
      playTypeSound();
      
      // Check if correct
      const expectedChar = passage[newText.length - 1];
      if (addedChar.toLowerCase() === expectedChar?.toLowerCase()) {
        // Could add visual feedback for correct char
      }
    }
    
    setTypedText(newText);
  }

  function renderPassage() {
    return (
      <p className="passage">
        {passage.split("").map((character, index) => {
          let className = "pending";
          if (index < typedText.length) {
            className = typedText[index]?.toLowerCase() === character.toLowerCase() ? "correct" : "wrong";
          }
          return (
            <span key={`${character}-${index}`} className={className}>
              {character}
            </span>
          );
        })}
      </p>
    );
  }

  function addVirtualCharacter(character) {
    playTypeSound();
    setTypedText((previous) => `${previous}${character}`);
    textAreaRef.current?.focus();
  }

  function removeVirtualCharacter() {
    setTypedText((previous) => previous.slice(0, -1));
    textAreaRef.current?.focus();
  }

  if (status === "setup") {
    return (
      <section className="page">
        <div className="section-head">
          <div>
            <h2>Typing Test</h2>
            <p>Take a timed typing test as a guest and track your growth.</p>
          </div>
          <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
        </div>

        <div className="test-setup">
          <label htmlFor="player-name">Your name (optional)</label>
          <input
            id="player-name"
            type="text"
            placeholder="Guest Typist"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          
          {personalBestComparison?.previousBest && (
            <div className="personal-best-info">
              <p>🏆 Your personal best: {personalBestComparison.previousBest.wpm} WPM</p>
            </div>
          )}
          
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-btn ${contentMode === "passage" ? "active" : ""}`}
              onClick={() => setContentMode("passage")}
            >
              Quick Passage
            </button>
            <button
              type="button"
              className={`mode-btn ${contentMode === "story" ? "active" : ""}`}
              onClick={() => setContentMode("story")}
            >
              Short Story
            </button>
          </div>
          <p className="setup-note">
            Timer: {settings.testTime} seconds | Difficulty: {difficulty} | Mode:{" "}
            {contentMode === "story" ? "Short Story" : "Quick Passage"}
          </p>
          <button className="primary-btn" type="button" onClick={startTest}>
            Start Typing Test
          </button>
          <p className="keyboard-shortcuts-hint">
            💡 Press <kbd>Space</kbd> to start quickly
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <Confetti active={showConfetti} duration={5000} />
      
      <Mascot status={status} />
      
      <div className="section-head">
        <div>
          <h2>Typing Test In Progress</h2>
          <p>Type as accurately and quickly as you can.</p>
        </div>
        <div className="timer-badge">{timeLeft}s</div>
      </div>

      <div className="test-card">
        {renderPassage()}
        <textarea
          ref={textAreaRef}
          value={typedText}
          onChange={handleTyping}
          placeholder="Start typing the text shown above..."
          autoFocus
        />
        <div className="test-live-stats">
          <span>Typed: {typedText.length} chars</span>
          <span>Live Accuracy: {liveAccuracy}%</span>
          <span>Live WPM: {liveWpm}</span>
          <span>Difficulty: {difficulty}</span>
        </div>
        <button className="secondary-btn" type="button" onClick={finishTest}>
          Finish Test
        </button>
        <VirtualKeyboard
          disabled={status !== "running"}
          onInput={addVirtualCharacter}
          onBackspace={removeVirtualCharacter}
          onSpace={() => addVirtualCharacter(" ")}
          onEnter={() => addVirtualCharacter(" ")}
          nextHintChar={passage[typedText.length]}
          theme={contentMode === "story" ? "story" : "test"}
          layout="full"
        />
      </div>
    </section>
  );
}
