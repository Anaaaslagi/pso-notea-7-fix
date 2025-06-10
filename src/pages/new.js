import { useState } from 'react';
import { addNote } from '../lib/noteService';
import { useRouter } from 'next/router';
import React from 'react';

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
      <h2>➕ Tambah Catatan Baru</h2>
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
