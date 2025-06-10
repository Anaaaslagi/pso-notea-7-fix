import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBgYSH5BXM45Wj9_lgII2X5LUWmNoo4VVk", 
  authDomain: "pso-final-project.firebaseapp.com",
  projectId: "pso-final-project",
  storageBucket: "pso-final-project.appspot.com",
  messagingSenderId: "953582821365",
  appId: "1:953582821365:web:abc123"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
