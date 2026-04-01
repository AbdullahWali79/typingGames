import { useEffect, useMemo, useRef, useState } from "react";
import DifficultySelector from "./DifficultySelector";
import VirtualKeyboard from "./VirtualKeyboard";
import { DIFFICULTY_LEVELS, ENCOURAGEMENTS } from "../data";
import {
  buildGameChallenge,
  calculateAccuracy,
  calculateWpm,
  countMatchingCharacters,
  randomItem,
  round
} from "../utils";

const INITIAL_METRICS = {
  score: 0,
  attempts: 0,
  correctPrompts: 0,
  typedChars: 0,
  correctChars: 0,
  mistakeChars: 0
};

function createInitialMetrics() {
  return {
    ...INITIAL_METRICS
  };
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
  const inputRef = useRef(null);
  const metricsRef = useRef(metrics);
  const promptIssuedAtRef = useRef(Date.now());

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    resetSession();
  }, [game.id, difficulty]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft === 0) {
      finishSession();
    }
  }, [status, timeLeft]);

  useEffect(() => {
    setIsPromptHidden(false);
    if (status !== "running" || !challengeMeta.hideAfterMs) {
      return;
    }

    const hideTimer = setTimeout(() => {
      setIsPromptHidden(true);
    }, challengeMeta.hideAfterMs);

    return () => clearTimeout(hideTimer);
  }, [challengeMeta, displayPrompt, status]);

  const elapsedSeconds = settings.gameTime - timeLeft;
  const liveAccuracy = round(calculateAccuracy(metrics.correctChars, metrics.typedChars));
  const liveSpeed = round(calculateWpm(metrics.correctChars, Math.max(elapsedSeconds, 1)));

  const progressLabel = useMemo(() => {
    if (status === "finished") {
      return "Session complete";
    }
    if (status === "running") {
      return `${metrics.correctPrompts} targets cleared`;
    }
    return "Ready to start";
  }, [metrics.correctPrompts, status]);

  const modeLabel = useMemo(() => {
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
  }, [challengeMeta.chapter, challengeMeta.isBossRound, game.promptStyle, metrics.correctPrompts, metrics.mistakeChars]);

  const visiblePrompt = isPromptHidden
    ? challengeMeta.hiddenDisplay || "????"
    : displayPrompt;

  function resetSession() {
    setStatus("idle");
    setTimeLeft(settings.gameTime);
    applyNextChallenge(0, 0);
    setEntry("");
    setFeedback("Type what you see and press Enter.");
    setMetrics(createInitialMetrics());
    setFinalStats(null);
  }

  function startSession() {
    setStatus("running");
    setTimeLeft(settings.gameTime);
    applyNextChallenge(0, 0);
    setEntry("");
    setFeedback("You can do this!");
    setMetrics(createInitialMetrics());
    setFinalStats(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function submitEntry() {
    if (status !== "running") {
      return;
    }

    const typed = entry.trim();
    if (!typed) {
      return;
    }

    const currentMetrics = metricsRef.current;
    const target = targetPrompt.trim();
    const matches = countMatchingCharacters(target, typed);
    const mistakes = Math.max(Math.max(typed.length, target.length) - matches, 0);
    const isCorrect = normalizeTypedValue(typed) === normalizeTypedValue(target);
    const baseGain = isCorrect
      ? Math.round((target.length + 4) * settings.scoreMultiplier)
      : Math.round(matches * settings.scoreMultiplier * 0.4);
    const responseTime = Date.now() - promptIssuedAtRef.current;
    const rhythmBonus =
      isCorrect && challengeMeta.rhythmWindowMs && responseTime <= challengeMeta.rhythmWindowMs
        ? Math.round(5 * settings.scoreMultiplier)
        : 0;
    const bossBonus =
      isCorrect && challengeMeta.isBossRound ? Math.round(12 * settings.scoreMultiplier) : 0;
    const memoryBonus =
      isCorrect && game.promptStyle === "memory" ? Math.round(3 * settings.scoreMultiplier) : 0;
    const gain = baseGain + rhythmBonus + bossBonus + memoryBonus;
    const nextCorrectPrompts = currentMetrics.correctPrompts + (isCorrect ? 1 : 0);
    const nextMistakeChars = currentMetrics.mistakeChars + mistakes;

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
    } else if (isCorrect && rhythmBonus > 0) {
      setFeedback("Perfect rhythm! Bonus points!");
    } else if (!isCorrect && game.promptStyle === "escape") {
      setFeedback("Run faster! Keep typing!");
    } else {
      setFeedback(isCorrect ? randomItem(ENCOURAGEMENTS) : "Keep going!");
    }
    setEntry("");
    applyNextChallenge(nextCorrectPrompts, nextMistakeChars);
  }

  function finishSession() {
    if (status === "finished") {
      return;
    }

    const finalMetrics = metricsRef.current;
    const duration = settings.gameTime;
    const accuracy = round(calculateAccuracy(finalMetrics.correctChars, finalMetrics.typedChars));
    const speed = round(calculateWpm(finalMetrics.correctChars, duration));
    const summary = {
      score: finalMetrics.score,
      accuracy,
      speed,
      attempts: finalMetrics.attempts,
      cleared: finalMetrics.correctPrompts
    };

    setFinalStats(summary);
    setStatus("finished");
    setFeedback(randomItem(ENCOURAGEMENTS));
    onGameComplete(game.id, summary);
  }

  function addVirtualCharacter(character) {
    setEntry((previous) => `${previous}${character}`);
    inputRef.current?.focus();
  }

  function removeVirtualCharacter() {
    setEntry((previous) => previous.slice(0, -1));
    inputRef.current?.focus();
  }

  function applyNextChallenge(cleared, mistakeChars) {
    const challenge = buildGameChallenge(game, difficulty, {
      cleared,
      mistakeChars
    });
    setTargetPrompt(challenge.target);
    setDisplayPrompt(challenge.display);
    setPromptHint(challenge.hint);
    setChallengeMeta(challenge.meta ?? {});
    setIsPromptHidden(false);
    promptIssuedAtRef.current = Date.now();
  }

  return (
    <section className="page">
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
        </div>

        <div className="prompt-card">
          <p className="target-text">{visiblePrompt}</p>
          {promptHint ? <p className="prompt-hint">Hint: {promptHint}</p> : null}
          {modeLabel ? <p className="mode-note">{modeLabel}</p> : null}
          <input
            ref={inputRef}
            type="text"
            value={entry}
            placeholder="Type here..."
            onChange={(event) => setEntry(event.target.value)}
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
            nextHintChar={targetPrompt[entry.length]}
            theme={game.promptStyle}
            layout="full"
          />
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
        </div>

        {finalStats ? (
          <div className="summary-card">
            <h3>Round Result</h3>
            <p>Score: {finalStats.score}</p>
            <p>Accuracy: {finalStats.accuracy}%</p>
            <p>Speed: {finalStats.speed} WPM</p>
            <p>Targets Cleared: {finalStats.cleared}</p>
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
