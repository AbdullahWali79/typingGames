import { GAME_LIBRARY } from "../data";
import { formatResultDate } from "../utils";

export default function ProgressPage({ snapshot }) {
  const favorite = GAME_LIBRARY.find((game) => game.id === snapshot.favoriteGame);
  const recent = snapshot.recentResult;

  return (
    <section className="page">
      <div className="section-head">
        <div>
          <h2>My Best Scores</h2>
          <p>All progress is saved only in this browser with localStorage.</p>
        </div>
      </div>

      <div className="progress-grid">
        <article className="progress-card">
          <h3>Best WPM</h3>
          <p>{snapshot.bestWpm.toFixed(1)}</p>
        </article>
        <article className="progress-card">
          <h3>Best Accuracy</h3>
          <p>{snapshot.bestAccuracy.toFixed(1)}%</p>
        </article>
        <article className="progress-card">
          <h3>Favourite Game</h3>
          <p>{favorite ? favorite.title : "Play some games first"}</p>
        </article>
        <article className="progress-card">
          <h3>Total Games Played</h3>
          <p>{snapshot.totalGamesPlayed}</p>
        </article>
      </div>

      <div className="recent-result-card">
        <h3>Recent Typing Test Result</h3>
        {recent ? (
          <div>
            <p>Name: {recent.name}</p>
            <p>WPM: {recent.wpm}</p>
            <p>Accuracy: {recent.accuracy}%</p>
            <p>Mistakes: {recent.mistakes}</p>
            <p>Level: {recent.level}</p>
            <p>Date: {formatResultDate(recent.date)}</p>
          </div>
        ) : (
          <p>No test yet. Take one from the Typing Test page.</p>
        )}
      </div>

      <div className="games-stats-table">
        <h3>Game High Scores</h3>
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Best Score</th>
              <th>Best Accuracy</th>
              <th>Best Speed</th>
              <th>Plays</th>
            </tr>
          </thead>
          <tbody>
            {GAME_LIBRARY.map((game) => {
              const stat = snapshot.gameStats[game.id] ?? {
                bestScore: 0,
                bestAccuracy: 0,
                bestSpeed: 0,
                plays: 0
              };
              return (
                <tr key={game.id}>
                  <td>{game.title}</td>
                  <td>{stat.bestScore}</td>
                  <td>{stat.bestAccuracy.toFixed(1)}%</td>
                  <td>{stat.bestSpeed.toFixed(1)} WPM</td>
                  <td>{stat.plays}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
