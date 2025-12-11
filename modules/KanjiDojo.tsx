import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ThumbsUp, ThumbsDown, Keyboard, Layers, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { KANJI_DATA } from '../constants';
import { Flashcard } from '../types';

interface KanjiDojoProps {
  onAddXP: (amount: number) => void;
}

type DojoMode = 'flashcard' | 'drill';

const KanjiDojo: React.FC<KanjiDojoProps> = ({ onAddXP }) => {
  const [mode, setMode] = useState<DojoMode>('flashcard');

  return (
    <div className="h-full flex flex-col items-center bg-gradient-to-b from-slate-50 to-slate-200">
      
      {/* Mode Toggle */}
      <div className="w-full max-w-sm px-6 pt-6 pb-2">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
          <button
            onClick={() => setMode('flashcard')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'flashcard' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Layers size={16} /> Flashcards
          </button>
          <button
            onClick={() => setMode('drill')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'drill' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Keyboard size={16} /> Input Drill
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-sm p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === 'flashcard' ? (
            <FlashcardView key="flashcard" onAddXP={onAddXP} />
          ) : (
            <DrillView key="drill" onAddXP={onAddXP} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: FLASHCARD MODE
// ==========================================
const FlashcardView: React.FC<{ onAddXP: (n: number) => void }> = ({ onAddXP }) => {
  const [queue] = useState(KANJI_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 left, 1 right

  const currentCard = queue[currentIndex % queue.length];

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
                <motion.div 
                    className="absolute w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center backface-hidden border border-slate-200"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                     {/* Front */}
                    <span className="text-xs font-bold text-slate-400 absolute top-6 left-6">{currentCard.level}</span>
                    <h1 className="text-9xl font-black text-slate-800 mb-4">{currentCard.kanji}</h1>
                    <p className="text-slate-400 text-sm mt-8 animate-pulse">Tap to reveal</p>
                </motion.div>

                <motion.div 
                    className="absolute w-full h-full bg-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white backface-hidden px-8 text-center"
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: isFlipped ? 0 : 180 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Back */}
                    <div className="mb-6">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Meaning</p>
                        <h3 className="text-3xl font-bold">{currentCard.meaning}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <div className="bg-slate-700 p-3 rounded-lg">
                            <p className="text-[10px] text-slate-400 uppercase">Onyomi</p>
                            <p className="font-mono text-lg">{currentCard.readings.onyomi.join(', ')}</p>
                        </div>
                        <div className="bg-slate-700 p-3 rounded-lg">
                            <p className="text-[10px] text-slate-400 uppercase">Kunyomi</p>
                            <p className="font-mono text-lg">{currentCard.readings.kunyomi.join(', ')}</p>
                        </div>
                    </div>

                    <div className="w-full bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                        <p className="text-xs text-slate-400 mb-1">Example</p>
                        <p className="text-lg">{currentCard.example}</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-6 mt-8 w-full">
        <button 
            onClick={() => handleNext(false)}
            className="flex-1 bg-white text-red-500 h-14 rounded-2xl shadow-lg flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all border border-red-100"
        >
            <ThumbsDown />
        </button>
        <button 
            onClick={flipCard}
            className="flex-1 bg-white text-slate-400 h-14 rounded-2xl shadow-lg flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
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
// SUB-COMPONENT: DRILL MODE
// ==========================================
const DrillView: React.FC<{ onAddXP: (n: number) => void }> = ({ onAddXP }) => {
  const [card, setCard] = useState<Flashcard>(KANJI_DATA[0]);
  const [type, setType] = useState<'meaning' | 'reading'>('meaning');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const initDrill = () => {
    const randomCard = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
    const randomType = Math.random() > 0.5 ? 'meaning' : 'reading';
    setCard(randomCard);
    setType(randomType);
    setInput('');
    setStatus('idle');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Initialize on mount
  useEffect(() => {
    initDrill();
  }, []);

  const checkAnswer = () => {
    if (status !== 'idle') {
        if (status === 'wrong') initDrill();
        return;
    }

    const val = input.toLowerCase().trim();
    let isCorrect = false;

    if (type === 'meaning') {
        // Allow fuzzy match for meaning (e.g. "One" matches "one")
        // Split meanings by slash or comma
        const acceptedMeanings = card.meaning.toLowerCase().split(/[\/,]/).map(s => s.trim());
        isCorrect = acceptedMeanings.some(m => m === val);
    } else {
        // Reading check (Romaji)
        const readings = [
            ...card.readings.onyomi.map(r => r.toLowerCase()),
            ...card.readings.kunyomi.map(r => r.toLowerCase())
        ];
        isCorrect = readings.includes(val);
    }

    if (isCorrect) {
        setStatus('correct');
        setStreak(s => s + 1);
        onAddXP(10 + streak);
        setTimeout(initDrill, 1500);
    } else {
        setStatus('wrong');
        setStreak(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') checkAnswer();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full flex justify-between text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
        <span>Drill Mode</span>
        <span>Streak: <span className="text-dojo-indigo">{streak}</span></span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full p-8 flex flex-col items-center mb-6 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${type === 'meaning' ? 'bg-orange-400' : 'bg-dojo-indigo'}`} />
        
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${
            type === 'meaning' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'
        }`}>
            {type === 'meaning' ? 'Meaning' : 'Reading (Romaji)'}
        </span>

        <h1 className="text-8xl font-black text-slate-800 mb-8">{card.kanji}</h1>

        <div className="w-full relative">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={type === 'meaning' ? "e.g. Mountain" : "e.g. yama / san"}
                disabled={status === 'correct'}
                className={`w-full p-4 text-center text-lg rounded-xl border-2 outline-none transition-all ${
                    status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
                    status === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' :
                    'border-slate-200 focus:border-dojo-indigo'
                }`}
                autoComplete="off"
            />
             {status === 'correct' && (
                <CheckCircle className="absolute right-4 top-4 text-green-500 animate-bounce" />
            )}
            {status === 'wrong' && (
                <XCircle className="absolute right-4 top-4 text-red-500" />
            )}
        </div>

        {/* Feedback Area */}
        <div className="h-12 mt-4 flex items-center justify-center w-full">
            {status === 'wrong' && (
                 <div className="text-center animate-in slide-in-from-bottom-2 fade-in">
                    <p className="text-red-500 text-xs font-bold uppercase mb-1">Correct Answer</p>
                    <p className="text-slate-800 font-bold">
                        {type === 'meaning' ? card.meaning : [...card.readings.onyomi, ...card.readings.kunyomi].join(', ')}
                    </p>
                </div>
            )}
            {status === 'correct' && (
                <p className="text-green-600 font-bold text-lg">Correct! (+10 XP)</p>
            )}
        </div>
      </div>

      <button 
        onClick={checkAnswer}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
            status === 'wrong' 
                ? 'bg-slate-800 text-white hover:bg-slate-900' 
                : 'bg-dojo-indigo text-white hover:bg-indigo-700 shadow-indigo-200'
        }`}
      >
        {status === 'wrong' ? 'Next Kanji' : 'Check Answer'} <ArrowRight size={20} />
      </button>

    </motion.div>
  );
};

export default KanjiDojo;