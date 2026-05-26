import { SurahDetail, AppSettings, QARI_LIST } from "../types";
import { ArrowLeft, Settings2, X } from "lucide-react";
import VerseCard from "./VerseCard";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface SurahDetailViewProps {
  surah: SurahDetail;
  onBack: () => void;
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  onMarkLastRead: (ayatNo: number) => void;
}

export default function SurahDetailView({ surah, onBack, settings, onChangeSettings, onMarkLastRead }: SurahDetailViewProps) {
  const [showSettings, setShowSettings] = useState(false);

  const toggleLatin = () => onChangeSettings({ ...settings, showLatin: !settings.showLatin });
  const toggleTranslation = () => onChangeSettings({ ...settings, showTranslation: !settings.showTranslation });
  const updateFontSize = (size: number) => onChangeSettings({ ...settings, arabicSize: size });
  const updateQari = (qariId: string) => onChangeSettings({ ...settings, qari: qariId });

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md pt-4 pb-4 border-b border-gray-100 px-4 md:px-0 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali</span>
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <Settings2 size={20} />
            <span className="font-medium hidden sm:inline">Pengaturan Membaca</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              {surah.namaLatin}
              <span className="text-xl font-normal text-gray-400">({surah.arti})</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              {surah.tempatTurun} • {surah.jumlahAyat} Ayat • Surah Ke-{surah.nomor}
            </p>
          </div>
          <div className="text-4xl text-emerald-600 font-arabic font-medium text-right drop-shadow-sm">
            {surah.nama}
          </div>
        </div>
      </div>

      {/* Settings Action Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8 px-4 md:px-0"
          >
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm relative">
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Settings2 size={18} className="text-emerald-500" />
                Pengaturan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Toggles */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Tampilan Teks</h4>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tampilkan Teks Latin</span>
                    <input type="checkbox" className="sr-only peer" checked={settings.showLatin} onChange={toggleLatin} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tampilkan Terjemahan (ID)</span>
                    <input type="checkbox" className="sr-only peer" checked={settings.showTranslation} onChange={toggleTranslation} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                
                {/* Sizing & Audio */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Ukuran Ayat</h4>
                      <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{settings.arabicSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="24" 
                      max="60" 
                      value={settings.arabicSize} 
                      onChange={(e) => updateFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pilih Qari</h4>
                    <select 
                      value={settings.qari}
                      onChange={(e) => updateQari(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      {Object.entries(QARI_LIST).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description / Introduction */}
      <div className="px-4 md:px-0 mb-8">
        <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 shadow-sm prose prose-sm prose-emerald max-w-none text-gray-700">
          <p dangerouslySetInnerHTML={{ __html: surah.deskripsi }} />
        </div>
      </div>

      {/* Basmalah (except for Surah At-Tawbah (9)) */}
      {surah.nomor !== 9 && (
        <div className="flex justify-center mb-10 overflow-hidden">
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-4xl md:text-5xl text-emerald-800 font-arabic font-medium tracking-widest text-center"
            style={{ fontSize: `${settings.arabicSize + 4}px` }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>
        </div>
      )}

      {/* Verses List */}
      <div className="px-4 md:px-0">
        {surah.ayat.map((ayat, index) => (
          <motion.div
            key={ayat.nomorAyat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.3) }}
          >
            <VerseCard 
              ayat={ayat} 
              surahName={surah.namaLatin} 
              settings={settings}
              onMarkLastRead={onMarkLastRead}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
