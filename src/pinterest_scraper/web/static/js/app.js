/* Pinterest Scraper Web UI — vanilla JS, no build step. */
'use strict';

/* ---------------- i18n ---------------- */
const I18N = {
  phCollect: { en: "Collect", fa: "جمع‌آوری" },
  phDetails: { en: "Details", fa: "جزئیات" },
  phDownload: { en: "Download", fa: "دانلود" },
  optInsights: { en: "Show insights chart", fa: "نمایش نمودار تعامل" },
  clearRuns: { en: "Clear past runs list", fa: "پاک کردن لیست اجراها" },
  clearRecents: { en: "Clear", fa: "پاک کردن" },
  noResults: { en: "No results found for this query.", fa: "نتیجه‌ای برای این جستجو یافت نشد." },
  deleteSelected: { en: "Delete selected", fa: "حذف انتخاب‌شده‌ها" },
  cancelSel: { en: "Cancel", fa: "لغو" },
  selectedCount: { en: "selected", fa: "انتخاب‌شده" },
  deletedMsg: { en: "images deleted", fa: "تصویر حذف شد" },
  selectHint: { en: "Selection mode — tap images to select, then delete or cancel", fa: "حالت انتخاب — برای انتخاب روی تصاویر بزنید" },
  nothingNew: { en: "Pins are already up to date.", fa: "پین‌ها از قبل ذخیره و به‌روز هستند." },
  recent: { en: "Recent:", fa: "جستجوهای اخیر:" },
  tryLabel: { en: "Try:", fa: "پیشنهادها:" },
  download: { en: "Download", fa: "دانلود" },
  visualSearch: { en: "More like this", fa: "تصاویر مشابه" },
  pinDetails: { en: "Details", fa: "جزئیات" },
  chartTitle: { en: "Engagement insights", fa: "نمودار آمار و تعامل" },
  historyTitle: { en: "Past runs", fa: "اجراهای قبلی" },
  schedulesTitle: { en: "Scheduled scrapes", fa: "جستجوهای زمان‌بندی‌شده" },
  schQuery: { en: "Query (comma-separated for batch)", fa: "عبارت جستجو (با کاما برای چندتایی)" },
  schEvery: { en: "Run every (hours)", fa: "تکرار هر (ساعت)" },
  schLimit: { en: "Pins per run", fa: "تعداد پین در هر اجرا" },
  schAdd: { en: "Schedule", fa: "زمان‌بندی" },
  noHistory: { en: "No runs yet — scrape something!", fa: "هنوز اجرایی ثبت نشده است" },
  noSchedules: { en: "No schedules yet.", fa: "هنوز زمان‌بندی‌ای ثبت نشده است." },
  batchDone: { en: "All queries done", fa: "همه جستجوها تمام شد" },
  runningQuery: { en: "Query", fa: "جستجو" },
  of: { en: "of", fa: "از" },
  visualSearching: { en: "Finding similar pins…", fa: "در حال جستجوی تصاویر مشابه…" },
  visualResults: { en: "Visually similar pins", fa: "تصاویر مشابه" },
  openRun: { en: "Open", fa: "مشاهده" },
  modeSearch: { en: "Search", fa: "جستجو" },
  modeGallery: { en: "Gallery", fa: "گالری" },
  galleryEmptyTitle: { en: "No downloaded images yet", fa: "هنوز تصویری دانلود نشده است" },
  galleryEmptyText: { en: "Search and scrape pins with 'Download images' enabled to build your gallery.", fa: "با فعال بودن گزینه «دانلود تصاویر» جستجو کنید تا گالری اختصاصی شما تشکیل شود." },
  statSummary: { en: "Results Summary", fa: "خلاصه نتایج" },
  statTotal: { en: "Total Pins", fa: "کل پین‌ها" },
  statDownloaded: { en: "Downloaded", fa: "دانلودشده" },
  statOnDisk: { en: "Saved on disk", fa: "ذخیره روی دیسک" },
  statFailed: { en: "Failed", fa: "ناموفق" },
  savesLabel: { en: "saves", fa: "ذخیره" },
  commentsLabel: { en: "comments", fa: "نظر" },
  palette: { en: "Palette:", fa: "پالت رنگ:" },
  copiedLink: { en: "Link copied!", fa: "لینک کپی شد!" },
  boardLabel: { en: "Board", fa: "برد" },
  creatorLabel: { en: "Creator", fa: "سازنده" },
  profileLabel: { en: "Profile", fa: "پروفایل" },
  expZip: { en: "ZIP images", fa: "دانلود تصاویر (ZIP)" },
  expXlsx: { en: "XLSX", fa: "خروجی اکسل (XLSX)" },
  layoutWide: { en: "Full width", fa: "عرض کامل" },
  layoutCompact: { en: "Standard width", fa: "عرض استاندارد" },
  en: {
    searchPlaceholder: 'Search pins…',
    modeSearch: 'Search',
    modeGallery: 'Gallery',
    cancel: 'Cancel',
    settings: 'Settings',
    resetDefaults: 'Reset to defaults',
    optDownload: 'Download images',
    optDetails: 'Fetch full details (saves, comments…)',
    optInsights: 'Show insights chart',
    optDedup: 'Skip duplicates',
    qualityHeader: 'Quality & limits',
    perfHeader: 'Performance & politeness',
    optLimit: 'Max pins',
    optMinWidth: 'Min image width (px)',
    optMinHeight: 'Min image height (px)',
    optWorkers: 'Concurrent workers',
    optDelay: 'Delay between pages (s)',
    optJitter: 'Random jitter (s)',
    optBatch: 'Save every N pins',
    emptyTitle: 'Find your inspiration',
    emptyText: 'Search for anything — like “Ana de Armas” — and scrape high-quality images with full metadata.',
    galleryEmptyTitle: 'No downloaded images yet',
    galleryEmptyText: 'Search and scrape pins with ‘Download images’ enabled to build your gallery.',
    collecting: 'Collecting pins',
    details: 'Fetching details',
    downloading: 'Downloading images',
    saving: 'Saving metadata',
    done: 'Done',
    cancelled: 'Cancelled',
    error: 'Error',
    pins: 'pins',
    savedCount: 'Downloaded',
    dupes: 'Duplicates skipped',
    failedDl: 'Failed',
    skippedSmall: 'Too small',
    skippedVideo: 'Video pins',
    savePin: 'Save',
    openOrig: 'Original',
    errEmpty: 'Please enter a search term.',
    errJob: 'Scraping failed:',
    nothingNew: 'Pins are already up to date',
    deletedMsg: 'images deleted',
    deleteSelected: 'Delete selected',
    cancelSel: 'Cancel',
    selectedCount: 'selected',
    download: 'Download',
    visualSearch: 'More like this',
    pinDetails: 'Details',
    statSummary: 'Results Summary',
    statTotal: 'Total Pins',
    statDownloaded: 'Downloaded',
    statOnDisk: 'Saved on disk',
    statFailed: 'Failed',
    savesLabel: 'saves',
    commentsLabel: 'comments',
    expZip: 'ZIP images',
    expXlsx: 'XLSX',
    boardLabel: 'Board',
    creatorLabel: 'Creator',
    profileLabel: 'Profile',
    layoutWide: 'Full width',
    layoutCompact: 'Standard width',
    palette: 'Palette:',
    copiedLink: 'Link copied!',
    recent: 'Recent:',
    tryLabel: 'Try:',
    clearRecents: 'Clear',
  },
  fa: {
    searchPlaceholder: 'جستجوی پین…',
    modeSearch: 'جستجو',
    modeGallery: 'گالری',
    cancel: 'لغو',
    settings: 'تنظیمات',
    resetDefaults: 'بازگشت به پیش‌فرض',
    optDownload: 'دانلود تصاویر',
    optDetails: 'دریافت مشخصات کامل (ذخیره‌ها، نظرات…)',
    optInsights: 'نمایش نمودار تعامل',
    optDedup: 'رد کردن تکراری‌ها',
    qualityHeader: 'کیفیت و فیلترها',
    perfHeader: 'سرعت و ملاحظات شبکه',
    optLimit: 'حداکثر پین',
    optMinWidth: 'حداقل عرض تصویر (پیکسل)',
    optMinHeight: 'حداقل ارتفاع تصویر (پیکسل)',
    optWorkers: 'تعداد کارگرهای همزمان',
    optDelay: 'تأخیر میان درخواست‌ها (ثانیه)',
    optJitter: 'تغییر تصادفی تأخیر (ثانیه)',
    optBatch: 'ذخیره هر N پین',
    emptyTitle: 'ایده‌های نو را کشف کنید',
    emptyText: 'هر موضوعی مثل «Ana de Armas» را جستجو کنید تا تصاویر باکیفیت و اطلاعات کامل آنها دریافت شود.',
    galleryEmptyTitle: 'هنوز تصویری دانلود نشده است',
    galleryEmptyText: 'با فعال بودن گزینه «دانلود تصاویر» جستجو کنید تا گالری اختصاصی شما تشکیل شود.',
    collecting: 'در حال جمع‌آوری پین‌ها',
    details: 'دریافت مشخصات',
    downloading: 'دانلود تصاویر',
    saving: 'ذخیره‌سازی',
    done: 'تکمیل شد',
    cancelled: 'لغو شد',
    error: 'خطا',
    pins: 'پین',
    savedCount: 'دانلودشده',
    dupes: 'تکراری ردشده',
    failedDl: 'ناموفق',
    skippedSmall: 'ابعاد کوچک',
    skippedVideo: 'ویدیویی',
    savePin: 'ذخیره',
    openOrig: 'نسخه اصلی',
    errEmpty: 'لطفاً عبارت جستجو را وارد کنید.',
    errJob: 'اسکرپ با خطا مواجه شد:',
    nothingNew: 'پین‌ها از قبل ذخیره و به‌روز هستند',
    deletedMsg: 'تصویر حذف شد',
    deleteSelected: 'حذف انتخاب‌شده‌ها',
    cancelSel: 'لغو',
    selectedCount: 'انتخاب‌شده',
    download: 'دانلود',
    visualSearch: 'تصاویر مشابه',
    pinDetails: 'جزئیات',
    statSummary: 'خلاصه نتایج',
    statTotal: 'کل پین‌ها',
    statDownloaded: 'دانلودشده',
    statOnDisk: 'ذخیره روی دیسک',
    statFailed: 'ناموفق',
    savesLabel: 'ذخیره',
    commentsLabel: 'نظر',
    expZip: 'دانلود تصاویر (ZIP)',
    expXlsx: 'خروجی اکسل (XLSX)',
    boardLabel: 'برد',
    creatorLabel: 'سازنده',
    profileLabel: 'پروفایل',
    layoutWide: 'عرض کامل',
    layoutCompact: 'عرض استاندارد',
    palette: 'پالت رنگ:',
    copiedLink: 'لینک کپی شد!',
    recent: 'جستجوهای اخیر:',
    tryLabel: 'پیشنهادها:',
    clearRecents: 'پاک کردن',
  }
};

