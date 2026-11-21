(function(){
'use strict';

/* ===================== SUPABASE SETUP ===================== */
// PASTE YOUR KEYS HERE:
const SUPABASE_URL = 'https://sujfnfuvkaehkjlsyjsl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2VUAGTApwhyZ78DXN-NS0w_vxyPDeV8';

let supabaseClient = null;
let currentUser = null;
let DB = null;
let saveTimeout = null;

/* ===================== ICONS ===================== */
const ICONS = {
  cap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  award:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  database:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>'
};
function fillIcons(root){
  (root || document).querySelectorAll('[data-icon]').forEach(el => {
    if(!el.children.length) el.innerHTML = ICONS[el.dataset.icon] || '';
  });
}

/* ===================== HELPERS ===================== */
const STATUS = { P:'មានវត្តមាន', A:'អវត្តមាន', L:'យឺត', E:'សុំច្បាប់' };
const KHMER_MONTHS = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
const KHMER_DAY_NAMES = ['អាទិត្យ','ចន្ទ','អង្គារ','ពុធ','ព្រហស្បតិ៍','សុក្រ','សៅរ៍'];

const $  = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));

function uid(){ return Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function todayStr(){ const d=new Date(); const off=d.getTimezoneOffset(); return new Date(d.getTime()-off*60000).toISOString().slice(0,10); }
function tomorrowStr(){ const d=new Date(); d.setDate(d.getDate()+1); const off=d.getTimezoneOffset(); return new Date(d.getTime()-off*60000).toISOString().slice(0,10); }

function fmtDate(s){
  if(!s) return '—';
  const d = new Date(s + 'T00:00:00');
  if(isNaN(d)) return s;
  return d.getDate() + ' ' + KHMER_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
function fmtDateLong(s){
  if(!s) return '—';
  const d = new Date(s + 'T00:00:00');
  if(isNaN(d)) return s;
  return 'ថ្ងៃ' + KHMER_DAY_NAMES[d.getDay()] + ' ទី' + d.getDate() + ' ខែ' + KHMER_MONTHS[d.getMonth()] + ' ឆ្នាំ' + d.getFullYear();
}
function download(filename, content, mime){
  const blob = new Blob([content], {type: mime || 'application/octet-stream'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 400);
}
function downloadExcel(filename, htmlTable){
  const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="utf-8">' +
    '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
    '<x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
    '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
    '<style>td,th{font-family:Kantumruy Pro,Battambang,sans-serif;font-size:11pt;vertical-align:middle}</style>' +
    '</head><body>' + htmlTable + '</body></html>';
  download(filename, '\uFEFF' + html, 'application/vnd.ms-excel');
}
function toast(msg, isErr){
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'show' + (isErr ? ' err' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>{ t.className = ''; }, 2800);
}

/* ===================== SCHEDULE ===================== */
function getSchedule(meta){
  const s = (meta && meta.schedule) || {};
  return { saturday: s.saturday !== false, afternoon: s.afternoon !== false };
}
function getPeriodsForDate(dateStr, meta){
  if(!dateStr) return [];
  const d = new Date(dateStr + 'T00:00:00');
  if(isNaN(d)) return [];
  const dow = d.getDay();
  const sched = getSchedule(meta || DB.meta);

  if(dow === 0) return [];
  if(dow === 6 && !sched.saturday) return [];

  const am = [
    { no:1, session:'am', time:'7:00–8:00' },
    { no:2, session:'am', time:'8:00–9:00' },
    { no:3, session:'am', time:'9:00–10:00' },
    { no:4, session:'am', time:'10:00–11:00' }
  ];
  if(dow === 6) return am;
  if(!sched.afternoon) return am;
  const pm = [
    { no:5, session:'pm', time:'14:00–15:00' },
    { no:6, session:'pm', time:'15:00–16:00' },
    { no:7, session:'pm', time:'16:00–17:00' }
  ];
  return am.concat(pm);
}
function describeDay(dateStr){
  const periods = getPeriodsForDate(dateStr, DB.meta);
  const d = new Date(dateStr + 'T00:00:00');
  if(isNaN(d)) return '';
  const dayName = 'ថ្ងៃ' + KHMER_DAY_NAMES[d.getDay()];
  if(!periods.length) return { html: '<span class="icon sm" data-icon="info" style="color:var(--danger)"></span> <b>' + dayName + '</b> — គ្មានថ្នាក់', off: true };
  const hasPM = periods.some(p => p.session === 'pm');
  const desc = hasPM ? '៧ ម៉ោង (7:00–11:00, 14:00–17:00)' : '៤ ម៉ោង (7:00–11:00)';
  return { html: '<span class="icon sm" data-icon="clock" style="color:var(--primary)"></span> <b>' + dayName + '</b> — ' + desc, off: false };
}

/* ===================== DATA LOGIC ===================== */
function defaultData(){
  return {
    meta: {
      version: 3, schoolName:'', className:'', lastBackup:null,
      schedule: { saturday: true, afternoon: true },
      letter: {
        threshold: 14, scope: 'A',
        meetingDate: tomorrowStr(), meetingTime: '09:00',
        meetingPlace: 'ការិយាល័យនាយកសាលា', principal: ''
      }
    },
    students: [],
    subjects: ['គណិតវិទ្យា','អក្សរសាស្ត្រខ្មែរ','ភាសាអង់គ្លេស','វិទ្យាសាស្ត្រ'],
    assessments: [],
    scores: {},
    attendance: {},
    notes: []
  };
}
function normalize(raw){
  const base = defaultData();
  const d = Object.assign({}, base, raw || {});
  d.meta = Object.assign({}, base.meta, raw && raw.meta ? raw.meta : {});
  d.meta.schedule = Object.assign({}, base.meta.schedule, (raw && raw.meta && raw.meta.schedule) || {});
  d.meta.letter = Object.assign({}, base.meta.letter, (raw && raw.meta && raw.meta.letter) || {});
  ['students','subjects','assessments','notes'].forEach(k => { if(!Array.isArray(d[k])) d[k] = []; });
  ['scores','attendance'].forEach(k => { if(!d[k] || typeof d[k] !== 'object' || Array.isArray(d[k])) d[k] = {}; });
  d.students = d.students.filter(s => s && typeof s === 'object').map(s => Object.assign({ id: uid() }, s));
  d.notes = d.notes.filter(n => n && typeof n === 'object').map(n => Object.assign({ id: uid() }, n));
  d.assessments = d.assessments.filter(a => a && typeof a === 'object').map(a => Object.assign({ id: uid() }, a));
  return d;
}

// Sync status UI
function setSyncStatus(state){
  const el = $('#syncStatus');
  if(state === 'saving'){
    el.className = 'saving';
    el.innerHTML = '<span class="icon sm" data-icon="clock"></span> កំពុងរក្សាទុក...';
  } else if(state === 'error'){
    el.className = 'error';
    el.innerHTML = '<span class="icon sm" data-icon="alert"></span> បរាជ័យក្នុងការរក្សាទុក';
  } else {
    el.className = 'saved';
    el.innerHTML = '<span class="icon sm" data-icon="cloud"></span> បានរក្សាទុក';
  }
  fillIcons(el);
}

// Cloud Sync
function syncToCloud(){
  if(!supabaseClient || !currentUser) return;
  setSyncStatus('saving');
  
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const { error } = await supabaseClient
      .from('teacher_data')
      .upsert({ 
        user_id: currentUser.id, 
        data: DB, 
        updated_at: new Date().toISOString() 
      });
      
    if(error){
      console.error(error);
      setSyncStatus('error');
      toast('មិនអាចរក្សាទុកទៅ Cloud បានទេ', true);
    } else {
      setSyncStatus('saved');
    }
  }, 1000); // 1 second debounce
}

function saveDB(){
  syncToCloud();
  refreshChrome();
}

/* ===================== DERIVED ===================== */
function studentsSorted(){ return DB.students.slice().sort((a,b) => String(a.name||'').localeCompare(String(b.name||''), 'km')); }
function findStudent(id){ return DB.students.find(s => s.id === id); }

function studentAverage(sid){
  let sum = 0, n = 0;
  DB.assessments.forEach(a => {
    const row = DB.scores[a.id]; if(!row) return;
    const raw = row[sid]; if(raw === '' || raw == null) return;
    const v = Number(raw), max = Number(a.maxScore) || 100;
    if(isNaN(v) || max <= 0) return;
    sum += (v / max) * 100; n++;
  });
  return n ? sum / n : null;
}
function scoredCount(sid){
  let n = 0;
  DB.assessments.forEach(a => { const row = DB.scores[a.id]; if(row && row[sid] !== '' && row[sid] != null && !isNaN(Number(row[sid]))) n++; });
  return n;
}

function getStudentDay(sid, dateStr){ return (DB.attendance[dateStr] || {})[sid] || {}; }
function getStudentPeriod(sid, dateStr, periodNo){
  const day = getStudentDay(sid, dateStr);
  return day[periodNo] || 'P';
}
function setStudentPeriod(sid, dateStr, periodNo, status){
  DB.attendance[dateStr] = DB.attendance[dateStr] || {};
  DB.attendance[dateStr][sid] = DB.attendance[dateStr][sid] || {};
  if(status === 'P') delete DB.attendance[dateStr][sid][periodNo];
  else DB.attendance[dateStr][sid][periodNo] = status;
  
  if(!Object.keys(DB.attendance[dateStr][sid]).length) delete DB.attendance[dateStr][sid];
  if(!Object.keys(DB.attendance[dateStr]).length) delete DB.attendance[dateStr];
}
function clearStudentDay(sid, dateStr){
  if(DB.attendance[dateStr] && DB.attendance[dateStr][sid]){
    delete DB.attendance[dateStr][sid];
    if(!Object.keys(DB.attendance[dateStr]).length) delete DB.attendance[dateStr];
  }
}
function setStudentDayRange(sid, dateStr, periods, status){
  const periodSet = new Set(periods.map(p => String(p.no)));
  DB.attendance[dateStr] = DB.attendance[dateStr] || {};
  DB.attendance[dateStr][sid] = {};
  const allPeriods = getPeriodsForDate(dateStr, DB.meta);
  allPeriods.forEach(p => {
    if(periodSet.has(String(p.no)) && status !== 'P'){
      DB.attendance[dateStr][sid][p.no] = status;
    }
  });
  if(!Object.keys(DB.attendance[dateStr][sid]).length) delete DB.attendance[dateStr][sid];
  if(!Object.keys(DB.attendance[dateStr]).length) delete DB.attendance[dateStr];
}

function absenceHoursFor(sid, scope){
  let hours = 0;
  for(const date in DB.attendance){
    const day = DB.attendance[date][sid];
    if(!day) continue;
    for(const p in day){
      const st = day[p];
      if(st === 'A' || (scope === 'AL' && st === 'L')) hours++;
    }
  }
  return hours;
}
function absenceDetailsFor(sid, scope){
  const details = [];
  for(const date in DB.attendance){
    const day = DB.attendance[date][sid];
    if(!day) continue;
    let hours = 0;
    const periods = [];
    for(const p in day){
      const st = day[p];
      if(st === 'A' || (scope === 'AL' && st === 'L')){ hours++; periods.push(p); }
    }
    if(hours > 0) details.push({ date, hours, periods: periods.sort((a,b)=>a-b) });
  }
  details.sort((a,b) => b.date.localeCompare(a.date));
  return details;
}
function dayHoursStats(dateStr){
  const periods = getPeriodsForDate(dateStr, DB.meta);
  const total = periods.length;
  let absent = 0, late = 0, excused = 0;
  const studentsWithAbsence = new Set();
  for(const sid in (DB.attendance[dateStr] || {})){
    const day = DB.attendance[dateStr][sid];
    for(const p in day){
      const st = day[p];
      if(st === 'A'){ absent++; studentsWithAbsence.add(sid); }
      else if(st === 'L'){ late++; studentsWithAbsence.add(sid); }
      else if(st === 'E') excused++;
    }
  }
  return { total, absent, late, excused, studentsWithAbsence: studentsWithAbsence.size };
}
function letterGrade(pct){
  if(pct == null) return '—';
  if(pct >= 90) return 'A';
  if(pct >= 80) return 'B';
  if(pct >= 70) return 'C';
  if(pct >= 60) return 'D';
  return 'F';
}

/* ===================== UI STATE & ROUTER ===================== */
const UI = {
  tab: 'dashboard', studentSearch: '', attDate: todayStr(),
  scoreAssessment: '', noteFilter: 'all', editingStudentId: null, letterStudentId: null
};
const TAB_META = {
  dashboard:  { title:'ផ្ទាំងគ្រប់គ្រង',   sub:'ទិដ្ឋភាពទូទៅនៃសាលា' },
  students:   { title:'សិស្ស',            sub:'គ្រប់គ្រងបញ្ជីឈ្មោះសិស្ស' },
  attendance: { title:'វត្តមាន',          sub:'កត់ត្រាវត្តមានតាមម៉ោង' },
  grades:     { title:'ពិន្ទុ',            sub:'មុខវិជ្ជា ការវាយតម្លៃ និងលទ្ធផល' },
  notes:      { title:'កំណត់ចំណាំ',        sub:'ការសង្កេត និងការតាមដានសិស្ស' },
  letters:    { title:'អញ្ជើញមាតាបិតា',   sub:'លិខិតផ្លូវការសម្រាប់សិស្សដែលអវត្តមានច្រើនម៉ោង' },
  backup:     { title:'បម្រុងទុក & ស្តារ',  sub:'នាំចេញ និងស្តារទិន្នន័យ' }
};

function render(){
  const map = { dashboard:renderDashboard, students:renderStudents, attendance:renderAttendance, grades:renderGrades, notes:renderNotes, letters:renderLetters, backup:renderBackup };
  (map[UI.tab] || renderDashboard)();
  refreshChrome();
}
function go(tab){
  UI.tab = tab;
  $$('#nav .nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  $$('.tab').forEach(s => s.classList.toggle('active', s.id === 'tab-' + tab));
  const m = TAB_META[tab] || TAB_META.dashboard;
  $('#pageTitle').textContent = m.title;
  $('#pageSub').textContent = m.sub;
  render();
}

/* ===================== RENDER FUNCTIONS ===================== */
function refreshChrome(){
  const sub = DB.meta.schoolName || DB.meta.className || 'Cloud';
  $('#brandSub').textContent = sub;
  $('#studentCountText').textContent = DB.students.length + ' សិស្ស';
  updateBackupBanner();
}
function updateBackupBanner(){
  const banner = $('#backupBanner');
  const last = DB.meta.lastBackup;
  if(!DB.students.length){ banner.hidden = true; return; }
  let show = false, msg = '';
  if(!last){ show = true; msg = 'អ្នកមិនដែលនាំចេញបម្រុងទុកទេ។ សូមទាញយកឯកសារ JSON ដើម្បីរក្សាទុកបន្ថែម។'; }
  else {
    const days = (Date.now() - new Date(last).getTime()) / 86400000;
    if(days > 14){ show = true; msg = 'បម្រុងទុកចុងក្រោយ ' + Math.floor(days) + ' ថ្ងៃមុន។'; }
  }
  if(show){ $('#backupBannerText').textContent = msg; banner.hidden = false; }
  else banner.hidden = true;
}

function renderDashboard(){
  $('#stStudents').textContent = DB.students.length;
  $('#stStudentsSub').textContent = DB.students.length ? DB.subjects.length + ' មុខវិជ្ជា' : 'បន្ថែមសិស្សដំបូង';

  const today = todayStr();
  const periods = getPeriodsForDate(today, DB.meta);
  const stats = dayHoursStats(today);

  if(!periods.length){ $('#stAtt').textContent = '—'; $('#stAttSub').textContent = 'ថ្ងៃឈប់សម្រាក'; }
  else if(stats.absent + stats.late + stats.excused === 0 && stats.studentsWithAbsence === 0){ $('#stAtt').textContent = '0'; $('#stAttSub').textContent = 'គ្មានអវត្តមានថ្ងៃនេះ'; }
  else { $('#stAtt').textContent = stats.absent; $('#stAttSub').textContent = 'ម៉ោងអវត្តមាន · ' + stats.studentsWithAbsence + ' សិស្ស'; }

  const avgs = DB.students.map(s => studentAverage(s.id)).filter(v => v != null);
  if(avgs.length){
    const mean = avgs.reduce((a,b) => a+b, 0) / avgs.length;
    $('#stAvg').textContent = mean.toFixed(1) + '%'; $('#stAvgSub').textContent = avgs.length + ' សិស្ស';
  } else { $('#stAvg').textContent = '—'; $('#stAvgSub').textContent = 'គ្មានពិន្ទុ'; }

  if(DB.meta.lastBackup){ $('#stBackup').textContent = fmtDate(DB.meta.lastBackup.slice(0,10)); $('#stBackupSub').textContent = 'នាំចេញដោយជោគជ័យ'; }
  else { $('#stBackup').textContent = 'មិនដែល'; $('#stBackupSub').textContent = 'នាំចេញទិន្នន័យ'; }

  const recent = DB.notes.slice().sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,5);
  $('#dashNotes').innerHTML = recent.length
    ? recent.map(n => { const s = findStudent(n.studentId);
        return '<div class="note-item"><div class="meta"><b>' + esc(s ? s.name : '?') + '</b><span>' + esc(fmtDate(n.date)) + '</span></div>' + esc(n.text) + '</div>';
      }).join('')
    : '<div class="empty" style="padding:18px">គ្មានកំណត់ចំណាំនៅឡើយទេ។</div>';

  $('#setSchool').value = DB.meta.schoolName || '';
  $('#setClass').value  = DB.meta.className || '';
  $('#setSat').checked = DB.meta.schedule.saturday !== false;
  $('#setPM').checked  = DB.meta.schedule.afternoon !== false;
}

function renderStudents(){
  const q = UI.studentSearch.trim().toLowerCase();
  let list = studentsSorted();
  if(q) list = list.filter(s => [s.name, s.studentNo, s.guardian, s.phone, s.address].some(v => String(v||'').toLowerCase().includes(q)));

  const threshold = Number(DB.meta.letter.threshold) || 14;
  const scope = DB.meta.letter.scope || 'A';

  $('#studentsBody').innerHTML = list.map((s, i) => {
    const absH = absenceHoursFor(s.id, scope);
    const absCls = absH >= threshold ? 'a' : absH > 0 ? 'l' : 'p';
    const absTxt = '<span class="badge ' + absCls + '">' + absH + ' ម៉ោង</span>';
    const avg = studentAverage(s.id);
    const avgTxt = avg == null ? '<span class="badge gray">—</span>' : '<b>' + avg.toFixed(1) + '%</b>';
    return '<tr>' +
      '<td>' + (i+1) + '</td><td>' + esc(s.studentNo || '—') + '</td>' +
      '<td><b>' + esc(s.name) + '</b>' + (s.gender ? ' <span class="badge gray">' + esc(s.gender) + '</span>' : '') + '</td>' +
      '<td>' + esc(s.gender || '—') + '</td><td>' + esc(s.guardian || '—') + '</td><td>' + esc(s.phone || '—') + '</td>' +
      '<td>' + absTxt + '</td><td>' + avgTxt + '</td>' +
      '<td class="td-actions">' +
        '<button class="btn sm icon-only" data-letter="' + s.id + '" title="លិខិតអញ្ជើញ"><span class="icon" data-icon="mail"></span></button>' +
        '<button class="btn sm" data-edit="' + s.id + '">កែ</button>' +
        '<button class="btn sm danger" data-del="' + s.id + '">លុប</button>' +
      '</td></tr>';
  }).join('');
  fillIcons($('#studentsBody'));
  $('#studentsEmpty').hidden = list.length > 0;
}

function renderAttendance(){
  $('#attDate').value = UI.attDate;
  const periods = getPeriodsForDate(UI.attDate, DB.meta);
  const dayDesc = describeDay(UI.attDate);
  const di = $('#dayInfo'); di.innerHTML = dayDesc.html; di.classList.toggle('off', dayDesc.off); fillIcons(di);

  const list = studentsSorted();
  if(!periods.length){
    $('#attBody').innerHTML = '';
    $('#attEmpty').hidden = false;
    $('#attEmpty').innerHTML = '<span class="icon" data-icon="info"></span><div>ថ្ងៃនេះគ្មានថ្នាក់ — មិនចាំបាច់សម្គាល់វត្តមានទេ។</div>';
    fillIcons($('#attEmpty')); $('#attSummary').innerHTML = ''; return;
  }

  $('#attBody').innerHTML = list.map(s => {
    let cells = '';
    periods.forEach((p, idx) => {
      const st = getStudentPeriod(s.id, UI.attDate, p.no);
      const sep = (idx === 4) ? '<span class="sep"></span>' : '';
      cells += sep + '<button class="pcell st-' + st + '" data-sid="' + s.id + '" data-p="' + p.no + '" title="ម៉ោងទី ' + p.no + ' (' + p.time + ') — ' + STATUS[st] + '">' + p.no + '</button>';
    });

    const day = getStudentDay(s.id, UI.attDate);
    const counts = { A:0, L:0, E:0 };
    Object.values(day).forEach(v => { if(counts[v] != null) counts[v]++; });
    let summary = '';
    if(counts.A === 0 && counts.L === 0 && counts.E === 0) summary = '<span class="badge p">ពេញលេញ</span>';
    else summary = (counts.A ? '<span class="badge a">A ' + counts.A + '</span> ' : '') + (counts.L ? '<span class="badge l">L ' + counts.L + '</span> ' : '') + (counts.E ? '<span class="badge e">E ' + counts.E + '</span>' : '');

    const amPeriods = periods.filter(p => p.session === 'am');
    const pmPeriods = periods.filter(p => p.session === 'pm');

    return '<tr><td><b>' + esc(s.name) + '</b></td><td>' + esc(s.studentNo || '—') + '</td>' +
      '<td><div class="period-grid">' + cells + '</div></td><td>' + summary + '</td>' +
      '<td class="td-actions"><div class="quick-actions">' +
        '<button class="btn icon-only sm" data-quick="present" data-sid="' + s.id + '" title="វត្តមានទាំងអស់"><span class="icon" data-icon="check"></span></button>' +
        '<button class="btn icon-only sm danger" data-quick="absent" data-sid="' + s.id + '" title="អវត្តមានទាំងអស់"><span class="icon" data-icon="x"></span></button>' +
        (amPeriods.length ? '<button class="btn icon-only sm" data-quick="am" data-sid="' + s.id + '" title="អវត្តមានព្រឹក"><span class="icon" data-icon="sun"></span></button>' : '') +
        (pmPeriods.length ? '<button class="btn icon-only sm" data-quick="pm" data-sid="' + s.id + '" title="អវត្តមានល្ងាច"><span class="icon" data-icon="moon"></span></button>' : '') +
      '</div></td></tr>';
  }).join('');
  fillIcons($('#attBody'));
  $('#attEmpty').hidden = list.length > 0;

  const stats = dayHoursStats(UI.attDate);
  const totalPossible = list.length * periods.length;
  const presentHours = totalPossible - stats.absent;
  $('#attSummary').innerHTML = '<b>' + fmtDate(UI.attDate) + ':</b> ម៉ោងសិក្សាសរុប ' + totalPossible + ' ម៉ោង · <span class="badge p">មានវត្តមាន ' + presentHours + '</span> <span class="badge a">អវត្តមាន ' + stats.absent + '</span> <span class="badge l">យឺត ' + stats.late + '</span> <span class="badge e">សុំច្បាប់ ' + stats.excused + '</span>';
}

function renderGrades(){
  $('#subjectChips').innerHTML = DB.subjects.map((s,i) =>
    '<span class="chip">' + esc(s) + '<button data-subdel="' + i + '"><span class="icon" data-icon="x"></span></button></span>'
  ).join('') || '<div class="hint">គ្មានមុខវិជ្ជានៅឡើយទេ។</div>';
  fillIcons($('#subjectChips'));

  const subOpts = DB.subjects.map(s => '<option>' + esc(s) + '</option>').join('');
  const keepSub = $('#asSubject').value;
  $('#asSubject').innerHTML = subOpts || '<option value="">—</option>';
  if(keepSub) $('#asSubject').value = keepSub;

  $('#assessBody').innerHTML = DB.assessments.map(a => {
    const row = DB.scores[a.id] || {};
    const entered = Object.keys(row).filter(id => row[id] !== '' && row[id] != null && !isNaN(Number(row[id]))).length;
    return '<tr><td><b>' + esc(a.name) + '</b></td><td>' + esc(a.subject || '—') + '</td><td>' + esc(fmtDate(a.date)) + '</td><td>' + esc(a.maxScore) + '</td><td>' + entered + '/' + DB.students.length + '</td>' +
      '<td class="td-actions"><button class="btn sm danger" data-asdel="' + a.id + '">លុប</button></td></tr>';
  }).join('');
  $('#assessEmpty').hidden = DB.assessments.length > 0;

  const keep = UI.scoreAssessment;
  $('#scoreSelect').innerHTML = '<option value="">— ជ្រើសរើសការវាយតម្លៃ —</option>' + DB.assessments.map(a => '<option value="' + a.id + '">' + esc(a.name + ' · ' + (a.subject||'') + ' · ' + fmtDate(a.date)) + '</option>').join('');
  if(keep && DB.assessments.some(a => a.id === keep)) $('#scoreSelect').value = keep; else UI.scoreAssessment = '';
  renderScoreGrid();

  const rows = studentsSorted().filter(s => scoredCount(s.id) > 0).map(s => {
    const avg = studentAverage(s.id);
    const g = letterGrade(avg); const cls = avg >= 70 ? 'p' : avg >= 60 ? 'l' : 'a';
    return '<tr><td><b>' + esc(s.name) + '</b></td><td>' + scoredCount(s.id) + '</td><td>' + avg.toFixed(1) + '%</td><td><span class="badge ' + cls + '">' + g + '</span></td></tr>';
  });
  $('#reportBody').innerHTML = rows.join('');
  $('#reportEmpty').hidden = rows.length > 0;
}
function renderScoreGrid(){
  const a = DB.assessments.find(x => x.id === UI.scoreAssessment);
  if(!a){ $('#scoreBody').innerHTML = ''; $('#scoreEmpty').hidden = false; return; }
  $('#scoreEmpty').hidden = true;
  const row = DB.scores[a.id] || {};
  const max = Number(a.maxScore) || 100;
  $('#scoreBody').innerHTML = studentsSorted().map(s => {
    const v = row[s.id] == null ? '' : row[s.id];
    const pct = (v !== '' && !isNaN(Number(v))) ? ((Number(v)/max)*100) : null;
    return '<tr><td><b>' + esc(s.name) + '</b></td><td>' + esc(s.studentNo || '—') + '</td>' +
      '<td><input type="number" class="input score-input" data-sid="' + s.id + '" min="0" max="' + max + '" step="0.5" value="' + esc(v) + '" placeholder="—" style="padding:6px 9px"></td>' +
      '<td>' + (pct == null ? '<span class="badge gray">—</span>' : pct.toFixed(1) + '%') + '</td></tr>';
  }).join('');
}

function renderNotes(){
  const opts = '<option value="">— ជ្រើសរើសសិស្ស —</option>' + studentsSorted().map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('');
  const keepNote = $('#noteStudent').value;
  $('#noteStudent').innerHTML = opts; if(keepNote) $('#noteStudent').value = keepNote;
  if(!$('#noteDate').value) $('#noteDate').value = todayStr();

  $('#noteFilter').innerHTML = '<option value="all">សិស្សទាំងអស់</option>' + studentsSorted().map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('');
  $('#noteFilter').value = UI.noteFilter;

  let list = DB.notes.slice().sort((a,b) => (b.date||'').localeCompare(a.date||'') || (b.createdAt||'').localeCompare(a.createdAt||''));
  if(UI.noteFilter !== 'all') list = list.filter(n => n.studentId === UI.noteFilter);
  $('#notesList').innerHTML = list.length ? list.map(n => {
    const s = findStudent(n.studentId);
    return '<div class="note-item"><div class="meta"><b>' + esc(s ? s.name : '?') + '</b><span>' + esc(fmtDate(n.date)) +
      ' <button class="btn sm danger" data-notedel="' + n.id + '" style="margin-left:8px">លុប</button></span></div>' + esc(n.text) + '</div>';
  }).join('') : '<div class="empty">គ្មានកំណត់ចំណាំ។</div>';
}

function renderLetters(){
  const L = DB.meta.letter;
  $('#letterThreshold').value = L.threshold;
  $('#letterScope').value = L.scope;
  $('#letterMeetDate').value = L.meetingDate || tomorrowStr();
  $('#letterMeetTime').value = L.meetingTime || '09:00';
  $('#letterMeetPlace').value = L.meetingPlace || '';
  $('#letterPrincipal').value = L.principal || '';

  const threshold = Number(L.threshold) || 14;
  const scope = L.scope || 'A';
  const rows = [];
  studentsSorted().forEach(s => {
    const hours = absenceHoursFor(s.id, scope);
    if(hours >= threshold) rows.push({ s, hours, days: absenceDetailsFor(s.id, scope).length });
  });
  $('#letterCandidates').innerHTML = rows.map(r => {
    return '<tr><td><b>' + esc(r.s.name) + '</b></td><td>' + esc(r.s.studentNo || '—') + '</td><td>' + esc(r.s.guardian || '—') + '</td>' +
      '<td><span class="badge a">' + r.hours + ' ម៉ោង</span></td><td>' + r.days + ' ថ្ងៃ</td>' +
      '<td class="td-actions"><button class="btn sm primary" data-genletter="' + r.s.id + '"><span class="icon" data-icon="mail"></span>បង្កើតលិខិត</button></td></tr>';
  }).join('');
  fillIcons($('#letterCandidates'));
  $('#letterEmpty').hidden = rows.length > 0;
}
function saveLetterSettings(){
  const L = DB.meta.letter;
  L.threshold = Number($('#letterThreshold').value) || 14;
  L.scope = $('#letterScope').value;
  L.meetingDate = $('#letterMeetDate').value;
  L.meetingTime = $('#letterMeetTime').value || '09:00';
  L.meetingPlace = $('#letterMeetPlace').value.trim();
  L.principal = $('#letterPrincipal').value.trim();
  saveDB(); renderLetters(); toast('រក្សាទុកការកំណត់លិខិតរួចរាល់');
}

function renderBackup(){
  $('#backupStatusText').innerHTML =
    '<b>សិស្ស:</b> ' + DB.students.length + '<br>' +
    '<b>ថ្ងៃវត្តមាន:</b> ' + Object.keys(DB.attendance).length + '<br>' +
    '<b>ការវាយតម្លៃ:</b> ' + DB.assessments.length + '<br>' +
    '<b>កំណត់ចំណាំ:</b> ' + DB.notes.length + '<br>' +
    '<b>បម្រុងទុកចុងក្រោយ:</b> ' + (DB.meta.lastBackup ? fmtDate(DB.meta.lastBackup.slice(0,10)) : 'មិនដែល');
}

/* ===================== LETTER GENERATION ===================== */
function buildLetter(studentId){
  const s = findStudent(studentId); if(!s) return '';
  const L = DB.meta.letter;
  const scope = L.scope || 'A';
  const details = absenceDetailsFor(s.id, scope);
  const totalHours = details.reduce((a, d) => a + d.hours, 0);
  const totalDays = details.length;
  const schoolName = DB.meta.schoolName || 'សាលា';
  const className = DB.meta.className || '—';
  const guardian = s.guardian || 'មាតាបិតា / អ្នកអភិបាល';
  const today = new Date();
  const todayKh = 'ថ្ងៃទី' + today.getDate() + ' ខែ' + KHMER_MONTHS[today.getMonth()] + ' ឆ្នាំ' + today.getFullYear();
  const meetDateKh = L.meetingDate ? fmtDateLong(L.meetingDate) : '(សូមបំពេញកាលបរិច្ឆេទ)';
  const meetTime = L.meetingTime || '09:00';
  const meetPlace = L.meetingPlace || 'សាលារៀន';
  const principal = L.principal || 'នាយកសាលា';
  const shown = details.slice(0, 10).map(d => '<div>- ' + esc(fmtDate(d.date)) + ' — <b>' + d.hours + ' ម៉ោង</b> (ម៉ោងទី ' + esc(d.periods.join(', ')) + ')</div>').join('');
  const moreNote = details.length > 10 ? '<div style="margin-top:4px;color:#555">... និងថ្ងៃផ្សេងទៀត ' + (details.length - 10) + ' ថ្ងៃ</div>' : '';

  return '<div class="letter">' +
    '<div class="motto">ព្រះរាជាណាចក្រកម្ពុជា</div><div class="motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div><div class="motto-line"></div>' +
    '<div class="letter-meta"><div class="school-name">' + esc(schoolName) + '</div><div class="letter-no">លេខ: ......../ ' + esc(String(today.getFullYear())) + '</div></div>' +
    '<div class="letter-date">' + esc(todayKh) + '</div>' +
    '<div class="letter-subject"><b>រឿង: ការអញ្ជើញមាតាបិតា / អ្នកអភិបាលមកសាលា</b></div>' +
    '<div class="letter-to">អ្នកនាង / លោក ' + esc(guardian) + '</div>' +
    '<div class="letter-body">' +
      '<p>យោងតាមកំណត់ត្រាវត្តមានរបស់សាលា សិស្ស <b>' + esc(s.name) + '</b>' + (s.studentNo ? ' (លេខសម្គាល់: ' + esc(s.studentNo) + ')' : '') + ' នៃថ្នាក់ <b>' + esc(className) + '</b> បានអវត្តមានចំនួន <b>' + totalHours + ' ម៉ោង</b>' + (totalDays > 1 ? ' ក្នុងរយៈពេល ' + totalDays + ' ថ្ងៃ' : '') + ' ក្នុងរយៈពេលកន្លងមក។</p>' +
      '<p>ការអវត្តមានញឹកញាប់ប៉ះពាល់យ៉ាងខ្លាំងដល់លទ្ធផលសិក្សារបស់សិស្ស។ ដើម្បីធានាគុណភាពនៃការសិក្សា សាលាសូមអញ្ជើញ <b>' + esc(guardian) + '</b> មកជួបពិភាក្សាជាមួយគ្រូបន្ទុកថ្នាក់ និងគណៈគ្រប់គ្រងសាលា នៅ៖</p>' +
      '<div class="letter-meeting"><div>• កាលបរិច្ឆេទ: <b>' + esc(meetDateKh) + '</b></div><div>• វេលាម៉ោង: <b>' + esc(meetTime) + '</b></div><div>• ទីតាំង: <b>' + esc(meetPlace) + '</b></div></div>' +
      (shown ? '<div class="letter-dates"><b>កាលបរិច្ឆេទអវត្តមានចុងក្រោយ:</b>' + shown + moreNote + '</div>' : '') +
      '<p>សូមអរគុណចំពោះការយោគយល់ និងកិច្ចសហការរបស់អ្នកនាង / លោក។</p>' +
    '</div>' +
    '<div class="letter-sign"><div>គោរពដោយក្តីស្មោះ</div><div class="sign-name">' + esc(principal) + '</div></div></div>';
}
function openLetter(studentId){
  const s = findStudent(studentId); if(!s){ toast('រកមិនឃើញសិស្ស', true); return; }
  UI.letterStudentId = studentId;
  $('#letterBody').innerHTML = buildLetter(studentId);
  $('#letterOverlay').classList.add('open');
}
function closeLetter(){ $('#letterOverlay').classList.remove('open'); UI.letterStudentId = null; }

/* ===================== EXCEL EXPORTS ===================== */
function headerStyle(){ return 'background:#4f46e5;color:#fff;font-weight:bold;text-align:center;padding:6px'; }
function subHeaderStyle(){ return 'background:#eef2ff;color:#1e293b;font-weight:bold;text-align:center;padding:5px'; }

function exportAttendanceToday(){
  const date = UI.attDate || todayStr();
  const periods = getPeriodsForDate(date, DB.meta);
  const list = studentsSorted();
  if(!periods.length){ toast('ថ្ងៃនេះគ្មានថ្នាក់ទេ។', true); return; }
  const totalCols = 3 + periods.length + 4;
  let html = '<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse">';
  html += '<tr><th colspan="' + totalCols + '" style="' + headerStyle() + ';font-size:14pt">' + esc(DB.meta.schoolName || 'សាលា') + '</th></tr>';
  html += '<tr><th colspan="' + totalCols + '" style="' + subHeaderStyle() + '">បញ្ជីវត្តមាន — ' + esc(fmtDate(date)) + (DB.meta.className ? ' — ថ្នាក់ ' + esc(DB.meta.className) : '') + '</th></tr>';
  let head = '<tr style="background:#f1f5f9;font-weight:bold"><th>#</th><th>លេខសម្គាល់</th><th>ឈ្មោះ</th>';
  periods.forEach(p => head += '<th>ម៉ោងទី' + p.no + '<br><span style="font-weight:normal;font-size:8pt">' + p.time + '</span></th>');
  head += '<th>A</th><th>L</th><th>E</th><th>សរុប</th></tr>'; html += head;

  list.forEach((s, i) => {
    let a = 0, l = 0, e = 0;
    let row = '<tr><td>' + (i+1) + '</td><td>' + esc(s.studentNo || '') + '</td><td>' + esc(s.name) + '</td>';
    periods.forEach(p => {
      const st = getStudentPeriod(s.id, date, p.no);
      if(st === 'A'){ a++; row += '<td style="text-align:center;background:#fee2e2;color:#b91c1c;font-weight:bold">A</td>'; }
      else if(st === 'L'){ l++; row += '<td style="text-align:center;background:#fef3c7;color:#b45309;font-weight:bold">L</td>'; }
      else if(st === 'E'){ e++; row += '<td style="text-align:center;background:#ede9fe;color:#6d28d9;font-weight:bold">E</td>'; }
      else row += '<td style="text-align:center">P</td>';
    });
    row += '<td style="text-align:center;font-weight:bold;color:#b91c1c">' + a + '</td><td style="text-align:center;font-weight:bold;color:#b45309">' + l + '</td><td style="text-align:center;font-weight:bold;color:#6d28d9">' + e + '</td><td style="text-align:center">' + (a + l + e) + '</td></tr>';
    html += row;
  });
  html += '</table>';
  downloadExcel('attendance-' + date + '.xls', html); toast('នាំចេញវត្តមានថ្ងៃនេះរួចរាល់');
}

function exportAttendanceMonth(){
  const now = new Date(); const year = now.getFullYear(); const month = now.getMonth();
  const monthKh = KHMER_MONTHS[month]; const daysInMonth = new Date(year, month + 1, 0).getDate(); const list = studentsSorted();
  const dayCols = [];
  for(let d = 1; d <= daysInMonth; d++){
    const dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const periods = getPeriodsForDate(dateStr, DB.meta);
    if(periods.length) dayCols.push({ day: d, dateStr, periodCount: periods.length });
  }
  const totalCols = 3 + dayCols.length + 4;
  let html = '<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse">';
  html += '<tr><th colspan="' + totalCols + '" style="' + headerStyle() + ';font-size:14pt">' + esc(DB.meta.schoolName || 'សាលា') + '</th></tr>';
  html += '<tr><th colspan="' + totalCols + '" style="' + subHeaderStyle() + '">បញ្ជីវត្តមានខែ ' + monthKh + ' ឆ្នាំ ' + year + ' (ម៉ោងអវត្តមានក្នុងមួយថ្ងៃ)' + (DB.meta.className ? ' — ថ្នាក់ ' + esc(DB.meta.className) : '') + '</th></tr>';
  let head = '<tr style="background:#f1f5f9;font-weight:bold"><th>#</th><th>លេខសម្គាល់</th><th>ឈ្មោះ</th>';
  dayCols.forEach(c => head += '<th>' + c.day + '</th>');
  head += '<th>សរុប A</th><th>សរុប L</th><th>សរុប E</th><th>អវត្តមាន %</th></tr>'; html += head;

  list.forEach((s, i) => {
    let totalA = 0, totalL = 0, totalE = 0, totalPoss = 0;
    let row = '<tr><td>' + (i+1) + '</td><td>' + esc(s.studentNo || '') + '</td><td>' + esc(s.name) + '</td>';
    dayCols.forEach(c => {
      totalPoss += c.periodCount;
      const day = (DB.attendance[c.dateStr] || {})[s.id] || {};
      let a = 0, l = 0, e = 0;
      Object.values(day).forEach(v => { if(v === 'A') a++; else if(v === 'L') l++; else if(v === 'E') e++; });
      totalA += a; totalL += l; totalE += e;
      const color = a > 0 ? 'background:#fee2e2;color:#b91c1c;font-weight:bold' : (l > 0 || e > 0 ? 'background:#fef3c7;color:#b45309' : '');
      row += '<td style="text-align:center;' + color + '">' + (a || '') + '</td>';
    });
    row += '<td style="text-align:center;font-weight:bold;color:#b91c1c">' + totalA + '</td><td style="text-align:center;font-weight:bold;color:#b45309">' + totalL + '</td><td style="text-align:center;font-weight:bold;color:#6d28d9">' + totalE + '</td>';
    const pct = totalPoss ? ((totalA / totalPoss) * 100).toFixed(1) + '%' : '—';
    row += '<td style="text-align:center">' + pct + '</td></tr>'; html += row;
  });
  html += '</table>';
  const stamp = year + '-' + String(month+1).padStart(2,'0');
  downloadExcel('attendance-month-' + stamp + '.xls', html); toast('នាំចេញវត្តមានប្រចាំខែរួចរាល់');
}

function exportAttendanceAll(){
  const dates = Object.keys(DB.attendance).filter(d => getPeriodsForDate(d, DB.meta).length).sort(); const list = studentsSorted();
  const totalCols = 3 + dates.length + 4;
  let html = '<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse">';
  html += '<tr><th colspan="' + totalCols + '" style="' + headerStyle() + ';font-size:14pt">' + esc(DB.meta.schoolName || 'សាលា') + '</th></tr>';
  html += '<tr><th colspan="' + totalCols + '" style="' + subHeaderStyle() + '">បញ្ជីវត្តមានទាំងអស់ (' + dates.length + ' ថ្ងៃ)' + (DB.meta.className ? ' — ថ្នាក់ ' + esc(DB.meta.className) : '') + '</th></tr>';
  let head = '<tr style="background:#f1f5f9;font-weight:bold"><th>#</th><th>លេខសម្គាល់</th><th>ឈ្មោះ</th>';
  dates.forEach(d => head += '<th>' + esc(d) + '</th>');
  head += '<th>សរុប A</th><th>សរុប L</th><th>សរុប E</th><th>ម៉ោងសិក្សា</th></tr>'; html += head;

  list.forEach((s, i) => {
    let totalA = 0, totalL = 0, totalE = 0, totalPoss = 0;
    let row = '<tr><td>' + (i+1) + '</td><td>' + esc(s.studentNo || '') + '</td><td>' + esc(s.name) + '</td>';
    dates.forEach(d => {
      totalPoss += getPeriodsForDate(d, DB.meta).length;
      const day = (DB.attendance[d] || {})[s.id] || {};
      let a = 0, l = 0, e = 0;
      Object.values(day).forEach(v => { if(v === 'A') a++; else if(v === 'L') l++; else if(v === 'E') e++; });
      totalA += a; totalL += l; totalE += e;
      const color = a > 0 ? 'background:#fee2e2;color:#b91c1c;font-weight:bold' : '';
      row += '<td style="text-align:center;' + color + '">' + (a || '') + '</td>';
    });
    row += '<td style="text-align:center;font-weight:bold;color:#b91c1c">' + totalA + '</td><td style="text-align:center;font-weight:bold;color:#b45309">' + totalL + '</td><td style="text-align:center;font-weight:bold;color:#6d28d9">' + totalE + '</td><td style="text-align:center">' + totalPoss + '</td></tr>';
    html += row;
  });
  html += '</table>';
  downloadExcel('attendance-all-' + todayStr() + '.xls', html); toast('នាំចេញវត្តមានទាំងអស់រួចរាល់');
}

function exportStudentsCSV(){
  const head = ['Student ID','Name','Gender','Date of Birth','Guardian','Phone','Address','Notes','Average %'];
  const lines = [head.join(',')];
  studentsSorted().forEach(s => {
    const avg = studentAverage(s.id);
    const cells = [s.studentNo, s.name, s.gender, s.dob, s.guardian, s.phone, s.address, s.notes, avg == null ? '' : avg.toFixed(1)];
    lines.push(cells.map(c => { const v = String(c == null ? '' : c); return /[",\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v; }).join(','));
  });
  download('students-' + todayStr() + '.csv', '\uFEFF' + lines.join('\r\n'), 'text/csv;charset=utf-8'); toast('នាំចេញ CSV រួចរាល់');
}

function exportJSON(){
  const payload = { app:'student-manager-kh', version: 3, exportedAt: new Date().toISOString(), data: DB };
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
  const base = (DB.meta.className || DB.meta.schoolName || 'school').replace(/[^\w\-]+/g,'_');
  download('backup-' + base + '-' + stamp + '.json', JSON.stringify(payload, null, 2), 'application/json');
  DB.meta.lastBackup = new Date().toISOString();
  saveDB(); render(); toast('ទាញយកឯកសារបម្រុងទុករួចរាល់');
}

function importJSON(text, mode){
  let parsed; try { parsed = JSON.parse(text); } catch(e){ toast('ឯកសារមិនត្រឹមត្រូវ។', true); return; }
  const incoming = normalize(parsed && parsed.data ? parsed.data : parsed);
  if(mode === 'replace'){
    if(!confirm('ជំនួសទិន្នន័យទាំងអស់?\nមិនអាចត្រឡប់វិញបានទេ។')) return;
    DB = incoming; DB.meta.lastBackup = new Date().toISOString(); saveDB(); render(); toast('ស្តារបាន ' + DB.students.length + ' សិស្ស');
  } else { toast('មុខងារនេះមិនទាន់គាំទ្រទេ។', true); }
}

/* ===================== ACTIONS & EVENT LISTENERS ===================== */
function openStudentModal(id){
  UI.editingStudentId = id || null;
  const s = id ? findStudent(id) : null;
  $('#modalTitle').textContent = s ? 'កែព័ត៌មានសិស្ស' : 'បន្ថែមសិស្ស';
  $('#fNo').value = s ? (s.studentNo||'') : ''; $('#fName').value = s ? (s.name||'') : '';
  $('#fGender').value = s ? (s.gender||'') : ''; $('#fDob').value = s ? (s.dob||'') : '';
  $('#fGuardian').value = s ? (s.guardian||'') : ''; $('#fPhone').value = s ? (s.phone||'') : '';
  $('#fAddress').value = s ? (s.address||'') : ''; $('#fNotes').value = s ? (s.notes||'') : '';
  $('#overlay').classList.add('open'); setTimeout(()=> $('#fName').focus(), 40);
}
function closeModal(){ $('#overlay').classList.remove('open'); UI.editingStudentId = null; }
function saveStudentFromModal(){
  const name = $('#fName').value.trim(); if(!name){ toast('ត្រូវបំពេញឈ្មោះ។', true); $('#fName').focus(); return; }
  const data = { studentNo: $('#fNo').value.trim(), name, gender: $('#fGender').value, dob: $('#fDob').value, guardian: $('#fGuardian').value.trim(), phone: $('#fPhone').value.trim(), address: $('#fAddress').value.trim(), notes: $('#fNotes').value.trim() };
  if(UI.editingStudentId){ const s = findStudent(UI.editingStudentId); if(s) Object.assign(s, data); toast('បានកែសិស្ស'); }
  else { DB.students.push(Object.assign({ id: uid(), createdAt: new Date().toISOString() }, data)); toast('បានបន្ថែមសិស្ស'); }
  saveDB(); closeModal(); render();
}
function deleteStudent(id){
  const s = findStudent(id); if(!s) return;
  if(!confirm('លុបសិស្ស "' + s.name + '"?\nវត្តមាន ពិន្ទុ និងចំណាំក៏នឹងលុបដែរ។')) return;
  DB.students = DB.students.filter(x => x.id !== id);
  for(const d in DB.attendance) { delete DB.attendance[d][id]; if(!Object.keys(DB.attendance[d]).length) delete DB.attendance[d]; }
  for(const a in DB.scores) delete DB.scores[a][id]; DB.notes = DB.notes.filter(n => n.studentId !== id);
  saveDB(); render(); toast('បានលុបសិស្ស');
}

// Init listeners
function setupEventListeners(){
  $('#loginBtn').addEventListener('click', async () => {
    const email = $('#loginEmail').value.trim(); const password = $('#loginPassword').value;
    const errEl = $('#loginError'); const btn = $('#loginBtn');
    errEl.textContent = '';
    if(!supabaseClient){ errEl.textContent = 'Cannot connect to Supabase (library failed to load). Check your internet / refresh the page.'; return; }
    if(!email || !password){ errEl.textContent = 'Please enter email and password.'; return; }
    btn.textContent = '...'; btn.disabled = true;
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if(error) throw error;
      currentUser = data.user; await loadDataFromCloud();
    } catch(e) {
      console.error(e);
      errEl.textContent = e.message || String(e);
    } finally {
      btn.textContent = 'ចូល (Log In)'; btn.disabled = false;
    }
  });
  const doLogout = async () => { if(supabaseClient) await supabaseClient.auth.signOut(); location.reload(); };
  $('#logoutBtn').addEventListener('click', doLogout);
  $('#logoutBtnTop').addEventListener('click', () => { if(confirm('ចាកចេញ?')) doLogout(); });
  setupTableStacking();
  $('#nav').addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if(b) go(b.dataset.tab); });
  
  $('#saveSettingsBtn').addEventListener('click', () => { DB.meta.schoolName = $('#setSchool').value.trim(); DB.meta.className = $('#setClass').value.trim(); DB.meta.schedule = { saturday: $('#setSat').checked, afternoon: $('#setPM').checked }; saveDB(); render(); toast('រក្សាទុករួចរាល់'); });
  $('#addStudentBtn').addEventListener('click', () => openStudentModal(null));
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalSave').addEventListener('click', saveStudentFromModal);
  $('#studentSearch').addEventListener('input', e => { UI.studentSearch = e.target.value; renderStudents(); });
  $('#studentsBody').addEventListener('click', e => {
    const ed = e.target.closest('[data-edit]'); const del = e.target.closest('[data-del]'); const let_ = e.target.closest('[data-letter]');
    if(ed) openStudentModal(ed.dataset.edit); if(del) deleteStudent(del.dataset.del); if(let_) openLetter(let_.dataset.letter);
  });
  $('#exportCsvBtn').addEventListener('click', exportStudentsCSV);
  
  $('#attDate').addEventListener('change', e => { UI.attDate = e.target.value || todayStr(); renderAttendance(); });
  $('#attBody').addEventListener('click', e => {
    const btn = e.target.closest('.pcell');
    if(btn) {
      const sid = btn.dataset.sid, p = btn.dataset.p;
      const cur = getStudentPeriod(sid, UI.attDate, p);
      const next = { P:'A', A:'L', L:'E', E:'P' }[cur];
      setStudentPeriod(sid, UI.attDate, p, next); saveDB(); renderAttendance(); return;
    }
    const q = e.target.closest('[data-quick]');
    if(q) {
      const sid = q.dataset.sid; const periods = getPeriodsForDate(UI.attDate, DB.meta); if(!periods.length) return;
      const action = q.dataset.quick;
      if(action === 'present') clearStudentDay(sid, UI.attDate);
      else if(action === 'absent') setStudentDayRange(sid, UI.attDate, periods, 'A');
      else if(action === 'am') setStudentDayRange(sid, UI.attDate, periods.filter(p=>p.session==='am'), 'A');
      else if(action === 'pm') setStudentDayRange(sid, UI.attDate, periods.filter(p=>p.session==='pm'), 'A');
      saveDB(); renderAttendance(); return;
    }
  });
  $('#attClear').addEventListener('click', () => { if(!DB.attendance[UI.attDate]) return; if(!confirm('សម្អាតវត្តមានថ្ងៃ ' + fmtDate(UI.attDate) + '?')) return; delete DB.attendance[UI.attDate]; saveDB(); renderAttendance(); });
  $('#xlsToday').addEventListener('click', exportAttendanceToday);
  $('#xlsMonth').addEventListener('click', exportAttendanceMonth);
  $('#xlsAll').addEventListener('click', exportAttendanceAll);

  // Backup
  $('#exportJsonBtn').addEventListener('click', exportJSON);
  $('#importJsonBtn').addEventListener('click', () => $('#jsonFile').click());
  $('#jsonFile').addEventListener('change', e => { const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = () => { importJSON(String(r.result), 'replace'); e.target.value = ''; }; r.readAsText(f, 'utf-8'); });
  $('#wipeBtn').addEventListener('click', () => { if(!confirm('លុបទិន្នន័យទាំងអស់? មិនអាចត្រឡប់វិញបាន។')) return; DB = defaultData(); saveDB(); render(); toast('លុបទិន្នន័យទាំងអស់'); });
  $('#letterPrintBtn').addEventListener('click', () => { document.body.classList.add('printing-letter'); setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove('printing-letter'), 500); }, 100); });
  $('#letterClose').addEventListener('click', closeLetter);
  $('#letterCancel').addEventListener('click', closeLetter);

  /* ---- handlers that were missing ---- */
  // Backup banner
  $('#backupBannerBtn').addEventListener('click', exportJSON);

  // CSV import (same column order as the CSV export)
  $('#importCsvBtn').addEventListener('click', () => $('#csvFile').click());
  $('#csvFile').addEventListener('change', e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = () => { importStudentsCSV(String(r.result)); e.target.value = ''; };
    r.readAsText(f, 'utf-8');
  });

  // Subjects
  $('#addSubjectBtn').addEventListener('click', () => {
    const v = $('#newSubject').value.trim(); if(!v) return;
    if(DB.subjects.includes(v)){ toast('មានមុខវិជ្ជានេះរួចហើយ', true); return; }
    DB.subjects.push(v); $('#newSubject').value = ''; saveDB(); renderGrades(); toast('បានបន្ថែមមុខវិជ្ជា');
  });
  $('#subjectChips').addEventListener('click', e => {
    const b = e.target.closest('[data-subdel]'); if(!b) return;
    const i = Number(b.dataset.subdel);
    if(!confirm('លុបមុខវិជ្ជា "' + DB.subjects[i] + '"?')) return;
    DB.subjects.splice(i, 1); saveDB(); renderGrades();
  });

  // Assessments & scores
  $('#addAssessmentBtn').addEventListener('click', () => {
    const name = $('#asName').value.trim(); if(!name){ toast('ត្រូវបំពេញឈ្មោះការវាយតម្លៃ។', true); return; }
    const a = { id: uid(), name, subject: $('#asSubject').value, date: $('#asDate').value || todayStr(), maxScore: Number($('#asMax').value) || 100 };
    DB.assessments.push(a); DB.scores[a.id] = {};
    $('#asName').value = ''; saveDB(); renderGrades(); toast('បានបន្ថែមការវាយតម្លៃ');
  });
  $('#assessBody').addEventListener('click', e => {
    const b = e.target.closest('[data-asdel]'); if(!b) return;
    if(!confirm('លុបការវាយតម្លៃនេះ?')) return;
    const id = b.dataset.asdel;
    DB.assessments = DB.assessments.filter(a => a.id !== id); delete DB.scores[id];
    if(UI.scoreAssessment === id) UI.scoreAssessment = '';
    saveDB(); renderGrades();
  });
  $('#scoreSelect').addEventListener('change', e => { UI.scoreAssessment = e.target.value; renderScoreGrid(); });
  $('#scoreBody').addEventListener('change', e => {
    const inp = e.target.closest('.score-input'); if(!inp || !UI.scoreAssessment) return;
    const a = DB.assessments.find(x => x.id === UI.scoreAssessment); if(!a) return;
    DB.scores[a.id] = DB.scores[a.id] || {};
    const v = inp.value.trim();
    if(v === '') delete DB.scores[a.id][inp.dataset.sid]; else DB.scores[a.id][inp.dataset.sid] = Number(v);
    saveDB(); renderGrades();
  });

  // Notes
  $('#addNoteBtn').addEventListener('click', () => {
    const sid = $('#noteStudent').value, text = $('#noteText').value.trim();
    if(!sid){ toast('សូមជ្រើសរើសសិស្ស។', true); return; }
    if(!text){ toast('សូមសរសេរកំណត់ចំណាំ។', true); return; }
    DB.notes.push({ id: uid(), studentId: sid, date: $('#noteDate').value || todayStr(), text, createdAt: new Date().toISOString() });
    $('#noteText').value = ''; saveDB(); renderNotes(); toast('បានរក្សាទុកកំណត់ចំណាំ');
  });
  $('#noteFilter').addEventListener('change', e => { UI.noteFilter = e.target.value; renderNotes(); });
  $('#notesList').addEventListener('click', e => {
    const b = e.target.closest('[data-notedel]'); if(!b) return;
    if(!confirm('លុបកំណត់ចំណាំនេះ?')) return;
    DB.notes = DB.notes.filter(n => n.id !== b.dataset.notedel); saveDB(); renderNotes();
  });

  // Parent invitation letters
  $('#letterSaveBtn').addEventListener('click', saveLetterSettings);
  $('#letterCandidates').addEventListener('click', e => {
    const b = e.target.closest('[data-genletter]'); if(b) openLetter(b.dataset.genletter);
  });
}

