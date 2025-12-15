import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, CheckCircle, XCircle, Layers, Keyboard, RotateCw, ThumbsUp, ThumbsDown, List, ArrowRightLeft, Search } from 'lucide-react';
import { VERBS } from '../constants';
import { conjugate } from '../utils/conjugator';
import { Verb, ConjugationForm } from '../types';

interface VerbGymProps {
  onAddXP: (amount: number) => void;
}

type GymMode = 'flashcard' | 'drill' | 'list';
type DrillMode = 'input' | 'mc-meaning' | 'mc-reading';

const VerbGym: React.FC<VerbGymProps> = ({ onAddXP }) => {
  const [mode, setMode] = useState<GymMode>('drill');
  const [drillMode, setDrillMode] = useState<DrillMode>('input');

  return (
    <div className="h-full flex flex-col items-center bg-dojo-bg">
      {/* Mode Toggle */}
      <div className="w-full max-w-sm px-6 pt-6 pb-2">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
          <button
            onClick={() => setMode('flashcard')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'flashcard' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Layers size={16} /> Flashcards
          </button>
          <button
            onClick={() => setMode('drill')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'drill' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Keyboard size={16} /> Drill
          </button>
          <button
            onClick={() => setMode('list')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'list' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <List size={16} /> List
          </button>
        </div>

        {/* Drill Sub-navigation */}
        {mode === 'drill' && (
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex mt-2 h-10 animate-in slide-in-from-top-2 fade-in">
            <button
              onClick={() => setDrillMode('input')}
              className={`flex-1 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${drillMode === 'input' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Input
            </button>
            <button
              onClick={() => setDrillMode('mc-meaning')}
              className={`flex-1 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${drillMode === 'mc-meaning' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Kanji Quiz
            </button>
            <button
              onClick={() => setDrillMode('mc-reading')}
              className={`flex-1 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${drillMode === 'mc-reading' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
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
            <VerbFlashcard key="flashcard" onAddXP={onAddXP} />
          ) : mode === 'drill' ? (
            drillMode === 'input' ? (
              <VerbDrill key="drill" onAddXP={onAddXP} />
            ) : drillMode === 'mc-meaning' ? (
              <VerbMCQuiz key="mc-meaning" mode="meaning" onAddXP={onAddXP} />
            ) : (
              <VerbMCQuiz key="mc-reading" mode="reading" onAddXP={onAddXP} />
            )
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

              <span className={`absolute top-6 right-6 px-2 py-1 rounded text-xs font-bold uppercase ${currentVerb.group === 'v1' ? 'bg-blue-100 text-blue-700' :
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
            className={`w-full p-4 text-center text-lg rounded-xl border-2 outline-none transition-all ${status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
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
// ==========================================
// SUB-COMPONENT: LIST MODE (Categorized)
// ==========================================
const VerbList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Refined helper using ID for precision where needed, or Kanji
  const findVByKanji = (k: string) => VERBS.find(v => v.kanji === k);

  const SAFE_GROUPS = [
    {
      title: "Motion & Direction",
      desc: "Movement through space",
      pairs: [
        [findVByKanji("行く"), findVByKanji("来る")],
        [findVByKanji("入る"), findVByKanji("出る")],
        [findVByKanji("乗る"), findVByKanji("降りる")],
        [findVByKanji("立つ"), findVByKanji("座る")],
        [findVByKanji("帰る"), findVByKanji("歩く")],
        [findVByKanji("登る"), null]
      ]
    },
    {
      title: "Daily Routine",
      desc: "Morning to night",
      pairs: [
        [findVByKanji("起きる"), findVByKanji("寝る")],
        [findVByKanji("食べる"), findVByKanji("飲む")],
        [findVByKanji("着る"), findVByKanji("脱ぐ")],
        [findVByKanji("始める"), findVByKanji("終わる")],
        [findVByKanji("開ける"), findVByKanji("閉める")],
        [findVByKanji("つける"), findVByKanji("消す")],
      ]
    },
    {
      title: "Social & Transactions",
      desc: "Interacting with others",
      pairs: [
        [findVByKanji("買う"), findVByKanji("売る")],
        [findVByKanji("貸す"), findVByKanji("借りる")],
        [findVByKanji("教える"), findVByKanji("習う")],
        [findVByKanji("話す"), findVByKanji("聞く")],
        [findVByKanji("読む"), findVByKanji("書く")],
        [findVByKanji("会う"), findVByKanji("遊ぶ")],
      ]
    },
    {
      title: "Actions with Objects",
      desc: "Using and moving things",
      pairs: [
        [findVByKanji("取る"), findVByKanji("置く")],
        [findVByKanji("持つ"), findVByKanji("使う")],
        [findVByKanji("切る"), findVByKanji("作る")],
        [findVByKanji("洗う"), null],
        [findVByKanji("待つ"), null]
      ]
    }
  ];

  // Calculate used IDs to find remainders
  const usedIds = new Set<number>();
  SAFE_GROUPS.forEach(g => {
    g.pairs.forEach(p => {
      if (p[0]) usedIds.add(p[0].id);
      if (p[1]) usedIds.add(p[1].id);
    })
  });

  const remainder = VERBS.filter(v => !usedIds.has(v.id)).sort((a, b) => a.kanji.localeCompare(b.kanji));

  // Search Logic
  const filteredVerbs = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return VERBS.filter(v =>
      v.kanji.includes(query) ||
      v.kana.includes(query) ||
      v.romaji.toLowerCase().includes(query) ||
      v.meaning.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const renderCard = (v: Verb | undefined) => {
    if (!v) return <div className="flex-1 bg-gray-50 rounded-xl" />;
    return (
      <div className="flex-1 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1 hover:border-dojo-indigo transition-colors min-w-0">
        <div className="flex justify-between items-start">
          <span className="text-xl font-black text-gray-800 truncate">{v.kanji}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${v.group === 'v1' ? 'bg-blue-100 text-blue-600' :
              v.group === 'v2' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
            }`}>
            {v.group === 'v1' ? 'G1' : v.group === 'v2' ? 'G2' : 'Irr'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-800 truncate">{v.meaning}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-dojo-indigo font-bold truncate">{v.kana}</span>
            <span className="text-xs text-gray-300 font-mono truncate">({v.romaji})</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full overflow-y-auto  pb-4"
    >
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Verb Connections</h2>
          <p className="text-xs text-gray-400">Related actions grouped together.</p>
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase">{VERBS.length} Verbs</span>
      </div>

      {/* Search Bar */}
      <div className="px-2 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search verbs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-dojo-indigo outline-none transition-all shadow-sm"
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
              <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">{filteredVerbs.length}</span>
            </h3>
            {filteredVerbs.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredVerbs.map(verb => (
                  <div key={verb.id} className="w-full">
                    {renderCard(verb)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No verbs found matching "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          // Default Categroized View
          <>
            {SAFE_GROUPS.map((group, sectionIdx) => (
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
                    if (!left && !right) return null;

                    return (
                      <div key={rowIdx} className="flex items-center gap-3">
                        {renderCard(left)}
                        <div className="flex flex-col items-center justify-center text-gray-300 shrink-0">
                          {right ? <ArrowRightLeft size={14} /> : <div className="w-3.5" />}
                        </div>
                        {renderCard(right)}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="space-y-3">
              <div className="px-2 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-600">Other Verbs</h3>
                <p className="text-xs text-gray-400">Additional vocabulary.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 px-2">
                {remainder.map(verb => (
                  <div key={verb.id} className="w-full">
                    {renderCard(verb)}
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

// ==========================================
// SUB-COMPONENT: MULTIPLE CHOICE QUIZ
// ==========================================
const VerbMCQuiz: React.FC<{ mode: 'meaning' | 'reading'; onAddXP: (n: number) => void }> = ({ mode, onAddXP }) => {
  const [current, setCurrent] = useState<Verb>(VERBS[0]);
  const [options, setOptions] = useState<Verb[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const correct = VERBS[Math.floor(Math.random() * VERBS.length)];
    // Get 3 random distractors
    const distractors: Verb[] = [];
    while (distractors.length < 3) {
      const rand = VERBS[Math.floor(Math.random() * VERBS.length)];
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

  const handleSelect = (option: Verb) => {
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
      <div className="w-full max-w-sm mb-6 flex justify-between items-center text-sm text-gray-500 font-medium">
        <span>Streak: <span className="text-dojo-indigo font-bold">{streak} 🔥</span></span>
        <span>{mode === 'meaning' ? 'Kanji -> Meaning' : 'Reading -> Meaning'}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-600" />

        <h2 className="text-5xl font-black text-gray-800 mb-2 mt-4 text-center">
          {mode === 'meaning' ? current.kanji : current.kana}
        </h2>
        {mode === 'meaning' && (
          <p className="text-lg text-gray-400 font-bold mb-4">{current.kana}</p>
        )}
        {mode === 'reading' && (
          <p className="text-sm text-gray-300 font-bold mb-4 uppercase tracking-widest">{current.romaji}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {options.map(option => {
          const isSelected = selectedId === option.id;
          const isTarget = option.id === current.id;

          // Determine button style based on state
          let btnClass = "bg-white border-gray-200 text-gray-600 hover:bg-gray-50";
          if (selectedId !== null) {
            if (isTarget) btnClass = "bg-green-100 border-green-500 text-green-800 font-bold";
            else if (isSelected && !isTarget) btnClass = "bg-red-100 border-red-500 text-red-800";
            else btnClass = "opacity-50 bg-gray-100 border-gray-200";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selectedId !== null}
              className={`p-4 rounded-xl border-2 text-left transition-all ${btnClass} flex justify-between items-center`}
            >
              <span className="font-bold">{option.meaning}</span>
              {selectedId !== null && isTarget && <CheckCircle size={20} className="text-green-600" />}
              {isSelected && !isTarget && <XCircle size={20} className="text-red-600" />}
            </button>
          );
        })}
      </div>

      {selectedId !== null && !isCorrect && (
        <button
          onClick={generateQuestion}
          className="mt-6 text-gray-400 font-bold hover:text-dojo-indigo flex items-center gap-2"
        >
          Next Question <ArrowRight size={16} />
        </button>
      )}

    </motion.div>
  );
};