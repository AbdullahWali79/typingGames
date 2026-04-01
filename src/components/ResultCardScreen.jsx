import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { formatResultDate } from "../utils";

export default function ResultCardScreen({ result, onTakeAnother, onOpenProgress }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function downloadPng() {
    if (!cardRef.current || !result) {
      return;
    }

    try {
      setDownloading(true);
      setError("");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });
      const link = document.createElement("a");
      link.download = `typing-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (downloadError) {
      setError("Unable to generate PNG right now. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (!result) {
    return (
      <section className="page">
        <div className="empty-state">
          <h2>No test result yet</h2>
          <p>Take a typing test to generate your result card.</p>
          <button className="primary-btn" type="button" onClick={onTakeAnother}>
            Go to Typing Test
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="section-head">
        <div>
          <h2>Typing Test Result</h2>
          <p>Your latest card is ready to download.</p>
        </div>
      </div>

      <div className="result-screen">
        <article className="result-card" ref={cardRef}>
          <h3>Typing Test Result</h3>
          <p className="result-name">Name: {result.name}</p>
          <div className="result-grid">
            <div>
              <span>WPM</span>
              <strong>{result.wpm}</strong>
            </div>
            <div>
              <span>Accuracy</span>
              <strong>{result.accuracy}%</strong>
            </div>
            <div>
              <span>Mistakes</span>
              <strong>{result.mistakes}</strong>
            </div>
            <div>
              <span>Typed Chars</span>
              <strong>{result.totalTypedCharacters}</strong>
            </div>
            <div>
              <span>Level</span>
              <strong>{result.level}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{formatResultDate(result.date)}</strong>
            </div>
          </div>
          <p className="motivation">{result.message}</p>
        </article>

        <div className="result-actions">
          <button className="primary-btn" type="button" onClick={downloadPng} disabled={downloading}>
            {downloading ? "Preparing PNG..." : "Download Result Card as PNG"}
          </button>
          <button className="secondary-btn" type="button" onClick={onTakeAnother}>
            Retake Typing Test
          </button>
          <button className="secondary-btn" type="button" onClick={onOpenProgress}>
            Open My Progress
          </button>
          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
