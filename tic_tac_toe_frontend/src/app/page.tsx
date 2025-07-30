"use client";
import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function Home() {
  // Board is 1D (0-8). null = empty, "X", "O"
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);
  const isDraw = board.every((v) => v) && !winner;

  // PUBLIC_INTERFACE
  function handleClick(idx: number) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }
  // PUBLIC_INTERFACE
  function restart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // UI Styles: color variables
  const primary = "#1976d2";
  const accent = "#ff4081";
  const secondary = "#424242";

  // Styles for the cells and board, minimalistic, responsive (mobile friendly)
  const cellStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    border: `1.5px solid ${secondary}20`,
    fontSize: "2.1rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: winner || isDraw ? "default" : "pointer",
    transition: "background .15s",
    background: "#fff",
    color: secondary,
    outline: "none"
  };
  const accentCell = {
    color: accent,
    textShadow: `0 1px 0 ${primary}20`,
  };
  const boardStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 0,
    background: "#fafbfc",
    borderRadius: 12,
    boxShadow: "0 2px 16px 2px #6a8ba225",
    border: `2px solid ${primary}17`,
    margin: "auto",
    width: 202,
    height: 202,
    userSelect: "none"
  };

  // Status color
  let status: string;
  let statusColor = primary;
  if (winner) {
    status = `Winner: ${winner}`;
    statusColor = accent;
  } else if (isDraw) {
    status = "It's a draw!";
    statusColor = secondary;
  } else {
    status = `Turn: ${xIsNext ? "X" : "O"}`;
    statusColor = primary;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        transition: "background 0.20s, color 0.20s",
        padding: "2rem 0"
      }}
    >
      <h1
        style={{
          letterSpacing: "0.06em",
          marginBottom: 12,
          fontSize: "2.3rem",
          color: primary,
          fontFamily: "inherit",
          fontWeight: 900,
        }}
      >
        Tic Tac Toe
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Board */}
        <div style={boardStyle} aria-label="Tic Tac Toe Board">
          {board.map((cell, i) => (
            // PUBLIC_INTERFACE
            <button
              key={i}
              style={{
                ...cellStyle,
                ...(winner && winnerCombo(board)?.includes(i)
                  ? accentCell
                  : {}),
                borderTop:
                  i > 2
                    ? `1px solid ${secondary}22`
                    : "1.5px solid transparent",
                borderLeft:
                  i % 3 !== 0
                    ? `1px solid ${secondary}18`
                    : "1.5px solid transparent",
              }}
              aria-label={`Cell ${i + 1}, ${cell ?? "empty"}`}
              onClick={() => handleClick(i)}
              tabIndex={winner || isDraw ? -1 : 0}
              disabled={!!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>
        {/* Status & Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            minHeight: 70,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "1.15rem",
              letterSpacing: "0.035em",
              color: statusColor,
              fontWeight: 600,
              minHeight: 32,
              textShadow: winner
                ? `0 1px 0 #ff4081cc`
                : isDraw
                ? `0 2px 2px #4a4a4a1b`
                : undefined,
            }}
            data-testid="status"
            aria-live="polite"
          >
            {status}
          </div>
          <button
            style={{
              marginTop: 4,
              padding: "0.5em 1.6em",
              borderRadius: 99,
              border: "none",
              background: accent,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: ".07em",
              boxShadow: "0 0.5px 3px 0.5px #ff40811d",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background .2s,color .2s",
              outline: "none"
            }}
            onClick={restart}
            aria-label="Restart the game"
            data-testid="restart-btn"
          >
            Restart
          </button>
        </div>
      </div>
      <footer
        style={{
          marginTop: 44,
          fontSize: 14,
          color: "#aaa",
          opacity: 0.7,
          letterSpacing: "0.05em",
          textAlign: "center",
        }}
      >
        Minimalistic Tic Tac Toe &mdash; Made with Next.js
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Returns "X" or "O" if there's a winner, otherwise null.
 */
function calculateWinner(
  board: (null | "X" | "O")[]
): "X" | "O" | null {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // dias
  ];
  for (const [a, b, c] of combos) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * If there is a winner, returns the combination array; else null.
 */
function winnerCombo(board: (null | "X" | "O")[]): number[] | null {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const combo of combos) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return combo;
    }
  }
  return null;
}
