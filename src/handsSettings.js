// Settings for typing hands feature
const HANDS_ENABLED_KEY = 'typingGame_handsEnabled';

export function getHandsEnabled() {
  const stored = localStorage.getItem(HANDS_ENABLED_KEY);
  // Default to true (enabled)
  return stored !== 'false';
}

export function setHandsEnabled(enabled) {
  localStorage.setItem(HANDS_ENABLED_KEY, enabled ? 'true' : 'false');
}

export function toggleHandsEnabled() {
  const current = getHandsEnabled();
  setHandsEnabled(!current);
  return !current;
}
