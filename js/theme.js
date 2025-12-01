// Dark/Light Mode
const themeToggle = document.getElementById('theme-toggle');

// تفعيل الثيم عند الضغط على الأيقونة نفسها
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  updateThemeIcon();
});

// تغيير الأيقونة حسب الوضع
function updateThemeIcon() {

  if (document.body.classList.contains('light-mode')) {
    themeToggle.className = 'fa-regular fa-moon'; 
    themeToggle.title = "Light Mode";

    document.querySelector('.creative-navbar').style.background = '#fff' ;
    document.querySelector('.creative-navbar').style.borderColor = '#00aaff';

  } else {
    themeToggle.className = 'fa-solid fa-moon'; // 🌙
    themeToggle.title = "Dark Mode";

    document.querySelector('.creative-navbar').style.background = '#000';
    document.querySelector('.creative-navbar').style.borderColor = '#00ffff';
  }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateThemeIcon);

// Tooltip عند المرور
themeToggle.addEventListener('mouseenter', () => {
  if(document.body.classList.contains('dark-mode')){
    themeToggle.title = "Switch to Light Mode";
  } else {
    themeToggle.title = "Switch to Dark Mode";
  }
});
themeToggle.addEventListener('mouseleave', updateThemeIcon);
