import React, { useState } from 'react';
import { Compass, Box, Link2, ToggleLeft, ToggleRight, ArrowRightLeft, ScrollText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ReferenceLibrary: React.FC = () => {
  const [transitiveMode, setTransitiveMode] = useState<'transitive' | 'intransitive'>('transitive');
  const [viewMode, setViewMode] = useState<'tips' | 'formulas'>('tips');

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
    <div className="h-full flex flex-col bg-dojo-bg">
      {/* Tab Navigation */}
      <div className="w-full max-w-sm px-6 pt-6 pb-2 mx-auto">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
          <button
            onClick={() => setViewMode('tips')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'tips' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Compass size={16} /> Grammar
          </button>
          <button
            onClick={() => setViewMode('formulas')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'formulas' ? 'bg-dojo-indigo text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <ScrollText size={16} /> Rules
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {viewMode === 'tips' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Reference</h2>

            {/* 1. Particle Compass */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="text-dojo-red" size={24} />
                <h3 className="text-lg font-bold text-gray-700">The Particle Compass</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ParticleCard
                  char="は" romaji="Wa" title="Topic Marker"
                  desc='"As for X..." Sets the stage for the sentence.'
                />
                <ParticleCard
                  char="を" romaji="Wo" title="Object Marker"
                  desc='Marks what receives the action (e.g. Eat Sushi).'
                />
                <ParticleCard
                  char="に" romaji="Ni" title="Target / Time"
                  desc='Movement goal (Go TO), Time (AT 2pm), or Recipient.'
                />
                <ParticleCard
                  char="で" romaji="De" title="Context"
                  desc='Location of action (Eat AT home) or Means (BY bus).'
                />
                <ParticleCard
                  char="が" romaji="Ga" title="Subject / Identifier"
                  desc='Marks the specific subject. Used with Arimasu/Imasu.'
                />
                <ParticleCard
                  char="へ" romaji="He (e)" title="Direction"
                  desc='Vague direction of movement. Often interchangeable with Ni.'
                />
              </div>
            </section>

            {/* 2. Matryoshka System */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Box className="text-dojo-indigo" size={24} />
                <h3 className="text-lg font-bold text-gray-700">Matryoshka System</h3>
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
            <section className="mb-8">
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
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Conjugation Rules</h2>

            <div className="space-y-8">
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

              {/* Masu Form */}
              <FormulaBlock title="2. Polite Form (Masu-kei)" color="indigo">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Group 1 (Godan)</p>
                    <p className="text-sm font-bold text-gray-800">Change 'u' sound to 'i' + masu</p>
                    <div className="bg-gray-50 mt-2 p-2 rounded text-xs">
                      <span className="line-through text-gray-400">Ik<span className="text-red-500 font-bold">u</span></span>
                      <ArrowRight className="inline mx-1 w-3 h-3 text-gray-400" />
                      Iki<span className="text-indigo-600 font-bold">masu</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Group 2 (Ichidan)</p>
                    <p className="text-sm font-bold text-gray-800">Drop 'ru' + masu</p>
                    <div className="bg-gray-50 mt-2 p-2 rounded text-xs">
                      <span className="line-through text-gray-400">Tabe<span className="text-red-500 font-bold">ru</span></span>
                      <ArrowRight className="inline mx-1 w-3 h-3 text-gray-400" />
                      Tabe<span className="text-indigo-600 font-bold">masu</span>
                    </div>
                  </div>
                </div>
              </FormulaBlock>

              {/* Negative Form */}
              <FormulaBlock title="3. Negative Form (Nai-kei)" color="red">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Group 1 (Godan)</p>
                    <p className="text-sm font-bold text-gray-800">Change 'u' sound to 'a' + nai</p>
                    <p className="text-[10px] text-red-400 font-bold mt-1">*Exception: U -&gt; Wa</p>
                    <div className="bg-gray-50 mt-2 p-2 rounded text-xs">
                      <span className="text-gray-600">Kak<span className="text-red-500 font-bold">u</span></span>
                      <ArrowRight className="inline mx-1 w-3 h-3 text-gray-400" />
                      Kaka<span className="text-red-600 font-bold">nai</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Group 2 (Ichidan)</p>
                    <p className="text-sm font-bold text-gray-800">Drop 'ru' + nai</p>
                    <div className="bg-gray-50 mt-2 p-2 rounded text-xs">
                      <span className="text-gray-600">Mi<span className="text-red-500 font-bold">ru</span></span>
                      <ArrowRight className="inline mx-1 w-3 h-3 text-gray-400" />
                      Mi<span className="text-red-600 font-bold">nai</span>
                    </div>
                  </div>
                </div>
              </FormulaBlock>

              {/* Te Form */}
              <FormulaBlock title="4. Te-Form (Connective)" color="yellow">
                <p className="text-xs text-gray-500 mb-3">Used for linking sentences, requests (te kudasai), and progressive (te iru).</p>
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
                  <div className="flex items-center justify-between text-sm bg-green-50 p-2 rounded border border-green-100">
                    <span className="font-mono font-bold text-gray-500">Group 2 (Ichidan)</span>
                    <span className="font-bold text-gray-800">Drop ru + te</span>
                  </div>
                </div>
              </FormulaBlock>

              {/* Adjectives */}
              <FormulaBlock title="5. Adjective Transformations" color="purple">
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
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

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