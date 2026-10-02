import React from 'react';
import { ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { getBestTime } from '../utils/storage';
import { formatTime } from '../utils/time';

/**
 * LevelSelector Component
 * Start screen with Level 1 and Level 2 selection cards.
 */
export default function LevelSelector({ onSelectLevel }) {
  const bestTimeL1 = getBestTime(1);
  const bestTimeL2 = getBestTime(2);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-xl mx-auto w-full animate-fade-in">
      {/* Game Title & Subtitle */}
      <header className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold tracking-widest uppercase mb-4 animate-float">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          The Ancient Numerical Puzzle
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-800 mb-2">
          MAGIC MIND
        </h1>
        <p className="text-base sm:text-lg font-semibold text-stone-600">
          Can you solve the magic square?
        </p>
      </header>

      {/* Level Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-md">
        {/* LEVEL 1 CARD */}
        <div
          onClick={() => onSelectLevel(1)}
          className="level-card group"
          role="button"
          tabIndex={0}
          aria-label="Play Level 1: 3 by 3 Magic Square"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-black text-xl mb-3 shadow-inner">
            3×3
          </div>

          <h2 className="text-xl font-black text-stone-800 mb-1">
            LEVEL 1
          </h2>

          <p className="text-sm font-bold text-stone-600 mb-2">
            3 × 3 Grid
          </p>

          <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200 mb-4">
            Magic Sum: 15
          </div>

          {bestTimeL1 !== null && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Best: {formatTime(bestTimeL1)}</span>
            </div>
          )}

          <div className="play-btn">
            <span>PLAY</span>
            <ArrowRight className="w-4 h-4 arrow-icon transition-transform" />
          </div>
        </div>

        {/* LEVEL 2 CARD */}
        <div
          onClick={() => onSelectLevel(2)}
          className="level-card group"
          role="button"
          tabIndex={0}
          aria-label="Play Level 2: 4 by 4 Magic Square"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 font-black text-xl mb-3 shadow-inner">
            4×4
          </div>

          <h2 className="text-xl font-black text-stone-800 mb-1">
            LEVEL 2
          </h2>

          <p className="text-sm font-bold text-stone-600 mb-2">
            4 × 4 Grid
          </p>

          <div className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-bold text-xs border border-purple-200 mb-4">
            Magic Sum: 34
          </div>

          {bestTimeL2 !== null && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Best: {formatTime(bestTimeL2)}</span>
            </div>
          )}

          <div className="play-btn">
            <span>PLAY</span>
            <ArrowRight className="w-4 h-4 arrow-icon transition-transform" />
          </div>
        </div>
      </div>
    </main>
  );
}
