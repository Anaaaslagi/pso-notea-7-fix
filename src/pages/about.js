import React from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs'; // Import Sentry untuk memicu error

export default function AboutPage() {
  return (
    <div className="container mt-5">
      <nav className="mb-4 d-flex flex-wrap gap-2">
        <Link href="/home" className="me-3 text-decoration-none">🏠 Home</Link>
        <Link href="/new" className="me-3 text-decoration-none">➕ Tambah</Link>
        <Link href="/list" className="me-3 text-decoration-none">📋 Daftar</Link>
        <Link href="/about" className="text-decoration-none">ℹ️ Tentang</Link>
      </nav>
      <h1>ℹ️ Tentang Aplikasi</h1>
      <p className="mt-3">
        Aplikasi ini dibuat untuk mencatat ide, tugas, dan catatan penting secara real-time menggunakan Firebase.
      </p>
    </div>
  );
}
