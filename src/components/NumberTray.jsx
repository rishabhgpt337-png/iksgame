import React from 'react';
import NumberTile from './NumberTile';

/**
 * NumberTray Component
 * Displays available number pieces in an organized, responsive bank.
 */
export default function NumberTray({
  totalNumbers,
  placedNumbers = [],
  selectedNumber,
  onSelectNumber,
  onDragStart,
  gridSize,
  disabled = false,
}) {
  const allNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
  const tileSize = gridSize === 4 ? 'md' : 'lg';

  // Responsive container width and grid columns
  const gridColsClass = gridSize === 4
    ? 'grid-cols-4 sm:grid-cols-8'
    : 'grid-cols-3 sm:grid-cols-9';

  return (
    <div className="w-full max-w-lg mx-auto mt-4 px-2">
      <div className="text-xs uppercase tracking-wider font-bold text-stone-600 mb-2.5 text-center">
        Available Numbers (Tap or Drag to Grid)
      </div>

      <div
        className={`grid ${gridColsClass} gap-2 sm:gap-3 p-3.5 bg-stone-200/50 rounded-2xl border-2 border-stone-300/80 justify-items-center`}
      >
        {allNumbers.map((num) => {
          const isPlaced = placedNumbers.includes(num);
          const isSelected = selectedNumber === num;

          const slotDimension = gridSize === 4
            ? { width: '44px', height: '44px' }
            : { width: '56px', height: '56px' };

          return (
            <div
              key={num}
              className="tray-slot flex items-center justify-center transition-all"
              style={slotDimension}
            >
              {!isPlaced && (
                <NumberTile
                  value={num}
                  isSelected={isSelected}
                  isPlaced={false}
                  onSelect={onSelectNumber}
                  onDragStart={onDragStart}
                  size={tileSize}
                  disabled={disabled}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
