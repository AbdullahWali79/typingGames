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
    id: "word-jigsaw",
    title: "Word Jigsaw Puzzle",
    subtitle: "Unscramble jumbled letters and type the correct word.",
    promptStyle: "anagram",
    pool: [
      { word: "cat", hint: "A small pet that says meow." },
      { word: "tree", hint: "It has leaves and a trunk." },
      { word: "ocean", hint: "A huge body of salty water." },
      { word: "rocket", hint: "It flies to space." },
      { word: "planet", hint: "Earth is one of these." },
      { word: "dinosaur", hint: "A giant creature from long ago." },
      { word: "rainbow", hint: "Colorful arc in the sky after rain." },
      { word: "adventure", hint: "A fun journey with surprises." }
    ]
  },
  {
    id: "typing-ninja",
    title: "Typing Ninja",
    subtitle: "Slice falling words by typing them before they drop.",
    promptStyle: "words",
    pool: ["slice", "swift", "ninja", "focus", "shadow", "strike", "silent", "dash"]
  },
  {
    id: "spelling-bee-sprint",
    title: "Spelling Bee Sprint",
    subtitle: "Read the clue and type the correct spelling quickly.",
    promptStyle: "spelling",
    pool: [
      { word: "banana", clue: "A yellow fruit monkeys love." },
      { word: "school", clue: "A place where children learn." },
      { word: "library", clue: "A place full of books." },
      { word: "science", clue: "Subject about experiments and discovery." },
      { word: "elephant", clue: "A giant animal with a trunk." },
      { word: "beautiful", clue: "Something very pretty." }
    ]
  },
  {
    id: "math-plus-type",
    title: "Math + Type",
    subtitle: "Solve fun equations and type the answer.",
    promptStyle: "math",
    pool: []
  },
  {
    id: "memory-typing-flip",
    title: "Memory Typing Flip",
    subtitle: "Memorize the word, then type after it hides.",
    promptStyle: "memory",
    pool: ["cat", "jump", "forest", "rocket", "pencil", "planet", "rainbow", "elephant"]
  },
  {
    id: "pirate-treasure-typing",
    title: "Pirate Treasure Typing",
    subtitle: "Unlock treasure map steps with accurate typing.",
    promptStyle: "treasure",
    pool: ["pirate", "island", "compass", "captain", "anchor", "treasure", "parrot", "voyage"]
  },
  {
    id: "zombie-escape-typing",
    title: "Zombie Escape Typing",
    subtitle: "Type fast to stay ahead of the zombies.",
    promptStyle: "escape",
    pool: ["escape", "sprint", "shield", "safe", "tunnel", "rescue", "flashlight", "checkpoint"]
  },
  {
    id: "emoji-word-quest",
    title: "Emoji Word Quest",
    subtitle: "Use emoji clues to type the hidden word.",
    promptStyle: "emoji",
    pool: [
      { emoji: "🐱", word: "cat" },
      { emoji: "🚀", word: "rocket" },
      { emoji: "🌈", word: "rainbow" },
      { emoji: "🐟", word: "fish" },
      { emoji: "🍎", word: "apple" },
      { emoji: "⚽", word: "ball" }
    ]
  },
  {
    id: "typing-rhythm-beat",
    title: "Typing Rhythm Beat",
    subtitle: "Type to the beat and earn timing bonuses.",
    promptStyle: "rhythm",
    pool: ["tap tap go", "boom clap type", "fast fingers now", "beat and type", "rhythm racer"]
  },
  {
    id: "word-ladder-kids",
    title: "Word Ladder Kids",
    subtitle: "Change one letter and type the target word.",
    promptStyle: "ladder",
    pool: [
      { from: "cat", to: "bat", rule: "Change first letter" },
      { from: "sun", to: "fun", rule: "Change first letter" },
      { from: "book", to: "cook", rule: "Change first letter" },
      { from: "ship", to: "shop", rule: "Change one middle letter" },
      { from: "plane", to: "plant", rule: "Change last letter" }
    ]
  },
  {
    id: "boss-battle-typing",
    title: "Boss Battle Typing",
    subtitle: "Every few rounds a boss combo appears for extra points.",
    promptStyle: "boss",
    pool: ["mega combo", "power blast", "typing thunder", "rapid strike", "victory mode"]
  },
  {
    id: "maze-unlock-typing",
    title: "Maze Unlock Typing",
    subtitle: "Type correctly to open maze gates step by step.",
    promptStyle: "maze",
    pool: ["gate", "path", "turn", "key", "clue", "maze", "escape", "finish"]
  },
  {
    id: "story-mode-typing",
    title: "Story Mode Typing",
    subtitle: "Type story lines to move to the next chapter.",
    promptStyle: "story",
    pool: [
      "Luna found a tiny map near the old tree.",
      "She followed glowing stars through the quiet park.",
      "A friendly fox showed her a hidden bridge.",
      "Across the bridge she saw a golden kite.",
      "Luna smiled because bravery unlocked a new adventure."
    ]
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

export const TEST_STORIES = {
  Beginner: [
    "Mina has a red kite. She runs in the park. The kite dances in the sky.",
    "Ali sees a small frog. He smiles and says hello. The frog jumps to the pond.",
    "Sara bakes tiny cookies. Her cat waits nearby. They share a happy snack."
  ],
  Intermediate: [
    "Rayan found a shiny key under a bench. He followed chalk arrows and opened a tiny library box full of comics.",
    "Noor planted sunflower seeds with her class. After many sunny days, tall flowers waved like yellow flags.",
    "Two friends built a cardboard rocket in the garage. They counted down, laughed, and imagined a moon mission."
  ],
  Advanced: [
    "On the first day of summer camp, Hadi mapped every trail with careful notes, then guided his team through the woods to a hidden waterfall.",
    "When the school power went out, Ayesha organized a flashlight reading circle and turned a quiet hallway into a magical story theater.",
    "During the science fair, Musa presented a wind-powered car, explained each design choice clearly, and inspired younger students to start inventing."
  ]
};
