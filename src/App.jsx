import React, { useState, useEffect } from 'react';
import { RotateCcw, Info, Skull } from 'lucide-react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerMoveHistory, setPlayerMoveHistory] = useState({ X: [], O: [] });
  const [showInfo, setShowInfo] = useState(false);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;


    const newHistory = { ...playerMoveHistory };
    newHistory[currentPlayer] = [...newHistory[currentPlayer], index];

    if (newHistory[currentPlayer].length === 4) {
      const firstMoveIndex = newHistory[currentPlayer][0];
      newBoard[firstMoveIndex] = null;
      newHistory[currentPlayer] = newHistory[currentPlayer].slice(1);
    }

    setBoard(newBoard);
    setPlayerMoveHistory(newHistory);


    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setPlayerMoveHistory({ X: [], O: [] });
  };

  const renderSquare = (index) => {
    const value = board[index];
    const isRecentMove = playerMoveHistory[value]?.includes(index);
    const isAboutToFade = value && playerMoveHistory[value]?.length === 3 && playerMoveHistory[value][0] === index;
    
    return (
      <button
        key={index}
        className={`w-20 h-20 border border-gray-600 text-3xl font-bold transition-all duration-500 
          ${value === 'X' ? 'text-red-400 shadow-red-500/25' : value === 'O' ? 'text-cyan-400 shadow-cyan-500/25' : 'text-gray-600'}
          ${!board[index] && !gameOver ? 'hover:bg-gray-800 hover:border-purple-500 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20' : 'cursor-default'}
          ${isRecentMove ? 'bg-gray-800 shadow-lg border-purple-500' : 'bg-black'}
          ${isAboutToFade ? 'animate-pulse border-red-500 shadow-lg shadow-red-500/30' : ''}
          ${value ? 'shadow-lg' : ''}
        `}
        onClick={() => handleClick(index)}
        disabled={gameOver || board[index]}
      >
        {value}
      </button>
    );
  };

  const getMoveCount = (player) => playerMoveHistory[player].length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl shadow-purple-900/20 border border-gray-700 p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Skull className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
              Shadow Tic-Tac-Toe
            </h1>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
          >
            <Info size={20} />
          </button>
        </div>

        {showInfo && (
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-purple-600/30 shadow-inner">
            <h3 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <Skull size={16} />
              Rules of the Shadow:
            </h3>
            <p className="text-sm text-gray-300">
              After every 4th move, your oldest mark fades into darkness! Only the strongest strategies survive in the shadows.
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1 mb-6 justify-center p-2 bg-gradient-to-br from-gray-800 to-black rounded-lg border border-gray-700">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(renderSquare)}
        </div>

        <div className="text-center mb-6 space-y-3">
          {!gameOver && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-600">
              <p className="text-lg font-semibold text-gray-200 mb-1">
                Current Shadow:
              </p>
              <span className={`text-2xl font-bold ${isXNext ? 'text-red-400' : 'text-cyan-400'}`}>
                {isXNext ? '✗' : '○'}
              </span>
            </div>
          )}
          
          {gameOver && (
            <div className="bg-gradient-to-r from-purple-900 to-red-900 p-4 rounded-lg border border-purple-500 shadow-lg shadow-purple-500/20">
              <p className="text-xl font-bold">
                {winner ? (
                  <span className={`${winner === 'X' ? 'text-red-400' : 'text-cyan-400'} drop-shadow-lg`}>
                    {winner === 'X' ? '✗' : '○'} Conquers the Shadows!
                  </span>
                ) : (
                  <span className="text-gray-300 drop-shadow-lg">
                    The Shadows Remain Balanced ⚖️
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6 p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-600">
          <div className="flex space-x-8">
            <div className="text-center">
              <p className="text-red-400 font-semibold text-lg flex items-center justify-center gap-1">
                <span>✗</span> Shadow Red
              </p>
              <p className="text-gray-400 text-sm">Marks: {getMoveCount('X')}/3</p>
              <div className="flex gap-1 mt-1 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < getMoveCount('X') ? 'bg-red-500' : 'bg-gray-700'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-cyan-400 font-semibold text-lg flex items-center justify-center gap-1">
                <span>○</span> Shadow Cyan
              </p>
              <p className="text-gray-400 text-sm">Marks: {getMoveCount('O')}/3</p>
              <div className="flex gap-1 mt-1 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < getMoveCount('O') ? 'bg-cyan-500' : 'bg-gray-700'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-purple-600 via-red-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold 
                   hover:from-purple-700 hover:via-red-700 hover:to-purple-700 transition-all duration-500 
                   flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 border border-purple-500/30
                   hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
        >
          <RotateCcw size={20} />
          <span>Summon New Shadows</span>
        </button>
      </div>
      

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;