// Mobile: give every cell of a stacked table its column title (shown as a label on phones)
function stackTables(){
  document.querySelectorAll('table[data-stack]').forEach(t => {
    const heads = [...t.querySelectorAll('thead th')].map(th => th.textContent.trim());
    t.parentElement.classList.add('stacked');
    t.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach((td, i) => {
      const label = heads[i] || '';
      if(td.getAttribute('data-label') !== label) td.setAttribute('data-label', label);
    }));
  });
}
function setupTableStacking(){
  let queued = false;
  const run = () => { queued = false; stackTables(); };
  new MutationObserver(() => { if(!queued){ queued = true; requestAnimationFrame(run); } })
    .observe(document.querySelector('.content'), { childList: true, subtree: true });
  stackTables();
}

// Minimal CSV parser + importer for students
function parseCSV(text){
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/^\uFEFF/, '');
  for(let i = 0; i < text.length; i++){
    const c = text[i];
    if(q){ if(c === '"'){ if(text[i+1] === '"'){ cell += '"'; i++; } else q = false; } else cell += c; }
    else if(c === '"') q = true;
    else if(c === ','){ row.push(cell); cell = ''; }
    else if(c === '\n'){ row.push(cell); rows.push(row); row = []; cell = ''; }
    else if(c !== '\r') cell += c;
  }
  if(cell !== '' || row.length){ row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}
