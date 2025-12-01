/* ---------- Game configuration ---------- */
const levels = [{target:5, speed:160},{target:8, speed:130},{target:12, speed:100},{target:18, speed:80},{target:25, speed:65}];
let currentLevel=0, score=0, lives=3;

/* ---------- Canvas ---------- */
const canvas=document.getElementById('canvas'), ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
let gridCount=24, box=Math.floor(W/gridCount);
let snake=[], dir='RIGHT', food=null, gameInterval=null, running=false;
const bgContainer=document.getElementById("bg-snakes");

/* ---------- Background emojis ---------- */
const emojis = ["🐍","🍎","🍇","🍒","🍉","🍌","🍓","🥝","🥑","🍍","🍑","🍈"];



// ثوابت الأماكن لكل رمز (مختلفة عن التانية)
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
    // حركة صغيرة لكن ثابتة
    span.style.setProperty("--dx1","3px"); span.style.setProperty("--dy1","-2px");
    span.style.setProperty("--dx2","-3px"); span.style.setProperty("--dy2","2px");
    span.style.setProperty("--dx3","2px"); span.style.setProperty("--dy3","-3px");
    span.style.animationDuration = (6 + i%4) + "s";
    bgContainer.appendChild(span);
  }
}
createFixedBackground();


/* ---------- HUD ---------- */
const scoreEl=document.getElementById('score'), levelEl=document.getElementById('level'), targetEl=document.getElementById('target'), livesEl=document.getElementById('lives');
const pauseBtn=document.getElementById('pauseBtn'), restartBtn=document.getElementById('restartBtn'), myGamesBtn=document.getElementById('myGamesBtn');
const modalArea=document.getElementById('modalArea'), modalTitle=document.getElementById('modalTitle'), modalMsg=document.getElementById('modalMsg'), modalScore=document.getElementById('modalScore'), modalLives=document.getElementById('modalLives'), modalBtns=document.getElementById('modalBtns');

/* ---------- Audio ---------- */
const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
function beep(freq,duration=0.08,type='sine',gain=0.12){try{const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch(e){}}
function soundEat(){beep(880,0.06,'square',0.14);}
function soundLevelUp(){beep(660,0.12,'sine',0.14);setTimeout(()=>beep(1000,0.08,'sine',0.12),90);}
function soundLoseLife(){beep(240,0.18,'sawtooth',0.16);}
function soundGameOver(){beep(180,0.28,'sawtooth',0.18);setTimeout(()=>beep(120,0.18,'sine',0.08),220);}

/* ---------- Helpers ---------- */
function setHUD(){scoreEl.textContent=score;levelEl.textContent=currentLevel+1;targetEl.textContent=levels[currentLevel].target;livesEl.innerHTML='❤'.repeat(lives)||'♡';}
function initLevel(resetScore=false){if(resetScore) score=0;gridCount=24;box=Math.floor(W/gridCount);snake=[{x:Math.floor(gridCount/2),y:Math.floor(gridCount/2)}];dir='RIGHT';placeFood();setHUD();}
function placeFood(){let tries=0;while(true){const fx=Math.floor(Math.random()*gridCount), fy=Math.floor(Math.random()*gridCount);if(!snake.some(s=>s.x===fx&&s.y===fy)){food={x:fx,y:fy};break;} if(++tries>200){food={x:0,y:0};break;}}}
function drawBG(){ctx.fillStyle='#00151c';ctx.fillRect(0,0,W,H);for(let x=0;x<gridCount;x++){for(let y=0;y<gridCount;y++){const fade=((x+y)%6===0)?0.02:0.01;ctx.fillStyle=`rgba(255,255,255,${fade})`;ctx.fillRect(x*box,y*box,box-1,box-1);}}}
function draw(){drawBG();ctx.fillStyle='#ffd000';roundRect(ctx,food.x*box+box*0.12,food.y*box+box*0.12,box*0.76,box*0.76,6);ctx.fill();for(let i=snake.length-1;i>=0;i--){const s=snake[i];const x=s.x*box,y=s.y*box;if(i===0){const g=ctx.createLinearGradient(x,y,x+box,y+box);g.addColorStop(0,'#00ffff');g.addColorStop(1,'#ff00f0');ctx.fillStyle=g;roundRect(ctx,x+2,y+2,box-4,box-4,6);ctx.fill();ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(x+1,y+1,box-2,box-2);}else{ctx.fillStyle=i%2===0?'#ff88ff':'#66f0ff';roundRect(ctx,x+3,y+3,box-6,box-6,5);ctx.fill();}}}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function collision(head){if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount) return true;for(let i=0;i<snake.length;i++){if(head.x===snake[i].x&&head.y===snake[i].y) return true;}return false;}
function tick(){let head={...snake[0]};if(dir==='UP') head.y--;if(dir==='DOWN') head.y++;if(dir==='LEFT') head.x--;if(dir==='RIGHT') head.x++;if(collision(head)){lives--;soundLoseLife();setHUD();if(lives<=0){stopGame();soundGameOver();showModal('Game Over',`Your score: ${score}`,[{txt:'Restart',cb:()=>{closeModal();restartFull();}},{txt:'Back to My Games',cb:()=>{window.location.href='my-games.html';}}]);return;}else{stopGame();showModal('You Lost a Life',`Lives left: ${lives}`,[{txt:'Try Again',cb:()=>{closeModal();startLevel(currentLevel);}},{txt:'Quit',cb:()=>{closeModal();restartFull();}}]);return;}}if(head.x===food.x&&head.y===food.y){snake.unshift(head);score++;soundEat();placeFood();setHUD();if(score>=levels[currentLevel].target){stopGame();soundLevelUp();const isLast=currentLevel>=levels.length-1;showModal(isLast?'You Beat All Levels!':`Level ${currentLevel+1} Completed!`,`Score: ${score} • Lives: ${lives}`,isLast?[{txt:'Restart',cb:()=>{closeModal();restartFull();}},{txt:'Back to My Games',cb:()=>{window.location.href='my-games.html';}}]:[{txt:'Next Level',cb:()=>{closeModal();currentLevel++;startLevel(currentLevel,false);}},{txt:'Replay Level',cb:()=>{closeModal();startLevel(currentLevel,false);}}]);return;}}else{snake.pop();snake.unshift(head);}draw();}

