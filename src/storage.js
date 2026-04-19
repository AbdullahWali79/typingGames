const STORAGE_KEY = "typingGames.kids.v1";
const AUTOSAVE_KEY = "typingGames.kids.autosave";

const defaultState = {
  bestWpm: 0,
  bestAccuracy: 0,
  recentResult: null,
  selectedDifficulty: "Beginner",
  lastPlayedGame: "",
  favoriteGame: "",
  totalGamesPlayed: 0,
  gameStats: {},
  combo: 0,
  maxCombo: 0,
  reducedMotion: false,
  soundEnabled: true,
  beginnerKeyStep: 0,
  beginnerStepCorrect: 0
};

export function getProgressSnapshot() {
  return readState();
}

export function saveSelectedDifficulty(level) {
  const state = readState();
  state.selectedDifficulty = level;
  writeState(state);
}

export function saveGameSession(gameId, session) {
  const state = readState();
  const current = state.gameStats[gameId] ?? {
    bestScore: 0,
    bestAccuracy: 0,
    bestSpeed: 0,
    plays: 0
  };

  const updated = {
    ...current,
    bestScore: Math.max(current.bestScore, session.score),
    bestAccuracy: Math.max(current.bestAccuracy, session.accuracy),
    bestSpeed: Math.max(current.bestSpeed, session.speed),
    plays: current.plays + 1
  };

  state.gameStats[gameId] = updated;
  state.lastPlayedGame = gameId;
  state.totalGamesPlayed += 1;
  state.favoriteGame = getFavoriteGameId(state.gameStats, state.favoriteGame);
  writeState(state);
}

export function saveTypingTestResult(result) {
  const state = readState();
  state.recentResult = result;
  state.bestWpm = Math.max(state.bestWpm, result.wpm);
  state.bestAccuracy = Math.max(state.bestAccuracy, result.accuracy);
  writeState(state);
}

// Combo system
export function incrementCombo() {
  const state = readState();
  state.combo = (state.combo || 0) + 1;
  state.maxCombo = Math.max(state.maxCombo || 0, state.combo);
  writeState(state);
  return state.combo;
}

export function resetCombo() {
  const state = readState();
  state.combo = 0;
  writeState(state);
  return 0;
}

export function getCombo() {
  const state = readState();
  return state.combo || 0;
}

export function getMaxCombo() {
  const state = readState();
  return state.maxCombo || 0;
}

// Accessibility preferences
export function setReducedMotion(enabled) {
  const state = readState();
  state.reducedMotion = enabled;
  writeState(state);
}

export function getReducedMotion() {
  const state = readState();
  return state.reducedMotion || false;
}

export function setSoundEnabled(enabled) {
  const state = readState();
  state.soundEnabled = enabled;
  writeState(state);
}

export function getSoundEnabled() {
  const state = readState();
  return state.soundEnabled !== false;
}

export function getBeginnerTraining() {
  const state = readState();
  return {
    step: Number.isFinite(state.beginnerKeyStep) ? state.beginnerKeyStep : 0,
    correct: Number.isFinite(state.beginnerStepCorrect) ? state.beginnerStepCorrect : 0
  };
}

export function saveBeginnerTraining(step, correct) {
  const state = readState();
  state.beginnerKeyStep = Math.max(0, Math.floor(step));
  state.beginnerStepCorrect = Math.max(0, Math.floor(correct));
  writeState(state);
}

// Auto-save game progress
export function autoSaveProgress(gameId, progress) {
  const data = {
    gameId,
    progress,
    timestamp: Date.now()
  };
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
}

export function getAutoSavedProgress() {
  try {
    const data = localStorage.getItem(AUTOSAVE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    // Auto-save expires after 24 hours
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      clearAutoSave();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearAutoSave() {
  localStorage.removeItem(AUTOSAVE_KEY);
}

function getFavoriteGameId(gameStats, fallback) {
  const entries = Object.entries(gameStats);
  if (!entries.length) {
    return fallback || "";
  }

  let topId = entries[0][0];
  let topPlays = entries[0][1].plays;

  for (const [gameId, stat] of entries) {
    if (stat.plays > topPlays) {
      topId = gameId;
      topPlays = stat.plays;
    }
  }
  return topId;
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return cloneDefaultState();
    }
    const parsed = JSON.parse(raw);
    return {
      ...cloneDefaultState(),
      ...parsed,
      gameStats: {
        ...defaultState.gameStats,
        ...(parsed.gameStats ?? {})
      }
    };
  } catch (error) {
    return cloneDefaultState();
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function cloneDefaultState() {
  return {
    ...defaultState,
    gameStats: {}
  };
}
