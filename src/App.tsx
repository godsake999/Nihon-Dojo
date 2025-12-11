import React, { useState, useEffect } from 'react';
import { BookOpen, Dumbbell, Zap, GraduationCap, LayoutGrid, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, addXP } from './services/storage';
import { UserProfile } from './types';

// Module Imports
import VerbGym from './modules/VerbGym';
import KanjiDojo from './modules/KanjiDojo';
import ExamSimulator from './modules/ExamSimulator';
import ReferenceLibrary from './modules/ReferenceLibrary';

type ViewState = 'gym' | 'kanji' | 'exam' | 'reference';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('gym');
  const [profile, setProfile] = useState<UserProfile>(getProfile());

  const handleXPChange = (amount: number) => {
    const newProfile = addXP(amount);
    setProfile(newProfile);
  };

  useEffect(() => {
    // Initial load
    setProfile(getProfile());
  }, []);

  const getLevelTitle = (level: number) => {
    if (level < 2) return "White Belt";
    if (level < 4) return "Yellow Belt";
    if (level < 6) return "Green Belt";
    if (level < 8) return "Brown Belt";
    return "Black Belt";
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      
      {/* Top Header */}
      <header className="bg-dojo-indigo text-white p-4 pt-8 flex justify-between items-center z-10 shadow-md">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-white text-dojo-indigo px-2 py-0.5 rounded text-sm">N5</span>
            JLPT Dojo
          </h1>
          <p className="text-xs opacity-80 mt-1">Mastery v1.0</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span className="text-yellow-300 font-bold">{profile.xp} XP</span>
          </div>
          <div className="text-xs bg-indigo-800 px-2 py-1 rounded mt-1">
            Lvl {profile.level} • {getLevelTitle(profile.level)}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-dojo-bg relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentView === 'gym' && <VerbGym onAddXP={handleXPChange} />}
            {currentView === 'kanji' && <KanjiDojo onAddXP={handleXPChange} />}
            {currentView === 'exam' && <ExamSimulator onAddXP={handleXPChange} />}
            {currentView === 'reference' && <ReferenceLibrary />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center h-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={currentView === 'gym'} 
          onClick={() => setCurrentView('gym')} 
          icon={<Dumbbell size={24} />} 
          label="Verb Gym" 
        />
        <NavButton 
          active={currentView === 'kanji'} 
          onClick={() => setCurrentView('kanji')} 
          icon={<LayoutGrid size={24} />} 
          label="Kanji" 
        />
        <NavButton 
          active={currentView === 'exam'} 
          onClick={() => setCurrentView('exam')} 
          icon={<GraduationCap size={24} />} 
          label="Exam" 
        />
        <NavButton 
          active={currentView === 'reference'} 
          onClick={() => setCurrentView('reference')} 
          icon={<BookOpen size={24} />} 
          label="Ref" 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 transition-colors ${
      active ? 'text-dojo-indigo scale-110' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <div className={`mb-1 ${active ? 'animate-bounce' : ''}`}>{icon}</div>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
