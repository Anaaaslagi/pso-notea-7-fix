import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import React from "react";

export default function NoteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      const docRef = doc(db, 'notes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNote({ id: docSnap.id, ...docSnap.data() });
      } else {
        setNote(null);
      }
      setLoading(false);
    };
    fetchNote();
  }, [id]);

  if (loading) return <div>Memuat catatan...</div>;

  if (!note) return (
    <div className="container mt-5">
      <p className="text-danger">Catatan tidak ditemukan.</p>
      <Link href="/home" className="btn btn-primary">Kembali ke Beranda</Link>
    </div>
  );

  return (
    <div className="container mt-5">
      <Link href="/home" className="btn btn-secondary mb-3">← Kembali</Link>
      <h2>{note.title}</h2>
      <hr />
      <p>{note.content}</p>
      {/* Info folder, jika ada */}
      {note.folderId && (
        <div className="mt-3 text-muted">
          <small>Folder ID: {note.folderId}</small>
        </div>
      )}
    </div>
  );
}
