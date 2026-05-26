export interface SurahSummary {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends SurahSummary {
  ayat: Ayat[];
}

export interface AppSettings {
  qari: string;
  arabicSize: number; // in pixels
  showLatin: boolean;
  showTranslation: boolean;
}

export interface LastRead {
  surahNo: number;
  ayatNo: number;
  surahName: string;
}

export const QARI_LIST: Record<string, string> = {
  "01": "Abdullah Al-Juhany",
  "02": "Abdul Muhsir Al-Qasim",
  "03": "Abdurrahman as-Sudais",
  "04": "Ibrahim Al-Dawsari",
  "05": "Misyari Rasyid Al-Afasi",
};
