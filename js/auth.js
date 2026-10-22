/* =========================================================
   FILE: js/auth.js
   TH true MILK - Đăng ký, đăng nhập, đăng xuất
   Tài khoản mô phỏng cho bài ASM
   ========================================================= */

const AUTH_USERS_KEY = "th_true_milk_users";
const AUTH_CURRENT_USER_KEY = "th_true_milk_current_user";
const AUTH_REMEMBERED_USER_KEY = "th_true_milk_remembered_user";

// =========================================================
// ĐỌC DỮ LIỆU
// =========================================================

function readStorageArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Không đọc được dữ liệu:", error);
    return [];
  }
}

function getRegisteredUsers() {
  return readStorageArray(AUTH_USERS_KEY);
}

function showAuthAlert(message) {
  alert(message);
}

// =========================================================
// THANH TÌM KIẾM TRÊN HEADER
// =========================================================

function toggleSearchBar() {
  const toggleBtn = document.getElementById("searchToggleBtn");
  const searchForm = document.getElementById("searchExpandForm");
  const searchInput = document.getElementById("searchExpandInput");

  if (!searchForm) return;

  const isOpen = searchForm.classList.toggle("active");

  if (toggleBtn) {
    toggleBtn.style.display = isOpen ? "none" : "";
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  }

  if (isOpen && searchInput) {
    searchInput.focus();
  }
}

// =========================================================
// ĐĂNG KÝ
// =========================================================

function handleRegister(event) {
  event.preventDefault();

  const form = document.getElementById("registerForm");
  if (!form) return;

  const name = document.getElementById("regName")?.value.trim() || "";
  const phone = document.getElementById("regPhone")?.value.trim() || "";
  const email = (document.getElementById("regEmail")?.value || "").trim().toLowerCase();
  const password = document.getElementById("regPassword")?.value || "";
  const confirmPassword = document.getElementById("regConfirmPassword")?.value || "";

  if (!name || !phone || !email || !password || !confirmPassword) {
    showAuthAlert("Vui lòng nhập đầy đủ các thông tin.");
    return;
  }

  // Kiểm tra email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showAuthAlert("Email không đúng định dạng. Vui lòng kiểm tra lại.");
    return;
  }

  // Kiểm tra số điện thoại Việt Nam
  const normalizedPhone = phone.replace(/[\s.-]/g, "");
  const phonePattern = /^(0\d{9}|\+84\d{9})$/;

  if (!phonePattern.test(normalizedPhone)) {
    showAuthAlert("Vui lòng nhập số điện thoại Việt Nam hợp lệ.");
    return;
  }

  // Kiểm tra mật khẩu
  if (password.length < 6) {
    showAuthAlert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  if (password !== confirmPassword) {
    showAuthAlert("Mật khẩu xác nhận không khớp.");
    return;
  }

  const users = getRegisteredUsers();

  // Không cho đăng ký trùng email hoặc số điện thoại
  const duplicate = users.some((user) => {
    const savedEmail = String(user.email || "")
      .trim()
      .toLowerCase();
    const savedPhone = String(user.phone || "").replace(/[\s.-]/g, "");

    return savedEmail === email || savedPhone === normalizedPhone;
  });

  if (duplicate) {
    showAuthAlert("Email hoặc số điện thoại đã được đăng ký. Vui lòng đăng nhập.");
    return;
  }

  // Tạo tài khoản
  const newUser = {
    id: "user_" + Date.now(),
    name: name,
    phone: normalizedPhone,
    email: email,
    password: password,
  };

  users.push(newUser);

  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Không lưu được tài khoản:", error);
    showAuthAlert("Không thể lưu tài khoản. Vui lòng thử lại.");
    return;
  }

  form.reset();

  // Bấm OK mới chuyển trang
  showAuthAlert("Bạn đã đăng ký thành công!");
  window.location.href = "login.html";
}

// =========================================================
// ĐĂNG NHẬP
// =========================================================

function handleLogin(event) {
  event.preventDefault();

  const form = document.getElementById("loginForm");
  if (!form) return;

  const accountInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  if (!accountInput || !passwordInput) {
    showAuthAlert("Không tìm thấy ô nhập thông tin đăng nhập.");
    return;
  }

  const account = accountInput.value.trim();
  const password = passwordInput.value;

  if (!account && !password) {
    showAuthAlert("Đăng nhập thành công.");
    return;
  }

  if (!account) {
    showAuthAlert("Đăng nhập thành công.");
    accountInput.focus();
    return;
  }

  if (!password) {
    showAuthAlert("Vui lòng nhập mật khẩu.");
    passwordInput.focus();
    return;
  }

  const users = getRegisteredUsers();
  const normalizedAccount = account.toLowerCase();
  const normalizedPhone = account.replace(/[\s.-]/g, "");

  const user = users.find((item) => {
    const savedEmail = String(item.email || "")
      .trim()
      .toLowerCase();
    const savedPhone = String(item.phone || "").replace(/[\s.-]/g, "");

    return savedEmail === normalizedAccount || savedPhone === normalizedPhone;
  });

  if (!user) {
    showAuthAlert("Email hoặc số điện thoại chưa được đăng ký. Vui lòng kiểm tra lại.");
    accountInput.focus();
    return;
  }

  if (user.password !== password) {
    showAuthAlert("Mật khẩu không chính xác. Vui lòng nhập lại.");
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  const currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  try {
    localStorage.removeItem(AUTH_CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_REMEMBERED_USER_KEY);

    sessionStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(currentUser));
  } catch (error) {
    console.error("Không lưu được trạng thái đăng nhập:", error);
    showAuthAlert("Không thể lưu trạng thái đăng nhập. Vui lòng thử lại.");
    return;
  }

  form.reset();

  // Bấm OK mới chuyển trang
  showAuthAlert("Bạn đã đăng nhập thành công!");
  window.location.href = "index.html";
}

function handleLogout() {
  try {
    localStorage.removeItem(AUTH_CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_REMEMBERED_USER_KEY);
    sessionStorage.removeItem(AUTH_CURRENT_USER_KEY);
  } catch (error) {
    console.error("Không thể xóa trạng thái đăng nhập:", error);
  }

  window.location.href = "index.html";
}

// =========================================================
// CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG
// =========================================================

function updateCartBadge() {
  const cart = readStorageArray("cart");

  const totalCount = cart.reduce((sum, item) => {
    return sum + Math.max(0, Number(item.quantity) || 0);
  }, 0);

  const badge = document.getElementById("cart-count-badge");

  if (badge) {
    badge.textContent = totalCount;
    badge.setAttribute("aria-label", totalCount + " sản phẩm trong giỏ hàng");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();

  // Xóa dữ liệu ghi nhớ tài khoản của phiên bản cũ
  try {
    localStorage.removeItem(AUTH_REMEMBERED_USER_KEY);
  } catch (error) {
    console.error("Không thể xóa dữ liệu ghi nhớ cũ:", error);
  }

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});
