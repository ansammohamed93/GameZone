/* ---------- background emojis ---------- */
const bgContainerEl = document.getElementById('bg-container');
const bgEmojis = ['🔨', '🐻','🪵','🍂'];
const positions = [
  {x:"5vw",y:"10vh"},{x:"15vw",y:"20vh"},{x:"25vw",y:"5vh"},
  {x:"35vw",y:"12vh"},{x:"45vw",y:"18vh"},{x:"55vw",y:"8vh"},
  {x:"65vw",y:"25vh"},{x:"75vw",y:"15vh"},{x:"85vw",y:"30vh"},
  {x:"10vw",y:"40vh"},{x:"20vw",y:"50vh"},{x:"30vw",y:"35vh"},
  {x:"40vw",y:"45vh"},{x:"50vw",y:"55vh"},{x:"60vw",y:"48vh"},
  {x:"70vw",y:"60vh"},{x:"80vw",y:"65vh"},{x:"90vw",y:"55vh"},
  {x:"15vw",y:"70vh"},{x:"25vw",y:"75vh"},{x:"35vw",y:"68vh"},
  {x:"45vw",y:"80vh"},{x:"55vw",y:"72vh"},{x:"65vw",y:"85vh"},
  {x:"75vw",y:"78vh"},{x:"85vw",y:"90vh"},{x:"5vw",y:"88vh"},
  {x:"15vw",y:"95vh"},{x:"25vw",y:"92vh"},{x:"35vw",y:"98vh"}
];

positions.forEach((p,i)=>{
  const span = document.createElement('span');
  span.className = 'bg-item';
  span.textContent = bgEmojis[i % bgEmojis.length];
  span.style.left = p.x;
  span.style.top = p.y;
  span.style.fontSize = (18 + (i % 4) * 4) + "px";
  span.style.setProperty('--dx1','3px'); span.style.setProperty('--dy1','-2px');
  span.style.setProperty('--dx2','-3px'); span.style.setProperty('--dy2','2px');
  span.style.setProperty('--dx3','2px'); span.style.setProperty('--dy3','-3px');
  span.style.animationDuration = (6 + (i % 4)) + "s";
  bgContainerEl.appendChild(span);
});

/* ---------- Whack-a-Mole ---------- */
const gameBoard=document.getElementById('gameBoard');
const holes=Array.from(document.querySelectorAll('.hole'));
const moles=Array.from(document.querySelectorAll('.mole'));
const timeBoard=document.getElementById('timeBoard');
const scoreBoard=document.getElementById('scoreBoard');
const levelBoard=document.getElementById('levelBoard');
const livesBoard=document.getElementById('livesBoard');
const resultBox=document.getElementById('resultBox');
const resultText=document.getElementById('resultText');
const resultButtons=document.getElementById('resultButtons');
const finalTime=document.getElementById('finalTime');
const finalScore=document.getElementById('finalScore');
const hitSound=document.getElementById('hitSound');
const missSound=document.getElementById('missSound');
const winSound=document.getElementById('winSound');
const loseSound=document.getElementById('loseSound');
const pauseBtn=document.getElementById('pauseBtn');
const restartBtn=document.getElementById('restartBtn');
const backBtn=document.getElementById('backBtn');

let score=0,time=60,totalLives=3,level=1,timeUp=false,isPaused=false,timerInterval,peepTimeouts=[];
const levels=[
  {holes:3,minTime:800,maxTime:1500,time:60},
  {holes:6,minTime:600,maxTime:1200,time:55},
  {holes:9,minTime:400,maxTime:1000,time:50},
  {holes:12,minTime:300,maxTime:900,time:45},
  {holes:15,minTime:250,maxTime:800,time:40}
];

function randomTime(min,max){return Math.round(Math.random()*(max-min)+min);}
let lastHole;
function randomHole(activeHoles){const idx=Math.floor(Math.random()*activeHoles.length); const hole=activeHoles[idx]; if(hole===lastHole)return randomHole(activeHoles); lastHole=hole; return hole;}
function peep(activeHoles,minTime,maxTime){if(timeUp||isPaused)return; const hole=randomHole(activeHoles); const mole=hole.querySelector('.mole'); mole.classList.add('up'); const timeUpMole=randomTime(minTime,maxTime); const timeout=setTimeout(()=>{if(!hole.classList.contains('caught')) mole.classList.remove('up'); peep(activeHoles,minTime,maxTime);},timeUpMole); peepTimeouts.push(timeout);}

