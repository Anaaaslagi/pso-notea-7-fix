import { useEffect, useState } from 'react';
import { getAllNotes } from '../lib/noteService';
import React from 'react';

export default function ListPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await getAllNotes();
      setNotes(result);
    };
    fetchNotes();
  }, []);

  return (
    <div className="container mt-5">
      <nav className="mb-4">
        <a href="/" className="me-3 text-decoration-none">🏠 Home</a>
        <a href="/list" className="me-3 text-decoration-none fw-bold">📋 Daftar Catatan</a>
        <a href="/new" className="me-3 text-decoration-none">➕ Tambah</a>
        <a href="/about" className="text-decoration-none">ℹ️ Tentang</a>
      </nav>

      <h2 className="mb-4">📋 Daftar Semua Catatan</h2>

      {notes.length === 0 ? (
        <p className="text-muted">Tidak ada catatan yang tersedia.</p>
      ) : (
        <div className="row">
          {notes.map(note => (
            <div key={note.id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
