const STORAGE_KEY = "typingGames.kids.v1";

const defaultState = {
  bestWpm: 0,
  bestAccuracy: 0,
  recentResult: null,
  selectedDifficulty: "Beginner",
  lastPlayedGame: "",
  favoriteGame: "",
  totalGamesPlayed: 0,
  gameStats: {}
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
