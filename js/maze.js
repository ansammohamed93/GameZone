
// ===== Background emojis =====
const bgContainer = document.getElementById("bg-snakes");
const emojis = ["🐱","🍖","🐟","🧶"];
const positions = [
  {x:"5vw", y:"10vh"}, {x:"20vw", y:"15vh"}, {x:"35vw", y:"5vh"},
  {x:"50vw", y:"12vh"}, {x:"65vw", y:"20vh"}, {x:"80vw", y:"8vh"},
  {x:"10vw", y:"30vh"}, {x:"25vw", y:"25vh"}, {x:"40vw", y:"35vh"},
  {x:"55vw", y:"28vh"}, {x:"70vw", y:"32vh"}, {x:"85vw", y:"30vh"},
  {x:"15vw", y:"50vh"}, {x:"30vw", y:"45vh"}, {x:"45vw", y:"55vh"},
  {x:"60vw", y:"48vh"}, {x:"75vw", y:"52vh"}, {x:"90vw", y:"50vh"},
  {x:"5vw", y:"70vh"}, {x:"20vw", y:"65vh"}, {x:"35vw", y:"75vh"},
  {x:"50vw", y:"68vh"}, {x:"65vw", y:"72vh"}, {x:"80vw", y:"70vh"},
  {x:"10vw", y:"90vh"}, {x:"25vw", y:"85vh"}, {x:"40vw", y:"95vh"},
  {x:"55vw", y:"88vh"}, {x:"70vw", y:"92vh"}, {x:"85vw", y:"90vh"}
];

function createFixedBackground(){
  bgContainer.innerHTML = "";
  for(let i=0;i<positions.length;i++){
    const span = document.createElement("span");
    span.classList.add("snake-bg-item");
    span.textContent = emojis[i % emojis.length];
    span.style.left = positions[i].x;
    span.style.top = positions[i].y;
    span.style.fontSize = (20 + (i%5)*5) + "px";
    span.style.setProperty("--dx1","3px"); 
    span.style.setProperty("--dy1","-2px");
    span.style.setProperty("--dx2","-3px"); 
    span.style.setProperty("--dy2","2px");
    span.style.setProperty("--dx3","2px"); 
    span.style.setProperty("--dy3","-3px");
    span.style.animationDuration = (6 + i%4) + "s";
    bgContainer.appendChild(span);
  }
}
createFixedBackground();

// ===== Game =====
const mazeContainer = document.getElementById('maze');
const levelDisplay = document.getElementById('level');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');
const myGamesBtn = document.getElementById('myGamesBtn');
const endCard = document.getElementById('endCard');
const endMessage = document.getElementById('endMessage');
const endActionBtn = document.getElementById('endActionBtn');
const endMyGamesBtn = document.getElementById('endMyGamesBtn');

let playerPos = {x:0,y:0};
let exitPos = {x:9,y:9};
let level = 1;
let timer;
let timeLeft = 60;
let currentGrid = [];
let mazeSize = 10;

// ===== Maze Generation =====
function generateMaze(size){
  const grid = Array.from({length:size},()=>Array(size).fill(1));
  function dfs(x,y){
    const dirs=[[0,1],[1,0],[0,-1],[-1,0]].sort(()=>Math.random()-0.5);
    for(const [dx,dy] of dirs){
      const nx=x+dx*2, ny=y+dy*2;
      if(nx>=0 && ny>=0 && nx<size && ny<size && grid[ny][nx]===1){
        grid[y+dy][x+dx]=0;
        grid[ny][nx]=0;
        dfs(nx,ny);
      }
    }
  }
  grid[0][0]=0; dfs(0,0); grid[size-1][size-1]=0;

  function hasPathBFS(grid){
    const visited=Array.from({length:size},()=>Array(size).fill(false));
    const queue=[[0,0]]; visited[0][0]=true;
    const moves=[[0,1],[1,0],[0,-1],[-1,0]];
    while(queue.length>0){
      const [x,y]=queue.shift();
      if(x===size-1 && y===size-1) return true;
      for(const [dx,dy] of moves){
        const nx=x+dx, ny=y+dy;
        if(nx>=0 && ny>=0 && nx<size && ny<size && !visited[ny][nx] && grid[ny][nx]===0){
          visited[ny][nx]=true; queue.push([nx,ny]);
        }
      }
    }
    return false;
  }

  while(!hasPathBFS(grid)){
    const randX=Math.floor(Math.random()*size);
    const randY=Math.floor(Math.random()*size);
    grid[randY][randX]=0;
  }
  return grid;
}

