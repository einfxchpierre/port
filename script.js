// Copy & selection protection
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());

// Typing animation
const words = ["Feuerwehrmann", "Systemintegrator"];
const typingEl = document.getElementById("typingtext");
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
  if (!typingEl) return;
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;
  } else {
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typingDelay = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingDelay = 300;
  }

  setTimeout(typeEffect, typingDelay);
}

// Scroll reveal - sections appear when scrolled into view
function handleScrollReveal() {
  const sections = document.querySelectorAll(".disabled");

  function reveal(el) {
    el.classList.add("appear");
    el.classList.remove("disabled");
  }

  if (!("IntersectionObserver" in window)) {
    sections.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Randomly swapping Discord server cards (2 visible)
function initGuildShuffle() {
  const grid = document.querySelector(".guilds-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".guild-card"));
  if (cards.length < 2) return;

  const PINNED = 0; // EinfxchPingu bleibt immer sichtbar
  const FIRST_SWAP_DELAY = 120000;
  const SECOND_SLOTS = [];
  cards.forEach((_, i) => {
    if (i !== PINNED) SECOND_SLOTS.push(i);
  });

  let timer = null;
  let used = [1]; // MonsterSMP ist die initiale zweite Karte

  function pickSecond() {
    if (used.length === SECOND_SLOTS.length) used = [];
    let idx;
    do {
      idx = SECOND_SLOTS[Math.floor(Math.random() * SECOND_SLOTS.length)];
    } while (used.includes(idx));
    used.push(idx);
    return idx;
  }

  function renderPair(second, animate) {
    grid.classList.add("swapping");
    setTimeout(() => {
      cards.forEach((card) => card.remove());
      grid.appendChild(cards[PINNED]);
      grid.appendChild(cards[second]);
      void grid.offsetWidth;
      grid.classList.remove("swapping");
    }, animate ? 450 : 0);
  }

  function schedule() {
    stop();
    timer = setTimeout(() => {
      renderPair(pickSecond(), true);
      schedule();
    }, 3200 + Math.random() * 2000);
  }

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  grid.addEventListener("mouseenter", stop);
  grid.addEventListener("mouseleave", schedule);
  grid.addEventListener("touchstart", stop, { passive: true });
  grid.addEventListener("touchend", schedule);

  // Immer zuerst EinfxchPingu + MonsterSMP rendern
  renderPair(1, false);

  // Erster Tausch erst nach 120 Sekunden
  timer = setTimeout(() => {
    renderPair(pickSecond(), true);
    schedule();
  }, FIRST_SWAP_DELAY);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  handleScrollReveal();
  initGuildShuffle();
});
