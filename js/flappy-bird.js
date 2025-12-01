
/* ---------- background emojis ---------- */
const bgContainer = document.getElementById('bg-flappy');
const bgEmojis = ["☁️","🌵","🕊","🪶","🐦"];
const bgPositions = [
  {x:"5vw",y:"8vh"},{x:"20vw",y:"15vh"},{x:"35vw",y:"6vh"},
  {x:"50vw",y:"12vh"},{x:"70vw",y:"9vh"},{x:"88vw",y:"18vh"},
  {x:"12vw",y:"30vh"},{x:"28vw",y:"38vh"},{x:"48vw",y:"28vh"},
  {x:"68vw",y:"35vh"},{x:"15vw",y:"60vh"},{x:"42vw",y:"58vh"},
  {x:"72vw",y:"66vh"},{x:"26vw",y:"74vh"},{x:"60vw",y:"82vh"},{x:"85vw",y:"78vh"}
];
bgPositions.forEach((p,i)=>{
  const span=document.createElement('span');
  span.className='bg-item';
  span.textContent=bgEmojis[i % bgEmojis.length];
  span.style.left=p.x;
  span.style.top=p.y;
  span.style.fontSize=(18+(i%4)*4)+'px';
  span.style.setProperty('--dx',(2+(i%3))+'px');
  span.style.setProperty('--dy',(-3-(i%2))+'px');
  span.style.setProperty('--dx2',(-2-(i%3))+'px');
  span.style.setProperty('--dy2',(2+(i%2))+'px');
  span.style.setProperty('--rot',(i%3)+'deg');
  span.style.setProperty('--rot2',(-i%2)+'deg');
  span.style.animationDuration=(6+(i%4))+'s';
  bgContainer.appendChild(span);
});

/* ---------- Flappy Emoji ---------- */
const canvas=document.getElementById('flappyCanvas');
const ctx=canvas.getContext('2d');
let W=canvas.width,H=canvas.height;

let bird={x:90,y:H/2,size:36,vy:0,gravity:0.28,rot:0};
let pipes=[],frame=0,score=0,level=1,maxLevel=5,gameOver=false,paused=false,animId=null;
const scoreEl=document.getElementById('score'),levelEl=document.getElementById('level');
const popup=document.getElementById('popup'),finalScore=document.getElementById('finalScore');
const tryAgainBtn=document.getElementById('tryAgainBtn');

function resetGameVars(){
  pipes=[];
  frame=0;
  score=0;
  bird.y=H/2;
  bird.vy=0;
  bird.rot=0;
  level=1;
  gameOver=false;
  paused=false;
  updateUI();
  popup.style.display='none';
}

const baseSettings={speed:1.5,gap:200,spawnRate:250}; // أسهل: سرعة أبطأ، فجوة أكبر، spawn أقل
function getLevelSettings(lv){
  return {
    speed: baseSettings.speed + lv*0.3,
    gap: baseSettings.gap - lv*10,
    spawnRate: baseSettings.spawnRate - lv*10
  }
}

function spawnPipe(){
  const settings=getLevelSettings(level);
  const top=Math.random()*(H-settings.gap-180)+50;
  pipes.push({x:W+40,top:top,bottom:top+settings.gap,passed:false});
}

function drawBird(){
  ctx.save();
  ctx.translate(bird.x,bird.y);
  ctx.rotate(bird.rot);
  ctx.font=`${bird.size}px serif`;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText('🐦',0,0);
  ctx.restore();
}

function drawPipes(){
  ctx.font='46px serif';
  ctx.textAlign='left';
  ctx.textBaseline='top';
  for(const p of pipes){
    ctx.fillText('🌵',p.x,p.top-36);
    ctx.fillText('🌵',p.x,p.bottom);
  }
}

function checkCollision(){
  if(bird.y+bird.size/2>=H||bird.y-bird.size/2<=0) return true;
  for(const p of pipes){
    if(bird.x+bird.size/2>p.x && bird.x-bird.size/2<p.x+52){
      if(bird.y-bird.size/2<p.top || bird.y+bird.size/2>p.bottom) return true;
    }
  }
  return false;
}

function updateUI(){scoreEl.textContent=score;levelEl.textContent=level;}

function flap(){if(gameOver||paused)return;bird.vy=-7;bird.rot=-1;}

document.addEventListener('keydown',e=>{
  if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();flap();}
});
canvas.addEventListener('mousedown',()=>flap());
canvas.addEventListener('touchstart',e=>{e.preventDefault();flap();},{passive:false});

function endGame(){
  gameOver=true;
  cancelAnimationFrame(animId);
  let fallInterval=setInterval(()=>{
    bird.vy+=0.6;bird.y+=bird.vy;bird.rot+=0.12;
    ctx.clearRect(0,0,W,H);
    drawPipes();
    drawBird();
    if(bird.y>H+80){
      clearInterval(fallInterval);
      popup.style.display='flex';
      finalScore.textContent=score;
    }
  },24);
}

function loopFn(){
  if(paused||gameOver)return;
  frame++;
  ctx.clearRect(0,0,W,H);
  drawBird();
  bird.vy+=bird.gravity;
  bird.y+=bird.vy;
  bird.rot=Math.max(Math.min(bird.vy/12,0.9),-1.2);

  const settings=getLevelSettings(level);
  if(frame%settings.spawnRate===0) spawnPipe();

  for(let i=pipes.length-1;i>=0;i--){
    let p=pipes[i];
    p.x-=settings.speed;
    if(!p.passed && p.x+40<bird.x){
      p.passed=true;
      score++;
      updateUI();
      if(score%6===0 && level<maxLevel){level++;updateUI();}
    }
    if(p.x<-80) pipes.splice(i,1);
  }

  drawPipes();

  if(checkCollision()){endGame(); return;}
  animId=requestAnimationFrame(loopFn);
}

function startGame(){resetGameVars();spawnPipe();animId=requestAnimationFrame(loopFn);}

document.getElementById('restartBtn').addEventListener('click',()=>{resetGameVars();startGame();});
document.getElementById('tryAgainBtn').addEventListener('click',()=>{resetGameVars();startGame();});
document.getElementById('myGamesBtn').addEventListener('click',()=>location.href='my-games.html');
document.getElementById('popupMyGames').addEventListener('click',()=>location.href='my-games.html');

const pauseBtn=document.getElementById('pauseBtn');
pauseBtn.addEventListener('click',()=>{paused=!paused; pauseBtn.textContent=paused?'Resume':'Pause'; if(!paused) animId=requestAnimationFrame(loopFn);});

startGame();
