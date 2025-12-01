// main.js — unified, robust, ready-to-use
(function () {
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") {
      console.error("GSAP not found. تأكدي من تحميل js/gsap.min.js قبل main.js");
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    /* ---------------------------
       Sections entrance (on page load)
       --------------------------- */
    const sections = qsa(".section");
    if (sections.length) {
      gsap.set(sections, { opacity: 0, y: 40, scale: 0.98 });
      gsap.to(sections, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.35,
        delay: 0.15
      });
    }

    /* ---------------------------
       Hover Neon effect for game cards
       --------------------------- */
    const cards = qsa(".section");
    const cardColors = ["#ff0099"];

    cards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        const color = cardColors[Math.floor(Math.random() * cardColors.length)];
        gsap.to(card, {
          scale: 1.05,
          boxShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
          duration: 0.35,
          ease: "power3.out"
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          boxShadow: "0 0 0px transparent",
          duration: 0.35,
          ease: "power3.out"
        });
      });
    });

    /* ---------------------------
       Cards entrance inside each section
       --------------------------- */
    const allCards = qsa(".game-card");
    if (allCards.length) {
      gsap.fromTo(allCards, {
        opacity: 0,
        y: 30,
        scale: 0.96
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.18,
        delay: 0.8
      });
    }
  });

  // Light/Dark toggle
  window.toggleMode = function() {
    document.body.classList.toggle("light");
    const toggle = qs(".mode-toggle");
    toggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
  };

})();
