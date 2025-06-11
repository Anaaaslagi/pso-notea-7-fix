import { useState } from 'react';
import { addNote } from '../lib/noteService';
import { useRouter } from 'next/router';
import React from 'react';
import Link from 'next/link';

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNote(title, content);
    router.push('/home');
  };

  return (
    <div className="container mt-5">
      <nav className="mb-4 d-flex flex-wrap gap-2">
        <Link href="/home" className="me-3 text-decoration-none">🏠 Home</Link>
        <Link href="/new" className="me-3 text-decoration-none">➕ Tambah</Link>
        <Link href="/list" className="me-3 text-decoration-none">📋 Daftar</Link>
        <Link href="/about" className="text-decoration-none">ℹ️ Tentang</Link>
      </nav>
      <h1>➕ Tambah Catatan Baru</h1>
      <form onSubmit={handleSubmit} className="mt-3">
        <input
          className="form-control mb-2"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Isi Catatan"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn btn-success">Simpan</button>
      </form>
    </div>
  );
}
