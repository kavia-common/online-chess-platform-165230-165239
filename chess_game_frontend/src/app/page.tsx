"use client";

import React, { useState } from "react";
import Chessboard from "../components/Chessboard";
import MoveList from "../components/MoveList";
import StatusBar from "../components/StatusBar";
import GameControls from "../components/GameControls";
import { START_POSITION_FEN } from "../lib/chess";

export default function HomePage() {
  // The chess logic here uses FEN and move history.
  // We'll add a simple FEN+move state
  const [fen, setFen] = useState<string>(START_POSITION_FEN);
  // Match MoveList's Move type: { from: string; to: string; san?: string; number: number }
  type Move = { from: string; to: string; san?: string; number: number };
  const [moves, setMoves] = useState<Move[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Handlers for control buttons
  function handleNewGame() {
    setFen(START_POSITION_FEN);
    setMoves([]);
    setCanUndo(false);
    setCanRedo(false);
  }

  function handleUndo() {
    // Placeholder: track moves
    if (moves.length > 0) {
      const newMoves = moves.slice(0, -1);
      setMoves(newMoves);
      // TODO: calculate FEN from initial + newMoves
    }
  }
  function handleRedo() {
    // Placeholder
  }

  function handleSetFEN(fenStr: string) {
    setFen(fenStr);
    setMoves([]);
    setCanUndo(false);
    setCanRedo(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-500/10 to-gray-50 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col space-y-4 mt-10 items-center">
        <StatusBar currentPlayer="white" statusMessage="Ready" />
        <Chessboard fen={fen} moves={moves} />
        <MoveList moves={moves} />
        <GameControls
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          currentFEN={fen}
          onSetFEN={handleSetFEN}
        />
      </div>
    </main>
  );
}