const DEFAULTS = {
  lang: 'en', mode: 'search',
  download: false, details: false, show_insights: false,
  limit: 25, min_width: 0, min_height: 0,
  workers: 4, delay: 1.0, jitter: 0.5, batch_size: 10,
};

const $ = (id) => document.getElementById(id);
let settings = loadSettings();
let currentJob = null;
let lastPins = [];

function loadSettings() {
  try {
    const raw = localStorage.getItem('ps_settings');
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  }
  catch { return { ...DEFAULTS }; }
}
function saveSettings() { localStorage.setItem('ps_settings', JSON.stringify(settings)); }

/* ---------------- language ---------------- */
function applyLang() {
  const t = I18N[settings.lang] || I18N.en;
  document.documentElement.lang = settings.lang;
  document.documentElement.dir = settings.lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (t[k] != null) el.textContent = t[k];
    else if (I18N[k]?.[settings.lang] != null) el.textContent = I18N[k][settings.lang];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.dataset.i18nPh;
    if (t[k] != null) el.placeholder = t[k];
    else if (I18N[k]?.[settings.lang] != null) el.placeholder = I18N[k][settings.lang];
  });
  $('lang-label').textContent = settings.lang === 'en' ? 'فا' : 'EN';
  document.title = settings.lang === 'fa' ? 'اسکرپر پینترست' : 'Pinterest Scraper';
  const layoutBtn = $('layout-btn');
  if (layoutBtn) {
    const isWide = document.body.dataset.layout === 'wide';
    layoutBtn.title = isWide ? (t.layoutCompact || 'Standard width') : (t.layoutWide || 'Full width');
  }
  renderRecent();
}