function getIntervalForLevel(lvl){return levels[lvl].speed;}
function startGameLoop(lvl){running=true;const speed=getIntervalForLevel(lvl);if(gameInterval) clearInterval(gameInterval);gameInterval=setInterval(tick,speed);}
function stopGame(){running=false;if(gameInterval){clearInterval(gameInterval);gameInterval=null;}}
function startLevel(lvl=0,resetScore=true){currentLevel=lvl;if(resetScore) score=0;initLevel(resetScore);setHUD();startGameLoop(currentLevel);}
function restartFull(){currentLevel=0;score=0;lives=3;initLevel(true);startGameLoop(0);closeModal();}

function showModal(title,msg,buttons){modalArea.style.display='flex';modalTitle.textContent=title;modalMsg.textContent=msg;modalScore.textContent=score;modalLives.textContent=lives;modalBtns.innerHTML='';buttons.forEach(b=>{const btn=document.createElement('button');btn.className='btn';btn.textContent=b.txt;btn.style.minWidth='120px';btn.addEventListener('click',b.cb);modalBtns.appendChild(btn);});}
function closeModal(){modalArea.style.display='none';}

window.addEventListener('keydown',(e)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();if(e.key==='ArrowUp'&&dir!=='DOWN') dir='UP';if(e.key==='ArrowDown'&&dir!=='UP') dir='DOWN';if(e.key==='ArrowLeft'&&dir!=='RIGHT') dir='LEFT';if(e.key==='ArrowRight'&&dir!=='LEFT') dir='RIGHT';if(e.key===' '){togglePause();}});
pauseBtn.addEventListener('click',()=>{togglePause();});
restartBtn.addEventListener('click',()=>{restartFull();});
myGamesBtn.addEventListener('click',()=>{window.location.href='my-games.html';});
function togglePause(){if(running){stopGame();pauseBtn.textContent='Resume';}else{startGameLoop(currentLevel);pauseBtn.textContent='Pause';}}

initLevel(true);
startLevel(0,true);
window.restartGame=restartFull;
