/* Pinterest Scraper Web UI — vanilla JS, no build step. */
'use strict';

/* ---------------- i18n ---------------- */
const I18N = {
  en: {
    searchPlaceholder: 'Search pins or paste a board URL…',
    modeSearch: 'Search', modeBoard: 'Board',
    cancel: 'Cancel', settings: 'Settings', resetDefaults: 'Reset to defaults',
    optDownload: 'Download images', optDetails: 'Fetch full details (saves, comments…)',
    optDedup: 'Skip duplicates', qualityHeader: 'Quality & limits',
    perfHeader: 'Performance & politeness',
    optLimit: 'Max pins', optMinWidth: 'Min image width (px)',
    optMinHeight: 'Min image height (px)', optWorkers: 'Concurrent workers',
    optDelay: 'Delay between pages (s)', optJitter: 'Random jitter (s)',
    optBatch: 'Save every N pins', optProxy: 'Proxies (comma-separated, optional)',
    emptyTitle: 'Find your inspiration',
    emptyText: 'Search for anything — like “taylor swift” — and scrape high-quality images with full metadata.',
    collecting: 'Collecting pins', details: 'Fetching details', downloading: 'Downloading images',
    saving: 'Saving metadata', done: 'Done', cancelled: 'Cancelled', error: 'Error',
    pins: 'pins', savedCount: 'Downloaded', dupes: 'Duplicates skipped',
    failedDl: 'Failed', skippedSmall: 'Too small', skippedVideo: 'Video pins',
    savePin: 'Save', openOrig: 'Original',
    errEmpty: 'Please enter a search term or board URL.',
    errJob: 'Scraping failed:', nothingNew: 'No new pins — everything was already collected before 🎉',
    boardHint: 'Tip: for Board mode paste a board URL like pinterest.com/user/boardname',
  },
  fa: {
    searchPlaceholder: 'جستجوی پین یا آدرس بورد…',
    modeSearch: 'جستجو', modeBoard: 'بورد',
    cancel: 'لغو', settings: 'تنظیمات', resetDefaults: 'بازگشت به پیش‌فرض',
    optDownload: 'دانلود تصاویر', optDetails: 'دریافت جزئیات کامل (ذخیره‌ها، نظرات…)',
    optDedup: 'رد کردن تکراری‌ها', qualityHeader: 'کیفیت و محدودیت‌ها',
    perfHeader: 'کارایی و ملاحظات',
    optLimit: 'حداکثر تعداد پین', optMinWidth: 'حداقل عرض تصویر (پیکسل)',
    optMinHeight: 'حداقل ارتفاع تصویر (پیکسل)', optWorkers: 'تعداد کارگرهای همزمان',
    optDelay: 'تأخیر بین صفحه‌ها (ثانیه)', optJitter: 'لرزش تصادفی (ثانیه)',
    optBatch: 'ذخیره هر N پین', optProxy: 'پروکسی‌ها (با کاما جدا کنید، اختیاری)',
    emptyTitle: 'الهام خود را پیدا کنید',
    emptyText: 'هر چیزی را جستجو کنید — مثل «taylor swift» — و تصاویر باکیفیت با جزئیات کامل دریافت کنید.',
    collecting: 'در حال جمع‌آوری پین‌ها', details: 'دریافت جزئیات', downloading: 'دانلود تصاویر',
    saving: 'ذخیره اطلاعات', done: 'انجام شد', cancelled: 'لغو شد', error: 'خطا',
    pins: 'پین', savedCount: 'دانلودشده', dupes: 'تکراری ردشده',
    failedDl: 'ناموفق', skippedSmall: 'کم‌حجم', skippedVideo: 'ویدیویی',
    savePin: 'ذخیره', openOrig: 'اصلی',
    errEmpty: 'لطفاً عبارت جستجو یا آدرس بورد را وارد کنید.',
    errJob: 'اسکرپ با خطا مواجه شد:', nothingNew: 'پین جدیدی نبود — همه قبلاً جمع‌آوری شده بودند 🎉',
    boardHint: 'نکته: در حالت بورد آدرسی مثل pinterest.com/user/boardname وارد کنید',
  }
};

