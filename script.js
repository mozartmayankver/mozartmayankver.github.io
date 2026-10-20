"use strict";

const EVENT_TIME = new Date("2026-10-26T19:30:00+05:30").getTime();
const MAP_URL = "https://maps.app.goo.gl/p2NmHYaDJmxmdck79";
const openButton = document.querySelector("#open-invitation");
const opening = document.querySelector("#opening");
const invitation = document.querySelector("#invitation");
const pageTransition = document.querySelector("#page-transition");
const main = document.querySelector("main");
const centeringSpace = document.createElement("div");
centeringSpace.setAttribute("aria-hidden", "true");
centeringSpace.className = "segment-centering-space";
main.before(centeringSpace);
let pageNavigationBusy = false;
let activeSegment = opening;

document.documentElement.classList.add("js-ready");
document.documentElement.classList.add("guided-navigation");
document.querySelectorAll(".book-page").forEach((page) => {
  page.inert = true;
  page.hidden = true;
});
opening.inert = false;

function activateSegment(target) {
  activeSegment.inert = true;
  activeSegment.hidden = true;
  if (target === opening) {
    opening.classList.remove("opened");
    openButton.disabled = false;
    openButton.setAttribute("aria-expanded", "false");
  }
  target.hidden = false;
  target.inert = false;
  activeSegment = target;
}

function activeScrollBounds() {
  const segmentTop = window.scrollY + activeSegment.getBoundingClientRect().top;
  const height = activeSegment.offsetHeight;
  const verticalInset = Math.max(0, (window.innerHeight - height) / 2);
  const top = segmentTop - verticalInset;
  return { top, bottom: Math.max(top, segmentTop + height - window.innerHeight + verticalInset) };
}

function alignActiveSegment() {
  const inset = Math.max(0, (window.innerHeight - activeSegment.offsetHeight) / 2);
  centeringSpace.style.height = `${inset}px`;
  scrollWithinActiveSegment(activeScrollBounds().top);
}

function scrollWithinActiveSegment(position) {
  const { top, bottom } = activeScrollBounds();
  window.scrollTo({ top: Math.min(bottom, Math.max(top, position)), behavior: "instant" });
}

window.addEventListener("wheel", (event) => {
  if (event.cancelable) event.preventDefault();
  const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
  scrollWithinActiveSegment(window.scrollY + event.deltaY * multiplier);
}, { passive: false });

let lastTouchY = null;
window.addEventListener("touchstart", (event) => {
  lastTouchY = event.touches.length === 1 ? event.touches[0].clientY : null;
}, { passive: true });
window.addEventListener("touchmove", (event) => {
  if (event.touches.length !== 1 || lastTouchY === null) return;
  const y = event.touches[0].clientY;
  if (event.cancelable) event.preventDefault();
  scrollWithinActiveSegment(window.scrollY + lastTouchY - y);
  lastTouchY = y;
}, { passive: false });
window.addEventListener("touchend", () => { lastTouchY = null; }, { passive: true });

window.addEventListener("keydown", (event) => {
  const editable = event.target.closest("input, textarea, select, [contenteditable='true']");
  const focusedButton = event.target.closest("button");
  if (editable || (event.key === " " && focusedButton)) return;
  const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
  if (!scrollKeys.includes(event.key)) return;
  event.preventDefault();
  const pageStep = window.innerHeight * 0.8;
  const delta = event.key === "ArrowDown" ? 60 : event.key === "ArrowUp" ? -60 : event.key === "PageDown" || event.key === " " ? pageStep : event.key === "PageUp" ? -pageStep : 0;
  if (event.key === "Home") scrollWithinActiveSegment(activeScrollBounds().top);
  else if (event.key === "End") scrollWithinActiveSegment(activeScrollBounds().bottom);
  else scrollWithinActiveSegment(window.scrollY + delta);
});

let correctingScroll = false;
window.addEventListener("scroll", () => {
  if (correctingScroll) return;
  const { top, bottom } = activeScrollBounds();
  if (window.scrollY < top - 1 || window.scrollY > bottom + 1) {
    correctingScroll = true;
    window.scrollTo({ top: Math.min(bottom, Math.max(top, window.scrollY)), behavior: "instant" });
    requestAnimationFrame(() => { correctingScroll = false; });
  }
}, { passive: true });
window.addEventListener("resize", alignActiveSegment, { passive: true });

function navigateToPage(targetId) {
  if (pageNavigationBusy) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    activateSegment(target);
    alignActiveSegment();
    target.focus({ preventScroll: true });
    return;
  }

  pageNavigationBusy = true;
  document.body.classList.add("navigating-by-button");
  pageTransition.className = "page-transition active waiting";

  window.setTimeout(() => {
    activateSegment(target);
    alignActiveSegment();
    target.focus({ preventScroll: true });
    pageTransition.classList.remove("waiting");
    pageTransition.classList.add("revealing");

    window.setTimeout(() => {
      pageTransition.className = "page-transition";
      document.body.classList.remove("navigating-by-button");
      pageNavigationBusy = false;
    }, 1100);
  }, 500);
}

openButton.addEventListener("click", () => {
  if (openButton.disabled) return;
  openButton.disabled = true;
  opening.classList.add("opened");
  openButton.setAttribute("aria-expanded", "true");
  confetti();
  const openingDelay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800;
  window.setTimeout(() => navigateToPage("page-hero"), openingDelay);
});

document.querySelectorAll("[data-next-page]").forEach((button) => {
  button.addEventListener("click", () => navigateToPage(button.dataset.nextPage));
});

function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#D6B779", "#A9CCE8", "#F1DAB8", "#C8DDEB"];
  const count = window.matchMedia("(max-width: 600px)").matches ? 9 : 18;
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count;
    const distance = window.matchMedia("(max-width: 600px)").matches ? 44 + Math.random() * 64 : 75 + Math.random() * 125;
    bit.className = "burst";
    bit.style.background = colors[i % colors.length];
    bit.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    bit.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    document.body.append(bit);
    window.setTimeout(() => bit.remove(), 900);
  }
}

const countEls = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};
const countdown = document.querySelector("#countdown");
const countdownMessage = document.querySelector("#countdown-message");
let countdownTimer;

function updateCountdown() {
  const remaining = EVENT_TIME - Date.now();
  if (remaining <= 0) {
    countdown.hidden = true;
    countdownMessage.textContent = "The celebration has begun!";
    window.clearInterval(countdownTimer);
    return;
  }
  const seconds = Math.floor(remaining / 1000);
  countEls.days.textContent = String(Math.floor(seconds / 86400)).padStart(2, "0");
  countEls.hours.textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
  countEls.minutes.textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  countEls.seconds.textContent = String(seconds % 60).padStart(2, "0");
}
updateCountdown();
function startCountdownTimer() {
  window.clearInterval(countdownTimer);
  if (!countdown.hidden && document.visibilityState === "visible") {
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }
}
startCountdownTimer();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") updateCountdown();
  startCountdownTimer();
});
window.addEventListener("pagehide", () => window.clearInterval(countdownTimer), { once: true });

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.matches(".book-page")) {
          entry.target.classList.add("is-in-view");
        } else {
          currentObserver.unobserve(entry.target);
        }
      } else if (entry.target.matches(".book-page")) {
        entry.target.classList.remove("is-in-view");
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Keep the exact supplied venue URL available as one easy-to-find configuration value.
void MAP_URL;
