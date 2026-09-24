// ===================== ДАННЫЕ КАТАЛОГА =====================
// Пока массив прямо здесь. Потом можно вынести в отдельный products.js
const products = [
  { id: 1, brand: "Nike",    name: "Air Max 270",       price: 12990, emoji: "", bg: "linear-gradient(135deg,#c8f0d4,#a8e6cf)" },
  { id: 2, brand: "Adidas",  name: "Ultraboost 22",     price: 15490, emoji: "", bg: "linear-gradient(135deg,#d4f0d9,#b8e6c1)" },
  { id: 3, brand: "Puma",    name: "RS-X Reinvention",  price: 9990,  emoji: "", bg: "linear-gradient(135deg,#e0f5e0,#c0e8c8)" },
  { id: 4, brand: "New Balance", name: "574 Classic",   price: 11200, emoji: "", bg: "linear-gradient(135deg,#cbeed3,#a0dfb0)" },
  { id: 5, brand: "Reebok",  name: "Club C 85",         price: 8490,  emoji: "", bg: "linear-gradient(135deg,#d8f3dc,#b7e4c7)" },
  { id: 6, brand: "Asics",   name: "Gel-Kayano 29",     price: 16990, emoji: "", bg: "linear-gradient(135deg,#e6f7e6,#c6ebd0)" },
  { id: 7, brand: "Jordan",  name: "Air 1 Low",         price: 18990, emoji: "", bg: "linear-gradient(135deg,#b9e8c5,#93d8a8)" },
  { id: 8, brand: "Vans",    name: "Old Skool",         price: 7290,  emoji: "", bg: "linear-gradient(135deg,#d0efd8,#aee0bc)" },
];

// ===================== РЕНДЕР КАТАЛОГА =====================
const catalogEl = document.getElementById("catalog");

function renderCatalog() {
  catalogEl.innerHTML = "";

  products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";
    // задержка появления для "каскадного" эффекта
    card.style.animationDelay = (index * 0.08) + "s";

    card.innerHTML = `
      <div class="card-image" style="background:${p.bg}">${p.emoji}</div>
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-price">${p.price.toLocaleString("ru-RU")} ₽</div>
    `;

    card.addEventListener("click", () => {
      // сюда потом повесим переход на страницу товара
      console.log("Клик по товару:", p.name);
    });

    catalogEl.appendChild(card);
  });
}

// ===================== АВТОРИЗАЦИЯ (заготовка под шаг 2) =====================
// Пока просто отображаем имя, если пользователь есть в localStorage.
// На шаге 2 сделаем модалку с формой регистрации/входа.

// ===================== АВТОРИЗАЦИЯ =====================

const authBlock     = document.getElementById("authBlock");
const modalOverlay  = document.getElementById("modalOverlay");
const modal         = document.getElementById("modal");
const modalClose    = document.getElementById("modalClose");
const loginForm     = document.getElementById("loginForm");
const registerForm  = document.getElementById("registerForm");
const loginError    = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

// ---------- Хранилище ----------
function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}
function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
function clearUser() {
  localStorage.removeItem("user");
}

// ---------- Открытие / закрытие модалки ----------
function openModal(tab = "login") {
  switchTab(tab);
  loginError.textContent = "";
  registerError.textContent = "";
  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- Переключение вкладок ----------
const tabs = document.querySelectorAll(".tab");

function switchTab(name) {
  tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  if (name === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

// ---------- Тряска модалки при ошибке ----------
function shakeModal() {
  modal.classList.remove("shake");
  void modal.offsetWidth; // форс-перезапуск анимации
  modal.classList.add("shake");
}

// ---------- РЕГИСТРАЦИЯ ----------
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(registerForm);
  const name     = data.get("name").trim();
  const email    = data.get("email").trim().toLowerCase();
  const password = data.get("password");

  if (name.length < 2) {
    registerError.textContent = "Имя слишком короткое";
    shakeModal();
    return;
  }

  // Проверяем, что email ещё не занят
  const existing = JSON.parse(localStorage.getItem("allUsers") || "{}");
  if (existing[email]) {
    registerError.textContent = "Этот email уже зарегистрирован";
    shakeModal();
    return;
  }

  // Сохраняем пользователя в "базу"
  existing[email] = { name, password };
  localStorage.setItem("allUsers", JSON.stringify(existing));

  // Логиним
  saveUser({ name, email });
  registerForm.reset();
  closeModal();
  renderAuth();
});

// ---------- ВХОД ----------
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const email    = data.get("email").trim().toLowerCase();
  const password = data.get("password");

  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "{}");
  const found = allUsers[email];

  if (!found || found.password !== password) {
    loginError.textContent = "Неверный email или пароль";
    shakeModal();
    return;
  }

  saveUser({ name: found.name, email });
  loginForm.reset();
  closeModal();
  renderAuth();
});

// ---------- Рендер хедера ----------
function renderAuth() {
  const user = getUser();

  if (user) {
    authBlock.innerHTML = `
      <div class="user-box">
        <div class="user-name">👤 ${user.name}</div>
        <button class="btn-logout" id="logoutBtn" title="Выйти">⎋</button>
      </div>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      clearUser();
      renderAuth();
    });
  } else {
    authBlock.innerHTML = `
      <button class="btn btn-outline" id="loginBtn">Вход</button>
      <button class="btn btn-primary" id="registerBtn">Регистрация</button>
    `;
    document.getElementById("loginBtn").addEventListener("click", () => openModal("login"));
    document.getElementById("registerBtn").addEventListener("click", () => openModal("register"));
  }
}

// ===================== СТАРТ =====================
renderCatalog();
renderAuth();