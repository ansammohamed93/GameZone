const board = document.getElementById('gameBoard');
const symbols = ['🍎','🍌','🍇','🍒','🍉','🥝','🍍','🥑'];
let cards = [...symbols, ...symbols];
let firstCard = null, secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
const totalPairs = symbols.length;

// الأصوات
const clickSound = document.getElementById('clickSound');
const matchSound = document.getElementById('matchSound');
const wrongSound = document.getElementById('wrongSound');
const winSound = document.getElementById('winSound');

// Shuffle cards
cards.sort(() => 0.5 - Math.random());

// Create cards
cards.forEach(symbol => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = symbol;
  card.addEventListener('click', flipCard);
  board.appendChild(card);
});

function flipCard() {
  if(lockBoard) return;
  if(this === firstCard) return;

  clickSound.play(); // صوت الضغط

  this.classList.add('flipped');
  this.innerText = this.dataset.symbol;

  if(!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  if(firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchSound.play(); // صوت المطابقة
    matchedPairs++;

    resetBoard();

    if(matchedPairs === totalPairs) {
      setTimeout(() => {
        winSound.play(); // صوت الفوز
        alert("You Won! 🎉");
      }, 500);
    }

  } else {
    lockBoard = true;
    
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.innerText = '';
      secondCard.innerText = '';
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
// Restart Game
document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});
