"use client";
import React, { useEffect } from "react";

export interface StatusBarProps {
  currentPlayer: string;
  statusMessage: string;
  onStatusUpdate?: (msg: string) => void;
}

// PUBLIC_INTERFACE
/**
 * Display current player's turn and game status at the bottom of the board. Handles ARIA live region.
 */
const StatusBar: React.FC<StatusBarProps> = ({
  currentPlayer,
  statusMessage,
  onStatusUpdate,
}) => {
  useEffect(() => {
    if (onStatusUpdate) onStatusUpdate(statusMessage);
  }, [statusMessage, onStatusUpdate]);

  return (
    <div
      className="flex items-center justify-between mt-2 px-2 py-1 w-full text-sm rounded-md shadow bg-white border border-blue-200"
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
