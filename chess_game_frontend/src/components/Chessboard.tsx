import React, { useEffect, useRef, useState } from "react";

// Define internal helpers for board
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
const pieceSymbols: { [k: string]: string } = {
  P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕", K: "♔",
  p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚"
};

export type Move = { from: string; to: string; san?: string; number?: number };

// PUBLIC_INTERFACE
interface ChessboardProps {
  fen: string;
  selected?: { row: number; col: number } | null;
  onSelectSquare?: (row: number, col: number) => void;
  onMovePiece?: (from: { row: number; col: number }, to: { row: number; col: number }) => void;
  legalMoves?: { row: number; col: number }[];
  lastMove?: { from: { row: number; col: number }; to: { row: number; col: number } } | null;
  statusMessage?: string;
}

/**
 * Chessboard component with accessibility: keyboard navigation, ARIA, responsive, proper contrast
 */
const Chessboard: React.FC<ChessboardProps> = ({
  fen,
  selected,
  onSelectSquare,
  onMovePiece,
  legalMoves = [],
  lastMove,
  statusMessage,
}) => {
  // FEN renderer: convert FEN string to 8x8 array
  function fenToBoard(fen: string): string[][] {
    const rows = fen.split(" ")[0].split("/");
    return rows.map(rowStr =>
      rowStr.replace(/\d/g, d => " ".repeat(Number(d)))
        .split("")
        .map(ch => (ch === " " ? "." : ch))
    );
  }

  const board = fenToBoard(fen);

  // Focus handling for keyboard navigation
  const cellRefs = useRef<Array<Array<HTMLButtonElement | null>>>(
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const [focus, setFocus] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    if (focus) {
      cellRefs.current[focus.row][focus.col]?.focus();
    }
  }, [focus]);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    row: number,
    col: number
  ) {
    const code = e.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code)) {
      e.preventDefault();
      let [newRow, newCol] = [row, col];
      if (code === "ArrowUp") newRow = Math.max(row - 1, 0);
      if (code === "ArrowDown") newRow = Math.min(row + 1, 7);
      if (code === "ArrowLeft") newCol = Math.max(col - 1, 0);
      if (code === "ArrowRight") newCol = Math.min(col + 1, 7);
      setFocus({ row: newRow, col: newCol });
    } else if (code === "Enter" || code === " " || code === "Spacebar") {
      e.preventDefault();
      if (!onSelectSquare) return;
      if (selected && onMovePiece) {
        onMovePiece(selected, { row, col });
      } else {
        onSelectSquare(row, col);
        setFocus({ row, col });
      }
    } else if (code === "Escape") {
      if (onSelectSquare) {
        onSelectSquare(-1, -1);
      }
    }
    // Tab is auto handled
  }

  // Responsive/touch target/tabs, ARIA roles
  function renderSquare(row: number, col: number) {
    const sqSelected = selected && selected.row === row && selected.col === col;
    const isLastFrom = lastMove && lastMove.from.row === row && lastMove.from.col === col;
    const isLastTo = lastMove && lastMove.to.row === row && lastMove.to.col === col;
    const isLegal = legalMoves.some(m => m.row === row && m.col === col);

    const isWhiteSquare = (row + col) % 2 === 1;
    const bgClass = isWhiteSquare ? "bg-white" : "bg-blue-200";
    const fgClass = isWhiteSquare ? "text-[#111827]" : "text-[#111827]";
    let borderRing = "";
    if (sqSelected) {
      borderRing = "ring-4 ring-secondary shadow-inner";
    } else if (isLastTo || isLastFrom) {
      borderRing = "ring-2 ring-primary";
    } else if (isLegal) {
      borderRing =
        "after:bg-secondary/70 after:rounded-full after:content-[''] after:w-[60%] after:h-[60%] after:absolute after:top-[20%] after:left-[20%]";
    }

    const touchPad =
      "min-w-[36px] min-h-[36px] sm:min-w-[48px] sm:min-h-[48px] md:min-w-[52px] md:min-h-[52px]";

    const coordName = `${files[col]}${ranks[row]}`;
    return (
      <button
        key={`${row}-${col}`}
        ref={(el) => (cellRefs.current[row][col] = el)}
        className={`aspect-square flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-chess relative select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-primary rounded ${bgClass} ${fgClass} ${borderRing} ${touchPad} transition-colors duration-150`}
        onClick={() => {
          if (!onSelectSquare) return;
          if (selected && onMovePiece) {
            onMovePiece(selected, { row, col });
          } else {
            onSelectSquare(row, col);
            setFocus({ row, col });
          }
        }}
        aria-label={`${
          board[row][col] !== "." ? pieceSymbols[board[row][col]] + " " : ""
        }${coordName}`}
        tabIndex={
          focus && focus.row === row && focus.col === col ? 0 : -1
        }
        onKeyDown={(e) => handleKeyDown(e, row, col)}
        aria-selected={sqSelected}
        aria-current={isLastTo ? "step" : undefined}
        aria-describedby={
          isLastTo
            ? "chessboard-move-status"
            : sqSelected
            ? "chessboard-select-status"
            : undefined
        }
        data-coord={`${row},${col}`}
        role="gridcell"
        style={{
          touchAction: "manipulation",
          userSelect: "none",
        }}
      >
        <span
          className={`pointer-events-none ${
            sqSelected ? "font-bold scale-110" : ""
          }`}
        >
          {board[row][col] !== "." && pieceSymbols[board[row][col]]}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="w-full max-w-[min(90vw,90vh)] mx-auto grid grid-cols-8 rounded-lg ring-2 ring-primary overflow-hidden shadow-lg chessboard-responsive mb-2"
        role="grid"
        aria-label="Chessboard"
        aria-describedby="chessboard-status"
        style={{
          aspectRatio: "1/1",
          maxHeight: "82vw",
        }}
      >
        {board.map((rowArr, rowIdx) =>
          rowArr.map((pc, colIdx) => renderSquare(rowIdx, colIdx))
        )}
      </div>
      <div
        id="chessboard-status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        tabIndex={-1}
      >
        {statusMessage}
      </div>
    </div>
  );
};

export default Chessboard;
