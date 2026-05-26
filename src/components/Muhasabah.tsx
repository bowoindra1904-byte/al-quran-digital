import { useState, useEffect } from "react";
import { fetchMuhasabah } from "../api";
import { Compass, Loader2, RefreshCw, Quote, Wind } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

export default function Muhasabah() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReflection = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchMuhasabah();
      setContent(text);
    } catch (err: any) {
      setError(err.message || "Gagal memuat renungan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReflection();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      {/* Container with a deeper, more contemplative color scheme */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-950 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-emerald-50"
      >
        {/* Aesthetic Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-800 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-900 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-emerald-900/50 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-300 mb-6 border border-emerald-800/50 shadow-inner">
              <Compass size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
              Titik Balik
            </h2>
            <p className="text-emerald-200/80 max-w-md text-sm leading-relaxed">
              Sebuah ruang untuk merenung, meluruskan kembali cara pandang kehidupan, dan kembali kepada jalan-Nya.
            </p>
          </div>

          {/* Content Area */}
          <div className="min-h-[250px] flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-emerald-400 gap-4"
                >
                  <Loader2 className="animate-spin" size={32} />
                  <span className="text-sm font-medium tracking-widest uppercase">Menyelaraskan Hati...</span>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-red-300 mb-4">{error}</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative px-4 md:px-8"
                >
                  <Quote className="absolute -top-6 -left-2 text-emerald-800/40 rotate-180" size={64} />
                  
                  <div className="prose prose-invert prose-emerald max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-emerald-50/90 prose-headings:text-white prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-900/30 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:text-emerald-100 relative z-10 font-sans tracking-wide">
                    <Markdown>{content || ""}</Markdown>
                  </div>
                  
                  <Quote className="absolute -bottom-8 -right-2 text-emerald-800/40" size={64} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={loadReflection}
              disabled={loading}
              className="group flex items-center gap-3 px-8 py-3.5 bg-white text-emerald-950 rounded-full font-semibold transition-all hover:scale-105 hover:bg-emerald-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Wind className="group-hover:rotate-12 transition-transform" size={18} />
              )}
              Beri Saya Renungan Lain
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
