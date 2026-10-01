// ===================== ДАННЫЕ КАТАЛОГА =====================
const products = [
  { id: 1, brand: "Nike", name: "Air Max 270", price: 12990, emoji: "👟",
    bg: "linear-gradient(135deg,#c8f0d4,#a8e6cf)",
    desc: "Легендарная амортизация Air Max. Мягкая посадка, дышащий верх и стиль на каждый день.",
    sizes: [39, 40, 41, 42, 43, 44] },

  { id: 2, brand: "Adidas", name: "Ultraboost 22", price: 15490, emoji: "👟",
    bg: "linear-gradient(135deg,#d4f0d9,#b8e6c1)",
    desc: "Технология BOOST для максимальной энергии в каждом шаге. Идеально для бега и города.",
    sizes: [40, 41, 42, 43, 44, 45] },

  { id: 3, brand: "Puma", name: "RS-X Reinvention", price: 9990, emoji: "👟",
    bg: "linear-gradient(135deg,#e0f5e0,#c0e8c8)",
    desc: "Массивный ретро-дизайн с современной амортизацией. Яркий акцент в твоём образе.",
    sizes: [38, 39, 40, 41, 42, 43] },

  { id: 4, brand: "New Balance", name: "574 Classic", price: 11200, emoji: "👟",
    bg: "linear-gradient(135deg,#cbeed3,#a0dfb0)",
    desc: "Икона 80-х и хит современности. Замша и сетка, мягкая подошва ENCAP.",
    sizes: [39, 40, 41, 42, 43, 44, 45] },

  { id: 5, brand: "Reebok", name: "Club C 85", price: 8490, emoji: "👟",
    bg: "linear-gradient(135deg,#d8f3dc,#b7e4c7)",
    desc: "Классические теннисные кроссовки в минималистичном дизайне. Кожаный верх, вечная классика.",
    sizes: [38, 39, 40, 41, 42, 43] },

  { id: 6, brand: "Asics", name: "Gel-Kayano 29", price: 16990, emoji: "👟",
    bg: "linear-gradient(135deg,#e6f7e6,#c6ebd0)",
    desc: "Премиальная беговая модель с гелевой амортизацией. Поддержка стопы на длинных дистанциях.",
    sizes: [40, 41, 42, 43, 44, 45] },

  { id: 7, brand: "Jordan", name: "Air 1 Low", price: 18990, emoji: "👟",
    bg: "linear-gradient(135deg,#b9e8c5,#93d8a8)",
    desc: "Культовые баскетбольные кроссовки. Кожаный верх и узнаваемый силуэт Air Jordan 1.",
    sizes: [40, 41, 42, 43, 44, 45] },

  { id: 8, brand: "Vans", name: "Old Skool", price: 7290, emoji: "👟",
    bg: "linear-gradient(135deg,#d0efd8,#aee0bc)",
    desc: "Скейтерская классика с боковой полосой. Прочные, удобные, на все времена.",
    sizes: [38, 39, 40, 41, 42, 43, 44] },
];

// ===================== РЕНДЕР КАТАЛОГА =====================
const catalogEl = document.getElementById("catalog");

function renderCatalog() {
  catalogEl.innerHTML = "";

  products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = (index * 0.08) + "s";

    card.innerHTML = `
      <div class="card-image" style="background:${p.bg}">${p.emoji}</div>
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-price">${p.price.toLocaleString("ru-RU")} ₽</div>
    `;

    card.addEventListener("click", () => openProduct(p.id));
    catalogEl.appendChild(card);
  });
}

// ===================== АВТОРИЗАЦИЯ =====================
const authBlock     = document.getElementById("authBlock");
const modalOverlay  = document.getElementById("modalOverlay");
const modal         = document.getElementById("modal");
const modalClose    = document.getElementById("modalClose");
const loginForm     = document.getElementById("loginForm");
const registerForm  = document.getElementById("registerForm");
const loginError    = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}
function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
function clearUser() {
  localStorage.removeItem("user");
}

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

function shakeModal() {
  modal.classList.remove("shake");
  void modal.offsetWidth;
  modal.classList.add("shake");
}

