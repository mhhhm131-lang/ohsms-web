// ======================================================
//   OHSMS AUTH & PERMISSIONS SYSTEM  (CLEAN VERSION)
// ======================================================

const OHSMS_AUTH_KEY = 'ohsms_current_user';
const OHSMS_USERS_KEY = 'ohsms_users_cache';

// ------------------------------------------
let ohsmsUsers = JSON.parse(localStorage.getItem("ohsmsUsers") || "[]");

// ------------------------------------------------------------
// Roles — قائمة الأدوار في النظام
// ------------------------------------------------------------
// ------------------------------------------------------------
// Roles — قائمة الأدوار في النظام + الصلاحيات
// ------------------------------------------------------------
// ------------------------------------------------------------
// Roles — قائمة الأدوار في النظام + الصلاحيات
// ------------------------------------------------------------
 const OHSMS_ROLES = {

    // مدير النظام
    system_admin: {
        nameAr: "مدير النظام",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_partners",
            "view_forms",
            "view_dashboard",
            "view_system"
        ]
    },

    // موظف النظام (يساعد المدير في تشغيل النظام)
    system_operator: {
        nameAr: "موظف النظام",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_partners",
            "view_forms",
            "view_dashboard"
            // لا نعطيه view_system حتى لا يغيّر إعدادات حساسة
        ]
    },

    // الإدارة العليا (مجلس إدارة / رئيس / نواب / مدراء مراكز)
    top_management: {
        nameAr: "الإدارة العليا",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_partners",
            "view_forms",
            "view_dashboard"
            // مشاهدة ومتابعة فقط، بدون إدارة النظام
        ]
    },

    // لجنة الصحة والسلامة المهنية
    ohs_committee: {
        nameAr: "لجنة الصحة والسلامة المهنية",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_forms",
            "view_dashboard"
        ]
    },

    // مدير فرع
    branch_manager: {
        nameAr: "مدير فرع",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_forms",
            "view_dashboard"
        ]
    },

    // مدير إدارة
    department_manager: {
        nameAr: "مدير إدارة",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_forms",
            "view_dashboard"
        ]
    },

    // مدير قسم
    section_manager: {
        nameAr: "مدير قسم",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_forms",
            "view_dashboard"
        ]
    },

    // منسق صحة وسلامة (في فرع / إدارة / قسم)
    safety_coordinator: {
        nameAr: "منسق صحة وسلامة",
        permissions: [
            "view_home",
            "view_reports",
            "view_risks",
            "view_awareness",
            "view_forms",
            "view_dashboard"
        ]
    },

    // منفذ إجراءات (الشخص الذي ينفذ الإجراء التصحيحي / الوقائي)
    safety_executor: {
        nameAr: "منفذ إجراءات",
        permissions: [
            "view_home",
            "view_risks",
            "view_awareness",
            "view_forms"
            // لا يحتاج تقارير ولا لوحة تحكم عامة
        ]
    },

    // موظف عادي
    employee: {
        nameAr: "موظف",
        permissions: [
            "view_home",      // يدخل ويقدّم البلاغ من الصفحة الرئيسية
            // لا نعطيه view_reports حتى لا يفتح صفحة سجل البلاغات
            "view_risks",     // يطلع على سجل المخاطر العام + الخاص بقسمه (نضبطها لاحقاً داخل الصفحة نفسها)
            "view_awareness", // يقرأ مواد التوعية
            "view_forms",     // يعبّي النماذج المرسلة له
            "view_dashboard"  // لوحة تحكم خاصة بقسمه (نصممها لاحقاً داخل الصفحة)
        ]
    },

    // عميل / شريك
    partner: {
        nameAr: "عميل / شريك",
        permissions: [
            "view_home",
            "view_awareness",
            "view_forms"
            // مثلاً يصلهم نموذج تقييم أو استبيان
        ]
    }

};




// ------------------------------------------
const OHSMS_DEFAULT_USERS = [
  {username:'admin',     password:'1234', role:'system_admin', fullNameAr:'مدير النظام'},
  {username:'employee',  password:'1234', role:'employee', fullNameAr:'موظف'},
  {username:'partner',   password:'1234', role:'partner', fullNameAr:'شريك'}
];

