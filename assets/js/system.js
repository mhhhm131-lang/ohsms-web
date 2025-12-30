import { auth, db } from "./common.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
/* =====================================================
   OHSMS – SYSTEM AUTH CORE (Firebase Based)
   ===================================================== */

/* ===============================
   ROLES & PERMISSIONS
================================ */
const OHSMS_ROLES = {
  system_admin: { permissions: ["*"] },

  system_operator: {
    permissions: [
      "view_home","view_dashboard","view_reports","view_risks",
      "view_awareness","view_forms","view_partners",
      "view_all_reports","receive_report","assign_report",
      "add_report_notes_global","add_risk_notes_global",
      "assign_forms","manage_awareness"
    ]
  },

  top_management: {
    permissions: [
      "view_home","view_dashboard","view_reports","view_risks",
      "view_awareness","view_forms",
      "view_all_reports",
      "add_report_notes_global",
      "add_risk_notes_global"
    ]
  },

  ohs_committee: {
    permissions: [
      "view_home","view_dashboard","view_reports","view_risks",
      "view_awareness","view_forms",
      "view_all_reports",
      "add_report_notes_global",
      "add_risk_notes_global",
      "add_public_risk","escalate_report"
    ]
  },

  branch_manager: {
    permissions: [
      "view_dashboard","view_reports","view_risks",
      "view_assigned_reports",
      "add_report_notes_scoped",
      "escalate_report","close_report",
      "approve_private_risk","add_risk_notes_scoped"
    ]
  },

  department_manager: {
    permissions: [
      "view_dashboard","view_reports","view_risks",
      "view_assigned_reports",
      "add_report_notes_scoped",
      "escalate_report","close_report",
      "approve_private_risk","add_risk_notes_scoped"
    ]
  },

  section_manager: {
    permissions: [
      "view_dashboard","view_reports","view_risks",
      "view_assigned_reports",
      "add_report_notes_scoped",
      "escalate_report","close_report",
      "approve_private_risk","add_risk_notes_scoped"
    ]
  },

  safety_coordinator: {
    permissions: [
      "view_dashboard","view_reports","view_risks",
      "view_assigned_reports",
      "accept_assignment","assign_report",
      "add_report_notes_scoped",
      "add_private_risk","add_risk_notes_scoped"
    ]
  },

  safety_executor: {
    permissions: [
      "view_assigned_reports",
      "accept_assignment",
      "update_corrective_action",
      "add_report_notes_scoped",
      "close_report","escalate_report"
    ]
  },

  employee: {
    permissions: [
      "view_home","view_awareness","view_risks",
      "view_private_risks_scoped",
      "submit_report","fill_assigned_forms"
    ]
  },

  partner: {
    permissions: [
      "view_home","view_awareness",
      "submit_report","fill_assigned_forms"
    ]
  }
};

/* ===============================
   AUTH GUARD (GLOBAL)
================================ */
window.ohsmsRequireAuth = function (requiredPermission = null) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        location.href = "login.html";
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        alert("❌ حسابك غير مهيأ في النظام");
        location.href = "login.html";
        return;
      }

      const userData = snap.data();

      if (userData.active === false) {
        alert("⛔ الحساب موقوف");
        location.href = "login.html";
        return;
      }

      const roleDef = OHSMS_ROLES[userData.role];
      if (!roleDef) {
        alert("❌ دور المستخدم غير معرف");
        location.href = "login.html";
        return;
      }

      if (
        requiredPermission &&
        !roleDef.permissions.includes("*") &&
        !roleDef.permissions.includes(requiredPermission)
      ) {
        alert("🚫 غير مصرح لك بالدخول");
        location.href = "index.html";
        return;
      }

      window.currentUser = { uid: user.uid, ...userData };
      resolve(window.currentUser);
    });
  });
};

/* ===============================
   PERMISSION CHECK (OPTIONAL)
================================ */
window.ohsmsHasPermission = function (perm) {
  if (!window.currentUser) return false;

  const role = OHSMS_ROLES[window.currentUser.role];
  if (!role) return false;

  if (role.permissions.includes("*")) return true;
  return role.permissions.includes(perm);
};
