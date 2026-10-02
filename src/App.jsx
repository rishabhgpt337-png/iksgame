import React, { useState } from 'react';
import LevelSelector from './components/LevelSelector';
import Game from './pages/Game';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(null); // null means start screen

  const handleSelectLevel = (level) => {
    setCurrentLevel(level);
  };

  const handleBackToLevels = () => {
    setCurrentLevel(null);
  };

  const handleNextLevel = () => {
    setCurrentLevel(2);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      {currentLevel === null ? (
        <LevelSelector onSelectLevel={handleSelectLevel} />
      ) : (
        <Game
          key={`level-${currentLevel}`} // Re-mount game on level change
          level={currentLevel}
          onBack={handleBackToLevels}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
}
