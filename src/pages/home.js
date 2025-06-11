import React, { useEffect, useState } from "react";
import { getAllFolders, addFolder, updateFolder, deleteFolder } from '../lib/folderService';
import Link from "next/link";
import Swal from "sweetalert2";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderInput, setFolderInput] = useState("");
  const [folderEditMode, setFolderEditMode] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderEditInput, setFolderEditInput] = useState("");

  // Ambil username dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  useEffect(() => {
    if (username) loadFolders();
  }, [username]);

  const loadFolders = async () => {
    const data = await getAllFolders(username);
    setFolders(data);
  };

  // Tambah folder
  const handleAddFolder = async () => {
    if (!folderInput.trim()) return;
    await addFolder(username, folderInput.trim());
    setFolderInput("");
    loadFolders();
  };

  // Edit folder
  const handleEditFolder = (folder) => {
    setSelectedFolder(folder);
    setFolderEditInput(folder.name);
    setFolderEditMode(true);
  };

  // Simpan edit folder
  const handleSaveEditFolder = async () => {
    await updateFolder(selectedFolder.id, folderEditInput);
    setFolderEditMode(false);
    setSelectedFolder(null);
    setFolderEditInput("");
    loadFolders();
  };

  // Batal edit
  const handleCancelEdit = () => {
    setFolderEditMode(false);
    setSelectedFolder(null);
    setFolderEditInput("");
  };

  // Hapus folder
  const handleDeleteFolder = async (folderId) => {
    Swal.fire({
      title: "Yakin hapus folder?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteFolder(folderId);
        loadFolders();
        Swal.fire("Folder berhasil dihapus!", "", "success");
      }
    });
  };

  return (
    <div className="container mt-5">
      <nav className="mb-4 d-flex flex-wrap gap-2">
        <Link href="/home" className="me-3 text-decoration-none">🏠 Home</Link>
        <Link href="/new" className="me-3 text-decoration-none">➕ Tambah</Link>
        <Link href="/list" className="me-3 text-decoration-none">📋 Daftar</Link>
        <Link href="/about" className="text-decoration-none">ℹ️ Tentang</Link>
      </nav>
      <h1 className="mb-4">📂 Daftar Folder</h1>

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

      {/* Edit Folder */}
      {folderEditMode && (
        <div className="mb-3">
          <input
            className="form-control d-inline-block"
            style={{ maxWidth: 200 }}
            value={folderEditInput}
            onChange={e => setFolderEditInput(e.target.value)}
          />
          <button className="btn btn-success btn-sm ms-2" onClick={handleSaveEditFolder}>Simpan</button>
          <button className="btn btn-secondary btn-sm ms-2" onClick={handleCancelEdit}>Batal</button>
        </div>
      )}

      {/* List Folder */}
      {folders.length === 0 ? (
        <p className="text-muted">Belum ada folder.</p>
      ) : (
        <div className="list-group">
          {folders.map(folder => (
            <div
              key={folder.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
            >
              <Link
                href={`/folder?id=${folder.id}`}
                className="flex-grow-1 text-decoration-none"
                style={{ color: "#000" }}
              >
                <b>{folder.name}</b>
              </Link>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditFolder(folder)}
                >Edit</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteFolder(folder.id)}
                >Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
