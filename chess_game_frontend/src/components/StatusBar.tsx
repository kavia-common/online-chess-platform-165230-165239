"use client";
import React from "react";

export interface StatusBarProps {
  currentPlayer: string;
  statusMessage: string;
}

// PUBLIC_INTERFACE
/**
 * Display current player's turn and game status at the bottom of the board.
 */
const StatusBar: React.FC<StatusBarProps> = ({
  currentPlayer,
  statusMessage,
}) => {
  return (
    <div
      className="flex items-center justify-between mt-2 px-2 py-1 w-full text-sm rounded-md shadow bg-blue-50 border border-blue-100"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <span className="font-medium text-blue-800">
        {currentPlayer}&apos;s turn
      </span>
      <span className="text-gray-700">{statusMessage}</span>
    </div>
  );
};

export default StatusBar;