const DEFAULTS = {
  lang: 'en', mode: 'search',
  download: true, details: true, dedup: true,
  limit: 25, min_width: 0, min_height: 0,
  workers: 4, delay: 1.0, jitter: 0.5, batch_size: 10, proxy: '',
};

const $ = (id) => document.getElementById(id);
let settings = loadSettings();
let currentJob = null;
let lastPins = [];

function loadSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('ps_settings') || '{}') }; }
  catch { return { ...DEFAULTS }; }
}
function saveSettings() { localStorage.setItem('ps_settings', JSON.stringify(settings)); }

/* ---------------- language ---------------- */
function applyLang() {
  const t = I18N[settings.lang] || I18N.en;
  document.documentElement.lang = settings.lang;
  document.documentElement.dir = settings.lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (t[el.dataset.i18n]) el.textContent = t[el.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    if (t[el.dataset.i18nPh]) el.placeholder = t[el.dataset.i18nPh];
  });
  $('lang-label').textContent = settings.lang === 'en' ? 'فا' : 'EN';
  document.title = settings.lang === 'fa' ? 'اسکرپر پینترست' : 'Pinterest Scraper';
}

/* ---------------- settings drawer ---------------- */
function syncDrawerFromSettings() {
  $('opt-download').checked = settings.download;
  $('opt-details').checked = settings.details;
  $('opt-dedup').checked = settings.dedup;
  $('opt-limit').value = settings.limit;
  $('opt-min-width').value = settings.min_width;
  $('opt-min-height').value = settings.min_height;
  $('opt-workers').value = settings.workers;
  $('opt-delay').value = settings.delay;
  $('opt-jitter').value = settings.jitter;
  $('opt-batch').value = settings.batch_size;
  $('opt-proxy').value = settings.proxy;
}
function readDrawerToSettings() {
  settings.download = $('opt-download').checked;
  settings.details = $('opt-details').checked;
  settings.dedup = $('opt-dedup').checked;
  settings.limit = +$('opt-limit').value || DEFAULTS.limit;
  settings.min_width = +$('opt-min-width').value || 0;
  settings.min_height = +$('opt-min-height').value || 0;
  settings.workers = +$('opt-workers').value || DEFAULTS.workers;
  settings.delay = parseFloat($('opt-delay').value) || 0;
  settings.jitter = parseFloat($('opt-jitter').value) || 0;
  settings.batch_size = +$('opt-batch').value || DEFAULTS.batch_size;
  settings.proxy = $('opt-proxy').value.trim();
  saveSettings();
}
function openDrawer(open) {
  $('settings-drawer').classList.toggle('open', open);
  $('settings-drawer').setAttribute('aria-hidden', String(!open));
  $('overlay').classList.toggle('hidden', !open);
}

/* ---------------- job submission ---------------- */
async function startScrape() {
  const query = $('search-input').value.trim();
  const t = I18N[settings.lang] || I18N.en;
  if (!query) { showError(t.errEmpty); return; }
  readDrawerToSettings();
  hideError();
  $('empty').classList.add('hidden');
  $('stats-card').classList.add('hidden');
  $('grid').innerHTML = '';
  showProgress(t.collecting, true);

  const body = { mode: settings.mode, query, ...settings };
  delete body.lang;
  const res = await fetch('/api/scrape', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) { showError(`${t.errJob} ${res.status}`); return; }
  const { job_id } = await res.json();
  currentJob = job_id;
  listenEvents(job_id);
}

function listenEvents(jobId) {
  const es = new EventSource(`/api/jobs/${jobId}/events`);
  es.onmessage = (e) => {
    const ev = JSON.parse(e.data);
    handleEvent(ev, es);
  };
  es.onerror = () => { /* stream ends after done event */ es.close(); };
}

function handleEvent(ev, es) {
  const t = I18N[settings.lang] || I18N.en;
  if (ev.event === 'phase') {
    const labels = { collect: t.collecting, details: t.details, download: t.downloading };
    showProgress(labels[ev.phase] || ev.phase, ev.phase === 'collect');
  } else if (ev.event === 'progress') {
    setProgress(ev.count, ev.total);
  } else if (ev.event === 'dedup') {
    appendMeta(`· ${t.dupes}: ${ev.duplicates}`);
  } else if (ev.event === 'nothing_new') {
    appendMeta(t.nothingNew);
  } else if (ev.event === 'done') {
    es.close();
    finishJob(ev);
  }
}

