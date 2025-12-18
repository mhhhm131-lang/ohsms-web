/* =====================================================
   OHSMS – COMMON AUTH & PERMISSIONS CORE
   هذا الملف مشترك بين جميع الصفحات
   أي خطأ هنا يؤثر على النظام كامل
===================================================== */

const OHSMS_AUTH_KEY = "ohsms_current_user";

/* =====================
   Session helpers
===================== */
function ohsmsSetCurrentUser(user) {
  if (user) {
    sessionStorage.setItem(OHSMS_AUTH_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(OHSMS_AUTH_KEY);
  }
}

function ohsmsGetCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(OHSMS_AUTH_KEY));
  } catch (e) {
    return null;
  }
}

function ohsmsLogout() {
  ohsmsSetCurrentUser(null);
  location.href = "login.html";
}

/* =====================
   Permission checker
===================== */
function ohsmsHasPermission(permission) {
  if (typeof OHSMS_ROLES === "undefined") return false;

  const user = ohsmsGetCurrentUser();
  if (!user) return false;

  const role = OHSMS_ROLES[user.role];
  if (!role) return false;

  if (role.permissions.includes("*")) return true;
  return role.permissions.includes(permission);
}

/* =====================
   UI helpers (header & menu)
===================== */
function ohsmsApplyUserUI() {
  const user = ohsmsGetCurrentUser();

  // Header
  const nameEl = document.getElementById("headerUserName");
  const roleEl = document.getElementById("headerUserRole");

  if (user && nameEl) {
    nameEl.textContent = user.username;
    if (roleEl && typeof OHSMS_ROLES !== "undefined") {
      roleEl.textContent = OHSMS_ROLES[user.role]?.nameAr || "";
    }
  }

  // Menu permissions
  document.querySelectorAll("[data-perm]").forEach(el => {
    const perm = el.getAttribute("data-perm");
    if (!ohsmsHasPermission(perm)) {
      el.style.display = "none";
    }
  });
}

/* =====================
   Page protection
===================== */
function ohsmsProtectPage(requiredPermission) {
  const user = ohsmsGetCurrentUser();

  if (!user) {
    location.href = "login.html";
    return;
  }

  if (requiredPermission && !ohsmsHasPermission(requiredPermission)) {
    alert("غير مصرح لك بالدخول إلى هذه الصفحة");
    location.href = "index.html";
  }
}

/* =====================
   Auto init on load
===================== */
document.addEventListener("DOMContentLoaded", () => {
  ohsmsApplyUserUI();
});
