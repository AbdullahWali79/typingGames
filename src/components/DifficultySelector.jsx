import { DIFFICULTY_LEVELS } from "../data";

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className="difficulty-selector">
      {Object.keys(DIFFICULTY_LEVELS).map((level) => (
        <button
          key={level}
          type="button"
          className={`difficulty-btn ${value === level ? "active" : ""}`}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
