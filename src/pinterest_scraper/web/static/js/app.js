/* Pinterest Scraper Web UI — vanilla JS, no build step. */
'use strict';

/* ---------------- i18n ---------------- */
const I18N = {
  boardTip: {en: "Paste a Pinterest board URL (pinterest.com/...) to scrape it", fa: "لینک کامل بورد پینترست را وارد کنید"},
  optInsights: {en: "Show insights chart", fa: "نمایش نمودار تحلیلی"},
  clearRuns: {en: "🗑 Clear past runs list", fa: "🗑 پاک کردن لیست اجراها"},
  clearRecents: {en: "Clear", fa: "پاک کردن"},
  noResults: {en: "No results found for this query.", fa: "نتیجه‌ای برای این جستجو پیدا نشد."},
  deleteSelected: {en: "Delete selected", fa: "حذف انتخاب‌شده‌ها"},
  cancelSel: {en: "Cancel", fa: "لغو"},
  selectedCount: {en: "selected", fa: "انتخاب‌شده"},
  deletedMsg: {en: "images deleted", fa: "تصویر حذف شد"},
  selectHint: {en: "Selection mode — tap images to select, then delete or cancel", fa: "حالت انتخاب — روی تصاویر بزنید، سپس حذف یا لغو"},
  nothingNew: {en: "Nothing new — all these pins are already collected (dedup). Try another query, or turn off dedup in ⚙️ settings.", fa: "چیز جدیدی نبود — این پین‌ها قبلاً جمع‌آوری شده‌اند. جستجوی دیگری امتحان کنید یا حذف تکرار را در ⚙️ خاموش کنید."},
  recent: {en: "Recent:", fa: "اخیر:"},
  download: {en: "Download", fa: "دانلود"},
  visualSearch: {en: "More like this", fa: "پین‌های مشابه"},
  pinDetails: {en: "Details", fa: "جزئیات"},
  chartTitle: {en: "Engagement insights", fa: "نمودار تعامل"},
  historyTitle: {en: "Past runs", fa: "اجراهای قبلی"},
  schedulesTitle: {en: "Scheduled scrapes", fa: "جستجوهای زمان‌بندی‌شده"},
  schQuery: {en: "Query (comma-separated for batch)", fa: "جستجو (با کاما برای چندتایی)"},
  schEvery: {en: "Run every (hours)", fa: "هر چند ساعت"},
  schLimit: {en: "Pins per run", fa: "تعداد پین در هر اجرا"},
  schAdd: {en: "Schedule", fa: "زمان‌بندی"},
  noHistory: {en: "No runs yet — scrape something!", fa: "هنوز اجرایی ثبت نشده"},
  noSchedules: {en: "No schedules yet.", fa: "زمان‌بندی‌ای ثبت نشده."},
  batchDone: {en: "All queries done", fa: "همه جستجوها تمام شد"},
  runningQuery: {en: "Query", fa: "جستجو"},
  of: {en: "of", fa: "از"},
  visualSearching: {en: "Finding similar pins…", fa: "در حال یافتن پین‌های مشابه…"},
  visualResults: {en: "Visually similar pins", fa: "پین‌های مشابه"},
  openRun: {en: "Open", fa: "بازکردن"},
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
    emptyText: 'Search for anything — like “Ana de Armas” — and scrape high-quality images with full metadata.',
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
    emptyText: 'هر چیزی را جستجو کنید — مثل «Ana de Armas» — و تصاویر باکیفیت با جزئیات کامل دریافت کنید.',
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
  show_insights: false,
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
  renderRecent();
}

