/* ============================================================
   CYBERD0LL — site behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHitCounter();
  initInstaFeed();
  initMerchList();
  initGlitchFlicker();
  initCursorTrail();
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
function initInstaFeed() {
  const feed = document.getElementById('insta-feed');
  if (!feed) return;

  const POSTS = [
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
  Pulls live products from the Big Cartel storefront JSON feed:
  https://cyberd0ll.bigcartel.com/products.json

  Each product links straight to its Big Cartel product page.
  If the fetch fails (offline, store paused, CORS issue, etc.)
  it falls back to a single link pointing at the full store.
*/
const BIGCARTEL_STORE_URL = 'https://cyberd0ll.bigcartel.com';

async function initMerchList() {
  const list = document.getElementById('merch-list');
  if (!list) return;

  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(BIGCARTEL_STORE_URL + '/products.json')}`);
    if (!res.ok) throw new Error(`bad response: ${res.status}`);

    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.products || []);

    if (!products.length) throw new Error('no products returned');

    list.innerHTML = products.map(renderMerchItem).join('');
  } catch (err) {
    console.error('could not load big cartel products:', err);
    list.innerHTML = `
      <li>
        <a href="${BIGCARTEL_STORE_URL}" target="_blank" rel="noopener">
          <span>view merch on big cartel</span>
          <span class="merch-price">&gt;&gt;</span>
        </a>
      </li>
    `;
  }
}

function renderMerchItem(product) {
  const name = product.name || 'untitled item';
  const price = formatPrice(product.price);
  const url = product.url
    ? `${BIGCARTEL_STORE_URL}${product.url}`
    : BIGCARTEL_STORE_URL;

  const imageUrl = product.images && product.images.length
    ? product.images[0].url
    : '';

  const thumb = imageUrl
    ? `<img class="merch-thumb" src="${imageUrl}" alt="" loading="lazy" onerror="this.remove()">`
    : '';

  return `
    <li>
      <a href="${url}" target="_blank" rel="noopener">
        ${thumb}
        <span class="merch-info">
          <span class="merch-name">${name}</span>
          <span class="merch-price">${price}</span>
        </span>
      </a>
    </li>
  `;
}

function formatPrice(price) {
  const num = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(num)) return '';
  return `$${num.toFixed(2)}`;
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