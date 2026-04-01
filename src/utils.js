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

export function buildGameChallenge(game, difficulty, context = {}) {
  const cleared = context.cleared ?? 0;

  if (game.promptStyle === "anagram") {
    const puzzle = pickAnagramPuzzle(game.pool, difficulty);
    const target = puzzle.word.toLowerCase().trim();
    return {
      target,
      display: shuffleWord(target),
      hint: puzzle.hint || "Unscramble the letters.",
      meta: {}
    };
  }

  if (game.promptStyle === "spelling") {
    const item = pickSpellingPuzzle(game.pool, difficulty);
    return {
      target: item.word.toLowerCase(),
      display: `Spell this word: ${item.clue}`,
      hint: "Type the exact spelling.",
      meta: {}
    };
  }

  if (game.promptStyle === "math") {
    return buildMathChallenge(difficulty);
  }

  if (game.promptStyle === "memory") {
    const word = pickWordByDifficulty(game.pool, difficulty).toLowerCase();
    return {
      target: word,
      display: word,
      hint: "Memorize quickly, it will hide.",
      meta: {
        hideAfterMs: difficulty === "Beginner" ? 2600 : difficulty === "Intermediate" ? 1800 : 1200,
        hiddenDisplay: "????"
      }
    };
  }

  if (game.promptStyle === "treasure") {
    const prompt = buildGamePrompt(game, difficulty);
    return {
      target: prompt,
      display: prompt,
      hint: `Treasure map step ${Math.min(cleared + 1, 12)} of 12`,
      meta: {}
    };
  }

  if (game.promptStyle === "escape") {
    const prompt = buildGamePrompt(game, difficulty);
    const danger = Math.max(1, 10 - (context.mistakeChars ?? 0));
    return {
      target: prompt,
      display: prompt,
      hint: `Zombie distance: ${danger}/10`,
      meta: {}
    };
  }

  if (game.promptStyle === "emoji") {
    const emojiPuzzle = randomItem(game.pool);
    return {
      target: emojiPuzzle.word.toLowerCase(),
      display: `Emoji clue: ${emojiPuzzle.emoji}`,
      hint: "Guess and type the word.",
      meta: {}
    };
  }

  if (game.promptStyle === "rhythm") {
    const beatText = randomItem(game.pool);
    return {
      target: beatText.toLowerCase(),
      display: `Beat line: ${beatText}`,
      hint: "Type in under 3 seconds for bonus points.",
      meta: {
        rhythmWindowMs: difficulty === "Beginner" ? 3600 : difficulty === "Intermediate" ? 3000 : 2500
      }
    };
  }

  if (game.promptStyle === "ladder") {
    const step = randomItem(game.pool);
    return {
      target: step.to.toLowerCase(),
      display: `Word ladder: ${step.from} -> ?`,
      hint: `${step.rule}. Target word has ${step.to.length} letters.`,
      meta: {}
    };
  }

  if (game.promptStyle === "boss") {
    const isBossRound = (cleared + 1) % 5 === 0;
    const combo = randomItem(game.pool);
    if (isBossRound) {
      return {
        target: combo.toLowerCase(),
        display: `Boss combo: ${combo.toUpperCase()}`,
        hint: "Boss round! Big points if correct.",
        meta: {
          isBossRound: true
        }
      };
    }

    const prompt = buildGamePrompt({ ...game, promptStyle: "words" }, difficulty);
    return {
      target: prompt,
      display: prompt,
      hint: "Build up to the next boss round.",
      meta: {
        isBossRound: false
      }
    };
  }

  if (game.promptStyle === "maze") {
    const prompt = buildGamePrompt(game, difficulty);
    return {
      target: prompt,
      display: prompt,
      hint: `Maze gate ${Math.min(cleared + 1, 14)} unlocked next`,
      meta: {}
    };
  }

  if (game.promptStyle === "story") {
    const chapter = cleared % game.pool.length;
    const line = game.pool[chapter];
    return {
      target: line,
      display: line,
      hint: `Story chapter ${chapter + 1}`,
      meta: {
        chapter: chapter + 1
      }
    };
  }

  const prompt = buildGamePrompt(game, difficulty);
  return {
    target: prompt,
    display: prompt,
    hint: "",
    meta: {}
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

function pickSpellingPuzzle(pool, difficulty) {
  if (!Array.isArray(pool) || !pool.length) {
    return { word: "typing", clue: "Using keys to write words." };
  }

  const filtered = pool.filter((item) => {
    const len = item.word?.length ?? 0;
    if (difficulty === "Beginner") {
      return len <= 6;
    }
    if (difficulty === "Intermediate") {
      return len >= 6 && len <= 8;
    }
    return len >= 8;
  });
  return randomItem(filtered.length ? filtered : pool);
}

function pickWordByDifficulty(pool, difficulty) {
  if (!Array.isArray(pool) || !pool.length) {
    return "typing";
  }

  const filtered = pool.filter((word) => {
    const len = word.length;
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

function buildMathChallenge(difficulty) {
  const maxNumber = difficulty === "Beginner" ? 10 : difficulty === "Intermediate" ? 25 : 60;
  const operations = difficulty === "Beginner" ? ["+"] : ["+", "-", "x"];
  const op = randomItem(operations);
  const a = randomBetween(1, maxNumber);
  const b = randomBetween(1, maxNumber);

  if (op === "+") {
    return {
      target: String(a + b),
      display: `Solve: ${a} + ${b} = ?`,
      hint: "Type only the number answer.",
      meta: {}
    };
  }

  if (op === "-") {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    return {
      target: String(high - low),
      display: `Solve: ${high} - ${low} = ?`,
      hint: "Type only the number answer.",
      meta: {}
    };
  }

  const left = randomBetween(2, difficulty === "Advanced" ? 12 : 8);
  const right = randomBetween(2, difficulty === "Beginner" ? 6 : 10);
  return {
    target: String(left * right),
    display: `Solve: ${left} x ${right} = ?`,
    hint: "Type only the number answer.",
    meta: {}
  };
}
