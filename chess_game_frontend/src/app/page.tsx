"use client";
import React, { useEffect, useState } from "react";
import ChessGame, { PIECE_UNICODE, type BoardArray, type Square, type Move } from "@/lib/chess";
import Chessboard from "@/components/Chessboard";
import GameControls from "@/components/GameControls";
import MoveList from "@/components/MoveList";
import StatusBar from "@/components/StatusBar";

// Type for move display in MoveList
type MoveListItem = {
  number: number;
  white?: string;
  black?: string;
};

function boardArrayToPieceMap(board: BoardArray) {
  // Map {square: Piece} for board rendering
  const map: Record<string, string> = {};
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      const sq = board[i][j];
      if (sq) {
        // Algebraic: files "a"..."h", ranks "1"..."8"
        const square = `${"abcdefgh"[j]}${8 - i}`;
        map[square] = PIECE_UNICODE[sq];
      }
    }
  }
  return map;
}

export default function Home() {
  // Chess state and chess engine logic
  const [chess, setChess] = useState(() => new ChessGame());
  const [board, setBoard] = useState<BoardArray>(chess.getBoard());
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [moveList, setMoveList] = useState<MoveListItem[]>([]);
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [undoStack, setUndoStack] = useState<ChessGame[]>([]);
  const [redoStack, setRedoStack] = useState<ChessGame[]>([]);
  const [status, setStatus] = useState(chess.status());

  // For repop/copy
  const gameSnapshot = (g: ChessGame) => {
    return new ChessGame(g.fen());
  };

  // Build piece map for rendering
  const pieceMap = boardArrayToPieceMap(board);

  // Build list of legal target squares (for highlighting UI)
  const legalTargetSquares: string[] = legalMoves.map((m) => m.to);

  // Compose move list display
  useEffect(() => {
    // Each pair of moves (white, black) grouped
    const moves = [];
    let moveNum = 1;
    for (let i = 0; i < moveHistory.length; i += 2) {
      moves.push({
        number: moveNum++,
        white: moveHistory[i]?.san,
        black: moveHistory[i + 1]?.san,
      });
    }
    setMoveList(moves);
  }, [moveHistory]);

  // Handle status updates
  useEffect(() => {
    setStatus(chess.status());
  }, [chess, board]);

  // Handle move selection and board click
  function handleSquareClick(square: Square) {
    // If nothing selected, select square if own piece
    if (!selected) {
      // Only select if current player piece on that square
      if (boardSquareHasTurnPiece(square)) {
        setSelected(square);
        setLegalMoves(chess.moves(square));
      }
      return;
    }
    // If selecting the same square, deselect
    if (selected === square) {
      setSelected(null);
      setLegalMoves([]);
      return;
    }
    // If square is a legal destination, attempt move
    const candidateMove = legalMoves.find((m) => m.to === square);
    if (candidateMove) {
      doMove(candidateMove);
      setSelected(null);
      setLegalMoves([]);
      return;
    }
    // If clicking another of your own pieces, update selection
    if (boardSquareHasTurnPiece(square)) {
      setSelected(square);
      setLegalMoves(chess.moves(square));
      return;
    }
    // Otherwise reset selection
    setSelected(null);
    setLegalMoves([]);
  }

  // Helper: Does the current player own the piece at this square?
  function boardSquareHasTurnPiece(sq: Square) {
    const b = chess.getBoard();
    const files = "abcdefgh";
    const i = 7 - (parseInt(sq[1]) - 1);
    const j = files.indexOf(sq[0]);
    const sqPiece = b[i]?.[j];
    if (!sqPiece) return false;
    return (
      (chess.getTurn() === "w" && sqPiece[0] === "w") ||
      (chess.getTurn() === "b" && sqPiece[0] === "b")
    );
  }

  // Make a move and push onto undo stack
  function doMove(move: Move) {
    const before = gameSnapshot(chess);
    chess.move(move);
    setChess(chess);
    setBoard(chess.getBoard());
    setMoveHistory((prev) => [...prev, move]);
    setUndoStack((prev) => [...prev, before]);
    setRedoStack([]);
    setStatus(chess.status());
  }

  // On move list click: allow to jump to any previous ply
  function handleMoveClick(moveIndex: number) {
    // Each moveIndex is a ply (half-move), so load after that move
    const newChess = new ChessGame();
    for (let i = 0; i <= moveIndex; ++i) {
      newChess.move(moveHistory[i]);
    }
    setChess(newChess);
    setBoard(newChess.getBoard());
    setMoveHistory(moveHistory.slice(0, moveIndex + 1));
    setUndoStack((prev) => [...prev, chess]);
    setRedoStack([]);
    setSelected(null);
    setLegalMoves([]);
    setStatus(newChess.status());
  }

  // Undo last move
  function handleUndo() {
    if (moveHistory.length === 0 || undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setChess(last);
    setBoard(last.getBoard());
    setMoveHistory((prev) => prev.slice(0, -1));
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, chess]);
    setSelected(null);
    setLegalMoves([]);
    setStatus(last.status());
  }

  // Redo
  function handleRedo() {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setChess(next);
    setBoard(next.getBoard());
    setMoveHistory((prev) => [...prev, ...next.status().turn !== status.turn ? [] : []]);
    setUndoStack((prev) => [...prev, chess]);
    setRedoStack((prev) => prev.slice(0, -1));
    setSelected(null);
    setLegalMoves([]);
    setStatus(next.status());
  }

  // Restart
  function handleNewGame() {
    const g = new ChessGame();
    setChess(g);
    setBoard(g.getBoard());
    setMoveHistory([]);
    setUndoStack([]);
    setRedoStack([]);
    setSelected(null);
    setLegalMoves([]);
    setOrientation("white");
    setStatus(g.status());
  }

  // Reset board only (same as new game for now)
  function handleReset() {
    handleNewGame();
  }

  // Flip the board orientation
  function handleFlip() {
    setOrientation((o) => (o === "white" ? "black" : "white"));
  }

  // FEN import/export
  function handleExportFEN() {
    window.prompt("Current FEN:", chess.fen());
  }

  function handleImportFEN() {
    const fen = window.prompt("Paste FEN to load:");
    if (!fen) return;
    try {
      const g = new ChessGame(fen);
      setChess(g);
      setBoard(g.getBoard());
      setMoveHistory([]);
      setUndoStack([]);
      setRedoStack([]);
      setSelected(null);
      setLegalMoves([]);
      setStatus(g.status());
    } catch (e) {
      alert("Invalid FEN: " + String(e));
    }
  }

  // Build last move for highlighting UI
  const lastMove =
    moveHistory.length > 0
      ? { from: moveHistory[moveHistory.length - 1].from, to: moveHistory[moveHistory.length - 1].to }
      : null;

  // Status bar information
  let statusMessage = "";
  if (status.checkmate) statusMessage = "Checkmate!";
  else if (status.stalemate) statusMessage = "Stalemate.";
  else if (status.draw) statusMessage = "Draw" + (status.reason ? ` (${status.reason})` : "");
  else if (status.inCheck) statusMessage = "Check.";
  else statusMessage = "Your move.";

  return (
    <main className="flex flex-1 items-center justify-center py-8">
      <section className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch" aria-label="Chess game main section">
        {/* Chessboard and controls */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col transition-shadow duration-200">
            <Chessboard
              orientation={orientation}
              selectedSquare={selected}
              legalMoves={legalTargetSquares}
              lastMove={lastMove}
              pieces={pieceMap}
              onSquareClick={handleSquareClick}
            />
            <StatusBar
              currentPlayer={status.turn === "w" ? "White" : "Black"}
              statusMessage={statusMessage}
            />
          </div>
          <div className="w-full mt-5">
            <GameControls
              onNewGame={handleNewGame}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onReset={handleReset}
              onFlip={handleFlip}
              onImportFEN={handleImportFEN}
              onExportFEN={handleExportFEN}
            />
          </div>
        </div>
        {/* Move list */}
        <aside className="md:w-[260px] w-full bg-white rounded-xl shadow-lg p-3 flex flex-col justify-between transition-shadow duration-200">
          <h2 className="text-lg font-semibold text-blue-700 mb-2 ml-1 tracking-tight">Moves</h2>
          <MoveList
            moves={moveList}
            onMoveClick={handleMoveClick}
          />
        </aside>
      </section>
    </main>
  );
}
