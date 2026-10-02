import React, { useState, useEffect, useRef, useMemo } from 'react';
import GameHeader from '../components/GameHeader';
import MagicGrid from '../components/MagicGrid';
import NumberTray from '../components/NumberTray';
import SuccessModal from '../components/SuccessModal';
import { isMagicSquare, getLineStatus } from '../utils/magicSquare';
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
  const lineStatus = useMemo(() => {
    return getLineStatus(board, size, target);
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

  // Validation on board change
  useEffect(() => {
    // Only check if all cells are filled
    if (board.every((v) => v !== null)) {
      if (isMagicSquare(board, size, target)) {
        setIsWon(true);
        const wasNewBest = setBestTime(level, timer);
        setIsNewBest(wasNewBest);
        setBestTimeState(getBestTime(level));
      }
    }
  }, [board, size, target, level, timer]);

  // Handle number tile selection from tray
  const handleSelectNumber = (num) => {
    if (isWon) return;
    if (selectedNumber === num) {
      setSelectedNumber(null);
    } else {
      setSelectedNumber(num);
    }
  };

  // Handle cell click (tap-to-place / tap-to-remove)
  const handleCellClick = (cellIndex) => {
    if (isWon) return;
    const currentVal = board[cellIndex];

    if (selectedNumber !== null) {
      // Place selected number in this cell
      setBoard((prev) => {
        const next = [...prev];
        // If the selected number was already somewhere on the board, clear its old position
        const oldIndex = next.indexOf(selectedNumber);
        if (oldIndex !== -1) {
          next[oldIndex] = null;
        }
        next[cellIndex] = selectedNumber;
        return next;
      });
      setSelectedNumber(null);
      setMoves((m) => m + 1);
    } else if (currentVal !== null) {
      // Click placed number removes it back to tray
      setBoard((prev) => {
        const next = [...prev];
        next[cellIndex] = null;
        return next;
      });
      setMoves((m) => m + 1);
    }
  };

  // Handle drag-and-drop onto a grid cell
  const handleDropNumber = (value, targetIndex) => {
    if (isWon) return;

    setBoard((prev) => {
      const next = [...prev];
      const sourceIndex = next.indexOf(value);

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

    setSelectedNumber(null);
    setMoves((m) => m + 1);
  };

  // Remove tile from grid (e.g. click directly on tile)
  const handleRemoveFromGrid = (cellIndex) => {
    if (isWon) return;
    setBoard((prev) => {
      const next = [...prev];
      next[cellIndex] = null;
      return next;
    });
    setMoves((m) => m + 1);
  };

  // Reset current game
  const handleReset = () => {
    setBoard(Array(totalCells).fill(null));
    setSelectedNumber(null);
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
          lineStatus={lineStatus}
          selectedNumber={selectedNumber}
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
