import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-5d0d9.firebaseapp.com",
  projectId: "mern-auth-5d0d9",
  storageBucket: "mern-auth-5d0d9.appspot.com",
  messagingSenderId: "163083146169",
  appId: "1:163083146169:web:03ee3a92e2c6188e16dc68"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);