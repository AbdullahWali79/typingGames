const KEYBOARD_101 = [
  [
    keyDef("1"),
    keyDef("2"),
    keyDef("3"),
    keyDef("4"),
    keyDef("5"),
    keyDef("6"),
    keyDef("7"),
    keyDef("8"),
    keyDef("9"),
    keyDef("0"),
    keyDef("-"),
    keyDef("="),
    actionKey("Back", "backspace", 2)
  ],
  [
    actionKey("Tab", "tab", 1.5),
    keyDef("q"),
    keyDef("w"),
    keyDef("e"),
    keyDef("r"),
    keyDef("t"),
    keyDef("y"),
    keyDef("u"),
    keyDef("i"),
    keyDef("o"),
    keyDef("p"),
    keyDef("["),
    keyDef("]"),
    keyDef("\\", "\\")
  ],
  [
    actionKey("Caps", "caps", 1.8, true),
    keyDef("a"),
    keyDef("s"),
    keyDef("d"),
    keyDef("f"),
    keyDef("g"),
    keyDef("h"),
    keyDef("j"),
    keyDef("k"),
    keyDef("l"),
    keyDef(";"),
    keyDef("'"),
    actionKey("Enter", "enter", 2)
  ],
  [
    actionKey("Shift", "shift", 2.2, true),
    keyDef("z"),
    keyDef("x"),
    keyDef("c"),
    keyDef("v"),
    keyDef("b"),
    keyDef("n"),
    keyDef("m"),
    keyDef(","),
    keyDef("."),
    keyDef("/"),
    actionKey("Shift", "shift", 2.4, true)
  ],
  [
    actionKey("Ctrl", "ctrl", 1.4, true),
    actionKey("Alt", "alt", 1.3, true),
    actionKey("Space", "space", 7),
    actionKey("Alt", "alt", 1.3, true),
    actionKey("Ctrl", "ctrl", 1.4, true)
  ]
];

const NUMERIC_ROWS = [
  [keyDef("1"), keyDef("2"), keyDef("3"), actionKey("Backspace", "backspace", 2)],
  [keyDef("4"), keyDef("5"), keyDef("6"), actionKey("Enter", "enter", 2)],
  [keyDef("7"), keyDef("8"), keyDef("9"), actionKey("Space", "space", 2)],
  [actionKey("0", "input", 2, false, "0"), keyDef("."), keyDef("-")]
];

const LEFT_HAND_PANEL = [
  { id: "lp", label: "Pinky", home: "A" },
  { id: "lr", label: "Ring", home: "S" },
  { id: "lm", label: "Middle", home: "D" },
  { id: "li", label: "Index", home: "F" }
];

const RIGHT_HAND_PANEL = [
  { id: "ri", label: "Index", home: "J" },
  { id: "rm", label: "Middle", home: "K" },
  { id: "rr", label: "Ring", home: "L" },
  { id: "rp", label: "Pinky", home: ";" }
];

const SHIFTED_KEY_MAP = {
  "!": "1",
  "@": "2",
  "#": "3",
  $: "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  _: "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  "\"": "'",
  "<": ",",
  ">": ".",
  "?": "/"
};

const FINGER_MAP = {
  "1": "lp",
  q: "lp",
  a: "lp",
  z: "lp",
  tab: "lp",
  caps: "lp",
  shift: "lp",
  ctrl: "lp",
  "`": "lp",
  "2": "lr",
  w: "lr",
  s: "lr",
  x: "lr",
  "3": "lm",
  e: "lm",
  d: "lm",
  c: "lm",
  "4": "li",
  "5": "li",
  r: "li",
  t: "li",
  f: "li",
  g: "li",
  v: "li",
  b: "li",
  "6": "ri",
  "7": "ri",
  y: "ri",
  u: "ri",
  h: "ri",
  j: "ri",
  n: "ri",
  m: "ri",
  "8": "rm",
  i: "rm",
  k: "rm",
  ",": "rm",
  "9": "rr",
  o: "rr",
  l: "rr",
  ".": "rr",
  "0": "rp",
  p: "rp",
  "[": "rp",
  "]": "rp",
  "\\": "rp",
  ";": "rp",
  "'": "rp",
  "/": "rp",
  "-": "rp",
  "=": "rp",
  backspace: "rp",
  enter: "rp",
  alt: "rt",
  space: "lt"
};

