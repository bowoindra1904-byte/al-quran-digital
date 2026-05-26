import { useState, useEffect } from "react";
import { fetchIslamicHistory } from "../api";
import { BookText, Loader2, RefreshCw, Feather, Book, Heart, Users, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

export default function IslamicHistory() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState("random");

  const topics = [
    { id: "random", label: "Kisah Acak", icon: RefreshCw },
    { id: "tokoh inspiratif dalam sejarah kemerdekaan atau jaman nabi", label: "Tokoh Inspiratif", icon: Users },
    { id: "ilmuwan dan kemajuan sains islam kuno", label: "Sains & Ilmuwan", icon: Book },
    { id: "kisah romantis islami yang mengharukan", label: "Kisah Romantis", icon: Heart },
    { id: "politik, strategi perang, dan kekuasaan sejarah islam", label: "Politik & Strategi", icon: Shield },
    { id: "tokoh hebat namun jarang didengar sejarawan", label: "Tokoh Tersembunyi", icon: Feather },
  ];

  const loadHistory = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchIslamicHistory(topic);
      setContent(text);
    } catch (err: any) {
      setError(err.message || "Gagal memuat kisah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(activeTopic);
  }, [activeTopic]);

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 rounded-[2.5rem] p-6 text-center mb-8 border border-amber-200 shadow-sm"
      >
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3 mb-2">
          <BookText className="text-amber-600" size={32} />
          Sejarah & Peradaban
        </h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
          Menyelusuri jejak emas peradaban Islam, tokoh-tokoh pahlawan maupun ilmuwan, politik kekuasaan, hingga kisah romantis yang menginspirasi.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTopic === t.id 
                  ? "bg-amber-600 text-white shadow-md shadow-amber-200 scale-105" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-amber-100 hover:text-amber-800"
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[400px] flex flex-col relative overflow-hidden">
        {/* Aesthetic Background Effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-50 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-amber-600 gap-4"
              >
                <Loader2 className="animate-spin" size={40} />
                <span className="text-sm font-bold tracking-widest uppercase text-amber-700/70">Menggali Arsip Sejarah...</span>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                 <p className="text-red-500 bg-red-50 px-6 py-4 rounded-2xl inline-block border border-red-100">{error}</p>
                 <div className="mt-4">
                    <button onClick={() => loadHistory(activeTopic)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200">
                      Coba Lagi
                    </button>
                 </div>
              </motion.div>
            ) : (
               <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="prose prose-amber max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-loose prose-a:text-amber-600 font-sans md:px-6"
              >
                <Markdown>{content || ""}</Markdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Action Button */}
      {!loading && !error && (
        <div className="mt-10 flex justify-center pb-8">
          <button
            onClick={() => loadHistory(activeTopic)}
            className="group flex items-center gap-3 px-8 py-3.5 bg-gray-900 text-white rounded-full font-semibold transition-all hover:scale-105 hover:bg-gray-800 shadow-xl shadow-gray-200"
          >
            <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={18} />
            Muat Kisah Lain
          </button>
        </div>
      )}
    </div>
  );
}
