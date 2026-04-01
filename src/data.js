export const DIFFICULTY_LEVELS = {
  Beginner: {
    label: "Beginner",
    gameTime: 60,
    testTime: 60,
    minWords: 1,
    maxWords: 2,
    letterCount: 4,
    scoreMultiplier: 1
  },
  Intermediate: {
    label: "Intermediate",
    gameTime: 50,
    testTime: 50,
    minWords: 2,
    maxWords: 3,
    letterCount: 6,
    scoreMultiplier: 1.35
  },
  Advanced: {
    label: "Advanced",
    gameTime: 40,
    testTime: 40,
    minWords: 3,
    maxWords: 5,
    letterCount: 8,
    scoreMultiplier: 1.75
  }
};

export const ENCOURAGEMENTS = [
  "Great job!",
  "Awesome!",
  "Keep going!",
  "Well done!",
  "Super typing!",
  "You are fast!"
];

export const GAME_LIBRARY = [
  {
    id: "letter-pop",
    title: "Letter Pop",
    subtitle: "Type the target letters before they float away.",
    promptStyle: "letters",
    pool: ["a", "s", "d", "f", "j", "k", "l", "g", "h", "t", "r", "n", "m"]
  },
  {
    id: "word-race",
    title: "Word Race",
    subtitle: "Race to type speedy words and collect points.",
    promptStyle: "words",
    pool: ["zoom", "sprint", "track", "rocket", "quick", "turbo", "dash", "finish"]
  },
  {
    id: "sentence-builder",
    title: "Sentence Builder",
    subtitle: "Build tiny sentences by typing them correctly.",
    promptStyle: "sentence",
    pool: [
      "i like bright stars",
      "we can type and learn",
      "the fast fox can jump",
      "my robot loves music",
      "sunny days are happy days"
    ]
  },
  {
    id: "balloon-pop-typing",
    title: "Balloon Pop Typing",
    subtitle: "Pop balloons by typing each sky word.",
    promptStyle: "words",
    pool: ["balloon", "cloud", "sky", "breeze", "float", "party", "colorful", "sparkle"]
  },
  {
    id: "dino-run-typing",
    title: "Dino Run Typing",
    subtitle: "Help the dino run by typing adventure words.",
    promptStyle: "words",
    pool: ["dino", "jungle", "fossil", "trail", "roar", "stone", "swift", "volcano"]
  },
  {
    id: "monster-smash",
    title: "Monster Smash",
    subtitle: "Smash silly monsters with clean typing.",
    promptStyle: "words",
    pool: ["monster", "smash", "giggle", "stomp", "slime", "spark", "shield", "victory"]
  },
  {
    id: "car-racing-typing",
    title: "Car Racing Typing",
    subtitle: "Fuel your racer by typing pit stop words.",
    promptStyle: "words",
    pool: ["engine", "speed", "wheel", "finish", "racing", "driver", "nitro", "lane"]
  },
  {
    id: "fishing-words",
    title: "Fishing Words",
    subtitle: "Catch fish by typing sea-themed words.",
    promptStyle: "words",
    pool: ["ocean", "fish", "hook", "splash", "river", "boat", "coral", "anchor"]
  },
  {
    id: "space-typing-shooter",
    title: "Space Typing Shooter",
    subtitle: "Shoot space targets by typing cosmic words.",
    promptStyle: "words",
    pool: ["planet", "orbit", "laser", "comet", "galaxy", "rocket", "meteor", "starship"]
  },
  {
    id: "color-match-typing",
    title: "Color Match Typing",
    subtitle: "Match colors and words as fast as you can.",
    promptStyle: "color",
    pool: ["red", "blue", "green", "yellow", "orange", "pink", "purple", "teal"]
  }
];

export const TEST_PASSAGES = {
  Beginner: [
    "I can type with calm hands and bright focus.",
    "My fingers dance on keys and words appear.",
    "Typing is fun when I practice every day."
  ],
  Intermediate: [
    "A small rocket can fly far when every key is pressed with care and rhythm.",
    "Strong typing comes from good posture, steady breathing, and patient practice.",
    "Kids can improve speed and accuracy by keeping their eyes on the screen."
  ],
  Advanced: [
    "When I type complete thoughts with confidence, I notice fewer mistakes and gain speed naturally.",
    "Focused practice helps me build fast reactions, accurate spelling, and smooth keyboard control.",
    "A curious learner can turn short daily drills into strong typing habits for school and beyond."
  ]
};
