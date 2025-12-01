// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // نتركه يظهر لمدة ثانية تقريبًا قبل الاختفاء
  setTimeout(() => {
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 1000);
});
