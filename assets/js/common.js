// =======================================
// OHSMS COMMON CORE
// Firebase Initialization + Auth Export
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔹 Firebase Config (كما هو عندك)
const firebaseConfig = {
  apiKey: "AIzaSyAr3rWfrom-UYZ09Talx5vb6VRh2Q-9U",
  authDomain: "ohsmsipa.firebaseapp.com",
  projectId: "ohsmsipa",
  storageBucket: "ohsmsipa.firebasestorage.app",
  messagingSenderId: "161259414430",
  appId: "1:161259414430:web:d7d1fe0d98a552f3c6ec8f"
};

// 🔹 Initialize Firebase (مرة واحدة فقط)
const app = initializeApp(firebaseConfig);

// 🔹 Export Auth & DB (المصدر الوحيد في النظام)
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔹 Global currentUser (للاستخدام في الصفحات)
export let currentUser = null;

// 🔹 مراقبة حالة الدخول
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});
