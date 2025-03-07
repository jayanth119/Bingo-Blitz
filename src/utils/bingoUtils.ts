import { topics } from '../data/questions';

// Generate a random 5x5 bingo board
export const generateBingoBoard = () => {
  const board = [];
  const availableTopics = [...topics];
  
  // Shuffle topics
  for (let i = availableTopics.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableTopics[i], availableTopics[j]] = [availableTopics[j], availableTopics[i]];
  }
  
  // Create 25 cells with random topics and difficulties
  for (let i = 0; i < 25; i++) {
    const topicIndex = i % availableTopics.length;
    const topic = availableTopics[topicIndex];
    
    // Assign difficulty based on position (more difficult towards center)
    let difficulty: 'easy' | 'medium' | 'hard';
    const row = Math.floor(i / 5);
    const col = i % 5;
    
    // Center cell is always hard
    if (row === 2 && col === 2) {
      difficulty = 'hard';
    } 
    // Cells adjacent to center are medium or hard
    else if ((row >= 1 && row <= 3) && (col >= 1 && col <= 3)) {
      difficulty = Math.random() > 0.4 ? 'medium' : 'hard';
    } 
    // Edge cells are easy or medium
    else {
      difficulty = Math.random() > 0.6 ? 'easy' : 'medium';
    }
    
    board.push({ topic, difficulty });
  }
  
  return board;
};

// Check for bingo patterns (rows, columns, diagonals)
export const checkForBingo = (completedCells: number[]): number[][] => {
  const bingoLines: number[][] = [];
  
  // Check rows
  for (let row = 0; row < 5; row++) {
    const rowCells = [row*5, row*5+1, row*5+2, row*5+3, row*5+4];
    if (rowCells.every(cell => completedCells.includes(cell))) {
      bingoLines.push(rowCells);
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    const colCells = [col, col+5, col+10, col+15, col+20];
    if (colCells.every(cell => completedCells.includes(cell))) {
      bingoLines.push(colCells);
    }
  }
  
  // Check diagonals
  const diagonal1 = [0, 6, 12, 18, 24];
  if (diagonal1.every(cell => completedCells.includes(cell))) {
    bingoLines.push(diagonal1);
  }
  
  const diagonal2 = [4, 8, 12, 16, 20];
  if (diagonal2.every(cell => completedCells.includes(cell))) {
    bingoLines.push(diagonal2);
  }
  
  return bingoLines;
};