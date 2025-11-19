"use client";
import React from "react";

export type Move = {
  number: number;
  white?: string;
  black?: string;
};

export interface MoveListProps {
  moves: Move[];
  onMoveClick: (moveIndex: number) => void;
}

// PUBLIC_INTERFACE
/**
 * Displays a chess move list with move numbers and SAN strings. Touch/keyboard-friendly, accessible.
 */
const MoveList: React.FC<MoveListProps> = ({ moves, onMoveClick }) => {
  return (
    <ol
      className="flex-1 overflow-y-auto max-h-96 pl-2 pr-1"
      aria-label="Move list"
      tabIndex={0}
      role="list"
    >
      {moves.length === 0 && (
        <li className="text-gray-400 text-sm py-2">No moves yet.</li>
      )}
      {moves.map((mv, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between py-2 px-2 rounded hover:bg-blue-50 focus:bg-yellow-50 cursor-pointer transition-colors text-sm min-h-[44px]"
          tabIndex={0}
          onClick={() => onMoveClick(idx)}
          role="listitem"
          aria-label={`Jump to move ${mv.number}${mv.white ? `, White: ${mv.white}` : ""}${mv.black ? `, Black: ${mv.black}` : ""}`}
          style={{ touchAction: "manipulation", userSelect: "none" }}
        >
          <span className="min-w-[32px] font-medium text-gray-600 mr-2">
            {mv.number}.
          </span>
          <span className="text-blue-900 tracking-wide font-normal mr-2">
            {mv.white || "-"}
          </span>
          <span className="text-gray-600 tracking-wide font-normal">
            {mv.black || ""}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default MoveList;
