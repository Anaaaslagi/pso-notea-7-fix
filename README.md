# Notea - Aplikasi Pencatat Modern
![image](https://github.com/user-attachments/assets/3ba51ac5-9f6b-4fae-846a-5b1e79b417f6)

Notea adalah aplikasi pembuat catatan sederhana yang menerapkan konsep CRUD (Create,Read,Update, dan Delete).
## ✨ Fitur Utama 

* **Menambah Catatan** Membuat catatan baru pada website.
* **Membaca catatan** Membaca catatan yang telah dibuat.
* **Edit Catatan** Memodifikasi catatan yang telah dibuat.
* **Menghapus Catatan** Menghapus catatan yang dibut.
* **Kategorisasi** membagi catatan ke dalam kategori

## 🛠️ Tools yang digunakan

Web app ini dikembangkan dengan beberapa tools untuk mendukung pengembangannya:

* **Frontend:** [Next.js](https://nextjs.org/) - Framework React yang powerful untuk membangun antarmuka pengguna yang cepat dan SEO-friendly.
* **Backend & Database:** [Firebase](https://firebase.google.com/) - Platform komprehensif dari Google yang menyediakan layanan backend, database real-time (Firestore/Realtime Database), autentikasi, dan hosting.
* **Pemeriksaan Keamanan:** [SonarQube](https://www.sonarsource.com/products/sonarqube/) - Alat untuk inspeksi kualitas kode berkelanjutan, mendeteksi bug, kerentanan keamanan, dan *code smells*.
* **Pengujian Unit:** [Jest](https://jestjs.io/) - Framework pengujian JavaScript yang populer untuk memastikan keandalan kode melalui pengujian unit.
* **Build Aplikasi:** [Next.js](https://nextjs.org/docs/deployment) - Proses build bawaan Next.js digunakan untuk mengoptimalkan aplikasi untuk produksi.
* **Kontainerisasi:** [Docker](https://www.docker.com/) - Platform untuk mengembangkan, mengirim, dan menjalankan aplikasi dalam kontainer, memastikan konsistensi lingkungan di berbagai tahap.
* **Deployment:** [Google Cloud Platform (GCP)](https://cloud.google.com/) - Aplikasi Notea di-deploy dan di-host menggunakan layanan dari Google Cloud, seperti Cloud Run, App Engine, atau Kubernetes Engine.

## 🔄 Pipeline CI/CD
![Workflow Design PSO (1)](https://github.com/user-attachments/assets/373faf06-77bb-4bee-9c60-738926e76f9c)

Kami menerapkan pipeline Continuous Integration/Continuous Delivery (CI/CD) untuk mengotomatiskan proses build, pengujian, dan deployment aplikasi Notea. Alur kerja CI/CD kami umumnya melibatkan langkah-langkah berikut:

1.  **Push Kode:** Pengembang melakukan push perubahan kode ke repositori.
2.  **Trigger Pipeline:** Push kode secara otomatis memicu pipeline CI/CD.
3.  **Cek Kerentanan:** Kode dianalisis oleh SonarQube untuk pemeriksaan keamanan dan kualitas.
4.  **Pengujian Unit:** Tes unit dijalankan menggunakan Jest untuk memverifikasi fungsionalitas.
5.  **Build Aplikasi:** Aplikasi Next.js di-build.
6.  **Pembuatan Docker Image:** Jika semua tes dan pemeriksaan lolos, Docker image untuk aplikasi akan dibuat.
7.  **Push Docker Image:** Docker image diunggah ke registry kontainer (misalnya, Google Container Registry).
8.  **Deployment:** Image yang baru di-deploy ke lingkungan target di Google Cloud Platform.

Pipeline ini membantu kami untuk merilis pembaruan lebih cepat, mengurangi risiko kesalahan manual, dan menjaga kualitas kode tetap tinggi.

## 🚀 Get Started (For Users)

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/Anaaaslagi/pso-notea-7-fix.git
    cd notea
    ```
2.  **Install dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```
3.  **Konfigurasi variabel lingkungan:**
    Buat file `.env.local` dan isi dengan konfigurasi Firebase Anda dan variabel lingkungan lainnya yang diperlukan.
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    # ... variabel Firebase lainnya
    ```
4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    # atau
    yarn dev
    ```
    Aplikasi akan berjalan di `http://localhost:3000`.

## 🚀 Get Started (For Developers)

### 1. Setup GitHub Actions

- Buat folder `.github/workflows/`
- Tambahkan file `ci-pipeline.yml` dan `cd-pipeline.yml`
- Set branch utama ke `main`

### 2. Linting dengan ESLint

```bash
yarn add eslint --dev
yarn eslint --init
```

Tambahkan ke `package.json`:

```json
"scripts": {
  "lint": "eslint ."
}
```

Tambahkan ke GitHub Actions:

```yaml
- run: yarn lint
```

### 3. Unit Testing dengan Jest

```bash
yarn add jest --dev
```

Tambahkan script:

```json
"scripts": {
  "test": "jest"
}
```

Tambahkan ke pipeline:

```yaml
- run: yarn test
```
### 4. Integrasi SonarQube untuk Analisis Kode

Jalankan SonarQube lokal:
   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:community
   ```
Buat project di dashboard SonarQube dan dapatkan `Project Key` dan `Token`
Buat file `sonar-project.properties`:
   ```properties
   sonar.projectKey=notea
   sonar.host.url=https://your-sonarqube-url.com
   sonar.login=${SONAR_TOKEN}
   sonar.sources=src
   sonar.tests=__tests__
   sonar.javascript.lcov.reportPaths=coverage/lcov.info
   ```
Tambahkan secret `SONAR_TOKEN` di GitHub Secrets
Tambahkan job berikut ke `ci-pipeline.yml`:
   ```yaml
   - name: SonarQube Scan
     run: |
       npm install -g sonarqube-scanner
       sonar-scanner
     env:
       SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
   ```

### 5. Build Production App

Tambahkan ke `package.json`:

```json
"scripts": {
  "build": "next build"
}
```

Tambahkan ke GitHub Actions:

```yaml
- run: yarn build
```

### 6. Dockerize Aplikasi

Buat `Dockerfile`:

```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build
CMD ["yarn", "start"]
```

Tambahkan ke pipeline:

```yaml
docker build -t gcr.io/<project>/notea .
docker push gcr.io/<project>/notea
```

### 7. Setup Google Cloud Platform (GCP)

1. Aktifkan Cloud Run & Artifact Registry
2. Buat Service Account dengan role:
   - Cloud Run Admin
   - Artifact Registry Writer
   - Viewer / Editor
3. Buat registry:

```bash
gcloud artifacts repositories create docker-repo \
  --repository-format=docker \
  --location=asia-southeast2
```

4. Deploy awal ke Cloud Run:

```bash
gcloud run deploy notea \
  --image=gcr.io/<project>/notea \
  --platform=managed \
  --region=asia-southeast2 \
  --allow-unauthenticated
```

### 8. Tambahkan Secrets di GitHub

Buka: `Settings > Secrets and Variables > Actions`

| Secret Name       | Keterangan                        |
|-------------------|------------------------------------|
| `GCP_SA_KEY`      | Service account JSON               |
| `GCP_PROJECT`     | ID proyek Google Cloud             |
| `GCP_REGION`      | Lokasi (mis. `asia-southeast2`)    |
| `GCP_SERVICE`     | Nama layanan Cloud Run             |
| `SENTRY_DSN`      | (opsional) Sentry DSN              |
| `SENTRY_ORG`      | (opsional) Nama organisasi Sentry  |
| `SENTRY_PROJECT`  | (opsional) Nama project Sentry     |

### 9. Deploy Otomatis ke Cloud Run

CI Pipeline selesai → CD Pipeline jalan otomatis jika sukses:

```yaml
uses: google-github-actions/deploy-cloudrun@v2
with:
  service: ${{ secrets.GCP_SERVICE }}
  region: ${{ secrets.GCP_REGION }}
  image: ${{ secrets.GCP_REGION }}-docker.pkg.dev/${{ secrets.GCP_PROJECT }}/docker-repo/notea:${{ github.sha }}
```

---


## 📄 Lisensi

MIT License  
© 2025 [Anaaaslagi](https://github.com/Anaaaslagi)

