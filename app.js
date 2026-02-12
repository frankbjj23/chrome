const hats = [
  {
    id: "h1",
    name: "Noir Cathedral 59FIFTY",
    image: "images/hat-1.jpg",
    alt: "Black custom fitted hat with tonal leather patchwork",
    price: "$400"
  },
  {
    id: "h2",
    name: "Crossfade Multi Panel",
    image: "images/hat-2.jpg",
    alt: "Group of custom fitted hats with leather patchwork and contrast details",
    price: "$400"
  },
  {
    id: "h3",
    name: "Emerald Grid Fitted",
    image: "images/hat-3.jpg",
    alt: "Dark green fitted hat with silver hardware and patch accents",
    price: "$400"
  },
  {
    id: "h4",
    name: "Ivory Cross Crest",
    image: "images/hat-4.jpg",
    alt: "Ivory custom fitted hat with leather overlays and stitched cross motifs",
    price: "$400"
  }
];

const productGrid = document.getElementById("productGrid");
const lookbookScroll = document.getElementById("lookbookScroll");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartDrawer = document.getElementById("cartDrawer");
const cartOpen = document.getElementById("cartOpen");
const cartClose = document.getElementById("cartClose");
const cartBackdrop = document.getElementById("cartBackdrop");
const checkoutButton = document.getElementById("checkoutButton");
const orderConfirmation = document.getElementById("orderConfirmation");
const modeToggle = document.getElementById("modeToggle");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

const cart = [];

function renderProducts() {
  productGrid.innerHTML = hats
    .map(
      (hat) => `
      <article class="product-card reveal">
        <figure class="product-media">
          <img src="${hat.image}" alt="${hat.alt}" loading="lazy" />
          <span class="badge">Limited Drop</span>
        </figure>
        <div class="product-content">
          <h3 class="product-title">${hat.name}</h3>
          <p class="product-meta">Leather patchwork with a custom sterling silver button on top.</p>
          <p class="scarcity">Only 12 made · 30-day quickstrike</p>
          <button class="add-btn" data-id="${hat.id}">Add to Cart · ${hat.price}</button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderLookbook() {
  lookbookScroll.innerHTML = hats
    .map(
      (hat) => `
      <figure class="lookbook-item reveal">
        <img src="${hat.image}" alt="Lookbook view: ${hat.alt}" loading="lazy" />
      </figure>
    `
    )
    .join("");
}

function addToCart(id) {
  const hat = hats.find((item) => item.id === id);
  if (!hat) return;

  cart.push(hat);
  orderConfirmation.style.display = "none";
  orderConfirmation.innerHTML = "";
  renderCart();
}

function renderCart() {
  cartCount.textContent = String(cart.length);
  cartItems.innerHTML = cart.map((hat) => `<li>${hat.name} ${hat.price}</li>`).join("");
  checkoutButton.disabled = cart.length === 0;
}

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const serial = String(Math.floor(Math.random() * 9000) + 1000);
  return `CH-${y}${m}${d}-${serial}`;
}

function completeCheckout() {
  if (cart.length === 0) return;

  const orderNumber = generateOrderNumber();
  orderConfirmation.style.display = "block";
  orderConfirmation.innerHTML = `
    <p><strong>Order #${orderNumber}</strong> created.</p>
    <p>Contact: <strong>drops@chatelier.example</strong></p>
    <p>Phone: <strong>(555) 013-1988</strong></p>
    <p>Share your order number for follow-up.</p>
  `;

  cart.length = 0;
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.body.dataset.theme = saved;
  }
  syncThemeText();
}

function syncThemeText() {
  const isLight = document.body.dataset.theme === "light";
  modeToggle.querySelector(".mode-toggle-text").textContent = isLight ? "Dark" : "Light";
  modeToggle.setAttribute("aria-label", isLight ? "Toggle dark mode" : "Toggle light mode");
}

function toggleTheme() {
  const current = document.body.dataset.theme;
  const next = current === "light" ? "dark" : "light";
  document.body.dataset.theme = next;
  localStorage.setItem("theme", next);
  syncThemeText();
}

function setupReveal() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

renderProducts();
renderLookbook();
setupTheme();
setupReveal();
renderCart();

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-btn");
  if (!button) return;
  addToCart(button.dataset.id);
  openCart();
});

cartOpen.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", completeCheckout);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

modeToggle.addEventListener("click", toggleTheme);

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("open");
});

navMenu.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});
