import React from "react";

// Minimal Move type for board rendering
export type Move = { from: string; to: string; san?: string };

interface ChessboardProps {
  fen: string;
  moves: Move[];
}

// PUBLIC_INTERFACE
/**
 * Chessboard component. Renders the board according to the given FEN and move list.
 */
const Chessboard: React.FC<ChessboardProps> = ({ fen }) => {
  return (
    <div className="w-[350px] h-[350px] bg-gray-200 rounded-lg shadow-md flex items-center justify-center relative">
      {/* Render chess pieces and squares here according to FEN */}
      <span className="text-4xl text-gray-400">Chessboard</span>
      <div className="absolute left-px bottom-px text-[10px] text-gray-400 select-text bg-white/50 px-1 py-0.5 rounded">
        {/* FEN preview for dev! */}
        {fen}
      </div>
    </div>
  );
};

export default Chessboard;
