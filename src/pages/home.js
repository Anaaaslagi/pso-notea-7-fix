import { useEffect, useState } from 'react';
import { addNote, getAllNotes, deleteNote, updateNote } from '../lib/noteService';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  const loadNotes = async () => {
    const result = await getAllNotes();
    setNotes(result);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Judul dan isi catatan tidak boleh kosong.');
      return;
    }

    try {
      if (editId) {
        await updateNote(editId, { title, content });
        setEditId(null);
      } else {
        await addNote(title, content);
      }
      setTitle('');
      setContent('');
      loadNotes();
    } catch (err) {
      console.error('❌ Gagal menyimpan catatan:', err);
      alert('Gagal menyimpan catatan. Coba lagi.');
    }
  };


  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes();
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="container mt-4">
      <nav className="mb-4 d-flex flex-wrap gap-2">
        <Link href="/" className="me-3 text-decoration-none">🏠 Home</Link>
        <Link href="/new" className="me-3 text-decoration-none">➕ Tambah</Link>
        <Link href="/archives" className="me-3 text-decoration-none">📦 Arsip</Link>
        <Link href="/about" className="text-decoration-none">ℹ️ Tentang</Link>
        <Link href="/list" className="me-3 text-decoration-none">📋 Daftar</Link>
      </nav>

      <h1 className="mb-4">📒 Catatan Simpel</h1>

      <form onSubmit={handleSubmit} className="mb-4">
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
        <button type="submit" className="btn btn-primary">
          {editId ? 'Update' : 'Tambah'}
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-muted">Belum ada catatan.</p>
      ) : (
        <div className="row">
          {notes.map(note => (
            <div key={note.id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.content}</p>
                </div>
                <div className="card-footer d-flex justify-content-end">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(note)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(note.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