/* ---------------- settings drawer ---------------- */
function syncDrawerFromSettings() {
  $('opt-download').checked = settings.download;
  $('opt-details').checked = settings.details;
  $('opt-dedup').checked = settings.dedup;
  $('opt-insights').checked = settings.show_insights;
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
  settings.show_insights = $('opt-insights').checked;
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
  showSkeletons();
  addRecent(query);
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
  if (ev.event === 'query_start') {
    els_progress(ev);
  } else if (ev.event === 'queries_done') {
    els_queries_done(ev);
  } else if (ev.event === 'phase') {
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
  const hasImages = lastPins.some(p => p.local_file);
  if (!lastPins.length) {
    const t2 = I18N[settings.lang] || I18N.en;
    if (hasImages || (ev.stats && ev.stats.downloaded > 0)) {
      showError(t2.nothingNew);
    } else {
      showError(t2.noResults || 'No results found for this query.');
    }
  }
  renderGrid(lastPins);
  renderChart();
  if (currentJob && hasImages) {
    $('exp-zip').href = `/api/jobs/${currentJob}/export/zip`;
    $('exp-xlsx').href = `/api/jobs/${currentJob}/export/xlsx`;
    $('export-bar').classList.remove('hidden');
  } else {
    $('export-bar').classList.add('hidden');
  }
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
      ? `/api/images/${encodeURIComponent(pin.local_file)}` : '';
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
    card.addEventListener('click', () => openPinModal(pin, src));
    card.querySelector('.pin-save').addEventListener('click', (e) => {
      e.stopPropagation();
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
  chip.title = chip.dataset.mode === 'board'
    ? (I18N[settings.lang].boardTip || 'Paste a Pinterest board URL')
    : '';
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
  sugList.classList.remove('show');
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
  sugList.innerHTML = items.map(s => {
    if (s.type === 'user') {
      return `<li role="option" class="sug-user">
        <img class="sug-avatar" src="${s.image || ''}" alt="" loading="lazy"
             onerror="this.style.visibility='hidden'">
        <span class="sug-texts"><span class="sug-name">${highlight(q, s.text)}
          ${s.verified ? '<span class="sug-verified" title="Verified">✔</span>' : ''}</span>
          ${s.sub ? `<span class="sug-sub">${escapeHtml(s.sub)}</span>` : ''}</span>
      </li>`;
    }
    return `<li role="option"><span class="sug-ico"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 2a8 8 0 105.3 14l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0010 2z"/></svg></span><span>${highlight(q, s.text)}</span></li>`;
  }).join('');
  sugList.classList.toggle('hidden', items.length === 0);
  [...sugList.children].forEach((li, i) =>
    li.addEventListener('mousedown', (e) => {
      e.preventDefault();
      input.value = sugItems[i].text;
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
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (sugIndex >= 0 && sugItems[sugIndex]) input.value = sugItems[sugIndex].text;
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

/* ================= Pin detail modal (premium closeup) ================= */
let pmIndex = -1;
let pmSource = '';

function pmMetaCard(icon, key, val) {
  return `<div class="pm-meta"><span class="pm-k">${icon} ${key}</span><span class="pm-v">${escapeHtml(String(val ?? '—'))}</span></div>`;
}

function showPinAt(index) {
  const pins = window._lastPins || lastPins || [];
  if (!pins.length) return;
  pmIndex = ((index % pins.length) + pins.length) % pins.length;
  const pin = pins[pmIndex];
  const t = I18N[settings.lang] || I18N.en;
  const src = pin.local_file ? `/api/images/${encodeURIComponent(pin.local_file)}` : (pin.image_url || '');
  pmSource = src;
  const img = $('pm-img');
  img.classList.remove('pm-anim');
  img.src = src;
  void img.offsetWidth;
  img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
  $('pm-blur').style.backgroundImage = `url("${src}")`;
  $('pm-title').textContent = pin.title || pin.pin_id;
  $('pm-desc').textContent = pin.description || '';
  $('pm-table').innerHTML = [
    pmMetaCard('📌', t.pins, fmtNum(pin.saves)),
    pmMetaCard('💬', 'Comments', fmtNum(pin.comments)),
    pmMetaCard('👤', 'Creator', pin.creator ? '@' + pin.creator.username : '—'),
    pmMetaCard('📋', 'Board', pin.board ? pin.board.name : '—'),
    pmMetaCard('📐', 'Size', pin.width ? `${pin.width}×${pin.height}` : '—'),
    pmMetaCard('📅', 'Date', (pin.created_at || '').slice(0, 10) || '—'),
  ].join('');
  const colors = $('pm-colors');
  colors.innerHTML = '';
  if (pin.dominant_color) {
    const c = document.createElement('div');
    c.className = 'color-chip';
    c.style.background = pin.dominant_color;
    c.title = pin.dominant_color;
    c.onclick = () => navigator.clipboard?.writeText(pin.dominant_color);
    colors.appendChild(c);
  }
  $('pm-download').href = pin.image_url || '#';
  $('pm-download').download = `pin_${pin.pin_id}.jpg`;
  $('pm-pin-link').href = pin.pin_url || '#';
  $('pm-visual').onclick = () => runVisualSearch(pin.pin_id);
}

function openPinModal(pin, src) {
  const pins = window._lastPins || lastPins || [];
  pmIndex = Math.max(0, pins.findIndex(p => p.pin_id === pin.pin_id));
  showPinAt(pmIndex);
  $('pin-modal').classList.remove('hidden');
}
function closePinModal() {
  const m = $('pin-modal');
  m.classList.add('closing');
  setTimeout(() => { m.classList.add('hidden'); m.classList.remove('closing'); }, 180);
}
function pmNav(dir) { showPinAt(pmIndex + dir); }
$('close-pin-modal').addEventListener('click', closePinModal);
$('pm-prev').addEventListener('click', () => pmNav(-1));
$('pm-next').addEventListener('click', () => pmNav(1));
$('pm-prev-in').addEventListener('click', (e) => { e.stopPropagation(); pmNav(-1); });
$('pm-next-in').addEventListener('click', (e) => { e.stopPropagation(); pmNav(1); });
$('pin-modal').addEventListener('click', (e) => { if (e.target.id === 'pin-modal') closePinModal(); });
document.addEventListener('keydown', (e) => {
  if ($('pin-modal').classList.contains('hidden')) return;
  if (e.key === 'Escape') closePinModal();
  if (e.key === 'ArrowLeft') pmNav(-1);
  if (e.key === 'ArrowRight') pmNav(1);
});

/* ================= Visual search ================= */
async function runVisualSearch(pinId) {
  const t = I18N[settings.lang] || I18N.en;
  closePinModal();
  showSkeletons(10);
  showProgress(t.visualSearching, true);
  try {
    const res = await fetch(`/api/visual-search?pin_id=${pinId}&limit=30`);
    const data = await res.json();
    $('progress-card').classList.add('hidden');
    if (!res.ok) { showError(data.detail || 'visual search failed'); return; }
    lastPins = data.pins || [];
    window._lastPins = lastPins;
    $('stats-card').innerHTML = `<span class="stat-pill">🔮 ${t.visualResults}: <b>${lastPins.length}</b></span>`;
    $('stats-card').classList.remove('hidden');
    $('export-bar').classList.add('hidden');
    $('chart-card').classList.add('hidden');
    renderGrid(lastPins);
  } catch {
    $('progress-card').classList.add('hidden');
    showError('visual search failed');
  }
}

/* ================= History & schedules ================= */
function fmtAgo(ts) {
  if (!ts) return '';
  const m = Math.floor((Date.now() / 1000 - ts) / 60);
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
}
async function loadHistory() {
  const list = $('history-list');
  try {
    const { runs } = await (await fetch('/api/history')).json();
    if (!runs.length) { list.innerHTML = `<p class="pm-desc">${I18N[settings.lang].noHistory}</p>`; }
    else {
      list.innerHTML = '';
      runs.slice(0, 30).forEach(r => {
        const item = document.createElement('div');
        item.className = 'run-item';
        item.innerHTML = `
          <div class="ri-main">
            <span class="ri-q">${escapeHtml(r.query)}</span>
            <span class="ri-sub">${r.mode} · ${r.count} 📌 · ${fmtAgo(r.ts)}</span>
          </div>
          <button class="btn ghost small">${I18N[settings.lang].openRun}</button>`;
        item.querySelector('.btn').onclick = (e) => {
          e.stopPropagation();
          openRun(r.job_id);
        };
        item.onclick = () => openRun(r.job_id);
        list.appendChild(item);
      });
    }
  } catch { list.innerHTML = ''; }
}
async function openRun(jobId) {
  const t = I18N[settings.lang] || I18N.en;
  const res = await fetch(`/api/runs/${jobId}`);
  if (!res.ok) return;
  const data = await res.json();
  lastPins = data.pins || [];
  window._lastPins = lastPins;
  $('stats-card').innerHTML = `<span class="stat-pill">🗂 <b>${lastPins.length}</b> ${t.pins}</span>`;
  $('stats-card').classList.remove('hidden');
  $('exp-zip').href = `/api/runs/${jobId}/export/zip`;
  $('exp-xlsx').href = `/api/runs/${jobId}/export/xlsx`;
  $('export-bar').classList.toggle('hidden', !lastPins.some(p => p.local_file));
  $('chart-card').classList.remove('hidden');
  renderChart();
  renderGrid(lastPins);
  openHistory(false);
}
function openHistory(open) {
  const d = $('history-drawer');
  d.classList.toggle('open', open);
  d.setAttribute('aria-hidden', String(!open));
  $('overlay').classList.toggle('hidden', !open);
  if (open) { loadHistory(); }
}
$('history-btn').addEventListener('click', () => openHistory(true));
$('clear-runs').addEventListener('click', async () => {
  await fetch('/api/history', { method: 'DELETE' });
  loadHistory();
});
$('close-history').addEventListener('click', () => openHistory(false));

async function loadSchedules() {
  const list = $('schedule-list');
  const t = I18N[settings.lang] || I18N.en;
  try {
    const { schedules } = await (await fetch('/api/schedules')).json();
    if (!schedules.length) { list.innerHTML = `<p class="pm-desc">${t.noSchedules}</p>`; return; }
    list.innerHTML = '';
    schedules.forEach(s => {
      const item = document.createElement('div');
      item.className = 'sch-item';
      item.innerHTML = `
        <div><div class="sch-q">${escapeHtml(s.query)}</div>
        <div class="sch-meta">⏱ ${s.interval_hours}h · ${s.limit} 📌 · ×${s.runs}</div></div>
        <button class="icon-btn" title="delete">🗑</button>`;
      item.querySelector('button').onclick = async () => {
        await fetch(`/api/schedules/${s.id}`, { method: 'DELETE' });
        loadSchedules();
      };
      list.appendChild(item);
    });
  } catch { /* ignore */ }
}
$('sch-add').addEventListener('click', async () => {
  const q = $('sch-query').value.trim();
  if (!q) return;
  await fetch('/api/schedules', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, mode: settings.mode,
      interval_hours: Number($('sch-hours').value) || 24,
      limit: Number($('sch-limit').value) || 25 }),
  });
  $('sch-query').value = '';
  loadSchedules();
});

/* ================= Analytics chart ================= */
function renderChart() {
  if (!settings.show_insights) { $('chart-card').classList.add('hidden'); return; }
  const pins = (window._lastPins || lastPins || []).filter(p => p.saves != null);
  if (pins.length < 2) { $('chart-card').classList.add('hidden'); return; }
  const top = [...pins].sort((a, b) => b.saves - a.saves).slice(0, 12);
  $('chart-card').classList.remove('hidden');
  const dark = document.body.dataset.theme === 'dark';
  const ctx = document.getElementById('chart-canvas');
  if (window._chart) window._chart.destroy();
  window._chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top.map(p => (p.title || p.pin_id).slice(0, 22)),
      datasets: [{
        label: 'Saves', data: top.map(p => p.saves),
        backgroundColor: '#E60023', borderRadius: 6,
      }],
    },
    options: {
      indexAxis: 'y', plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: dark ? '#A7A7A7' : '#5f5f5f' }, grid: { color: dark ? '#333' : '#eee' } },
        y: { ticks: { color: dark ? '#A7A7A7' : '#5f5f5f' }, grid: { display: false } },
      },
    },
  });
}

