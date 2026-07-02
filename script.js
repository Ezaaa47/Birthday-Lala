/* ================= Floating hearts & balloons ================= */
const floaterEmojis = ['♥','🎈','✨','🎀','★','🎉','🌟'];
const floatersEl = document.getElementById('floaters');

function spawnFloater(){
  if(!floatersEl) return;
  const el = document.createElement('div');
  el.className = 'floater';
  el.textContent = floaterEmojis[Math.floor(Math.random() * floaterEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  const duration = 8 + Math.random() * 6;
  el.style.animationDuration = duration + 's';
  el.style.fontSize = 16 + Math.random() * 20 + 'px';
  floatersEl.appendChild(el);
  setTimeout(()=> el.remove(), duration * 1000);
}

setInterval(spawnFloater, 750);
for(let i = 0; i < 6; i++) setTimeout(spawnFloater, i * 300);

/* ================= Gallery photos ================= */
function fillGallery(gridId, photos, captions){
  const grid = document.getElementById(gridId);
  if(!grid) return;

  for(let i = 0; i < photos.length; i++){
    const wrap = document.createElement('div');
    wrap.className = 'polaroid';
    wrap.innerHTML = `
      <div class="frame" data-idx="${i}" style="background-image: url('${photos[i]}')"></div>
      <div class="cap">${captions[i] || 'kenangan'}</div>
    `;
    grid.appendChild(wrap);
  }
}

fillGallery('galleryGrid',
  ['foto1.jpg','foto2.jpg','foto3.jpg','foto4.jpg'],
  ['pap pertama kamu','pulang bareng pertama kita','bunga valentine','fotbar pertama di sekolah']
);

fillGallery('galleryGrid2',
  ['foto5.jpg','foto6.jpg','foto7.jpg','foto8.jpg'],
  ['les bareng','foto studio pake osis','foto mau purna paskib','foto sama pemain bola']
);

fillGallery('galleryGrid3',
  ['foto9.jpg','foto10.jpg','foto11.jpg','foto12.jpg'],
  ['detik detik lulus','kelulusan','photobox setelah kelulusan','ternyata di ump bareng']
);

/* ================= Book flip logic ================= */
const pages = Array.from(document.querySelectorAll('.page'));
const dotsWrap = document.getElementById('dots');
let current = 0;

if(dotsWrap){
  pages.forEach((_, i)=>{
    const d = document.createElement('span');
    d.addEventListener('click', ()=>{
      current = i;
      render();
    });
    dotsWrap.appendChild(d);
  });
}

const dotEls = dotsWrap ? Array.from(dotsWrap.children) : [];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function render(){
  pages.forEach((page, i)=>{
    if(i < current){
      page.style.transform = 'rotateY(-180deg)';
      page.style.zIndex = i;
    } else {
      page.style.transform = 'rotateY(0deg)';
      page.style.zIndex = pages.length - i;
    }
  });

  dotEls.forEach((d, i)=> d.classList.toggle('active', i === current));
  if(prevBtn) prevBtn.disabled = current === 0;
  if(nextBtn) nextBtn.disabled = current === pages.length - 1;
}

function next(){
  if(current < pages.length - 1){
    current++;
    render();
  }
}

function prev(){
  if(current > 0){
    current--;
    render();
  }
}

nextBtn?.addEventListener('click', next);
prevBtn?.addEventListener('click', prev);

document.getElementById('againBtn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  current = 0;
  render();
});

window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowRight') next();
  if(e.key === 'ArrowLeft') prev();
});

render();

/* ================= Music widget ================= */
const audio = document.getElementById('bgAudio');
const musicWidget = document.getElementById('musicWidget');
const audioUpload = document.getElementById('audioUpload');

document.getElementById('openBtn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  next();
  if(audio?.getAttribute('src')){
    audio.play().catch(()=>{});
  } else {
    audioUpload?.click();
  }
});

audioUpload?.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file || !audio) return;
  audio.src = URL.createObjectURL(file);
  audio.play().catch(()=>{});
});

audio?.addEventListener('play', ()=> musicWidget?.classList.add('playing'));
audio?.addEventListener('pause', ()=> musicWidget?.classList.remove('playing'));

/* ================= Musik memudar saat video diputar ================= */
const memoryVideo = document.querySelector('.memory-video');
let musicFadeTimer = null;

