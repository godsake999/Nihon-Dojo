import React, { useState, useMemo } from 'react';
import { Compass, Box, Link2, ToggleLeft, ToggleRight, ArrowRightLeft, ScrollText, ArrowRight, Search, Book, Filter, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { grammarLibrary, GrammarPoint } from '../data/grammar';
import { bunkeiData, BunkeiPoint } from '../data/bunkei';

type ReferenceMode = 'library' | 'visuals' | 'cheatsheets' | 'bunkei';

const ReferenceLibrary: React.FC = () => {
  const [mode, setMode] = useState<ReferenceMode>('library');

  return (
    <div className="h-full flex flex-col bg-dojo-bg">
      {/* Tab Navigation */}
      <div className="w-full max-w-md px-4 pt-6 pb-2 mx-auto">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">
          <button
            onClick={() => setMode('library')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'library' ? 'flex-[2] bg-dojo-indigo text-white shadow-sm' : 'flex-1 text-gray-400 hover:bg-gray-50'
              }`}
          >
            <Book size={18} />
            {mode === 'library' && <span>Library</span>}
          </button>
          <button
            onClick={() => setMode('visuals')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'visuals' ? 'flex-[2] bg-dojo-indigo text-white shadow-sm' : 'flex-1 text-gray-400 hover:bg-gray-50'
              }`}
          >
            <Compass size={18} />
            {mode === 'visuals' && <span>Visuals</span>}
          </button>
          <button
            onClick={() => setMode('cheatsheets')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'cheatsheets' ? 'flex-[2] bg-dojo-indigo text-white shadow-sm' : 'flex-1 text-gray-400 hover:bg-gray-50'
              }`}
          >
            <ScrollText size={18} />
            {mode === 'cheatsheets' && <span>Tables</span>}
          </button>
          <button
            onClick={() => setMode('bunkei')}
            className={`py-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'bunkei' ? 'flex-[2] bg-dojo-indigo text-white shadow-sm' : 'flex-1 text-gray-400 hover:bg-gray-50'
              }`}
          >
            <MessageSquare size={18} />
            {mode === 'bunkei' && <span>Patterns</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
        {mode === 'library' && <GrammarLibraryView />}
        {mode === 'visuals' && <VisualGuideView />}
        {mode === 'cheatsheets' && <CheatsheetView />}
        {mode === 'bunkei' && <BunkeiView />}
      </div>
    </div>
  );
};

// ==========================================
// 1. GRAMMAR LIBRARY VIEW (New)
// ==========================================
const GrammarLibraryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'N5' | 'N4' | 'Conjugation' | 'Particle' | 'Expression' | 'Keigo' | 'Bunkei'>('All');

  const filteredData = useMemo(() => {
    return grammarLibrary.filter(item => {
      // 1. Filter Match
      if (filter !== 'All') {
        if (filter === 'N5' || filter === 'N4') {
          if (item.level !== filter) return false;
        } else {
          if (item.category !== filter) return false;
        }
      }

      // 2. Search Match
      if (search) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q) ||
          item.formula.toLowerCase().includes(q) ||
          item.id.includes(q)
        );
      }

      return true;
    });
  }, [search, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 mx-auto"
    >
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search grammar (e.g., 'Passive', 'Particle', 'Te form')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-dojo-indigo outline-none shadow-sm transition-all text-lg"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'N5', 'N4', 'Conjugation', 'Particle', 'Expression', 'Keigo', 'Bunkei'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${filter === f
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid - Forced to 1 column for mobile app container */}
      <div className="flex flex-col gap-4">
        {filteredData.map(item => (
          <GrammarCard key={item.id} item={item} />
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <p className="text-lg font-bold">No grammar points found.</p>
            <p className="text-sm">Try a different search term or filter.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const GrammarCard: React.FC<{ item: GrammarPoint }> = ({ item }) => {
  const categoryColors = {
    Conjugation: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Particle: 'bg-red-100 text-red-700 border-red-200',
    Expression: 'bg-green-100 text-green-700 border-green-200',
    Keigo: 'bg-purple-100 text-purple-700 border-purple-200',
    Bunkei: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const levelColor = item.level === 'N5' ? 'bg-blue-500' : 'bg-emerald-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group">
      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded ${levelColor}`}>{item.level}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${categoryColors[item.category]}`}>
              {item.category}
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-800 leading-tight mt-1 group-hover:text-dojo-indigo transition-colors">{item.title}</h3>
        </div>
      </div>

      <div className="flex-1 p-5 pt-0 flex flex-col gap-4">
        {/* Formula Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm text-slate-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200" />
          {item.formula}
        </div>

        {/* Meaning & Usage */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Meaning</p>
          <p className="font-medium text-gray-700">{item.meaning}</p>
        </div>

        {/* Examples */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 mt-auto">
          <p className="text-xs font-bold text-amber-500 mb-1 uppercase">Example</p>
          <p className="font-bold text-gray-800 text-sm mb-0.5">{item.exampleJP}</p>
          <p className="text-xs text-gray-500">{item.exampleEN}</p>
        </div>

        {/* Tips */}
        {item.tips && (
          <div className="text-xs text-gray-400 flex gap-1.5 items-start">
            <span className="font-bold text-dojo-indigo shrink-0">Tip:</span>
            <span>{item.tips}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. VISUAL GUIDE VIEW (Original 'Tips')
// ==========================================
const VisualGuideView: React.FC = () => {
  const [transitiveMode, setTransitiveMode] = useState<'transitive' | 'intransitive'>('transitive');
  const pairs = [
    { trans: 'Akeru (開ける)', intrans: 'Aku (開く)', meaning: 'Open' },
    { trans: 'Shimeru (閉める)', intrans: 'Shimaru (閉まる)', meaning: 'Close' },
    { trans: 'Tsukeru (つける)', intrans: 'Tsuku (つく)', meaning: 'Turn On' },
    { trans: 'Kesu (消す)', intrans: 'Kieru (消える)', meaning: 'Turn Off' },
    { trans: 'Kowasu (壊す)', intrans: 'Kowareru (壊れる)', meaning: 'Break' },
    { trans: 'Otosu (落とす)', intrans: 'Ochiru (落ちる)', meaning: 'Drop' },
    { trans: 'Ireru (入れる)', intrans: 'Hairu (入る)', meaning: 'Enter/Insert' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Interactive Guides</h2>

      {/* Particle Compass Logic reused */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="text-dojo-red" size={24} />
          <h3 className="text-lg font-bold text-gray-700">The Particle Compass</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ParticleCard char="は" romaji="Wa" title="Topic Marker" desc='"As for X..." Sets the stage for the sentence.' />
          <ParticleCard char="を" romaji="Wo" title="Object Marker" desc='Marks what receives the action (e.g. Eat Sushi).' />
          <ParticleCard char="に" romaji="Ni" title="Target / Time" desc='Movement goal (Go TO), Time (AT 2pm), or Recipient.' />
          <ParticleCard char="で" romaji="De" title="Context" desc='Location of action (Eat AT home) or Means (BY bus).' />
          <ParticleCard char="が" romaji="Ga" title="Subject / Identifier" desc='Marks the specific subject. Used with Arimasu/Imasu.' />
          <ParticleCard char="へ" romaji="He (e)" title="Direction" desc='Vague direction of movement. Often interchangeable with Ni.' />
        </div>
      </section>

      {/* Matryoshka System */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Box className="text-dojo-indigo" size={24} />
          <h3 className="text-lg font-bold text-gray-700">Matryoshka System (Relative Clauses)</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            In Japanese, you can turn an entire sentence into an adjective by putting it <strong>before</strong> a noun.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
              <span className="bg-white border px-2 py-1 rounded text-xs font-bold text-gray-500">Sentence</span>
              <span className="font-medium text-gray-800">Tanaka-san eats sushi.</span>
            </div>

            <div className="flex justify-center text-gray-300">
              <Link2 size={20} />
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <span className="bg-white border border-indigo-200 px-2 py-1 rounded text-xs font-bold text-indigo-500">Relative Clause</span>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="font-bold text-indigo-700 border-b-2 border-indigo-300">Tanaka-san ga taberu</span>
                <span className="font-black text-gray-800 text-lg">SUSHI</span>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 mt-1">"The sushi that Tanaka-san eats"</p>
          </div>
        </div>
      </section>

      {/* 3. Transitivity Toggle */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-green-600" size={24} />
            <h3 className="text-lg font-bold text-gray-700">Transitivity</h3>
          </div>

          <button
            onClick={() => setTransitiveMode(prev => prev === 'transitive' ? 'intransitive' : 'transitive')}
            className="flex items-center gap-2 bg-gray-200 rounded-full p-1 pl-3 pr-1 cursor-pointer transition-colors hover:bg-gray-300"
          >
            <span className="text-xs font-bold text-gray-600 uppercase">
              {transitiveMode === 'transitive' ? 'Transitive' : 'Intransitive'}
            </span>
            <div className="bg-white rounded-full p-1 shadow-sm text-dojo-indigo">
              {transitiveMode === 'transitive' ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`p-4 border-b border-gray-100 flex items-center gap-3 ${transitiveMode === 'transitive' ? 'bg-indigo-50' : 'bg-orange-50'}`}>
            <span className={`text-sm font-bold uppercase tracking-wide ${transitiveMode === 'transitive' ? 'text-indigo-600' : 'text-orange-600'}`}>
              {transitiveMode === 'transitive' ? 'Somebody does something' : 'Something happens'}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {pairs.map((pair, idx) => {
              const activeWord = transitiveMode === 'transitive' ? pair.trans : pair.intrans;
              const particle = transitiveMode === 'transitive' ? 'wo' : 'ga';

              return (
                <motion.div
                  key={idx}
                  layout
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="text-xs text-gray-400 mr-2 uppercase font-bold">{pair.meaning}</span>
                    <p className="font-bold text-gray-800 text-lg">
                      <span className="text-gray-300 mr-2">~{particle}</span>
                      {activeWord}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

// ==========================================
// 3. CHEATSHEET VIEW (Original 'Formulas')
// ==========================================
const CheatsheetView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Rules & Tables</h2>
      {/* Verb Groups */}
      <FormulaBlock title="1. Verb Groups" color="blue">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 px-2 rounded font-bold text-xs mt-1">Group 1</span>
            <div>
              <p className="font-bold text-gray-800">Godan verbs</p>
              <p className="text-xs text-gray-500">End in -u, -ku, -su, -tsu, -nu, -bu, -mu, -gu, -ru (sometimes)</p>
              <p className="text-xs text-gray-400 mt-1">Ex: Iku, Hanasu, Yomu</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 px-2 rounded font-bold text-xs mt-1">Group 2</span>
            <div>
              <p className="font-bold text-gray-800">Ichidan verbs</p>
              <p className="text-xs text-gray-500">End in -iru or -eru. (Almost always)</p>
              <p className="text-xs text-gray-400 mt-1">Ex: Taberu, Miru</p>
            </div>
          </div>
        </div>
      </FormulaBlock>

      {/* Te Form Table */}
      <FormulaBlock title="2. Te-Form Rules (Godan)" color="yellow">
        <div className="space-y-2">
          <RuleRow label="u, tsu, ru" suffix="tte" example="Au -> Atte" />
          <RuleRow label="mu, bu, nu" suffix="nde" example="Yomu -> Yonde" />
          <RuleRow label="ku" suffix="ite" example="Kaku -> Kaite" />
          <RuleRow label="gu" suffix="ide" example="Oyogu -> Oyoide" />
          <RuleRow label="su" suffix="shite" example="Hanasu -> Hanashite" />
          <div className="flex items-center justify-between text-sm bg-yellow-50 p-2 rounded border border-yellow-100">
            <span className="font-mono font-bold text-gray-500">Exception (Iku)</span>
            <span className="font-bold text-gray-800">Itte <span className="text-xs font-normal text-gray-400">(Not iite)</span></span>
          </div>
        </div>
      </FormulaBlock>

      {/* Adjectives Table */}
      <FormulaBlock title="3. Adjective Conjugation Table" color="purple">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] text-left">
              <th className="pb-2 pl-2">Form</th>
              <th className="pb-2">i-Adjective (Takai)</th>
              <th className="pb-2">na-Adjective (Genki)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-2 pl-2 font-bold text-xs text-gray-500">Present (Is)</td>
              <td className="py-2">Taka<span className="text-purple-600 font-bold">i</span> desu</td>
              <td className="py-2">Genki <span className="text-purple-600 font-bold">desu</span></td>
            </tr>
            <tr>
              <td className="py-2 pl-2 font-bold text-xs text-gray-500">Negative (Isn't)</td>
              <td className="py-2">Taka<span className="text-purple-600 font-bold">kunai</span> desu</td>
              <td className="py-2">Genki <span className="text-purple-600 font-bold">ja arimasen</span></td>
            </tr>
            <tr>
              <td className="py-2 pl-2 font-bold text-xs text-gray-500">Past (Was)</td>
              <td className="py-2">Taka<span className="text-purple-600 font-bold">katta</span> desu</td>
              <td className="py-2">Genki <span className="text-purple-600 font-bold">deshita</span></td>
            </tr>
            <tr>
              <td className="py-2 pl-2 font-bold text-xs text-gray-500">Past Neg. (Wasn't)</td>
              <td className="py-2">Taka<span className="text-purple-600 font-bold">kunakatta</span> desu</td>
              <td className="py-2">Genki <span className="text-purple-600 font-bold">ja arimasen deshita</span></td>
            </tr>
          </tbody>
        </table>
      </FormulaBlock>
    </motion.div>
  )
}

// ==========================================
// 4. BUNKEI VIEW (Sentence Patterns)
// ==========================================
const BunkeiView: React.FC = () => {
  const [search, setSearch] = useState('');
  // We'll keep the N5 patterns from the grammar library for the "Basics" section
  const n5Patterns = grammarLibrary.filter(item => item.category === 'Bunkei' && item.level === 'N5');

  // Filter the new grouped Bunkei Data
  const filteredBunkei = useMemo(() => {
    if (!search) return bunkeiData;
    const q = search.toLowerCase();
    return bunkeiData.filter(item =>
      item.meaning.toLowerCase().includes(q) ||
      item.formula.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q)
    );
  }, [search]);

  // Group by "Family"
  const groupedData = useMemo(() => {
    const groups: Record<string, BunkeiPoint[]> = {};
    filteredBunkei.forEach(item => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    // Define exact order based on user request/logical flow
    const order = ['Fact', 'Change', 'Opinion', 'Probability', 'Explanation'];
    return order
      .filter(key => groups[key] && groups[key].length > 0)
      .map(key => ({ title: key, items: groups[key] }));
  }, [filteredBunkei]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-black text-gray-800">Sentence Patterns (Bunkei)</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">Mastering these patterns is the key to forming natural Japanese sentences.</p>
      </div>

      {/* Internal Search Bar */}
      <div className="relative max-w-lg mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search patterns (e.g., 'Fact', 'Can do', 'koto')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-dojo-indigo outline-none shadow-sm transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* N5 Patterns (Legacy support from GrammarLibrary) */}
      {!search && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-500 text-white font-black px-3 py-1 rounded-lg text-sm shadow-blue-200 shadow-md">N5</span>
            <h3 className="text-xl font-bold text-gray-700">Essential Patterns (Basics)</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {n5Patterns.map(item => (
              <GrammarCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* N4 Patterns (New Grouped Data) */}
      <div className="space-y-10">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500 text-white font-black px-3 py-1 rounded-lg text-sm shadow-emerald-200 shadow-md">N4</span>
          <h3 className="text-xl font-bold text-gray-700">Advanced Patterns (Mastery)</h3>
        </div>

        {groupedData.map((group) => (
          <div key={group.title} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
            <h4 className="text-lg font-black text-gray-400 uppercase tracking-widest px-2 mb-4 drop-shadow-sm border-l-4 border-dojo-indigo pl-3">{group.title}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {group.items.map(item => (
                <BunkeiCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        {groupedData.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>No N4 patterns found matching your search.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
};

const BunkeiCard: React.FC<{ item: BunkeiPoint }> = ({ item }) => {
  const tagColors: Record<string, string> = {
    Fact: 'bg-blue-100 text-blue-700',
    Change: 'bg-orange-100 text-orange-700',
    Opinion: 'bg-purple-100 text-purple-700',
    Probability: 'bg-pink-100 text-pink-700',
    Explanation: 'bg-teal-100 text-teal-700',
  };

  const groupColor = tagColors[item.group] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header: Formula */}
      <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center justify-between gap-2">
        <code className="font-mono text-xs sm:text-sm font-bold text-indigo-600 bg-white px-2 py-1 rounded border border-indigo-100 shadow-sm flex-1 break-words">
          {item.formula}
        </code>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${groupColor}`}>
          {item.tag}
        </span>
      </div>

      {/* Body: Meaning */}
      <div className="p-4 flex-1">
        <p className="font-bold text-gray-800 text-md leading-relaxed">
          {item.meaning}
        </p>
      </div>

      {/* Footer: Examples */}
      <div className="p-4 pt-0 text-sm">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="font-medium text-gray-800 mb-0.5">{item.exampleJP}</p>
          <p className="text-xs text-gray-400">{item.exampleEN}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// HELPERS
