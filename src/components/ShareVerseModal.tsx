import { useState, useRef, useEffect } from "react";
import { Ayat } from "../types";
import { fetchVerseImage } from "../api";
import { X, Copy, Download, Sparkles, Loader2, PlayCircle, StopCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as htmlToImage from "html-to-image";

interface ShareVerseModalProps {
  ayat: Ayat;
  surahName: string;
  isOpen: boolean;
  onClose: () => void;
  audioSrc?: string;
}

export default function ShareVerseModal({ ayat, surahName, isOpen, onClose, audioSrc }: ShareVerseModalProps) {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loadingBg, setLoadingBg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioSrc) {
      const newAudio = new Audio(audioSrc);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      return () => {
        newAudio.pause();
      };
    }
  }, [audioSrc]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
      setCopied(false);
      setError(null);
      setFinalImage(null);
    }
  }, [isOpen, audio]);

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
    }
  };

  const handleCopyText = async () => {
    const textToCopy = `Surah ${surahName} Ayat ${ayat.nomorAyat}\n\n${ayat.teksArab}\n\n${ayat.teksLatin}\n\n"${ayat.teksIndonesia}"`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  const handleGenerateBg = async () => {
    setLoadingBg(true);
    setError(null);
    try {
      const imageUrl = await fetchVerseImage(ayat.teksIndonesia);
      setBgImage(imageUrl);
    } catch (err: any) {
      setError(err.message || "Gagal membuat gambar background.");
    } finally {
      setLoadingBg(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    
    try {
      const image = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 2,
        backgroundColor: "#064e3b",
      });
      
      setFinalImage(image); // display fallback to user in case download blocked
      
      try {
        const link = document.createElement("a");
        link.href = image;
        link.download = `Quran-${surahName}-Ayat-${ayat.nomorAyat}.png`;
        link.click();
      } catch (e) {
        // sandbox might block direct click
      }
    } catch (err: any) {
      console.error("Gagal mengunduh gambar: ", err);
      setError("Gagal membuat gambar: " + err?.message);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col relative shadow-2xl z-20"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <h3 className="font-bold text-gray-900 mx-auto text-lg text-center flex-1">Bagikan Ayat</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors absolute right-4"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full flex flex-col md:flex-row gap-6 p-6 bg-gray-50/50">
          
          {/* Poster Preview Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            
            {finalImage ? (
              <div className="w-full flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-2xl text-sm border border-emerald-200 w-full max-w-[400px]">
                  <p className="font-semibold mb-1 text-emerald-900 border-b border-emerald-200/50 pb-1">✅ Gambar Siap!</p>
                  Jika unduhan otomatis tidak berjalan, <b>Tekan lama (HP)</b> atau <b>Klik Kanan (PC)</b> pada gambar di bawah lalu pilih "Simpan / Save".
                </div>
                <img src={finalImage} alt="Poster Ayat" className="w-full max-w-[400px] h-auto rounded-3xl shadow-xl border border-gray-200" />
                <button 
                  onClick={() => setFinalImage(null)} 
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-4"
                >
                  Tutup Preview
                </button>
              </div>
            ) : (
              <>
                {/* The actual poster div to capture */}
                <div 
                  ref={posterRef}
                  className={`w-full max-w-[400px] aspect-[4/5] rounded-3xl relative overflow-hidden flex flex-col shadow-lg transition-all duration-700 ease-in-out ${bgImage ? '' : 'bg-gradient-to-br from-emerald-800 to-teal-900'}`}
                  style={{
                    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                  <div className="relative z-10 flex flex-col h-full p-8 text-white">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-emerald-100/80 font-medium text-sm tracking-widest uppercase">
                        Surah {surahName}
                      </span>
                      <span className="w-8 h-8 rounded-full border border-emerald-300/30 flex items-center justify-center text-xs font-bold text-emerald-100">
                        {ayat.nomorAyat}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-6">
                      <p className="text-2xl md:text-3xl font-arabic leading-loose text-right text-white drop-shadow-md" dir="rtl">
                        {ayat.teksArab}
                      </p>
                      
                      <div className="w-12 h-px bg-white/20 mx-auto"></div>

                      <p className="text-sm md:text-base font-medium leading-relaxed text-center text-white/90 drop-shadow">
                        "{ayat.teksIndonesia}"
                      </p>
                    </div>

                    <div className="mt-8 text-center text-xs text-white/50 tracking-widest uppercase">
                        Baca. Renungkan. Amalkan.
                    </div>
                  </div>
                </div>

                {/* Listen Audio Control */}
                <div className="mt-6">
                  <button
                      onClick={toggleAudio}
                      className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-100 hover:bg-emerald-200 px-5 py-2.5 rounded-full transition-colors"
                    >
                      {isPlaying ? <StopCircle size={20} /> : <PlayCircle size={20} />}
                      <span>{isPlaying ? 'Hentikan Audio' : 'Dengarkan Ayat'}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Controls Section */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Opsi Bagikan</h4>
              
              <button
                onClick={handleCopyText}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                {copied ? 'Tersalin!' : 'Salin Teks Saja'}
              </button>
              
              <div className="h-px bg-gray-100 w-full my-4"></div>
              
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium">Poster Gambar Statis</p>
                
                {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
                
                <button
                  onClick={handleGenerateBg}
                  disabled={loadingBg}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
                >
                  {loadingBg ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {loadingBg ? 'Meracik Gambar AI...' : 'Buat Background AI'}
                </button>
                
                <button
                  onClick={handleDownloadImage}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gray-900 border border-transparent text-white rounded-xl font-medium transition-colors hover:bg-gray-800"
                >
                  <Download size={18} />
                  Unduh Gambar
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
