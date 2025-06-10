import React, { useEffect, useState } from "react";
import { getAllFolders, addFolder, updateFolder, deleteFolder } from '../lib/folderService';
import { getAllNotes, getNotesByFolder, deleteNote } from '../lib/noteService';
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from 'next/router';

export default function Home() {
  const [username, setUsername] = useState(null);
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [folderInput, setFolderInput] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null); // { id, name }
  const [folderEditMode, setFolderEditMode] = useState(false);
  const [folderEditInput, setFolderEditInput] = useState("");
  const [showingAll, setShowingAll] = useState(true);

  // Ambil username dari localStorage (safely)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  // Load semua folder saat username ready
  useEffect(() => {
    if (username) loadFolders();
  }, [username]);

  // Load notes: semua note saat belum pilih folder, note per-folder saat folder dipilih
  useEffect(() => {
    if (!username) return;
    if (!selectedFolder) {
      loadAllNotes();
      setShowingAll(true);
    } else {
      loadNotes(selectedFolder.id);
      setShowingAll(false);
    }
  }, [username, selectedFolder]);

  const loadFolders = async () => {
    const data = await getAllFolders(username);
    setFolders(data);
  };

  const loadAllNotes = async () => {
    const data = await getAllNotes();
    setNotes(data);
  };

  const loadNotes = async (folderId) => {
    const data = await getNotesByFolder(folderId);
    setNotes(data);
  };

  // Pilih folder
  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder);
    setFolderEditMode(false);
  };

  // Edit folder
  const handleEditFolder = () => {
    setFolderEditMode(true);
    setFolderEditInput(selectedFolder.name);
  };

  // Simpan edit folder
  const handleSaveEditFolder = async () => {
    await updateFolder(selectedFolder.id, folderEditInput);
    setSelectedFolder({ ...selectedFolder, name: folderEditInput });
    setFolderEditMode(false);
    loadFolders();
  };

  // Hapus folder
  const handleDeleteFolder = async () => {
    Swal.fire({
      title: "Yakin hapus folder?",
      text: "Semua catatan di folder tetap aman (folder saja yang dihapus)!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteFolder(selectedFolder.id);
        setSelectedFolder(null);
        loadFolders();
        Swal.fire("Folder berhasil dihapus!", "", "success");
      }
    });
  };

  // Tambah folder
  const handleAddFolder = async () => {
    if (!folderInput.trim()) return;
    await addFolder(username, folderInput.trim());
    setFolderInput("");
    loadFolders();
  };

  // Hapus note
  const handleDeleteNote = async (id) => {
    Swal.fire({
      title: "Yakin hapus catatan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNote(id);
        // Setelah hapus, refresh sesuai mode tampilan
        if (showingAll) {
          loadAllNotes();
        } else if (selectedFolder) {
          loadNotes(selectedFolder.id);
        }
        Swal.fire("Catatan berhasil dihapus!", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <nav className="mb-4 d-flex flex-wrap gap-2">
        <Link href="/home" className="me-3 text-decoration-none">🏠 Home</Link>
        <Link href="/new" className="me-3 text-decoration-none">➕ Tambah</Link>
        <Link href="/archives" className="me-3 text-decoration-none">📦 Arsip</Link>
        <Link href="/about" className="text-decoration-none">ℹ️ Tentang</Link>
        <Link href="/list" className="me-3 text-decoration-none">📋 Daftar</Link>
      </nav>
      <h1 className="mb-4">📒 Catatan Simpel</h1>

      {/* Tombol Pilih Folder */}
      <div className="mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            Swal.fire({
              title: "Pilih Folder",
              input: "select",
              inputOptions: folders.reduce((obj, f) => {
                obj[f.id] = f.name;
                return obj;
              }, {}),
              inputPlaceholder: "Pilih folder",
              showCancelButton: true,
              cancelButtonText: "Batal",
              confirmButtonText: "Pilih"
            }).then(result => {
              if (result.isConfirmed && result.value) {
                const folder = folders.find(f => f.id === result.value);
                if (folder) handleSelectFolder(folder);
              }
            });
          }}
        >
          Pilih Folder
        </button>
        { !showingAll &&
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => setSelectedFolder(null)}
          >
            Tampilkan Semua Catatan
          </button>
        }
        <span className="ms-2">{selectedFolder ? <b>{selectedFolder.name}</b> : "Menampilkan seluruh catatan"}</span>
      </div>

      {/* Tambah Folder */}
      <div className="input-group mb-4" style={{ maxWidth: 300 }}>
        <input
          className="form-control"
          placeholder="Tambah Folder Baru"
          value={folderInput}
          onChange={e => setFolderInput(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleAddFolder}
        >Tambah Folder</button>
      </div>

      {/* Edit & Hapus Folder */}
      {selectedFolder && (
        <div className="mb-3">
          {folderEditMode ? (
            <>
              <input
                className="form-control d-inline-block"
                style={{ maxWidth: 200 }}
                value={folderEditInput}
                onChange={e => setFolderEditInput(e.target.value)}
              />
              <button className="btn btn-success btn-sm ms-2" onClick={handleSaveEditFolder}>Simpan</button>
              <button className="btn btn-secondary btn-sm ms-2" onClick={() => setFolderEditMode(false)}>Batal</button>
            </>
          ) : (
            <>
              <button className="btn btn-warning btn-sm me-2" onClick={handleEditFolder}>Edit Folder</button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteFolder}>Hapus Folder</button>
            </>
          )}
        </div>
      )}

      {/* ========== RENDER LIST NOTE ========== */}
      {notes.length === 0 ? (
        <p className="text-muted">
          {showingAll
            ? "Belum ada catatan."
            : "Belum ada catatan di folder ini."
          }
        </p>
      ) : (
        <div className="row">
          {notes.map(note => (
            <div key={note.id} className="col-md-6 mb-3">
              <div className="card h-100" style={{ cursor: "pointer" }}>
                <div
                  className="card-body"
                  onClick={() => window.location.href = `/note-detail/${note.id}`}
                >
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.content}</p>
                </div>
                <div className="card-footer d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={e => {
                      e.stopPropagation();
                      window.location.href = `/note-detail/${note.id}`;
                    }}
                  >Edit</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                  >Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* ========== END RENDER LIST NOTE ========== */}
    </div>
  );
}
