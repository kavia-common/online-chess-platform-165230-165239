"use client";
import React from "react";

// Types for Chessboard props
export interface ChessboardProps {
  orientation: "white" | "black";
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  pieces: Record<string, string>;
  onSquareClick: (square: string) => void;
}

// Helpers for chessboard rendering
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

function getSquareColor(fileIndex: number, rankIndex: number) {
  // Board: white at bottom left for white orientation, alternate for black
  return (fileIndex + rankIndex) % 2 === 0
    ? "bg-blue-100"
    : "bg-blue-300/60";
}

// PUBLIC_INTERFACE
/**
 * Chessboard component renders an 8x8 board shell with coordinate labels.
 */
const Chessboard: React.FC<ChessboardProps> = ({
  orientation,
  selectedSquare,
  legalMoves,
  lastMove,
  pieces,
  onSquareClick,
}) => {
  // Build coordinate ordering based on orientation
  const displayedRanks =
    orientation === "white" ? [...ranks].reverse() : [...ranks];
  const displayedFiles =
    orientation === "white" ? files : [...files].reverse();

  return (
    <div className="relative select-none" aria-label="Chessboard">
      <div
        className="grid grid-cols-8 grid-rows-8 gap-0 border-2 border-blue-400 rounded-lg shadow-inner overflow-hidden w-[min(80vw,384px)] h-[min(80vw,384px)] transition-all"
        role="grid"
      >
        {displayedRanks.map((rank, rowIdx) =>
          displayedFiles.map((file, colIdx) => {
            const square = `${file}${rank}`;
            const isSelected = selectedSquare === square;
            const isLegal = legalMoves.includes(square);
            const isFrom = lastMove?.from === square;
            const isTo = lastMove?.to === square;
            const pieceChar = pieces[square] || null;
            return (
              <button
                tabIndex={0}
                aria-label={`Square ${square}`}
                key={square}
                className={[
                  "w-full aspect-square relative group focus:z-10 outline-none",
                  getSquareColor(colIdx, rowIdx),
                  isSelected
                    ? "ring-2 ring-yellow-400 z-10"
                    : isTo
                    ? "ring-2 ring-amber-400"
                    : isFrom
                    ? "ring-2 ring-green-300"
                    : isLegal
                    ? "ring-2 ring-blue-200"
                    : "hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
                  "transition-shadow duration-100"
                ].join(" ")}
                onClick={() => onSquareClick(square)}
                style={{ fontFamily: "Geist, ui-sans-serif, sans-serif" }}
              >
                <span
                  className={[
                    "absolute inset-0 flex items-center justify-center text-2xl md:text-3xl select-none",
                    pieceChar ? "text-gray-900" : "text-transparent",
                  ].join(" ")}
                  role={pieceChar ? "img" : undefined}
                  aria-label={pieceChar ? `Chess piece ${pieceChar}` : undefined}
                >
                  {pieceChar}
                </span>
                {/* Legal move "bubble" */}
                {isLegal && !pieceChar && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-4 h-4 bg-blue-400/40 rounded-full"></span>
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
      {/* File labels (a-h) and rank labels (1-8) */}
      <div className="absolute top-2 left-2 flex flex-row gap-[44px] pointer-events-none">
        {displayedFiles.map((file) => (
          <span
            aria-hidden="true"
            key={file}
            className="text-xs text-gray-500 font-semibold"
            style={{ width: 40, textAlign: "center" }}
          >
            {file}
          </span>
        ))}
      </div>
      <div className="absolute bottom-2 right-2 flex flex-col gap-[44px] pointer-events-none">
        {displayedRanks.map((rank) => (
          <span
            aria-hidden="true"
            key={rank}
            className="text-xs text-gray-500 font-semibold"
            style={{ height: 40, textAlign: "right" }}
          >
            {rank}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Chessboard;
