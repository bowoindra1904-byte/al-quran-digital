import { useState, useRef, useEffect } from "react";
import { fetchLifeSolution } from "../api";
import { Send, Loader2, Sparkles, User, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function LifeSolution() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const responseText = await fetchLifeSolution(userMessage);
      
      // Add AI reply
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: responseText }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", content: `Maaf, terjadi kesalahan: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[80vh] bg-white rounded-3xl shadow-sm border border-emerald-100/60 overflow-hidden relative">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white/90 backdrop-blur shrink-0 z-10 flex text-left items-center gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
          <HeartHandshake size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Solusi Kehidupan</h2>
          <p className="text-sm text-gray-500">Bimbingan berdasarkan Al-Quran, Hadist & Nasihat Ulama</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Apa yang sedang membebani hati Anda?</h3>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed mb-8">
              "Dan Kami turunkan dari Al-Qur'an suatu yang menjadi penawar (obat) dan rahmat bagi orang-orang yang beriman." (QS. Al-Isra: 82)
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {['Merasa cemas akan masa depan', 'Kesulitan melunasi hutang', 'Masalah rumah tangga', 'Kehilangan arah hidup'].map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 rounded-full text-sm font-medium transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                </div>
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm text-gray-800'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-emerald max-w-none text-gray-700">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%] mr-auto">
             <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                <Sparkles size={20} />
             </div>
             <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-3">
               <Loader2 className="animate-spin text-emerald-500" size={18} />
               <span className="text-sm font-medium text-gray-500">Mencari petunjuk...</span>
             </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ceritakan problematika atau pertanyaan Anda..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-5 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none min-h-[60px] max-h-32 text-sm"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-[60px] w-[60px] shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all shadow-sm"
          >
            <Send size={20} className={input.trim() && !loading ? "translate-x-0.5 -translate-y-0.5" : ""} />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-xs text-gray-400">Tekan Enter untuk mengirim. Shift + Enter untuk baris baru.</p>
        </div>
      </div>
      
    </div>
  );
}
