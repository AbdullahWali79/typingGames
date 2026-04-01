const FULL_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
  [".", ",", "'", "!", "?", "-"]
];

const NUMERIC_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0"]
];

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
  const rows = layout === "numeric" ? NUMERIC_ROWS : FULL_ROWS;
  const normalizedHint = normalizeKey(nextHintChar);

  return (
    <div className={`virtual-keyboard theme-${theme}`}>
      <p className="vk-title">Virtual Keyboard</p>
      {rows.map((row, rowIndex) => (
        <div className="vk-row" key={`row-${rowIndex}`}>
          {row.map((key) => (
            <button
              key={key}
              type="button"
              className={`vk-key ${normalizedHint === normalizeKey(key) ? "next-key" : ""}`}
              disabled={disabled}
              onClick={() => onInput(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="vk-row vk-actions">
        <button type="button" className="vk-key wide" disabled={disabled} onClick={onSpace}>
          Space
        </button>
        <button type="button" className="vk-key action" disabled={disabled} onClick={onBackspace}>
          Backspace
        </button>
        <button type="button" className="vk-key action" disabled={disabled} onClick={onEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}

function normalizeKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .slice(0, 1);
}
