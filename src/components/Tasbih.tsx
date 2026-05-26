import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Hash, ChevronRight, ChevronLeft, Hand } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DZIKIR_LIST = [
  { id: 1, text: "Subhanallah", arabic: "سُبْحَانَ اللَّهِ", meaning: "Maha Suci Allah" },
  { id: 2, text: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "Segala Puji Bagi Allah" },
  { id: 3, text: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", meaning: "Allah Maha Besar" },
  { id: 4, text: "Lailahaillallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", meaning: "Tiada Tuhan Selain Allah" },
  { id: 5, text: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", meaning: "Aku Memohon Ampun Kepada Allah" },
  { id: 6, text: "Shalawat", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", meaning: "Ya Allah, rahmatilah Nabi Muhammad" },
];

export default function Tasbih() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [activeDzikirIndex, setActiveDzikirIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(() => {
    const saved = localStorage.getItem("quran_tasbih_total");
    return saved ? parseInt(saved, 10) : 0;
  });

  const activeDzikir = DZIKIR_LIST[activeDzikirIndex];

  useEffect(() => {
    localStorage.setItem("quran_tasbih_total", totalCount.toString());
  }, [totalCount]);

  const handleTap = useCallback(() => {
    if (navigator.vibrate) {
      if (count + 1 === target) {
        navigator.vibrate([100, 50, 100]); // Longer vibration on reaching target
      } else {
        navigator.vibrate(50); // Short tap
      }
    }
    
    setCount((c) => c + 1);
    setTotalCount((t) => t + 1);
  }, [count, target]);

  const handleReset = () => {
    if (confirm("Reset penghitung dzikir ini ke 0?")) {
      setCount(0);
    }
  };

  const nextDzikir = () => {
    setCount(0);
    setActiveDzikirIndex((prev) => (prev + 1) % DZIKIR_LIST.length);
  };

  const prevDzikir = () => {
    setCount(0);
    setActiveDzikirIndex((prev) => (prev - 1 + DZIKIR_LIST.length) % DZIKIR_LIST.length);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
          <Hand size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Tasbih Digital</h2>
        <p className="text-gray-500 text-sm">Hitung dzikir harian Anda dengan mudah.</p>
        
        <div className="mt-6 inline-flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
          <div className="px-4 py-2 text-sm text-gray-500 font-medium">Total Dzikir:</div>
          <div className="px-4 py-2 bg-white rounded-xl text-emerald-600 font-bold shadow-sm">
            {totalCount.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Main Tasbih Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center relative overflow-hidden">
        {/* Background purely for aesthetic */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {/* Dzikir Selector */}
        <div className="flex items-center justify-between w-full mb-10 z-10">
          <button onClick={prevDzikir} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center flex-1 px-4">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeDzikir.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
               >
                 <p className="max-w-[200px] mx-auto text-3xl font-arabic text-emerald-700 leading-relaxed mb-2 drop-shadow-sm">{activeDzikir.arabic}</p>
                 <p className="text-lg font-semibold text-gray-900">{activeDzikir.text}</p>
                 <p className="text-xs text-gray-500 mt-1">{activeDzikir.meaning}</p>
               </motion.div>
             </AnimatePresence>
          </div>

          <button onClick={nextDzikir} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Counter Display & Tap Button */}
        <div className="relative z-10 flex flex-col items-center group">
          
          {/* Target Settings */}
          <div className="absolute top-4 right-4 flex flex-col items-center gap-1 z-20">
            <button 
              onClick={() => setTarget(t => t === 33 ? 100 : t === 100 ? 99 : 33)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-full transition-colors flex items-center justify-center min-w-[3rem]"
              title="Ubah Target"
            >
              /{target}
            </button>
          </div>

          {/* Huge Tap Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
            className="w-56 h-56 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-200 flex flex-col items-center justify-center text-white relative overflow-hidden focus:outline-none"
          >
            {/* Inner Ring */}
            <div className="absolute inset-2 border-2 border-white/20 rounded-full pointer-events-none"></div>
            
            <span className="text-6xl font-bold tracking-tighter tabular-nums drop-shadow-md">
              {count}
            </span>
            <span className="text-emerald-100 text-sm font-medium mt-1 tracking-widest uppercase">
              Ketuk
            </span>
            
            {/* Ripple effect overlay hint */}
            <motion.div 
              className="absolute inset-0 bg-white opacity-0"
              whileTap={{ opacity: 0.2 }}
            />
          </motion.button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-10 z-10">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-medium transition-colors border border-gray-200"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {count > 0 && count % target === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 bg-emerald-900 text-emerald-50 px-6 py-3 rounded-full text-sm font-medium shadow-lg z-20 flex items-center gap-2"
            >
               ✨ Alhamdulillah, target {target} tercapai!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
