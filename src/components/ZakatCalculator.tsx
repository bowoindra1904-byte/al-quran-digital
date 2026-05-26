import { useState } from "react";
import { Calculator } from "lucide-react";

export default function ZakatCalculator() {
  const [activeTab, setActiveTab] = useState<"penghasilan" | "fitrah" | "maal">("penghasilan");
  
  // Tab Penghasilan
  const [penghasilan, setPenghasilan] = useState<string>("");
  const [bonus, setBonus] = useState<string>("");
  
  // Tab Maal (Harta)
  const [tabungan, setTabungan] = useState<string>("");
  const [emas, setEmas] = useState<string>("");
  const [hutang, setHutang] = useState<string>("");
  
  // Tab Fitrah
  const [jiwa, setJiwa] = useState<string>("1");
  const [hargaBeras, setHargaBeras] = useState<string>("15000");

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
  };
  
  const parseNum = (val: string) => Number(val.replace(/\D/g, "")) || 0;
  
  const hitungZakatPenghasilan = () => {
    const total = parseNum(penghasilan) + parseNum(bonus);
    // Asumsi Nisab per bulan sekitar 6.8 juta (Berasaskan standar 85gr emas per tahun)
    const nisabBulan = 6800000;
    const wajib = total >= nisabBulan;
    const zakat = wajib ? total * 0.025 : 0;
    return { total, wajib, zakat, nisab: nisabBulan };
  };

  const hitungZakatMaal = () => {
    const total = parseNum(tabungan) + parseNum(emas) - parseNum(hutang);
    const nisabEmas = 85000000; // Asumsi 85 gram emas = 85 juta Rupiah
    const wajib = total >= nisabEmas;
    const zakat = wajib ? total * 0.025 : 0;
    return { total, wajib, zakat, nisab: nisabEmas };
  };

  const hitungZakatFitrah = () => {
    const totalJiwa = parseNum(jiwa);
    const harga = parseNum(hargaBeras);
    const zakat = totalJiwa * harga * 2.5; // 2.5 kg beras
    return { zakat };
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-10 px-4">
      <div className="bg-emerald-50 rounded-[2.5rem] p-6 text-center mb-8 border border-emerald-200 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3 mb-2">
          <Calculator className="text-emerald-600" size={32} />
          Kalkulator Zakat
        </h2>
        <p className="text-gray-600 text-sm max-w-sm mx-auto">
          Hitung kewajiban zakat harta, penghasilan, atau fitrah dengan ringkas.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="flex bg-gray-100 p-1.5 rounded-full mb-8 max-w-full overflow-x-auto hide-scrollbar">
          {[
            { id: "penghasilan", label: "Penghasilan" },
            { id: "maal", label: "Zakat Maal" },
            { id: "fitrah", label: "Zakat Fitrah" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[110px] py-3 text-sm font-semibold rounded-full transition-all ${
                activeTab === tab.id ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "penghasilan" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penghasilan / Gaji per Bulan (Rp)</label>
              <input type="number" value={penghasilan} onChange={e => setPenghasilan(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: 8000000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bonus / THR / Lainnya (Rp)</label>
              <input type="number" value={bonus} onChange={e => setBonus(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: 1000000" />
            </div>
            
            <div className={`p-6 md:p-8 rounded-3xl mt-8 transition-all ${hitungZakatPenghasilan().wajib ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200/50' : 'bg-gray-100 text-gray-500'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-sm">Status Wajib Zakat:</span>
                <span className="font-bold tracking-widest uppercase">{hitungZakatPenghasilan().wajib ? 'WAJIB' : 'BELUM WAJIB'}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-sm opacity-80">Nisab (Batas Minimal):</span>
                <span className="opacity-90">{formatRupiah(hitungZakatPenghasilan().nisab)}/bln</span>
              </div>
              <div className="pt-6 border-t border-current/20">
                <span className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-widest text-xs">Total yang Harus Dibayarkan</span>
                <span className="text-4xl font-bold">{formatRupiah(hitungZakatPenghasilan().zakat)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ... Similar blocks for Maal and Fitrah ... */}
        {activeTab === "maal" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Tabungan / Kas (Rp)</label>
               <input type="number" value={tabungan} onChange={e => setTabungan(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: 50000000" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Emas / Perak / Saham (Rp)</label>
               <input type="number" value={emas} onChange={e => setEmas(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: 40000000" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Hutang Jatuh Tempo (Rp)</label>
               <input type="number" value={hutang} onChange={e => setHutang(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: 0" />
            </div>
            
            <div className={`p-6 md:p-8 rounded-3xl mt-8 transition-all ${hitungZakatMaal().wajib ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200/50' : 'bg-gray-100 text-gray-500'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-sm">Status Wajib (Haul 1 Thn):</span>
                <span className="font-bold tracking-widest uppercase">{hitungZakatMaal().wajib ? 'WAJIB' : 'BELUM WAJIB'}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-sm opacity-80">Nisab (Setara 85g Emas):</span>
                <span className="opacity-90">{formatRupiah(hitungZakatMaal().nisab)}</span>
              </div>
              <div className="pt-6 border-t border-current/20">
                <span className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-widest text-xs">Total Zakat Maal (2.5%)</span>
                <span className="text-4xl font-bold">{formatRupiah(hitungZakatMaal().zakat)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "fitrah" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Jiwa</label>
               <input type="number" value={jiwa} onChange={e => setJiwa(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" min="1" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Harga Beras per Kg Asumsi (Rp)</label>
               <input type="number" value={hargaBeras} onChange={e => setHargaBeras(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
               <p className="text-xs text-gray-400 mt-2 font-medium bg-gray-50 p-2 rounded-lg inline-block mix-blend-multiply">*Zakat per jiwa = 2.5 kg beras / makanan pokok daerah setempat.</p>
            </div>
            
            <div className="p-6 md:p-8 rounded-3xl mt-8 bg-emerald-700 text-white shadow-lg shadow-emerald-200/50">
              <div className="pt-2">
                <span className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-widest text-xs">Total Zakat Fitrah</span>
                <span className="text-4xl font-bold">{formatRupiah(hitungZakatFitrah().zakat)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
