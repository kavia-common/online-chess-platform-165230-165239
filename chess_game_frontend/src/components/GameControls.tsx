"use client";
import React from "react";

export interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onFlip: () => void;
  onImportFEN: () => void;
  onExportFEN: () => void;
}

// PUBLIC_INTERFACE
/**
 * Chess game controls for starting/restarting games and move manipulation.
 */
const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  onRedo,
  onReset,
  onFlip,
  onImportFEN,
  onExportFEN,
}) => (
  <div
    className="flex flex-wrap gap-3 justify-center items-center w-full"
    aria-label="Chess game controls"
  >
    <button
      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-60"
      aria-label="Start a new game"
      onClick={onNewGame}
      type="button"
      disabled={false}
    >
      New Game
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-gray-100 text-blue-700 font-medium shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
      aria-label="Undo last move"
      onClick={onUndo}
      type="button"
      disabled={true}
    >
      Undo
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-gray-100 text-blue-700 font-medium shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
      aria-label="Redo move"
      onClick={onRedo}
      type="button"
      disabled={true}
    >
      Redo
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-yellow-400 text-[#111827] font-semibold shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition disabled:opacity-60"
      aria-label="Reset the board"
      onClick={onReset}
      type="button"
      disabled={false}
    >
      Reset
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-white text-blue-700 border border-blue-300 font-medium shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:opacity-60"
      aria-label="Flip board orientation"
      onClick={onFlip}
      type="button"
      disabled={false}
    >
      Flip Board
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-slate-200 text-blue-700 font-medium shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:opacity-60"
      aria-label="Import FEN"
      onClick={onImportFEN}
      type="button"
      disabled={false}
    >
      Import FEN
    </button>
    <button
      className="px-4 py-2 rounded-lg bg-white text-blue-700 border border-blue-300 font-medium shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:opacity-60"
      aria-label="Export FEN"
      onClick={onExportFEN}
      type="button"
      disabled={false}
    >
      Export FEN
    </button>
  </div>
);

export default GameControls;