async function finishJob(ev) {
  const t = I18N[settings.lang] || I18N.en;
  if (ev.status === 'error') {
    showError(`${t.errJob} ${ev.error}`);
    $('progress-card').classList.add('hidden');
    return;
  }
  const res = await fetch(`/api/jobs/${currentJob}/result`);
  const data = await res.json();
  lastPins = data.pins || [];
  renderStats(ev);
  renderGrid(lastPins);
  $('progress-card').classList.add('hidden');
  currentJob = null;
}

/* ---------------- progress UI ---------------- */
function showProgress(title, indeterminate) {
  $('progress-card').classList.remove('hidden');
  $('progress-title').textContent = title;
  const bar = $('progress-bar');
  bar.classList.toggle('indeterminate', !!indeterminate);
  if (indeterminate) bar.style.width = '40%';
  $('progress-meta').textContent = '';
}
function setProgress(count, total) {
  const bar = $('progress-bar');
  bar.classList.remove('indeterminate');
  const t = I18N[settings.lang] || I18N.en;
  if (total) bar.style.width = `${Math.min(100, (count / total) * 100)}%`;
  $('progress-title').textContent = `${$('progress-title').textContent.split('·')[0].trim()}`;
  $('progress-meta').textContent = `${count} / ${total || '?'} ${t.pins}`;
}
function appendMeta(text) {
  $('progress-meta').textContent = `${$('progress-meta').textContent} ${text}`.trim();
}

/* ---------------- results UI ---------------- */
function renderStats(ev) {
  const t = I18N[settings.lang] || I18N.en;
  const s = ev.stats || {};
  const pills = [
    `<span class="stat-pill"><b>${ev.total ?? lastPins.length}</b> ${t.pins}</span>`,
  ];
  if (s.downloaded) pills.push(`<span class="stat-pill">✅ ${t.savedCount}: <b>${s.downloaded}</b></span>`);
  if (s.failed) pills.push(`<span class="stat-pill">❌ ${t.failedDl}: <b>${s.failed}</b></span>`);
  if (s.skipped_small) pills.push(`<span class="stat-pill">📏 ${t.skippedSmall}: <b>${s.skipped_small}</b></span>`);
  if (s.skipped_video) pills.push(`<span class="stat-pill">🎬 ${t.skippedVideo}: <b>${s.skipped_video}</b></span>`);
  $('stats-card').innerHTML = pills.join('');
  $('stats-card').classList.remove('hidden');
}