/* ---------------- settings drawer (smooth animation) ---------------- */
function syncDrawerFromSettings() {
  $('opt-download').checked = settings.download;
  $('opt-details').checked = settings.details;
  $('opt-insights').checked = settings.show_insights;
  $('opt-limit').value = settings.limit;
  $('opt-min-width').value = settings.min_width;
  $('opt-min-height').value = settings.min_height;
  $('opt-workers').value = settings.workers;
  $('opt-delay').value = settings.delay;
  $('opt-jitter').value = settings.jitter;
  $('opt-batch').value = settings.batch_size;
}
function readDrawerToSettings() {
  settings.download = $('opt-download').checked;
  settings.details = $('opt-details').checked;
  settings.show_insights = $('opt-insights').checked;
  settings.limit = +$('opt-limit').value || DEFAULTS.limit;
  settings.min_width = +$('opt-min-width').value || 0;
  settings.min_height = +$('opt-min-height').value || 0;
  settings.workers = +$('opt-workers').value || DEFAULTS.workers;
  settings.delay = parseFloat($('opt-delay').value) || 0;
  settings.jitter = parseFloat($('opt-jitter').value) || 0;
  settings.batch_size = +$('opt-batch').value || DEFAULTS.batch_size;
  saveSettings();
}
function openDrawer(open) {
  $('settings-drawer').classList.toggle('open', open);
  $('settings-drawer').setAttribute('aria-hidden', String(!open));
  $('overlay').classList.toggle('open', open);
}

/* ---------------- job submission ---------------- */
async function startScrape() {
  const query = $('search-input').value.trim();
  const t = I18N[settings.lang] || I18N.en;
  if (!query) { showError(t.errEmpty); return; }
  readDrawerToSettings();
  hideError();
  if (currentView !== 'search') {
    currentView = 'search';
    $('tab-search').classList.add('active');
    $('tab-gallery').classList.remove('active');
  }
  $('empty').classList.add('hidden');
  $('stats-card').classList.add('hidden');
  showSkeletons();
  addRecent(query);
  initProgress(t.collecting);

  const body = { mode: 'search', query, ...settings };
  delete body.lang;
  delete body.show_insights;
  delete body.dedup;
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
    $('progress-title').textContent = labels[ev.phase] || ev.phase;
    $('progress-bar').classList.toggle('indeterminate', ev.phase === 'collect' && !ev.total);
    const prevIdx = phaseOrder.indexOf(ev.phase);
    for (let i = 0; i < prevIdx; i++) {
      if (phaseState[phaseOrder[i]]) phaseState[phaseOrder[i]].done = true;
    }
    currentPhase = ev.phase;
    if (!phaseState[ev.phase]) phaseState[ev.phase] = { count: 0, total: ev.total || 0, done: false };
    if (ev.total) phaseState[ev.phase].total = ev.total;
    updatePhaseUI();
  } else if (ev.event === 'progress') {
    if (ev.phase) currentPhase = ev.phase;
    if (currentPhase && phaseState[currentPhase]) {
      phaseState[currentPhase].count = ev.count;
      if (ev.total) phaseState[currentPhase].total = ev.total;
      if (phaseState[currentPhase].total > 0 && phaseState[currentPhase].count >= phaseState[currentPhase].total) {
        phaseState[currentPhase].done = true;
      }
    }
    updatePhaseUI();
  } else if (ev.event === 'nothing_new') {
    appendMeta(t.nothingNew);
  } else if (ev.event === 'done') {
    es.close();
    finishJob(ev);
  }
}

