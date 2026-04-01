// Web Audio API-based sound effects - no external files needed!
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

let soundEnabled = true;
let volume = 0.3;

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  localStorage.setItem('typingGame_soundEnabled', enabled ? '1' : '0');
}

export function getSoundEnabled() {
  return localStorage.getItem('typingGame_soundEnabled') !== '0';
}

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  localStorage.setItem('typingGame_volume', String(volume));
}

export function getVolume() {
  const saved = localStorage.getItem('typingGame_volume');
  return saved ? parseFloat(saved) : 0.3;
}

// Initialize from storage
if (typeof window !== 'undefined') {
  soundEnabled = getSoundEnabled();
  volume = getVolume();
}

function playTone(frequency, duration, type = 'sine') {
  if (!soundEnabled || !audioCtx) return;
  
  try {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume * 0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Silent fail if audio not supported
  }
}

export function playTypeSound() {
  // Soft click sound
  playTone(800, 0.05, 'triangle');
}

export function playSuccessSound() {
  // Happy ascending chime
  if (!soundEnabled || !audioCtx) return;
  setTimeout(() => playTone(523.25, 0.1), 0);     // C5
  setTimeout(() => playTone(659.25, 0.1), 50);    // E5
  setTimeout(() => playTone(783.99, 0.15), 100);  // G5
}

export function playErrorSound() {
  // Low buzz
  playTone(150, 0.2, 'sawtooth');
}

export function playComboSound(combo) {
  // Higher pitch for higher combos
  const baseFreq = 440 + (combo * 50);
  playTone(baseFreq, 0.1, 'sine');
}

export function playBadgeUnlockSound() {
  // Victory fanfare
  if (!soundEnabled || !audioCtx) return;
  [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15), i * 100);
  });
}

export function playStartSound() {
  // Game start whoosh
  playTone(220, 0.3, 'sine');
  setTimeout(() => playTone(440, 0.3, 'sine'), 100);
}

export function playCompleteSound() {
  // Level complete melody
  if (!soundEnabled || !audioCtx) return;
  [392.00, 493.88, 587.33, 783.99, 783.99].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2), i * 120);
  });
}

export function resumeAudioContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
