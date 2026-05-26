import { useState, useEffect } from "react";
import { fetchDailyVerse } from "../api";
import { X, Sparkles, Loader2, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DailyVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyVerseModal({ isOpen, onClose }: DailyVerseModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !data && !loading && !error) {
      loadDailyVerse();
    }
  }, [isOpen, data, loading, error]);

  const loadDailyVerse = async () => {
    setLoading(true);
    setError(null);
    try {
      const verse = await fetchDailyVerse();
      setData(verse);
    } catch (err: any) {
      setError(err.message || "Gagal memuat ayat harian");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-lg flex flex-col relative shadow-2xl z-20"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex flex-col items-center justify-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-md">
            <Sparkles className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-white text-xl text-center">Motivasi Pagi</h3>
          <p className="text-emerald-100 text-sm mt-1 text-center font-medium">Ayat Harian Spesial Untukmu</p>
        </div>

        <div className="p-6 bg-gray-50/50 min-h-[250px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-emerald-600 gap-3"
              >
                <Loader2 className="animate-spin" size={32} />
                <span className="text-sm font-semibold tracking-widest uppercase text-emerald-700/70">Mengambil Ayat...</span>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                 <p className="text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100 text-sm mb-4">{error}</p>
                 <button onClick={loadDailyVerse} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                   Coba Lagi
                 </button>
              </motion.div>
            ) : data ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
                    <Quote size={12} />
                    Surah {data.surah} : {data.ayat}
                  </div>
                  
                  {data.arab && (
                    <p className="text-2xl font-arabic leading-loose text-center text-gray-900 mb-6" dir="rtl">
                      {data.arab}
                    </p>
                  )}

                  <p className="text-base text-gray-700 font-medium italic leading-relaxed px-4">
                    "{data.terjemahan}"
                  </p>
                </div>
                
                <div className="h-px bg-gray-200 w-full"></div>
                
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <p className="text-emerald-900 text-sm leading-relaxed font-medium">
                    <span className="font-bold">✨ Pesan Hari Ini:</span><br/>
                    {data.renungan}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        
        {data && !loading && (
          <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
            <button 
              onClick={onClose}
              className="w-full max-w-[200px] px-4 py-3 bg-gray-900 text-white rounded-xl font-medium transition-all hover:bg-gray-800 shadow-lg shadow-gray-200 text-sm"
            >
              Lanjutkan Membaca
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
