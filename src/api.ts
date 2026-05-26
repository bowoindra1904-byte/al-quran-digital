import { SurahSummary, SurahDetail } from "./types";

const BASE_URL = "https://equran.id/api/v2";

export async function fetchAllSurahs(): Promise<SurahSummary[]> {
  const response = await fetch(`${BASE_URL}/surat`);
  if (!response.ok) {
    throw new Error("Gagal mengambil daftar Surah");
  }
  const result = await response.json();
  return result.data;
}

export async function fetchSurahDetail(nomor: number): Promise<SurahDetail> {
  const response = await fetch(`${BASE_URL}/surat/${nomor}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil detail Surah");
  }
  const result = await response.json();
  return result.data;
}

export async function fetchTafsirAI(
  surahName: string,
  verseNumber: number,
  text: string
): Promise<string> {
  const response = await fetch("/api/tafsir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ surahName, verseNumber, text }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mendapatkan tafsir AI");
  }
  
  const data = await response.json();
  return data.text;
}

export async function fetchLifeSolution(question: string): Promise<string> {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mendapatkan solusi");
  }
  
  const data = await response.json();
  return data.text;
}

export async function fetchMuhasabah(): Promise<string> {
  const response = await fetch("/api/muhasabah");
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal memuat renungan");
  }
  
  const data = await response.json();
  return data.text;
}

export async function fetchDailyVerse(): Promise<any> {
  const response = await fetch("/api/daily-verse");
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal memuat ayat harian");
  }
  
  return await response.json();
}

export async function fetchIslamicHistory(topic: string = "random"): Promise<string> {
  const response = await fetch(`/api/history?topic=${encodeURIComponent(topic)}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal memuat kisah sejarah");
  }
  
  const data = await response.json();
  return data.text;
}

export async function fetchFiqih(topic: string): Promise<string> {
  const response = await fetch(`/api/fiqih?topic=${encodeURIComponent(topic)}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal memuat fiqih");
  }
  
  const data = await response.json();
  return data.text;
}

export async function fetchVerseImage(translation: string): Promise<string> {
  const response = await fetch("/api/generate-verse-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ translation }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal menghasilkan gambar");
  }
  
  const data = await response.json();
  return data.imageUrl;
}
