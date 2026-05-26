import { useState, useEffect } from "react";
import { Ayat, AppSettings } from "../types";
import { fetchTafsirAI } from "../api";
import { Sparkles, Loader2, PlayCircle, StopCircle, ChevronDown, ChevronUp, Bookmark, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import ShareVerseModal from "./ShareVerseModal";

interface VerseCardProps {
  ayat: Ayat;
  surahName: string;
  settings: AppSettings;
  onMarkLastRead: (ayatNo: number) => void;
}

export default function VerseCard({ ayat, surahName, settings, onMarkLastRead }: VerseCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Re-create audio when Qari changes
  useEffect(() => {
    const audioUrl = ayat.audio[settings.qari] || ayat.audio["05"];
    const newAudio = new Audio(audioUrl);
    
    newAudio.onended = () => setIsPlaying(false);
    setAudio(newAudio);

    return () => {
      newAudio.pause();
    };
  }, [ayat, settings.qari]);

  // Audio Playback
  const toggleAudio = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== "AbortError") console.error(error);
        });
      }
      setIsPlaying(true);
      onMarkLastRead(ayat.nomorAyat); // Mark as read when playing
    }
  };

  const handleFetchTafsir = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
    onMarkLastRead(ayat.nomorAyat); // Mark as read when opening tafsir
    
    if (tafsirText) return; // Already cached

    try {
      setTafsirLoading(true);
      setError(null);
      const text = await fetchTafsirAI(surahName, ayat.nomorAyat, ayat.teksIndonesia);
      setTafsirText(text);
    } catch (err: any) {
      setError(err.message || "Gagal memuat tafsir.");
    } finally {
      setTafsirLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-4">
      {/* Arabic and actions */}
      <div className={`flex flex-col md:flex-row justify-between items-start gap-6 pb-6 mb-6 ${settings.showLatin || settings.showTranslation ? 'border-b border-gray-50' : ''}`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm shrink-0">
            {ayat.nomorAyat}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleAudio}
              className={`transition-colors ${isPlaying ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-500'}`}
              title="Putar Audio"
            >
              {isPlaying ? <StopCircle size={24} /> : <PlayCircle size={24} />}
            </button>
            <button
              onClick={() => onMarkLastRead(ayat.nomorAyat)}
              className="text-gray-400 hover:text-emerald-500 transition-colors"
              title="Tandai Terakhir Dibaca"
            >
              <Bookmark size={20} />
            </button>
            <button
              onClick={() => setShareModalOpen(true)}
              className="text-gray-400 hover:text-emerald-500 transition-colors mt-1"
              title="Bagikan Ayat"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        <p 
          className="text-right leading-loose md:leading-loose text-gray-900 font-arabic flex-1 w-full" 
          dir="rtl"
          style={{ fontSize: `${settings.arabicSize}px` }}
        >
          {ayat.teksArab}
        </p>
      </div>

      {/* Translations */}
      {(settings.showLatin || settings.showTranslation) && (
        <div className="space-y-3">
          {settings.showLatin && (
            <p className="text-sm font-medium tracking-wide text-emerald-600">
              {ayat.teksLatin}
            </p>
          )}
          {settings.showTranslation && (
            <p className="text-gray-700 leading-relaxed">
              {ayat.teksIndonesia}
            </p>
          )}
        </div>
      )}

      {/* AI Tafsir Button */}
      <div className="mt-6 pt-4 border-t border-gray-50">
        <button
          onClick={handleFetchTafsir}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
        >
          <Sparkles size={16} />
          {expanded ? "Tutup Makna & Asbabun Nuzul" : "Lihat Makna & Asbabun Nuzul"}
          {expanded ? <ChevronUp size={16} className="ml-1 opacity-70" /> : <ChevronDown size={16} className="ml-1 opacity-70" />}
        </button>
      </div>

      {/* Expanded Tafsir Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl border border-emerald-100/50">
              {tafsirLoading ? (
                <div className="flex items-center gap-3 text-emerald-600 py-4">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm font-medium">AI sedang memuat tafsir, asbabun nuzul, dan makna...</span>
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm py-2">
                  {error}
                </div>
              ) : tafsirText ? (
                <div className="prose prose-sm md:prose-base prose-emerald max-w-none text-gray-700">
                  <div className="markdown-body">
                    <Markdown>{tafsirText}</Markdown>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareVerseModal
        ayat={ayat}
        surahName={surahName}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        audioSrc={ayat.audio[settings.qari] || ayat.audio["05"]}
      />
    </div>
  );
}
