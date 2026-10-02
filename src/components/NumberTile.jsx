import React from 'react';

/**
 * NumberTile Component
 * Tactile physical 3D cardboard/wood styled number piece.
 */
export default function NumberTile({
  value,
  isSelected = false,
  isPlaced = false,
  onSelect,
  onDragStart,
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
}) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-base sm:w-12 sm:h-12 sm:text-lg',
    md: 'w-12 h-12 text-lg sm:w-16 sm:h-16 sm:text-2xl',
    lg: 'w-14 h-14 text-xl sm:w-20 sm:h-20 sm:text-3xl',
  }[size] || 'w-14 h-14 text-xl';

  const handleDragStart = (e) => {
    if (disabled) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({ value, from: isPlaced ? 'grid' : 'tray' }));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(value);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`number-tile ${sizeClasses} ${isPlaced ? 'in-grid animate-bounce-drop' : 'animate-pop-in'} ${
        isSelected ? 'selected' : ''
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      style={{
        fontSize: size === 'sm' ? '1.1rem' : size === 'md' ? '1.4rem' : '1.75rem',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Number tile ${value}`}
    >
      <span>{value}</span>
    </div>
  );
}
