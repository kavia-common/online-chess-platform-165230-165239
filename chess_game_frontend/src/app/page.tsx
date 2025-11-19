"use client";
import Chessboard from "@/components/Chessboard";
import GameControls from "@/components/GameControls";
import MoveList from "@/components/MoveList";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center py-8">
      {/* Responsive wrapper: column on mobile, row on desktop */}
      <section
        className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch"
        aria-label="Chess game main section"
      >
        {/* Chessboard and controls - stacked vertically */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          {/* Chessboard area, fixed max width for best look */}
          <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col transition-shadow duration-200">
            <Chessboard
              orientation="white"
              selectedSquare={null}
              legalMoves={[]}
              lastMove={null}
              onSquareClick={() => {}}
            />
            <StatusBar
              currentPlayer="White"
              statusMessage="Ready to play!"
            />
          </div>
          <div className="w-full mt-5">
            <GameControls
              onNewGame={() => {}}
              onUndo={() => {}}
              onRedo={() => {}}
              onReset={() => {}}
              onFlip={() => {}}
              onImportFEN={() => {}}
              onExportFEN={() => {}}
            />
          </div>
        </div>
        {/* Move list - on right for desktop, below for mobile */}
        <aside className="md:w-[260px] w-full bg-white rounded-xl shadow-lg p-3 flex flex-col justify-between transition-shadow duration-200">
          <h2 className="text-lg font-semibold text-blue-700 mb-2 ml-1 tracking-tight">
            Moves
          </h2>
          <MoveList
            moves={[
              { number: 1, white: "e4", black: "e5" },
              { number: 2, white: "Nf3", black: "Nc6" },
              { number: 3, white: "Bb5", black: "a6" },
              { number: 4, white: "Ba4", black: "Nf6" },
              { number: 5, white: "O-O", black: "Be7" },
              // ...example data, will be replaced
            ]}
            onMoveClick={() => {}}
          />
        </aside>
      </section>
    </main>
  );
}