// ===== Render Maze =====
function renderMaze(grid){
  mazeContainer.innerHTML='';
  mazeContainer.style.gridTemplateColumns = `repeat(${grid.length},1fr)`;
  mazeContainer.style.gridTemplateRows = `repeat(${grid.length},1fr)`;
  for(let y=0;y<grid.length;y++){
    for(let x=0;x<grid[y].length;x++){
      const cell=document.createElement('div');
      cell.classList.add('cell');
      if(grid[y][x]===1) cell.classList.add('wall');
      if(playerPos.x===x && playerPos.y===y){
        cell.classList.add('player');
        cell.style.backgroundImage="url('images/catt.png')";
      }
      if(exitPos.x===x && exitPos.y===y){
        cell.classList.add('exit');
        cell.style.backgroundImage="url('images/food.png')";
      }
      mazeContainer.appendChild(cell);
    }
  }
}

// ===== Start Level =====
function startLevel(lvl){
  mazeSize=10+Math.floor((lvl-1)/2);
  playerPos={x:0,y:0};
  exitPos={x:mazeSize-1,y:mazeSize-1};
  levelDisplay.textContent=lvl;
  currentGrid=generateMaze(mazeSize);
  timeLeft=Math.max(60-(lvl-1)*5,15);
  timeDisplay.textContent=timeLeft;
  renderMaze(currentGrid);
  startTimer();
}

// ===== Player Movement =====
function movePlayer(dx,dy){
  const newX=playerPos.x+dx, newY=playerPos.y+dy;
  if(newX<0||newY<0||newX>=mazeSize||newY>=mazeSize) return;
  if(currentGrid[newY][newX]===1) return;
  playerPos={x:newX,y:newY};
  renderMaze(currentGrid);
  if(playerPos.x===exitPos.x && playerPos.y===exitPos.y) showEndCard(true);
}

// ===== Keyboard Controls =====
document.addEventListener('keydown',e=>{
  switch(e.key){
    case 'ArrowUp': movePlayer(0,-1); break;
    case 'ArrowDown': movePlayer(0,1); break;
    case 'ArrowLeft': movePlayer(-1,0); break;
    case 'ArrowRight': movePlayer(1,0); break;
  }
});

// ===== Touch Controls =====
let touchStart=null;
mazeContainer.addEventListener('touchstart', e=>{ touchStart=e.touches[0]; });
mazeContainer.addEventListener('touchend', e=>{
  if(!touchStart) return;
  const dx=e.changedTouches[0].clientX - touchStart.clientX;
  const dy=e.changedTouches[0].clientY - touchStart.clientY;
  if(Math.abs(dx)>Math.abs(dy)){ dx>0?movePlayer(1,0):movePlayer(-1,0); }
  else { dy>0?movePlayer(0,1):movePlayer(0,-1); }
  touchStart=null;
});

// ===== Timer =====
function startTimer(){
  clearInterval(timer);
  timer=setInterval(()=>{
    timeLeft--; timeDisplay.textContent=timeLeft;
    if(timeLeft<=0){ clearInterval(timer); showEndCard(false); }
  },1000);
}

// ===== End Card =====
function showEndCard(won){
  clearInterval(timer);
  endCard.style.display='flex';
  if(won){
    endMessage.textContent=`Up to Level ${level+1}`;
    endActionBtn.textContent=`Level ${level+1}`;
    endActionBtn.onclick=()=>{ level++; endCard.style.display='none'; startLevel(level); };
  } else {
    endMessage.textContent='Hard Luck!';
    endActionBtn.textContent='Try Again';
    endActionBtn.onclick=()=>{ endCard.style.display='none'; startLevel(level); };
  }
}

// ===== Buttons =====
restartBtn.addEventListener('click',()=>{ startLevel(level); });
myGamesBtn.addEventListener('click',()=>{ window.location.href="my-games.html"; });
endMyGamesBtn.addEventListener('click',()=>{ window.location.href="my-games.html"; });

// ===== Start Game =====
startLevel(level);
