// Achievement system using emoji icons - no external assets!

export const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    icon: '👶',
    title: 'First Steps',
    description: 'Complete your first game',
    condition: (stats) => stats.gamesCompleted >= 1
  },
  {
    id: 'speed_demon',
    icon: '⚡',
    title: 'Speed Demon',
    description: 'Reach 40+ WPM',
    condition: (stats) => stats.maxWpm >= 40
  },
  {
    id: 'lightning_fast',
    icon: '🔥',
    title: 'Lightning Fast',
    description: 'Reach 60+ WPM',
    condition: (stats) => stats.maxWpm >= 60
  },
  {
    id: 'perfect_round',
    icon: '💎',
    title: 'Perfect Round',
    description: 'Complete a game with 100% accuracy',
    condition: (stats) => stats.hasPerfectRound
  },
  {
    id: 'accuracy_master',
    icon: '🎯',
    title: 'Accuracy Master',
    description: 'Maintain 95%+ accuracy across 5 games',
    condition: (stats) => stats.highAccuracyStreak >= 5
  },
  {
    id: 'combo_king',
    icon: '👑',
    title: 'Combo King',
    description: 'Achieve a 10x combo',
    condition: (stats) => stats.maxCombo >= 10
  },
  {
    id: 'marathon_runner',
    icon: '🏃',
    title: 'Marathon Runner',
    description: 'Play 10 games in one day',
    condition: (stats) => stats.dailyGames >= 10
  },
  {
    id: 'game_explorer',
    icon: '🗺️',
    title: 'Game Explorer',
    description: 'Try 5 different games',
    condition: (stats) => stats.uniqueGamesPlayed >= 5
  },
  {
    id: 'diverse_player',
    icon: '🎮',
    title: 'Diverse Player',
    description: 'Try 10 different games',
    condition: (stats) => stats.uniqueGamesPlayed >= 10
  },
  {
    id: 'streak_3',
    icon: '🔥',
    title: '3-Day Streak',
    description: 'Play for 3 days in a row',
    condition: (stats) => stats.streak >= 3
  },
  {
    id: 'streak_7',
    icon: '🌟',
    title: 'Weekly Warrior',
    description: 'Play for 7 days in a row',
    condition: (stats) => stats.streak >= 7
  },
  {
    id: 'streak_30',
    icon: '🏆',
    title: 'Monthly Master',
    description: 'Play for 30 days in a row',
    condition: (stats) => stats.streak >= 30
  },
  {
    id: 'test_taker',
    icon: '📝',
    title: 'Test Taker',
    description: 'Complete your first typing test',
    condition: (stats) => stats.testsCompleted >= 1
  },
  {
    id: 'test_champion',
    icon: '🥇',
    title: 'Test Champion',
    description: 'Complete 10 typing tests',
    condition: (stats) => stats.testsCompleted >= 10
  },
  {
    id: 'beginner_badge',
    icon: '🌱',
    title: 'Beginner Graduate',
    description: 'Win 5 games on Beginner difficulty',
    condition: (stats) => (stats.beginnerWins || 0) >= 5
  },
  {
    id: 'intermediate_badge',
    icon: '🌿',
    title: 'Intermediate Graduate',
    description: 'Win 5 games on Intermediate difficulty',
    condition: (stats) => (stats.intermediateWins || 0) >= 5
  },
  {
    id: 'advanced_badge',
    icon: '🌳',
    title: 'Advanced Graduate',
    description: 'Win 5 games on Advanced difficulty',
    condition: (stats) => (stats.advancedWins || 0) >= 5
  },
  {
    id: 'score_hunter',
    icon: '💰',
    title: 'Score Hunter',
    description: 'Score 1000+ points in a single game',
    condition: (stats) => stats.maxScore >= 1000
  },
  {
    id: 'speed_improver',
    icon: '📈',
    title: 'Speed Improver',
    description: 'Improve your WPM by 10 from your first game',
    condition: (stats) => stats.wpmImprovement >= 10
  }
];

const STORAGE_KEY = 'typingGame_achievements';
const STATS_KEY = 'typingGame_achievementStats';

export function getUnlockedAchievements() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(achievements) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
}

