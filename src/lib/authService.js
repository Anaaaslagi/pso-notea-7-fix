// lib/authService.js
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
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
