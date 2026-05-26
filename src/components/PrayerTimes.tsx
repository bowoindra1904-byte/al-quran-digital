import { useState, useEffect } from "react";
import { Clock, MapPin, Loader2, Sunrise, Sun, Sunset, Moon, Search } from "lucide-react";
import { motion } from "motion/react";

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function PrayerTimes() {
  const [city, setCity] = useState("Jakarta");
  const [searchInput, setSearchInput] = useState("Jakarta");
  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");

  const fetchTimings = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      // Method 20 = Kemenag RI
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
          cityName
        )}&country=Indonesia&method=20`
      );
      
      if (!response.ok) {
         throw new Error("Gagal mengambil data jadwal sholat");
      }
      
      const data = await response.json();
      
      if (data.code === 200) {
        setTimings(data.data.timings);
        setDate(data.data.date.readable);
        setCity(cityName);
      } else {
        throw new Error("Kota tidak ditemukan atau data tidak tersedia");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimings(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchTimings(searchInput.trim());
    }
  };

  const PRAYERS = [
    { id: "Fajr", name: "Subuh", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "Sunrise", name: "Terbit", icon: Sunrise, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "Dhuhr", name: "Dzuhur", icon: Sun, color: "text-amber-500", bg: "bg-amber-50" },
    { id: "Asr", name: "Ashar", icon: Sun, color: "text-yellow-600", bg: "bg-yellow-50" },
    { id: "Maghrib", name: "Maghrib", icon: Sunset, color: "text-rose-500", bg: "bg-rose-50" },
    { id: "Isha", name: "Isya", icon: Moon, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-emerald-50/50 pointer-events-none">
          <Clock size={200} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-1">
              <Clock className="text-emerald-500" size={24} />
              Jadwal Sholat
            </h2>
            <p className="text-sm text-gray-500">Berdasarkan Kemenag RI (Metode 20)</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari kota (misal: Bandung, Surabaya...)"
              className="w-full pl-11 pr-32 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium text-sm"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Cari Kota
            </button>
          </div>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 text-emerald-600">
          <Loader2 className="animate-spin" size={32} />
          <p className="font-medium">Memuat jadwal sholat...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 text-center">
          <p className="font-medium mb-1">Terjadi Kesalahan</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : timings ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 capitalize flex items-center justify-center gap-2 mb-2">
              <MapPin size={20} className="text-emerald-500" />
              Kota {city}
            </h3>
            <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-4 py-1.5 rounded-full">
              {date}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRAYERS.map((prayer, index) => {
              const Icon = prayer.icon;
              const time = timings[prayer.id as keyof PrayerTimesData];
              
              return (
                <motion.div
                  key={prayer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-white hover:shadow-md cursor-default transition-all group flex flex-col items-center text-center gap-3"
                >
                  <div className={`p-3 rounded-2xl ${prayer.bg} ${prayer.color} mb-1 flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                      {prayer.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