async function finishJob(ev) {
  const t = I18N[settings.lang] || I18N.en;
  const cancelBtn = $('cancel-btn');
  if (cancelBtn) {
    cancelBtn.disabled = false;
    cancelBtn.textContent = t.cancel || 'Cancel';
  }
  if (ev.status === 'cancelled') {
    showError(t.cancelled || 'Cancelled');
    $('progress-card').classList.add('hidden');
    currentJob = null;
    return;
  }
  if (ev.status === 'error') {
    showError(`${t.errJob} ${ev.error}`);
    $('progress-card').classList.add('hidden');
    currentJob = null;
    return;
  }
  const res = await fetch(`/api/jobs/${currentJob}/result`);
  const data = await res.json();
  lastPins = data.pins || [];
  window._lastPins = lastPins;
  renderStats(ev);
  const hasImages = lastPins.some(p => p.local_file);
  if (!lastPins.length) {
    const t2 = I18N[settings.lang] || I18N.en;
    if (hasImages || (ev.stats && ev.stats.downloaded > 0)) {
      showError(t2.nothingNew);
    } else {
      showError(t2.noResults || 'No results found for this query.');
    }
  } else {
    hideError();
  }
  resetFeed(lastPins);
  renderChart();
  updateGalleryBadge();
  if (currentJob && lastPins.length > 0) {
    $('exp-xlsx').href = `/api/jobs/${currentJob}/export/xlsx`;
    $('exp-xlsx').classList.remove('hidden');
    if (hasImages) {
      $('exp-zip').href = `/api/jobs/${currentJob}/export/zip`;
      $('exp-zip').classList.remove('hidden');
    } else {
      $('exp-zip').classList.add('hidden');
    }
    $('export-bar').classList.remove('hidden');
  } else {
    $('export-bar').classList.add('hidden');
  }
  $('progress-card').classList.add('hidden');
  currentJob = null;
}

/* ---------------- progress UI ---------------- */
const phaseOrder = ['collect', 'details', 'download'];
const phaseState = {};
let currentPhase = null;

function initProgress(title) {
  const card = $('progress-card');
  card.classList.remove('hidden');
  $('progress-title').textContent = title;
  $('progress-bar').classList.add('indeterminate');
  $('progress-bar').style.width = '0%';
  $('progress-pct').textContent = '0%';
  $('progress-meta').textContent = '';
  const cancelBtn = $('cancel-btn');
  if (cancelBtn) {
    cancelBtn.disabled = false;
    const t = I18N[settings.lang] || I18N.en;
    cancelBtn.textContent = t.cancel || 'Cancel';
  }
  phaseOrder.forEach(p => { phaseState[p] = { count: 0, total: 0, done: false }; });
  currentPhase = 'collect';
  updatePhaseUI();
}

function updatePhaseUI() {
  document.querySelectorAll('.phase-chip').forEach(ch => {
    const p = ch.dataset.phase;
    const st = phaseState[p];
    ch.classList.toggle('active', p === currentPhase);
    ch.classList.toggle('done', !!(st && st.done));
  });
  const st = phaseState[currentPhase];
  let pct = 0;
  if (st && st.total > 0) {
    pct = Math.min(100, Math.round((st.count / st.total) * 100));
    $('progress-bar').classList.remove('indeterminate');
  }
  $('progress-bar').style.width = pct + '%';
  $('progress-pct').textContent = pct + '%';
  const bits = [];
  phaseOrder.forEach(p => {
    const s = phaseState[p];
    if (s && s.total > 0) bits.push(`${p}: ${s.count}/${s.total}`);
  });
  if (bits.length) $('progress-meta').textContent = bits.join('  ·  ');
}

function appendMeta(text) {
  $('progress-meta').textContent = `${$('progress-meta').textContent} ${text}`.trim();
}