function importStudentsCSV(text){
  const rows = parseCSV(text);
  if(rows.length < 2){ toast('ឯកសារ CSV គ្មានទិន្នន័យ។', true); return; }
  let added = 0;
  rows.slice(1).forEach(r => {
    const name = (r[1] || '').trim(); if(!name) return;
    DB.students.push({ id: uid(), createdAt: new Date().toISOString(),
      studentNo: (r[0]||'').trim(), name, gender: (r[2]||'').trim(), dob: (r[3]||'').trim(),
      guardian: (r[4]||'').trim(), phone: (r[5]||'').trim(), address: (r[6]||'').trim(), notes: (r[7]||'').trim() });
    added++;
  });
  saveDB(); render(); toast('បាននាំចូល ' + added + ' សិស្ស');
}

// Load from Cloud
async function loadDataFromCloud() {
  setSyncStatus('saving');
  const { data, error } = await supabaseClient.from('teacher_data').select('data').eq('user_id', currentUser.id).single();
  if (error && error.code !== 'PGRST116') { toast('Error loading data', true); setSyncStatus('error'); return; }
  
  if (data && data.data) {
    DB = normalize(data.data);
  } else {
    DB = defaultData();
  }
  
  $('#loginScreen').style.display = 'none';
  $('#appContainer').style.display = 'flex';
  setSyncStatus('saved');
  fillIcons();
  $('#attDate').value = UI.attDate;
  go('dashboard');
}

// Check session on boot
async function checkSession() {
  fillIcons();
  setupEventListeners(); // attach once at boot so the Log In button works before login
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      currentUser = session.user;
      loadDataFromCloud();
    }
  } catch(e) {
    console.error(e);
    toast('កំហុសក្នុងការភ្ជាប់ទៅ Cloud', true);
  }
}
checkSession();

})();