/* ================= init ================= */
initTheme();
renderRecent();

/* ================= helpers & UI state (consolidated) ================= */
function esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }

function els_progress(ev) {
  const t = I18N[settings.lang] || I18N.en;
  const msg = document.getElementById('progress-msg');
  if (msg) msg.textContent = `${t.runningQuery || 'Query'} ${ev.index} ${t.of || 'of'} ${ev.total}: ${ev.query}`;
}
function els_queries_done(ev) {
  const t = I18N[settings.lang] || I18N.en;
  const msg = document.getElementById('progress-msg');
  if (msg) msg.textContent = `${t.batchDone || 'All queries done'} — ${ev.total} 📌`;
}

/* ---------- theme (Spotify-smooth) ---------- */
function applyTheme(t) {
  document.body.dataset.theme = t;
  localStorage.setItem('theme', t);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = t === 'dark' ? '☀️' : '🌙';
  if (window._chart) { window._chart.destroy(); window._chart = null; renderChart(); }
}
function initTheme() {
  const saved = localStorage.getItem('theme');
  const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || sys);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.onclick = () => applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
}

/* ---------- recent searches / starter chips ---------- */
function getRecent() { try { return JSON.parse(localStorage.getItem('recentSearches') || '[]'); } catch { return []; } }
function addRecent(q) {
  if (!q) return;
  const list = getRecent().filter(x => x !== q);
  list.unshift(q);
  localStorage.setItem('recentSearches', JSON.stringify(list.slice(0, 8)));
  renderRecent();
}
function renderRecent() {
  const row = document.getElementById('recent-row');
  if (!row) return;
  const list = getRecent();
  const starters = ['taylor swift', 'ana de armas', 'interior design', 'minimal wallpaper'];
  const items = list.length ? list : (lastPins && lastPins.length ? [] : starters);
  if (!items.length) { row.classList.add('hidden'); return; }
  row.classList.remove('hidden');
  const t = I18N[settings.lang] || I18N.en;
  row.innerHTML = `<span class="row-label">${list.length ? (t.recent || 'Recent:') : 'Try:'}</span>` +
    items.map(q => `<button class="chip recent-chip">${esc(q)}</button>`).join('') +
    (list.length ? `<button id="clear-recents" class="chip clear-chip">✕ ${t.clearRecents || 'Clear'}</button>` : '');
  row.querySelectorAll('.recent-chip').forEach(b => b.onclick = () => {
    document.getElementById('search-input').value = b.textContent;
    startScrape();
  });
  const clr = row.querySelector('#clear-recents');
  if (clr) clr.onclick = () => { localStorage.removeItem('recentSearches'); renderRecent(); };
}

