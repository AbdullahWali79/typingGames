import { useEffect, useMemo, useRef, useState } from "react";
import DifficultySelector from "./DifficultySelector";
import VirtualKeyboard from "./VirtualKeyboard";
import Mascot from "./Mascot";
import TypingHandsOverlay from "./TypingHandsOverlay";
import { getHandsEnabled } from "../handsSettings";
import ComboDisplay from "./ComboDisplay";
import Confetti from "./Confetti";
import TutorialModal from "./TutorialModal";
import {
  DIFFICULTY_LEVELS,
  ENCOURAGEMENTS,
  BEGINNER_KEY_STEPS,
  BEGINNER_STEP_TARGET
} from "../data";
import {
  buildGameChallenge,
  calculateAccuracy,
  calculateWpm,
  countMatchingCharacters,
  randomItem,
  round
} from "../utils";
import {
  incrementCombo,
  resetCombo,
  getCombo,
  getMaxCombo,
  autoSaveProgress,
  getAutoSavedProgress,
  clearAutoSave,
  getReducedMotion,
  getBeginnerTraining,
  saveBeginnerTraining
} from "../storage";
import {
  playTypeSound,
  playSuccessSound,
  playErrorSound,
  playComboSound,
  playStartSound,
  playCompleteSound,
  resumeAudioContext
} from "../sound";
import { recordTypingSession } from "../keyboardStats";
import { updateAchievementStats, updateStreak, checkForNewAchievements, getAchievementStats } from "../achievements";

const INITIAL_METRICS = {
  score: 0,
  attempts: 0,
  correctPrompts: 0,
  typedChars: 0,
  correctChars: 0,
  mistakeChars: 0
};

function createInitialMetrics() {
  return { ...INITIAL_METRICS };
}