export default function VirtualKeyboard({
  disabled,
  onInput,
  onBackspace,
  onSpace,
  onEnter,
  nextHintChar,
  theme = "default",
  layout = "full"
}) {
  const rows = layout === "numeric" ? NUMERIC_ROWS : KEYBOARD_101;
  const normalizedHintKey = normalizeHintKey(nextHintChar);
  const activeFinger = getFingerId(normalizedHintKey);
  const hintLabel = formatHintLabel(normalizedHintKey);

  return (
    <div className={`virtual-keyboard theme-${theme}`}>
      <div className="vk-target-bar">
        <span className="vk-target-label">Press key:</span>
        <span className="vk-target-key">{hintLabel}</span>
      </div>

      <div className="vk-layout-shell">
        <div className="vk-hand-card left">
          <p className="vk-hand-title">Left Hand</p>
          {LEFT_HAND_PANEL.map((item) => (
            <div key={item.id} className={`vk-hand-row ${activeFinger === item.id ? "active" : ""}`}>
              <span>{item.label}</span>
              <strong>{item.home}</strong>
            </div>
          ))}
        </div>

        <div className="vk-board-wrap">
          <div className="vk-board">
            {rows.map((row, rowIndex) => (
              <div className="vk-row" key={`row-${rowIndex}`}>
                {row.map((key) =>
                  renderKey({
                    key,
                    disabled,
                    onInput,
                    onBackspace,
                    onSpace,
                    onEnter,
                    normalizedHintKey
                  })
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="vk-hand-card right">
          <p className="vk-hand-title">Right Hand</p>
          {RIGHT_HAND_PANEL.map((item) => (
            <div key={item.id} className={`vk-hand-row ${activeFinger === item.id ? "active" : ""}`}>
              <span>{item.label}</span>
              <strong>{item.home}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderKey({ key, disabled, onInput, onBackspace, onSpace, onEnter, normalizedHintKey }) {
  const fingerId = getFingerId(key.fingerKey ?? key.value ?? key.action ?? "");
  const isNext = normalizedHintKey === normalizeHintKey(key.value ?? key.fingerKey ?? "");
  const isDecor = key.decorative === true;

  return (
    <button
      key={`${key.label}-${key.value}-${key.action}`}
      type="button"
      className={`vk-key finger-${fingerId} ${isNext ? "next-key" : ""} ${isDecor ? "decorative" : ""}`}
      style={{ "--w": key.width ?? 1 }}
      disabled={disabled || isDecor}
      onClick={() => handleKeyPress(key, onInput, onBackspace, onSpace, onEnter)}
    >
      <span className="vk-key-main">{key.label}</span>
    </button>
  );
}

function handleKeyPress(key, onInput, onBackspace, onSpace, onEnter) {
  if (key.action === "input") {
    onInput(key.value);
    return;
  }

  if (key.action === "space") {
    onSpace();
    return;
  }

  if (key.action === "backspace") {
    onBackspace();
    return;
  }

  if (key.action === "enter") {
    onEnter();
    return;
  }

  if (key.action === "tab") {
    onInput("  ");
  }
}

function keyDef(label, value = label) {
  return {
    label,
    value,
    action: "input",
    width: 1
  };
}

function actionKey(label, action, width, decorative = false, value = "") {
  return {
    label,
    action,
    width,
    decorative,
    value,
    fingerKey: action
  };
}

function getFingerId(keyValue) {
  const key = String(keyValue ?? "").toLowerCase().trim();
  return FINGER_MAP[key] ?? "li";
}

function normalizeHintKey(value) {
  const raw = String(value ?? "");
  if (!raw) {
    return "";
  }
  const first = raw.slice(0, 1);
  if (first === "\n") {
    return "enter";
  }
  if (first === "\t") {
    return "tab";
  }
  const lower = first.toLowerCase();
  if (lower === " ") {
    return "space";
  }
  return SHIFTED_KEY_MAP[first] ?? lower;
}

function formatHintLabel(hintKey) {
  if (!hintKey) {
    return "-";
  }
  if (hintKey === "space") {
    return "Space";
  }
  if (hintKey === "enter") {
    return "Enter";
  }
  if (hintKey === "tab") {
    return "Tab";
  }
  return hintKey.toUpperCase();
}
