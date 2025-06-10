// lib/authService.js
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const usersRef = collection(db, "users");

export const registerUser = async (username, password) => {
  const q = query(usersRef, where("username", "==", username));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error("Username sudah digunakan");
  }

  return await addDoc(usersRef, { username, password });
};

export const loginUser = async (username, password) => {
  const q = query(usersRef, where("username", "==", username), where("password", "==", password));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Username atau password salah");
  }

  return snapshot.docs[0].data();
};

export const resetPassword = async (email, newPassword) => {
  const q = query(usersRef, where("username", "==", email)); // Asumsi "email" adalah field "username" di Firestore Anda
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Email tidak terdaftar.");
  }

  // Ambil dokumen pengguna yang ditemukan
  const userDoc = snapshot.docs[0];
  const userId = userDoc.id; // Dapatkan ID dokumen

  // Perbarui password pengguna
  await updateDoc(doc(db, "users", userId), { password: newPassword });

  return true; // Mengindikasikan reset password berhasil
};