# Cogstack-TestCase

> **Catatan / Note:** Repositori ini digunakan untuk **menguji** layanan NLP dari [CogStack cogstack-nlp](https://github.com/CogStack/cogstack-nlp). Repositori ini menyediakan antarmuka frontend sederhana (UI tester) beserta proxy server untuk berkomunikasi dengan backend MedCAT yang berjalan secara lokal.
>
> **Note:** This repository is used to **test** the NLP services from [CogStack cogstack-nlp](https://github.com/CogStack/cogstack-nlp). It provides a simple frontend UI tester along with a proxy server to communicate with a locally running MedCAT backend.

---

## Prasyarat / Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) terinstal / installed
- [Node.js](https://nodejs.org/) (untuk menjalankan proxy / to run the proxy)
- Repository [cogstack-nlp](https://github.com/CogStack/cogstack-nlp) sudah di-clone / cloned:

```bash
git clone https://github.com/CogStack/cogstack-nlp.git
```

---

## Cara Kerja / How It Works

```
Browser → [dev-proxy.mjs :8000] → [MedCAT Backend :5555]
```

`dev-proxy.mjs` meneruskan semua permintaan `/api/*` ke backend MedCAT yang berjalan di Docker.
`dev-proxy.mjs` forwards all `/api/*` requests to the MedCAT backend running in Docker.

UI pada repositori ini tidak hanya berfungsi sebagai form uji sederhana, tetapi juga sebagai audit tester untuk beberapa skenario seperti anotasi NLP, de-identification, latency check, negative case, dan perbandingan bilingual EN vs ID.
The UI in this repository is not only a simple test form, but also an audit tester for scenarios such as NLP annotation, de-identification, latency checks, negative cases, and bilingual EN vs ID comparison.

Pada panel `Bandingkan hasil EN vs ID`, aplikasi mengirim dua request terpisah ke endpoint `/api/process` lalu membandingkan jumlah entity yang terdeteksi dari teks Indonesia dan Inggris.
In the `Compare EN vs ID results` panel, the app sends two separate requests to `/api/process` and then compares the number of detected entities between Indonesian and English text.

---

## Langkah-langkah / Setup Steps

### 1. Jalankan backend MedCAT (MedMen model) / Run the MedCAT backend

Masuk ke folder `medcat-service/docker` di dalam repositori **cogstack-nlp**:  
Navigate to the `medcat-service/docker` folder inside the **cogstack-nlp** repository:

```bash
cd cogstack-nlp/medcat-service/docker
```

Jalankan script contoh MedMen (script akan otomatis mengunduh model dan menjalankan Docker Compose):  
Run the MedMen example script (it will automatically download the model and start Docker Compose):

```bash
bash run_example_medmen.sh
```

> **Catatan / Note:** Script menggunakan file compose bernama `docker-compose-example-medmen.yml` (bukan `docker-compose.example-medmen.yml`). Pastikan nama file tersebut benar di dalam script.
>
> The script uses the compose file named `docker-compose-example-medmen.yml` (not `docker-compose.example-medmen.yml`). Make sure the filename is correct inside the script.

Atau, jalankan secara manual / Or, run manually:

```bash
# 1. Unduh model / Download the model
cd models/
bash download_medmen.sh

# 2. Jalankan Docker Compose / Start Docker Compose
cd ../docker/
docker compose -f docker-compose-example-medmen.yml up -d
```

---

### 2. Verifikasi backend aktif / Verify the backend is running

Cek status container / Check container status:

```bash
docker compose -f docker-compose-example-medmen.yml ps
```

Cek endpoint info / Check the info endpoint:

```bash
curl http://localhost:5555/api/info
```

Respons yang berhasil akan mengembalikan JSON seperti:  
A successful response returns JSON like:

```json
{
  "medcat_info": {
    "service_app_name": "MedCAT",
    "service_language": "en",
    "service_version": "...",
    "service_model": "MedMen"
  }
}
```

---

### 3. Jalankan frontend proxy / Run the frontend proxy

Buka terminal baru, lalu masuk ke folder repositori ini (Cogstack-TestCase) dan jalankan:  
Open a new terminal, navigate to this repository (Cogstack-TestCase), and run:

```bash
cd /path/to/Cogstack-TestCase
API_TARGET=http://localhost:5555 PORT=8000 node dev-proxy.mjs
```

| Parameter | Keterangan / Description |
|---|---|
| `API_TARGET` | URL backend MedCAT / MedCAT backend URL |
| `PORT` | Port lokal untuk proxy & UI / Local port for proxy & UI |

---

### 4. Akses UI / Access the UI

Buka browser dan kunjungi / Open your browser and visit:

```
http://localhost:8000
```

UI akan mengirimkan permintaan ke endpoint `/api/*` yang diteruskan oleh proxy ke backend MedCAT.  
The UI sends requests to `/api/*` endpoints, which the proxy forwards to the MedCAT backend.

---

## Contoh API / API Example

Mengirim teks untuk diproses / Send text for processing:

```bash
curl -XPOST http://localhost:5555/api/process \
  -H 'Content-Type: application/json' \
  -d '{"content":{"text":"The patient was diagnosed with leukemia."}}'
```

---

## Troubleshooting

| Masalah / Problem | Solusi / Solution |
|---|---|
| `run_example_medmen.sh` gagal / fails | Pastikan Docker aktif dan tidak ada konflik port / Ensure Docker is running and no port conflicts |
| `curl http://localhost:5555/api/info` tidak merespons / no response | Tunggu beberapa saat agar container selesai start, lalu coba lagi / Wait for the container to finish starting, then retry |
| UI tidak dapat terhubung ke backend / UI cannot connect | Pastikan `curl http://localhost:5555/api/info` berhasil, lalu pastikan proxy sudah berjalan / Ensure `curl http://localhost:5555/api/info` works, then ensure the proxy is running |
| Port `8000` atau `5555` sudah dipakai / already in use | Ganti dengan port lain di command proxy / Change to another port in the proxy command |
| Muncul error `rEN is not defined` saat klik `Bandingkan hasil EN vs ID` / `rEN is not defined` appears when clicking `Compare EN vs ID results` | Gunakan versi terbaru file `index.html` atau `index_v2.html`, lalu lakukan hard refresh browser agar JavaScript lama tidak tercache / Use the latest `index.html` or `index_v2.html`, then hard-refresh the browser so stale JavaScript is not cached |

### Catatan teknis / Technical note

Perbaikan terbaru untuk panel bilingual memastikan scoring `F` membaca variabel respons yang benar untuk request Indonesia (`rId`) dan Inggris (`rEn`), lalu mengevaluasi status HTTP (`response.status`) dan jumlah entity hasil parsing (`idE` dan `enE`).
The latest fix for the bilingual panel ensures the `F` score reads the correct response variables for the Indonesian (`rId`) and English (`rEn`) requests, then evaluates the HTTP status (`response.status`) and parsed entity counts (`idE` and `enE`).

---

## Referensi / References

- [CogStack cogstack-nlp](https://github.com/CogStack/cogstack-nlp) — Repositori utama / Main repository
- [MedCAT Service README](https://github.com/CogStack/cogstack-nlp/blob/main/medcat-service/README.md) — Dokumentasi lengkap / Full documentation
- [MedCAT](https://github.com/CogStack/MedCAT) — Library NLP medis / Medical NLP library