// ------------------------------------------
function ohsmsSetCurrentUser(u){
  if(u) sessionStorage.setItem(OHSMS_AUTH_KEY, JSON.stringify(u));
  else sessionStorage.removeItem(OHSMS_AUTH_KEY);
}
function ohsmsGetCurrentUser(){
  try{
    let raw=sessionStorage.getItem(OHSMS_AUTH_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return null;
}

// ------------------------------------------
async function ohsmsLoadUsers(){
  return OHSMS_DEFAULT_USERS;
}

// ------------------------------------------
function ohsmsHasPermission(perm){
  const u=ohsmsGetCurrentUser();
  if(!u) return false;
  const r=OHSMS_ROLES[u.role];
  if(!r) return false;
  if(r.id==='system_admin') return true;
  return r.permissions.includes(perm);
}

// ------------------------------------------
function ohsmsIsPublicPage(file){
  file=(file||'').toLowerCase();
  return file==='' || file==='index.html' || file==='login.html';
}

// ------------------------------------------
function ohsmsCanAccessPage(file){
  if(ohsmsIsPublicPage(file)) return true;
  if(file==='admin.html')   return ohsmsHasPermission('manage_system');
  if(file==='vendors.html') return ohsmsHasPermission('view_vendors');
  return true;
}

// ------------------------------------------
function ohsmsGuardPage(){
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(ohsmsIsPublicPage(file)) return;

  const u=ohsmsGetCurrentUser();
  if(!u){
    location.href='login.html?redirect='+file;
    return;
  }

  if(!ohsmsCanAccessPage(file)){
    location.href='index.html';
  }
}

// ------------------------------------------
async function ohsmsHandleLogin(form,lang){
  const user=form.querySelector('#loginUsername').value.trim();
  const pass=form.querySelector('#loginPassword').value.trim();
  const msg=document.getElementById('loginMessage');

  if(!user || !pass){
    msg.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
    return false;
  }

  const list=await ohsmsLoadUsers();
  const u=list.find(x=>x.username===user && x.password===pass);

  if(!u){
    msg.textContent='خطأ في اسم المستخدم أو كلمة المرور';
    return false;
  }

  ohsmsSetCurrentUser(u);
  location.href='index.html';
  return false;
}

// ------------------------------------------
function ohsmsLogout(){
  ohsmsSetCurrentUser(null);
  location.href='index.html';
}

// ------------------------------------------
document.addEventListener('DOMContentLoaded',()=>{
  ohsmsGuardPage();
});
function ohsmsOpenAddUserModal(){
  document.getElementById("addUserModal").classList.remove("hidden");
}
function ohsmsCloseAddUserModal(){
  document.getElementById("addUserModal").classList.add("hidden");
}

function ohsmsOpenAddRoleModal(){
  document.getElementById("addRoleModal").classList.remove("hidden");
}
function ohsmsCloseAddRoleModal(){
  document.getElementById("addRoleModal").classList.add("hidden");
}

function ohsmsOpenEditUserModal(){
  document.getElementById("editUserModal").classList.remove("hidden");
}
function ohsmsCloseEditUserModal(){
  document.getElementById("editUserModal").classList.add("hidden");
}

function ohsmsOpenEditRoleModal(){
  document.getElementById("editRoleModal").classList.remove("hidden");
}
function ohsmsCloseEditRoleModal(){
  document.getElementById("editRoleModal").classList.add("hidden");
}
function ohsmsSaveNewUser(){

    const u = {
        username: document.getElementById("newUserUsername").value.trim(),
        fullNameAr: document.getElementById("newUserFullNameAr").value.trim(),
        fullNameEn: document.getElementById("newUserFullNameEn").value.trim(),
        password: document.getElementById("newUserPassword").value.trim(),
        role: document.getElementById("newUserRole").value.trim(),
        active: true
    };

    if(!u.username || !u.password){
        alert("⚠ يجب إدخال اسم المستخدم وكلمة المرور");
        return;
    }

    ohsmsUsers.push(u);

    localStorage.setItem("ohsmsUsers", JSON.stringify(ohsmsUsers));

    ohsmsCloseAddUserModal();
    ohsmsRenderUsersTable();
}
function ohsmsRenderUsersTable(){
    const tbody = document.getElementById("adminUsersTableBody");
    if(!tbody) return;

    tbody.innerHTML = "";

    ohsmsUsers.forEach((u,i)=>{

        // تجاهل المستخدمين المعطلين
        if(u.active === false) return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.username}</td>
            <td>${u.fullNameAr}</td>
            <td>${u.role}</td>
            <td>
                <button onclick="ohsmsEditUser(${i})">تعديل</button>
                <button onclick="ohsmsDisableUser(${i})">تعطيل</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
window.addEventListener("load", ()=>{
    ohsmsRenderUsersTable();
});
function ohsmsDisableUser(index){
    ohsmsUsers[index].active = false;
    localStorage.setItem("ohsmsUsers", JSON.stringify(ohsmsUsers));
    ohsmsRenderUsersTable();
}
function ohsmsFillRolesDropdown(){
    const selectNew = document.getElementById("newUserRole");
    const selectEdit = document.getElementById("editUserRole");

    if(!selectNew) return;

    selectNew.innerHTML = "";
    selectEdit.innerHTML = "";

    Object.keys(OHSMS_ROLES).forEach(roleId=>{
        const opt1 = document.createElement("option");
        opt1.value = roleId;
        opt1.textContent = OHSMS_ROLES[roleId].nameAr;
        selectNew.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = roleId;
        opt2.textContent = OHSMS_ROLES[roleId].nameAr;
        selectEdit.appendChild(opt2);
    });
}
// -----------------------------------------------------------
window.addEventListener("load", ()=>{
    ohsmsFillRolesDropdown();
    ohsmsRenderUsersTable();
});
function ohsmsEditUser(index){
    const u = ohsmsUsers[index];

    document.getElementById("editUserUsername").value   = u.username;
    document.getElementById("editUserFullNameAr").value = u.fullNameAr;
    document.getElementById("editUserFullNameEn").value = u.fullNameEn;
    document.getElementById("editUserRole").value       = u.role;

    window.ohsmsEditingUserIndex = index;
    document.getElementById("editUserModal").classList.remove("hidden");
}
function ohsmsSaveEditedUser(){
    const index = window.ohsmsEditingUserIndex;

    ohsmsUsers[index].fullNameAr  = document.getElementById("editUserFullNameAr").value;
    ohsmsUsers[index].fullNameEn  = document.getElementById("editUserFullNameEn").value;
    ohsmsUsers[index].role        = document.getElementById("editUserRole").value;

    localStorage.setItem("ohsmsUsers", JSON.stringify(ohsmsUsers));

    document.getElementById("editUserModal").classList.add("hidden");

    ohsmsRenderUsersTable();
}
// -----------------------------------------------
// Helpers – التحقق من صلاحيات المستخدم الحالي
// -----------------------------------------------

function ohsmsGetCurrentUserRoleId(){
    const u = ohsmsGetCurrentUser && ohsmsGetCurrentUser();
    return u && u.role ? u.role : null;
}

function ohsmsGetCurrentUserPermissions(){
    const roleId = ohsmsGetCurrentUserRoleId();
    if(!roleId) return [];
    const role = OHSMS_ROLES[roleId];
    return role && Array.isArray(role.permissions) ? role.permissions : [];
}

// استعمال مباشر لفحص صلاحية معينة
function ohsmsHasPermission(permId){
    const list = ohsmsGetCurrentUserPermissions();
    return list.includes(permId);
}
// =============================
//  تهيئة ظهور القوائم حسب الدور
// =============================
function ohsmsInitSidebar(){

    const role = ohsmsGetCurrentUserRoleId();
    const sidebar = document.querySelector(".sidebar");

    if(!sidebar) return;

    // عناصر القائمة
    const links = sidebar.querySelectorAll("a");

    links.forEach(link=>{
        const perm = link.getAttribute("data-permission");
        if(!perm) return;
        if(!ohsmsHasPermission(perm)){
            link.style.display = "none";
        }
    });
}

// تشغيل بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", ()=>{
    ohsmsInitSidebar();
});
