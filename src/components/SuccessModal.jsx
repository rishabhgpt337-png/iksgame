import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, ArrowLeft, Star, Trophy, Sparkles } from 'lucide-react';
import { formatTime } from '../utils/time';

/**
 * SuccessModal Component
 * Celebratory modal when the player completes a magic square.
 */
export default function SuccessModal({
  level,
  time,
  moves,
  isNewBest,
  onPlayAgain,
  onNextLevel,
  onBackToLevels,
}) {
  useEffect(() => {
    // Fire confetti particles
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F59E0B', '#7C3AED', '#10B981', '#3B82F6', '#EC4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F59E0B', '#7C3AED', '#10B981', '#3B82F6', '#EC4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {/* Animated Trophy / Badge */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-600 shadow-lg animate-bounce-drop">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-1 flex items-center justify-center gap-2">
          MAGIC COMPLETE!
          <span>🎉</span>
        </h2>

        <p className="text-sm font-semibold text-stone-500 mb-4">
          All rows, columns, and diagonals match the target sum!
        </p>

        {/* New Best Time Badge */}
        {isNewBest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black tracking-wide uppercase mb-5 animate-pop-in">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-600" />
            NEW BEST TIME!
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Stats box */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-stone-100/80 rounded-2xl border border-stone-200 mb-6">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Time
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-800 font-mono mt-0.5">
              {formatTime(time)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Moves
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-800 font-mono mt-0.5">
              {moves}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="btn-action btn-secondary justify-center py-3"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          {level === 1 ? (
            <button
              onClick={onNextLevel}
              className="btn-action btn-primary justify-center py-3"
            >
              <span>NEXT LEVEL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onBackToLevels}
              className="btn-action btn-primary justify-center py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO LEVELS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
