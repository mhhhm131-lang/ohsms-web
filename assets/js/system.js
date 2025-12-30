// ======================================================
// OHSMS AUTH + PERMISSIONS (FIREBASE ONLY - CLEAN FINAL)
// ======================================================

import { auth, db } from "./common.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
  const user = window.currentUserData;
  if (!user) return false;

  const perms = ROLES[user.role] || [];
  if (perms.includes("*")) return true;
  return perms.includes(perm);
};

// ===============================
// LOGIN (called from login.html)
// ===============================
window.ohsmsHandleLogin = async function (email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e) {
    alert("بيانات الدخول غير صحيحة");
    throw e;
  }
};

// ===============================
// AUTH GUARD (PAGE PROTECTION)
// ===============================
window.ohsmsRequireAuth = function (permission) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        location.href = "login.html";
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        alert("الحساب غير مهيأ داخل النظام");
        await signOut(auth);
        location.href = "login.html";
        return;
      }

      window.currentUserData = {
        uid: user.uid,
        email: user.email,
        role: snap.data().role
      };

      if (permission && !ohsmsHasPermission(permission)) {
        alert("غير مصرح لك بالدخول");
        location.href = "index.html";
        return;
      }

      resolve(true);
    });
  });
};

// ===============================
// LOGOUT
// ===============================
window.ohsmsLogout = async function () {
  await signOut(auth);
  location.href = "login.html";
};
