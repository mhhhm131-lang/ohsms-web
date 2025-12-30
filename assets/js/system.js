// ======================================================
// OHSMS AUTH + PERMISSIONS (FIREBASE ONLY - FINAL)
// ======================================================

import { auth, db } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===============================
// SESSION KEY
// ===============================
const AUTH_KEY = "ohsms_user";

// ===============================
// SAVE / LOAD USER
// ===============================
function setUser(user) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function clearUser() {
  sessionStorage.removeItem(AUTH_KEY);
}

// ===============================
// ROLES & PERMISSIONS
// ===============================
const ROLES = {
  system_admin: ["*"],
  ohsms_committee: [
    "view_home",
    "view_reports",
    "view_risks",
    "view_awareness",
    "view_forms",
    "view_dashboard"
  ],
  employee: [
    "view_home",
    "submit_report",
    "view_awareness"
  ]
};

// ===============================
// PERMISSION CHECK
// ===============================
window.ohsmsHasPermission = function (perm) {
  const user = getUser();
  if (!user) return false;
  const perms = ROLES[user.role] || [];
  if (perms.includes("*")) return true;
  return perms.includes(perm);
};

// ===============================
// LOGIN
// ===============================
window.ohsmsHandleLogin = async function (form) {
  const email = form.querySelector("#username").value.trim();
  const password = form.querySelector("#password").value.trim();

  if (!email || !password) {
    alert("أدخل البريد الإلكتروني وكلمة المرور");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) {
      alert("لا يوجد دور للمستخدم في النظام");
      await signOut(auth);
      return;
    }

    setUser({
      uid,
      email,
      role: snap.data().role
    });

    location.href = "index.html";
  } catch (e) {
    alert("بيانات الدخول غير صحيحة");
  }
};

// ===============================
// AUTH GUARD
// ===============================
window.ohsmsRequireAuth = function (permission) {
  onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      location.href = "login.html";
      return;
    }

    const snap = await getDoc(doc(db, "users", fbUser.uid));
    if (!snap.exists()) {
      location.href = "login.html";
      return;
    }

    setUser({
      uid: fbUser.uid,
      email: fbUser.email,
      role: snap.data().role
    });

    if (permission && !ohsmsHasPermission(permission)) {
      alert("غير مصرح لك بالدخول");
      location.href = "index.html";
    }
  });
};

// ===============================
// LOGOUT
// ===============================
window.ohsmsLogout = async function () {
  await signOut(auth);
  clearUser();
  location.href = "login.html";
};
