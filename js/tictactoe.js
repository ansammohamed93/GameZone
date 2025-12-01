
    const gameBoard = document.getElementById('gameBoard');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const resultCard = document.getElementById('resultCard');
    const winnerText = document.getElementById('winnerText');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const myGamesBtn = document.getElementById('myGamesBtn');
    const turnIndicator = document.getElementById('turnIndicator');
    const xoBg = document.getElementById('xoBg');

    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameOver = false;

    // مواقع ثابتة للرموز في الخلفية
    const symbolPositions = [
      {x:5,y:10},{x:20,y:15},{x:35,y:25},{x:50,y:5},
      {x:65,y:20},{x:80,y:10},{x:10,y:50},{x:30,y:55},
      {x:55,y:60},{x:75,y:50},{x:90,y:40},{x:15,y:75},
      {x:40,y:70},{x:60,y:80},{x:85,y:75},{x:25,y:90},
      {x:50,y:95},{x:70,y:85},{x:90,y:90},{x:5,y:40},
      {x:12,y:22},{x:37,y:37},{x:63,y:47},{x:78,y:67},
      {x:33,y:12},{x:57,y:27},{x:83,y:17},{x:18,y:63},
      {x:42,y:82},{x:67,y:72},{x:88,y:88},{x:23,y:33},
      {x:48,y:48},{x:73,y:53},{x:13,y:13},{x:35,y:68},
      {x:60,y:28},{x:85,y:33},{x:5,y:80},{x:25,y:55}
    ];

    function createBackgroundSymbols() {
      xoBg.innerHTML = '';
      for(let i=0; i<symbolPositions.length; i++){
        const pos = symbolPositions[i];
        const span = document.createElement('span');
        span.classList.add('xo-symbol');
        span.textContent = i%2===0?'X':'O';
        span.style.left = pos.x + 'vw';
        span.style.top = pos.y + 'vh';
        span.style.fontSize = (15 + (i%5)*5)+'px';
        // حركة بسيطة
    span.style.setProperty('--dx1', (i%6-3)*4 + 'px');
span.style.setProperty('--dy1', (i%6-3)*4 + 'px');
span.style.setProperty('--dx2', (i%5-2)*4 + 'px');
span.style.setProperty('--dy2', (i%5-2)*4 + 'px');
span.style.setProperty('--dx3', (i%4-2)*4 + 'px');
span.style.setProperty('--dy3', (i%4-2)*4 + 'px');

        span.style.animationDuration = (3 + (i%5)*5)+'s';
        xoBg.appendChild(span);
      }
    }
    createBackgroundSymbols();

    // اللعبة
    cells.forEach(cell=>{
      cell.addEventListener('click', ()=>{
        const idx=parseInt(cell.dataset.index);
        if(board[idx]!==''||gameOver) return;
        board[idx]=currentPlayer;
        cell.textContent=currentPlayer;
        checkWinner();
        if(!gameOver){
          currentPlayer = currentPlayer==='X'?'O':'X';
          turnIndicator.textContent=`Turn: ${currentPlayer}`;
        }
      });
    });

    function checkWinner(){
      const winCombos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      let winner=null;
      winCombos.forEach(combo=>{
        const [a,b,c]=combo;
        if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
          winner=board[a];
        }
      });
      if(winner){
        showResultCard(winner);
        gameOver=true;
      } else if(!board.includes('')){
        showResultCard('draw');
        gameOver=true;
      }
    }

    function showResultCard(winner){
      gameBoard.style.display='none';
      turnIndicator.style.display='none';
      resultCard.style.display='block';
      winnerText.textContent = winner==='draw' ? "It's a Draw" : `${winner} Wins🎉`;
    }

    function restartGame(){
      board.fill('');
      cells.forEach(c=>c.textContent='');
      currentPlayer='X';
      gameOver=false;
      resultCard.style.display='none';
      gameBoard.style.display='grid';
      turnIndicator.style.display='block';
      turnIndicator.textContent=`Turn: ${currentPlayer}`;
      createBackgroundSymbols();
    }

    playAgainBtn.addEventListener('click',restartGame);
    myGamesBtn.addEventListener('click',()=>{window.location.href='my-games.html';});
document.getElementById("restartBtn").addEventListener("click", restartGame);

document.getElementById("gamesBtn").addEventListener("click", () => {
  window.location.href = "my-games.html";
});

