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
  { v: 1,   key: "1",  desc: "Working independently, no interaction" },
  { v: 2,   key: "2",  desc: "Working independently, just checking the final answer/product" },
  { v: 2.5, key: "25", desc: "Working independently with occasional interaction / process" },
  { v: 3,   key: "3",  desc: "Working collaboratively with occasional interaction" },
  { v: 4,   key: "4",  desc: "Working collaboratively with a high interaction level" },
];
const codeInfo = v => CODES.find(c => c.v === v);

const DEFAULT_SEATS = 4;
const MIN_SEATS = 1, MAX_SEATS = 10;
const STALE_SECONDS = 300;          // seats not coded for 5 min get a dashed outline

const STORAGE_KEY = "phys211coding_session_v1";
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
    tables: Array.from({ length: n }, (_, i) => ({ id: i + 1, seats: DEFAULT_SEATS })),
    labels: {},                 // sid -> optional student label (initials etc.)
    log: [],                    // chronological { kind: "code"|"note", group, sid, table, seat, code?, text?, elapsedSec, wallTime, phase }
    seq: 0,                     // group counter (a whole-table code is one group → one undo)
    phase: "",
    phaseLog: [{ elapsedSec: 0, phase: "" }],
    phaseStartIdx: 0,           // log index where the current activity round began
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
  renderPhase();
  renderMap();
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
  updateSeatStates();
  const ago = $("p-ago");
  if (ago && selection && selection.type === "student") ago.textContent = agoText(sid(selection.table, selection.seat));
}

/* ── Activity type (structured vs open-ended) ─────────────────────────────
   Every code/note is tagged with the activity running when it was logged.
   Switching activity starts a clean slate: the map shows every student as
   uncoded again, and earlier codes stop counting at the switch (they never
   carry into the new activity). Earlier codes stay in each student's
   history and in the exports. Tap the active one again to clear it. */
function setPhase(p) {
  if (!obsSession) return;
  const next = obsSession.phase === p ? "" : p;
  obsSession.phase = next;
  obsSession.phaseLog.push({ elapsedSec: currentElapsedSeconds(), phase: next });
  obsSession.phaseStartIdx = obsSession.log.length;
  renderPhase();
  renderPanel();
  updateSeatStates();
  renderFooter();
  autosave();
}

/* Index of the first log entry in the current activity round. */
function roundStart() {
  if (!obsSession) return 0;
  return Math.min(obsSession.phaseStartIdx || 0, obsSession.log.length);
}

function renderPhase() {
  document.querySelectorAll("#phase-tabs .obs-tab").forEach(b =>
    b.classList.toggle("active", !!obsSession && b.dataset.phase === obsSession.phase));
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
  return ({ 0: "No work", 1: "Indep.", 2: "Indep. + check", 2.5: "Indep. + some talk", 3: "Collab.", 4: "Collab. high" })[c.v];
}

/* ── Tables ─────────────────────────────────────────────────────────────── */
function stepTablesLive(delta) {
  if (!obsSession) return;
  let n = Math.max(2, Math.min(16, obsSession.tableCount + delta));
  if (n === obsSession.tableCount) return;
  if (n > obsSession.tableCount) {
    for (let i = obsSession.tableCount; i < n; i++) obsSession.tables.push({ id: i + 1, seats: DEFAULT_SEATS });
  } else {
    obsSession.tables = obsSession.tables.slice(0, n);
    if (selection && selection.table > n) selection = null;
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
          <span class="t-center"><span class="t-label">TABLE</span><span class="t-num">${t.id}</span><span class="t-seats">${t.seats} student${t.seats === 1 ? "" : "s"}</span></span>
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

/* The student's current code in THIS activity round (clean slate per activity). */
function lastCodeEntry(id) {
  const log = obsSession.log, cur = obsSession.phaseLog.length - 1, start = roundStart();
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.kind !== "code" || e.sid !== id) continue;
    if (e.pseg != null ? e.pseg === cur : i >= start) return e;
  }
  return null;
}

function hasNote(id) {
  return obsSession.log.some(e => e.kind === "note" && e.sid === id);
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
}

