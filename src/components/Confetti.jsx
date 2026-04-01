import { useEffect, useState } from 'react';

// CSS-based confetti - no external assets!
const COLORS = ['#ff5f8d', '#ffd84d', '#4bc0ff', '#17c79d', '#ff8c3a', '#9d4cff'];
const SHAPES = ['circle', 'square', 'triangle'];

function createConfettiPiece() {
  return {
    id: Math.random(),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    speed: 2 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 2,
    size: 8 + Math.random() * 8
  };
}

export default function Confetti({ active, duration = 3000 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    // Create initial batch
    const initialPieces = Array.from({ length: 50 }, createConfettiPiece);
    setPieces(initialPieces);

    // Add more pieces over time
    const interval = setInterval(() => {
      setPieces(prev => {
        if (prev.length > 150) return prev;
        return [...prev, ...Array.from({ length: 10 }, createConfettiPiece)];
      });
    }, 200);

    // Stop after duration
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [active, duration]);

  // Animate pieces
  useEffect(() => {
    if (!active || pieces.length === 0) return;

    let animationId;
    const animate = () => {
      setPieces(prev => 
        prev
          .map(piece => ({
            ...piece,
            y: piece.y + piece.speed,
            x: piece.x + piece.drift,
            rotation: piece.rotation + 2
          }))
          .filter(piece => piece.y < 110) // Remove pieces that fell off screen
      );
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [active, pieces.length]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.shape}`}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'triangle' ? '0' : '2px'
          }}
        />
      ))}
    </div>
  );
}