/* ---------------- results UI ---------------- */
function renderStats(ev) {
  const t = I18N[settings.lang] || I18N.en;
  const s = ev.stats || {};
  const totalPins = ev.total ?? lastPins.length;
  const downloaded = s.downloaded ?? 0;
  const onDisk = lastPins.filter(p => p.local_file).length;
  const failed = s.failed ?? 0;
  const currentQuery = $('search-input').value.trim();

  let html = `
    <div class="stats-header">
      <span class="stats-title">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-end:6px"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
        ${t.statSummary || 'Results Summary'}
      </span>
      ${currentQuery ? `<span class="stats-query">“${escapeHtml(currentQuery)}”</span>` : ''}
    </div>
    <div class="stats-grid">
      <div class="stat-card stat-total">
        <span class="stat-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </span>
        <div class="stat-data">
          <span class="stat-num">${totalPins}</span>
          <span class="stat-lbl">${t.statTotal || 'Total Pins'}</span>
        </div>
      </div>
      <div class="stat-card stat-downloaded">
        <span class="stat-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <div class="stat-data">
          <span class="stat-num">${downloaded}</span>
          <span class="stat-lbl">${t.statDownloaded || 'Downloaded'}</span>
        </div>
      </div>
      <div class="stat-card stat-existing">
        <span class="stat-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </span>
        <div class="stat-data">
          <span class="stat-num">${onDisk}</span>
          <span class="stat-lbl">${t.statOnDisk || 'Saved on disk'}</span>
        </div>
      </div>
  `;

  if (failed > 0) {
    html += `
      <div class="stat-card stat-failed">
        <span class="stat-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </span>
        <div class="stat-data">
          <span class="stat-num">${failed}</span>
          <span class="stat-lbl">${t.statFailed || 'Failed'}</span>
        </div>
      </div>
    `;
  }
  if (s.skipped_small) {
    html += `
      <div class="stat-card">
        <span class="stat-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7l-6-6a1 1 0 00-1.4 0l-11 11a1 1 0 000 1.4l6 6a1 1 0 001.4 0l11-11a1 1 0 000-1.4zM7.5 10.5l2-2M10.5 13.5l2-2M13.5 16.5l2-2"/></svg>
        </span>
        <div class="stat-data">
          <span class="stat-num">${s.skipped_small}</span>
          <span class="stat-lbl">${t.skippedSmall || 'Too small'}</span>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  $('stats-card').innerHTML = html;
  $('stats-card').classList.remove('hidden');
}

function fmtNum(n) {
  if (n == null) return '';
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

function renderGrid(pins, incremental) {
  const grid = $('grid');
  if (!incremental) grid.innerHTML = '';
  const start = incremental ? grid.querySelectorAll('.pin-card').length : 0;
  $('empty').classList.toggle('hidden', pins.length > 0);
  pins.slice(incremental ? grid.querySelectorAll('.pin-card').length : 0).forEach((pin, k) => {
    const i = start + k;
    const img = pin.image_url || '';
    const local = pin.local_file
      ? `/api/images/${encodeURIComponent(pin.local_file)}` : '';
    const src = local || img;
    const card = document.createElement('article');
    card.className = 'pin-card';
    card._pin = pin;
    if (selectionMode) card.classList.add('selectable');
    card.style.animationDelay = `${Math.min(i * 0.04, 0.8)}s`;
    card.innerHTML = `
      ${img ? `<img loading="lazy" src="${src}" alt="${escapeHtml(pin.title || pin.pin_id)}"
            onerror="this.onerror=null;this.src='${img}'">` : '<div style="padding:40px;text-align:center"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg></div>'}
      <div class="pin-overlay">
        <button class="pin-save">${I18N[settings.lang]?.savePin || 'Save'}</button>
        <div class="pin-meta">
          ${pin.title ? `<div>${escapeHtml(pin.title.slice(0, 60))}</div>` : ''}
          ${(pin.saves || pin.comments) ? `<div>${pin.saves ? `${fmtNum(pin.saves)} ${I18N[settings.lang]?.savesLabel || 'saves'}` : ''}${pin.saves && pin.comments ? ' · ' : ''}${pin.comments ? `${fmtNum(pin.comments)} ${I18N[settings.lang]?.commentsLabel || 'comments'}` : ''}</div>` : ''}
          ${pin.width ? `<div>${pin.width}×${pin.height}</div>` : ''}
          <a href="${pin.pin_url || '#'}" target="_blank" rel="noopener"><span>Pinterest</span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-start:3px"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>
          <a href="${img}" target="_blank" rel="noopener"><span>${I18N[settings.lang]?.openOrig || 'Original'}</span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-start:3px"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      if (selectionMode) return;
      openPinModal(pin, src);
    });
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

/* ---------------- gallery & view switching ---------------- */
let currentView = 'search';

async function updateGalleryBadge() {
  try {
    const res = await fetch('/api/gallery');
    if (res.ok) {
      const data = await res.json();
      const badge = $('gallery-badge');
      if (badge) badge.textContent = data.total ?? 0;
    }
  } catch {}
}

async function showGallery() {
  currentView = 'gallery';
  $('tab-gallery').classList.add('active');
  $('tab-search').classList.remove('active');
  hideError();
  $('progress-card').classList.add('hidden');
  $('stats-card').classList.add('hidden');
  $('chart-card').classList.add('hidden');
  const recentRow = $('recent-row');
  if (recentRow) recentRow.classList.add('hidden');
  showSkeletons(12);

  try {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    const pins = data.pins || [];
    $('gallery-badge').textContent = data.total ?? pins.length;

    if (!pins.length) {
      $('grid').innerHTML = '';
      $('empty-icon').innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
      const t = I18N[settings.lang] || I18N.en;
      $('empty-title').textContent = t.galleryEmptyTitle || 'No downloaded images yet';
      $('empty-text').textContent = t.galleryEmptyText || "Search and scrape pins with 'Download images' checked to build your local gallery.";
      $('empty').classList.remove('hidden');
      $('export-bar').classList.add('hidden');
    } else {
      $('empty').classList.add('hidden');
      resetFeed(pins);
      $('exp-zip').href = '/api/gallery/export/zip';
      $('exp-zip').classList.remove('hidden');
      $('exp-xlsx').classList.add('hidden');
      $('export-bar').classList.remove('hidden');

      const t = I18N[settings.lang] || I18N.en;
      $('stats-card').innerHTML = `
        <div class="stats-header">
          <span class="stats-title">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-end:6px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            ${t.modeGallery || 'Gallery'}
          </span>
          <span class="stats-query">${pins.length} ${t.pins || 'pins'}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-card stat-downloaded">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            </span>
            <div class="stat-data">
              <span class="stat-num">${pins.length}</span>
              <span class="stat-lbl">${t.statOnDisk || 'Saved on disk'}</span>
            </div>
          </div>
        </div>
      `;
      $('stats-card').classList.remove('hidden');
    }
  } catch (err) {
    showError('Failed to load gallery');
  }
}

