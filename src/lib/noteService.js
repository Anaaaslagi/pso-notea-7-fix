import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

const getNotesRef = () => collection(db, "notes");

export const getAllNotes = async () => {
  const snapshot = await getDocs(getNotesRef());
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addNote = async (title, content) => {
  return await addDoc(getNotesRef(), { title, content });
};

export const deleteNote = async (id) => {
  return await deleteDoc(doc(db, "notes", id));
};

export const updateNote = async (id, newData) => {
  return await updateDoc(doc(db, "notes", id), newData);
};
