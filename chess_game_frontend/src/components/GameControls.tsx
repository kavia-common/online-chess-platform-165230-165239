import React, { useState } from "react";
import { parseFEN, validateFEN } from "../lib/chess";

type GameControlsProps = {
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentFEN: string;
  onSetFEN: (fen: string) => void;
};

// PUBLIC_INTERFACE
const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  currentFEN,
  onSetFEN,
}) => {
  const [importFEN, setImportFEN] = useState("");
  const [fenError, setFenError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Handle FEN import
  const handleImport = () => {
    if (!importFEN.trim()) {
      setFenError("Please enter a FEN string.");
      return;
    }
    // Validate and try to parse FEN using chess.ts helpers
    const err = validateFEN(importFEN.trim());
    if (err) {
      setFenError("Invalid FEN: " + err);
      setToast({ type: "error", msg: "Failed to import: Invalid FEN." });
      return;
    }
    // Try to parse (should be valid here)
    try {
      parseFEN(importFEN.trim());
      onSetFEN(importFEN.trim());
      setToast({ type: "success", msg: "FEN imported successfully." });
      setFenError(null);
    } catch {
      setFenError("Error parsing FEN.");
      setToast({ type: "error", msg: "Failed to import FEN." });
    }
  };

  // Handle FEN export (copy to clipboard)
  const handleExport = async () => {
    try {
      await navigator.clipboard.writeText(currentFEN);
      setToast({ type: "success", msg: "FEN copied to clipboard." });
    } catch {
      setToast({ type: "error", msg: "Failed to copy FEN to clipboard." });
    }
  };

  // Close toast after 2.5 seconds
  React.useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(id);
    }
  }, [toast]);

  return (
    <div className="flex flex-col gap-4 mt-4 items-center w-full">
      <div className="flex gap-2 w-full justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none"
          onClick={onNewGame}
        >
          New Game
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 focus:outline-none"
          onClick={onUndo}
          disabled={!canUndo}
        >
          Undo
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 focus:outline-none"
          onClick={onRedo}
          disabled={!canRedo}
        >
          Redo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-center w-full justify-center">
        <input
          className="border border-gray-300 rounded px-3 py-1 w-72 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          type="text"
          placeholder="Import FEN string"
          value={importFEN}
          onChange={e => {
            setImportFEN(e.target.value);
            setFenError(null);
          }}
          aria-label="Import FEN"
        />
        <button
          onClick={handleImport}
          className="px-3 py-1 bg-amber-400 border border-amber-500 text-gray-900 rounded shadow hover:bg-amber-500 hover:text-white"
        >
          Import FEN
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-400 rounded shadow hover:bg-blue-200 focus:outline-none"
          aria-label="Export current FEN to clipboard"
        >
          Export FEN
        </button>
      </div>
      <div className="min-h-[20px] w-full text-center">
        {/* Error or Help */}
        {fenError && <span className="text-red-500 text-sm">{fenError}</span>}
      </div>
      {/* Toast for feedback */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-2 rounded shadow-xl z-50 text-white ${toast.type === "success" ? "bg-amber-500" : "bg-red-600"
            }`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default GameControls;