function showSearch() {
  currentView = 'search';
  $('tab-search').classList.add('active');
  $('tab-gallery').classList.remove('active');
  hideError();
  const t = I18N[settings.lang] || I18N.en;
  $('empty-icon').innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-2l-2-3V5a1 1 0 00-1-1H8a1 1 0 00-1 1v7l-2 3v2z"/></svg>';
  $('empty-title').textContent = t.emptyTitle;
  $('empty-text').textContent = t.emptyText;

  if (lastPins && lastPins.length > 0) {
    $('empty').classList.add('hidden');
    resetFeed(lastPins);
    const hasImages = lastPins.some(p => p.local_file);
    if (currentJob) {
      $('exp-xlsx').href = `/api/jobs/${currentJob}/export/xlsx`;
      $('exp-xlsx').classList.remove('hidden');
      if (hasImages) {
        $('exp-zip').href = `/api/jobs/${currentJob}/export/zip`;
        $('exp-zip').classList.remove('hidden');
      } else {
        $('exp-zip').classList.add('hidden');
      }
      $('export-bar').classList.remove('hidden');
    }
  } else {
    $('grid').innerHTML = '';
    $('empty').classList.remove('hidden');
    $('stats-card').classList.add('hidden');
    $('export-bar').classList.add('hidden');
  }
  renderRecent();
}

/* ---------------- wire up ---------------- */
$('search-form').addEventListener('submit', (e) => { e.preventDefault(); startScrape(); });
$('settings-btn').addEventListener('click', () => { syncDrawerFromSettings(); openDrawer(true); });
$('close-settings').addEventListener('click', () => openDrawer(false));
$('overlay').addEventListener('click', () => openDrawer(false));
$('reset-settings').addEventListener('click', () => {
  settings = { ...DEFAULTS, lang: settings.lang, mode: 'search' };
  saveSettings(); syncDrawerFromSettings();
});
$('lang-btn').addEventListener('click', () => {
  settings.lang = settings.lang === 'en' ? 'fa' : 'en';
  saveSettings(); applyLang();
});

const drawer = $('settings-drawer');
if (drawer) {
  drawer.addEventListener('input', readDrawerToSettings);
  drawer.addEventListener('change', readDrawerToSettings);
}

$('tab-search').addEventListener('click', () => {
  if (currentView !== 'search') showSearch();
});
$('tab-gallery').addEventListener('click', () => {
  if (currentView !== 'gallery') showGallery();
});

$('cancel-btn').addEventListener('click', async () => {
  if (currentJob) {
    const btn = $('cancel-btn');
    btn.disabled = true;
    btn.textContent = '…';
    try {
      await fetch(`/api/jobs/${currentJob}/cancel`, { method: 'POST' });
    } catch {}
  }
});

applyLang();
syncDrawerFromSettings();
updateGalleryBadge();
initLayout();

/* ---------------- live search suggestions (debounced) ---------------- */
const sugList = $('suggest-list');
const input = $('search-input');
let debounceTimer = null, sugItems = [], sugIndex = -1, sugAbort = null;

