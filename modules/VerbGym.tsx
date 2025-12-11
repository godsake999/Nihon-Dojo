import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { VERBS } from '../constants';
import { conjugate } from '../utils/conjugator';
import { Verb, ConjugationForm } from '../types';

interface VerbGymProps {
  onAddXP: (amount: number) => void;
}

const FORMS: { key: ConjugationForm; label: string }[] = [
  { key: 'te', label: 'Te-Form (Connective)' },
  { key: 'nai', label: 'Nai-Form (Negative)' },
  { key: 'ta', label: 'Ta-Form (Past)' },
  { key: 'masu', label: 'Masu-Form (Polite)' },
  { key: 'potential', label: 'Potential Form (Can do)' },
  { key: 'volitional', label: 'Volitional Form (Let\'s)' },
];

const VerbGym: React.FC<VerbGymProps> = ({ onAddXP }) => {
  const [currentVerb, setCurrentVerb] = useState<Verb>(VERBS[0]);
  const [targetForm, setTargetForm] = useState<ConjugationForm>('te');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'revealed'>('idle');
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const correctAnswer = useMemo(() => conjugate(currentVerb, targetForm), [currentVerb, targetForm]);

  const generateNewChallenge = () => {
    const randomVerb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const randomForm = FORMS[Math.floor(Math.random() * FORMS.length)].key;
    setCurrentVerb(randomVerb);
    setTargetForm(randomForm);
    setInput('');
    setStatus('idle');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const checkAnswer = () => {
    if (status === 'revealed') {
      generateNewChallenge();
      return;
    }

    const userVal = input.toLowerCase().trim();
    // Validate against both Romaji and Kana
    if (userVal === correctAnswer.romaji || userVal === correctAnswer.kana) {
      setStatus('correct');
      setStreak(p => p + 1);
      onAddXP(10 + (streak * 2)); // Bonus for streak
      setTimeout(generateNewChallenge, 2000);
    } else {
      setStatus('wrong');
      setStreak(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') checkAnswer();
  };

  const revealAnswer = () => {
    setInput(correctAnswer.romaji); // Fill with Romaji for readability
    setStatus('revealed'); // Mark as revealed so no points are given
    setStreak(0);
    inputRef.current?.focus();
  };

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center bg-dojo-bg">
      <div className="w-full max-w-sm mb-6 flex justify-between items-center text-sm text-gray-500 font-medium">
        <span>Streak: <span className="text-dojo-indigo font-bold">{streak} 🔥</span></span>
        <span>Verb Engine v1.2</span>
      </div>

      {/* Card */}
      <motion.div 
        layout
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600" />
        
        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold mb-4 uppercase tracking-wider">
          {FORMS.find(f => f.key === targetForm)?.label}
        </span>

        <h2 className="text-5xl font-bold text-gray-800 mb-2">{currentVerb.kanji}</h2>
        <p className="text-xl text-gray-500 mb-6 font-mono">{currentVerb.romaji} ({currentVerb.meaning})</p>

        <div className="w-full relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type Romaji or Hiragana..."
            className={`w-full p-4 text-center text-lg rounded-xl border-2 outline-none transition-all ${
              status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
              status === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' :
              status === 'revealed' ? 'border-yellow-400 bg-yellow-50 text-gray-700' :
              'border-gray-200 focus:border-dojo-indigo'
            }`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {status === 'correct' && (
            <CheckCircle className="absolute right-4 top-4 text-green-500 animate-bounce" />
          )}
          {status === 'wrong' && (
            <XCircle className="absolute right-4 top-4 text-red-500" />
          )}
        </div>

        <div className="flex gap-3 w-full">
          <button 
            onClick={revealAnswer}
            disabled={status === 'correct' || status === 'revealed'}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <HelpCircle size={20} /> Reveal
          </button>
          
          <button 
            onClick={checkAnswer}
            className="flex-1 py-3 rounded-xl bg-dojo-indigo text-white font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {status === 'revealed' ? 'Next' : 'Check'} <ArrowRight size={20} />
          </button>
        </div>

        {/* Feedback / Hint Area */}
        <div className="h-8 mt-4 flex items-center justify-center w-full">
            {status === 'wrong' && (
                <p className="text-red-500 font-bold animate-shake">Try again!</p>
            )}
             {status === 'correct' && (
                <div className="flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in">
                    <p className="text-green-600 font-bold text-lg">{correctAnswer.kana}</p>
                </div>
            )}
            {status === 'revealed' && (
                 <div className="flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in">
                    <p className="text-gray-500 text-xs uppercase font-bold">Answer</p>
                    <p className="text-gray-800 font-bold text-lg">{correctAnswer.kana}</p>
                </div>
            )}
        </div>
      </motion.div>

      <div className="mt-8 text-center opacity-50 text-xs max-w-xs">
        <p>Supports both Romaji (e.g., 'tabete') and Hiragana (e.g., 'たべて').</p>
      </div>
    </div>
  );
};

export default VerbGym;