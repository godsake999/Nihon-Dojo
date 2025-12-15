import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ThumbsUp, ThumbsDown, Keyboard, Layers, CheckCircle, XCircle, ArrowRight, List, ArrowRightLeft, Search } from 'lucide-react';
import { KANJI_DATA } from '../constants';
import { Flashcard } from '../types';

interface KanjiDojoProps {
  onAddXP: (amount: number) => void;
}

type DojoMode = 'flashcard' | 'drill' | 'list';
type DrillMode = 'input' | 'mc-meaning' | 'mc-reading';

const KanjiDojo: React.FC<KanjiDojoProps> = ({ onAddXP }) => {
  const [mode, setMode] = useState<DojoMode>('drill');
  const [drillMode, setDrillMode] = useState<DrillMode>('input');

  return (
    <div className="h-full flex flex-col items-center bg-gradient-to-b from-slate-50 to-slate-200">

      {/* Mode Toggle */}
      <div className="w-full max-w-sm px-6 pt-6 pb-2">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
          <button
            onClick={() => setMode('flashcard')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'flashcard' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            <Layers size={16} /> Flashcards
          </button>
          <button
            onClick={() => setMode('drill')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'drill' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            <Keyboard size={16} /> Drill
          </button>
          <button
            onClick={() => setMode('list')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'list' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            <List size={16} /> List
          </button>
        </div>

        {/* Drill Sub-navigation */}
        {mode === 'drill' && (
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex mt-2 h-10 animate-in slide-in-from-top-2 fade-in">
            <button
              onClick={() => setDrillMode('input')}
              className={`flex-1 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${drillMode === 'input' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              Input
            </button>
            <button
              onClick={() => setDrillMode('mc-meaning')}
              className={`flex-1 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${drillMode === 'mc-meaning' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              Meaning Quiz
            </button>
            <button
              onClick={() => setDrillMode('mc-reading')}
              className={`flex-1 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${drillMode === 'mc-reading' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              Reading Quiz
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 w-full max-w-sm p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === 'flashcard' ? (
            <FlashcardView key="flashcard" onAddXP={onAddXP} />
          ) : mode === 'drill' ? (
            drillMode === 'input' ? (
              <DrillView key="drill" onAddXP={onAddXP} />
            ) : drillMode === 'mc-meaning' ? (
              <KanjiMCQuiz key="mc-meaning" mode="meaning" onAddXP={onAddXP} />
            ) : (
              <KanjiMCQuiz key="mc-reading" mode="reading" onAddXP={onAddXP} />
            )
          ) : (
            <KanjiList key="list" />
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

        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${type === 'meaning' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'
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
            className={`w-full p-4 text-center text-lg rounded-xl border-2 outline-none transition-all ${status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
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
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${status === 'wrong'
          ? 'bg-slate-800 text-white hover:bg-slate-900'
          : 'bg-dojo-indigo text-white hover:bg-indigo-700 shadow-indigo-200'
          }`}
      >
        {status === 'wrong' ? 'Next Kanji' : 'Check Answer'} <ArrowRight size={20} />
      </button>

    </motion.div>
  );
};

// ==========================================
// SUB-COMPONENT: MULTIPLE CHOICE QUIZ
// ==========================================
const KanjiMCQuiz: React.FC<{ mode: 'meaning' | 'reading'; onAddXP: (n: number) => void }> = ({ mode, onAddXP }) => {
  const [current, setCurrent] = useState<Flashcard>(KANJI_DATA[0]);
  const [options, setOptions] = useState<Flashcard[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const correct = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
    // Get 3 random distractors
    const distractors: Flashcard[] = [];
    while (distractors.length < 3) {
      const rand = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
      if (rand.id !== correct.id && !distractors.find(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }
    // Shuffle options
    const allOptions = [...distractors, correct].sort(() => Math.random() - 0.5);

    setCurrent(correct);
    setOptions(allOptions);
    setSelectedId(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [mode]);

  const handleSelect = (option: Flashcard) => {
    if (selectedId !== null) return; // Prevent double guess

    setSelectedId(option.id);
    const correct = option.id === current.id;
    setIsCorrect(correct);

    if (correct) {
      setStreak(s => s + 1);
      onAddXP(10);
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setStreak(0);
    }
  };

  return (
    <motion.div
      key={mode} // Reset state on mode switch
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center w-full"
    >
      <div className="w-full max-w-sm mb-6 flex justify-between items-center text-sm text-slate-400 font-bold tracking-wider uppercase">
        <span>{mode === 'meaning' ? 'Kanji -> Meaning' : 'Kanji -> Reading'}</span>
        <span>Streak: <span className="text-dojo-indigo">{streak}</span></span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-dojo-indigo to-purple-600" />

        <h2 className="text-8xl font-black text-slate-800 mb-2 mt-4 text-center">
          {current.kanji}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {options.map(option => {
          const isSelected = selectedId === option.id;
          const isTarget = option.id === current.id;

          // Determine button style based on state
          let btnClass = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";
          if (selectedId !== null) {
            if (isTarget) btnClass = "bg-green-100 border-green-500 text-green-800 font-bold shadow-sm";
            else if (isSelected && !isTarget) btnClass = "bg-red-100 border-red-500 text-red-800 shadow-sm";
            else btnClass = "opacity-50 bg-slate-50 border-slate-100";
          }

          // Display content based on mode
          const displayText = mode === 'meaning'
            ? option.meaning
            : [...option.readings.onyomi, ...option.readings.kunyomi].join(', ');

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selectedId !== null}
              className={`p-4 rounded-xl border-2 text-left transition-all ${btnClass} flex justify-between items-center`}
            >
              <span className="font-bold truncate">{displayText}</span>
              {selectedId !== null && isTarget && <CheckCircle size={20} className="text-green-600 flex-shrink-0 ml-2" />}
              {isSelected && !isTarget && <XCircle size={20} className="text-red-600 flex-shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      {selectedId !== null && !isCorrect && (
        <button
          onClick={generateQuestion}
          className="mt-6 text-slate-400 font-bold hover:text-dojo-indigo flex items-center gap-2"
        >
          Next Question <ArrowRight size={16} />
        </button>
      )}

    </motion.div>
  );
};

export default KanjiDojo;

// ==========================================
// SUB-COMPONENT: LIST MODE (Categorized)
// ==========================================
const KanjiList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to find kanji by characters for grouping
  const findK = (k: string) => KANJI_DATA.find(d => d.kanji === k);

  const GROUPS = [
    {
      title: "Opposites & Directions",
      desc: "Fundamental pairs to master together",
      pairs: [
        [findK("上"), findK("下")], // Up / Down
        [findK("左"), findK("右")], // Left / Right
        [findK("前"), findK("後")], // Front / Back
        [findK("中"), findK("外")], // Inside / Outside
        [findK("東"), findK("西")], // East / West
        [findK("南"), findK("北")], // South / North
      ]
    },
    {
      title: "Adjectives (Antonyms)",
      desc: "Descriptive words with their opposites",
      pairs: [
        [findK("大"), findK("小")], // Big / Small
        [findK("高"), findK("安")], // High / Cheap (Safe)
        [findK("新"), findK("古")], // New / Old
        [findK("多"), findK("少")], // Many / Few
        [findK("長"), findK("短")], // Long / Short
        [findK("白"), findK("黒")], // White / Black (Colors)
      ]
    },
    {
      title: "People & Family",
      desc: "Relationships and roles",
      pairs: [
        [findK("父"), findK("母")], // Father / Mother
        [findK("男"), findK("女")], // Man / Woman
        [findK("人"), findK("子")], // Person / Child
        [findK("友"), findK("学")], // Friend / Study (Student context)
      ]
    },
    {
      title: "Actions (Verbs)",
      desc: "Complementary actions",
      pairs: [
        [findK("行"), findK("来")], // Go / Come
        [findK("出"), findK("入")], // Exit / Enter
        [findK("食"), findK("飲")], // Eat / Drink
        [findK("見"), findK("聞")], // See / Hear
        [findK("読"), findK("書")], // Read / Write
        [findK("買"), findK("売")], // Buy / Sell (Sell missing in N5 list? Check 'Bai')
        // Correction: 'Bai' (Buy) is there, 'Sell' (Bai) might not be in N5 Kanji set usually.
        // Let's check safely.
      ]
    },
    {
      title: "Nature & Elements",
      desc: "The world around us",
      pairs: [
        [findK("山"), findK("川")], // Mountain / River
        [findK("日"), findK("月")], // Sun / Moon
        [findK("天"), findK("気")], // Sky / Spirit (Weather)
        [findK("雨"), findK("雪")], // Rain / Snow
      ]
    }
  ];

  // Calculate used IDs to find remainders
  const usedIds = new Set<number>();
  GROUPS.forEach(g => {
    g.pairs.forEach(p => {
      if (p[0]) usedIds.add(p[0].id);
      if (p[1]) usedIds.add(p[1].id);
    })
  });

  // Add numbers 1-10 to used items (IDs 1-10 based on standard list, or find them)
  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"].forEach(n => {
    const k = findK(n);
    if (k) usedIds.add(k.id);
  });

  const remainder = KANJI_DATA.filter(k => !usedIds.has(k.id)).sort((a, b) => a.level.localeCompare(b.level) || a.id - b.id);

  // Search Logic
  const filteredKanji = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return KANJI_DATA.filter(k =>
      k.kanji.includes(query) ||
      k.meaning.toLowerCase().includes(query) ||
      k.readings.onyomi.some(r => r.toLowerCase().includes(query)) ||
      k.readings.kunyomi.some(r => r.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Logic to handle remaining items or safe rendering
  const renderCard = (k: Flashcard | undefined) => {
    if (!k) return <div className="flex-1 bg-gray-50 rounded-xl" />;
    return (
      <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 hover:border-dojo-indigo transition-colors min-w-0">
        <div className="flex justify-between items-start">
          <span className="text-3xl font-black text-slate-800">{k.kanji}</span>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{k.level}</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-800 truncate">{k.meaning}</p>
          <p className="text-xs text-slate-400 truncate">{k.readings.onyomi[0] || k.readings.kunyomi[0]}</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full overflow-y-auto pb-4"
    >
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Concept Map</h2>
          <p className="text-xs text-gray-400">Master Kanji through connections.</p>
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase">{KANJI_DATA.length} Characters</span>
      </div>

      {/* Search Bar */}
      <div className="px-2 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search kanji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-dojo-indigo outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 pb-safe">
        {searchQuery ? (
          // Search Results
          <section className="px-2">
            <h3 className="font-bold text-dojo-indigo mb-2 flex items-center gap-2">
              Search Results
              <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">{filteredKanji.length}</span>
            </h3>
            {filteredKanji.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredKanji.map(k => (
                  <div key={k.id} className="w-full">
                    {renderCard(k)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No kanji found matching "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {GROUPS.map((group, sectionIdx) => (
              <section key={sectionIdx} className="space-y-3">
                <div className="px-2">
                  <h3 className="font-bold text-dojo-indigo flex items-center gap-2">
                    {group.title}
                  </h3>
                  <p className="text-xs text-gray-400">{group.desc}</p>
                </div>

                <div className="grid gap-3 px-2">
                  {group.pairs.map((pair, rowIdx) => {
                    const [left, right] = pair;
                    // Skip if neither exists (safety)
                    if (!left && !right) return null;

                    return (
                      <div key={rowIdx} className="flex items-center gap-3">
                        {renderCard(left)}
                        <div className="flex flex-col items-center justify-center text-gray-300">
                          <ArrowRightLeft size={16} />
                        </div>
                        {renderCard(right)}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Catch-all for basic Numbers (1-10) as a simple grid since they are a sequence, not pairs */}
            <section className="space-y-3 px-2">
              <h3 className="font-bold text-dojo-indigo">Numbers (1-10)</h3>
              <div className="grid grid-cols-5 gap-2">
                {["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"].map(num => {
                  const k = findK(num);
                  if (!k) return null;
                  return (
                    <div key={num} className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                      <span className="text-xl font-black text-slate-800">{k.kanji}</span>
                      <span className="text-[10px] text-gray-400">{k.meaning}</span>
                    </div>
                  )
                })}
              </div>
            </section>
            {/* Remainder Section */}
            <section className="space-y-3">
              <div className="px-2 pt-4 border-t border-slate-200">
                <h3 className="font-bold text-slate-600">Additional Kanji</h3>
                <p className="text-xs text-gray-400">Expanding vocabulary.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 px-2">
                {remainder.map(k => (
                  <div key={k.id} className="w-full">
                    {renderCard(k)}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </motion.div>
  );
};