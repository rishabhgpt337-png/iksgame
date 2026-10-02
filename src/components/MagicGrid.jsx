import React, { useState, useMemo } from 'react';
import NumberTile from './NumberTile';

/**
 * LineBadge Component
 * Shows live target sum progress, green check on success, or red cross on error.
 */
function LineBadge({ line, label, className = '' }) {
  if (!line) return null;
  const { sum, target, isCorrect, isWrong, isFilled } = line;

  let badgeStyle = 'bg-stone-200/70 text-stone-600 border border-stone-300/80';
  let content = `${sum || 0}`;

  if (isCorrect) {
    badgeStyle = 'bg-emerald-500 text-white border border-emerald-600 shadow-sm animate-pop-in font-bold';
    content = `${target} ✓`;
  } else if (isWrong) {
    badgeStyle = 'bg-rose-500 text-white border border-rose-600 shadow-sm font-bold animate-bounce';
    content = `${sum} ✕`;
  } else if (sum > 0) {
    badgeStyle = 'bg-amber-100/90 text-amber-900 border border-amber-300 font-medium';
    content = `${sum}`;
  }

  return (
    <div
      className={`inline-flex items-center justify-center text-xs font-mono px-2 py-0.5 rounded-full transition-all duration-200 ${badgeStyle} ${className}`}
      title={label ? `${label}: Sum ${sum}/${target}` : `Sum ${sum}/${target}`}
    >
      {label && <span className="mr-1 opacity-75 text-[10px] uppercase font-sans font-semibold">{label}</span>}
      <span>{content}</span>
    </div>
  );
}

/**
 * MagicGrid Component
 * Physical puzzle board with live row, column, and diagonal indicators,
 * plus shake animation feedback on invalid completed lines.
 */
export default function MagicGrid({
  size,
  target,
  board,
  lineData,
  shakingCells = [],
  selectedNumber,
  isLocked = false,
  onCellClick,
  onDropNumber,
  onRemoveFromGrid,
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragOver = (e, index) => {
    if (isLocked) return;
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
    if (isLocked) return;
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

  // Collect all cells that belong to completed correct lines
  const validCellSet = useMemo(() => {
    const set = new Set();
    if (lineData?.validLines) {
      for (const vLine of lineData.validLines) {
        for (const cellIdx of vLine.cells) {
          set.add(cellIdx);
        }
      }
    }
    return set;
  }, [lineData]);

  const shakingCellSet = useMemo(() => {
    return new Set(shakingCells);
  }, [shakingCells]);

  const tileSize = size === 4 ? 'md' : 'lg';
  const cellDimension = size === 4
    ? { width: 'min(17vw, 64px)', height: 'min(17vw, 64px)' }
    : { width: 'min(23vw, 86px)', height: 'min(23vw, 86px)' };

  const rows = lineData?.rows || [];
  const cols = lineData?.cols || [];
  const mainDiag = lineData?.mainDiag;
  const antiDiag = lineData?.antiDiag;

  return (
    <div className="relative flex flex-col items-center justify-center my-2 select-none">
      {/* Diagonals summary bar at top */}
      <div className="w-full max-w-sm mb-2.5 flex items-center justify-between px-3 py-1.5 bg-stone-100/80 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-stone-600">↘ Main:</span>
          <LineBadge line={mainDiag} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-stone-600">↙ Anti:</span>
          <LineBadge line={antiDiag} />
        </div>
      </div>

      {/* Grid container with board & row indicators */}
      <div className="flex items-center justify-center gap-2">
        {/* NxN Puzzle Board */}
        <div
          className="puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            padding: size === 4 ? '12px' : '16px',
            gap: size === 4 ? '8px' : '10px',
          }}
        >
          {board.map((cellValue, index) => {
            const isValid = validCellSet.has(index);
            const isShaking = shakingCellSet.has(index);
            const isOver = dragOverIndex === index;
            const isSelectedPlacementTarget = selectedNumber !== null && cellValue === null;

            return (
              <div
                key={index}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => !isLocked && onCellClick(index)}
                className={`board-cell ${isOver ? 'drag-over' : ''} ${
                  isSelectedPlacementTarget ? 'selected-target' : ''
                } ${isValid ? 'cell-valid' : ''} ${isShaking ? 'shake-line cell-invalid' : ''} ${
                  isLocked ? 'cursor-not-allowed' : ''
                }`}
                style={cellDimension}
                title={cellValue ? `Placed: ${cellValue}. Click to return to tray.` : 'Empty cell'}
              >
                {cellValue !== null ? (
                  <NumberTile
                    value={cellValue}
                    isPlaced={true}
                    onSelect={() => !isLocked && onRemoveFromGrid(index)}
                    onDragStart={() => {}}
                    size={tileSize}
                    disabled={isLocked}
                  />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300/50 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Row sum indicators (aligned on the right of each row) */}
        <div
          className="flex flex-col justify-around h-full py-1 gap-2"
          style={{
            height: size === 4 ? 'calc(min(17vw, 64px) * 4 + 48px)' : 'calc(min(23vw, 86px) * 3 + 48px)',
          }}
        >
          {rows.map((row, rIdx) => (
            <div key={`row-badge-${rIdx}`} className="flex items-center">
              <LineBadge line={row} className="min-w-[42px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Column sum indicators (under each column) */}
      <div
        className="grid gap-2 mt-2"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: size === 4 ? 'calc(min(17vw, 64px) * 4 + 40px)' : 'calc(min(23vw, 86px) * 3 + 44px)',
          paddingLeft: size === 4 ? '12px' : '16px',
          paddingRight: size === 4 ? '12px' : '16px',
        }}
      >
        {cols.map((col, cIdx) => (
          <div key={`col-badge-${cIdx}`} className="flex justify-center">
            <LineBadge line={col} className="min-w-[36px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
