import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, CheckCircle, XCircle, Layers, Keyboard, RotateCw, ThumbsUp, ThumbsDown, List } from 'lucide-react';
import { VERBS } from '../constants';
import { conjugate } from '../utils/conjugator';
import { Verb, ConjugationForm } from '../types';

interface VerbGymProps {
  onAddXP: (amount: number) => void;
}

type GymMode = 'flashcard' | 'drill' | 'list';

const VerbGym: React.FC<VerbGymProps> = ({ onAddXP }) => {
  const [mode, setMode] = useState<GymMode>('drill');

  return (
    <div className="h-full flex flex-col items-center bg-dojo-bg">
       {/* Mode Toggle */}
       <div className="w-full max-w-sm px-6 pt-6 pb-2">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
          <button
            onClick={() => setMode('flashcard')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'flashcard' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Layers size={16} /> Flashcards
          </button>
          <button
            onClick={() => setMode('drill')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'drill' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Keyboard size={16} /> Input Drill
          </button>
          <button
            onClick={() => setMode('list')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'list' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <List size={16} /> List
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-sm p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === 'flashcard' ? (
            <VerbFlashcard key="flashcard" onAddXP={onAddXP} />
          ) : mode === 'drill' ? (
            <VerbDrill key="drill" onAddXP={onAddXP} />
          ) : (
            <VerbList key="list" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: FLASHCARD MODE
// ==========================================
const VerbFlashcard: React.FC<{ onAddXP: (n: number) => void }> = ({ onAddXP }) => {
  const [queue] = useState(VERBS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentVerb = queue[currentIndex % queue.length];

  const handleNext = (known: boolean) => {
    setDirection(known ? 1 : -1);
    
    setTimeout(() => {
      if (known) onAddXP(5);
      setIsFlipped(false);
      setDirection(0);
      setCurrentIndex(prev => (prev + 1) % queue.length);
    }, 200);
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  // Pre-calculate conjugations for the back of the card
  const formsToDisplay: ConjugationForm[] = ['masu', 'te', 'ta', 'nai', 'potential'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center w-full h-full"
    >
      <div className="relative w-full aspect-[3/4] perspective-1000">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, x: direction === 0 ? 0 : (direction * 50) }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: direction * 200 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative cursor-pointer group"
                onClick={flipCard}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT */}
                <motion.div 
                    className="absolute w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center backface-hidden border border-gray-200 overflow-hidden"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-dojo-indigo to-blue-500" />
                    
                    <span className={`absolute top-6 right-6 px-2 py-1 rounded text-xs font-bold uppercase ${
                      currentVerb.group === 'v1' ? 'bg-blue-100 text-blue-700' :
                      currentVerb.group === 'v2' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {currentVerb.group === 'v1' ? 'Godan' : currentVerb.group === 'v2' ? 'Ichidan' : 'Irregular'}
                    </span>

                    <h1 className="text-6xl font-black text-gray-800 mb-2">{currentVerb.kanji}</h1>
                    <p className="text-2xl text-gray-400 font-mono mb-6">{currentVerb.kana}</p>
                    
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <p className="text-gray-600 font-bold">{currentVerb.meaning}</p>
                    </div>

                    <p className="text-gray-300 text-xs mt-8 uppercase font-bold tracking-wider animate-pulse">Tap to see forms</p>
                </motion.div>

                {/* BACK */}
                <motion.div 
                    className="absolute w-full h-full bg-slate-800 rounded-3xl shadow-xl flex flex-col items-center pt-8 pb-4 px-6 text-white backface-hidden"
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: isFlipped ? 0 : 180 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <h3 className="text-xl font-bold mb-1">{currentVerb.kanji}</h3>
                    <p className="text-xs text-slate-400 mb-6 uppercase tracking-wider">{currentVerb.romaji} - Forms</p>

                    <div className="w-full space-y-2 overflow-y-auto no-scrollbar">
                      {formsToDisplay.map(form => {
                        const res = conjugate(currentVerb, form);
                        return (
                          <div key={form} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                             <span className="text-xs font-bold text-slate-400 uppercase w-20">{form}</span>
                             <div className="text-right">
                               <p className="font-bold text-sm">{res.kana}</p>
                               <p className="text-[10px] text-slate-500 font-mono">{res.romaji}</p>
                             </div>
                          </div>
                        );
                      })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-6 mt-8 w-full">
        <button 
            onClick={() => handleNext(false)}
            className="flex-1 bg-white text-dojo-red h-14 rounded-2xl shadow-lg flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all border border-red-100"
        >
            <ThumbsDown />
        </button>
        <button 
            onClick={flipCard}
            className="flex-1 bg-white text-gray-400 h-14 rounded-2xl shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
        >
            <RotateCw />
        </button>
        <button 
            onClick={() => handleNext(true)}
            className="flex-1 bg-dojo-indigo text-white h-14 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all"
        >
            <ThumbsUp />
        </button>
      </div>
    </motion.div>
  );
}

// ==========================================
// SUB-COMPONENT: DRILL MODE (Original Logic)
// ==========================================

const FORMS: { key: ConjugationForm; label: string }[] = [
  { key: 'te', label: 'Te-Form (Connective)' },
  { key: 'nai', label: 'Nai-Form (Negative)' },
  { key: 'ta', label: 'Ta-Form (Past)' },
  { key: 'masu', label: 'Masu-Form (Polite)' },
  { key: 'potential', label: 'Potential Form (Can do)' },
  { key: 'volitional', label: 'Volitional Form (Let\'s)' },
];

const VerbDrill: React.FC<{ onAddXP: (n: number) => void }> = ({ onAddXP }) => {
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
  
  // Initial load
  useEffect(() => {
    generateNewChallenge();
  }, []);

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
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center w-full"
    >
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
    </motion.div>
  );
};

export default VerbGym;

// ==========================================
// SUB-COMPONENT: LIST MODE
// ==========================================
const VerbList: React.FC = () => {
  return (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full h-full overflow-y-auto  pb-4"
    >
        <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-xl font-bold text-gray-800">Verb Collection</h2>
            <span className="text-xs font-bold text-gray-400 uppercase">{VERBS.length} Verbs</span>
        </div>
        
        <div className="space-y-3 pb-safe">
            {VERBS.map(verb => (
                <div key={verb.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-dojo-indigo transition-colors group">
                    <div>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-2xl font-black text-gray-800 leading-none">{verb.kanji}</span>
                            <span className="text-sm text-dojo-indigo font-bold">{verb.kana}</span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{verb.meaning}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            verb.group === 'v1' ? 'bg-blue-100 text-blue-600' :
                            verb.group === 'v2' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                            }`}>
                            {verb.group === 'v1' ? 'Godan' : verb.group === 'v2' ? 'Ichidan' : 'Irr.'}
                            </span>
                            <span className="text-xs text-gray-300 font-mono group-hover:text-dojo-indigo transition-colors">{verb.romaji}</span>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
  );
};