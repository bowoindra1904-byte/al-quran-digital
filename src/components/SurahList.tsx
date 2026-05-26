import { SurahSummary, LastRead } from "../types";
import { Search, BookOpen, ChevronRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface SurahListProps {
  surahs: SurahSummary[];
  onSelectSurah: (nomor: number) => void;
  lastRead: LastRead | null;
}

export default function SurahList({ surahs, onSelectSurah, lastRead }: SurahListProps) {
  const [search, setSearch] = useState("");

  const filteredSurahs = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      s.arti.toLowerCase().includes(search.toLowerCase()) ||
      s.nomor.toString() === search
  );

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      {/* Hero Section */}
      <div className="px-4 mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-700 rounded-3xl p-6 md:p-10 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <BookOpen size={240} />
          </div>
          
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Al-Quran Digital
            </h1>
            <p className="text-emerald-100 mb-6 leading-relaxed">
              Dilengkapi dengan Tafsir, Asbabun Nuzul, dan pemahaman makna yang mendalam.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-emerald-50">
              <ShieldCheck size={16} className="text-emerald-300" />
              Sumber Data: API Kemenag RI & Tafsir Ibnu Katsir
            </div>
          </div>
        </div>

        {/* Last Read Card */}
        {lastRead && (
          <div 
            onClick={() => onSelectSurah(lastRead.surahNo)}
            className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">
                  Terakhir Dibaca
                </p>
                <p className="text-gray-900 font-semibold group-hover:text-emerald-600 transition-colors">
                  {lastRead.surahName} <span className="text-gray-400 font-normal">Ayat {lastRead.ayatNo}</span>
                </p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        )}
      </div>

      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md pt-2 pb-4 flex flex-col gap-4">
        <div className="px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama surah, arti, atau nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 text-base"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-4">
        {filteredSurahs.map((surah, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
            key={surah.nomor}
            onClick={() => onSelectSurah(surah.nomor)}
            className="group p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl text-gray-400 group-hover:text-emerald-600 font-medium transition-colors">
                {surah.nomor}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {surah.namaLatin}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
                  {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                </p>
              </div>
            </div>
            <div className="text-xl font-arabic text-emerald-600 text-right font-medium">
              {surah.nama}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Tidak ada surah yang cocok dengan pencarian "{search}".
        </div>
      )}
    </div>
  );
}
