import React, { useState } from 'react';
import NumberTile from './NumberTile';

/**
 * MagicGrid Component
 * Physical puzzle board holding the NxN grid.
 */
export default function MagicGrid({
  size,
  target,
  board,
  lineStatus,
  selectedNumber,
  onCellClick,
  onDropNumber,
  onRemoveFromGrid,
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (data && typeof data.value === 'number') {
        onDropNumber(data.value, targetIndex);
      }
    } catch (err) {
      console.error('Failed to parse drag data', err);
    }
  };

  // Determine if a cell is part of a completed line
  const isCellInCompleteLine = (index) => {
    if (!lineStatus) return false;
    const r = Math.floor(index / size);
    const c = index % size;

    if (lineStatus.rows[r]) return true;
    if (lineStatus.cols[c]) return true;
    if (lineStatus.mainDiag && r === c) return true;
    if (lineStatus.antiDiag && r + c === size - 1) return true;

    return false;
  };

  const tileSize = size === 4 ? 'md' : 'lg';
  const cellDimension = size === 4
    ? { width: 'min(18vw, 68px)', height: 'min(18vw, 68px)' }
    : { width: 'min(24vw, 92px)', height: 'min(24vw, 92px)' };

  return (
    <div className="relative flex flex-col items-center justify-center my-3">
      {/* Visual board frame */}
      <div
        className="puzzle-board"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          maxWidth: size === 4 ? '360px' : '340px',
        }}
      >
        {board.map((cellValue, index) => {
          const isLineComplete = isCellInCompleteLine(index);
          const isOver = dragOverIndex === index;
          const isSelectedPlacementTarget = selectedNumber !== null && cellValue === null;

          return (
            <div
              key={index}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => onCellClick(index)}
              className={`board-cell ${isOver ? 'drag-over' : ''} ${
                isSelectedPlacementTarget ? 'selected-target' : ''
              } ${isLineComplete ? 'line-complete' : ''}`}
              style={cellDimension}
              title={cellValue ? `Placed: ${cellValue}. Click to return to tray.` : 'Empty cell'}
            >
              {cellValue !== null ? (
                <NumberTile
                  value={cellValue}
                  isPlaced={true}
                  onSelect={() => onRemoveFromGrid(index)}
                  onDragStart={() => {}}
                  size={tileSize}
                />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300/40 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle line completion status hints */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-stone-600">
        {lineStatus?.mainDiag && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pop-in">
            ✓ Main Diagonal = {target}
          </span>
        )}
        {lineStatus?.antiDiag && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pop-in">
            ✓ Anti Diagonal = {target}
          </span>
        )}
      </div>
    </div>
  );
}
