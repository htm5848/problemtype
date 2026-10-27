/* ═══════════════════════════════════════════════════════════════════════
   PHYS 211 Group-Work Coding Tool — main.js
   Sister tool to the PHYS 211 TA Observation Tool. Same NetID + setup
   screens; the observation page is a full classroom map where each student
   seat can be coded on the group-work interaction scheme below.
   No backend — everything lives in this browser tab (with a localStorage
   safety-net autosave) until the observer exports a CSV.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── PHYS 211 discussion-section roster ─────────────────────────────────
   Pulled from https://physics.illinois.edu/academics/courses/phys211
   (Discussion "D__" sections only — lab "L__" sections intentionally
   excluded). Double-check this against the live course schedule each
   semester and edit below — it's just a plain array. */
const TA_ROSTER = [
  { section: "D2A", days: "Tue",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Grant Gallier" },
  { section: "D2B", days: "Tue",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Rebecca Chan" },
  { section: "D2E", days: "Tue",        time: "10:00–11:50 AM", room: "147 Loomis", ta: "Aryan Tiwari" },
  { section: "D2F", days: "Tue",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Layla Ahmed" },
  { section: "D2J", days: "Tue",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Logan Mueller" },
  { section: "D2K", days: "Tue",        time: "12:00–1:50 PM",  room: "147 Loomis", ta: "Koichiro Takahashi" },
  { section: "D2M", days: "Tue",        time: "2:00–3:50 PM",   room: "147 Loomis", ta: "Hana Suna Kimlee" },
  { section: "D2N", days: "Tue",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Rebecca Chan" },
  { section: "D2R", days: "Tue",        time: "4:00–5:50 PM",   room: "137 Loomis", ta: "Shahana Lahiri" },
  { section: "D2S", days: "Tue",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Andrew Clarke" },
  { section: "D3A", days: "Wed",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Timothy Matthew Chung" },
  { section: "D3B", days: "Wed",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Olivia Bitcon" },
  { section: "D3E", days: "Wed",        time: "10:00–11:50 AM", room: "147 Loomis", ta: "Logan Mueller" },
  { section: "D3F", days: "Wed",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Christian Farina" },
  { section: "D3J", days: "Wed",        time: "12:00–1:50 PM",  room: "147 Loomis", ta: "Liam Patrick McGoldrick" },
  { section: "D3K", days: "Wed",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Feyisola Nana" },
  { section: "D3M", days: "Wed",        time: "2:00–3:50 PM",   room: "137 Loomis", ta: "Nishad Manohar" },
  { section: "D3N", days: "Wed",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Georgios Karikos" },
  { section: "D3R", days: "Wed",        time: "4:00–5:50 PM",   room: "147 Loomis", ta: "Hana Suna Kimlee" },
  { section: "D3S", days: "Wed",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Feyisola Nana" },
  { section: "D4A", days: "Thu",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Timothy Matthew Chung" },
  { section: "D4B", days: "Thu",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Grant Gallier" },
  { section: "D4E", days: "Thu",        time: "10:00–11:50 AM", room: "147 Loomis", ta: "Olivia Bitcon" },
  { section: "D4F", days: "Thu",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Daniela M Girotti-Hernandez" },
  { section: "D4J", days: "Thu",        time: "12:00–1:50 PM",  room: "137 Loomis", ta: "Logan Mueller" },
  { section: "D4K", days: "Thu",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Koichiro Takahashi" },
  { section: "D4M", days: "Thu",        time: "2:00–3:50 PM",   room: "147 Loomis", ta: "Shahana Lahiri" },
  { section: "D4N", days: "Thu",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Olivia Bitcon" },
  { section: "D4R", days: "Thu",        time: "4:00–5:50 PM",   room: "137 Loomis", ta: "Andrew Clarke" },
  { section: "D4S", days: "Thu",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Georgios Karikos" },
  { section: "D5A", days: "Fri",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Hao-Chien Wang" },
  { section: "D5B", days: "Fri",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Nishad Manohar" },
  { section: "D5E", days: "Fri",        time: "10:00–11:50 AM", room: "137 Loomis", ta: "Timothy Matthew Chung" },
  { section: "D5F", days: "Fri",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Aryan Tiwari" },
  { section: "D5J", days: "Fri",        time: "12:00–1:50 PM",  room: "137 Loomis", ta: "Feyisola Nana" },
  { section: "D5K", days: "Fri",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Koichiro Takahashi" },
  { section: "D5M", days: "Fri",        time: "2:00–3:50 PM",   room: "137 Loomis", ta: "Liam Patrick McGoldrick" },
  { section: "D5N", days: "Fri",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Nishad Manohar" },
  { section: "D5R", days: "Fri",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Georgios Karikos" },
  { section: "D5S", days: "Fri",        time: "4:00–5:50 PM",   room: "147 Loomis", ta: "Andrew Clarke" },
];

/* ── Coding scheme ─────────────────────────────────────────────────────────
   Edit descriptions here if the scheme wording changes. `key` is used for
   CSS colors and CSV column names. */
const CODES = [
  { v: 0,   key: "0",  desc: "No interaction and no work" },
  { v: 1,   key: "1",  desc: "Off-topic interaction" },
  { v: 2,   key: "2",  desc: "Working independently, no interaction" },
  { v: 3,   key: "3",  desc: "Working independently, just checking the final answer/product" },
  { v: 3.5, key: "35", desc: "Working independently with occasional interaction / process" },
  { v: 4,   key: "4",  desc: "Working collaboratively with occasional interaction" },
  { v: 5,   key: "5",  desc: "Working collaboratively with a high interaction level" },
];
const codeInfo = v => CODES.find(c => c.v === v);

const DEFAULT_SEATS = 4;
const MIN_SEATS = 1, MAX_SEATS = 10;
const STALE_SECONDS = 300;          // seats not coded for 5 min get a dashed outline
const CHUNK_SEC = 60;               // 1-minute rotation: seconds spent on each table

const STORAGE_KEY = "phys211coding_session_v2";   // v2: off-topic code + per-table problem type (v1 saves aren't resumed)
const LAST_NETID_KEY = "phys211coding_last_netid";

let currentNetID = "";
let obsSession = null;
let tickHandle = null;
let autosaveTimer = null;
let selection = null;               // { type: "student", table, seat } | { type: "table", table }

/* ── Small utilities ───────────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function csvField(v) {
  if (v === undefined || v === null) v = "";
  v = String(v);
  if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
  return v;
}

function escapeHTML(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function formatTime(totalSeconds) {
  totalSeconds = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatDateNice(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function currentElapsedSeconds() {
  if (!obsSession) return 0;
  let ms = obsSession.accumMs || 0;
  if (obsSession.timerRunning && obsSession.segmentStart) ms += Date.now() - obsSession.segmentStart;
  return Math.round(ms / 1000);
}

function saveNow() {
  clearTimeout(autosaveTimer);
  if (!obsSession || !obsSession.active) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obsSession)); } catch (e) { /* storage unavailable — non-fatal */ }
}

function autosave() {
  if (!obsSession) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveNow, 300);
}

// Flush any pending autosave the moment the page is hidden or closed (iPad
// Safari can drop a backgrounded tab before the debounce fires).
window.addEventListener("pagehide", saveNow);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveNow(); });

function clearAutosave() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
}

const sid = (t, s) => `T${t}-S${s}`;

/* ── Screen 1: NetID entry ─────────────────────────────────────────────── */
function submitNetID() {
  const input = $("netid-input");
  const val = input.value.trim();
  if (!val) {
    $("netid-error").classList.remove("hidden");
    input.focus();
    return;
  }
  $("netid-error").classList.add("hidden");
  currentNetID = val;
  try { localStorage.setItem(LAST_NETID_KEY, val); } catch (e) { /* ignore */ }
  $("setup-observer-label").textContent = "Observer: " + currentNetID;
  resetSetupForm();
  showScreen("screen-setup");
}

function switchUser() {
  currentNetID = "";
  $("netid-input").value = "";
  showScreen("screen-netid");
  $("netid-input").focus();
}

/* ── Screen 2: Setup ───────────────────────────────────────────────────── */
function populateSectionDropdown() {
  const sel = $("setup-section");
  const sorted = TA_ROSTER.slice().sort((a, b) => a.section.localeCompare(b.section));
  sorted.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.section;
    opt.textContent = `${r.section} — ${r.ta} (${r.days} ${r.time})`;
    sel.appendChild(opt);
  });
}

function onSectionChange() {
  const code = $("setup-section").value;
  const row = TA_ROSTER.find(r => r.section === code);
  $("setup-ta-name").value = row ? row.ta : "";
}

function resetSetupForm() {
  $("setup-section").value = "";
  $("setup-ta-name").value = "";
  $("setup-table-count").value = 6;
  const today = new Date();
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  $("setup-date").value = local.toISOString().slice(0, 10);
  $("setup-warning").style.display = "none";
}

function stepTables(delta) {
  const input = $("setup-table-count");
  let v = parseInt(input.value || "6", 10) + delta;
  v = Math.max(2, Math.min(16, v));
  input.value = v;
}

function startObservation() {
  const section = $("setup-section").value;
  const ta = $("setup-ta-name").value;
  const date = $("setup-date").value;
  const n = parseInt($("setup-table-count").value || "6", 10);
  const warn = $("setup-warning");

  if (!section) {
    warn.textContent = "Please select a discussion section before starting.";
    warn.style.display = "block";
    return;
  }
  if (!date) {
    warn.textContent = "Please set the observation date.";
    warn.style.display = "block";
    return;
  }
  warn.style.display = "none";

  obsSession = {
    netid: currentNetID,
    section, ta, date,
    tableCount: n,
    tables: Array.from({ length: n }, (_, i) => ({ id: i + 1, seats: DEFAULT_SEATS, type: "" })),
    typeLog: [],                // per-table problem type changes { table, type, elapsedSec, ord, duringChunk? }
    nextTable: 1,               // table selected to observe next (manual rotation)
    labels: {},                 // sid -> optional student label (initials etc.)
    log: [],                    // chronological { kind: "code"|"note", group, sid, table, seat, code?, text?, elapsedSec, wallTime, phase }
    seq: 0,                     // group counter (a whole-table code is one group → one undo)
    phase: "",
    phaseLog: [{ elapsedSec: 0, phase: "" }],
    phaseStartIdx: 0,           // log index where the current activity round began
    chunks: [],                 // 1-minute rotation chunks { n, ord, phase, pseg, table, seats, start, end }
    chunkSeq: 0,
    chunkSec: CHUNK_SEC,
    accumMs: 0,
    segmentStart: Date.now(),
    timerRunning: true,
    totalSeconds: null,
    active: true,
    createdAt: new Date().toISOString(),
  };

  enterObserveScreen();
}

function enterObserveScreen() {
  $("obs-title").textContent = `${obsSession.section} · ${obsSession.ta}`;
  $("obs-sub").textContent = `Observer ${obsSession.netid} · ${formatDateNice(obsSession.date)}`;
  $("map-table-count").value = obsSession.tableCount;
  selection = null;
  showScreen("screen-observe");
  renderLegend();
  renderMap();
  renderRotBar();
  renderPanel();
  renderFooter();
  clearInterval(tickHandle);
  tickHandle = setInterval(tick, 1000);
  tick();
  autosave();
}

/* ── Timer ──────────────────────────────────────────────────────────────── */
function tick() {
  $("obs-timer").textContent = formatTime(currentElapsedSeconds());
  rotationTick();
  renderRotBar();
  updateSeatStates();
  const ago = $("p-ago");
  if (ago && selection && selection.type === "student") ago.textContent = agoText(sid(selection.table, selection.seat));
}

/* ── Problem type, per table ───────────────────────────────────────────
   Groups work at different paces, so each TABLE has its own problem type
   (Structured / Open-ended / Other), set in the rotation bar (or the table
   panel) before its minute starts. A table keeps its type until it is
   changed. Every minute, code and note is tagged with its table's type at
   the time. Changing a table's type gives that table a blank slate on the
   map; everything stays in the exports. */
const PROBLEM_TYPES = ["Structured", "Open-ended", "Other"];

function tableType(id) {
  const t = obsSession && obsSession.tables.find(x => x.id === id);
  return t && t.type ? t.type : "";
}

function setTableType(tableId, type) {
  const t = obsSession.tables.find(x => x.id === tableId);
  if (!t || t.type === type) return;
  t.type = type;
  const entry = { table: tableId, type, elapsedSec: currentElapsedSeconds(), ord: ++obsSession.seq };
  // A minute already running at this table is relabelled with the new type
  const c = currentChunk();
  if (c && c.table === tableId) {
    c.phase = type;
    obsSession.log.forEach(e => { if (e.chunk === c.n && e.table === tableId) e.phase = type; });
    entry.duringChunk = c.n;
  }
  obsSession.typeLog.push(entry);
  renderMap();
  renderRotBar();
  refreshPanelKeepDraft();
  renderFooter();
  autosave();
}

/* Index of the first log entry in the current activity round (legacy: one round). */
function roundStart() {
  if (!obsSession) return 0;
  return Math.min(obsSession.phaseStartIdx || 0, obsSession.log.length);
}

/* ── 1-minute table rotation (manual) ────────────────────────────────────
   The observer picks a table (‹ › in the bar), checks its problem type and
   taps Start: the tool counts down one minute while they code that table's
   students, then STOPS and waits — nothing happens until the observer
   starts the next table. Each turn starts with the table's seats blank.
   Every code is tagged with the minute ("chunk") it was given in, and the
   exports count ONE code per student per chunk (the last one given that
   minute) — standard time sampling. Codes given to a table outside its
   minute are kept in the log but not counted. */
function currentChunk() {
  const list = obsSession && obsSession.chunks;
  const c = list && list[list.length - 1];
  return c && c.end == null ? c : null;
}

function startChunk(tableId, atSec) {
  const t = obsSession.tables.find(x => x.id === tableId) || obsSession.tables[0];
  obsSession.chunks.push({
    n: ++obsSession.chunkSeq, ord: ++obsSession.seq,
    phase: t.type || "", pseg: obsSession.phaseLog.length - 1,
    table: t.id, seats: t.seats, start: atSec, end: null,
  });
}

function endChunk(atSec) {
  const c = currentChunk();
  if (!c) return;
  c.end = Math.max(c.start, atSec);
  // A short turn (under 30 s) with nothing coded — stopped early or cut off
  // by the end — isn't a sample, so it isn't kept
  if (c.end - c.start < 30 && !obsSession.log.some(e => e.kind === "code" && e.chunk === c.n)) obsSession.chunks.pop();
}

function nextTableId(fromId, dir) {
  const ids = obsSession.tables.map(t => t.id);
  const i = ids.indexOf(fromId);
  if (i < 0) return ids[0];
  return ids[(i + dir + ids.length) % ids.length];
}

function selectedNextTable() {
  const ids = obsSession.tables.map(t => t.id);
  return ids.includes(obsSession.nextTable) ? obsSession.nextTable : ids[0];
}

/* Called every second: when the minute is up, stop and wait for the observer. */
function rotationTick() {
  const c = currentChunk();
  if (!c) return;
  const len = obsSession.chunkSec || CHUNK_SEC;
  if (currentElapsedSeconds() < c.start + len) return;
  endChunk(c.start + len);
  obsSession.nextTable = nextTableId(c.table, 1);
  obsSession.timeUpAt = c.table;
  afterRotate(`Time's up at Table ${c.table} — choose the next table`);
}

/* ‹ › in the bar while waiting: choose which table to observe next. */
function pickNextTable(dir) {
  if (currentChunk()) return;
  obsSession.nextTable = nextTableId(selectedNextTable(), dir);
  obsSession.timeUpAt = null;
  renderRotBar();
  updateSeatStates();
  autosave();
}

function startTurn() {
  if (currentChunk()) return;
  const id = selectedNextTable();
  if (!tableType(id)) { showRotBanner(`Choose Table ${id}'s problem type first`); return; }
  obsSession.timeUpAt = null;
  startChunk(id, currentElapsedSeconds());
  afterRotate("");
}

/* ■ Stop: end this table's minute early and wait. */
function stopTurn() {
  const c = currentChunk();
  if (!c) return;
  endChunk(currentElapsedSeconds());
  obsSession.nextTable = nextTableId(c.table, 1);
  obsSession.timeUpAt = null;
  afterRotate("");
}

/* From the side panel: observe this table now (ends any running minute). */
function jumpToTable(id) {
  const c = currentChunk();
  if (c && c.table === id) return;
  const now = currentElapsedSeconds();
  if (c) endChunk(now);
  obsSession.nextTable = id;
  obsSession.timeUpAt = null;
  if (tableType(id)) { startChunk(id, now); afterRotate(`Now observing Table ${id}`); }
  else afterRotate(`Choose Table ${id}'s problem type, then tap Start`);
}

function afterRotate(message) {
  renderRotBar();
  updateSeatStates();
  refreshPanelKeepDraft();
  renderFooter();
  if (message) showRotBanner(message);
  autosave();
}

function refreshPanelKeepDraft() {
  const draft = $("p-note") ? $("p-note").value : "";
  renderPanel();
  if ($("p-note") && draft) $("p-note").value = draft;
}

let bannerTimer = null;
function showRotBanner(text) {
  const b = $("rot-banner");
  if (!b) return;
  b.textContent = text;
  b.classList.remove("show"); void b.offsetWidth; b.classList.add("show");
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => b.classList.remove("show"), 3200);
}

function typeButtons(tableId) {
  const cur = tableType(tableId);
  return `<div class="type-seg" role="group" aria-label="Problem type for Table ${tableId}">${PROBLEM_TYPES.map(t =>
    `<button type="button" class="type-btn ${cur === t ? "on" : ""}" onclick="setTableType(${tableId}, '${t}')" aria-pressed="${cur === t}">${t}</button>`).join("")}</div>`;
}

/* The bar above the map. Rebuilt only when its state changes; while a
   minute runs only the countdown updates each second, so taps are never
   lost to a re-render. */
function renderRotBar() {
  const bar = $("rot-bar");
  if (!bar || !obsSession) return;
  const c = currentChunk();
  const len = obsSession.chunkSec || CHUNK_SEC;
  if (!c) {
    const id = selectedNextTable(), type = tableType(id), up = obsSession.timeUpAt;
    const key = `wait-${id}-${type}-${up || ""}`;
    if (bar.dataset.key !== key) {
      bar.dataset.key = key;
      bar.className = "rot-bar waiting" + (up ? " time-up" : "");
      bar.innerHTML = `
        <div class="rot-now">
          <span class="rot-label">${up ? `Time's up at Table ${up} · next table` : "Next table"}</span>
          <span class="rot-pick">
            <button type="button" class="rot-arrow" onclick="pickNextTable(-1)" aria-label="Previous table">‹</button>
            <span class="rot-table">Table ${id}</span>
            <button type="button" class="rot-arrow" onclick="pickNextTable(1)" aria-label="Next table">›</button>
          </span>
        </div>
        ${typeButtons(id)}
        <span class="rot-spacer"></span>
        <button type="button" class="rot-btn start" onclick="startTurn()" ${type ? "" : "disabled"}
          title="${type ? "" : "Choose the problem type first"}">Start 1 minute ▶</button>`;
    }
    return;
  }
  const key = `run-${c.n}-${c.phase}`;
  if (bar.dataset.key !== key) {
    bar.dataset.key = key;
    bar.innerHTML = `
      <div class="rot-now"><span class="rot-label">Now observing</span><span class="rot-table">Table ${c.table}</span></div>
      ${typeButtons(c.table)}
      <div class="rot-progress" aria-hidden="true"><div id="rot-fill"></div></div>
      <span class="rot-left" id="rot-left"></span>
      <button type="button" class="rot-btn" onclick="stopTurn()" aria-label="Stop this table's minute now">■ Stop</button>`;
  }
  const left = Math.max(0, c.start + len - currentElapsedSeconds());
  bar.className = "rot-bar" + (left <= 10 ? " ending" : "");
  $("rot-fill").style.width = (100 * (1 - left / len)) + "%";
  $("rot-left").textContent = formatTime(left);
}

/* ── Legend ──────────────────────────────────────────────────────────────── */
function swatchStyle(c) {
  return `background:var(--c${c.key}-bg);color:var(--c${c.key}-fg)`;
}

function renderLegend() {
  $("legend").innerHTML = CODES.map(c =>
    `<span class="legend-chip" title="${escapeHTML(c.desc)}"><span class="sw" style="${swatchStyle(c)}">${c.v}</span>${escapeHTML(shortDesc(c))}</span>`
  ).join("");
}

function shortDesc(c) {
  return ({ 0: "No work", 1: "Off-topic", 2: "Indep.", 3: "Indep. + check", 3.5: "Indep. + some talk", 4: "Collab.", 5: "Collab. high" })[c.v];
}

/* ── Tables ─────────────────────────────────────────────────────────────── */
function stepTablesLive(delta) {
  if (!obsSession) return;
  let n = Math.max(2, Math.min(16, obsSession.tableCount + delta));
  if (n === obsSession.tableCount) return;
  if (n > obsSession.tableCount) {
    for (let i = obsSession.tableCount; i < n; i++) obsSession.tables.push({ id: i + 1, seats: DEFAULT_SEATS, type: "" });
  } else {
    obsSession.tables = obsSession.tables.slice(0, n);
    if (selection && selection.table > n) selection = null;
    const c = currentChunk();
    if (c && c.table > n) endChunk(currentElapsedSeconds());
    renderRotBar();
  }
  obsSession.tableCount = n;
  $("map-table-count").value = n;
  renderMap();
  renderPanel();
  autosave();
}

function stepSeats(tableId, delta) {
  const t = obsSession.tables.find(x => x.id === tableId);
  if (!t) return;
  t.seats = Math.max(MIN_SEATS, Math.min(MAX_SEATS, t.seats + delta));
  const c = currentChunk();
  if (c && c.table === tableId) c.seats = t.seats;
  renderMap();
  renderPanel();
  autosave();
}

/* Room layout: the front of the room is the TOP. 6 tables = 2 columns x 3
   rows. Numbering runs down the left column first, then the right column.
   Returns each table's { col, row }. */
function roomLayout(n, narrow) {
  let rows = n <= 3 ? n : n <= 8 ? Math.ceil(n / 2) : 4;
  let cols = Math.ceil(n / rows);
  if (narrow && cols > 2) { cols = 2; rows = Math.ceil(n / 2); }
  const pos = Array.from({ length: n }, (_, i) => ({ col: Math.floor(i / rows), row: i % rows }));
  return { cols, rows, pos };
}
const isNarrow = () => window.matchMedia("(max-width: 600px)").matches;

/* Students sit two in front of two: the first half of the seats along the
   top (front) side of the table, the rest facing them along the bottom. */
function seatSides(n) {
  const top = Math.ceil(n / 2);
  return Array.from({ length: n }, (_, i) => (i < top ? "top" : "bottom"));
}

function renderMap() {
  const grid = $("room-grid");
  if (!grid || !obsSession) return;
  const n = obsSession.tables.length;
  const narrow = isNarrow();
  const { cols, rows, pos } = roomLayout(n, narrow);
  grid.dataset.narrow = narrow ? "1" : "";
  grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  grid.style.gridTemplateRows = `repeat(${rows}, minmax(min-content, 1fr))`;
  grid.dataset.cols = cols;
  grid.dataset.rows = rows;

  grid.innerHTML = obsSession.tables.map((t, i) => {
    const sides = { top: [], right: [], bottom: [], left: [] };
    seatSides(t.seats).forEach((side, i) => sides[side].push(i + 1));
    const seatBtn = s => `<button type="button" class="seat" data-sid="${sid(t.id, s)}" data-table="${t.id}" data-seat="${s}"
        onclick="selectStudent(${t.id}, ${s})" aria-label="Table ${t.id} student ${s}">
        <span class="seat-code">–</span><span class="seat-tag">S${s}</span></button>`;
    const side = name => `<div class="side ${name}">${sides[name].map(seatBtn).join("")}</div>`;
    return `<div class="tbl-cell" data-table="${t.id}" onclick="logTAAtTable(event, ${t.id})"
      style="grid-column:${pos[i].col + 1};grid-row:${pos[i].row + 1}">
      <div class="tg">
        ${side("top")}
        <div class="table-rect" data-table="${t.id}" onclick="selectTable(${t.id})" role="button" aria-label="Table ${t.id}">
          <button type="button" class="seat-step" onclick="event.stopPropagation(); stepSeats(${t.id}, -1)" ${t.seats <= MIN_SEATS ? "disabled" : ""} aria-label="Remove a student from table ${t.id}" title="Remove a student">−</button>
          <span class="t-center"><span class="t-type ${t.type ? "t-" + t.type.toLowerCase().replace(/[^a-z]/g, "") : "t-none"}">${t.type || "no type"}</span><span class="t-num">${t.id}</span><span class="t-seats">${t.seats} student${t.seats === 1 ? "" : "s"}</span></span>
          <button type="button" class="seat-step" onclick="event.stopPropagation(); stepSeats(${t.id}, 1)" ${t.seats >= MAX_SEATS ? "disabled" : ""} aria-label="Add a student to table ${t.id}" title="Add a student">+</button>
        </div>
        ${side("bottom")}
      </div>
    </div>`;
  }).join("");

  sizeSeats();
  updateSeatStates();
  renderTAMarker();
}

/* Seat size scales with the space each table gets (bigger on a wide iPad,
   smaller when the side panel is open), never below a usable tap size. */
function sizeSeats() {
  const grid = $("room-grid");
  if (!grid) return;
  const rect = grid.getBoundingClientRect();
  if (!rect.width) return;
  const cols = parseInt(grid.dataset.cols || "2", 10);
  const rows = parseInt(grid.dataset.rows || "1", 10);
  const narrow = isNarrow();
  const cellW = rect.width / cols - 18;
  const roomH = $("room").clientHeight - 40;
  const cellH = narrow ? 999 : roomH / rows - 18;
  // Height holds seats + table (1.6 seats tall) + seats; width holds the widest
  // row of seats. The table itself stretches to ~3/4 of its area's width,
  // leaving space around it to tap for the TA's position.
  const perRow = Math.max(2, ...obsSession.tables.map(t => Math.ceil(t.seats / 2)));
  let byH = (cellH - 14) / 3.6;
  if (byH * 1.6 < 50) byH = (cellH - 14 - 50) / 2;      // the table is at least 50px tall
  const byW = (cellW * 0.82) / perRow - 8;
  const s = Math.max(32, Math.min(64, Math.floor(Math.min(byH, byW))));
  const tw = Math.max(perRow * (s + 8) + 8, Math.min(cellW * 0.74, s * 5.2));
  grid.style.setProperty("--s", s + "px");
  grid.style.setProperty("--tw", Math.floor(tw) + "px");
}

/* What each seat shows. The table whose minute is running shows only this
   minute's codes (blank each turn). Other tables show their latest turn,
   faded — unless their problem type has changed since (blank slate). */
function displayCutoff(tableId) {
  let ord = 0;
  (obsSession.typeLog || []).forEach(x => { if (x.table === tableId && !x.duringChunk) ord = Math.max(ord, x.ord); });
  (obsSession.chunks || []).forEach(c => { if (c.table === tableId) ord = Math.max(ord, c.ord); });
  return ord;
}

function lastCodeEntry(id) {
  const log = obsSession.log;
  const t = Number(id.slice(1).split("-S")[0]);
  const c = currentChunk();
  if (c && c.table === t) {
    for (let i = log.length - 1; i >= 0; i--) {
      const e = log[i];
      if (e.kind === "code" && e.sid === id && e.chunk === c.n) return e;
    }
    return null;
  }
  const cut = displayCutoff(t);
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.group < cut) break;
    if (e.kind === "code" && e.sid === id) return e;
  }
  return null;
}

/* Legacy activity rounds: there is now only one, so everything is "current". */
const curRound = () => obsSession.phaseLog.length - 1;
const inCurrentRound = e => segIndexOf(obsSession, e) === curRound();
function roundEnd(s, i) { return i + 1 < s.phaseLog.length ? s.phaseLog[i + 1].elapsedSec : s.totalSeconds; }

function hasNote(id) {
  const cut = displayCutoff(Number(id.slice(1).split("-S")[0]));
  return obsSession.log.some(e => e.kind === "note" && e.sid === id && e.group > cut);
}

function agoText(id) {
  const e = lastCodeEntry(id);
  if (!e) return "not coded yet";
  return `coded ${formatTime(currentElapsedSeconds() - e.elapsedSec)} ago`;
}

function updateSeatStates() {
  if (!obsSession) return;
  const now = currentElapsedSeconds();
  document.querySelectorAll("#room-grid .seat").forEach(el => {
    const id = el.dataset.sid;
    const e = lastCodeEntry(id);
    const c = e ? codeInfo(e.code) : null;
    el.querySelector(".seat-code").textContent = c ? c.v : "–";
    const label = obsSession.labels[id];
    el.querySelector(".seat-tag").textContent = label ? label : "S" + el.dataset.seat;
    el.style.background = c ? `var(--c${c.key}-bg)` : "";
    el.style.color = c ? `var(--c${c.key}-fg)` : "";
    el.classList.toggle("coded", !!c);
    el.classList.toggle("stale", !!c && now - e.elapsedSec >= STALE_SECONDS);
    el.classList.toggle("has-note", hasNote(id));
    el.classList.toggle("selected", !!selection && selection.type === "student" && sid(selection.table, selection.seat) === id);
    el.title = `Table ${el.dataset.table}, student ${el.dataset.seat}${label ? " (" + label + ")" : ""}` +
      (c ? ` — code ${c.v}: ${c.desc}` : " — not coded");
  });
  document.querySelectorAll("#room-grid .table-rect").forEach(el => {
    el.classList.toggle("selected", !!selection && selection.type === "table" && selection.table === +el.dataset.table);
  });
  const c = currentChunk();
  const nextId = c ? null : selectedNextTable();
  document.querySelectorAll("#room-grid .tbl-cell").forEach(el => {
    el.classList.toggle("focus", !!c && +el.dataset.table === c.table);
    el.classList.toggle("off-focus", !!c && +el.dataset.table !== c.table);
    el.classList.toggle("next-up", !c && +el.dataset.table === nextId);
  });
}

/* ── TA position ─────────────────────────────────────────────────────────
   Tap empty space in a table's area (not a student or the table itself) to
   mark the TA there; tap the front strip for the front of the room. The TA
   stays at the last marked spot until the next tap — across activity
   switches too, since it is where the TA physically is. */
/* The TA's position is marked afresh in each activity (blank slate). */
function currentTA() {
  if (!obsSession) return null;
  for (let i = obsSession.log.length - 1; i >= 0; i--) {
    const e = obsSession.log[i];
    if (e.kind === "ta" && inCurrentRound(e)) return e;
  }
  return null;
}

function logTA(entry) {
  if (!obsSession) return;
  const group = ++obsSession.seq;
  obsSession.log.push({ ...baseEntry("ta"), phase: entry.table != null ? tableType(entry.table) : "", group, ...entry });
  renderTAMarker(true);
  renderFooter();
  autosave();
}

function logTAAtTable(e, tableId) {
  if (e.target.closest(".seat, .table-rect")) return;
  const r = e.currentTarget.getBoundingClientRect();
  const clamp = v => Math.max(0.03, Math.min(0.97, v));
  logTA({ place: `Table ${tableId}`, table: tableId,
          u: clamp((e.clientX - r.left) / r.width), v: clamp((e.clientY - r.top) / r.height) });
}

function logTAFront(e) {
  const r = e.currentTarget.getBoundingClientRect();
  logTA({ place: "Front of room", table: null, u: Math.max(0.03, Math.min(0.97, (e.clientX - r.left) / r.width)), v: 0.5 });
}

function renderTAMarker(flash) {
  document.querySelectorAll(".ta-marker, .ta-dot").forEach(m => m.remove());
  // Earlier TA positions stay on the map as small numbered dots
  const marks = obsSession ? obsSession.log.filter(e => e.kind === "ta" && inCurrentRound(e)) : [];
  marks.slice(0, -1).forEach((m, i) => {
    const h = m.table == null ? $("front-strip") : document.querySelector(`.tbl-cell[data-table="${m.table}"]`);
    if (!h) return;
    const d = document.createElement("div");
    d.className = "ta-dot";
    d.textContent = i + 1;
    d.style.left = (m.u * 100) + "%";
    d.style.top = (m.v * 100) + "%";
    h.appendChild(d);
  });
  document.querySelectorAll(".tbl-cell.ta-here, .map-front-label.ta-here").forEach(c => c.classList.remove("ta-here"));
  const ta = currentTA();
  const st = $("ta-status");
  if (!ta) { if (st) st.textContent = curRound() > 0 ? "TA position not marked yet in this activity" : "TA position not marked yet"; return; }
  const host = ta.table == null ? $("front-strip") : document.querySelector(`.tbl-cell[data-table="${ta.table}"]`);
  if (st) st.textContent = `TA: ${ta.place} since ${formatTime(ta.elapsedSec)}`;
  if (!host) return;
  host.classList.add("ta-here");
  const m = document.createElement("div");
  m.className = "ta-marker" + (flash ? " flash" : "");
  m.textContent = "TA";
  m.title = `TA position ${marks.length}`;
  m.style.left = (ta.u * 100) + "%";
  m.style.top = (ta.v * 100) + "%";
  host.appendChild(m);
}

/* ── Selection + side panel ─────────────────────────────────────────────── */
function selectStudent(t, s) {
  selection = { type: "student", table: t, seat: s };
  openPanel();
}

function selectTable(t) {
  selection = { type: "table", table: t };
  openPanel();
}

function openPanel() {
  const body = $("obs-body");
  const wasOpen = body.classList.contains("panel-open");
  body.classList.add("panel-open");
  renderPanel();
  updateSeatStates();
  if (!wasOpen) setTimeout(sizeSeats, 200);   // after the grid transition
}

function closePanel() {
  selection = null;
  $("obs-body").classList.remove("panel-open");
  renderPanel();
  updateSeatStates();
  setTimeout(sizeSeats, 200);
}

function codeButtons(currentCode, onclickFn) {
  return `<div class="code-list">${CODES.map(c => `
    <button type="button" class="code-btn ${currentCode === c.v ? "current" : ""}" onclick="${onclickFn}(${c.v})">
      <span class="sw" style="${swatchStyle(c)}">${c.v}</span>
      <span class="cd">${escapeHTML(c.desc)}</span>
    </button>`).join("")}</div>`;
}

function badge(code) {
  const c = codeInfo(code);
  return `<span class="badge" style="${swatchStyle(c)}">${c.v}</span>`;
}

function historyRows(entries) {
  if (!entries.length) return `<div class="h-empty">Nothing logged yet</div>`;
  return entries.slice().reverse().map(e => `
    <div class="h-row">
      <span class="h-time">${formatTime(e.elapsedSec)}</span>
      <span class="h-body">${e.kind === "code"
        ? `${badge(e.code)}${escapeHTML(codeInfo(e.code).desc)}${e.viaTable ? " <span class='h-phase'>(whole table)</span>" : ""}`
        : `📝 ${escapeHTML(e.text)}`}
        ${e.phase ? `<div class="h-phase">${escapeHTML(e.phase)}</div>` : ""}</span>
    </div>`).join("");
}

/* Shown in the panel when the selected table isn't the one whose minute is
   running (or no minute is running), since those codes won't count. */
function turnNotice(tableId) {
  const c = currentChunk();
  if (c && c.table === tableId) return "";
  const msg = c
    ? `It's <b>Table ${c.table}</b>'s minute. Codes for Table ${tableId} are saved but won't count toward the 1-minute samples.`
    : `No minute is running. Codes for Table ${tableId} are saved but only count during a table's 1-minute turn.`;
  const btn = tableType(tableId) ? `Start Table ${tableId}'s minute now` : `Choose Table ${tableId}'s problem type to start its minute`;
  return `<div class="rot-warn">${msg}<button type="button" class="rot-warn-btn" onclick="jumpToTable(${tableId})">${btn}</button></div>`;
}

function renderPanel() {
  const panel = $("side-panel");
  if (!obsSession || !selection) { panel.innerHTML = ""; return; }

  if (selection.type === "student") {
    const { table, seat } = selection;
    const id = sid(table, seat);
    const last = lastCodeEntry(id);
    const all = obsSession.log.filter(e => e.sid === id);
    const entries = all.filter(e => e.phase === tableType(table)), earlierN = all.length - entries.length;
    panel.innerHTML = `<div class="panel-inner">
      <div class="p-head">
        <div>
          <div class="p-eyebrow">TABLE ${table} · SEAT ${seat}${tableType(table) ? " · " + escapeHTML(tableType(table).toUpperCase()) : ""}</div>
          <h2>Student ${escapeHTML(id)}</h2>
        </div>
        <button class="p-close" onclick="closePanel()" aria-label="Close">×</button>
      </div>

      <div class="p-status">
        ${last ? `Current: ${badge(last.code)}` : "Current: <strong>not coded</strong>"}
        <span class="ago" id="p-ago">${agoText(id)}</span>
      </div>
      ${turnNotice(table)}

      <div>
        <div class="p-section-title">Interaction code</div>
        ${codeButtons(last ? last.code : null, "codeSelected")}
        <button class="link-row" onclick="selectTable(${table})">Code everyone at Table ${table} instead →</button>
      </div>

      <div class="p-field">
        <div class="p-section-title">Qualitative notes</div>
        <textarea id="p-note" class="note-box" placeholder="What is this student doing or saying? Who are they talking to?"></textarea>
        <div class="note-actions">
          <button class="btn-primary" onclick="saveNote()">Save note</button>
          <span class="note-hint">Timestamped · ⌘/Ctrl + Enter</span>
        </div>
      </div>

      <div class="p-field">
        <label class="p-section-title" for="p-label">Student label (optional)</label>
        <input id="p-label" class="form-input" maxlength="12" placeholder="e.g. initials or a description" value="${escapeHTML(obsSession.labels[id] || "")}" oninput="setLabel(this.value)">
      </div>

      <div>
        <div class="p-section-title">History for this student${tableType(table) ? ` (${escapeHTML(tableType(table))})` : ""}</div>
        <div class="history">${historyRows(entries)}</div>
        ${earlierN ? `<div class="h-earlier">${earlierN} entr${earlierN === 1 ? "y" : "ies"} under other problem types ${earlierN === 1 ? "is" : "are"} saved in the export.</div>` : ""}
      </div>
    </div>`;
  } else {
    const t = obsSession.tables.find(x => x.id === selection.table);
    if (!t) { selection = null; panel.innerHTML = ""; $("obs-body").classList.remove("panel-open"); return; }
    const tableKey = `T${t.id}`;
    const entries = obsSession.log.filter(e => e.table === t.id && (e.sid === tableKey || e.viaTable) && e.phase === tableType(t.id))
      .filter((e, i, arr) => e.kind === "note" || arr.findIndex(x => x.group === e.group) === i);  // one row per whole-table code
    panel.innerHTML = `<div class="panel-inner">
      <div class="p-head">
        <div>
          <div class="p-eyebrow">TABLE ${t.id}</div>
          <h2>Whole table</h2>
        </div>
        <button class="p-close" onclick="closePanel()" aria-label="Close">×</button>
      </div>

      <div>
        <div class="p-section-title">Students at this table</div>
        <div class="seat-stepper-row">
          <div class="stepper small">
            <button type="button" class="stepper-btn" onclick="stepSeats(${t.id}, -1)" aria-label="Remove a seat">−</button>
            <input type="number" class="stepper-input" value="${t.seats}" readonly>
            <button type="button" class="stepper-btn" onclick="stepSeats(${t.id}, 1)" aria-label="Add a seat">+</button>
          </div>
          <span class="field-hint" style="margin:0">Default is ${DEFAULT_SEATS}. Removing a seat keeps anything already logged for it.</span>
        </div>
      </div>

      <div>
        <div class="p-section-title">Problem type at this table</div>
        <div class="panel-types">${typeButtons(t.id)}</div>
      </div>

      ${turnNotice(t.id)}

      <div>
        <div class="p-section-title">Code all ${t.seats} students</div>
        ${codeButtons(null, "codeTable")}
      </div>

      <div class="p-field">
        <div class="p-section-title">Table notes</div>
        <textarea id="p-note" class="note-box" placeholder="What is the group doing together?"></textarea>
        <div class="note-actions">
          <button class="btn-primary" onclick="saveNote()">Save note</button>
          <span class="note-hint">Timestamped · ⌘/Ctrl + Enter</span>
        </div>
      </div>

      <div>
        <div class="p-section-title">Table history${tableType(t.id) ? ` (${escapeHTML(tableType(t.id))})` : ""}</div>
        <div class="history">${historyRows(entries)}</div>
      </div>
    </div>`;
  }

  const note = $("p-note");
  if (note) note.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveNote(); }
  });
}

/* ── Logging ────────────────────────────────────────────────────────────── */
function baseEntry(kind) {
  return {
    kind,
    elapsedSec: currentElapsedSeconds(),
    wallTime: new Date().toLocaleTimeString(),
    phase: "",                                // set to the table's problem type by the caller
    pseg: obsSession.phaseLog.length - 1,     // legacy activity round (always 0 now)
    chunk: currentChunk() ? currentChunk().n : null,   // which 1-minute rotation chunk
  };
}

function codeSelected(code) {
  if (!obsSession || !selection || selection.type !== "student") return;
  const { table, seat } = selection;
  const group = ++obsSession.seq;
  obsSession.log.push({ ...baseEntry("code"), phase: tableType(table), group, sid: sid(table, seat), table, seat, code });
  afterLog([sid(table, seat)]);
}

function codeTable(code) {
  if (!obsSession || !selection || selection.type !== "table") return;
  const t = obsSession.tables.find(x => x.id === selection.table);
  const group = ++obsSession.seq;
  const ids = [];
  for (let s = 1; s <= t.seats; s++) {
    obsSession.log.push({ ...baseEntry("code"), phase: tableType(t.id), group, sid: sid(t.id, s), table: t.id, seat: s, code, viaTable: true });
    ids.push(sid(t.id, s));
  }
  afterLog(ids);
}

function saveNote() {
  const box = $("p-note");
  if (!obsSession || !selection || !box) return;
  const text = box.value.trim();
  if (!text) { box.focus(); return; }
  const group = ++obsSession.seq;
  if (selection.type === "student") {
    const { table, seat } = selection;
    obsSession.log.push({ ...baseEntry("note"), phase: tableType(table), group, sid: sid(table, seat), table, seat, text });
    afterLog([sid(table, seat)]);
  } else {
    obsSession.log.push({ ...baseEntry("note"), phase: tableType(selection.table), group, sid: `T${selection.table}`, table: selection.table, seat: "", text });
    afterLog([]);
  }
}

function setLabel(val) {
  if (!obsSession || !selection || selection.type !== "student") return;
  const id = sid(selection.table, selection.seat);
  const v = val.trim();
  if (v) obsSession.labels[id] = v; else delete obsSession.labels[id];
  updateSeatStates();
  autosave();
}

function afterLog(flashIds) {
  // Keep any half-typed note when re-rendering after a code tap
  const draft = $("p-note") ? $("p-note").value : "";
  renderPanel();
  if ($("p-note") && draft && obsSession.log[obsSession.log.length - 1].kind === "code") $("p-note").value = draft;
  updateSeatStates();
  renderFooter();
  flashIds.forEach(id => {
    const el = document.querySelector(`.seat[data-sid="${id}"]`);
    if (el) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  });
  autosave();
}

/* Undo the newest entry of the CURRENT activity (never reaches back into an earlier one). */
function undoLast() {
  if (!obsSession) return;
  const last = obsSession.log.filter(inCurrentRound).pop();
  if (last) deleteGroup(last.group);
}

/* Remove one logged item (a code, a whole-table code, a note or a TA move). */
function deleteGroup(g) {
  if (!obsSession) return;
  const before = obsSession.log.length;
  const startIdx = roundStart();
  const removedBeforeStart = obsSession.log.slice(0, startIdx).filter(e => e.group === g).length;
  obsSession.log = obsSession.log.filter(e => e.group !== g);
  if (obsSession.log.length === before) return;
  obsSession.phaseStartIdx = Math.max(0, startIdx - removedBeforeStart);
  renderPanel();
  updateSeatStates();
  renderTAMarker();
  renderFooter();
  autosave();
}

function renderFooter() {
  if (!obsSession) return;
  const now = obsSession.log.filter(inCurrentRound);
  const codes = new Set(now.filter(e => e.kind === "code").map(e => e.group)).size;
  const notes = now.filter(e => e.kind === "note").length;
  const moves = now.filter(e => e.kind === "ta").length;
  $("log-summary").textContent = `${codes} code${codes === 1 ? "" : "s"} · ${notes} note${notes === 1 ? "" : "s"} · ${moves} TA position${moves === 1 ? "" : "s"}`;
  renderLiveLog();
}

/* ── Live log ─────────────────────────────────────────────────────────────
   Newest first. Every row has × to undo just that item; activity switches
   are shown as dividers. */
const PHASE_SHORT = { "Structured": "Struct.", "Open-ended": "Open", "Other": "Other", "": "" };
const LOG_ROWS = 250;

function logRowDesc(e, n) {
  if (e.kind === "ta") return `<span class="ta-tag">TA</span>moved to <b>${escapeHTML(e.place)}</b>`;
  const who = e.seat ? `${escapeHTML(e.sid)}${obsSession.labels[e.sid] ? " (" + escapeHTML(obsSession.labels[e.sid]) + ")" : ""}` : `Table ${e.table}`;
  if (e.kind === "note") return `📝 <b>${who}</b>: ${escapeHTML(e.text)}`;
  const c = codeInfo(e.code);
  return e.viaTable
    ? `<b>Table ${e.table}</b> (all ${n}) → ${badge(e.code)} ${escapeHTML(c.desc)}`
    : `<b>${who}</b> → ${badge(e.code)} ${escapeHTML(c.desc)}`;
}

function renderLiveLog() {
  const body = $("ll-body");
  if (!body || !obsSession) return;
  // Entries, activity switches and rotation chunks share one sequence counter
  // (group / ord), so sorting by it gives the exact order they happened in.
  const items = [];
  const seen = new Set();
  obsSession.log.forEach(e => { if (!seen.has(e.group)) { seen.add(e.group); items.push({ ord: e.group, e }); } });
  obsSession.phaseLog.forEach((p, i) => {
    if (i === 0) return;
    let ord = p.ord;
    if (ord == null) {       // saved before activity switches had an ord
      const first = obsSession.log.find(e => e.pseg != null && e.pseg >= i);
      ord = first ? first.group - 0.5 : Infinity;
    }
    items.push({ ord, phase: p });
  });
  (obsSession.chunks || []).forEach(c => items.push({ ord: c.ord, chunk: c }));
  (obsSession.typeLog || []).forEach(x => items.push({ ord: x.ord, typeChange: x }));
  items.sort((a, b) => a.ord - b.ord);
  // Blank slate per activity: hide earlier activities unless asked to show them
  const cur = curRound();
  const roundOfItem = it => it.e ? segIndexOf(obsSession, it.e) : it.chunk ? it.chunk.pseg : it.typeChange ? cur : obsSession.phaseLog.indexOf(it.phase);
  const earlier = items.filter(it => it.e && roundOfItem(it) < cur).length;
  const visible = showEarlierLog ? items : items.filter(it => roundOfItem(it) >= cur);
  items.length = 0; items.push(...visible);

  const rows = items.map(it => {
    if (it.phase) return `<div class="ll-row phase">${formatTime(it.phase.elapsedSec)} · Activity: ${escapeHTML(it.phase.phase || "none")}</div>`;
    if (it.chunk) return `<div class="ll-row chunk">${formatTime(it.chunk.start)} · Observing Table ${it.chunk.table}${it.chunk.phase ? " · " + escapeHTML(it.chunk.phase) : ""} (1-minute turn${it.chunk.end != null ? `, ${formatTime(it.chunk.end - it.chunk.start)}` : ""})</div>`;
    if (it.typeChange) return `<div class="ll-row phase">${formatTime(it.typeChange.elapsedSec)} · Table ${it.typeChange.table} problem type: ${escapeHTML(it.typeChange.type)}</div>`;
    const e = it.e;
    const n = e.viaTable ? obsSession.log.filter(x => x.group === e.group).length : 0;
    return `<div class="ll-row" data-group="${e.group}">
      <span class="ll-time">${formatTime(e.elapsedSec)}</span>
      <span class="ll-ph">${escapeHTML(PHASE_SHORT[e.phase] != null ? PHASE_SHORT[e.phase] : e.phase)}</span>
      <span class="ll-desc">${logRowDesc(e, n)}</span>
      <button type="button" class="ll-x" onclick="deleteGroup(${e.group})" title="Undo this" aria-label="Undo this entry">×</button>
    </div>`;
  });
  if (earlier) rows.unshift(`<button type="button" class="ll-row ll-earlier" onclick="toggleEarlierLog()">${showEarlierLog
    ? "Hide entries from earlier activities"
    : `Show ${earlier} entr${earlier === 1 ? "y" : "ies"} from earlier activities (all are in the export)`}</button>`);
  if (!rows.length || (rows.length === 1 && earlier)) {
    if (earlier) { body.innerHTML = rows[0]; return; }
    body.innerHTML = `<div class="ll-empty">Nothing logged yet. In the bar above the map, pick a table, choose its problem type and tap Start 1 minute, then code the students at the highlighted table: tap a student to code them, or tap the table to code everyone at it. When the minute is up the tool waits until you start the next table. Tap the empty space around a table (or the front strip) to mark where the TA is. Every entry appears here; tap × to undo it.</div>`;
    return;
  }
  const shown = rows.reverse().slice(0, LOG_ROWS);
  body.innerHTML = shown.join("").replace('class="ll-row"', 'class="ll-row newest"');
  body.scrollTop = 0;
}

let showEarlierLog = false;
function toggleEarlierLog() {
  showEarlierLog = !showEarlierLog;
  renderLiveLog();
}

function toggleLog() {
  const ll = $("live-log");
  const collapsed = ll.classList.toggle("collapsed");
  $("ll-toggle").textContent = (collapsed ? "▸" : "▾") + " Live log";
  $("ll-toggle").setAttribute("aria-expanded", String(!collapsed));
  try { localStorage.setItem("phys211coding_log_collapsed", collapsed ? "1" : ""); } catch (e) { /* ignore */ }
  sizeSeats();
}


/* ── Analysis for export ─────────────────────────────────────────────────
   Time sampling: each finished 1-minute chunk gives ONE observation per
   student at that chunk's table — the last code given to them during that
   minute, or "not coded". Every count below is a number of these
   student observations. */
function segIndexOf(s, e) {
  if (e.pseg != null) return e.pseg;
  let k = 0;
  s.phaseLog.forEach((p, i) => { if (p.elapsedSec <= e.elapsedSec) k = i; });
  return k;
}

function phaseSegments(s) {
  const out = [];
  const pl = s.phaseLog.slice().sort((a, b) => a.elapsedSec - b.elapsedSec);
  pl.forEach((p, i) => {
    const end = i < pl.length - 1 ? pl[i + 1].elapsedSec : s.totalSeconds;
    if (end > p.elapsedSec) out.push({ start: p.elapsedSec, end, phase: p.phase });
  });
  return out;
}

function allStudentIds(s) {
  const ids = new Set();
  s.tables.forEach(t => { for (let k = 1; k <= t.seats; k++) ids.add(sid(t.id, k)); });
  s.log.forEach(e => { if (e.seat !== "" && e.seat != null) ids.add(e.sid); });
  return Array.from(ids).sort((a, b) => {
    const [ta, sa] = a.slice(1).split("-S").map(Number), [tb, sb] = b.slice(1).split("-S").map(Number);
    return ta - tb || sa - sb;
  });
}

function emptyBuckets() {
  const o = {};
  CODES.forEach(c => (o[c.key] = 0));
  return o;
}

/* One row per student per finished chunk: { chunk, sid, table, seat, phase,
   entry, code, key, taPlace, taHere } — code/key null if not coded that
   minute; taHere = was the TA's last marked position (when coded) in this
   table's area (null if the TA hadn't been marked yet). */
function chunkSamples(s) {
  const taAt = new Map();
  let ta = null;
  s.log.forEach(e => {
    if (e.kind === "ta") ta = e;
    else if (e.kind === "code") taAt.set(e, ta && segIndexOf(s, ta) === segIndexOf(s, e) ? ta : null);   // TA marks don't carry across activities
  });
  const out = [];
  (s.chunks || []).forEach(c => {
    if (c.end == null) return;
    const codes = s.log.filter(e => e.kind === "code" && e.chunk === c.n && e.table === c.table);
    for (let k = 1; k <= c.seats; k++) {
      const mine = codes.filter(e => e.seat === k);
      const e = mine.length ? mine[mine.length - 1] : null;
      const t = e ? taAt.get(e) : null;
      out.push({
        chunk: c, sid: sid(c.table, k), table: c.table, seat: k, phase: c.phase || "(not set)",
        entry: e, code: e ? e.code : null, key: e ? codeInfo(e.code).key : null,
        taPlace: e ? (t ? t.place : "(not marked yet)") : "", taHere: e && t ? t.table === c.table : null,
      });
    }
  });
  return out;
}

function analyze(s) {
  const byStudent = {};
  const byPhase = {};
  const byTable = {};
  const byStudentPhase = {};          // id -> phase -> counts
  const byTablePhase = {};            // table -> phase -> counts
  const ensurePhase = p => (byPhase[p] = byPhase[p] || emptyBuckets());
  const ensureTable = t => (byTable[t] = byTable[t] || emptyBuckets());
  const ensure2 = (obj, a, b) => ((obj[a] = obj[a] || {}), (obj[a][b] = obj[a][b] || emptyBuckets()));

  const samples = chunkSamples(s);
  const perStudent = {};              // id -> { obs: counts, chunks: n observed }
  samples.forEach(x => {
    const ps = (perStudent[x.sid] = perStudent[x.sid] || { obs: emptyBuckets(), chunks: 0 });
    ps.chunks++;
    if (!x.key) return;
    ps.obs[x.key]++;
    ensureTable(x.table)[x.key]++;
    ensurePhase(x.phase)[x.key]++;
    ensure2(byStudentPhase, x.sid, x.phase)[x.key]++;
    ensure2(byTablePhase, x.table, x.phase)[x.key]++;
  });

  allStudentIds(s).forEach(id => {
    const [t, k] = id.slice(1).split("-S").map(Number);
    const codes = s.log.filter(e => e.kind === "code" && e.sid === id);
    const table = s.tables.find(x => x.id === t);
    const ps = perStudent[id] || { obs: emptyBuckets(), chunks: 0 };
    byStudent[id] = {
      table: t, seat: k,
      label: s.labels[id] || "",
      removed: !table || k > table.seats,
      nCodes: codes.length,
      firstCodedSec: codes.length ? codes[0].elapsedSec : "",
      lastCode: codes.length ? codes[codes.length - 1].code : "",
      chunks: ps.chunks,
      obs: ps.obs,
      notes: s.log.filter(e => e.kind === "note" && e.sid === id).map(e => `[${formatTime(e.elapsedSec)}] ${e.text}`).join(" | "),
    };
  });
  return { byStudent, byPhase, byTable, byStudentPhase, byTablePhase, samples };
}

/* Finished chunks of an activity (optionally at one table). */
const chunksIn = (s, phase, tableId) => (s.chunks || []).filter(c => c.end != null && (c.phase || "(not set)") === phase && (tableId == null || c.table === tableId));

const pct = (part, whole) => (whole ? (100 * part / whole) : 0);
const COLLAB_KEYS = ["4", "5"];                  // working collaboratively
const INTERACT_KEYS = ["35", "4", "5"];          // any on-task peer interaction (off-topic talk is code 1)
const OFFTOPIC_KEYS = ["1"];
const sumKeys = (secs, keys) => keys.reduce((a, k) => a + secs[k], 0);

/* Mean code over a set of observations (counts per code). */
function weightedMean(counts) {
  let tot = 0, sum = 0;
  CODES.forEach(c => { tot += counts[c.key]; sum += counts[c.key] * c.v; });
  return tot ? (sum / tot).toFixed(2) : "";
}
const totalCount = counts => CODES.reduce((a, c) => a + counts[c.key], 0);


/* ── TA presence analysis ────────────────────────────────────────────────
   The TA is "at" a table while their last marked position is in that
   table's area. TA time/visits are measured in seconds; for every coded
   student observation we ask: was the TA at this student's table when the
   code was given? Codes before the first TA mark are left out. */
function taSegments(s) {
  const marks = s.log.filter(e => e.kind === "ta");
  return marks.map((m, i) => ({
    start: m.elapsedSec,
    // a mark lasts until the next one, but never past the end of its activity
    end: Math.min(i < marks.length - 1 ? marks[i + 1].elapsedSec : s.totalSeconds, roundEnd(s, segIndexOf(s, m))),
    table: m.table, place: m.place, u: m.u, v: m.v, phase: m.phase || "(not set)",
  })).filter(x => x.end > x.start);
}

/* Each table's problem type over time: [{ start, end, type }]. */
function typeSegments(s, tableId) {
  const changes = (s.typeLog || []).filter(x => x.table === tableId).sort((a, b) => a.elapsedSec - b.elapsedSec || a.ord - b.ord);
  const out = [];
  let cur = { start: 0, type: "" };
  changes.forEach(x => {
    if (x.elapsedSec > cur.start) out.push({ start: cur.start, end: x.elapsedSec, type: cur.type });
    cur = { start: x.elapsedSec, type: x.type };
  });
  if (s.totalSeconds > cur.start) out.push({ start: cur.start, end: s.totalSeconds, type: cur.type });
  return out;
}

/* TA time at a table is filed under that TABLE's problem type at the time;
   time at the front of the room isn't tied to a table, so it's kept apart. */
function analyzeTA(s) {
  const segs = taSegments(s);
  const pres = {};        // type -> { with, without } counts
  const presTable = {};   // table -> type -> { with, without }
  const time = {};        // type -> { [tableId] } seconds
  const visits = {};      // type -> { [tableId] } count of arrivals
  const points = {};      // type -> [{ table, u, v, dur, start }]
  const phaseMarked = {}; // type -> TA seconds at tables of that type
  const front = { sec: 0, visits: 0, points: [] };
  const get = (o, ...ks) => ks.reduce((acc, k, i) => (acc[k] = acc[k] || (i === ks.length - 1 ? emptyBuckets() : {})), o);

  segs.forEach(g => {
    if (g.table == null) {
      front.sec += g.end - g.start;
      front.points.push({ table: null, u: g.u, v: g.v, dur: g.end - g.start, start: g.start });
      return;
    }
    typeSegments(s, g.table).forEach(ts => {
      const ov = Math.min(g.end, ts.end) - Math.max(g.start, ts.start);
      if (ov <= 0) return;
      const ph = ts.type || "(not set)";
      (time[ph] = time[ph] || {})[g.table] = (time[ph][g.table] || 0) + ov;
      phaseMarked[ph] = (phaseMarked[ph] || 0) + ov;
      (points[ph] = points[ph] || []).push({ table: g.table, u: g.u, v: g.v, dur: ov, start: Math.max(g.start, ts.start) });
    });
  });

  let prevKey;
  s.log.filter(e => e.kind === "ta").forEach(m => {
    const k = m.table == null ? "front" : m.table;
    if (k !== prevKey) {
      if (m.table == null) front.visits++;
      else {
        const ts = typeSegments(s, m.table).find(x => m.elapsedSec >= x.start && m.elapsedSec < x.end);
        const ph = (ts && ts.type) || "(not set)";
        (visits[ph] = visits[ph] || {})[k] = (visits[ph][k] || 0) + 1;
      }
    }
    prevKey = k;
  });

  // Each coded student observation: was the TA at that table when it was coded?
  chunkSamples(s).forEach(x => {
    if (!x.key || x.taHere == null) return;
    const w = x.taHere ? "with" : "without";
    get(pres, x.phase, w)[x.key]++;
    get(presTable, x.table, x.phase, w)[x.key]++;
  });

  return { segs, pres, presTable, time, visits, points, phaseMarked, front, marks: s.log.filter(e => e.kind === "ta").length };
}

/* ── Participation report (PDF) ──────────────────────────────────────────
   One page-flow PDF, built in the browser with the bundled jsPDF library:
   a whole-class summary, then every table with one bar for Structured and
   one for Open-ended activities. Codes are ordinal, so they share one
   light→dark blue ramp (darker = more interaction). The numbers behind it
   are in the CSV. */
const MAIN_PHASES = ["Structured", "Open-ended", "Other"];

const PDF_CODE_COLORS = {
  "0":  { bg: "#E4E1DA", fg: "#4A4740" },
  "1":  { bg: "#F2D9A4", fg: "#6B4A00" },   // off-topic: amber, apart from the on-task blue ramp
  "2":  { bg: "#DCE8F6", fg: "#13294B" },
  "3":  { bg: "#ADC9EA", fg: "#13294B" },
  "35": { bg: "#6E9FD6", fg: "#FFFFFF" },
  "4":  { bg: "#2F6BB2", fg: "#FFFFFF" },
  "5":  { bg: "#13294B", fg: "#FFFFFF" },
};
const PDF_INK = "#1A1814", PDF_INK2 = "#4A4740", PDF_INK3 = "#77746B", PDF_LINE = "#E2DED5", PDF_ACCENT = "#E84A00";

/* Red (start of class) → orange → yellow → green → blue (end of observation). */
function timeColor(t) {
  const h = Math.max(0, Math.min(1, t)) * 235, sat = 0.85, l = 0.48;
  const k = n => (n + h / 30) % 12, a = sat * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const hex = v => Math.round(v * 255).toString(16).padStart(2, "0");
  return "#" + hex(f(0)) + hex(f(8)) + hex(f(4));
}

function phaseStats(b) {
  if (!b) return null;
  const tot = totalCount(b);
  if (!tot) return null;
  return {
    b, tot,
    mean: Number(weightedMean(b)),
    collab: pct(sumKeys(b, COLLAB_KEYS), tot),
    offtopic: pct(sumKeys(b, OFFTOPIC_KEYS), tot),
    interact: pct(sumKeys(b, INTERACT_KEYS), tot),
    none: pct(b["0"], tot),
  };
}

function signed(x, digits) {
  const r = Number(x.toFixed(digits));
  return (r > 0 ? "+" : r < 0 ? "-" : "±") + Math.abs(r).toFixed(digits);
}

function buildParticipationPDF(s) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = 612, H = 792, M = 48, CW = W - 2 * M;
  const A = analyze(s);
  let y = M;

  const font = (size, style = "normal", color = PDF_INK) => { doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(color); };
  const line = (x1, y1, x2, y2, color = PDF_LINE, w = 0.75) => { doc.setDrawColor(color); doc.setLineWidth(w); doc.line(x1, y1, x2, y2); };
  const ensure = need => {
    if (y + need <= H - M - 18) return false;
    doc.addPage(); y = M;
    font(8, "bold", PDF_INK3);
    doc.text(`${s.section} · ${s.ta} · ${formatDateNice(s.date)} — participation report (continued)`, M, y);
    y += 22;
    return true;
  };

  // A 100% stacked bar: one segment per code, 1.5pt gaps, % label when there's room.
  const bar = (x, by, w, h, st) => {
    if (!st) {
      doc.setDrawColor(PDF_LINE); doc.setLineWidth(0.75); doc.setLineDashPattern([2, 2], 0);
      doc.roundedRect(x, by, w, h, 3, 3, "S");
      doc.setLineDashPattern([], 0);
      font(8, "italic", PDF_INK3);
      doc.text("not observed", x + 8, by + h / 2 + 3);
      return;
    }
    const present = CODES.filter(c => st.b[c.key] > 0);
    const gap = 1.5;
    const usable = w - gap * (present.length - 1);
    let cx = x;
    present.forEach(c => {
      const p = st.b[c.key] / st.tot;
      const sw = Math.max(1.5, usable * p);
      const col = PDF_CODE_COLORS[c.key];
      doc.setFillColor(col.bg);
      doc.roundedRect(cx, by, sw, h, 2.5, 2.5, "F");
      if (sw >= 26) {
        font(7.5, "bold", col.fg);
        doc.text(`${Math.round(p * 100)}%`, cx + sw / 2, by + h / 2 + 2.7, { align: "center" });
      }
      cx += sw + gap;
    });
  };

  /* ── Header ── */
  font(8, "bold", PDF_ACCENT);
  doc.text("PHYS 211 · GROUP-WORK PARTICIPATION", M, y);
  y += 22;
  font(19, "bold");
  doc.text("Participation by problem type and table", M, y);
  y += 17;
  font(9.5, "normal", PDF_INK2);
  const totalStudents = s.tables.reduce((a, t) => a + t.seats, 0);
  doc.text(`${s.section} · TA ${s.ta} · ${formatDateNice(s.date)} · Observer ${s.netid} · ${formatTime(s.totalSeconds)} observed · ${totalStudents} students at ${s.tableCount} tables`, M, y);
  y += 10;

  const cls = {};
  MAIN_PHASES.forEach(p => (cls[p] = phaseStats(A.byPhase[p])));
  const notes = [];
  if (!MAIN_PHASES.some(p => cls[p])) notes.push("No codes were recorded during a table's 1-minute turn. Start a table's minute in the bar above the map while coding.");
  else MAIN_PHASES.forEach(p => { if (!cls[p]) notes.push(`No codes were recorded on ${p} problems, so those bars are empty.`); });
  const others = Object.keys(A.byPhase).filter(p => !MAIN_PHASES.includes(p));
  if (others.length) notes.push(`Codes recorded under ${others.map(p => `"${p}"`).join(" or ")} are left out of this report (they are in the CSV).`);
  if (notes.length) {
    y += 8;
    font(8.5, "normal", "#8A3200");
    notes.forEach(n => { const ls = doc.splitTextToSize("• " + n, CW); doc.text(ls, M, y + 8); y += ls.length * 11; });
  }
  y += 18;

  /* ── Whole class ── */
  font(12.5, "bold");
  doc.text("Whole class", M, y);
  y += 16;
  const colS = M + 268, colO = M + 340, colX = M + 412, colD = M + CW;
  const cols = [["Structured", colS], ["Open-ended", colO], ["Other", colX]];
  font(8.5, "bold", PDF_INK3);
  cols.forEach(([p, x]) => doc.text(p, x, y, { align: "right" }));
  doc.text("Open vs. Struct.", colD, y, { align: "right" });
  y += 6;
  line(M, y, M + CW, y);
  const minutesIn = p => chunksIn(s, p).reduce((a, c) => a + c.end - c.start, 0);
  const kpis = [
    ["Mean code (0–5)", st => st.mean.toFixed(2), (a, b) => signed(b.mean - a.mean, 2)],
    ["Working collaboratively (codes 4–5)", st => `${Math.round(st.collab)}%`, (a, b) => `${signed(b.collab - a.collab, 0)} pts`],
    ["Any on-task peer interaction (codes 3.5–5)", st => `${Math.round(st.interact)}%`, (a, b) => `${signed(b.interact - a.interact, 0)} pts`],
    ["Off-topic interaction (code 1)", st => `${Math.round(st.offtopic)}%`, (a, b) => `${signed(b.offtopic - a.offtopic, 0)} pts`],
    ["No work (code 0)", st => `${Math.round(st.none)}%`, (a, b) => `${signed(b.none - a.none, 0)} pts`],
  ];
  kpis.forEach(([label, val, diff]) => {
    y += 16;
    font(9.5, "normal", PDF_INK2); doc.text(label, M, y);
    font(10.5, "bold");
    cols.forEach(([p, x]) => doc.text(cls[p] ? val(cls[p]) : "—", x, y, { align: "right" }));
    font(9.5, "normal", PDF_INK2);
    doc.text(cls.Structured && cls["Open-ended"] ? diff(cls.Structured, cls["Open-ended"]) : "—", colD, y, { align: "right" });
    y += 6; line(M, y, M + CW, y);
  });
  y += 16;
  font(9.5, "normal", PDF_INK2); doc.text("Time observed (1-minute turns)", M, y);
  font(10.5, "bold");
  cols.forEach(([p, x]) => doc.text(formatTime(minutesIn(p)), x, y, { align: "right" }));
  y += 6; line(M, y, M + CW, y);
  [["1-minute table chunks observed", p => String(chunksIn(s, p).length)],
   ["Student observations coded", p => String(cls[p] ? cls[p].tot : 0)]].forEach(([label, val]) => {
    y += 16;
    font(9.5, "normal", PDF_INK2); doc.text(label, M, y);
    font(10.5, "bold");
    cols.forEach(([p, x]) => doc.text(val(p), x, y, { align: "right" }));
    y += 6; line(M, y, M + CW, y);
  });

  /* ── Legend ── */
  y += 24;
  font(9, "bold", PDF_INK3);
  doc.text("CODING SCHEME  ·  bars = share of student observations (1 per student per 1-minute chunk)", M, y);
  y += 8;
  const legCol = CW / 2;
  CODES.forEach((c, i) => {
    const lx = M + (i % 2) * legCol, ly = y + Math.floor(i / 2) * 24 + 6;
    const col = PDF_CODE_COLORS[c.key];
    doc.setFillColor(col.bg);
    doc.roundedRect(lx, ly, 22, 12, 2.5, 2.5, "F");
    font(7.5, "bold", col.fg); doc.text(String(c.v), lx + 11, ly + 8.6, { align: "center" });
    font(8.5, "normal", PDF_INK2); doc.text(doc.splitTextToSize(c.desc, legCol - 40), lx + 28, ly + 9, { lineHeightFactor: 1.15 });
  });
  y += Math.ceil(CODES.length / 2) * 24 + 22;

  /* ── Rows: whole class, then each table ── */
  const LABEL_W = 70, MEAN_W = 92;
  const barX = M + LABEL_W, barW = CW - LABEL_W - MEAN_W, BAR_H = 15;
  const block = (title, subtitle, stA, stB, stC) => {
    ensure(96);
    font(11, "bold"); doc.text(title, M, y);
    if (subtitle) { const tw = doc.getTextWidth(title); font(9, "normal", PDF_INK3); doc.text(subtitle, M + tw + 6, y); }
    if (stA && stB) { font(9, "bold", PDF_INK2); doc.text(`Change in mean code ${signed(stB.mean - stA.mean, 2)}`, M + CW, y, { align: "right" }); }
    y += 9;
    [["Structured", stA], ["Open-ended", stB], ["Other", stC]].forEach(([lab, st]) => {
      font(9, "normal", PDF_INK2); doc.text(lab, M, y + BAR_H / 2 + 3);
      bar(barX, y, barW, BAR_H, st);
      if (st) {
        font(9, "bold"); doc.text(`mean ${st.mean.toFixed(2)}`, M + CW, y + BAR_H / 2 + 1, { align: "right" });
        font(7.5, "normal", PDF_INK3); doc.text(`${Math.round(st.collab)}% collaborative`, M + CW, y + BAR_H / 2 + 10, { align: "right" });
      }
      y += BAR_H + 8;
    });
    y += 4; line(M, y, M + CW, y); y += 18;
  };

  ensure(110);
  font(12.5, "bold"); doc.text("By table", M, y); y += 20;
  block("All tables", "whole class", cls.Structured, cls["Open-ended"], cls.Other);
  s.tables.forEach(t => {
    const tp = A.byTablePhase[t.id] || {};
    const nc = p => chunksIn(s, p, t.id).length;
    block(`Table ${t.id}`, `${t.seats} student${t.seats === 1 ? "" : "s"} · minutes observed: ${nc("Structured")} structured, ${nc("Open-ended")} open-ended, ${nc("Other")} other`,
          phaseStats(tp.Structured), phaseStats(tp["Open-ended"]), phaseStats(tp.Other));
  });

  /* ── Method ── */
  font(8, "normal", PDF_INK3);
  ensure(14 + doc.splitTextToSize("Time sampling with a 1-minute table rotation: the observer watches one table per minute and codes its students, then moves to the next table. Each minute gives one observation per student at that table, using the last code given that minute; students not coded that minute are left out. Each table has its own problem type (Structured / Open-ended / Other), and every minute counts under its table's type at the time. Percentages are shares of coded student observations; the mean uses the code values (0, 1, 2, 3, 3.5, 4, 5). Collaborative = codes 4–5; any on-task peer interaction = codes 3.5–5; off-topic = code 1. Every observation and the full coding log are in the CSV.", CW).length * 10);
  font(8, "bold", PDF_INK3); doc.text("HOW THIS IS CALCULATED", M, y); y += 11;
  font(8, "normal", PDF_INK3);
  const method = "Time sampling with a 1-minute table rotation: the observer watches one table per minute and codes its students, then moves to the next table. Each minute gives one observation per student at that table, using the last code given that minute; students not coded that minute are left out. Each table has its own problem type (Structured / Open-ended / Other), and every minute counts under its table's type at the time. Percentages are shares of coded student observations; the mean uses the code values (0, 1, 2, 3, 3.5, 4, 5). Collaborative = codes 4–5; any on-task peer interaction = codes 3.5–5; off-topic = code 1. Every observation and the full coding log are in the CSV.";
  const ml = doc.splitTextToSize(method, CW);
  doc.text(ml, M, y); y += ml.length * 10;


  /* ── TA positioning and collaboration ── */
  const T = analyzeTA(s);
  const TA_ORANGE = "#E84A00", TA_TRACK = "#F3EFE8";
  doc.addPage(); y = M;
  if (!T.marks) {
    font(16, "bold"); doc.text("Where the TA was", M, y); y += 18;
    font(9.5, "normal", "#8A3200");
    doc.text(doc.splitTextToSize("• The TA's position was not marked during this observation. During the session, tap the empty space around a table, or the front strip, each time the TA moves.", CW), M, y);
    y += 30;
  } else {
    const LOW = 5;     // coded student observations; fewer than this is flagged
    let flagged = false;

    // Room maps of TA positions, one per activity
    font(16, "bold"); doc.text("Where the TA was", M, y);
    font(8.5, "normal", PDF_INK3); doc.text("time under each table = total TA time in that table's area", M + CW, y, { align: "right" });
    y += 14;
    const mapW = (CW - 24) / 3, mapH = 150, strip = 14;
    const maxDur = Math.max(1, ...MAIN_PHASES.flatMap(ph => (T.points[ph] || []).map(pt => pt.dur)));
    const layout = roomLayout(s.tables.length, false);
    const drawMap = (mx, my, ph) => {
      font(9.5, "bold", PDF_INK2); doc.text(ph, mx, my + 8);
      const ry = my + 14, gx = mx, gw = mapW, gy = ry + strip, gh = mapH - strip;
      doc.setDrawColor(PDF_LINE); doc.setLineWidth(0.75);
      doc.setFillColor("#FBFAF7"); doc.roundedRect(mx, ry, mapW, mapH, 4, 4, "FD");
      doc.setFillColor(TA_TRACK); doc.rect(mx + 0.5, ry + 0.5, mapW - 1, strip, "F");
      font(6, "bold", PDF_INK3); doc.text("FRONT", mx + mapW - 5, ry + strip / 2 + 2.2, { align: "right" });
      const cw = gw / layout.cols, chh = gh / layout.rows;
      const cellOf = idx => ({ x: gx + layout.pos[idx].col * cw, y: gy + layout.pos[idx].row * chh });
      s.tables.forEach((t, idx) => {
        const c = cellOf(idx);
        doc.setDrawColor(PDF_LINE); doc.setLineWidth(0.5); doc.rect(c.x, c.y, cw, chh, "S");
        const tw = Math.min(cw * 0.42, 70), th = chh * 0.3, tx = c.x + (cw - tw) / 2, ty = c.y + (chh - th) / 2;
        doc.setFillColor("#EEEBE4"); doc.setDrawColor("#D8D4CB"); doc.roundedRect(tx, ty, tw, th, 2, 2, "FD");
        const tt = (T.time[ph] || {})[t.id];
        font(7, "bold", PDF_INK2); doc.text(`T${t.id}`, tx + tw / 2, ty + th / 2 + (tt ? -1 : 2.4), { align: "center" });
        if (tt) { font(6.5, "bold", PDF_INK); doc.text(formatTime(tt), tx + tw / 2, ty + th / 2 + 6.5, { align: "center" }); }
        const r = Math.min(cw, chh) * 0.055, top = Math.ceil(t.seats / 2), bot = t.seats - top;
        [[top, ty - r - 2.5], [bot, ty + th + r + 2.5]].forEach(([k, sy]) => {
          for (let j = 0; j < k; j++) { doc.setDrawColor("#C9C4B9"); doc.setFillColor("#FFFFFF"); doc.circle(tx + tw * (j + 0.5) / k, sy, r, "FD"); }
        });
      });
      const pts = (T.points[ph] || []).slice().sort((a, b) => b.dur - a.dur);
      doc.setGState(new doc.GState({ opacity: 0.88 }));
      pts.forEach(pt => {
        const rad = 2.2 + 8 * Math.sqrt(pt.dur / maxDur);
        let px, py;
        if (pt.table == null) { px = gx + pt.u * gw; py = ry + strip / 2; }
        else {
          const idx = s.tables.findIndex(t => t.id === pt.table);
          if (idx < 0) return;
          const c = cellOf(idx); px = c.x + pt.u * cw; py = c.y + pt.v * chh;
        }
        doc.setFillColor(timeColor(pt.start / Math.max(1, s.totalSeconds))); doc.setDrawColor("#FFFFFF"); doc.setLineWidth(0.8);
        doc.circle(px, py, rad, "FD");
      });
      doc.setGState(new doc.GState({ opacity: 1 }));
      if (!pts.length) { font(8, "italic", PDF_INK3); doc.text("TA position not marked", mx + mapW / 2, ry + gh / 2, { align: "center" }); }
    };
    MAIN_PHASES.forEach((ph, i) => drawMap(M + i * (mapW + 12), y, ph));
    y += mapH + 30;
    font(8.5, "normal", PDF_INK2);
    doc.text(`TA time is filed under each table's problem type at the time. Front of room (any type): ${formatTime(T.front.sec)}, ${T.front.visits} visit${T.front.visits === 1 ? "" : "s"}.`, M, y);
    y += 24;
    // Legend: color = when (red = start of class, blue = end), size = how long
    { const lx = M, lw = 200, lh = 7;
      for (let k = 0; k < 100; k++) { doc.setFillColor(timeColor(k / 99)); doc.rect(lx + lw * k / 100, y, lw / 100 + 0.4, lh, "F"); }
      font(7.5, "normal", PDF_INK2);
      doc.text("start of class 00:00", lx, y + lh + 9);
      doc.text(`end of observation ${formatTime(s.totalSeconds)}`, lx + lw, y + lh + 9, { align: "right" });
      font(7.5, "bold", PDF_INK3); doc.text("DOT COLOR = WHEN", lx, y - 9);
      const sx = M + 260;
      doc.text("DOT SIZE = HOW LONG THE TA STAYED", sx, y - 9);
      doc.setFillColor("#8A877E");
      [[0.04, "brief stop"], [1, `longest stop (${formatTime(maxDur)})`]].forEach(([f, lab], j) => {
        const rr = 2.2 + 8 * Math.sqrt(f), cx = sx + rr + j * 80;
        doc.circle(cx, y + 7, rr, "F");
        font(7.5, "normal", PDF_INK2); doc.text(lab, cx + rr + 4, y + 9.5);
      });
    }
    y += 38;

    // Per-table breakdown, one table per activity
    const cPlace = M, cBar = M + 72, barLen = 110, cTime = M + 250, cVis = M + 300, cWith = M + 380, cWo = M + 450, cDiff = M + CW;
    MAIN_PHASES.forEach(ph => {
      const marked = T.phaseMarked[ph] || 0;
      ensure(48 + (s.tables.length + 1) * 17);
      font(11, "bold"); doc.text(`${ph}: TA time and collaboration by table`, M, y); y += 15;
      font(7.5, "bold", PDF_INK3);
      doc.text("Place", cPlace, y); doc.text("Share of TA time", cBar, y); doc.text("TA time", cTime, y, { align: "right" });
      doc.text("Visits", cVis, y, { align: "right" });
      doc.text("% collab. TA at table", cWith, y, { align: "right" }); doc.text("TA elsewhere", cWo, y, { align: "right" });
      doc.text("Difference", cDiff, y, { align: "right" });
      y += 5; line(M, y, M + CW, y);
      const rowsList = s.tables.map(t => [`Table ${t.id}`, t.id, t.id]);
      rowsList.forEach(([label, key, tid]) => {
        y += 14;
        const sec = (T.time[ph] || {})[key] || 0;
        font(9, "normal", PDF_INK); doc.text(label, cPlace, y);
        doc.setFillColor(TA_TRACK); doc.roundedRect(cBar, y - 7, barLen, 8, 2, 2, "F");
        if (sec && marked) { doc.setFillColor(TA_ORANGE); doc.roundedRect(cBar, y - 7, Math.max(2, barLen * sec / marked), 8, 2, 2, "F"); }
        font(8.5, "normal", PDF_INK2);
        doc.text(sec ? `${formatTime(sec)} · ${Math.round(pct(sec, marked))}%` : "—", cTime, y, { align: "right" });
        doc.text(String(((T.visits[ph] || {})[key]) || 0), cVis, y, { align: "right" });
        if (tid == null) { doc.text("—", cWith, y, { align: "right" }); doc.text("—", cWo, y, { align: "right" }); doc.text("—", cDiff, y, { align: "right" }); }
        else {
          const pt = ((T.presTable[tid] || {})[ph]) || {};
          const wi = phaseStats(pt.with), wo = phaseStats(pt.without);
          const low = wi && wi.tot < LOW; if (low) flagged = true;
          font(9, "bold", PDF_INK);
          doc.text(wi ? `${Math.round(wi.collab)}%${low ? "*" : ""}` : "—", cWith, y, { align: "right" });
          font(9, "normal", PDF_INK);
          doc.text(wo ? `${Math.round(wo.collab)}%` : "—", cWo, y, { align: "right" });
          font(9, "bold", PDF_INK2);
          doc.text(wi && wo ? `${signed(wi.collab - wo.collab, 0)} pts` : "—", cDiff, y, { align: "right" });
        }
        y += 4; line(M, y, M + CW, y, "#EFECE6", 0.5);
      });
      y += 22;
    });

    ensure(50);
    font(8, "normal", PDF_INK3);
    const taNote = (flagged ? `* Fewer than ${LOW} student observations were coded with the TA at the table, so treat that number with caution. ` : "") +
      "A student observation counts as \"TA at table\" when the TA's last marked position, at the moment the code was given, was in that student's table area; codes given before the TA is first marked in that activity are left out (the TA's position is marked afresh in each activity). Visits = separate arrivals at that place. TA time is measured in seconds.";
    const tl = doc.splitTextToSize(taNote, CW);
    doc.text(tl, M, y); y += tl.length * 10 + 12;
  }

  /* ── Footer on every page ── */
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    font(7.5, "normal", PDF_INK3);
    doc.text(`${s.section} · ${s.date} · exported ${new Date().toLocaleString()}`, M, H - 28);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 28, { align: "right" });
  }
  return doc;
}

/* iPhone/iPad allow only ONE download per tap, so there the report gets its
   own button on the done screen instead of downloading automatically. */
function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 0);
}

function downloadBlob(text, type, filename) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/* ── End & export ──────────────────────────────────────────────────────── */
let lastCSV = null;
let lastFilename = null;
let lastReport = null;
let lastReportFilename = null;

function endObservation() {
  if (!obsSession) return;
  if (!confirm("End this observation and export the CSV? You can download it again afterward if needed.")) return;
  finishObservation();
}

function finishObservation() {
  if (obsSession.timerRunning) {
    obsSession.accumMs += Date.now() - obsSession.segmentStart;
    obsSession.segmentStart = null;
    obsSession.timerRunning = false;
  }
  clearInterval(tickHandle);
  obsSession.totalSeconds = currentElapsedSeconds();
  endChunk(obsSession.totalSeconds);
  obsSession.active = false;
  obsSession.endedAt = new Date().toISOString();

  lastCSV = buildCSV(obsSession);
  lastFilename = buildFilename(obsSession);
  downloadCSV(lastCSV, lastFilename);
  lastReport = null;
  try { lastReport = buildParticipationPDF(obsSession).output("blob"); } catch (err) { console.error(err); }
  lastReportFilename = lastFilename.replace(/\.csv$/i, "_participation_by_table.pdf");
  const ios = isIOSDevice();
  if (!ios && lastReport) setTimeout(() => downloadBlob(lastReport, "application/pdf", lastReportFilename), 400);
  $("done-ios-note").classList.toggle("hidden", !ios);
  $("done-report-btn").className = ios ? "btn-primary big" : "btn-secondary big";
  clearAutosave();

  const codes = new Set(obsSession.log.filter(e => e.kind === "code").map(e => e.group)).size;
  const notes = obsSession.log.filter(e => e.kind === "note").length;
  const students = obsSession.tables.reduce((a, t) => a + t.seats, 0);
  $("done-summary").textContent =
    `${obsSession.ta} · ${obsSession.section} · ${formatDateNice(obsSession.date)} — ` +
    `${formatTime(obsSession.totalSeconds)} observed, ${students} students at ${obsSession.tableCount} tables, ${codes} codes, ${notes} notes, ` +
    `${obsSession.log.filter(e => e.kind === "ta").length} TA positions.`;

  selection = null;
  $("obs-body").classList.remove("panel-open");
  showScreen("screen-done");
}

function downloadCSVAgain() {
  if (lastCSV) downloadCSV(lastCSV, lastFilename);
}

function downloadReportAgain() {
  if (lastReport) downloadBlob(lastReport, "application/pdf", lastReportFilename);
  else alert("The PDF report could not be created on this device. All the numbers are in the CSV.");
}

function newObservation() {
  obsSession = null;
  resetSetupForm();
  showScreen("screen-setup");
}

function buildFilename(s) {
  const safe = str => String(str).replace(/[^a-z0-9]+/gi, "_");
  return `phys211_coding_${safe(s.section)}_${s.date}_${safe(s.netid)}.csv`;
}

function buildCSV(s) {
  const L = [];
  const row = arr => L.push(arr.map(csvField).join(","));
  const codeCols = CODES.map(c => `Obs at ${c.v}`);
  const A = analyze(s);
  const { byStudent, byPhase, byTable, byStudentPhase, byTablePhase, samples } = A;
  const done = (s.chunks || []).filter(c => c.end != null);
  const statCols = b => {
    const tot = totalCount(b);
    return [...CODES.map(c => pct(b[c.key], tot).toFixed(1)), tot, weightedMean(b),
            pct(sumKeys(b, COLLAB_KEYS), tot).toFixed(1), pct(sumKeys(b, INTERACT_KEYS), tot).toFixed(1), pct(sumKeys(b, OFFTOPIC_KEYS), tot).toFixed(1)];
  };
  const statHead = [...CODES.map(c => `% at ${c.v}`), "Coded Observations", "Mean Code", "% Collaborative (4-5)", "% On-Task Interaction (3.5-5)", "% Off-Topic (1)"];

  L.push("PHYS 211 Group-Work Coding Export");
  row(["Exported", new Date().toLocaleString()]);
  row(["Observer NetID", s.netid]);
  row(["TA Observed", s.ta]);
  row(["Section", s.section]);
  row(["Observation Date", s.date]);
  row(["Number of Tables", s.tableCount]);
  row(["Students per Table", s.tables.map(t => `T${t.id}:${t.seats}`).join(" ")]);
  row(["Total Students", s.tables.reduce((a, t) => a + t.seats, 0)]);
  row(["Total Observation Time", formatTime(s.totalSeconds)]);
  row(["Total Observation Time (seconds)", s.totalSeconds]);
  row(["Sampling", `Manual 1-minute table turns: one observation per student per turn (the last code given that minute); each table has its own problem type`]);
  row(["Chunk Length (seconds)", s.chunkSec || CHUNK_SEC]);
  row(["Chunks Observed", done.length]);
  L.push("");

  L.push("=== CODING SCHEME ===");
  row(["Code", "Description"]);
  CODES.forEach(c => row([c.v, c.desc]));
  L.push("");

  L.push("=== PROBLEM TYPE LOG (per table) ===");
  row(["ElapsedSeconds", "Elapsed", "Table", "Problem Type", "Changed During That Table's Minute"]);
  (s.typeLog || []).forEach(x => row([x.elapsedSec, formatTime(x.elapsedSec), x.table, x.type, x.duringChunk ? "Yes (the whole minute was relabelled)" : "No"]));
  L.push("");

  L.push("=== 1-MINUTE ROTATION CHUNKS ===");
  row(["Chunk #", "Problem Type", "Table", "Start (s)", "Start", "End (s)", "Duration (s)", "Students at Table", "Students Coded", "Codes (seat=code)", "TA Places During Chunk"]);
  done.forEach((c, i) => {
    const mine = samples.filter(x => x.chunk === c);
    const taPlaces = s.log.filter(e => e.kind === "ta" && e.elapsedSec < c.end && e.elapsedSec >= c.start).map(e => e.place);
    const before = s.log.filter(e => e.kind === "ta" && e.elapsedSec <= c.start && segIndexOf(s, e) === c.pseg).pop();
    if (before) taPlaces.unshift(before.place);
    row([i + 1, c.phase, c.table, c.start, formatTime(c.start), c.end, c.end - c.start, c.seats,
         mine.filter(x => x.key).length, mine.map(x => `S${x.seat}=${x.key ? x.code : "-"}`).join("; "),
         Array.from(new Set(taPlaces)).join(" → ")]);
  });
  L.push("");

  L.push("=== STUDENT OBSERVATIONS (one row per student per chunk) ===");
  row(["Chunk #", "Problem Type", "Table", "Seat", "StudentID", "StudentLabel", "Chunk Start (s)", "Code", "Code Description", "Coded At (s)", "Coded As Whole Table", "TA Position When Coded", "TA At This Table"]);
  samples.forEach(x => {
    const e = x.entry;
    row([done.indexOf(x.chunk) + 1, x.phase, x.table, x.seat, x.sid, s.labels[x.sid] || "", x.chunk.start,
         e ? e.code : "", e ? codeInfo(e.code).desc : "(not coded)", e ? e.elapsedSec : "", e ? (e.viaTable ? "Yes" : "No") : "",
         x.taPlace, x.taHere == null ? "" : (x.taHere ? "Yes" : "No")]);
  });
  L.push("");

  L.push("=== CODING LOG (every code tapped) ===");
  row(["#", "WallClockTime", "ElapsedSeconds", "Elapsed", "Problem Type", "Chunk #", "Table", "Seat", "StudentID", "StudentLabel", "Code", "Code Description", "Coded As Whole Table", "Counted (last code at this table in its turn)", "TA Position When Coded", "TA At This Table When Coded"]);
  {
    const counted = new Set(samples.filter(x => x.entry).map(x => x.entry));
    const chunkNo = n => { const i = done.findIndex(c => c.n === n); return i < 0 ? "" : i + 1; };
    let ta = null, n = 0;
    s.log.forEach(e => {
      if (e.kind === "ta") { ta = e; return; }
      if (e.kind !== "code") return;
      if (ta && segIndexOf(s, ta) !== segIndexOf(s, e)) ta = null;   // TA marks don't carry across activities
      row([++n, e.wallTime, e.elapsedSec, formatTime(e.elapsedSec), e.phase, e.chunk != null ? chunkNo(e.chunk) : "", e.table, e.seat, e.sid, s.labels[e.sid] || "",
           e.code, codeInfo(e.code).desc, e.viaTable ? "Yes" : "No", counted.has(e) ? "Yes" : "No",
           ta ? ta.place : "(not marked yet)", ta ? (ta.table === e.table ? "Yes" : "No") : ""]);
    });
  }
  L.push("");

  L.push("=== QUALITATIVE NOTES ===");
  row(["#", "WallClockTime", "ElapsedSeconds", "Elapsed", "Problem Type", "Table", "Seat", "StudentID", "StudentLabel", "Note"]);
  s.log.filter(e => e.kind === "note").forEach((e, i) =>
    row([i + 1, e.wallTime, e.elapsedSec, formatTime(e.elapsedSec), e.phase, e.table, e.seat || "(whole table)", e.seat ? e.sid : "", e.seat ? (s.labels[e.sid] || "") : "", e.text]));
  L.push("");

  L.push("=== OBSERVATIONS AT EACH CODE BY PROBLEM TYPE (student-chunks) ===");
  row(["Problem Type", "Chunks", ...codeCols, ...statHead]);
  Object.keys(byPhase).forEach(p => row([p, chunksIn(s, p).length, ...CODES.map(c => byPhase[p][c.key]), ...statCols(byPhase[p])]));
  L.push("");

  L.push("=== PARTICIPATION BY TABLE AND PROBLEM TYPE (student-chunks) ===");
  row(["Table", "Seats", "Problem Type", "Chunks", ...codeCols, ...statHead]);
  s.tables.forEach(t => Object.keys(byTablePhase[t.id] || {}).forEach(ph => {
    const b = byTablePhase[t.id][ph];
    row([t.id, t.seats, ph, chunksIn(s, ph, t.id).length, ...CODES.map(c => b[c.key]), ...statCols(b)]);
  }));
  L.push("");

  L.push("=== PARTICIPATION BY STUDENT AND PROBLEM TYPE (student-chunks) ===");
  row(["StudentID", "Table", "Seat", "StudentLabel", "Problem Type", "Chunks", ...codeCols, ...statHead]);
  Object.keys(byStudentPhase).forEach(id => {
    const st = byStudent[id];
    Object.keys(byStudentPhase[id]).forEach(ph => {
      const b = byStudentPhase[id][ph];
      row([id, st.table, st.seat, st.label, ph, chunksIn(s, ph, st.table).length, ...CODES.map(c => b[c.key]), ...statCols(b)]);
    });
  });
  L.push("");

  {
    const T = analyzeTA(s);
    L.push("=== TA POSITION LOG ===");
    row(["#", "WallClockTime", "ElapsedSeconds", "Elapsed", "Problem Type", "Place", "Table", "Seconds There", "X Within Area (0-1)", "Y Within Area (0-1)"]);
    const marks = s.log.filter(e => e.kind === "ta");
    marks.forEach((m, i) => {
      const end = Math.min(i < marks.length - 1 ? marks[i + 1].elapsedSec : s.totalSeconds, roundEnd(s, segIndexOf(s, m)));
      row([i + 1, m.wallTime, m.elapsedSec, formatTime(m.elapsedSec), m.phase, m.place, m.table == null ? "" : m.table,
           Math.max(0, end - m.elapsedSec), m.u.toFixed(2), m.v.toFixed(2)]);
    });
    L.push("");

    L.push("=== TA TIME BY PLACE AND PROBLEM TYPE ===");
    row(["Problem Type (of that table at the time)", "Place", "Seconds", "% of TA Time at Tables of This Type", "Visits"]);
    Object.keys(T.time).forEach(ph => {
      s.tables.forEach(t => {
        const sec = T.time[ph][t.id] || 0;
        row([ph, `Table ${t.id}`, sec, pct(sec, T.phaseMarked[ph]).toFixed(1), (T.visits[ph] || {})[t.id] || 0]);
      });
    });
    row(["(any)", "Front of room", T.front.sec, "", T.front.visits]);
    L.push("");

    L.push("=== COLLABORATION WITH vs WITHOUT THE TA AT THE TABLE (student-chunks) ===");
    row(["Problem Type", "Table", "TA Presence", ...codeCols, ...statHead]);
    const presRow = (ph, tableLabel, w, b) =>
      row([ph, tableLabel, w === "with" ? "TA at table" : "TA elsewhere", ...CODES.map(c => b[c.key]), ...statCols(b)]);
    Object.keys(T.pres).forEach(ph => ["with", "without"].forEach(w => { if (T.pres[ph][w]) presRow(ph, "All", w, T.pres[ph][w]); }));
    s.tables.forEach(t => Object.keys(T.presTable[t.id] || {}).forEach(ph =>
      ["with", "without"].forEach(w => { const b = T.presTable[t.id][ph][w]; if (b) presRow(ph, t.id, w, b); })));
    L.push("");
  }

  L.push("=== STUDENT SUMMARY ===");
  row(["StudentID", "Table", "Seat", "StudentLabel", "Seat Removed During Session", "Chunks Observed", "Times Coded (all taps)", "First Coded (s)", "Last Code",
       ...codeCols, "Coded Observations", "Mean Code", "Notes"]);
  Object.keys(byStudent).forEach(id => {
    const st = byStudent[id];
    row([id, st.table, st.seat, st.label, st.removed ? "Yes" : "No", st.chunks, st.nCodes, st.firstCodedSec, st.lastCode,
         ...CODES.map(c => st.obs[c.key]), totalCount(st.obs), weightedMean(st.obs), st.notes]);
  });
  L.push("");

  L.push("=== TABLE SUMMARY (student-chunks) ===");
  row(["Table", "Seats", "Chunks", ...codeCols, "Coded Observations", "Mean Code", "Table Notes"]);
  s.tables.forEach(t => {
    const b = byTable[t.id] || emptyBuckets();
    const notes = s.log.filter(e => e.kind === "note" && e.sid === `T${t.id}`).map(e => `[${formatTime(e.elapsedSec)}] ${e.text}`).join(" | ");
    row([t.id, t.seats, done.filter(c => c.table === t.id).length, ...CODES.map(c => b[c.key]), totalCount(b), weightedMean(b), notes]);
  });

  return L.join("\n");
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/* ── Resume an in-progress observation (localStorage safety net) ───────── */
function tryResume() {
  let saved;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    saved = JSON.parse(raw);
  } catch (e) { return; }
  if (!saved || !saved.active) return;

  let ms = saved.accumMs || 0;
  if (saved.timerRunning && saved.segmentStart) ms += Date.now() - saved.segmentStart;
  const elapsedMin = Math.round(ms / 60000);

  const resume = confirm(
    `You have an in-progress coding observation for ${saved.ta} (${saved.section}), about ${elapsedMin} min logged.\n\nResume it? (Cancel discards it.)`
  );
  if (!resume) { clearAutosave(); return; }

  obsSession = saved;
  if (!obsSession.chunks) { obsSession.chunks = []; obsSession.chunkSeq = 0; obsSession.chunkSec = CHUNK_SEC; }
  if (!obsSession.typeLog) obsSession.typeLog = [];
  obsSession.tables.forEach(t => { if (t.type == null) t.type = ""; });
  if (obsSession.timerRunning && obsSession.segmentStart) obsSession.accumMs += Date.now() - obsSession.segmentStart;
  obsSession.segmentStart = Date.now();
  obsSession.timerRunning = true;
  currentNetID = obsSession.netid;
  $("setup-observer-label").textContent = "Observer: " + currentNetID;
  enterObserveScreen();
}

/* ── Init ───────────────────────────────────────────────────────────────── */
populateSectionDropdown();
try {
  if (localStorage.getItem("phys211coding_log_collapsed")) {
    $("live-log").classList.add("collapsed"); $("ll-toggle").textContent = "▸ Live log"; $("ll-toggle").setAttribute("aria-expanded", "false");
  }
} catch (e) { /* ignore */ }
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && selection) closePanel();
});
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!obsSession || $("screen-observe").classList.contains("hidden")) return;
    if ((isNarrow() ? "1" : "") !== ($("room-grid").dataset.narrow || "")) renderMap(); else sizeSeats();
  }, 120);
});
try {
  const remembered = localStorage.getItem(LAST_NETID_KEY);
  if (remembered) $("netid-input").value = remembered;
} catch (e) { /* ignore */ }
tryResume();
