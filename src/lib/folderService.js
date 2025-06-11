import { db } from './firebase'; // Pastikan path ini sesuai dengan file config Firebase kamu
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

/**
 * Mengambil semua folder milik user tertentu.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getAllFolders(userId) {
  const q = query(collection(db, "folders"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Menambahkan folder baru untuk user tertentu.
 * @param {string} userId
 * @param {string} name
 * @returns {Promise<string>} - ID folder baru
 */
export async function addFolder(userId, name) {
  const docRef = await addDoc(collection(db, "folders"), {
    userId,
    name,
    createdAt: new Date()
  });
  return docRef.id;
}

/**
 * Mengedit nama folder.
 * @param {string} folderId
 * @param {string} newName
 * @returns {Promise<void>}
 */
export async function updateFolder(folderId, newName) {
  await updateDoc(doc(db, "folders", folderId), {
    name: newName,
    updatedAt: new Date()
  });
}

/**
 * Menghapus folder berdasarkan folderId.
 * @param {string} folderId
 * @returns {Promise<void>}
 */
export async function deleteFolder(folderId) {
  await deleteDoc(doc(db, "folders", folderId));
}

export async function getFolderById(id) {
  if (!id) return null;
  const ref = doc(db, "folders", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    // return folder data + id
    return { id: snap.id, ...snap.data() };
  } else {
    return null;
  }
}