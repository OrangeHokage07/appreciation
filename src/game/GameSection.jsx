import { useEffect, useRef, useState } from "react";
import { createGame } from "./game";

export const GameSection = () => {
  const canvasRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [status, setStatus] = useState({
    score: 0,
    highScore: 0,
    hp: 100,
    isGameOver: false,
    newHighScore: false,
  });

  useEffect(() => {
    if (!canvasRef.current || !leftRef.current || !rightRef.current) return;

    let cleanup;
    createGame({
      canvas: canvasRef.current,
      leftButton: leftRef.current,
      rightButton: rightRef.current,
      onState: (next) => setStatus(next),
    }).then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section id="game" className="game-section">
      <div className="game-layout">
        <button className="game-button" aria-label="Move left" ref={leftRef}>
          <img src="/ui/left_button.png" alt="Left" />
        </button>

        <div className="game-center">
          <div className="game-hud">
            <div className="game-hud-row">
              <span className="game-label">Score</span>
              <span className="game-value">{status.score}</span>
            </div>
            <div className="game-hud-row">
              <span className="game-label">High</span>
              <span className="game-value">{status.highScore}</span>
            </div>
            <div className="game-hud-row">
              <span className="game-label">HP</span>
              <span className="game-value">{status.hp}</span>
            </div>
          </div>

          {status.newHighScore && (
            <div className="game-banner">🏆 NEW HIGH SCORE!</div>
          )}

          <div className="game-frame">
            <img src="/ui/frame.png" alt="Game frame" />
            <canvas ref={canvasRef} className="game-canvas" />
          </div>

          {status.isGameOver && (
            <div className="game-over">
              <h3>Game Over</h3>
              <p>Tap or click to restart</p>
            </div>
          )}
        </div>

        <button className="game-button" aria-label="Move right" ref={rightRef}>
          <img src="/ui/right_button.png" alt="Right" />
        </button>
      </div>
    </section>
  );
};
