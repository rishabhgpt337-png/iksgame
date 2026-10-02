import React from 'react';
import { ArrowLeft, RotateCcw, Clock, Footprints, Trophy } from 'lucide-react';
import { formatTime } from '../utils/time';

/**
 * GameHeader Component
 * Displays level info, target sum, timer, moves, and action buttons.
 */
export default function GameHeader({
  level,
  size,
  target,
  timer,
  moves,
  bestTime,
  onBack,
  onReset,
}) {
  return (
    <header className="w-full max-w-lg mx-auto flex flex-col gap-3.5 pt-4 pb-2 px-3">
      {/* Top row: Back button, Level title, Reset button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-action btn-secondary text-xs sm:text-sm py-2 px-3.5"
          title="Return to Level Selection"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>LEVELS</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-800">
            LEVEL {level}
          </h1>
          <p className="text-xs font-bold text-stone-600 tracking-wider">
            {size} × {size} MAGIC SQUARE
          </p>
        </div>

        <button
          onClick={onReset}
          className="btn-action btn-secondary text-xs sm:text-sm py-2 px-3.5"
          title="Reset puzzle board"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>

      {/* Target & Stats row */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {/* Magic Target Badge */}
        <div className="stat-pill border-amber-300 bg-amber-50/80 text-amber-900">
          <span>TARGET SUM:</span>
          <span className="value font-black text-amber-700 text-base">{target}</span>
        </div>

        {/* Timer */}
        <div className="stat-pill">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>TIME:</span>
          <span className="value">{formatTime(timer)}</span>
        </div>

        {/* Moves */}
        <div className="stat-pill">
          <Footprints className="w-3.5 h-3.5 text-stone-400" />
          <span>MOVES:</span>
          <span className="value">{moves}</span>
        </div>

        {/* Best Record */}
        {bestTime !== null && (
          <div className="stat-pill border-purple-200 bg-purple-50/60 text-purple-900">
            <Trophy className="w-3.5 h-3.5 text-purple-500" />
            <span>BEST:</span>
            <span className="value text-purple-700">{formatTime(bestTime)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
