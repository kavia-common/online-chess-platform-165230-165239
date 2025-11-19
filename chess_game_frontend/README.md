# Chess Game Frontend

This is a web-based chess app built with Next.js, offering a modern, accessible, and fully interactive chess playing experience. The application runs entirely client-side, but is designed for seamless future backend API integration. This README covers all supported features, usage instructions, workflow for FEN import/export, accessibility guidance, responsive behavior, and an overview of future backend/environment variables.

---

## Table of Contents

- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
  - [Starting a New Game](#starting-a-new-game)
  - [Making Moves](#making-moves)
  - [Undo & Redo](#undo--redo)
  - [Flipping the Board](#flipping-the-board-todo)
- [FEN Import/Export Workflow](#fen-importexport-workflow)
- [Accessibility Features](#accessibility-features)
- [Responsive & Mobile Support](#responsive--mobile-support)
- [Backend Integration & Environment Variables](#backend-integration--environment-variables)
- [Future Work & TODOs](#future-work--todos)

---

## Getting Started

Install dependencies and run the development server:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chessboard.

---

## How to Play

### Starting a New Game

- Click the **"New Game"** button in the control panel below the chessboard to reset to the standard chess start position (using FEN).

### Making Moves

- Click or tap a piece, then click or tap the destination square to make a move.
- You can use keyboard navigation (arrow keys, Tab, and Enter/Space) to select and move pieces:
  1. Use arrow keys to move the focus across squares.
  2. Press **Enter** or **Space** to select a piece and then choose the destination square.

### Undo & Redo

- **Undo**: Click the **"Undo"** button to take back the previous move.
- **Redo**: Click the **"Redo"** button to re-apply a move you just took back.
- Undo/redo works with all input types (mouse, touch, keyboard).

### Flipping the Board (TODO)

- **Note:** Flipping the board display (for Black player view) is a planned feature and will be available in a future version.

---

## FEN Import/Export Workflow

The app fully supports chess FEN (Forsyth-Edwards Notation) positioning.

### Exporting FEN

- Click the **"Export FEN"** button to copy the current position's FEN string to your clipboard.
- A confirmation appears once the FEN has been copied.

### Importing FEN

1. Paste a valid FEN string into the import box.
2. Click **"Import FEN"** or press Enter.
3. The board will update to the new position if the FEN is valid, with error messages for invalid input.

- The app validates and parses FEN with error-checking to ensure position correctness.
- FEN parsing is handled in [`src/lib/chess.ts`](./src/lib/chess.ts) using `validateFEN` and `parseFEN`.

---

## Accessibility Features

- **Keyboard Navigation:**  
  - The entire chessboard is keyboard navigable using arrow keys.
  - Use **Enter** or **Space** to select pieces and make moves.
  - **Escape** clears current selection.
- **Accessible Move List:**  
  - The move history list can be focused and navigated via keyboard.
  - Move list items have descriptive ARIA labels for move "jump to".
- **Status Updates:**  
  - Game status and current turn are displayed in a live ARIA region for assistive technologies.
  - Key status messages are exposed in screen-reader-only regions in [`StatusBar.tsx`](./src/components/StatusBar.tsx).

---

## Responsive & Mobile Support

- The app is fully responsive and touch-friendly:
  - The chessboard and controls resize dynamically to fit all devices, from mobile to desktop.
  - Touch targets are large for usability.
  - All controls work via touch, mouse, and keyboard.
  - Uses modern appearance with clean design and Ocean Professional theme.

---

## Backend Integration & Environment Variables

### Client-Side Execution (Current State)

- All state and game logic currently run **entirely in the browser** with no backend connection required.

### Environment Variables

The following environment variables are defined for the app, primarily to support future backend and API integration (see [`src/lib/api.ts`](./src/lib/api.ts)):

| Variable Name                | Description                                                    |
|------------------------------|----------------------------------------------------------------|
| NEXT_PUBLIC_API_BASE         | Base URL for direct API calls (used first if set)              |
| NEXT_PUBLIC_BACKEND_URL      | Fallback backend service URL                                   |
| NEXT_PUBLIC_FRONTEND_URL     | The URL of the deployed frontend (for CORS, etc.)              |
| NEXT_PUBLIC_WS_URL           | WebSocket base URL                                             |
| NEXT_PUBLIC_NODE_ENV         | Node/Next.js deployment environment (development/production)   |
| NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED | Disable Next.js telemetry                               |
| NEXT_PUBLIC_ENABLE_SOURCE_MAPS     | Enable JS source maps                                   |
| NEXT_PUBLIC_PORT                   | Server port                                              |
| NEXT_PUBLIC_TRUST_PROXY             | Trust upstream proxy for headers                        |
| NEXT_PUBLIC_LOG_LEVEL               | Log level for debugging                                 |
| NEXT_PUBLIC_HEALTHCHECK_PATH        | Health endpoint path (future)                           |
| NEXT_PUBLIC_FEATURE_FLAGS           | Feature flags (future)                                  |
| NEXT_PUBLIC_EXPERIMENTS_ENABLED     | Enables experimental features (future)                  |

> Variables such as `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_WS_URL`, and `NEXT_PUBLIC_FRONTEND_URL` are used in the [`src/lib/api.ts`](./src/lib/api.ts) utility, which currently provides **mock/stub** implementations for essential API actions (fetching game list, saving/loading game state, health checks).
> 
> When these APIs are not set, the app uses in-browser mocks; once integrated, simply configure your `.env` file and replace mock code with real endpoints.

#### Example for local `.env`

```
NEXT_PUBLIC_API_BASE=https://your-server/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend
NEXT_PUBLIC_WS_URL=wss://your-server/ws
```

---

## Future Work & TODOs

- **Backend endpoints:**  
  - Update [`src/lib/api.ts`](./src/lib/api.ts) to use real HTTP APIs and websocket connections once available.
  - Replace all `// TODO: Wire to backend` and `MOCK` code paths.
- **Flipping the Board:**  
  - Add UI option to flip the board for the black side.
- **Persistence & Login:**  
  - Integrate authentication and user accounts for tracking multiple games.
- **More Game Features:**  
  - Support for draw, resign, chess clocks, and advanced move highlighting.
- **Enhanced Accessibility:**  
  - Support for preferences (reduced motion, high contrast, etc.)
- **Spectator/Shared Play (WebSocket):**  
  - Enable real-time sharing and spectating with backend powered by `NEXT_PUBLIC_WS_URL`.

---

## Code Overview

See main components for reference:
- `src/components/Chessboard.tsx`: Board rendering, piece movement, keyboard interactions
- `src/components/GameControls.tsx`: Game actions; FEN import/export, undo/redo
- `src/components/MoveList.tsx`: Move history, navigation
- `src/components/StatusBar.tsx`: Game status, ARIA updates
- `src/lib/chess.ts`: Core chess logic, FEN utilities
- `src/lib/api.ts`: Stub API utility (mocked, ready for backend connection)

---

## License

This app is provided for demonstration and exploration. See `LICENSE` file for terms.

```
Task completed: Created a comprehensive README.md for the chess app frontend covering usage, features, FEN workflow, accessibility, responsiveness, environment variables, and backend stubs.
