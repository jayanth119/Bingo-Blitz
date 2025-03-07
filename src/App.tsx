import React, { useState, useEffect } from 'react';
import { Brain, Clock, Trophy, Github } from 'lucide-react';
import BingoBoard from './components/BingoBoard.tsx';
import QuestionPanel from './components/QuestionPanel.tsx';
import ScoreBoard from './components/ScoreBoard.tsx';
import { generateBingoBoard, checkForBingo } from './utils/bingoUtils.ts';
import { questions } from './data/questions.ts';

function App() {
  const [board, setBoard] = useState(generateBingoBoard());
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [completedCells, setCompletedCells] = useState<number[]>([]);
  const [bingoLines, setBingoLines] = useState<number[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setBoard(generateBingoBoard());
    setCompletedCells([]);
    setBingoLines([]);
    setScore(0);
  };

  // Handle cell selection
  const handleCellClick = (index: number) => {
    if (completedCells.includes(index) || currentQuestion) return;
    
    setSelectedCell(index);
    const cellTopic = board[index].topic;
    const availableQuestions = questions.filter(q => q.topic === cellTopic);
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setCurrentQuestion(randomQuestion);
    setTimeLeft(30); // 30 seconds per question
    
    // Start timer
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(newTimer);
  };

  // Handle answer submission
  const handleAnswer = (isCorrect: boolean) => {
    if (timer) clearInterval(timer);
    
    if (isCorrect && selectedCell !== null) {
      const newCompletedCells = [...completedCells, selectedCell];
      setCompletedCells(newCompletedCells);
      
      // Calculate score
      let pointsEarned = 10; // Base points
      
      // Add time bonus (up to 10 points)
      const timeBonus = Math.floor(timeLeft / 3);
      pointsEarned += timeBonus;
      
      // Check for bingo
      const newBingoLines = checkForBingo(newCompletedCells);
      if (newBingoLines.length > bingoLines.length) {
        // Bonus for each new bingo line
        pointsEarned += (newBingoLines.length - bingoLines.length) * 50;
        setBingoLines(newBingoLines);
      }
      
      setScore(prev => prev + pointsEarned);
    }
    
    // Reset question state
    setCurrentQuestion(null);
    setSelectedCell(null);
    setTimeLeft(0);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <header className="p-4 flex justify-between items-center border-b border-indigo-700">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8" />
          <h1 className="text-2xl font-bold">DSA Bingo Challenge</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors">
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {!gameStarted ? (
          <div className="max-w-2xl mx-auto bg-indigo-800 bg-opacity-50 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to DSA Bingo!</h2>
            <p className="mb-6">Test your Data Structures & Algorithms knowledge in this interactive game. Complete rows, columns, or diagonals to score bingo points!</p>
            <button 
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-indigo-800 bg-opacity-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Trophy size={20} />
                    Score: {score}
                  </h2>
                  {timeLeft > 0 && (
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Clock size={20} />
                      <span className="font-mono text-xl">{timeLeft}s</span>
                    </div>
                  )}
                </div>
                
                {currentQuestion ? (
                  <QuestionPanel 
                    question={currentQuestion} 
                    onAnswer={handleAnswer} 
                    timeLeft={timeLeft}
                  />
                ) : (
                  <BingoBoard 
                    board={board} 
                    completedCells={completedCells} 
                    onCellClick={handleCellClick}
                    bingoLines={bingoLines}
                  />
                )}
              </div>
            </div>
            
            <div>
              <ScoreBoard />
            </div>
          </div>
        )}
      </main>
      
      <footer className="p-4 text-center text-indigo-300 border-t border-indigo-700">
        <p>© 2025 DSA Bingo Challenge - Test your algorithm skills!</p>
      </footer>
    </div>
  );
}

export default App;