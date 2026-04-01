export default function HomePage({ onPlayGames, onTakeTest, selectedDifficulty }) {
  return (
    <section className="page home-page">
      <div className="hero-card">
        <p className="kicker">Fun typing for ages 5-12</p>
        <h1>Build speed, accuracy, and confidence.</h1>
        <p>
          Pick a game, race your score, then take a typing test and save your
          result card as a PNG image.
        </p>
        <p className="difficulty-pill">Current level: {selectedDifficulty}</p>
        <div className="hero-actions">
          <button className="cta-btn play" type="button" onClick={onPlayGames}>
            Play Games
          </button>
          <button className="cta-btn test" type="button" onClick={onTakeTest}>
            Take Typing Test
          </button>
        </div>
      </div>
      <div className="feature-grid">
        <article className="feature-card">
          <h3>Instant Play</h3>
          <p>No login, no waiting, no setup.</p>
        </article>
        <article className="feature-card">
          <h3>Track Progress</h3>
          <p>Best WPM, best accuracy, and game records.</p>
        </article>
        <article className="feature-card">
          <h3>Share Results</h3>
          <p>Download your test card as a clean PNG.</p>
        </article>
      </div>
    </section>
  );
}
