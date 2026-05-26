import { useState, useEffect } from "react";
import { fetchFiqih } from "../api";
import { Scale, Loader2, BookOpen, Droplets, Utensils, Heart, ShoppingBag, Info, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

export default function FiqihSehariHari() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState("Thaharah (Bersuci)");
  const [customQuery, setCustomQuery] = useState("");

  const topics = [
    { id: "Thaharah (Bersuci)", icon: Droplets, label: "Bersuci" },
    { id: "Shalat", icon: BookOpen, label: "Shalat" },
    { id: "Makan dan Minum", icon: Utensils, label: "Makanan" },
    { id: "Adab dan Akhlak", icon: Heart, label: "Adab" },
    { id: "Jual Beli (Muamalah)", icon: ShoppingBag, label: "Jual Beli" },
  ];

  const loadFiqih = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchFiqih(topic);
      setContent(text);
      if (topic !== customQuery) {
          setCustomQuery("");
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat fiqih.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiqih(activeTopic);
  }, [activeTopic]);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!customQuery.trim()) return;
      loadFiqih(customQuery);
      setActiveTopic(""); // clear active tab
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 rounded-[2.5rem] p-6 md:p-8 text-center mb-8 border border-emerald-200 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60"></div>
        <h2 className="relative z-10 text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3 mb-2">
          <Scale className="text-emerald-600" size={32} />
          Fiqih Sehari-hari
        </h2>
        <p className="relative z-10 text-gray-600 text-sm max-w-xl mx-auto leading-relaxed mb-6">
          Panduan praktis hukum fiqih untuk aktivitas sehari-hari, lengkap dengan dalil Al-Quran atau Hadist.
        </p>
        
        <div className="relative z-10 max-w-lg mx-auto mb-6">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <input 
                    type="text" 
                    placeholder="Tanyakan hukum spesifik... (Cth: hukum menunda bayar hutang)" 
                    value={customQuery}
                    onChange={e => setCustomQuery(e.target.value)}
                    className="w-full pl-5 pr-12 py-3.5 bg-white border border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm"
                />
                <button type="submit" disabled={!customQuery.trim()} className="absolute right-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                    <Search size={18} />
                </button>
            </form>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTopic === t.id 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" 
                  : "bg-white text-gray-600 border border-emerald-100 hover:bg-emerald-50 hover:text-emerald-800"
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
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-emerald-600 gap-4"
              >
                <Loader2 className="animate-spin" size={40} />
                <span className="text-sm font-bold tracking-widest uppercase text-emerald-700/70">Mencari Dalil & Panduan...</span>
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
                    <button onClick={() => loadFiqih(activeTopic || customQuery)} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">
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
                className="prose prose-emerald max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-loose prose-a:text-emerald-600 font-sans md:px-6 prose-strong:text-emerald-900"
              >
                <Markdown>{content || ""}</Markdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
