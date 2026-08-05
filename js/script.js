/* ============================================================
   CYBERD0LL — site behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHitCounter();
  initInstaFeed();
  initMerchList();
  initGlitchFlicker();
  initCursorTrail();
  initBigCartelPlaceholders();
});

/* ---------------- fake hit counter ---------------- */
/* Classic 2004 free-counter vibe. Uses localStorage so it climbs
   a little each visit instead of resetting — swap for a real
   counter service later if you want. */
function initHitCounter() {
  const el = document.getElementById('hit-counter');
  if (!el) return;

  let count = parseInt(localStorage.getItem('cyberd0ll_hits') || '', 10);
  if (isNaN(count)) {
    count = 66600 + Math.floor(Math.random() * 900);
  }
  count += 1;
  localStorage.setItem('cyberd0ll_hits', String(count));

  el.textContent = String(count).padStart(6, '0');
}

/* ---------------- instagram feed ---------------- */
/*
  NOTE: Instagram doesn't allow pulling a live feed with plain
  client-side JS/HTML — it requires an authenticated API call
  (Instagram Basic Display / Graph API) from a server, or a
  third-party embed widget (e.g. SnapWidget, Elfsight, Behold.so)
  that handles the auth for you.

  For now this renders placeholder tiles so the layout is real.
  Replace POSTS below with real post data/thumbnails, or swap
  this whole function out for an embed widget's script snippet.
*/
function initInstaFeed() {
  const feed = document.getElementById('insta-feed');
  if (!feed) return;

  const POSTS = [
    { caption: 'new drop soon 🖤' },
    { caption: 'studio nite' },
    { caption: 'she lives' },
    { caption: 'merch preview' },
    { caption: 'behind the mask' },
    { caption: 'don\u2019t look directly at it' }
  ];

  feed.innerHTML = POSTS.map(post => `
    <div class="insta-post">
      <span>[img]</span>
      <div class="insta-caption">${post.caption}</div>
    </div>
  `).join('');
}

/* ---------------- merch list ---------------- */
/*
  NOTE: once the Big Cartel store is live, replace ITEMS below
  with your real products (or fetch them — Big Cartel exposes a
  JSON feed per store, e.g. https://yourstore.bigcartel.com/products.json
  which you can fetch() and map over instead of hardcoding).
*/
function initMerchList() {
  const list = document.getElementById('merch-list');
  if (!list) return;

  const ITEMS = [
    { name: 'CYBERD0LL logo tee — black', price: '$28' },
    { name: 'CYBERD0LL logo tee — bone', price: '$28' },
    { name: 'glitch baby doll long sleeve', price: '$34' },
    { name: 'static hoodie', price: '$52' },
    { name: 'error 404 tee', price: '$26' },
    { name: 'haunted webring sticker pack', price: '$8' }
  ];

  list.innerHTML = ITEMS.map(item => `
    <li>
      <a href="#" class="bigcartel-item">
        <span>${item.name}</span>
        <span class="merch-price">${item.price}</span>
      </a>
    </li>
  `).join('');

  list.querySelectorAll('.bigcartel-item').forEach(a => {
    a.addEventListener('click', handleStoreNotReady);
  });
}

/* ---------------- big cartel placeholder links ---------------- */
/* The store link is empty until Big Cartel is set up. Swap the
   href on #bigcartel-link and #bigcartel-link-2 to the real store
   URL, then delete this whole function + its listeners. */
function initBigCartelPlaceholders() {
  ['bigcartel-link', 'bigcartel-link-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handleStoreNotReady);
  });
}

function handleStoreNotReady(e) {
  e.preventDefault();
  alert('store coming soon... check back later <3');
}

/* ---------------- glitch / static flicker ---------------- */
function initGlitchFlicker() {
  const flash = document.querySelector('.static-flash');
  if (!flash) return;

  setInterval(() => {
    if (Math.random() < 0.15) {
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 90 + Math.random() * 120);
    }
  }, 2200);
}

/* ---------------- cursor trail ---------------- */
function initCursorTrail() {
  const symbols = ['✞', '☠', '◆', '✧'];
  let last = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 60) return; // throttle
    last = now;

    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = 'fixed';
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.color = Math.random() < 0.5 ? '#d4001f' : '#39ff14';
    el.style.fontSize = '14px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '999';
    el.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translateY(${20 + Math.random() * 20}px)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 850);
  });
}