/* ---------- skeletons ---------- */
function showSkeletons(n = 12) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.classList.remove('hidden');
  grid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'skeleton';
    d.style.height = (140 + Math.random() * 180) + 'px';
    grid.appendChild(d);
  }
}

/* ================= image selection & deletion ================= */
let selectionMode = false;
const selectedFiles = new Set();
let pressTimer = null;

function setSelectionMode(on) {
  selectionMode = on;
  document.querySelectorAll('.pin-card').forEach(c => c.classList.toggle('selectable', on));
  if (!on) {
    selectedFiles.clear();
    document.querySelectorAll('.pin-card.selected').forEach(c => c.classList.remove('selected'));
  }
  updateSelBar();
  if (on) {
    const t = I18N[settings.lang] || I18N.en;
    const msg = document.getElementById('progress-msg');
    const card = document.getElementById('progress-card');
    if (msg && card) { msg.textContent = t.selectHint; card.classList.remove('hidden');
      setTimeout(() => card.classList.add('hidden'), 2600); }
  }
}
function updateSelBar() {
  const bar = document.getElementById('selection-bar');
  bar.classList.toggle('hidden', !selectionMode);
  document.getElementById('sel-count').textContent = `${selectedFiles.size} ${I18N[settings.lang].selectedCount || 'selected'}`;
}
function toggleSelect(card) {
  const pin = card._pin;
  if (!pin || !pin.local_file) return;
  if (selectedFiles.has(pin.local_file)) {
    selectedFiles.delete(pin.local_file);
    card.classList.remove('selected');
  } else {
    selectedFiles.add(pin.local_file);
    card.classList.add('selected');
  }
  updateSelBar();
}

