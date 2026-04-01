// WPM History tracking for progress graphs - no external assets!

const WPM_HISTORY_KEY = 'typingGame_wpmHistory';
const MAX_ENTRIES = 50; // Keep last 50 sessions

export function getWpmHistory() {
  try {
    const data = localStorage.getItem(WPM_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWpmHistory(history) {
  localStorage.setItem(WPM_HISTORY_KEY, JSON.stringify(history.slice(-MAX_ENTRIES)));
}

export function addWpmEntry(wpm, accuracy, gameType = 'test') {
  const history = getWpmHistory();
  
  const entry = {
    date: new Date().toISOString(),
    wpm: Math.round(wpm),
    accuracy: Math.round(accuracy),
    gameType,
    id: Date.now()
  };
  
  history.push(entry);
  saveWpmHistory(history);
  return entry;
}

export function getWpmStats() {
  const history = getWpmHistory();
  
  if (history.length === 0) {
    return {
      average: 0,
      best: 0,
      worst: 0,
      trend: 0,
      totalSessions: 0,
      improvement: 0
    };
  }
  
  const wpms = history.map(h => h.wpm);
  const average = Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length);
  const best = Math.max(...wpms);
  const worst = Math.min(...wpms);
  
  // Calculate trend (comparing last 3 to previous 3)
  const recent = wpms.slice(-3);
  const previous = wpms.slice(-6, -3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg = previous.length > 0 
    ? previous.reduce((a, b) => a + b, 0) / previous.length 
    : recentAvg;
  const trend = Math.round(recentAvg - previousAvg);
  
  // Calculate improvement from first to last
  const first = wpms[0];
  const last = wpms[wpms.length - 1];
  const improvement = last - first;
  
  return {
    average,
    best,
    worst,
    trend,
    totalSessions: history.length,
    improvement
  };
}

export function getProgressData(days = 30) {
  const history = getWpmHistory();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  // Group by date, keeping only the best WPM per day
  const dailyBest = {};
  
  history.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate >= cutoff) {
      const dateKey = entryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!dailyBest[dateKey] || dailyBest[dateKey].wpm < entry.wpm) {
        dailyBest[dateKey] = entry;
      }
    }
  });
  
  return Object.entries(dailyBest)
    .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
    .map(([date, data]) => ({
      date,
      wpm: data.wpm,
      accuracy: data.accuracy
    }));
}

export function getPersonalBest() {
  const history = getWpmHistory();
  if (history.length === 0) return null;
  
  return history.reduce((best, current) => 
    current.wpm > best.wpm ? current : best
  );
}

export function compareToPersonalBest(wpm, accuracy) {
  const best = getPersonalBest();
  if (!best) return { isNewBest: true, wpmDiff: 0, accDiff: 0 };
  
  return {
    isNewBest: wpm > best.wpm,
    wpmDiff: Math.round(wpm - best.wpm),
    accDiff: Math.round(accuracy - best.accuracy),
    previousBest: best
  };
}

export function resetWpmHistory() {
  localStorage.removeItem(WPM_HISTORY_KEY);
}

// Export data as JSON/CSV
export function exportProgressData(format = 'json') {
  const history = getWpmHistory();
  
  if (format === 'csv') {
    const headers = 'Date,WPM,Accuracy,Game Type\n';
    const rows = history.map(h => 
      `${new Date(h.date).toLocaleString()},${h.wpm},${h.accuracy},${h.gameType}`
    ).join('\n');
    return headers + rows;
  }
  
  return JSON.stringify(history, null, 2);
}

export function downloadProgressReport() {
  const stats = getWpmStats();
  const history = getWpmHistory();
  
  const report = {
    generatedAt: new Date().toISOString(),
    summary: stats,
    sessions: history,
    totalTimeTyped: history.length * 1, // Estimate 1 min per session
    achievements: JSON.parse(localStorage.getItem('typingGame_achievements') || '[]')
  };
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `typing-progress-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
