# Cogstack TestCase - Running with MedMen (ID/EN)

Dokumen ini menjelaskan cara menjalankan backend MedCAT (model MedMen) dari repo cogstack-nlp, lalu menghubungkannya ke frontend tester di folder ini.

This document explains how to run the MedCAT backend (MedMen model) from the cogstack-nlp repository, then connect it to the frontend tester in this folder.

## 1. Jalankan backend MedMen / Run MedMen backend

Masuk ke folder docker medcat-service:
Go to the medcat-service docker folder:

```bash
cd /home/stephen/project26/cogstack-nlp/medcat-service/docker
```

Jalankan script:
Run the script:

```bash
bash run_example_medmen.sh
```

Script yang benar memakai:
The script must use:

```bash
DOCKER_COMPOSE_FILE="docker-compose-example-medmen.yml"
```

Bukan / Not:

```bash
DOCKER_COMPOSE_FILE="docker-compose.example-medmen.yml"
```

## 2. Verifikasi backend aktif / Verify backend is up

Cek service:
Check services:

```bash
docker compose -f docker-compose-example-medmen.yml ps
```

Cek endpoint info:
Check info endpoint:

```bash
curl http://localhost:5555/api/info
```

Jika sukses, Anda akan mendapat JSON medcat_info.
If successful, you should get a medcat_info JSON response.

## 3. Jalankan frontend proxy / Run frontend proxy

Buka terminal baru, lalu jalankan:
Open a new terminal and run:

```bash
cd /home/stephen/project26/Cogstack-TestCase
API_TARGET=http://localhost:5555 PORT=8000 node dev-proxy.mjs
```

Arti parameter / Parameter meaning:

- API_TARGET=http://localhost:5555: backend MedCAT tujuan proxy / MedCAT backend target for proxy
- PORT=8000: port frontend/proxy lokal / local frontend/proxy port

## 4. Akses UI / Open UI

Buka browser / Open browser:

```text
http://localhost:8000
```

UI akan memanggil endpoint backend melalui path /api/_ yang diproxy oleh dev-proxy.mjs.
The UI calls backend endpoints through /api/_, proxied by dev-proxy.mjs.

## 5. Troubleshooting singkat / Quick troubleshooting

- Jika bash run_example_medmen.sh gagal / If bash run_example_medmen.sh fails:
- Pastikan Docker aktif / Ensure Docker is running.
- Pastikan image bisa di-pull dan tidak ada konflik port / Ensure images can be pulled and there is no port conflict.
- Jika UI tidak tersambung / If UI cannot connect:
- Pastikan curl http://localhost:5555/api/info berhasil / Ensure curl http://localhost:5555/api/info works.
- Pastikan command proxy dijalankan dari folder Cogstack-TestCase / Ensure the proxy command is run from the Cogstack-TestCase folder.
