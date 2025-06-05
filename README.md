# Notea - Aplikasi Pencatat Modern

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

## 🚀 Get Started

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

## ☁️ Deployment

Aplikasi Notea di-deploy ke **Google Cloud Platform**. Proses deployment diotomatiskan melalui pipeline CI/CD kami, yang memanfaatkan Docker untuk kontainerisasi dan layanan GCP untuk hosting.
