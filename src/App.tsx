/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { SurahSummary, SurahDetail, AppSettings, LastRead } from "./types";
import { fetchAllSurahs, fetchSurahDetail } from "./api";
import SurahList from "./components/SurahList";
import SurahDetailView from "./components/SurahDetail";
import LifeSolution from "./components/LifeSolution";
import Tasbih from "./components/Tasbih";
import PrayerTimes from "./components/PrayerTimes";
import Muhasabah from "./components/Muhasabah";
import IslamicHistory from "./components/IslamicHistory";
import DailyVerseModal from "./components/DailyVerseModal";
import ZakatCalculator from "./components/ZakatCalculator";
import DoaHarian from "./components/DoaHarian";
import FiqihSehariHari from "./components/FiqihSehariHari";
import { Loader2, BookOpen, HeartHandshake, Target, Clock, Compass, BookText, Calculator, BookMarked, Scale } from "lucide-react";

const DEFAULT_SETTINGS: AppSettings = {
  qari: "05",
  arabicSize: 36, // 36px font size default
  showLatin: true,
  showTranslation: true,
};

type ViewState = "quran" | "solution" | "tasbih" | "prayer" | "muhasabah" | "history" | "zakat" | "doa" | "fiqih";

export default function App() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View State
  const [currentView, setCurrentView] = useState<ViewState>("quran");

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("quran_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Last Read
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    const saved = localStorage.getItem("quran_last_read");
    return saved ? JSON.parse(saved) : null;
  });

  const [showDailyVerseModal, setShowDailyVerseModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("quran_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (lastRead) {
      localStorage.setItem("quran_last_read", JSON.stringify(lastRead));
    }
  }, [lastRead]);

  // Show daily verse if not already shown in this session
  useEffect(() => {
    const hasSeenDailyVerse = sessionStorage.getItem("has_seen_daily_verse");
    if (!hasSeenDailyVerse) {
      setShowDailyVerseModal(true);
      sessionStorage.setItem("has_seen_daily_verse", "true");
    }
  }, []);

  // State for selected Surah view
  const [selectedSurahNo, setSelectedSurahNo] = useState<number | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchAllSurahs()
      .then((data) => {
        setSurahs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelectSurah = async (nomor: number) => {
    setSelectedSurahNo(nomor);
    setDetailLoading(true);
    try {
      const data = await fetchSurahDetail(nomor);
      setSurahDetail(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedSurahNo(null);
    setSurahDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-emerald-600">
          <Loader2 className="animate-spin w-10 h-10" />
          <p className="font-medium">Memuat Ayat Suci...</p>
        </div>
      </div>
    );
  }

  if (error && !surahs.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md text-center">
          <p className="font-medium mb-2">Terjadi Kesalahan</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Top Navigation */}
        {!selectedSurahNo && (
          <header className="mb-10 mt-2">
            <div className="bg-white rounded-3xl p-1.5 border border-gray-200 shadow-sm flex overflow-x-auto hide-scrollbar gap-1 max-w-full">
              {[
                { id: "quran", icon: BookOpen, label: "Al-Quran" },
                { id: "doa", icon: BookMarked, label: "Doa" },
                { id: "solution", icon: HeartHandshake, label: "Solusi" },
                { id: "fiqih", icon: Scale, label: "Fiqih" },
                { id: "muhasabah", icon: Compass, label: "Muhasabah" },
                { id: "history", icon: BookText, label: "Sejarah" },
                { id: "zakat", icon: Calculator, label: "Zakat" },
                { id: "tasbih", icon: Target, label: "Tasbih" },
                { id: "prayer", icon: Clock, label: "Jadwal" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewState)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 ${
                    currentView === item.id 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" 
                      : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </header>
        )}

        {currentView === "solution" ? (
          <LifeSolution />
        ) : currentView === "doa" ? (
          <DoaHarian />
        ) : currentView === "fiqih" ? (
          <FiqihSehariHari />
        ) : currentView === "muhasabah" ? (
          <Muhasabah />
        ) : currentView === "history" ? (
          <IslamicHistory />
        ) : currentView === "zakat" ? (
          <ZakatCalculator />
        ) : currentView === "tasbih" ? (
          <Tasbih />
        ) : currentView === "prayer" ? (
          <PrayerTimes />
        ) : (
          <>
            {selectedSurahNo && surahDetail ? (
              <SurahDetailView
                surah={surahDetail}
                onBack={handleBack}
                settings={settings}
                onChangeSettings={setSettings}
                onMarkLastRead={(ayatNo) => setLastRead({ surahNo: surahDetail.nomor, ayatNo, surahName: surahDetail.namaLatin })}
              />
            ) : selectedSurahNo && detailLoading ? (
              <div className="flex items-center justify-center py-32 text-emerald-600 gap-3">
                <Loader2 className="animate-spin w-8 h-8" />
                <span className="font-medium">Memuat Surah...</span>
              </div>
            ) : (
              <SurahList
                surahs={surahs}
                onSelectSurah={handleSelectSurah}
                lastRead={lastRead}
              />
            )}
          </>
        )}
      </main>
      <DailyVerseModal isOpen={showDailyVerseModal} onClose={() => setShowDailyVerseModal(false)} />
    </div>
  );
}
