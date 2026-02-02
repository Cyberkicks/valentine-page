(() => {
  const yes = document.getElementById('yes');
  const no = document.getElementById('no');
  const result = document.getElementById('result');

  // Audio player controls
  const bgAudio = document.getElementById('bgAudio');
  const playBtn = document.getElementById('playBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volLabel = document.getElementById('volLabel');

  if (bgAudio && playBtn && volumeSlider) {
    // Initialize volume
    bgAudio.volume = volumeSlider.value / 100;
    
    // Play/pause button
    playBtn.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play();
        playBtn.textContent = '⏸';
      } else {
        bgAudio.pause();
        playBtn.textContent = '♫';
      }
    });

    // Volume slider
    volumeSlider.addEventListener('input', (e) => {
      const vol = e.target.value;
      bgAudio.volume = vol / 100;
      volLabel.textContent = vol + '%';
    });
  }

  // Preload corner cat GIF so it appears on first click
  const catPreloadEl = document.getElementById('catgif');
  if (catPreloadEl) {
    const _pre = new Image();
    _pre.src = catPreloadEl.src;
  }

  const noTexts = [
    'Are you sure?',
    'Are you sure again?',
    'Okay please',
    'One more time?'
  ];

  let noCount = 0;

  // floating hearts: spawn regularly
  let heartSpawner = null;
  function startHeartSpawner(interval = 800) {
    if (heartSpawner) return;
    heartSpawner = setInterval(() => createHeart(), interval);
  }
  function stopHeartSpawner() {
    if (!heartSpawner) return;
    clearInterval(heartSpawner);
    heartSpawner = null;
  }

  function createHeart({burst=false} = {}){
    const el = document.createElement('div');
    el.className = 'floating-heart';
    const sizes = ['small','med','large'];
    el.classList.add(sizes[Math.floor(Math.random()*sizes.length)]);
    el.textContent = '❤';
    // random horizontal position across viewport (use vw left)
    const x = Math.random() * 92 + 4; // avoid exact edges
    el.style.left = x + 'vw';
    // random horizontal offset for bobbing (used by keyframes via CSS var)
    const dx = (Math.random() * 40 - 20).toFixed(2) + 'vw';
    el.style.setProperty('--dx', dx);
    // random duration
    const dur = (1.8 + Math.random()*2.4) * (burst ? 0.55 : 1);
    el.style.animation = `floatUp ${dur}s cubic-bezier(.2,.8,.2,1) forwards`;
    // random color (pink/red shades)
    const colors = ['#ff3b6f','#ff6b99','#ff2d55','#ff7aa2'];
    el.style.color = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(el);
    // remove after animation
    setTimeout(()=>{ el.remove(); }, (dur*1000)+200);
  }

  // require a click to open the envelope, then start hearts
  document.addEventListener('DOMContentLoaded', () => {
    const env = document.querySelector('.envelope');

    function floatEnvelopeHeart(){
      const envHeart = document.querySelector('.envelope > .heart');
      if (!envHeart) return;
      // set a random horizontal offset for the flight
      const dx = (Math.random() * 60 - 30).toFixed(2) + 'vw';
      envHeart.style.setProperty('--dx', dx);
      envHeart.classList.add('fly');
      // remove from DOM after animation finishes
      setTimeout(()=>{ try{ envHeart.remove(); }catch(e){} }, 1700);
    }

    if (!env) return;

    const onOpen = () => {
      env.classList.add('open');
      // make the envelope heart float away shortly after opening starts
      setTimeout(() => floatEnvelopeHeart(), 350);
      // start gentle spawner after the envelope opens (slightly after open completes)
      setTimeout(() => startHeartSpawner(900), 1400);
      // prevent future opens
      env.removeEventListener('click', onOpen);
    };

    // open only on user click/tap
    env.addEventListener('click', onOpen);
    // also allow keyboard activation for accessibility
    env.setAttribute('tabindex', '0');
    env.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') onOpen(); });
  });

  function createConfetti() {
    const colors = ['#ff3b6f', '#ff6b99', '#ff2d55', '#ff7aa2', '#ffbfd6', '#ffeef6'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      confetti.style.opacity = Math.random() * 0.7 + 0.5;
      document.body.appendChild(confetti);
      
      // Animate
      const duration = Math.random() * 1.5 + 1.5;
      const xDrift = (Math.random() - 0.5) * 200;
      const yDrift = Math.random() * 300 + 200;
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${xDrift}px, ${yDrift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], { duration: duration * 1000, easing: 'ease-out' });
      
      // Remove after animation
      setTimeout(() => confetti.remove(), duration * 1000 + 100);
    }
  }

  function growYes() {
    const scale = 1 + Math.min(5, noCount) * 0.18; // limit growth
    yes.style.transform = `scale(${scale})`;
    // also increase padding for clearer size change
    const pad = 12 + Math.min(40, noCount * 6);
    yes.style.padding = `${pad}px ${Math.max(24, pad * 2)}px`;
  }

  no.addEventListener('click', (e) => {
    e.preventDefault();
    // change text
    const text = noTexts[Math.min(noCount, noTexts.length - 1)];
    no.textContent = text;
    noCount += 1;
    growYes();
    // playful shuffle: briefly wiggle the no button
    no.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 320 });
  });

  yes.addEventListener('click', (e) => {
    e.preventDefault();
    // show a celebration message
    result.classList.remove('hidden');
    result.textContent = 'Yay! 💖  Sucks to suck loser... Happy Valentine\'s Day!';
    result.classList.add('celebrate');
    // subtle heart pop
    const h = document.querySelector('.heart');
    h.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 700, easing: 'ease-out' });
    // enlarge yes a little more
    yes.style.transform = 'scale(1.25)';
    // disable buttons to avoid extra clicks while waiting
    yes.disabled = true;
    no.disabled = true;
    // create a short burst of hearts for extra celebration
    const burstInterval = setInterval(()=> createHeart({burst:true}), 120);
    setTimeout(()=> clearInterval(burstInterval), 2600);
    // create confetti explosion
    createConfetti();
    // reveal cat GIF in the corner - FORCE it to show no matter what
    const catEl = document.getElementById('catgif');
    if (catEl) {
      catEl.classList.remove('hidden');
      catEl.classList.add('show');
      catEl.style.display = 'block';
      catEl.style.visibility = 'visible';
      catEl.style.opacity = '1';
      catEl.style.pointerEvents = 'auto';
    }
    // reload the page after 10 seconds to reset
    setTimeout(() => {
      location.reload();
    }, 10000);
  });

})();
