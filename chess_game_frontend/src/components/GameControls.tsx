import React, { useState, useEffect } from "react";
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
/**
 * GameControls: accessible game actions bar, FEN import/export with keyboard/touch support.
 */
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
    const err = validateFEN(importFEN.trim());
    if (err) {
      setFenError("Invalid FEN: " + err);
      setToast({ type: "error", msg: "Failed to import: Invalid FEN." });
      return;
    }
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

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(id);
    }
  }, [toast]);

  const btnBase =
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary rounded shadow min-w-[48px] min-h-[44px] px-4 py-2 text-base font-medium transition-colors duration-100 select-none";

  return (
    <div className="flex flex-col gap-4 mt-4 items-center w-full">
      <div className="flex gap-2 w-full justify-center flex-wrap" role="group" aria-label="Game controls">
        <button
          className={`${btnBase} bg-primary text-white hover:bg-primary/90`}
          onClick={onNewGame}
          tabIndex={0}
          type="button"
          aria-label="New game"
        >
          New Game
        </button>
        <button
          className={`${btnBase} bg-slate-200 text-[#2563EB] hover:bg-slate-300`}
          onClick={onUndo}
          disabled={!canUndo}
          tabIndex={0}
          type="button"
          aria-label="Undo"
        >
          Undo
        </button>
        <button
          className={`${btnBase} bg-slate-200 text-[#2563EB] hover:bg-slate-300`}
          onClick={onRedo}
          disabled={!canRedo}
          tabIndex={0}
          type="button"
          aria-label="Redo"
        >
          Redo
        </button>
        <button
          className={`${btnBase} bg-success text-[#111827] hover:bg-success/90`}
          onClick={handleExport}
          tabIndex={0}
          type="button"
          aria-label="Export current FEN to clipboard"
        >
          Export FEN
        </button>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleImport();
        }}
        className="flex flex-col sm:flex-row gap-2 items-center w-full justify-center"
        aria-label="Import FEN form"
        role="form"
      >
        <input
          className="border border-slate-300 rounded px-2 py-1 min-w-[120px] min-h-[44px] text-base"
          type="text"
          value={importFEN}
          placeholder="Paste FEN"
          onChange={e => {
            setImportFEN(e.target.value);
            setFenError(null);
          }}
          aria-label="Import FEN"
          tabIndex={0}
        />
        <button
          type="submit"
          className={`${btnBase} bg-secondary text-[#111827] hover:bg-secondary/90 px-3 py-1 min-h-[44px]`}
          tabIndex={0}
          aria-label="Import FEN"
        >
          Import FEN
        </button>
      </form>
      <div className="min-h-[20px] w-full text-center">
        {fenError && <span className="text-red-500 text-sm">{fenError}</span>}
      </div>
      {toast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-2 rounded shadow-xl z-50 text-white ${
            toast.type === "success" ? "bg-amber-500" : "bg-red-600"
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