function hideSuggest() {
  sugList.classList.remove('show');
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
  sugList.innerHTML = items.map(s => {
    if (s.type === 'user') {
      return `<li role="option" class="sug-user">
        <img class="sug-avatar" src="${s.image || ''}" alt="" loading="lazy"
             onerror="this.style.visibility='hidden'">
        <span class="sug-texts"><span class="sug-name">${highlight(q, s.text)}
          ${s.verified ? '<span class="sug-verified" title="Verified"><svg viewBox="0 0 24 24" width="12" height="12" fill="#0074E8"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></span>' : ''}</span>
          ${s.sub ? `<span class="sug-sub">${escapeHtml(s.sub)}</span>` : ''}</span>
      </li>`;
    }
    return `<li role="option"><span class="sug-ico"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 2a8 8 0 105.3 14l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0010 2z"/></svg></span><span>${highlight(q, s.text)}</span></li>`;
  }).join('');
  sugList.classList.toggle('show', items.length > 0);
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

/* ================= Pin detail modal (Pinterest-authentic closeup) ================= */
let pmIndex = -1;
let pmSource = '';

function showPinAt(index) {
  const pins = window._lastPins || lastPins || [];
  if (!pins.length) return;
  pmIndex = ((index % pins.length) + pins.length) % pins.length;
  const pin = pins[pmIndex];
  const t = I18N[settings.lang] || I18N.en;
  const src = pin.local_file ? `/api/images/${encodeURIComponent(pin.local_file)}` : (pin.image_url || '');
  pmSource = src;

  const img = $('pm-img');
  img.classList.remove('pm-img-fade');
  void img.offsetWidth;
  img.src = src;
  img.classList.add('pm-img-fade');
  img.alt = pin.title || pin.pin_id || '';
  img.onerror = () => {
    img.onerror = null;
    if (pin.image_url && img.src !== pin.image_url) img.src = pin.image_url;
  };

  // Creator header
  const creatorName = pin.creator_name || pin.creator_username || 'Pinterest Creator';
  const creatorUser = pin.creator_username ? `@${pin.creator_username}` : '';
  const avatarEl = $('pm-creator-avatar');
  if (avatarEl) {
    avatarEl.textContent = (creatorName.trim()[0] || 'P').toUpperCase();
  }
  const nameEl = $('pm-creator-name');
  if (nameEl) nameEl.textContent = creatorName;
  const userEl = $('pm-creator-user');
  if (userEl) userEl.textContent = creatorUser;
  const linkEl = $('pm-creator-link');
  if (linkEl) {
    if (pin.creator_username) {
      linkEl.href = `https://www.pinterest.com/${pin.creator_username}/`;
      linkEl.classList.remove('hidden');
    } else {
      linkEl.classList.add('hidden');
    }
  }

  // Title & description
  const titleEl = $('pm-title');
  if (titleEl) titleEl.textContent = pin.title || `Pin ${pin.pin_id}`;
  const descEl = $('pm-desc');
  if (descEl) {
    descEl.textContent = pin.description || '';
    descEl.classList.toggle('hidden', !pin.description);
  }

  // Metric Badges
  const savesVal = $('pm-val-saves');
  if (savesVal) savesVal.textContent = fmtNum(pin.saves ?? 0);
  const commVal = $('pm-val-comments');
  if (commVal) commVal.textContent = fmtNum(pin.comments ?? 0);
  const sizeVal = $('pm-val-size');
  if (sizeVal) sizeVal.textContent = (pin.width && pin.height) ? `${pin.width} × ${pin.height}` : '—';

  // Board info
  const boardRow = $('pm-board-row');
  const boardLink = $('pm-board-name');
  if (boardRow && boardLink) {
    if (pin.board_name) {
      boardRow.classList.remove('hidden');
      boardLink.textContent = pin.board_name;
      boardLink.href = pin.board_url || '#';
    } else {
      boardRow.classList.add('hidden');
    }
  }

  // Dominant colors palette
  const colorsWrap = $('pm-colors');
  if (colorsWrap) {
    colorsWrap.innerHTML = '';
    const palette = [];
    if (pin.dominant_color) palette.push(pin.dominant_color);
    if (Array.isArray(pin.colors)) {
      pin.colors.forEach(c => { if (!palette.includes(c)) palette.push(c); });
    }
    if (palette.length > 0) {
      palette.forEach(color => {
        const c = document.createElement('div');
        c.className = 'color-chip';
        c.style.background = color;
        c.title = `${color} (click to copy)`;
        c.onclick = () => {
          navigator.clipboard?.writeText(color);
          c.style.transform = 'scale(1.35)';
          setTimeout(() => c.style.transform = '', 300);
        };
        colorsWrap.appendChild(c);
      });
      colorsWrap.parentElement.classList.remove('hidden');
    } else {
      colorsWrap.parentElement.classList.add('hidden');
    }
  }

  // Topbar actions
  const dlBtn = $('pm-download');
  if (dlBtn) {
    dlBtn.href = src;
    dlBtn.download = `pin_${pin.pin_id}.jpg`;
  }
  const pinLink = $('pm-pin-link');
  if (pinLink) {
    pinLink.href = pin.pin_url || `https://www.pinterest.com/pin/${pin.pin_id}/`;
  }
  const copyBtn = $('pm-copy-link');
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const urlToCopy = pin.pin_url || pin.image_url || window.location.href;
      try {
        await navigator.clipboard.writeText(urlToCopy);
        const origHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#00a300" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => { copyBtn.innerHTML = origHtml; }, 1400);
      } catch (err) {}
    };
  }

  const visualBtn = $('pm-visual');
  if (visualBtn) {
    visualBtn.onclick = () => runVisualSearch(pin.pin_id);
  }
}

function openPinModal(pin, src) {
  const pins = window._lastPins || lastPins || [];
  pmIndex = Math.max(0, pins.findIndex(p => p.pin_id === pin.pin_id));
  showPinAt(pmIndex);
  document.body.style.overflow = 'hidden';
  const m = $('pin-modal');
  m.classList.remove('closing');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
}

function closePinModal() {
  document.body.style.overflow = '';
  const m = $('pin-modal');
  m.classList.add('closing');
  m.classList.remove('open');
  setTimeout(() => {
    m.classList.remove('closing');
    m.setAttribute('aria-hidden', 'true');
  }, 280);
}

function pmNav(dir) { showPinAt(pmIndex + dir); }

$('close-pin-modal').addEventListener('click', closePinModal);
$('pm-prev').addEventListener('click', () => pmNav(-1));
$('pm-next').addEventListener('click', () => pmNav(1));
$('pin-modal').addEventListener('click', (e) => {
  if (e.target.id === 'pin-modal') closePinModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if ($('settings-drawer').classList.contains('open')) {
      openDrawer(false);
      return;
    }
    if ($('pin-modal').classList.contains('open')) {
      closePinModal();
      return;
    }
    if (selectionMode) {
      setSelectionMode(false);
      return;
    }
  }
  if ($('pin-modal').classList.contains('open')) {
    if (e.key === 'ArrowLeft') pmNav(-1);
    if (e.key === 'ArrowRight') pmNav(1);
  }
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
    $('stats-card').innerHTML = `<span class="stat-pill"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-end:4px"><path d="M12 2l2.4 6.6L21 11l-5.6 4.4L17 22l-5-4-5 4 1.6-6.6L3 11l6.6-2.4z"/></svg>${t.visualResults || 'Visually similar pins'}: <b>${lastPins.length}</b></span>`;
    $('stats-card').classList.remove('hidden');
    $('export-bar').classList.add('hidden');
    $('chart-card').classList.add('hidden');
    resetFeed(lastPins);
  } catch {
    $('progress-card').classList.add('hidden');
    showError('visual search failed');
  }
}

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
  const txt = `${t.runningQuery || 'Query'} ${ev.index} ${t.of || 'of'} ${ev.total}: ${ev.query}`;
  const el = $('progress-title') || $('progress-meta');
  if (el) el.textContent = txt;
}
function els_queries_done(ev) {
  const t = I18N[settings.lang] || I18N.en;
  const txt = `${t.batchDone || 'All queries done'} — ${ev.total} ${t.pins || 'pins'}`;
  const el = $('progress-title') || $('progress-meta');
  if (el) el.textContent = txt;
}