function fmtNum(n) {
  if (n == null) return '';
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

function renderGrid(pins) {
  const grid = $('grid');
  grid.innerHTML = '';
  $('empty').classList.toggle('hidden', pins.length > 0);
  pins.forEach((pin, i) => {
    const img = pin.image_url || '';
    const local = pin.local_file
      ? `/api/jobs/${currentJob || 'latest'}/images/${encodeURIComponent(pin.local_file)}` : '';
    const src = local || img;
    const card = document.createElement('article');
    card.className = 'pin-card';
    card.style.animationDelay = `${Math.min(i * 0.04, 0.8)}s`;
    card.innerHTML = `
      ${img ? `<img loading="lazy" src="${src}" alt="${escapeHtml(pin.title || pin.pin_id)}"
            onerror="this.onerror=null;this.src='${img}'">` : '<div style="padding:40px;text-align:center">🎬</div>'}
      <div class="pin-overlay">
        <button class="pin-save">${I18N[settings.lang].savePin} ♥</button>
        <div class="pin-meta">
          ${pin.title ? `<div>${escapeHtml(pin.title.slice(0, 60))}</div>` : ''}
          <div>📌 ${fmtNum(pin.saves)} · 💬 ${fmtNum(pin.comments)}</div>
          ${pin.width ? `<div>${pin.width}×${pin.height}</div>` : ''}
          <a href="${pin.pin_url || '#'}" target="_blank" rel="noopener">Pinterest ↗</a>
          <a href="${img}" target="_blank" rel="noopener">${I18N[settings.lang].openOrig} ↗</a>
        </div>
      </div>`;
    card.querySelector('.pin-save').addEventListener('click', () => {
      window.open(img, '_blank');
    });
    grid.appendChild(card);
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function showError(msg) {
  const el = $('error-card');
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideError() { $('error-card').classList.add('hidden'); }

/* ---------------- wire up ---------------- */
$('search-form').addEventListener('submit', (e) => { e.preventDefault(); startScrape(); });
$('settings-btn').addEventListener('click', () => { syncDrawerFromSettings(); openDrawer(true); });
$('close-settings').addEventListener('click', () => openDrawer(false));
$('overlay').addEventListener('click', () => openDrawer(false));
$('reset-settings').addEventListener('click', () => {
  settings = { ...DEFAULTS, lang: settings.lang, mode: settings.mode };
  saveSettings(); syncDrawerFromSettings();
});
$('lang-btn').addEventListener('click', () => {
  settings.lang = settings.lang === 'en' ? 'fa' : 'en';
  saveSettings(); applyLang();
});
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    settings.mode = chip.dataset.mode;
    saveSettings();
    $('search-input').placeholder = settings.mode === 'board'
      ? 'https://pinterest.com/user/boardname' : (I18N[settings.lang].searchPlaceholder);
  });
});
$('cancel-btn').addEventListener('click', async () => {
  if (currentJob) await fetch(`/api/jobs/${currentJob}/cancel`, { method: 'POST' });
});

/* restore mode + lang */
document.querySelectorAll('.chip').forEach(c =>
  c.classList.toggle('active', c.dataset.mode === settings.mode));
applyLang();
syncDrawerFromSettings();

/* ---------------- live search suggestions (debounced) ---------------- */
const sugList = $('suggest-list');
const input = $('search-input');
let debounceTimer = null, sugItems = [], sugIndex = -1, sugAbort = null;

function hideSuggest() {
  sugList.classList.add('hidden');
  sugList.innerHTML = '';
  sugItems = []; sugIndex = -1;
}
function highlight(q, text) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return escapeHtml(text);
  return escapeHtml(text.slice(0, i)) + '<b>' + escapeHtml(text.slice(i, i + q.length)) + '</b>' +
         escapeHtml(text.slice(i + q.length));
}
function renderSuggest(q, items) {
  sugItems = items; sugIndex = -1;
  sugList.innerHTML = items.map(s =>
    `<li role="option"><span class="sug-ico"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 2a8 8 0 105.3 14l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0010 2z"/></svg></span><span>${highlight(q, s)}</span></li>`
  ).join('');
  sugList.classList.toggle('hidden', items.length === 0);
  [...sugList.children].forEach((li, i) =>
    li.addEventListener('mousedown', (e) => {
      e.preventDefault();
      input.value = sugItems[i];
      hideSuggest();
      startScrape();
    }));
}
input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const q = input.value.trim();
  if (q.length < 2) { hideSuggest(); return; }
  debounceTimer = setTimeout(async () => {
    if (sugAbort) sugAbort.abort();
    sugAbort = new AbortController();
    try {
      const r = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`,
                            { signal: sugAbort.signal });
      const { suggestions } = await r.json();
      if (input.value.trim() === q) renderSuggest(q, suggestions || []);
    } catch { /* aborted or offline */ }
  }, 350);
});
input.addEventListener('keydown', (e) => {
  if (sugItems.length === 0) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    sugIndex = (sugIndex + (e.key === 'ArrowDown' ? 1 : -1) + sugItems.length) % sugItems.length;
    [...sugList.children].forEach((li, i) => li.classList.toggle('active', i === sugIndex));
  } else if (e.key === 'Enter' && sugIndex >= 0) {
    e.preventDefault();
    input.value = sugItems[sugIndex];
    hideSuggest();
    startScrape();
  } else if (e.key === 'Escape') {
    hideSuggest();
  }
});
input.addEventListener('blur', () => setTimeout(hideSuggest, 150));
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) hideSuggest();
});