function fadeMusicVolume(targetVolume, duration = 900){
  if(!audio) return;
  clearInterval(musicFadeTimer);

  const startVolume = audio.volume;
  const steps = 24;
  const stepTime = duration / steps;
  let step = 0;

  musicFadeTimer = setInterval(()=>{
    step++;
    const progress = step / steps;
    audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if(step >= steps){
      audio.volume = targetVolume;
      clearInterval(musicFadeTimer);
    }
  }, stepTime);
}

if(memoryVideo){
  memoryVideo.addEventListener('play', ()=>{
    if(audio?.getAttribute('src') && audio.paused){
      audio.play().catch(()=>{});
    }
    fadeMusicVolume(0.12, 900);
  });

  ['pause','ended'].forEach(eventName=>{
    memoryVideo.addEventListener(eventName, ()=>{
      if(audio?.getAttribute('src') && audio.paused){
        audio.play().catch(()=>{});
      }
      fadeMusicVolume(1, 900);
    });
  });
}

/* ================= Surprise button confetti ================= */
const surpriseBtn = document.getElementById('surpriseBtn');
const revealText = document.getElementById('revealText');
const confettiColors = ['#FF7CA3','#FFD9E8','#E7D9F5','#FFD3B0','#F4568F'];

function burstConfetti(){
  for(let i = 0; i < 50; i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.animationDuration = 2.5 + Math.random() * 2 + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(piece);
    setTimeout(()=> piece.remove(), 5000);
  }
}

surpriseBtn?.addEventListener('click', (e)=>{
  e.stopPropagation();
  burstConfetti();
  revealText?.classList.add('show');
  surpriseBtn.textContent = 'Yeay!';
  setTimeout(()=> surpriseBtn.textContent = 'Buka Lagi', 1600);
});

/* ================= Candle interactions ================= */
function setupCake(cakeId){
  const cakeWrap = document.getElementById(cakeId);
  if(!cakeWrap) return;

  const flameHits = Array.from(cakeWrap.querySelectorAll('.flame-hit'));
  flameHits.forEach(hit=>{
    hit.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(hit.classList.contains('out')) return;
      hit.classList.add('out');

      const allOut = flameHits.every(h=> h.classList.contains('out'));
      if(allOut){
        cakeWrap.classList.add('blown');
        burstConfetti();
      }
    });
  });
}

setupCake('cakeWrap');
setupCake('cakeWrap2');

/* ================= Mini game tangkap hati ================= */
const heartGame = document.getElementById('heartGame');
const heartScoreEl = document.getElementById('heartScore');
const resetHeartGame = document.getElementById('resetHeartGame');
let heartScore = 0;

function buildHeartGame(){
  if(!heartGame || !heartScoreEl) return;
  heartGame.innerHTML = '';
  heartScore = 0;
  heartScoreEl.textContent = heartScore;

  for(let i = 0; i < 8; i++){
    const heart = document.createElement('button');
    heart.type = 'button';
    heart.className = 'catch-heart';
    heart.innerHTML = '&hearts;';
    heart.style.left = 8 + Math.random() * 76 + '%';
    heart.style.top = 8 + Math.random() * 74 + '%';
    heart.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(heart.classList.contains('caught')) return;
      heart.classList.add('caught');
      heartScore++;
      heartScoreEl.textContent = heartScore;
      if(heartScore === 8) burstConfetti();
    });
    heartGame.appendChild(heart);
  }
}

buildHeartGame();
resetHeartGame?.addEventListener('click', (e)=>{
  e.stopPropagation();
  buildHeartGame();
});

/* ================= Game pilih hadiah ================= */
const giftResult = document.getElementById('giftResult');
document.querySelectorAll('.gift-card').forEach(card=>{
  card.addEventListener('click', (e)=>{
    e.stopPropagation();
    document.querySelectorAll('.gift-card').forEach(item=> item.classList.remove('opened'));
    card.classList.add('opened');
    if(giftResult) giftResult.textContent = card.dataset.message;
    burstConfetti();
  });
});

/* stop contenteditable clicks from bubbling to page flip accidentally */
document.querySelectorAll('[contenteditable]').forEach(el=>{
  el.addEventListener('click', e=> e.stopPropagation());
});
