import React, { useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface QuestionPanelProps {
  question: {
    id: string;
    topic: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onAnswer: (isCorrect: boolean) => void;
  timeLeft: number;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({ 
  question, 
  onAnswer,
  timeLeft
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  // const [showExplanation, setShowExplanation] = useState(false);
  
  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    
    // Show explanation after selection
    // setShowExplanation(true);
    
    // Delay moving to next question
    setTimeout(() => {
      onAnswer(index === question.correctAnswer);
    }, 3000);
  };

  // Calculate progress bar width
  const progressWidth = (timeLeft / 30) * 100;
  
  return (
    <div className="bg-indigo-700 rounded-lg p-6 shadow-lg">
      {/* Timer bar */}
      <div className="w-full bg-indigo-900 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-indigo-500 text-xs font-medium px-2.5 py-0.5 rounded">
          {question.topic}
        </span>
        <div className="flex items-center text-yellow-300 text-sm">
          <Clock size={14} className="mr-1" />
          <span>{timeLeft}s remaining</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            disabled={selectedOption !== null}
            className={`
              w-full text-left p-3 rounded-lg transition-colors
              ${selectedOption === null 
                ? 'bg-indigo-600 hover:bg-indigo-500' 
                : selectedOption === index
                  ? index === question.correctAnswer
                    ? 'bg-green-600 border-2 border-green-400'
                    : 'bg-red-600 border-2 border-red-400'
                  : index === question.correctAnswer
                    ? 'bg-green-600 border-2 border-green-400'
                    : 'bg-indigo-600 opacity-70'
              }
            `}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
          </button>
        ))}
      </div>
      
      {/* {showExplanation && (
        <div className="bg-indigo-800 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-yellow-300 shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-300 mb-1">Explanation:</h4>
            <p className="text-sm">{question.explanation}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuestionPanel;