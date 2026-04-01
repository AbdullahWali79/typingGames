import { DIFFICULTY_LEVELS } from "./data";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getDifficultySettings(level) {
  return DIFFICULTY_LEVELS[level] ?? DIFFICULTY_LEVELS.Beginner;
}

export function buildGamePrompt(game, difficulty) {
  const settings = getDifficultySettings(difficulty);

  if (game.promptStyle === "letters") {
    let prompt = "";
    for (let i = 0; i < settings.letterCount; i += 1) {
      prompt += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return prompt;
  }

  if (game.promptStyle === "sentence") {
    return randomItem(game.pool);
  }

  if (game.promptStyle === "color") {
    const count = randomBetween(settings.minWords, settings.maxWords);
    const words = [];
    for (let i = 0; i < count; i += 1) {
      words.push(randomItem(game.pool));
    }
    return words.join(" ");
  }

  const count = randomBetween(settings.minWords, settings.maxWords);
  const words = [];
  for (let i = 0; i < count; i += 1) {
    words.push(randomItem(game.pool));
  }
  return words.join(" ");
}

export function buildGameChallenge(game, difficulty) {
  if (game.promptStyle === "anagram") {
    const puzzle = pickAnagramPuzzle(game.pool, difficulty);
    const target = puzzle.word.toLowerCase().trim();
    return {
      target,
      display: shuffleWord(target),
      hint: puzzle.hint || "Unscramble the letters."
    };
  }

  const prompt = buildGamePrompt(game, difficulty);
  return {
    target: prompt,
    display: prompt,
    hint: ""
  };
}

export function getRandomPassage(passages, difficulty) {
  const list = passages[difficulty] ?? passages.Beginner;
  return randomItem(list);
}

export function countMatchingCharacters(expected, actual) {
  const expectedText = expected.toLowerCase();
  const actualText = actual.toLowerCase();
  const minLength = Math.min(expectedText.length, actualText.length);
  let matches = 0;

  for (let i = 0; i < minLength; i += 1) {
    if (expectedText[i] === actualText[i]) {
      matches += 1;
    }
  }

  return matches;
}

export function calculateAccuracy(correctChars, totalTypedChars) {
  if (!totalTypedChars) {
    return 100;
  }
  return (correctChars / totalTypedChars) * 100;
}

export function calculateWpm(correctChars, durationSeconds) {
  if (!durationSeconds) {
    return 0;
  }
  return (correctChars / 5) / (durationSeconds / 60);
}

export function round(value) {
  return Math.round(value * 10) / 10;
}

export function formatResultDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function getTypingLevel(wpm) {
  if (wpm >= 55) {
    return "Typing Star";
  }
  if (wpm >= 40) {
    return "Typing Pro";
  }
  if (wpm >= 25) {
    return "Rising Typist";
  }
  return "Practice Hero";
}

export function getMotivationMessage(wpm, accuracy) {
  if (wpm >= 45 && accuracy >= 95) {
    return "Excellent work!";
  }
  if (wpm >= 30 && accuracy >= 88) {
    return "You are improving!";
  }
  return "Keep practicing!";
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleWord(word) {
  const chars = word.split("");
  if (chars.length < 2) {
    return word;
  }

  let shuffled = word;
  let attempt = 0;
  while (shuffled === word && attempt < 6) {
    const next = [...chars];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    shuffled = next.join("");
    attempt += 1;
  }
  return shuffled;
}

function pickAnagramPuzzle(pool, difficulty) {
  if (!Array.isArray(pool) || !pool.length) {
    return { word: "typing", hint: "Use your keyboard skills." };
  }

  const filtered = pool.filter((item) => {
    const len = item.word?.length ?? 0;
    if (difficulty === "Beginner") {
      return len <= 5;
    }
    if (difficulty === "Intermediate") {
      return len >= 5 && len <= 7;
    }
    return len >= 7;
  });

  return randomItem(filtered.length ? filtered : pool);
}
