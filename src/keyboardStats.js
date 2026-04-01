// Keyboard typing statistics and heatmap - no external assets!

const KEYBOARD_STATS_KEY = 'typingGame_keyboardStats';

// Standard QWERTY layout for reference
const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export function getDefaultKeyboardStats() {
  const stats = {};
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
    stats[char] = { correct: 0, incorrect: 0, total: 0 };
  });
  return {
    keys: stats,
    lastUpdated: Date.now()
  };
}

export function getKeyboardStats() {
  try {
    const data = localStorage.getItem(KEYBOARD_STATS_KEY);
    if (!data) return getDefaultKeyboardStats();
    const parsed = JSON.parse(data);
    // Ensure all keys exist
    const defaults = getDefaultKeyboardStats();
    return {
      ...defaults,
      ...parsed,
      keys: { ...defaults.keys, ...parsed.keys }
    };
  } catch {
    return getDefaultKeyboardStats();
  }
}

export function saveKeyboardStats(stats) {
  localStorage.setItem(KEYBOARD_STATS_KEY, JSON.stringify(stats));
}

export function recordKeyPress(char, isCorrect) {
  const stats = getKeyboardStats();
  const key = char.toLowerCase();
  
  if (!stats.keys[key]) {
    stats.keys[key] = { correct: 0, incorrect: 0, total: 0 };
  }
  
  stats.keys[key].total++;
  if (isCorrect) {
    stats.keys[key].correct++;
  } else {
    stats.keys[key].incorrect++;
  }
  
  stats.lastUpdated = Date.now();
  saveKeyboardStats(stats);
}

export function recordTypingSession(targetText, typedText) {
  const target = targetText.toLowerCase();
  const typed = typedText.toLowerCase();
  
  for (let i = 0; i < Math.max(target.length, typed.length); i++) {
    const targetChar = target[i] || '';
    const typedChar = typed[i] || '';
    
    if (typedChar && /[a-z]/.test(typedChar)) {
      const isCorrect = targetChar === typedChar;
      recordKeyPress(typedChar, isCorrect);
    }
  }
}

export function getKeyAccuracy(char) {
  const stats = getKeyboardStats();
  const key = char.toLowerCase();
  const keyStats = stats.keys[key];
  
  if (!keyStats || keyStats.total === 0) return null;
  return Math.round((keyStats.correct / keyStats.total) * 100);
}

export function getHeatmapData() {
  const stats = getKeyboardStats();
  const heatmap = {};
  
  Object.keys(stats.keys).forEach(char => {
    const keyStats = stats.keys[char];
    if (keyStats.total > 0) {
      heatmap[char] = {
        accuracy: Math.round((keyStats.correct / keyStats.total) * 100),
        total: keyStats.total,
        incorrect: keyStats.incorrect
      };
    }
  });
  
  return heatmap;
}

export function getWeakestKeys(limit = 5) {
  const heatmap = getHeatmapData();
  return Object.entries(heatmap)
    .filter(([_, data]) => data.total >= 3) // Minimum sample size
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, limit)
    .map(([char, data]) => ({ char, ...data }));
}

export function getStrongestKeys(limit = 5) {
  const heatmap = getHeatmapData();
  return Object.entries(heatmap)
    .filter(([_, data]) => data.total >= 3)
    .sort((a, b) => b[1].accuracy - a[1].accuracy)
    .slice(0, limit)
    .map(([char, data]) => ({ char, ...data }));
}

export function getMostPracticedKeys(limit = 5) {
  const heatmap = getHeatmapData();
  return Object.entries(heatmap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, limit)
    .map(([char, data]) => ({ char, ...data }));
}

export function resetKeyboardStats() {
  localStorage.removeItem(KEYBOARD_STATS_KEY);
}

// Get color for heatmap based on accuracy
export function getHeatmapColor(accuracy) {
  if (accuracy === null || accuracy === undefined) return '#e5eff8'; // Default
  if (accuracy >= 95) return '#17c79d'; // Green - excellent
  if (accuracy >= 80) return '#4bc0ff'; // Blue - good
  if (accuracy >= 60) return '#ffd84d'; // Yellow - okay
  return '#ff5f8d'; // Red - needs practice
}

export function getHeatmapOpacity(accuracy, totalPresses) {
  if (accuracy === null || accuracy === undefined) return 0.3;
  // More presses = more opaque
  const intensity = Math.min(totalPresses / 20, 1);
  return 0.3 + (intensity * 0.7);
}
