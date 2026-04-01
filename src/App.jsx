import { useEffect, useMemo, useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import GamesLibrary from "./components/GamesLibrary";
import GameArena from "./components/GameArena";
import TypingTest from "./components/TypingTest";
import ResultCardScreen from "./components/ResultCardScreen";
import ProgressPage from "./components/ProgressPage";
import AboutPage from "./components/AboutPage";
import { GAME_LIBRARY } from "./data";
import {
  getProgressSnapshot,
  saveGameSession,
  saveSelectedDifficulty,
  saveTypingTestResult
} from "./storage";

const ROUTES = new Set(["home", "games", "game", "test", "result", "progress", "about"]);

function getRouteFromHash() {
  const hash = window.location.hash.replace("#/", "").trim();
  return ROUTES.has(hash) ? hash : "home";
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash);
  const [snapshot, setSnapshot] = useState(() => getProgressSnapshot());
  const [selectedGameId, setSelectedGameId] = useState(
    snapshot.lastPlayedGame || GAME_LIBRARY[0].id
  );

  const selectedGame =
    GAME_LIBRARY.find((game) => game.id === selectedGameId) ?? GAME_LIBRARY[0];

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#/home";
    }
  }, []);

  const selectedDifficulty = useMemo(
    () => snapshot.selectedDifficulty || "Beginner",
    [snapshot.selectedDifficulty]
  );

  function navigate(nextRoute) {
    if (!ROUTES.has(nextRoute)) {
      return;
    }
    window.location.hash = `#/${nextRoute}`;
    setRoute(nextRoute);
  }

  function refreshSnapshot() {
    setSnapshot(getProgressSnapshot());
  }

  function handleDifficultyChange(level) {
    saveSelectedDifficulty(level);
    refreshSnapshot();
  }

  function handleOpenGame(gameId) {
    setSelectedGameId(gameId);
    navigate("game");
  }

  function handleGameComplete(gameId, summary) {
    saveGameSession(gameId, summary);
    refreshSnapshot();
  }

  function handleTestComplete(result) {
    saveTypingTestResult(result);
    refreshSnapshot();
    navigate("result");
  }

  return (
    <div className="app-shell">
      <div className="bg-stars" />
      <div className="bg-balloons" />
      <NavBar route={route} onNavigate={navigate} />

      <main>
        {route === "home" ? (
          <HomePage
            selectedDifficulty={selectedDifficulty}
            onPlayGames={() => navigate("games")}
            onTakeTest={() => navigate("test")}
          />
        ) : null}

        {route === "games" ? (
          <GamesLibrary
            games={GAME_LIBRARY}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
            onOpenGame={handleOpenGame}
            snapshot={snapshot}
          />
        ) : null}

        {route === "game" ? (
          <GameArena
            game={selectedGame}
            difficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
            onBackToLibrary={() => navigate("games")}
            onGameComplete={handleGameComplete}
          />
        ) : null}

        {route === "test" ? (
          <TypingTest
            difficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
            onComplete={handleTestComplete}
          />
        ) : null}

        {route === "result" ? (
          <ResultCardScreen
            result={snapshot.recentResult}
            onTakeAnother={() => navigate("test")}
            onOpenProgress={() => navigate("progress")}
          />
        ) : null}

        {route === "progress" ? <ProgressPage snapshot={snapshot} /> : null}
        {route === "about" ? <AboutPage /> : null}
      </main>
    </div>
  );
}