export function getAchievementStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : getDefaultStats();
  } catch {
    return getDefaultStats();
  }
}

export function saveAchievementStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getDefaultStats() {
  return {
    gamesCompleted: 0,
    maxWpm: 0,
    hasPerfectRound: false,
    highAccuracyStreak: 0,
    maxCombo: 0,
    dailyGames: 0,
    uniqueGamesPlayed: 0,
    streak: 0,
    testsCompleted: 0,
    beginnerWins: 0,
    intermediateWins: 0,
    advancedWins: 0,
    maxScore: 0,
    wpmImprovement: 0,
    firstWpm: 0,
    gamesPlayedToday: 0,
    lastPlayDate: null,
    gamesHistory: [],
    recentAccuracies: []
  };
}

export function updateAchievementStats(gameResult) {
  const stats = getAchievementStats();
  const today = new Date().toDateString();
  
  // Update basic stats
  stats.gamesCompleted++;
  stats.maxWpm = Math.max(stats.maxWpm, gameResult.speed || 0);
  stats.maxScore = Math.max(stats.maxScore, gameResult.score || 0);
  stats.maxCombo = Math.max(stats.maxCombo, gameResult.combo || 0);
  
  // Track perfect rounds
  if (gameResult.accuracy === 100) {
    stats.hasPerfectRound = true;
  }
  
  // Track accuracy streak
  stats.recentAccuracies = stats.recentAccuracies || [];
  stats.recentAccuracies.push(gameResult.accuracy || 0);
  if (stats.recentAccuracies.length > 10) {
    stats.recentAccuracies.shift();
  }
  
  // Count high accuracy streak
  let highAccStreak = 0;
  for (let i = stats.recentAccuracies.length - 1; i >= 0; i--) {
    if (stats.recentAccuracies[i] >= 95) {
      highAccStreak++;
    } else {
      break;
    }
  }
  stats.highAccuracyStreak = Math.max(stats.highAccuracyStreak, highAccStreak);
  
  // Track unique games
  const playedGames = new Set(stats.gamesHistory || []);
  playedGames.add(gameResult.gameId);
  stats.uniqueGamesPlayed = playedGames.size;
  stats.gamesHistory = Array.from(playedGames);
  
  // Daily games counter
  if (stats.lastPlayDate === today) {
    stats.dailyGames = (stats.dailyGames || 0) + 1;
  } else {
    stats.dailyGames = 1;
  }
  stats.lastPlayDate = today;
  
  // Difficulty wins
  const diff = gameResult.difficulty?.toLowerCase();
  if (diff === 'beginner') stats.beginnerWins = (stats.beginnerWins || 0) + 1;
  if (diff === 'intermediate') stats.intermediateWins = (stats.intermediateWins || 0) + 1;
  if (diff === 'advanced') stats.advancedWins = (stats.advancedWins || 0) + 1;
  
  // WPM improvement
  if (stats.firstWpm === 0) {
    stats.firstWpm = gameResult.speed || 0;
  }
  stats.wpmImprovement = Math.max(0, (gameResult.speed || 0) - stats.firstWpm);
  
  saveAchievementStats(stats);
  
  // Check for new achievements
  return checkForNewAchievements(stats);
}

export function updateStreak() {
  const stats = getAchievementStats();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const lastActive = localStorage.getItem('typingGame_lastActiveDate');
  
  if (lastActive === today) {
    // Already counted today
  } else if (lastActive === yesterday) {
    // Continue streak
    stats.streak = (stats.streak || 0) + 1;
  } else {
    // Reset streak
    stats.streak = 1;
  }
  
  localStorage.setItem('typingGame_lastActiveDate', today);
  saveAchievementStats(stats);
  
  return checkForNewAchievements(stats);
}

export function checkForNewAchievements(stats) {
  const unlocked = getUnlockedAchievements();
  const newAchievements = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
      unlocked.push(achievement.id);
      newAchievements.push(achievement);
    }
  }
  
  if (newAchievements.length > 0) {
    saveUnlockedAchievements(unlocked);
  }
  
  return newAchievements;
}

export function getAllAchievements() {
  const unlocked = getUnlockedAchievements();
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: unlocked.includes(a.id)
  }));
}

export function resetAchievements() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
}
