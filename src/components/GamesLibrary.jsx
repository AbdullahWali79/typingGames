import DifficultySelector from "./DifficultySelector";

export default function GamesLibrary({
  games,
  selectedDifficulty,
  onDifficultyChange,
  onOpenGame,
  snapshot
}) {
  return (
    <section className="page">
      <div className="section-head">
        <div>
          <h2>Games Library</h2>
          <p>Choose a game and type your way to a new high score.</p>
          {selectedDifficulty === "Beginner" ? (
            <p className="curriculum-note">
              Beginner mode runs step-by-step keyboard practice (2 keys at a time) across all games.
            </p>
          ) : null}
        </div>
        <DifficultySelector value={selectedDifficulty} onChange={onDifficultyChange} />
      </div>

      <div className="games-grid">
        {games.map((game) => {
          const stats = snapshot.gameStats[game.id];
          return (
            <article key={game.id} className="game-card">
              <h3>{game.title}</h3>
              <p>{game.subtitle}</p>
              <div className="game-card-stats">
                <span>Best Score: {stats ? stats.bestScore : 0}</span>
                <span>Best Accuracy: {stats ? stats.bestAccuracy.toFixed(1) : "0.0"}%</span>
              </div>
              <button className="secondary-btn" type="button" onClick={() => onOpenGame(game.id)}>
                Play {game.title}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
