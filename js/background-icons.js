// Background Icons – توزيع أفضل
const iconClasses = ["fas fa-gamepad","fas fa-football-ball","fas fa-crosshairs","fas fa-dragon"];
const container = document.getElementById("background-icons");
const numIcons = 30;

// شبكة وهمية لتوزيع الأيقونات
const cols = 6;
const rows = 5;

for (let i = 0; i < numIcons; i++) {
  const icon = document.createElement("i");
  icon.className = iconClasses[Math.floor(Math.random()*iconClasses.length)] + " bg-icon";

  const col = i % cols;
  const row = Math.floor(i / cols);
  const colGap = window.innerWidth / cols;
  const rowGap = window.innerHeight / rows;

  icon.style.left = col * colGap + Math.random() * colGap * 0.7 + "px";
  icon.style.top = row * rowGap + Math.random() * rowGap * 0.7 + "px";
  icon.style.fontSize = 20 + Math.random() * 30 + "px";
  icon.style.color = `rgba(0,${180 + Math.random()*75},255,${0.4 + Math.random()*0.6})`;

  container.appendChild(icon);
}

// تحريك الأيقونات
gsap.to(".bg-icon", {
  y:"+=100", 
  x: "+=" + (Math.random()*50-25),
  rotation:"+=360",
  duration:10,
  repeat:-1,
  yoyo:true,
  ease:"power1.inOut"
});
