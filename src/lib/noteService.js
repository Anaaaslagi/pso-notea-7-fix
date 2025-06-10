import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Referensi koleksi notes di Firestore
const notesRef = collection(db, "notes");

// Ambil semua catatan milik user saat ini
export const getAllNotes = async () => {
  const username = localStorage.getItem('username');

  if (!username) {
    console.warn('⚠️ Username belum tersedia di localStorage');
    return [];
  }

  const q = query(notesRef, where("username", "==", username));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Tambahkan catatan baru untuk user yang sedang login
export const addNote = async (title, content, folderId = null) => {
  const username = localStorage.getItem('username');

  if (!username) {
    throw new Error("User belum login, tidak bisa menambahkan catatan");
  }

  return await addDoc(notesRef, { title, content, username, folderId });
};

// Hapus catatan berdasarkan ID
export const deleteNote = async (id) => {
  return await deleteDoc(doc(db, "notes", id));
};

// Update catatan berdasarkan ID
export const updateNote = async (id, newData) => {
  return await updateDoc(doc(db, "notes", id), newData);
};

export const getNotesByFolder = async (folderId) => {
  const username = localStorage.getItem('username');
  if (!username) return [];
  let q;
  if (folderId) {
    q = query(notesRef, where("username", "==", username), where("folderId", "==", folderId));
  } else {
    q = query(notesRef, where("username", "==", username), where("folderId", "==", null));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