/* ---------- theme (Spotify-smooth) ---------- */
function applyTheme(t) {
  document.body.dataset.theme = t;
  localStorage.setItem('theme', t);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.innerHTML = t === 'dark'
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
  }
  if (window._chart) { window._chart.destroy(); window._chart = null; renderChart(); }
}
function initTheme() {
  const saved = localStorage.getItem('theme');
  const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || sys);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.onclick = () => applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
}

/* ---------- layout (wide / contained toggle) ---------- */
function applyLayout(layout) {
  document.body.dataset.layout = layout;
  localStorage.setItem('ps_layout', layout);
  const icon = document.getElementById('layout-icon');
  const isWide = layout === 'wide';
  if (icon) {
    icon.innerHTML = isWide
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;
  }
  const btn = document.getElementById('layout-btn');
  if (btn) {
    const t = I18N[settings.lang] || I18N.en;
    btn.title = isWide ? (t.layoutCompact || 'Standard width') : (t.layoutWide || 'Full width');
  }
}
function initLayout() {
  const saved = localStorage.getItem('ps_layout') || 'contained';
  applyLayout(saved);
  const btn = document.getElementById('layout-btn');
  if (btn) btn.onclick = () => applyLayout(document.body.dataset.layout === 'wide' ? 'contained' : 'wide');
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
  row.innerHTML = `<span class="row-label">${list.length ? (t.recent || 'Recent:') : (t.tryLabel || 'Try:')}</span>` +
    items.map(q => `<button class="chip recent-chip">${esc(q)}</button>`).join('') +
    (list.length ? `<button id="clear-recents" class="chip clear-chip"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-end:3px"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>${t.clearRecents || 'Clear'}</button>` : '');
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
}
function updateSelBar() {
  const bar = document.getElementById('selection-bar');
  bar.classList.toggle('hidden', !selectionMode);
  document.getElementById('sel-count').textContent = `${selectedFiles.size} ${I18N[settings.lang]?.selectedCount || 'selected'}`;
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

let suppressClickUntil = 0;

/* long-press on a card enters selection mode (delegated) */
document.addEventListener('pointerdown', (e) => {
  const card = e.target.closest('.pin-card');
  if (!card || selectionMode) return;
  if (!card._pin?.local_file && currentView !== 'gallery') return;
  card.classList.add('holding');
  pressTimer = setTimeout(() => {
    pressTimer = null;
    suppressClickUntil = Date.now() + 450;
    card.classList.remove('holding');
    setSelectionMode(true);
    toggleSelect(card);
  }, 400);
});
['pointerup', 'pointerleave', 'pointercancel', 'scroll'].forEach(ev =>
  document.addEventListener(ev, () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    document.querySelectorAll('.pin-card.holding').forEach(c => c.classList.remove('holding'));
  }, true));

/* click behavior while in selection mode */
document.addEventListener('click', (e) => {
  if (Date.now() < suppressClickUntil) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
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
  const deleteBtn = $('sel-delete');
  deleteBtn.disabled = true;
  try {
    const toDelete = [...selectedFiles];
    const res = await fetch('/api/images/delete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names: toDelete }),
    });
    const { deleted } = await res.json();
    const selectedCards = document.querySelectorAll('.pin-card.selected');
    selectedCards.forEach(c => c.classList.add('deleting'));
    await new Promise(r => setTimeout(r, 320));
    selectedCards.forEach(c => c.remove());

    const deletedSet = new Set(toDelete);
    lastPins = lastPins.filter(p => !p.local_file || !deletedSet.has(p.local_file));
    allPins = allPins.filter(p => !p.local_file || !deletedSet.has(p.local_file));
    window._lastPins = lastPins;

    setSelectionMode(false);
    await updateGalleryBadge();

    const deletedLabel = t.deletedMsg || 'images deleted';
    $('stats-card').innerHTML = `
      <div class="stats-header">
        <span class="stats-title">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-inline-end:6px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          ${deleted} ${deletedLabel}
        </span>
        ${currentView === 'gallery' ? `<span class="stats-query">${lastPins.length} ${t.pins || 'pins'}</span>` : ''}
      </div>
    `;
    $('stats-card').classList.remove('hidden');
    $('export-bar').classList.add('hidden');
    if (!document.querySelector('.pin-card')) $('empty').classList.remove('hidden');
  } finally {
    deleteBtn.disabled = false;
  }
});


/* ================= Infinite scroll ================= */
const PAGE_SIZE = 25;
let allPins = [];
let renderedCount = 0;
let loadingMore = false;

function resetFeed(pins) {
  allPins = pins || [];
  lastPins = allPins;
  window._lastPins = allPins;
  renderedCount = 0;
  renderGrid(allPins.slice(0, PAGE_SIZE));
  renderedCount = Math.min(PAGE_SIZE, allPins.length);
}

async function loadMore() {
  if (loadingMore || renderedCount >= allPins.length) return;
  loadingMore = true;
  const next = allPins.slice(renderedCount, renderedCount + PAGE_SIZE);
  if (next.length && next[0].pin_id && !next[0].image_url) {
    // results come in one shot from backend; just append
  }
  renderGrid(allPins, true);
  renderedCount += next.length;
  loadingMore = false;
}

const _io = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) loadMore();
}, { rootMargin: '600px' });
const _sentinel = document.getElementById('scroll-sentinel');
if (_sentinel) _io.observe(_sentinel);

// hook: whenever a full result set arrives, feed it through the pager
