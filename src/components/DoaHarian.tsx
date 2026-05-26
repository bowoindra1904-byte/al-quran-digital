import { useState, useMemo } from "react";
import { BookMarked, Search, Heart, Shield, Sunrise, Moon } from "lucide-react";
import { motion } from "motion/react";

const DOA_LIST = [
  { id: 1, title: "Doa Bangun Tidur", category: "Harian", icon: Sunrise, arab: "اَلْحَمْدُ ِللهِ الَّذِىْ اَحْيَانَا بَعْدَمَآ اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ", latin: "Alhamdu lillahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur", arti: "Segala puji bagi Allah yang telah menghidupkan kami sesudah kami mati (membangunkan dari tidur) dan hanya kepada-Nya kami dikembalikan." },
  { id: 2, title: "Doa Sebelum Tidur", category: "Harian", icon: Moon, arab: "بِسْمِكَ اللّهُمَّ اَحْيَا وَ بِسْمِكَ اَمُوْتُ", latin: "Bismikallahumma ahyaa wa bismika amuut", arti: "Dengan nama-Mu ya Allah aku hidup, dan dengan nama-Mu aku mati." },
  { id: 3, title: "Doa Kedua Orang Tua", category: "Keluarga", icon: Heart, arab: "اَللّٰهُمَّ اغْفِرْلِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَاكَمَارَبَّيَانِيْ صَغِيْرَا", latin: "Allahummaghfirlii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa", arti: "Ya Allah, ampunilah aku dan kedua orang tuaku, serta berilah rahmat kepada keduanya, sebagaimana mereka mendidikku di waktu kecil." },
  { id: 4, title: "Doa Sapu Jagat (Kebaikan Dunia Akhirat)", category: "Utama", icon: BookMarked, arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", latin: "Rabbanaa aatinaa fiddunyaa hasanah wa fil aakhirati hasanah wa qinaa 'adzaaban naar", arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka." },
  { id: 5, title: "Doa Mohon Perlindungan", category: "Benteng", icon: Shield, arab: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", latin: "Bismillahilladzi laa yadhurru ma'asmihi syai'un fil ardhi wa laa fis samaa'i wa huwas samii'ul 'aliim", arti: "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan berbahaya, Dia-lah Yang Maha Mendengar lagi Maha Mengetahui." },
  { id: 6, title: "Doa Keluar Rumah", category: "Harian", icon: Sunrise, arab: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", latin: "Bismillahi, tawakkaltu 'alallah, laa haula wa laa quwwata illaa billaah", arti: "Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan (pertolongan) Allah." },
  { id: 7, title: "Doa Ketika Sedih / Tertimpa Musibah", category: "Utama", icon: Heart, arab: "إِنَّا لِلّٰهِ وَإِنَّـا إِلَيْهِ رَاجِعُوْنَ، اَللَّهُمَّ أْجُرْنِيْ فِيْ مُصِيْبَتِيْ وَأَخْلِفْ لِيْ خَيْرًا مِنْهَا", latin: "Inna lillaahi wa innaa ilaihi raaji'uun, Allahumma'jurnii fii mushiibatii wa akhlif lii khairan minhaa", arti: "Sesungguhnya kami adalah milik Allah dan kepada-Nya lah kami kembali. Ya Allah, berilah ganjaran atas musibahku ini dan gantilah dengan yang lebih baik." }
];

export default function DoaHarian() {
  const [search, setSearch] = useState("");
  const [activeKategori, setActiveKategori] = useState("Semua");

  const categories = ["Semua", ...Array.from(new Set(DOA_LIST.map(d => d.category)))];

  const filteredDoa = useMemo(() => {
    return DOA_LIST.filter(doa => {
      const matchSearch = doa.title.toLowerCase().includes(search.toLowerCase()) || doa.arti.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeKategori === "Semua" || doa.category === activeKategori;
      return matchSearch && matchCat;
    });
  }, [search, activeKategori]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-12 px-4">
      <div className="bg-emerald-50 rounded-[2.5rem] p-6 text-center mb-8 border border-emerald-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60"></div>
        <h2 className="relative z-10 text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3 mb-2">
          <BookMarked className="text-emerald-600" size={32} />
          Doa Harian Pilihan
        </h2>
        <p className="relative z-10 text-gray-600 text-sm max-w-sm mx-auto mb-6">
          Kumpulan doa pendek sehari-hari untuk membentengi dan memberkahi setiap langkah Anda.
        </p>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari doa bangun tidur, orang tua..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-emerald-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveKategori(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeKategori === cat 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" 
                    : "bg-white text-gray-500 hover:bg-emerald-100 border border-emerald-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDoa.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Search className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="font-medium">Doa tidak ditemukan.</p>
            <p className="text-sm">Coba gunakan kata kunci lain.</p>
          </div>
        ) : (
          filteredDoa.map((doa, i) => (
            <motion.div 
              key={doa.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <doa.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none">{doa.title}</h3>
                  <span className="text-xs text-emerald-600 font-medium tracking-wide uppercase mt-1 block">{doa.category}</span>
                </div>
              </div>
              
              <div className="space-y-5">
                <p className="text-2xl md:text-3xl font-arabic leading-loose text-right text-gray-900" dir="rtl">
                  {doa.arab}
                </p>
                
                <div className="w-full h-px bg-gray-100"></div>
                
                <p className="text-emerald-700/80 font-medium text-sm leading-relaxed">
                  {doa.latin}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed italic border-l-2 border-emerald-200 pl-4 mt-2">
                  Artinya: "{doa.arti}"
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