function startLevel(){
  holes.forEach(h=>h.classList.remove('caught'));
  moles.forEach(m=>m.classList.remove('up'));
  const lvl=levels[level-1];
  const activeHoles=holes.slice(0,lvl.holes);
  score=0; time=lvl.time; timeUp=false;
  scoreBoard.textContent=`Score: ${score}`;
  levelBoard.textContent=`Level: ${level}`;
  timeBoard.textContent=`Time: ${time}`;
  livesBoard.textContent=`Lives: ${'❤️'.repeat(totalLives)}`;
  resultBox.style.display="none";
  clearInterval(timerInterval); peepTimeouts.forEach(t=>clearTimeout(t)); peepTimeouts=[];
  peep(activeHoles,lvl.minTime,lvl.maxTime);
  timerInterval=setInterval(()=>{if(!isPaused){time--; timeBoard.textContent=`Time: ${time}`; if(time<=0){clearInterval(timerInterval); timeUp=true; handleLevelEnd(activeHoles.length,false);}}},1000);
}

moles.forEach(m=>{
  m.addEventListener('click',e=>{
    e.stopPropagation();
    const parent=m.parentElement;
    if(!parent.classList.contains('caught')){
      parent.classList.add('caught'); m.classList.add('up'); score++; scoreBoard.textContent=`Score: ${score}`;
      hitSound.play();
      if(score>=levels[level-1].holes) handleLevelEnd(levels[level-1].holes,true);
    }
  });
});

document.addEventListener('click',e=>{if(!e.target.classList.contains('mole')) missSound.play();});

function handleLevelEnd(reqScore,passed=false){
  timeUp=true; peepTimeouts.forEach(t=>clearTimeout(t)); peepTimeouts=[]; clearInterval(timerInterval);
  if(!passed && score<reqScore) totalLives--;
  if(score>=reqScore) passed=true;
  resultBox.style.display='flex';
  finalTime.textContent=`Time Left: ${time}`;
  finalScore.textContent=`Score: ${score}/${reqScore}`;
  resultButtons.innerHTML='';
  if(totalLives<=0){
    resultText.textContent="Game Over! All attempts used"; loseSound.play();
    const tryAgainBtn=document.createElement('button'); tryAgainBtn.textContent="Try Again"; tryAgainBtn.classList.add('btn'); tryAgainBtn.onclick=()=>{level=1; totalLives=3; startLevel();}
    const backB=document.createElement('button'); backB.textContent="Back to My Games"; backB.classList.add('btn'); backB.onclick=()=>window.location.href="my-games.html";
    resultButtons.appendChild(tryAgainBtn); resultButtons.appendChild(backB);
  } else if(!passed && score<reqScore){
    resultText.textContent="Hard Luck"; loseSound.play();
    const tryAgainBtn=document.createElement('button'); tryAgainBtn.textContent="Try Again"; tryAgainBtn.classList.add('btn'); tryAgainBtn.onclick=()=>startLevel();
    resultButtons.appendChild(tryAgainBtn);
  } else if(passed){
    resultText.textContent=`Level ${level} Completed🎉`; winSound.play();
    if(level<levels.length){const nextBtn=document.createElement('button'); nextBtn.textContent="Next Level"; nextBtn.classList.add('btn'); nextBtn.onclick=()=>{level++; startLevel();}; resultButtons.appendChild(nextBtn);}
    else{const finishBtn=document.createElement('button'); finishBtn.textContent="Finish Game"; finishBtn.classList.add('btn'); finishBtn.onclick=()=>window.location.href="my-games.html"; resultButtons.appendChild(finishBtn);}
  }
  livesBoard.textContent=`Lives: ${'❤️'.repeat(totalLives)}`;
}

pauseBtn.addEventListener('click',()=>{isPaused=!isPaused; pauseBtn.textContent=isPaused?'Resume':'Pause';});
restartBtn.addEventListener('click',()=>{level=1; totalLives=3; startLevel();});
backBtn.addEventListener('click',()=>{window.location.href="my-games.html";});

startLevel();
