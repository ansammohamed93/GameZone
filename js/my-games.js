  // Animate cards sequentially
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('show');
    }, index * 200); 
  });