import React, { useState, useEffect, useRef, useMemo } from 'react';
import GameHeader from '../components/GameHeader';
import MagicGrid from '../components/MagicGrid';
import NumberTray from '../components/NumberTray';
import SuccessModal from '../components/SuccessModal';
import { isMagicSquare, checkCompletedLines, getResetCellsForInvalidLine } from '../utils/magicSquare';
import { getBestTime, setBestTime } from '../utils/storage';

/**
 * Game Page Component
 * Handles game state, timers, moves, validation, drag & drop, and tap placement.
 */
export default function Game({ level, onBack, onNextLevel }) {
  const size = level === 1 ? 3 : 4;
  const target = level === 1 ? 15 : 34;
  const totalCells = size * size;

  // Board state: array of length size*size, holding numbers or null
  const [board, setBoard] = useState(() => Array(totalCells).fill(null));
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Track placement history (indices of cells) for intelligent auto-reset
  const [placementHistory, setPlacementHistory] = useState([]);

  // Feedback states
  const [shakingCells, setShakingCells] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const [bestTime, setBestTimeState] = useState(() => getBestTime(level));
  const timerRef = useRef(null);

  // Placed numbers set
  const placedNumbers = useMemo(() => {
    return board.filter((num) => num !== null);
  }, [board]);

  // Line completion status for live feedback
  const lineData = useMemo(() => {
    return checkCompletedLines(board, size, target);
  }, [board, size, target]);

  // Timer runner
  useEffect(() => {
    if (!isWon) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWon]);

  // Validation and Auto-reset logic on board change
  useEffect(() => {
    if (isWon || isLocked) return;

    // 1. Check if there are any invalid lines
    if (lineData.invalidLines && lineData.invalidLines.length > 0) {
      // Pick the first invalid line to shake and reset
      const invalidLine = lineData.invalidLines[0];

      // Mark cells for shaking and lock input
      setShakingCells(invalidLine.cells);
      setIsLocked(true);

      // Determine which cells to reset intelligently
      const cellsToReset = getResetCellsForInvalidLine(
        invalidLine,
        board,
        placementHistory,
        lineData.validLines
      );

      // Schedule reset after 700ms (animation duration)
      const shakeTimer = setTimeout(() => {
        setBoard((prev) => {
          const next = [...prev];
          for (const cellIdx of cellsToReset) {
            next[cellIdx] = null;
          }
          return next;
        });

        // Remove these cells from placement history
        setPlacementHistory((prev) => prev.filter((idx) => !cellsToReset.includes(idx)));

        setShakingCells([]);
        setIsLocked(false);
      }, 700);

      return () => clearTimeout(shakeTimer);
    }

    // 2. Win condition check
    if (board.every((v) => v !== null)) {
      if (isMagicSquare(board, size, target)) {
        setIsWon(true);
        const wasNewBest = setBestTime(level, timer);
        setIsNewBest(wasNewBest);
        setBestTimeState(getBestTime(level));
      }
    }
  }, [board, size, target, level, timer, isWon, isLocked, lineData, placementHistory]);

  const addPlacement = (newIndex, oldIndex = -1) => {
    setPlacementHistory((prev) => {
      let next = prev;
      if (oldIndex !== -1) next = next.filter((idx) => idx !== oldIndex);
      next = next.filter((idx) => idx !== newIndex); // remove if existing
      return [...next, newIndex];
    });
  };

  const removePlacement = (index) => {
    setPlacementHistory((prev) => prev.filter((idx) => idx !== index));
  };

  // Handle number tile selection from tray
  const handleSelectNumber = (num) => {
    if (isWon || isLocked) return;
    if (selectedNumber === num) {
      setSelectedNumber(null);
    } else {
      setSelectedNumber(num);
    }
  };

  // Handle cell click (tap-to-place / tap-to-remove)
  const handleCellClick = (cellIndex) => {
    if (isWon || isLocked) return;
    const currentVal = board[cellIndex];

    if (selectedNumber !== null) {
      // Place selected number in this cell
      const oldIndex = board.indexOf(selectedNumber);
      setBoard((prev) => {
        const next = [...prev];
        if (oldIndex !== -1) next[oldIndex] = null;
        next[cellIndex] = selectedNumber;
        return next;
      });
      addPlacement(cellIndex, oldIndex);
      setSelectedNumber(null);
      setMoves((m) => m + 1);
    } else if (currentVal !== null) {
      // Click placed number removes it back to tray
      setBoard((prev) => {
        const next = [...prev];
        next[cellIndex] = null;
        return next;
      });
      removePlacement(cellIndex);
      setMoves((m) => m + 1);
    }
  };

  // Handle drag-and-drop onto a grid cell
  const handleDropNumber = (value, targetIndex) => {
    if (isWon || isLocked) return;

    const sourceIndex = board.indexOf(value);

    setBoard((prev) => {
      const next = [...prev];
      if (sourceIndex !== -1) {
        // Tile was already on the board — swap positions
        const targetVal = next[targetIndex];
        next[sourceIndex] = targetVal;
        next[targetIndex] = value;
      } else {
        // Tile came from the tray
        next[targetIndex] = value;
      }
      return next;
    });

    // Update placement history
    if (sourceIndex !== -1) {
      // Swapping: sourceIndex gets targetIndex's original value (if any)
      const targetVal = board[targetIndex];
      if (targetVal !== null) {
        addPlacement(sourceIndex, targetIndex);
      } else {
        removePlacement(sourceIndex);
      }
    }
    addPlacement(targetIndex, sourceIndex);

    setSelectedNumber(null);
    setMoves((m) => m + 1);
  };

  // Remove tile from grid (e.g. click directly on tile)
  const handleRemoveFromGrid = (cellIndex) => {
    if (isWon || isLocked) return;
    setBoard((prev) => {
      const next = [...prev];
      next[cellIndex] = null;
      return next;
    });
    removePlacement(cellIndex);
    setMoves((m) => m + 1);
  };

  // Reset current game
  const handleReset = () => {
    setBoard(Array(totalCells).fill(null));
    setSelectedNumber(null);
    setPlacementHistory([]);
    setShakingCells([]);
    setIsLocked(false);
    setMoves(0);
    setTimer(0);
    setIsWon(false);
    setIsNewBest(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full pb-6 px-2 animate-fade-in">
      <div>
        <GameHeader
          level={level}
          size={size}
          target={target}
          timer={timer}
          moves={moves}
          bestTime={bestTime}
          onBack={onBack}
          onReset={handleReset}
        />

        <MagicGrid
          size={size}
          target={target}
          board={board}
          lineData={lineData}
          shakingCells={shakingCells}
          selectedNumber={selectedNumber}
          isLocked={isLocked}
          onCellClick={handleCellClick}
          onDropNumber={handleDropNumber}
          onRemoveFromGrid={handleRemoveFromGrid}
        />
      </div>

      <NumberTray
        totalNumbers={totalCells}
        placedNumbers={placedNumbers}
        selectedNumber={selectedNumber}
        onSelectNumber={handleSelectNumber}
        onDragStart={(num) => setSelectedNumber(num)}
        gridSize={size}
        disabled={isLocked}
      />

      {/* Success Modal */}
      {isWon && (
        <SuccessModal
          level={level}
          time={timer}
          moves={moves}
          isNewBest={isNewBest}
          onPlayAgain={handleReset}
          onNextLevel={onNextLevel}
          onBackToLevels={onBack}
        />
      )}
    </div>
  );
}