export default function GameArena({
  game,
  difficulty,
  onDifficultyChange,
  onBackToLibrary,
  onGameComplete
}) {
  const settings = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS.Beginner;
  const [status, setStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(settings.gameTime);
  const [targetPrompt, setTargetPrompt] = useState("");
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [promptHint, setPromptHint] = useState("");
  const [challengeMeta, setChallengeMeta] = useState({});
  const [isPromptHidden, setIsPromptHidden] = useState(false);
  const [entry, setEntry] = useState("");
  const [feedback, setFeedback] = useState("Type what you see and press Enter.");
  const [metrics, setMetrics] = useState(createInitialMetrics);
  const [finalStats, setFinalStats] = useState(null);
  const [combo, setCombo] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [justMadeMistake, setJustMadeMistake] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [justUnlockedAchievement, setJustUnlockedAchievement] = useState(false);
  const [lastPressedChar, setLastPressedChar] = useState(null);
  const [beginnerTraining, setBeginnerTraining] = useState(() => sanitizeBeginnerTraining(getBeginnerTraining()));
  
  const inputRef = useRef(null);
  const metricsRef = useRef(metrics);
  const promptIssuedAtRef = useRef(Date.now());
  const reducedMotion = useRef(getReducedMotion());
  const handsEnabled = useRef(getHandsEnabled());
  const isBeginnerCurriculum = difficulty === "Beginner";
  const currentBeginnerStep = Math.min(beginnerTraining.step, BEGINNER_KEY_STEPS.length - 1);
  const currentBeginnerPair = BEGINNER_KEY_STEPS[currentBeginnerStep] ?? ["f", "j"];

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    resetSession();
  }, [game.id, difficulty]);

  useEffect(() => {
    if (status !== "running") return;
    
    const timer = setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
      // Auto-save every 10 seconds
      if (timeLeft % 10 === 0) {
        autoSaveProgress(game.id, {
          timeLeft,
          metrics: metricsRef.current,
          combo
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeLeft, game.id]);

  useEffect(() => {
    if (status === "running" && timeLeft === 0) {
      finishSession();
    }
  }, [status, timeLeft]);

  useEffect(() => {
    setIsPromptHidden(false);
    if (status !== "running" || !challengeMeta.hideAfterMs) return;

    const hideTimer = setTimeout(() => {
      setIsPromptHidden(true);
    }, challengeMeta.hideAfterMs);

    return () => clearTimeout(hideTimer);
  }, [challengeMeta, displayPrompt, status]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && status === "idle") {
        e.preventDefault();
        startSession();
      }
      if (e.code === "Escape") {
        if (status === "running") {
          finishSession();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  // Check for auto-saved progress
  useEffect(() => {
    const saved = getAutoSavedProgress();
    if (saved && saved.gameId === game.id && status === "idle") {
      // Could offer to restore here
      clearAutoSave();
    }
  }, [game.id, status]);

  const elapsedSeconds = settings.gameTime - timeLeft;
  const liveAccuracy = round(calculateAccuracy(metrics.correctChars, metrics.typedChars));
  const liveSpeed = round(calculateWpm(metrics.correctChars, Math.max(elapsedSeconds, 1)));
  
  const comboMultiplier = useMemo(() => {
    if (combo >= 20) return 3;
    if (combo >= 15) return 2.5;
    if (combo >= 10) return 2;
    if (combo >= 5) return 1.5;
    return 1 + (combo * 0.05);
  }, [combo]);

  const progressLabel = useMemo(() => {
    if (status === "finished") return "Session complete";
    if (status === "running") return `${metrics.correctPrompts} targets cleared`;
    return "Ready to start";
  }, [metrics.correctPrompts, status]);

  const modeLabel = useMemo(() => {
    if (isBeginnerCurriculum) {
      return `Step ${currentBeginnerStep + 1}/${BEGINNER_KEY_STEPS.length} • ${currentBeginnerPair[0].toUpperCase()} + ${currentBeginnerPair[1].toUpperCase()} • ${Math.min(beginnerTraining.correct, BEGINNER_STEP_TARGET)}/${BEGINNER_STEP_TARGET}`;
    }
    if (game.promptStyle === "treasure") {
      return `Treasure unlocked: ${metrics.correctPrompts}/12`;
    }
    if (game.promptStyle === "escape") {
      return `Safety meter: ${Math.max(0, 10 - metrics.mistakeChars)}/10`;
    }
    if (game.promptStyle === "maze") {
      return `Maze gates open: ${metrics.correctPrompts}`;
    }
    if (game.promptStyle === "boss" && challengeMeta.isBossRound) {
      return "Boss round active";
    }
    if (game.promptStyle === "story") {
      return `Story chapter ${challengeMeta.chapter ?? 1}`;
    }
    return "";
  }, [
    beginnerTraining.correct,
    challengeMeta.chapter,
    challengeMeta.isBossRound,
    currentBeginnerPair,
    currentBeginnerStep,
    game.promptStyle,
    isBeginnerCurriculum,
    metrics.correctPrompts,
    metrics.mistakeChars
  ]);

  const totalBeginnerSteps = BEGINNER_KEY_STEPS.length;
  const completedBeginnerSteps = Math.min(
    beginnerTraining.step + (beginnerTraining.correct >= BEGINNER_STEP_TARGET ? 1 : 0),
    totalBeginnerSteps
  );
  const overallBeginnerProgress = Math.round((completedBeginnerSteps / totalBeginnerSteps) * 100);
  const currentStepProgress = Math.min(
    Math.round((beginnerTraining.correct / BEGINNER_STEP_TARGET) * 100),
    100
  );

  const beginnerChecklist = useMemo(() => {
    return BEGINNER_KEY_STEPS.map((pair, index) => {
      const isLastStep = index === totalBeginnerSteps - 1;
      const isDone =
        index < beginnerTraining.step ||
        (index === beginnerTraining.step &&
          (beginnerTraining.correct >= BEGINNER_STEP_TARGET || (isLastStep && beginnerTraining.correct >= BEGINNER_STEP_TARGET)));
      const isCurrent = !isDone && index === beginnerTraining.step;

      return {
        index,
        pair,
        status: isDone ? "done" : isCurrent ? "current" : "pending"
      };
    });
  }, [beginnerTraining.correct, beginnerTraining.step, totalBeginnerSteps]);

  const visiblePrompt = isPromptHidden
    ? challengeMeta.hiddenDisplay || "????"
    : displayPrompt;

  function resetSession() {
    const storedTraining = sanitizeBeginnerTraining(getBeginnerTraining());
    setBeginnerTraining(storedTraining);
    setStatus("idle");
    setTimeLeft(settings.gameTime);
    applyNextChallenge(0, 0, storedTraining);
    setEntry("");
    setFeedback("Type what you see and press Enter.");
    setMetrics(createInitialMetrics());
    setFinalStats(null);
    setCombo(0);
    resetCombo();
    setShowConfetti(false);
    setJustMadeMistake(false);
    setNewAchievements([]);
    setJustUnlockedAchievement(false);
    clearAutoSave();
  }

  function startSession() {
    resumeAudioContext();
    playStartSound();
    
    // Check if we should show tutorial
    const skipTutorials = localStorage.getItem('typingGame_skipTutorials') === 'true';
    if (!skipTutorials) {
      setShowTutorial(true);
      return;
    }
    
    actuallyStartSession();
  }

  function actuallyStartSession() {
    const storedTraining = sanitizeBeginnerTraining(getBeginnerTraining());
    setBeginnerTraining(storedTraining);
    setStatus("running");
    setTimeLeft(settings.gameTime);
    applyNextChallenge(0, 0, storedTraining);
    setEntry("");
    setFeedback("You can do this!");
    setMetrics(createInitialMetrics());
    setFinalStats(null);
    setCombo(0);
    resetCombo();
    updateStreak();
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function submitEntry() {
    if (status !== "running") return;

    const typed = entry.trim();
    if (!typed) return;

    const currentMetrics = metricsRef.current;
    const target = targetPrompt.trim();
    const matches = countMatchingCharacters(target, typed);
    const mistakes = Math.max(Math.max(typed.length, target.length) - matches, 0);
    const isCorrect = normalizeTypedValue(typed) === normalizeTypedValue(target);

    // Track keyboard stats
    recordTypingSession(target, typed);

    // Handle combo
    let newCombo = combo;
    if (isCorrect) {
      newCombo = incrementCombo();
      setCombo(newCombo);
      playComboSound(newCombo);
      playSuccessSound();
      setJustMadeMistake(false);
    } else {
      newCombo = resetCombo();
      setCombo(0);
      playErrorSound();
      setJustMadeMistake(true);
      setTimeout(() => setJustMadeMistake(false), 1000);
    }

    // Calculate score with combo multiplier
    const baseGain = isCorrect
      ? Math.round((target.length + 4) * settings.scoreMultiplier)
      : Math.round(matches * settings.scoreMultiplier * 0.4);
    const comboBonus = isCorrect ? Math.round(baseGain * (comboMultiplier - 1)) : 0;
    const responseTime = Date.now() - promptIssuedAtRef.current;
    const rhythmBonus =
      isCorrect && challengeMeta.rhythmWindowMs && responseTime <= challengeMeta.rhythmWindowMs
        ? Math.round(5 * settings.scoreMultiplier)
        : 0;
    const bossBonus =
      isCorrect && challengeMeta.isBossRound ? Math.round(12 * settings.scoreMultiplier) : 0;
    const memoryBonus =
      isCorrect && game.promptStyle === "memory" ? Math.round(3 * settings.scoreMultiplier) : 0;
    
    const gain = baseGain + comboBonus + rhythmBonus + bossBonus + memoryBonus;
    const nextCorrectPrompts = currentMetrics.correctPrompts + (isCorrect ? 1 : 0);
    const nextMistakeChars = currentMetrics.mistakeChars + mistakes;
    let nextTraining = beginnerTraining;

    if (isBeginnerCurriculum && isCorrect) {
      const lastStep = BEGINNER_KEY_STEPS.length - 1;
      let nextStep = currentBeginnerStep;
      let nextCorrect = beginnerTraining.correct + 1;

      if (nextCorrect >= BEGINNER_STEP_TARGET) {
        if (currentBeginnerStep < lastStep) {
          nextStep = currentBeginnerStep + 1;
          nextCorrect = 0;
        } else {
          nextCorrect = BEGINNER_STEP_TARGET;
        }
      }

      nextTraining = sanitizeBeginnerTraining({ step: nextStep, correct: nextCorrect });
      setBeginnerTraining(nextTraining);
      saveBeginnerTraining(nextTraining.step, nextTraining.correct);
    }

    setMetrics((prev) => ({
      ...prev,
      score: prev.score + gain,
      attempts: prev.attempts + 1,
      correctPrompts: prev.correctPrompts + (isCorrect ? 1 : 0),
      typedChars: prev.typedChars + typed.length,
      correctChars: prev.correctChars + matches,
      mistakeChars: prev.mistakeChars + mistakes
    }));

    if (isCorrect && challengeMeta.isBossRound) {
      setFeedback("Boss smashed! Amazing typing!");
    } else if (isBeginnerCurriculum && isCorrect && nextTraining.step > currentBeginnerStep) {
      const pair = BEGINNER_KEY_STEPS[nextTraining.step];
      setFeedback(`Great! Next keys: ${pair[0].toUpperCase()} + ${pair[1].toUpperCase()}`);
    } else if (isBeginnerCurriculum && isCorrect && nextTraining.step === BEGINNER_KEY_STEPS.length - 1 && nextTraining.correct >= BEGINNER_STEP_TARGET) {
      setFeedback("Excellent! Beginner keyboard practice is complete.");
    } else if (isCorrect && comboBonus > 0) {
      setFeedback(`${randomItem(ENCOURAGEMENTS)} ${newCombo}x Combo!`);
    } else if (isCorrect && rhythmBonus > 0) {
      setFeedback("Perfect rhythm! Bonus points!");
    } else if (!isCorrect && game.promptStyle === "escape") {
      setFeedback("Run faster! Keep typing!");
    } else {
      setFeedback(isCorrect ? randomItem(ENCOURAGEMENTS) : "Keep going!");
    }
    
    setEntry("");
    applyNextChallenge(nextCorrectPrompts, nextMistakeChars, nextTraining);
  }

  function finishSession() {
    if (status === "finished") return;

    playCompleteSound();
    
    const finalMetrics = metricsRef.current;
    const duration = settings.gameTime;
    const accuracy = round(calculateAccuracy(finalMetrics.correctChars, finalMetrics.typedChars));
    const speed = round(calculateWpm(finalMetrics.correctChars, duration));
    const maxCombo = getMaxCombo();
    
    const summary = {
      score: finalMetrics.score,
      accuracy,
      speed,
      attempts: finalMetrics.attempts,
      cleared: finalMetrics.correctPrompts,
      combo: maxCombo,
      difficulty,
      gameId: game.id
    };

    // Update achievements
    const newAchievements = updateAchievementStats(summary);
    if (newAchievements.length > 0) {
      setNewAchievements(newAchievements);
      setJustUnlockedAchievement(true);
      setTimeout(() => setJustUnlockedAchievement(false), 5000);
    }

    setFinalStats(summary);
    setStatus("finished");
    setFeedback(randomItem(ENCOURAGEMENTS));
    setShowConfetti(accuracy >= 90 && !reducedMotion.current);
    clearAutoSave();
    onGameComplete(game.id, summary);
  }

  function addVirtualCharacter(character) {
    playTypeSound();
    setEntry((previous) => `${previous}${character}`);
    setLastPressedChar(character);
    inputRef.current?.focus();
    
    // Clear pressed animation after short delay
    setTimeout(() => setLastPressedChar(null), 150);
  }

  function removeVirtualCharacter() {
    setEntry((previous) => previous.slice(0, -1));
    inputRef.current?.focus();
  }

  function applyNextChallenge(cleared, mistakeChars, trainingOverride = beginnerTraining) {
    if (isBeginnerCurriculum) {
      const training = sanitizeBeginnerTraining(trainingOverride);
      const stepIndex = Math.min(training.step, BEGINNER_KEY_STEPS.length - 1);
      const pair = BEGINNER_KEY_STEPS[stepIndex] ?? ["f", "j"];
      const target = createBeginnerPrompt(pair, 5);

      setTargetPrompt(target);
      setDisplayPrompt(target);
      setPromptHint(
        `Beginner keyboard training: practice ${pair[0].toUpperCase()} + ${pair[1].toUpperCase()} (${Math.min(training.correct, BEGINNER_STEP_TARGET)}/${BEGINNER_STEP_TARGET})`
      );
      setChallengeMeta({});
      setIsPromptHidden(false);
      promptIssuedAtRef.current = Date.now();
      return;
    }

    const challenge = buildGameChallenge(game, difficulty, { cleared, mistakeChars });
    setTargetPrompt(challenge.target);
    setDisplayPrompt(challenge.display);
    setPromptHint(challenge.hint);
    setChallengeMeta(challenge.meta ?? {});
    setIsPromptHidden(false);
    promptIssuedAtRef.current = Date.now();
  }

  function handleTutorialStart() {
    setShowTutorial(false);
    actuallyStartSession();
  }

  return (
    <section className="page">
      {/* Confetti */}
      <Confetti active={showConfetti} duration={5000} />
      
      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          gameId={game.id}
          onClose={() => setShowTutorial(false)}
          onStart={handleTutorialStart}
        />
      )}
      
      {/* Achievement Unlock Notifications */}
      {newAchievements.map((achievement, index) => (
        <div 
          key={achievement.id}
          className="achievement-unlock"
          style={{ top: `${100 + index * 80}px` }}
        >
          <span className="unlock-icon">{achievement.icon}</span>
          <div className="unlock-text">
            <span className="unlock-title">Achievement Unlocked!</span>
            <span className="unlock-name">{achievement.title}</span>
          </div>
        </div>
      ))}

      {/* Combo Display */}
      {status === "running" && (
        <ComboDisplay combo={combo} multiplier={comboMultiplier} />
      )}

      {/* Mascot */}
      <Mascot
        status={status}
        combo={combo}
        accuracy={finalStats?.accuracy || 0}
        justMadeMistake={justMadeMistake}
        justUnlockedAchievement={justUnlockedAchievement}
      />

      <div className="section-head">
        <div>
          <h2>{game.title}</h2>
          <p>{game.subtitle}</p>
        </div>
        <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
      </div>

      <div className="game-arena">
        <div className="score-strip">
          <div>
            <span className="label">Time</span>
            <strong>{timeLeft}s</strong>
          </div>
          <div>
            <span className="label">Score</span>
            <strong>{metrics.score}</strong>
          </div>
          <div>
            <span className="label">Accuracy</span>
            <strong>{liveAccuracy}%</strong>
          </div>
          <div>
            <span className="label">Speed</span>
            <strong>{liveSpeed} WPM</strong>
          </div>
          {combo > 1 && (
            <div className="new-record">
              <span className="label">Combo</span>
              <strong>×{combo}</strong>
            </div>
          )}
        </div>

        <div className="prompt-card">
          <p className="target-text">{visiblePrompt}</p>
          {promptHint ? <p className="prompt-hint">Hint: {promptHint}</p> : null}
          {modeLabel ? <p className="mode-note">{modeLabel}</p> : null}
          {isBeginnerCurriculum ? (
            <div className="beginner-curriculum-card">
              <div className="beginner-progress-head">
                <strong>Beginner Keyboard Curriculum</strong>
                <span>{overallBeginnerProgress}% Complete</span>
              </div>
              <div className="beginner-progress-track">
                <div className="beginner-progress-fill" style={{ width: `${overallBeginnerProgress}%` }} />
              </div>
              <div className="beginner-step-progress-row">
                <span>Current Step Progress</span>
                <span>
                  {Math.min(beginnerTraining.correct, BEGINNER_STEP_TARGET)}/{BEGINNER_STEP_TARGET}
                </span>
              </div>
              <div className="beginner-step-track">
                <div className="beginner-step-fill" style={{ width: `${currentStepProgress}%` }} />
              </div>
              <div className="beginner-checklist">
                {beginnerChecklist.map((step) => (
                  <div key={step.index} className={`beginner-step-item ${step.status}`}>
                    <span className="beginner-step-state">
                      {step.status === "done" ? "Done" : step.status === "current" ? "Now" : "Next"}
                    </span>
                    <span className="beginner-step-text">
                      Step {step.index + 1}: {step.pair[0].toUpperCase()} + {step.pair[1].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <input
            ref={inputRef}
            type="text"
            value={entry}
            placeholder="Type here..."
            onChange={(event) => {
              setEntry(event.target.value);
              if (event.target.value.length > entry.length) {
                playTypeSound();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitEntry();
              }
            }}
            disabled={status !== "running"}
          />
          <VirtualKeyboard
            disabled={status !== "running"}
            onInput={addVirtualCharacter}
            onBackspace={removeVirtualCharacter}
            onSpace={() => addVirtualCharacter(" ")}
            onEnter={submitEntry}
            nextHintChar={entry.length >= targetPrompt.length ? "\n" : targetPrompt[entry.length]}
            theme={game.promptStyle}
            layout="full"
          />
          
          {/* Virtual Hands Overlay */}
          {status === "running" && handsEnabled.current && (
            <TypingHandsOverlay
              nextChar={targetPrompt[entry.length]}
              justPressedChar={lastPressedChar}
            />
          )}
          <div className="arena-actions">
            <button className="secondary-btn" type="button" onClick={submitEntry} disabled={status !== "running"}>
              Submit
            </button>
            {status !== "running" ? (
              <button className="primary-btn" type="button" onClick={startSession}>
                {status === "finished" ? "Replay" : "Start Game"}
              </button>
            ) : (
              <button className="secondary-btn" type="button" onClick={finishSession}>
                End Round
              </button>
            )}
          </div>
          <p className="feedback">{feedback}</p>
          <p className="progress-note">{progressLabel}</p>
          {status === "idle" && (
            <p className="keyboard-shortcuts-hint">
              💡 Press <kbd>Space</kbd> to start, <kbd>Esc</kbd> to end
            </p>
          )}
        </div>

        {finalStats ? (
          <div className={`summary-card ${finalStats.accuracy >= 90 ? 'new-record' : ''}`}>
            <h3>Round Result</h3>
            <p>Score: {finalStats.score}</p>
            <p>Accuracy: {finalStats.accuracy}%</p>
            <p>Speed: {finalStats.speed} WPM</p>
            <p>Targets Cleared: {finalStats.cleared}</p>
            {finalStats.combo > 5 && <p>Max Combo: ×{finalStats.combo}</p>}
          </div>
        ) : null}
      </div>

      <button className="text-btn" type="button" onClick={onBackToLibrary}>
        Back to Games Library
      </button>
    </section>
  );
}

function normalizeTypedValue(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function createBeginnerPrompt(pair, size) {
  const [first, second] = pair;
  const chars = [first, second];

  while (chars.length < size) {
    chars.push(Math.random() > 0.5 ? first : second);
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[swapIndex]] = [chars[swapIndex], chars[i]];
  }

  return chars.join("");
}

function sanitizeBeginnerTraining(training) {
  const step = Number.isFinite(training?.step) ? Math.max(0, Math.floor(training.step)) : 0;
  const correct = Number.isFinite(training?.correct) ? Math.max(0, Math.floor(training.correct)) : 0;
  return { step, correct };
}
