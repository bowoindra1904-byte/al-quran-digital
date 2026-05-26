import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API endpoint to generate Tafsir & Asbabun Nuzul
  app.post("/api/tafsir", async (req, res) => {
    try {
      const { surahName, verseNumber, text } = req.body;
      
      if (!surahName || !verseNumber) {
         res.status(400).json({ error: "Missing required fields" });
         return;
      }

      const prompt = `Berikan penjelasan mendalam mengenai Asbabun Nuzul (sebab turunnya ayat) dan makna/kandungan/tafsir dari Al-Quran Surah ${surahName} ayat ${verseNumber}.
      
Teks terjemahannya untuk konteks: "${text}"

MOHON IKUTI PETUNJUK INI DENGAN KETAT:
1. Sumber Data Utama: Wajib merujuk pada pemahaman Tafsir Kemenag RI dan Tafsir Ibnu Katsir.
2. Jelaskan Asbabun Nuzul (konteks sejarah) jika ada. Jika tidak ada asbabun nuzul khusus, sebutkan bahwa ayat ini bersifat umum.
3. Jelaskan makna dan hikmah yang bisa diambil dari ayat ini untuk kehidupan sehari-hari.
4. Gunakan bahasa Indonesia yang menenangkan, sopan, dan mudah dipahami.
5. Format dengan Markdown yang bersih (gunakan bullet points jika perlu, bold untuk penekanan, pisahkan paragraf).
6. Di bagian akhir, tambahkan satu baris kecil (italic) yang menyatakan: "Disarikan dari: Tafsir Kemenag RI & Tafsir Ibnu Katsir".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Tafsir Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat tafsir dan asbabun nuzul dari AI." });
    }
  });

  // API endpoint to answer life problems
  app.post("/api/ask", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
         res.status(400).json({ error: "Missing required fields" });
         return;
      }

      const prompt = `Anda adalah asisten Islami yang bijaksana dan berilmu. Pengguna memiliki problematika kehidupan dan mencari solusi berdasarkan ajaran Islam.
      
Pertanyaan/Problematika: "${question}"

MOHON IKUTI PETUNJUK INI DENGAN KETAT:
1. Berikan jawaban yang menenangkan, empatik, bijaksana, dan solutif.
2. Wajib memberikan dalil penyemangat atau solusi dari Al-Quran (sebutkan nama surah dan ayatnya beserta artinya).
3. Wajib menyertakan pendukung dari Hadist Shahih yang relevan (sebutkan perawinya, misal H.R. Bukhari/Muslim).
4. Jika relevan, kutip nasihat/pendapat Ulama yang diakui (misal Imam Syafi'i, Imam Al-Ghazali, Ibnu Taimiyyah, dll).
5. Format jawaban menggunakan Markdown yang bersih. Gunakan bullet points, dan bold untuk penekanan.
6. Buat jawaban terstruktur: Pembukaan yang menenangkan, Dalil & Penjelasan (Al-Quran & Hadist), Nasihat Ulama (jika ada), dan Kesimpulan/Doa singkat di akhir.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      const errStr = error?.message || error?.toString() || "";
      if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429") || errStr.includes("Quota") || errStr.includes("quota")) {
        res.json({ text: "Tarik napas perlahan, dan ingatlah bahwa Allah mengetahui isi hatimu dan beban yang sedang kamu pikul.\n\nDalam menghadapi setiap masalah, serahkanlah hasilnya kepada Allah setelah berusaha sekuat tenaga. Ujian ini adalah cara Allah untuk mendidikmu dan menghapus kesalahan-kesalahanmu di masa lalu.\n\n**Al-Quran:**\n> *\"Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.\"* (QS. Al-Baqarah: 286)\n\n**Hadist:**\n> *\"Tidaklah seorang muslim tertimpa suatu kelelahan, atau penyakit, atau kekhawatiran, atau kesedihan, atau gangguan, bahkan duri yang melukainya melainkan Allah akan menghapus dosa-dosanya karenanya.\"* (HR. Bukhari dan Muslim)\n\nBersabarlah dan dirikanlah shalat. Pertolongan Allah sangat mesra bagi hamba-hamba-Nya yang bersabar." });
        return;
      }
      console.error("Ask Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat jawaban dari AI." });
    }
  });

  // API endpoint for Muhasabah (Life Perspective Shift)
  app.get("/api/muhasabah", async (req, res) => {
    try {
      const prompt = `Berikan satu pandangan, nasihat, atau renungan (muhasabah) Islami yang sangat mendalam dan menyentuh hati. Tujuannya adalah merombak total (paradigm shift) cara pandang manusia yang sedang tenggelam dalam kesibukan dunia, agar kembali menyadari tujuan sejati penciptaannya (akhirat dan penghambaan kepada Allah).

MOHON IKUTI PETUNJUK INI DENGAN KETAT:
1. Jangan beri salam atau pengantar basa-basi, langsung masuk ke kalimat yang menggugah relung hati.
2. Bahas tema fundamental (pilih salah satu secara acak: singkatnya waktu, hakekat dunia yang menipu, kematian yang mendadak, cinta Allah kepada pendosa yang bertaubat, atau ruginya menunda kebaikan).
3. Gunakan bahasa Indonesia yang puitis, tajam, reflektif, dan menenangkan jiwa.
4. Wajib sertakan kutipan 1 Ayat Al-Quran ATAU 1 Hadist yang sangat berkaitan sebagai landasan di tengah atau di akhir tulisan.
5. Format dalam Markdown yang rapi dan estetik (Gunakan kombinasi paragraf pendek, *italic* untuk penekanan emosi, atau blockquote untuk ayat/hadist).
6. Maksimal 3-4 paragraf yang padat makna.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      const errStr = error?.message || error?.toString() || "";
      if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429") || errStr.includes("Quota") || errStr.includes("quota")) {
        res.json({ text: "Dunia ini hanyalah tempat persinggahan sejenak.\n\nSetiap hela napas yang kita tarik, sejatinya semakin mendekatkan kita kepada perpisahan yang abadi dengan dunia ini. Namun seringkali kita membangun istana angan-angan, seolah kita akan hidup selamanya.\n\n*Sadarlah*, kain kafan kita mungkin sudah mulai ditenun di suatu tempat, namun kita masih sibuk menjahit dosa dan menunda taubat.\n\n> *Tiap-tiap yang berjiwa akan merasakan mati. Dan sesungguhnya pada hari kiamat sajalah disempurnakan pahalamu.* (QS. Ali Imran: 185)" });
        return;
      }
      console.error("Muhasabah Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat renungan." });
    }
  });

  // API endpoint for Daily Verse
  app.get("/api/daily-verse", async (req, res) => {
    try {
      const prompt = `Berikan satu ayat Al-Quran pilihan yang menenangkan, memotivasi, dan memberikan semangat (Ayat Harian).
Sertakan juga referensi letak ayat tersebut (Nama Surah dan Nomor Ayat).
Lalu berikan 1-2 kalimat pendek renungan maknanya.

MOHON KEMBALIKAN DALAM FORMAT JSON BERIKUT (TANPA MARKDOWN, HANYA JSON MURNI):
{
  "surah": "Nama Surah",
  "ayat": "Nomor",
  "arab": "Teks Arab (Opsional, tapi lebih baik ada)",
  "terjemahan": "Teks Terjemahan Indonesia",
  "renungan": "Pesan motivasi/renungan"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      let responseText = response.text || "{}";
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      const errStr = error?.message || error?.toString() || "";
      if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429") || errStr.includes("Quota") || errStr.includes("quota")) {
        const fallbacks = [
          {
            "surah": "Al-Baqarah",
            "ayat": "286",
            "arab": "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
            "terjemahan": "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
            "renungan": "Pekerjaan apa pun dan beban seberat apa pun yang kamu hadapi hari ini, ketahuilah bahwa Allah telah memastikan kamu sanggup memikulnya."
          },
          {
            "surah": "Ash-Sharh",
            "ayat": "5-6",
            "arab": "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
            "terjemahan": "Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.",
            "renungan": "Badai pasti berlalu. Setiap kesulitan yang menimpa niscaya akan membawa kemudahan di belakangnya. Tetaplah berharap dan terus melangkah."
          },
          {
            "surah": "Al-Imran",
            "ayat": "139",
            "arab": "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
            "terjemahan": "Janganlah kamu bersikap lemah, dan janganlah (pula) kamu bersedih hati, padahal kamulah orang-orang yang paling tinggi (derajatnya), jika kamu orang-orang yang beriman.",
            "renungan": "Di saat merasa terpuruk, ingatlah bahwa iman menguatkan jiwa. Jangan bersedih, Allah bersamamu."
          }
        ];
        res.json(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
        return;
      }
      console.error("Daily Verse Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat ayat harian." });
    }
  });

  // API endpoint for Fiqih
  app.get("/api/fiqih", async (req, res) => {
    try {
      const topic = req.query.topic || "thaharah";
      const prompt = `Berikan penjelasan hukum fiqih Islami yang lengkap, praktis, dan mudah dipahami tentang topik: ${topic}.
      
MOHON IKUTI PETUNJUK INI:
1. Berikan format yang rapi menggunakan Markdown.
2. Jelaskan hukum dasarnya (Wajib, Sunnah, Makruh, Mubah, Haram).
3. **WAJIB MENYERTAKAN DALIL** (Al-Quran atau Hadist yang shahih) beserta terjemahannya.
4. Berikan sedikit panduan praktis penerapannya di kehidupan sehari-hari (jika relevan).
5. Buat penjelasannya sistematis, ringkas, namun berbobot.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      const errStr = error?.message || error?.toString() || "";
      if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429") || errStr.includes("Quota") || errStr.includes("quota")) {
        res.json({ text: "### Hukum Fiqih (Fallback Mode)\n\nMohon maaf, layanan sedang mencapai batas penggunaan. Namun secara umum, segala sesuatu dalam muamalah adalah **Mubah** (boleh) sampai ada dalil yang mengharamkannya, dan segala sesuatu dalam ibadah adalah **Haram** (dilarang) sampai ada dalil yang memerintahkannya.\n\n*Silakan coba beberapa saat lagi untuk penjelasan lengkap beserta dalilnya.*" });
        return;
      }
      console.error("Fiqih Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat fiqih." });
    }
  });

  // API endpoint for Islamic History
  app.get("/api/history", async (req, res) => {
    try {
      const topic = req.query.topic || "random";
      const prompt = `Ceritakan sebuah kisah menarik dari sejarah peradaban Islam. Topik difokuskan pada: ${topic} (Bisa tentang masa kejayaan/kemunduran, tokoh pahlawan/ilmuwan terkenal atau yang jarang didengar, peristiwa politik, hingga kisah romantis yang Islami).
      
MOHON IKUTI PETUNJUK INI:
1. Buat judul yang menawan dan menarik.
2. Ceritakan secara naratif, mengalir, puitis, dan mudah dipahami.
3. Sebutkan tokoh utamanya dan latar waktunya dengan jelas.
4. Buat gayanya seperti membaca novel sejarah yang menggugah emosi.
5. Format menggunakan Markdown yang rapi (gunakan subheading jika perlu).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      const errStr = error?.message || error?.toString() || "";
      if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429") || errStr.includes("Quota") || errStr.includes("quota")) {
        res.json({ text: "### Keemasan Bani Umayyah di Andalusia\n\nDi saat Eropa masih berada dalam masa kegelapan (Dark Ages), semenanjung Iberia (Spanyol saat ini) justru bersinar terang di bawah pemerintahan Muslim. Kordoba menjadi kota paling maju di Eropa, dengan jalan-jalan beraspal yang diterangi lampu di malam hari, rumah sakit canggih, dan perpustakaan raksasa yang menyimpan ratusan ribu manuskrip.\n\nTokoh pahlawan seperti Tariq bin Ziyad membuka jalan dakwah ke wilayah ini, dan memicu akulturasi budaya, ilmu pengetahuan, dan toleransi yang jarang terdengar pada zamannya." });
        return;
      }
      console.error("History Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat sejarah." });
    }
  });

  // API endpoint to generate verse background image
  app.post("/api/generate-verse-image", async (req, res) => {
    try {
      const { translation } = req.body;
      
      if (!translation) {
         res.status(400).json({ error: "Missing required fields" });
         return;
      }

      // For free tier accounts, image generation models may trigger a quota limit.
      // We will fallback immediately to a beautiful random placeholder for the background.
      const randomSeed = Math.floor(Math.random() * 1000);
      const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/800/1000?blur=2`;
      
      const imgRes = await fetch(fallbackUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      
      res.json({ imageUrl: dataUrl });
      
    } catch (error: any) {
      console.error("Image API Error:", error);
      res.status(500).json({ error: error?.message || "Gagal memuat gambar." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
