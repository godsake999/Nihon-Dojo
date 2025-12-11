import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, AlertCircle, Clock, RotateCcw } from 'lucide-react';
import { EXAM_QUESTIONS } from '../constants';
import { ExamQuestion } from '../types';

interface ExamSimulatorProps {
  onAddXP: (amount: number) => void;
}

const QUESTIONS_PER_LEVEL = 10;

const ExamSimulator: React.FC<ExamSimulatorProps> = ({ onAddXP }) => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);

  const currentQ = activeQuestions[currentQIndex];

  const handleStart = () => {
    // Randomize and select questions
    const shuffled = [...EXAM_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, QUESTIONS_PER_LEVEL);
    setActiveQuestions(selected);

    setStarted(true);
    setFinished(false);
    setCurrentQIndex(0);
    setAnswers([]);
    setScore(0);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishExam(newAnswers, activeQuestions);
    }
  };

  const finishExam = (finalAnswers: number[], questions: ExamQuestion[]) => {
    let rawScore = 0;
    finalAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctIndex) {
        rawScore++;
      }
    });
    setScore(rawScore);
    onAddXP(rawScore * 20); // Big XP reward
    setFinished(true);
  };

  if (!started) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-dojo-bg text-center">
        <div className="bg-white p-6 rounded-full shadow-lg mb-6">
          <Clock size={48} className="text-dojo-indigo" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">JLPT N5 Mock Exam</h2>
        <p className="text-gray-500 mb-8 max-w-xs">
          Each level consists of {QUESTIONS_PER_LEVEL} random questions covering Grammar, Vocab, and Reading.
        </p>
        <button
          onClick={handleStart}
          className="w-full max-w-xs py-4 bg-dojo-red text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Play size={20} fill="currentColor" /> Start Level
        </button>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    return (
      <div className="h-full flex flex-col p-6 overflow-y-auto bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Level Complete!</h2>
          <p className="text-gray-500">Here is how you did.</p>
          <div className="mt-6 flex justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-dojo-indigo text-dojo-indigo text-3xl font-bold">
              {percentage}%
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {activeQuestions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className={`p-4 rounded-xl border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase opacity-50">{q.category}</span>
                  {isCorrect ? <Check size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-600" />}
                </div>
                <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                <div className="text-sm text-gray-600">
                  <p>Your answer: <span className={isCorrect ? 'font-bold' : 'line-through'}>{q.options[userAnswer]}</span></p>
                  {!isCorrect && <p className="text-green-700 font-bold">Correct: {q.options[q.correctIndex]}</p>}
                </div>
                <div className="mt-2 text-xs text-gray-500 italic bg-white/50 p-2 rounded">
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 mb-8"
        >
          <RotateCcw size={18} /> Try Another Level
        </button>
      </div>
    );
  }

  // Active Question View
  if (!currentQ) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col p-6 bg-slate-50">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div 
          className="bg-dojo-indigo h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQIndex + 1) / activeQuestions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase mb-4">
            {currentQ.category}
          </span>
          <h3 className="text-xl font-medium text-gray-800 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full p-4 text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:border-dojo-indigo hover:bg-indigo-50 transition-all font-medium text-gray-700"
            >
              <span className="inline-block w-6 font-bold text-indigo-300 mr-2">{idx + 1}.</span> 
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-4">
        Question {currentQIndex + 1} of {activeQuestions.length}
      </div>
    </div>
  );
};

export default ExamSimulator;