import React, { useEffect, useState } from "react";
import { getNotesByFolder } from "../lib/noteService";
import { getFolderById } from "../lib/folderService";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function FolderPage() {
  const router = useRouter();
  const { id } = router.query; // ambil id dari query string (?id=1)
  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadFolderAndNotes(id);
  }, [id]);

  const loadFolderAndNotes = async (folderId) => {
    setLoading(true);
    const f = await getFolderById(folderId);
    setFolder(f);
    const data = await getNotesByFolder(folderId);
    setNotes(data);
    setLoading(false);
  };

  const handleDeleteNote = async (noteId) => {
    Swal.fire({
      title: "Yakin hapus catatan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNote(noteId);
        loadFolderAndNotes(id);
        Swal.fire("Catatan berhasil dihapus!", "", "success");
      }
    });
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <nav className="mb-3">
        <Link href="/home" className="btn btn-link">← Kembali ke Folder</Link>
      </nav>
      <h2 className="mb-4">📁 {folder ? folder.name : "Folder Tidak Ditemukan"}</h2>

      {(!notes || notes.length === 0) ? (
        <p className="text-muted">Belum ada catatan di folder ini.</p>
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
                  <Link
                    href={`/note-detail?id=${note.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >Edit</Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteNote(note.id)}
                  >Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