/* long-press on a card enters selection mode (delegated) */
document.addEventListener('pointerdown', (e) => {
  const card = e.target.closest('.pin-card');
  if (!card || selectionMode) return;
  pressTimer = setTimeout(() => { pressTimer = null; setSelectionMode(true); toggleSelect(card); }, 450);
});
['pointerup', 'pointerleave', 'pointercancel', 'scroll'].forEach(ev =>
  document.addEventListener(ev, () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } }, true));

/* click behavior while in selection mode */
document.addEventListener('click', (e) => {
  if (!selectionMode) return;
  const card = e.target.closest('.pin-card');
  if (!card) return;
  e.stopPropagation();
  e.preventDefault();
  toggleSelect(card);
}, true);

document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selectionMode) setSelectionMode(false); });

$('sel-cancel').addEventListener('click', () => setSelectionMode(false));
$('sel-delete').addEventListener('click', async () => {
  if (!selectedFiles.size) return;
  const t = I18N[settings.lang] || I18N.en;
  const res = await fetch('/api/images/delete', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ names: [...selectedFiles] }),
  });
  const { deleted } = await res.json();
  document.querySelectorAll('.pin-card.selected').forEach(c => c.remove());
  setSelectionMode(false);
  lastPins = lastPins.filter(p => !p.local_file || !selectedFiles.has(p.local_file));
  window._lastPins = lastPins;
  $('stats-card').innerHTML = `<span class="stat-pill">🗑 ${deleted} ${t.deletedMsg}</span>`;
  $('export-bar').classList.add('hidden');
  if (!document.querySelector('.pin-card')) $('empty').classList.remove('hidden');
});

/* patch renderGrid cards to carry their pin */
const _origRenderGrid = renderGrid;
renderGrid = function (pins) {
  _origRenderGrid(pins);
  const cards = document.querySelectorAll('.pin-card');
  pins.forEach((p, i) => { if (cards[i]) cards[i]._pin = p; });
  if (selectionMode) document.querySelectorAll('.pin-card').forEach(c => c.classList.add('selectable'));
};
