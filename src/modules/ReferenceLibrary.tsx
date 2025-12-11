import React, { useState } from 'react';
import { Compass, Box, Link2, ToggleLeft, ToggleRight, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ReferenceLibrary: React.FC = () => {
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
    <div className="h-full overflow-y-auto p-6 bg-dojo-bg pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reference Library</h2>

      {/* 1. Particle Compass */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="text-dojo-red" size={24} />
          <h3 className="text-lg font-bold text-gray-700">The Particle Compass</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ParticleCard 
            char="は" 
            romaji="Wa" 
            title="Topic Marker" 
            desc='"As for X..." Sets the stage for the sentence.' 
          />
          <ParticleCard 
            char="を" 
            romaji="Wo" 
            title="Object Marker" 
            desc='Marks what receives the action (e.g. Eat Sushi).' 
          />
          <ParticleCard 
            char="に" 
            romaji="Ni" 
            title="Target / Time" 
            desc='Movement goal (Go TO), Time (AT 2pm), or Recipient.' 
          />
          <ParticleCard 
            char="で" 
            romaji="De" 
            title="Context" 
            desc='Location of action (Eat AT home) or Means (BY bus).' 
          />
          <ParticleCard 
            char="が" 
            romaji="Ga" 
            title="Subject / Identifier" 
            desc='Marks the specific subject. Used with Arimasu/Imasu.' 
          />
          <ParticleCard 
            char="へ" 
            romaji="He (e)" 
            title="Direction" 
            desc='Vague direction of movement. Often interchangeable with Ni.' 
          />
        </div>
      </section>

      {/* 2. Matryoshka System (Relative Clauses) */}
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

export default ReferenceLibrary;