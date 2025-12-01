// Neon Header letters & shadow
const header = document.querySelector("h1");
header.innerHTML = header.textContent
  .split("")
  .map(char => `<span class="letter">${char}</span>`)
  .join("");

const letters = document.querySelectorAll(".letter");
const colors = ["#00ffff", "#ff00ff", "#00ffcc", "#ff0099"];

letters.forEach((letter) => {
  gsap.to(letter, {
    color: () => colors[Math.floor(Math.random() * colors.length)],
    textShadow: () => `
      0 0 5px ${colors[Math.floor(Math.random() * colors.length)]},
      0 0 8px ${colors[Math.floor(Math.random() * colors.length)]},
      0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}
    `,
    repeat: -1,
    yoyo: true,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2
  });
});

// Neon Navbar border
const navbar = document.querySelector(".creative-navbar");
gsap.to(navbar, {
  boxShadow: [
    "0 0 5px #00ffff, 0 0 10px #ff00ff, 0 0 15px #00ffcc",
    "0 0 5px #ff00ff, 0 0 10px #00ffcc, 0 0 15px #ff0099",
    "0 0 5px #00ffcc, 0 0 10px #ff0099, 0 0 15px #00ffff",
    "0 0 5px #ff0099, 0 0 10px #00ffff, 0 0 15px #ff00ff"
  ],
  duration: 4,
  repeat: -1,
  yoyo: true
});
