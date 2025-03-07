import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import {auth , db} from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';


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

const QuestionPanel: React.FC<QuestionPanelProps> = ({ question, onAnswer, timeLeft }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);


  const handleOptionSelect = async (index: number) => {
    if (selectedOption !== null || !user) return;
    setSelectedOption(index);
    
    const isCorrect = index === question.correctAnswer;
    
    const answerData = {
      id: question.id,
      topic: question.topic,
      text: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
      userSelectedOption: index,
      userId: user.uid,
    };
    
    try {
      await setDoc(doc(db, 'userAnswers', `${user.uid}_${question.id}`), answerData);
    } catch (error) {
      console.error('Error saving answer:', error);
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 3000);
  };

  const progressWidth = (timeLeft / 30) * 100;

  return (
    <div className="bg-indigo-700 rounded-lg p-6 shadow-lg">

        <>
          <div className="w-full bg-indigo-900 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500 text-xs font-medium px-2.5 py-0.5 rounded">{question.topic}</span>
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
        </>
      
    </div>
  );
};

export default QuestionPanel;