// РЕГИСТРАЦИЯ
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

  const existing = JSON.parse(localStorage.getItem("allUsers") || "{}");
  if (existing[email]) {
    registerError.textContent = "Этот email уже зарегистрирован";
    shakeModal();
    return;
  }

  existing[email] = { name, password };
  localStorage.setItem("allUsers", JSON.stringify(existing));

  saveUser({ name, email });
  registerForm.reset();
  closeModal();
  renderAuth();
});

// ВХОД
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

// РЕНДЕР ХЕДЕРА
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

// ===================== ТОВАР =====================
const productOverlay = document.getElementById("productOverlay");
const productClose   = document.getElementById("productClose");
const pvImage = document.getElementById("pvImage");
const pvBrand = document.getElementById("pvBrand");
const pvName  = document.getElementById("pvName");
const pvPrice = document.getElementById("pvPrice");
const pvDesc  = document.getElementById("pvDesc");
const pvSizes = document.getElementById("pvSizes");
const pvAdd   = document.getElementById("pvAdd");

let currentProduct = null;
let currentSize    = null;

function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  currentProduct = p;
  currentSize = null;

  pvImage.textContent = p.emoji;
  pvImage.style.background = p.bg;
  pvBrand.textContent = p.brand;
  pvName.textContent  = p.name;
  pvPrice.textContent = p.price.toLocaleString("ru-RU") + " ₽";
  pvDesc.textContent  = p.desc;

  pvSizes.innerHTML = "";
  p.sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.className = "size-btn";
    btn.textContent = size;
    btn.addEventListener("click", () => {
      pvSizes.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSize = size;
    });
    pvSizes.appendChild(btn);
  });

  productOverlay.classList.add("open");
}

productClose.addEventListener("click", () => productOverlay.classList.remove("open"));
productOverlay.addEventListener("click", (e) => {
  if (e.target === productOverlay) productOverlay.classList.remove("open");
});

pvAdd.addEventListener("click", () => {
  if (!currentProduct) return;

  if (!currentSize) {
    pvSizes.parentElement.style.transition = "transform .2s";
    pvSizes.parentElement.style.transform = "scale(1.03)";
    setTimeout(() => { pvSizes.parentElement.style.transform = "scale(1)"; }, 200);
    return;
  }

  addToCart(currentProduct, currentSize);
  productOverlay.classList.remove("open");
});

// ===================== КОРЗИНА =====================
const cartBtn    = document.getElementById("cartBtn");
const cartBadge  = document.getElementById("cartBadge");
const cartOverlay= document.getElementById("cartOverlay");
const cartClose  = document.getElementById("cartClose");
const cartList   = document.getElementById("cartList");
const cartFooter = document.getElementById("cartFooter");
const cartTotal  = document.getElementById("cartTotal");
const checkoutBtn= document.getElementById("checkoutBtn");

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, size) {
  const cart = getCart();
  const key = `${product.id}-${size}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      emoji: product.emoji,
      bg: product.bg,
      size,
      qty: 1,
    });
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = total;
  cartBadge.classList.toggle("show", total > 0);
}

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        Корзина пока пуста
      </div>`;
    cartFooter.classList.add("hidden");
    return;
  }

  cartFooter.classList.remove("hidden");
  cartList.innerHTML = "";

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-img" style="background:${item.bg}">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.brand} ${item.name}</div>
        <div class="cart-item-sub">Размер: ${item.size} • ${item.qty} шт.</div>
      </div>
      <div class="cart-item-price">${(item.price * item.qty).toLocaleString("ru-RU")} ₽</div>
      <button class="cart-item-remove" title="Удалить">🗑</button>
    `;
    el.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.key));
    cartList.appendChild(el);
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotal.textContent = total.toLocaleString("ru-RU") + " ₽";
}

cartBtn.addEventListener("click", () => {
  renderCart();
  cartOverlay.classList.add("open");
});
cartClose.addEventListener("click", () => cartOverlay.classList.remove("open"));
cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) cartOverlay.classList.remove("open");
});

checkoutBtn.addEventListener("click", () => {
  alert("Заказ оформлен! Спасибо за покупку 👟");
  saveCart([]);
  renderCart();
  cartOverlay.classList.remove("open");
});

// Закрытие по Esc — для всех модалок
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalOverlay.classList.remove("open");
    productOverlay.classList.remove("open");
    cartOverlay.classList.remove("open");
  }
});

// ===================== СТАРТ =====================
renderCatalog();
renderAuth();
updateCartBadge();
renderCart();