// ==========================================

const ParticleCard: React.FC<{ char: string; romaji: string; title: string; desc: string }> = ({ char, romaji, title, desc }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-baseline mb-1">
      <h4 className="font-black text-2xl text-dojo-indigo">{char}</h4>
      <span className="text-xs font-bold text-gray-300">{romaji}</span>
    </div>
    <p className="text-xs text-dojo-red uppercase font-bold mb-1">{title}</p>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const RuleRow: React.FC<{ label: string; suffix: string; example: string }> = ({ label, suffix, example }) => (
  <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50">
    <span className="font-mono font-bold text-gray-500">{label}</span>
    <ArrowRight size={14} className="text-gray-300" />
    <span className="font-black text-dojo-indigo text-lg">~{suffix}</span>
    <span className="text-xs text-gray-400">{example}</span>
  </div>
);

const FormulaBlock: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => {
  const colorClasses = {
    blue: 'border-l-blue-500 shadow-blue-50',
    indigo: 'border-l-indigo-500 shadow-indigo-50',
    red: 'border-l-red-500 shadow-red-50',
    yellow: 'border-l-yellow-500 shadow-yellow-50',
    purple: 'border-l-purple-500 shadow-purple-50',
  }[color] || 'border-l-gray-500';

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 p-5 ${colorClasses} border-y border-r border-gray-100`}>
      <h4 className="font-bold text-gray-800 mb-4">{title}</h4>
      {children}
    </div>
  );
};

export default ReferenceLibrary;