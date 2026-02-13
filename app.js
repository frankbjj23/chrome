const hats = [
  {
    id: "h1",
    name: "Noir Cathedral 59FIFTY",
    image: "images/chrome-black-on-black-yankee.JPG",
    alt: "Black custom fitted hat with tonal leather patchwork",
    lookCaption: "Cathedral Noir"
  },
  {
    id: "h2",
    name: "Crossfade Multi Panel",
    image: "images/hat-2.jpg",
    alt: "Group of custom fitted hats with leather patchwork and contrast details",
    lookCaption: "Panel Study"
  },
  {
    id: "h3",
    name: "Emerald Grid Fitted",
    image: "images/hat-3.jpg",
    alt: "Dark green fitted hat with silver hardware and patch accents",
    lookCaption: "Emerald Offset"
  },
  {
    id: "h4",
    name: "Ivory Cross Crest",
    image: "images/Chrome-Yankee-White-crosses.JPG",
    alt: "Ivory custom fitted hat with leather overlays and stitched cross motifs",
    lookCaption: "Ivory Crest"
  }
];

const productGrid = document.getElementById("productGrid");
const lookbookScroll = document.getElementById("lookbookScroll");
const lookbookCaption = document.getElementById("lookbookCaption");
const lookbookProgressBar = document.getElementById("lookbookProgressBar");
const modeToggle = document.getElementById("modeToggle");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");
const tickerTrack = document.getElementById("tickerTrack");
const comparisonRange = document.getElementById("comparisonRange");
const comparisonAfterWrap = document.getElementById("comparisonAfterWrap");
const hero = document.querySelector(".hero");
const magneticButton = document.querySelector(".magnetic");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");

const proofMessages = [
  "Studio update: capsule imagery refreshed",
  "Lookbook session now live",
  "Detail focus: sterling silver top button",
  "Material spotlight: hand-laid leather patchwork",
  "Collection link shared from iPhone",
  "New visual set published"
];

function splitText(element) {
  if (!element || element.dataset.splitDone === "true") return;
  const chars = [...element.textContent];
  element.textContent = "";
  chars.forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.style.setProperty("--char-index", String(index));
    span.textContent = char;
    element.appendChild(span);
  });
  element.dataset.splitDone = "true";
}

function renderProducts() {
  productGrid.innerHTML = hats
    .map(
      (hat) => `
      <article class="product-card reveal" data-id="${hat.id}">
        <figure class="product-media">
          <img src="${hat.image}" alt="${hat.alt}" loading="lazy" />
          <span class="badge">Limited Drop</span>
          <button class="hotspot one" data-tip="Leather patchwork" aria-label="Leather patchwork detail">
            +
            <span class="hotspot-tip">Leather patchwork</span>
          </button>
          <button class="hotspot two" data-tip="Sterling silver top button" aria-label="Sterling silver top button detail">
            +
            <span class="hotspot-tip">Sterling silver top button</span>
          </button>
        </figure>
        <div class="product-content">
          <h3 class="product-title">${hat.name}</h3>
          <p class="product-meta">Leather patchwork with a custom sterling silver button on top.</p>
          <p class="scarcity">Display archive piece</p>
        </div>
      </article>
    `
    )
    .join("");
}

function renderLookbook() {
  lookbookScroll.innerHTML = hats
    .map(
      (hat, index) => `
      <figure class="lookbook-item reveal" data-look-index="${index}">
        <img src="${hat.image}" alt="Lookbook view: ${hat.alt}" loading="lazy" />
        <span class="lookbook-tag">Look 0${index + 1}</span>
      </figure>
    `
    )
    .join("");
}

function renderTicker() {
  const joined = proofMessages.map((msg) => `<span>${msg}</span>`).join("<span>•</span>");
  tickerTrack.innerHTML = `${joined}<span>•</span>${joined}`;
}

function pushProofMessage(message) {
  proofMessages.unshift(message);
  if (proofMessages.length > 8) proofMessages.pop();
  renderTicker();
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

function setupCountdown() {
  const key = "showcaseEndAt";
  let endAt = Number(localStorage.getItem(key));
  if (!endAt || Number.isNaN(endAt) || endAt < Date.now()) {
    endAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(key, String(endAt));
  }

  const tick = () => {
    const diff = Math.max(0, endAt - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");

    if (days <= 7) {
      document.body.classList.add("final-week");
    }
  };

  tick();
  setInterval(tick, 1000);
}

function setupLookbookProgress() {
  const update = () => {
    const max = Math.max(1, lookbookScroll.scrollWidth - lookbookScroll.clientWidth);
    const progress = lookbookScroll.scrollLeft / max;
    lookbookProgressBar.style.width = `${Math.max(12, progress * 100)}%`;

    const itemWidth = lookbookScroll.querySelector(".lookbook-item")?.clientWidth || 1;
    const idx = Math.min(hats.length - 1, Math.round(lookbookScroll.scrollLeft / itemWidth));
    lookbookCaption.textContent = `Look 0${idx + 1} / ${hats[idx].lookCaption}`;
  };

  lookbookScroll.addEventListener("scroll", update, { passive: true });
  update();
}

function setupComparison() {
  const update = () => {
    comparisonAfterWrap.style.setProperty("--split", `${comparisonRange.value}%`);
    comparisonAfterWrap.style.width = `${comparisonRange.value}%`;
  };
  comparisonRange.addEventListener("input", update);
  update();
}

function setupMagneticCta() {
  if (!magneticButton) return;

  const reset = () => {
    magneticButton.style.transform = "translate(0, 0)";
  };

  magneticButton.addEventListener("pointermove", (event) => {
    const rect = magneticButton.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    magneticButton.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
  });

  magneticButton.addEventListener("pointerleave", reset);
  magneticButton.addEventListener("blur", reset);
}

function setupParallaxAndAmbient() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const shift = Math.max(-26, window.scrollY * -0.06);
        hero.style.setProperty("--hero-shift", `${shift}px`);
        updateStackedCards();
      },
      { passive: true }
    );
  }

  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty("--mx", `${x}%`);
    document.documentElement.style.setProperty("--my", `${y}%`);
  });
}

function updateStackedCards() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const center = window.innerHeight * 0.55;
    const distance = (rect.top - center) / window.innerHeight;
    const y = Math.max(-8, Math.min(16, distance * 24)) + index * 0.7;
    const scale = 1 - Math.min(0.035, Math.abs(distance) * 0.05);
    card.style.setProperty("--stack-y", `${y}px`);
    card.style.setProperty("--stack-scale", scale.toFixed(3));
  });
}

function setupHotspots() {
  productGrid.addEventListener("click", (event) => {
    const hotspot = event.target.closest(".hotspot");
    if (!hotspot) return;

    const card = hotspot.closest(".product-card");
    card.querySelectorAll(".hotspot").forEach((node) => {
      if (node !== hotspot) node.classList.remove("active");
    });
    hotspot.classList.toggle("active");
  });
}

function setupCinematicTitle() {
  splitText(document.getElementById("hero-title"));
}

renderProducts();
renderLookbook();
renderTicker();
setupTheme();
setupReveal();
setupCountdown();
setupLookbookProgress();
setupComparison();
setupMagneticCta();
setupParallaxAndAmbient();
setupHotspots();
setupCinematicTitle();
updateStackedCards();

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

window.addEventListener("resize", () => {
  updateStackedCards();
});