/* ── TA position ─────────────────────────────────────────────────────────
   Tap empty space in a table's area (not a student or the table itself) to
   mark the TA there; tap the front strip for the front of the room. The TA
   stays at the last marked spot until the next tap — across activity
   switches too, since it is where the TA physically is. */
function currentTA() {
  if (!obsSession) return null;
  for (let i = obsSession.log.length - 1; i >= 0; i--) if (obsSession.log[i].kind === "ta") return obsSession.log[i];
  return null;
}

function logTA(entry) {
  if (!obsSession) return;
  const group = ++obsSession.seq;
  obsSession.log.push({ ...baseEntry("ta"), group, ...entry });
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
  const marks = obsSession ? obsSession.log.filter(e => e.kind === "ta") : [];
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
  if (!ta) { if (st) st.textContent = "TA position not marked yet"; return; }
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

function renderPanel() {
  const panel = $("side-panel");
  if (!obsSession || !selection) { panel.innerHTML = ""; return; }

  if (selection.type === "student") {
    const { table, seat } = selection;
    const id = sid(table, seat);
    const last = lastCodeEntry(id);
    const entries = obsSession.log.filter(e => e.sid === id);
    panel.innerHTML = `<div class="panel-inner">
      <div class="p-head">
        <div>
          <div class="p-eyebrow">TABLE ${table} · SEAT ${seat}</div>
          <h2>Student ${escapeHTML(id)}</h2>
        </div>
        <button class="p-close" onclick="closePanel()" aria-label="Close">×</button>
      </div>

      <div class="p-status">
        ${last ? `Current: ${badge(last.code)}` : "Current: <strong>not coded</strong>"}
        <span class="ago" id="p-ago">${agoText(id)}</span>
      </div>

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
        <div class="p-section-title">History for this student</div>
        <div class="history">${historyRows(entries)}</div>
      </div>
    </div>`;
  } else {
    const t = obsSession.tables.find(x => x.id === selection.table);
    if (!t) { selection = null; panel.innerHTML = ""; $("obs-body").classList.remove("panel-open"); return; }
    const tableKey = `T${t.id}`;
    const entries = obsSession.log.filter(e => e.table === t.id && (e.sid === tableKey || e.viaTable) )
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
        <div class="p-section-title">Table history</div>
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
    phase: obsSession.phase || "",
    pseg: obsSession.phaseLog.length - 1,     // which activity round it was logged in
  };
}

function codeSelected(code) {
  if (!obsSession || !selection || selection.type !== "student") return;
  const { table, seat } = selection;
  const group = ++obsSession.seq;
  obsSession.log.push({ ...baseEntry("code"), group, sid: sid(table, seat), table, seat, code });
  afterLog([sid(table, seat)]);
}

function codeTable(code) {
  if (!obsSession || !selection || selection.type !== "table") return;
  const t = obsSession.tables.find(x => x.id === selection.table);
  const group = ++obsSession.seq;
  const ids = [];
  for (let s = 1; s <= t.seats; s++) {
    obsSession.log.push({ ...baseEntry("code"), group, sid: sid(t.id, s), table: t.id, seat: s, code, viaTable: true });
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
    obsSession.log.push({ ...baseEntry("note"), group, sid: sid(table, seat), table, seat, text });
    afterLog([sid(table, seat)]);
  } else {
    obsSession.log.push({ ...baseEntry("note"), group, sid: `T${selection.table}`, table: selection.table, seat: "", text });
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

function undoLast() {
  if (!obsSession || !obsSession.log.length) return;
  const g = obsSession.log[obsSession.log.length - 1].group;
  deleteGroup(g);
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
  const codes = new Set(obsSession.log.filter(e => e.kind === "code").map(e => e.group)).size;
  const notes = obsSession.log.filter(e => e.kind === "note").length;
  const moves = obsSession.log.filter(e => e.kind === "ta").length;
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
  const rows = [];
  let lastP = 0;
  const phaseRow = i => rows.push(`<div class="ll-row phase">${formatTime(obsSession.phaseLog[i].elapsedSec)} · Activity: ${escapeHTML(obsSession.phaseLog[i].phase || "none")}</div>`);
  const seen = new Set();
  obsSession.log.forEach(e => {
    const ps = e.pseg != null ? e.pseg : lastP;
    while (lastP < ps) phaseRow(++lastP);
    if (seen.has(e.group)) return;
    seen.add(e.group);
    const n = e.viaTable ? obsSession.log.filter(x => x.group === e.group).length : 0;
    rows.push(`<div class="ll-row" data-group="${e.group}">
      <span class="ll-time">${formatTime(e.elapsedSec)}</span>
      <span class="ll-ph">${escapeHTML(PHASE_SHORT[e.phase] != null ? PHASE_SHORT[e.phase] : e.phase)}</span>
      <span class="ll-desc">${logRowDesc(e, n)}</span>
      <button type="button" class="ll-x" onclick="deleteGroup(${e.group})" title="Undo this" aria-label="Undo this entry">×</button>
    </div>`);
  });
  while (lastP < obsSession.phaseLog.length - 1) phaseRow(++lastP);
  if (!rows.length) {
    body.innerHTML = `<div class="ll-empty">Nothing logged yet. Tap a student to code them, tap a table to code everyone at it, and tap the empty space around a table (or the front strip) to mark where the TA is. Every entry appears here; tap × to undo it.</div>`;
    return;
  }
  const shown = rows.reverse().slice(0, LOG_ROWS);
  body.innerHTML = shown.join("").replace('class="ll-row"', 'class="ll-row newest"');
  body.scrollTop = 0;
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
   Each code lasts until that student's next code, the end of the activity
   round it was logged in, or the end of the observation — whichever comes
   first. Codes never carry across an activity switch. */
function segIndexOf(s, e) {
  if (e.pseg != null) return e.pseg;
  let k = 0;
  s.phaseLog.forEach((p, i) => { if (p.elapsedSec <= e.elapsedSec) k = i; });
  return k;
}
function segEnd(s, i) {
  return i + 1 < s.phaseLog.length ? s.phaseLog[i + 1].elapsedSec : s.totalSeconds;
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

function analyze(s) {
  const byStudent = {};
  const byPhase = {};
  const byTable = {};
  const byStudentPhase = {};          // id -> phase -> buckets
  const byTablePhase = {};            // table -> phase -> buckets
  const ensurePhase = p => (byPhase[p] = byPhase[p] || emptyBuckets());
  const ensureTable = t => (byTable[t] = byTable[t] || emptyBuckets());
  const ensure2 = (obj, a, b) => ((obj[a] = obj[a] || {}), (obj[a][b] = obj[a][b] || emptyBuckets()));

  allStudentIds(s).forEach(id => {
    const [t, k] = id.slice(1).split("-S").map(Number);
    const codes = s.log.filter(e => e.kind === "code" && e.sid === id);
    const secs = emptyBuckets();
    codes.forEach((e, i) => {
      const start = e.elapsedSec;
      const si = segIndexOf(s, e);
      const next = i < codes.length - 1 ? codes[i + 1].elapsedSec : s.totalSeconds;
      const end = Math.min(next, segEnd(s, si), s.totalSeconds);
      if (end <= start) return;
      const d = end - start;
      const key = codeInfo(e.code).key;
      const ph = s.phaseLog[si].phase || "(not set)";
      secs[key] += d;
      ensureTable(t)[key] += d;
      ensurePhase(ph)[key] += d;
      ensure2(byStudentPhase, id, ph)[key] += d;
      ensure2(byTablePhase, t, ph)[key] += d;
    });
    const table = s.tables.find(x => x.id === t);
    byStudent[id] = {
      table: t, seat: k,
      label: s.labels[id] || "",
      removed: !table || k > table.seats,
      nCodes: codes.length,
      firstCodedSec: codes.length ? codes[0].elapsedSec : "",
      lastCode: codes.length ? codes[codes.length - 1].code : "",
      secs,
      notes: s.log.filter(e => e.kind === "note" && e.sid === id).map(e => `[${formatTime(e.elapsedSec)}] ${e.text}`).join(" | "),
    };
  });
  return { byStudent, byPhase, byTable, byStudentPhase, byTablePhase };
}

const pct = (part, whole) => (whole ? (100 * part / whole) : 0);
const COLLAB_KEYS = ["3", "4"];                  // working collaboratively
const INTERACT_KEYS = ["25", "3", "4"];          // any peer interaction
const sumKeys = (secs, keys) => keys.reduce((a, k) => a + secs[k], 0);

function weightedMean(secs) {
  let tot = 0, sum = 0;
  CODES.forEach(c => { tot += secs[c.key]; sum += secs[c.key] * c.v; });
  return tot ? (sum / tot).toFixed(2) : "";
}
const totalSecs = secs => CODES.reduce((a, c) => a + secs[c.key], 0);


/* ── TA presence analysis ────────────────────────────────────────────────
   The TA is "at" a table while their last marked position is in that
   table's area. For every stretch of coded student-time we ask: was the TA
   at this student's table? Time before the first TA mark is left out. */
function taSegments(s) {
  const marks = s.log.filter(e => e.kind === "ta");
  return marks.map((m, i) => ({
    start: m.elapsedSec,
    end: i < marks.length - 1 ? marks[i + 1].elapsedSec : s.totalSeconds,
    table: m.table, place: m.place, u: m.u, v: m.v, phase: m.phase || "(not set)",
  })).filter(x => x.end > x.start);
}

/* Each student's coded stretches, same rules as analyze(). */
function codeIntervals(s) {
  const out = [];
  allStudentIds(s).forEach(id => {
    const t = Number(id.slice(1).split("-S")[0]);
    const codes = s.log.filter(e => e.kind === "code" && e.sid === id);
    codes.forEach((e, i) => {
      const si = segIndexOf(s, e);
      const next = i < codes.length - 1 ? codes[i + 1].elapsedSec : s.totalSeconds;
      const end = Math.min(next, segEnd(s, si), s.totalSeconds);
      if (end > e.elapsedSec) out.push({ id, table: t, start: e.elapsedSec, end, key: codeInfo(e.code).key, phase: s.phaseLog[si].phase || "(not set)" });
    });
  });
  return out;
}

function analyzeTA(s) {
  const segs = taSegments(s);
  const phases = phaseSegments(s).map(p => ({ ...p, phase: p.phase || "(not set)" }));
  const pres = {};        // phase -> { with, without } buckets
  const presTable = {};   // table -> phase -> { with, without }
  const time = {};        // phase -> { front, [tableId] } seconds
  const visits = {};      // phase -> { front, [tableId] } count of arrivals
  const points = {};      // phase -> [{ table, u, v, dur }]
  const phaseMarked = {}; // phase -> seconds with a known TA position
  const get = (o, ...ks) => ks.reduce((acc, k, i) => (acc[k] = acc[k] || (i === ks.length - 1 ? emptyBuckets() : {})), o);

  segs.forEach(g => phases.forEach(p => {
    const ov = Math.min(g.end, p.end) - Math.max(g.start, p.start);
    if (ov <= 0) return;
    const k = g.table == null ? "front" : g.table;
    (time[p.phase] = time[p.phase] || {})[k] = (time[p.phase][k] || 0) + ov;
    phaseMarked[p.phase] = (phaseMarked[p.phase] || 0) + ov;
    (points[p.phase] = points[p.phase] || []).push({ table: g.table, u: g.u, v: g.v, dur: ov, start: Math.max(g.start, p.start) });
  }));

  let prevKey;
  s.log.filter(e => e.kind === "ta").forEach(m => {
    const k = m.table == null ? "front" : m.table;
    if (k !== prevKey) { const ph = m.phase || "(not set)"; (visits[ph] = visits[ph] || {})[k] = (visits[ph][k] || 0) + 1; }
    prevKey = k;
  });

  codeIntervals(s).forEach(iv => segs.forEach(g => {
    const ov = Math.min(iv.end, g.end) - Math.max(iv.start, g.start);
    if (ov <= 0) return;
    const w = g.table === iv.table ? "with" : "without";
    get(pres, iv.phase, w)[iv.key] += ov;
    get(presTable, iv.table, iv.phase, w)[iv.key] += ov;
  }));

  return { segs, pres, presTable, time, visits, points, phaseMarked, marks: s.log.filter(e => e.kind === "ta").length };
}

/* ── Participation report (PDF) ──────────────────────────────────────────
   One page-flow PDF, built in the browser with the bundled jsPDF library:
   a whole-class summary, then every table with one bar for Structured and
   one for Open-ended activities. Codes are ordinal, so they share one
   light→dark blue ramp (darker = more interaction). The numbers behind it
   are in the CSV. */
const MAIN_PHASES = ["Structured", "Open-ended"];

const PDF_CODE_COLORS = {
  "0":  { bg: "#E4E1DA", fg: "#4A4740" },
  "1":  { bg: "#DCE8F6", fg: "#13294B" },
  "2":  { bg: "#ADC9EA", fg: "#13294B" },
  "25": { bg: "#6E9FD6", fg: "#FFFFFF" },
  "3":  { bg: "#2F6BB2", fg: "#FFFFFF" },
  "4":  { bg: "#13294B", fg: "#FFFFFF" },
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
  const tot = totalSecs(b);
  if (!tot) return null;
  return {
    b, tot,
    mean: Number(weightedMean(b)),
    collab: pct(sumKeys(b, COLLAB_KEYS), tot),
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
  doc.text("Structured vs. open-ended participation by table", M, y);
  y += 17;
  font(9.5, "normal", PDF_INK2);
  const totalStudents = s.tables.reduce((a, t) => a + t.seats, 0);
  doc.text(`${s.section} · TA ${s.ta} · ${formatDateNice(s.date)} · Observer ${s.netid} · ${formatTime(s.totalSeconds)} observed · ${totalStudents} students at ${s.tableCount} tables`, M, y);
  y += 10;

  const cls = {};
  MAIN_PHASES.forEach(p => (cls[p] = phaseStats(A.byPhase[p])));
  const notes = [];
  if (!MAIN_PHASES.some(p => cls[p])) notes.push("No codes were recorded during a Structured or Open-ended activity. Select the activity in the top bar while coding so the two can be compared.");
  else MAIN_PHASES.forEach(p => { if (!cls[p]) notes.push(`No codes were recorded during ${p} activities, so those bars are empty.`); });
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
  const colS = M + 300, colO = M + 395, colD = M + CW;
  font(8.5, "bold", PDF_INK3);
  doc.text("Structured", colS, y, { align: "right" });
  doc.text("Open-ended", colO, y, { align: "right" });
  doc.text("Change", colD, y, { align: "right" });
  y += 6;
  line(M, y, M + CW, y);
  const minutesIn = p => phaseSegments(s).filter(x => x.phase === p).reduce((a, x) => a + x.end - x.start, 0);
  const kpis = [
    ["Time-weighted mean code (0–4)", st => st.mean.toFixed(2), (a, b) => signed(b.mean - a.mean, 2)],
    ["Time working collaboratively (codes 3–4)", st => `${Math.round(st.collab)}%`, (a, b) => `${signed(b.collab - a.collab, 0)} pts`],
    ["Time with any peer interaction (codes 2.5–4)", st => `${Math.round(st.interact)}%`, (a, b) => `${signed(b.interact - a.interact, 0)} pts`],
    ["Time with no work (code 0)", st => `${Math.round(st.none)}%`, (a, b) => `${signed(b.none - a.none, 0)} pts`],
  ];
  kpis.forEach(([label, val, diff]) => {
    y += 16;
    font(9.5, "normal", PDF_INK2); doc.text(label, M, y);
    font(10.5, "bold");
    doc.text(cls.Structured ? val(cls.Structured) : "—", colS, y, { align: "right" });
    doc.text(cls["Open-ended"] ? val(cls["Open-ended"]) : "—", colO, y, { align: "right" });
    font(9.5, "normal", PDF_INK2);
    doc.text(cls.Structured && cls["Open-ended"] ? diff(cls.Structured, cls["Open-ended"]) : "—", colD, y, { align: "right" });
    y += 6; line(M, y, M + CW, y);
  });
  y += 16;
  font(9.5, "normal", PDF_INK2); doc.text("Length of activity", M, y);
  font(10.5, "bold");
  doc.text(formatTime(minutesIn("Structured")), colS, y, { align: "right" });
  doc.text(formatTime(minutesIn("Open-ended")), colO, y, { align: "right" });
  y += 6; line(M, y, M + CW, y);

  /* ── Legend ── */
  y += 24;
  font(9, "bold", PDF_INK3);
  doc.text("CODING SCHEME  ·  each bar is 100% of coded student-time in that activity, darker = more interaction", M, y);
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
  y += 3 * 24 + 22;

  /* ── Rows: whole class, then each table ── */
  const LABEL_W = 70, MEAN_W = 92;
  const barX = M + LABEL_W, barW = CW - LABEL_W - MEAN_W, BAR_H = 15;
  const block = (title, subtitle, stA, stB) => {
    ensure(72);
    font(11, "bold"); doc.text(title, M, y);
    if (subtitle) { const tw = doc.getTextWidth(title); font(9, "normal", PDF_INK3); doc.text(subtitle, M + tw + 6, y); }
    if (stA && stB) { font(9, "bold", PDF_INK2); doc.text(`Change in mean code ${signed(stB.mean - stA.mean, 2)}`, M + CW, y, { align: "right" }); }
    y += 9;
    [["Structured", stA], ["Open-ended", stB]].forEach(([lab, st]) => {
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
  block("All tables", "whole class", cls.Structured, cls["Open-ended"]);
  s.tables.forEach(t => {
    const tp = A.byTablePhase[t.id] || {};
    block(`Table ${t.id}`, `${t.seats} student${t.seats === 1 ? "" : "s"}`, phaseStats(tp.Structured), phaseStats(tp["Open-ended"]));
  });

  /* ── Method ── */
  font(8, "normal", PDF_INK3);
  ensure(14 + doc.splitTextToSize("Each code holds from when it is recorded until that student's next code, the end of the activity, or the end of the observation, whichever comes first; every switch of activity starts a fresh round of coding, so codes never carry over from one activity to the next. Table bars pool the time of every student at the table. Means are weighted by time (0, 1, 2, 2.5, 3, 4). Collaborative = codes 3–4; any peer interaction = codes 2.5–4. Per-student numbers and the full coding log are in the CSV.", CW).length * 10);
  font(8, "bold", PDF_INK3); doc.text("HOW THIS IS CALCULATED", M, y); y += 11;
  font(8, "normal", PDF_INK3);
  const method = "Each code holds from when it is recorded until that student's next code, the end of the activity, or the end of the observation, whichever comes first; every switch of activity starts a fresh round of coding, so codes never carry over from one activity to the next. Table bars pool the time of every student at the table. Means are weighted by time (0, 1, 2, 2.5, 3, 4). Collaborative = codes 3–4; any peer interaction = codes 2.5–4. Per-student numbers and the full coding log are in the CSV.";
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
    const LOW = 120;   // student-seconds; less than this is flagged
    let flagged = false;

    // Room maps of TA positions, one per activity
    font(16, "bold"); doc.text("Where the TA was", M, y);
    font(8.5, "normal", PDF_INK3); doc.text("time under each table = total TA time in that table's area", M + CW, y, { align: "right" });
    y += 14;
    const mapW = (CW - 16) / 2, mapH = 190, strip = 14;
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
      const ft = (T.time[ph] || {}).front;
      if (ft) { font(9.5, "bold", PDF_INK2); const w0 = doc.getTextWidth(ph); font(8, "normal", PDF_INK3); doc.text("· front of room ", mx + w0 + 9, my + 8);
        const w1 = doc.getTextWidth("· front of room "); font(8, "bold", PDF_INK); doc.text(formatTime(ft), mx + w0 + 9 + w1, my + 8); }
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
    MAIN_PHASES.forEach((ph, i) => drawMap(M + i * (mapW + 16), y, ph));
    y += mapH + 44;
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
      const rowsList = [["Front of room", "front", null], ...s.tables.map(t => [`Table ${t.id}`, t.id, t.id])];
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
    const taNote = (flagged ? `* Fewer than ${LOW} student-seconds were coded with the TA at the table, so treat that number with caution. ` : "") +
      "A student counts as \"TA at table\" for any time the TA's last marked position was in that student's table area; time before the first TA mark is left out. Visits = separate arrivals at that place. Because a code holds until the student is coded again, recode a table when the TA arrives and again after they leave for the cleanest comparison.";
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
  const codeCols = CODES.map(c => `Seconds at ${c.v}`);
  const { byStudent, byPhase, byTable, byStudentPhase } = analyze(s);

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
  L.push("");

  L.push("=== CODING SCHEME ===");
  row(["Code", "Description"]);
  CODES.forEach(c => row([c.v, c.desc]));
  L.push("");

  L.push("=== ACTIVITY TYPE LOG ===");
  row(["ElapsedSeconds", "Elapsed", "Activity"]);
  s.phaseLog.forEach(p => row([p.elapsedSec, formatTime(p.elapsedSec), p.phase || "(not set)"]));
  L.push("");

  L.push("=== CODING LOG ===");
  row(["#", "WallClockTime", "ElapsedSeconds", "Elapsed", "Activity", "Table", "Seat", "StudentID", "StudentLabel", "Code", "Code Description", "Coded As Whole Table", "TA Position When Coded", "TA At This Table When Coded"]);
  {
    let ta = null, n = 0;
    s.log.forEach(e => {
      if (e.kind === "ta") { ta = e; return; }
      if (e.kind !== "code") return;
      row([++n, e.wallTime, e.elapsedSec, formatTime(e.elapsedSec), e.phase, e.table, e.seat, e.sid, s.labels[e.sid] || "",
           e.code, codeInfo(e.code).desc, e.viaTable ? "Yes" : "No",
           ta ? ta.place : "(not marked yet)", ta ? (ta.table === e.table ? "Yes" : "No") : ""]);
    });
  }
  L.push("");

  L.push("=== QUALITATIVE NOTES ===");
  row(["#", "WallClockTime", "ElapsedSeconds", "Elapsed", "Activity", "Table", "Seat", "StudentID", "StudentLabel", "Note"]);
  s.log.filter(e => e.kind === "note").forEach((e, i) =>
    row([i + 1, e.wallTime, e.elapsedSec, formatTime(e.elapsedSec), e.phase, e.table, e.seat || "(whole table)", e.seat ? e.sid : "", e.seat ? (s.labels[e.sid] || "") : "", e.text]));
  L.push("");

  L.push("=== TIME AT EACH CODE BY ACTIVITY TYPE (student-seconds) ===");
  row(["Activity", ...codeCols, "Total Coded Seconds", "Time-Weighted Mean Code"]);
  Object.keys(byPhase).forEach(p => row([p, ...CODES.map(c => byPhase[p][c.key]), totalSecs(byPhase[p]), weightedMean(byPhase[p])]));
  L.push("");

  L.push("=== PARTICIPATION BY STUDENT AND ACTIVITY TYPE ===");
  row(["StudentID", "Table", "Seat", "StudentLabel", "Activity", ...codeCols, ...CODES.map(c => `% at ${c.v}`),
       "Total Coded Seconds", "Time-Weighted Mean Code", "% Collaborative (3-4)", "% Any Interaction (2.5-4)"]);
  Object.keys(byStudentPhase).forEach(id => {
    const st = byStudent[id];
    Object.keys(byStudentPhase[id]).forEach(ph => {
      const b = byStudentPhase[id][ph], tot = totalSecs(b);
      row([id, st.table, st.seat, st.label, ph, ...CODES.map(c => b[c.key]), ...CODES.map(c => pct(b[c.key], tot).toFixed(1)),
           tot, weightedMean(b), pct(sumKeys(b, COLLAB_KEYS), tot).toFixed(1), pct(sumKeys(b, INTERACT_KEYS), tot).toFixed(1)]);
    });
  });
  L.push("");

  L.push("=== PARTICIPATION BY TABLE AND ACTIVITY TYPE (student-seconds) ===");
  row(["Table", "Seats", "Activity", ...codeCols, ...CODES.map(c => `% at ${c.v}`),
       "Total Coded Seconds", "Time-Weighted Mean Code", "% Collaborative (3-4)", "% Any Interaction (2.5-4)"]);
  const { byTablePhase } = analyze(s);
  s.tables.forEach(t => Object.keys(byTablePhase[t.id] || {}).forEach(ph => {
    const b = byTablePhase[t.id][ph], tot = totalSecs(b);
    row([t.id, t.seats, ph, ...CODES.map(c => b[c.key]), ...CODES.map(c => pct(b[c.key], tot).toFixed(1)),
         tot, weightedMean(b), pct(sumKeys(b, COLLAB_KEYS), tot).toFixed(1), pct(sumKeys(b, INTERACT_KEYS), tot).toFixed(1)]);
  }));
  L.push("");

  {
    const T = analyzeTA(s);
    L.push("=== TA POSITION LOG ===");
    row(["#", "WallClockTime", "ElapsedSeconds", "Elapsed", "Activity", "Place", "Table", "Seconds There", "X Within Area (0-1)", "Y Within Area (0-1)"]);
    const marks = s.log.filter(e => e.kind === "ta");
    marks.forEach((m, i) => {
      const end = i < marks.length - 1 ? marks[i + 1].elapsedSec : s.totalSeconds;
      row([i + 1, m.wallTime, m.elapsedSec, formatTime(m.elapsedSec), m.phase, m.place, m.table == null ? "" : m.table,
           Math.max(0, end - m.elapsedSec), m.u.toFixed(2), m.v.toFixed(2)]);
    });
    L.push("");

    L.push("=== TA TIME BY PLACE AND ACTIVITY TYPE ===");
    row(["Activity", "Place", "Seconds", "% of Activity Time With TA Marked", "Visits"]);
    Object.keys(T.time).forEach(ph => {
      [["front", "Front of room"], ...s.tables.map(t => [t.id, `Table ${t.id}`])].forEach(([k, lab]) => {
        const sec = T.time[ph][k] || 0;
        row([ph, lab, sec, pct(sec, T.phaseMarked[ph]).toFixed(1), (T.visits[ph] || {})[k] || 0]);
      });
    });
    L.push("");

    L.push("=== COLLABORATION WITH vs WITHOUT THE TA AT THE TABLE (student-seconds) ===");
    row(["Activity", "Table", "TA Presence", ...codeCols, "Total Coded Seconds", "Time-Weighted Mean Code", "% Collaborative (3-4)", "% Any Interaction (2.5-4)"]);
    const presRow = (ph, tableLabel, w, b) => {
      const tot = totalSecs(b);
      row([ph, tableLabel, w === "with" ? "TA at table" : "TA elsewhere", ...CODES.map(c => b[c.key]), tot, weightedMean(b),
           pct(sumKeys(b, COLLAB_KEYS), tot).toFixed(1), pct(sumKeys(b, INTERACT_KEYS), tot).toFixed(1)]);
    };
    Object.keys(T.pres).forEach(ph => ["with", "without"].forEach(w => { if (T.pres[ph][w]) presRow(ph, "All", w, T.pres[ph][w]); }));
    s.tables.forEach(t => Object.keys(T.presTable[t.id] || {}).forEach(ph =>
      ["with", "without"].forEach(w => { const b = T.presTable[t.id][ph][w]; if (b) presRow(ph, t.id, w, b); })));
    L.push("");
  }

  L.push("=== STUDENT SUMMARY ===");
  row(["StudentID", "Table", "Seat", "StudentLabel", "Seat Removed During Session", "Times Coded", "First Coded (s)", "Last Code",
       ...codeCols, "Total Coded Seconds", "Time-Weighted Mean Code", "Notes"]);
  Object.keys(byStudent).forEach(id => {
    const st = byStudent[id];
    row([id, st.table, st.seat, st.label, st.removed ? "Yes" : "No", st.nCodes, st.firstCodedSec, st.lastCode,
         ...CODES.map(c => st.secs[c.key]), totalSecs(st.secs), weightedMean(st.secs), st.notes]);
  });
  L.push("");

  L.push("=== TABLE SUMMARY (student-seconds) ===");
  row(["Table", "Seats", ...codeCols, "Total Coded Seconds", "Time-Weighted Mean Code", "Table Notes"]);
  s.tables.forEach(t => {
    const b = byTable[t.id] || emptyBuckets();
    const notes = s.log.filter(e => e.kind === "note" && e.sid === `T${t.id}`).map(e => `[${formatTime(e.elapsedSec)}] ${e.text}`).join(" | ");
    row([t.id, t.seats, ...CODES.map(c => b[c.key]), totalSecs(b), weightedMean(b), notes]);
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
