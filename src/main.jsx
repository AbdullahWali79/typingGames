import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles.css";

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// Apply reduced motion preference on load
const reducedMotion = localStorage.getItem('typingGames.kids.v1');
if (reducedMotion) {
  try {
    const state = JSON.parse(reducedMotion);
    if (state.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
  } catch {
    // Ignore parse errors
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
