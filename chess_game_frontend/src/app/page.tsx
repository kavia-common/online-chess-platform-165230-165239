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
  type Move = { from: string; to: string; san?: string; number: number };
  const [moves, setMoves] = useState<Move[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [boardStatusMsg, setBoardStatusMsg] = useState<string>("Ready");

  // Mock: Always white's turn at root
  const currentPlayer = (moves.length % 2 === 0) ? "white" : "black";

  // Handlers for control buttons
  function handleNewGame() {
    setFen(START_POSITION_FEN);
    setMoves([]);
    setCanUndo(false);
    setCanRedo(false);
    setBoardStatusMsg("Game reset. White's turn.");
  }

  function handleUndo() {
    if (moves.length > 0) {
      const newMoves = moves.slice(0, -1);
      setMoves(newMoves);
      // TODO: calculate FEN from initial + newMoves
    }
  }
  function handleRedo() {
    // Placeholder for redo
  }

  function handleSetFEN(fenStr: string) {
    setFen(fenStr);
    setMoves([]);
    setCanUndo(false);
    setCanRedo(false);
    setBoardStatusMsg("Board imported from FEN. White's turn.");
  }

  // ARIA live update from StatusBar
  function handleStatusUpdate(msg: string) {
    setBoardStatusMsg(msg);
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-tr from-blue-500/10 to-gray-50 flex flex-col items-center"
      aria-label="Chess game main"
      tabIndex={-1}
      id="main-chess-game"
    >
      <div className="w-full max-w-2xl flex flex-col space-y-4 mt-10 items-center">
        <StatusBar
          currentPlayer={currentPlayer}
          statusMessage={boardStatusMsg}
          onStatusUpdate={handleStatusUpdate}
        />
        <Chessboard
          fen={fen}
          statusMessage={boardStatusMsg}
        />
        <MoveList moves={moves} onMoveClick={() => {}} />
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
      {/* Offscreen ARIA live summary */}
      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        id="screenreader-status"
        tabIndex={-1}
      >
        {boardStatusMsg}
      </div>
    </main>
  );
}
