// assets/js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAr3rWfrom-UYZ09Talx5vb6VRh2Q-9U",
  authDomain: "ohsmsipa.firebaseapp.com",
  projectId: "ohsmsipa",
  storageBucket: "ohsmsipa.firebasestorage.app",
  messagingSenderId: "161259414430",
  appId: "1:161259414430:web:d7d1fe0d98a552f3c6ec8f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
