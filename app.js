(function(){
'use strict';

/* ===================== SUPABASE SETUP ===================== */
// PASTE YOUR KEYS HERE:
const SUPABASE_URL = 'https://sujfnfuvkaehkjlsyjsl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2VUAGTApwhyZ78DXN-NS0w_vxyPDeV8';

let supabaseClient = null;
let currentUser = null;
let currentRole = null;
let currentClassId = null;
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
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  teacher:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  monitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>',
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
      grading: { divisor: 14.4, maxAvg: 50 },
      honorSchool: 'វិទ្យាល័យសម្តេចក្រុមព្រះ...អង្គរនាប', teacherName: 'ជុំ សុផា', honorPlace: 'វិ.អង្គរនាប',
      schedule: { saturday: true, afternoon: true },
      letter: {
        threshold: 14, scope: 'A',
        meetingDate: tomorrowStr(), meetingTime: '09:00',
        meetingPlace: 'ការិយាល័យនាយកសាលា', principal: '',
        office: '', school: '', signPlace: '', issueDate: '', places: []
      }
    },
    students: [],
    subjects: ['គណិតវិទ្យា','អក្សរសាស្ត្រខ្មែរ','ភាសាអង់គ្លេស','វិទ្យាសាស្ត្រ'],
    assessments: [],
    scores: {},
    tests: [],
    testScores: {},
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
  d.meta.grading = Object.assign({}, base.meta.grading, (raw && raw.meta && raw.meta.grading) || {});
  ['students','subjects','assessments','notes','tests'].forEach(k => { if(!Array.isArray(d[k])) d[k] = []; });
  ['scores','attendance','testScores'].forEach(k => { if(!d[k] || typeof d[k] !== 'object' || Array.isArray(d[k])) d[k] = {}; });
  d.students = d.students.filter(s => s && typeof s === 'object').map(s => Object.assign({ id: uid() }, s));
  d.notes = d.notes.filter(n => n && typeof n === 'object').map(n => Object.assign({ id: uid() }, n));
  d.assessments = d.assessments.filter(a => a && typeof a === 'object').map(a => Object.assign({ id: uid() }, a));
  d.tests = d.tests.filter(t => t && typeof t === 'object').map(t => Object.assign({ id: uid() }, t));
  // One-time conversion of the old "assessment per subject" data into tests (nothing is deleted)
  if(!d.meta.testsMigrated){
    const byKey = {};
    d.assessments.forEach(a => {
      if(!a.subject) return;
      const key = (a.name || '') + '|' + (a.date || '');
      let t = byKey[key];
      if(!t){
        t = { id: uid(), type: 'other', name: a.name || 'ការប្រឡង', date: a.date || '', createdAt: new Date().toISOString() };
        byKey[key] = t; d.tests.push(t); d.testScores[t.id] = {};
      }
      const row = d.scores[a.id] || {};
      Object.keys(row).forEach(sid => {
        const v = row[sid];
        if(v === '' || v == null || isNaN(Number(v))) return;
        d.testScores[t.id][sid] = d.testScores[t.id][sid] || {};
        d.testScores[t.id][sid][a.subject] = Number(v);
      });
    });
    d.meta.testsMigrated = true;
  }
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
  if(!supabaseClient || !currentUser || !currentClassId) return;
  setSyncStatus('saving');
  
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const { error } = await supabaseClient
      .from('classes')
      .update({ 
        data: DB, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', currentClassId);
      
    if(error){
      console.error(error);
      setSyncStatus('error');
      toast('មិនអាចរក្សាទុកទៅ Cloud បានទេ', true);
    } else {
      setSyncStatus('saved');
    }
  }, 1000);
}

function saveDB(){
  syncToCloud();
  refreshChrome();
}

/* ===================== DERIVED ===================== */
function studentsSorted(){ return DB.students.slice().sort((a,b) => String(a.name||'').localeCompare(String(b.name||''), 'km')); }
function findStudent(id){ return DB.students.find(s => s.id === id); }

/* ---- Test results: Total, Average, Grade ---- */
const GRADE_STEPS = [['A', 0.9], ['B', 0.8], ['C', 0.7], ['D', 0.6], ['E', 0.5]];   // below 0.5 → F
function gradingCfg(){
  const g = (DB.meta && DB.meta.grading) || {};
  return { divisor: Number(g.divisor) > 0 ? Number(g.divisor) : 14.4, maxAvg: Number(g.maxAvg) > 0 ? Number(g.maxAvg) : 50 };
}
function round2(x){ return Math.round((x + Number.EPSILON) * 100) / 100; }
function gradeFromAverage(avg){
  if(avg == null) return '—';
  const m = gradingCfg().maxAvg;
  for(const [g, f] of GRADE_STEPS){ if(avg >= m * f - 1e-9) return g; }
  return 'F';
}
function gradeClass(g){ return g === 'A' || g === 'B' || g === 'C' ? 'p' : g === 'D' || g === 'E' ? 'l' : g === 'F' ? 'a' : 'gray'; }
function testResult(testId, sid){
  const row = (DB.testScores[testId] || {})[sid];
  let total = 0, n = 0;
  DB.subjects.forEach(sub => {
    const v = row ? row[sub] : null;
    if(v !== '' && v != null && !isNaN(Number(v))){ total += Number(v); n++; }
  });
  if(!n) return null;
  const avg = round2(total / gradingCfg().divisor);
  return { total: round2(total), avg, grade: gradeFromAverage(avg), entered: n, missing: DB.subjects.length - n };
}
function rankTest(testId){
  const rows = DB.students.map(s => ({ s, r: testResult(testId, s.id) })).filter(x => x.r);
  rows.sort((a, b) => b.r.total - a.r.total || String(a.s.name || '').localeCompare(String(b.s.name || ''), 'km'));
  rows.forEach((x, i) => { x.rank = (i > 0 && x.r.total === rows[i-1].r.total) ? rows[i-1].rank : i + 1; });   // ties share a rank
  return rows;
}
// Overall average as a percentage (mean over all tests) – used by the dashboard and student list
function studentAverage(sid){
  const m = gradingCfg().maxAvg; let sum = 0, n = 0;
  DB.tests.forEach(t => { const r = testResult(t.id, sid); if(r){ sum += r.avg / m * 100; n++; } });
  return n ? sum / n : null;
}
function scoredCount(sid){ let n = 0; DB.tests.forEach(t => { if(testResult(t.id, sid)) n++; }); return n; }

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
function letterGrade(pct){ return pct == null ? '—' : gradeFromAverage(pct / 100 * gradingCfg().maxAvg); }

/* ===================== UI STATE & ROUTER ===================== */
const UI = {
  tab: 'dashboard', studentSearch: '', attDate: todayStr(),
  activeTest: '', noteFilter: 'all', editingStudentId: null, letterStudentId: null
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
  if (currentRole === 'monitor' && tab !== 'attendance' && tab !== 'grades') {
    tab = 'attendance';
  }
  if (currentRole === 'teacher' && tab === 'backup') {
    tab = 'dashboard';
  }

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

function fmtNum(x){ return Number.isInteger(x) ? String(x) : String(round2(x)); }
function testName(type, month, semester, custom){
  if(type === 'pretest') return 'តេស្តមុន (Pre-test)';
  if(type === 'monthly') return 'ប្រឡងប្រចាំខែ' + KHMER_MONTHS[Number(month)];
  if(type === 'semester') return 'ប្រឡងឆមាសទី' + (semester === '2' ? '២' : '១');
  return custom;
}
function testsSorted(){ return DB.tests.slice().sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.createdAt || '').localeCompare(b.createdAt || '')); }
function activeTestObj(){ return DB.tests.find(t => t.id === UI.activeTest) || null; }
function syncTestForm(){
  const t = $('#tType').value;
  $('#tMonth').style.display = t === 'monthly' ? '' : 'none';
  $('#tSemester').style.display = t === 'semester' ? '' : 'none';
  $('#tCustom').style.display = t === 'other' ? '' : 'none';
}
function resultCellsHtml(r){
  if(!r) return '<td class="r-total">—</td><td class="r-avg">—</td><td class="r-grade"><span class="badge gray">—</span></td>';
  return '<td class="r-total"><b>' + fmtNum(r.total) + '</b></td><td class="r-avg">' + r.avg.toFixed(2) + '</td>' +
         '<td class="r-grade"><span class="badge ' + gradeClass(r.grade) + '">' + r.grade + '</span></td>';
}

function renderGrades(){
  $('#subjectChips').innerHTML = DB.subjects.map((s,i) =>
    '<span class="chip">' + esc(s) + '<button data-subdel="' + i + '"><span class="icon" data-icon="x"></span></button></span>'
  ).join('') || '<div class="hint">គ្មានមុខវិជ្ជានៅឡើយទេ។</div>';
  fillIcons($('#subjectChips'));

  // calculation settings + grade legend
  const cfg = gradingCfg();
  if(document.activeElement !== $('#gDivisor')) $('#gDivisor').value = cfg.divisor;
  if(document.activeElement !== $('#gMaxAvg')) $('#gMaxAvg').value = cfg.maxAvg;
  $('#gradeLegend').innerHTML = GRADE_STEPS.map(([g, f]) => '<span class="badge ' + gradeClass(g) + '">' + g + '</span> ≥ ' + fmtNum(round2(cfg.maxAvg * f))).join(' &nbsp; ') +
    ' &nbsp; <span class="badge a">F</span> &lt; ' + fmtNum(round2(cfg.maxAvg * 0.5));

  // new-test form
  syncTestForm();
  if(!$('#tDate').value) $('#tDate').value = todayStr();

  // test list
  const tests = testsSorted();
  $('#testBody').innerHTML = tests.map(t => {
    const sc = DB.testScores[t.id] || {};
    const entered = DB.students.filter(s => testResult(t.id, s.id)).length;
    return '<tr><td><b>' + esc(t.name) + '</b></td><td>' + esc(fmtDate(t.date)) + '</td><td>' + entered + '/' + DB.students.length + '</td>' +
      '<td class="td-actions"><button class="btn sm" data-testopen="' + t.id + '">បញ្ចូលពិន្ទុ</button>' +
      '<button class="btn sm danger" data-testdel="' + t.id + '">លុប</button></td></tr>';
  }).join('');
  $('#testEmpty').hidden = tests.length > 0;

  // active test selector
  if(!DB.tests.some(t => t.id === UI.activeTest)) UI.activeTest = tests.length ? tests[tests.length - 1].id : '';
  $('#testSelect').innerHTML = tests.length
    ? tests.map(t => '<option value="' + t.id + '">' + esc(t.name + ' · ' + fmtDate(t.date)) + '</option>').join('')
    : '<option value="">— មិនទាន់មានការប្រឡង —</option>';
  $('#testSelect').value = UI.activeTest;
  renderScoreGrid();
  renderRanking();
}

function renderScoreGrid(){
  const t = activeTestObj();
  const empty = (msg) => { $('#scoreHead').innerHTML = ''; $('#scoreBody').innerHTML = ''; $('#scoreEmpty').hidden = false; $('#scoreEmpty').querySelector('div').textContent = msg; };
  if(!t) return empty('សូមបន្ថែមការប្រឡងខាងលើជាមុនសិន។');
  if(!DB.subjects.length) return empty('សូមបន្ថែមមុខវិជ្ជាជាមុនសិន។');
  if(!DB.students.length) return empty('សូមបន្ថែមសិស្សជាមុនសិន។');
  $('#scoreEmpty').hidden = true;
  $('#scoreHead').innerHTML = '<tr><th>សិស្ស</th><th>លេខសម្គាល់</th>' + DB.subjects.map(s => '<th>' + esc(s) + '</th>').join('') +
    '<th>ពិន្ទុសរុប</th><th>មធ្យមភាគ</th><th>និទ្ទេស</th></tr>';
  const sc = DB.testScores[t.id] || {};
  const ro = currentRole === 'monitor' ? ' readonly tabindex="-1"' : ''; // Locks inputs for Class Monitor
  $('#scoreBody').innerHTML = studentsSorted().map(s => {
    const row = sc[s.id] || {};
    const inputs = DB.subjects.map((sub, i) => {
      const v = row[sub] == null ? '' : row[sub];
      return '<td><input type="number" inputmode="decimal" class="input score-input" data-sid="' + s.id + '" data-sub="' + i + '" min="0" step="0.25" value="' + esc(v) + '" placeholder="—"' + ro + '></td>';
    }).join('');
    return '<tr data-sid="' + s.id + '"><td><b>' + esc(s.name) + '</b></td><td>' + esc(s.studentNo || '—') + '</td>' + inputs + resultCellsHtml(testResult(t.id, s.id)) + '</tr>';
  }).join('');
}

function renderRanking(){
  const t = activeTestObj();
  $('#rankTitle').textContent = t ? 'ចំណាត់ថ្នាក់ · ' + t.name : 'ចំណាត់ថ្នាក់';
  const list = t ? rankTest(t.id) : [];
  $('#rankBody').innerHTML = list.map(x => {
    const r = x.r;
    return '<tr><td><b>' + x.rank + '</b></td><td><b>' + esc(x.s.name) + '</b>' +
      (r.missing > 0 ? ' <span class="badge gray">ខ្វះ ' + r.missing + ' មុខវិជ្ជា</span>' : '') + '</td>' +
      '<td>' + fmtNum(r.total) + '</td><td>' + r.avg.toFixed(2) + '</td><td><span class="badge ' + gradeClass(r.grade) + '">' + r.grade + '</span></td></tr>';
  }).join('');
  $('#rankEmpty').hidden = list.length > 0;
  $('#exportRankBtn').disabled = list.length === 0;
  $('#exportRankHtmlBtn').disabled = list.length === 0;
  $('#honorBtn').disabled = list.length === 0;
  if(list.length){
    const counts = {}; list.forEach(x => { counts[x.r.grade] = (counts[x.r.grade] || 0) + 1; });
    const mean = list.reduce((a, x) => a + x.r.avg, 0) / list.length;
    $('#rankSummary').innerHTML = '<b>' + list.length + '</b> សិស្ស · មធ្យមភាគថ្នាក់ <b>' + mean.toFixed(2) + '</b> · ' +
      ['A','B','C','D','E','F'].filter(g => counts[g]).map(g => '<span class="badge ' + gradeClass(g) + '">' + g + '</span> ' + counts[g]).join(' &nbsp; ');
  } else { $('#rankSummary').textContent = ''; }
}

/* ---------- Excel import of scores ---------- */
function normKey(v){ return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().toLowerCase(); }
const NAME_HEADERS = ['ឈ្មោះ', 'ឈ្មោះសិស្ស', 'សិស្ស', 'name', 'student', 'student name', 'full name'];
const ID_HEADERS = ['លេខសម្គាល់', 'អត្តលេខ', 'id', 'student id', 'student no', 'student no.', 'no', 'no.'];

function downloadScoreTemplate(){
  const t = activeTestObj(); if(!t){ toast('សូមជ្រើសរើសការប្រឡងជាមុន។', true); return; }
  if(!window.XLSX){ toast('មិនអាចផ្ទុកបណ្ណាល័យ Excel បានទេ។', true); return; }
  const sc = DB.testScores[t.id] || {};
  const head = ['លេខសម្គាល់', 'ឈ្មោះ'].concat(DB.subjects);
  const body = studentsSorted().map(s => {
    const row = sc[s.id] || {};
    return [s.studentNo || '', s.name || ''].concat(DB.subjects.map(sub => row[sub] == null ? '' : row[sub]));
  });
  const ws = XLSX.utils.aoa_to_sheet([head].concat(body));
  ws['!cols'] = head.map((h, i) => ({ wch: i === 1 ? 26 : Math.max(12, String(h).length + 2) }));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Scores');
  XLSX.writeFile(wb, 'score-template-' + String(t.name).replace(/[\\\/:*?"<>|\s]+/g, '-') + '.xlsx');
}

// rows = array of arrays (first sheet). Returns { error } or { updates, matched, unmatched, subjectsFound, subjectsMissing, skipped }
function parseScoreRows(rows){
  const subjKeys = DB.subjects.map(normKey);
  let hdr = -1, nameCol = -1, idCol = -1, subjCols = {};
  for(let i = 0; i < Math.min(rows.length, 25); i++){
    const cells = (rows[i] || []).map(normKey);
    const sc = {}; cells.forEach((c, ci) => { const k = c ? subjKeys.indexOf(c) : -1; if(k >= 0 && !(k in sc)) sc[k] = ci; });
    const nc = cells.findIndex(c => c && NAME_HEADERS.includes(c));
    const ic = cells.findIndex(c => c && ID_HEADERS.includes(c));
    if(Object.keys(sc).length && (nc >= 0 || ic >= 0)){ hdr = i; nameCol = nc; idCol = ic; subjCols = sc; break; }
  }
  if(hdr < 0) return { error: 'រកមិនឃើញជួរក្បាលតារាងទេ។ ត្រូវមានជួរ «ឈ្មោះ» ឬ «លេខសម្គាល់» និងឈ្មោះមុខវិជ្ជា។' };

  const byId = {}, byName = {};
  DB.students.forEach(s => {
    if(s.studentNo) byId[normKey(s.studentNo)] = (byId[normKey(s.studentNo)] || []).concat(s);
    byName[normKey(s.name)] = (byName[normKey(s.name)] || []).concat(s);
  });
  const updates = [], unmatched = []; let skipped = 0; const seen = new Set();
  for(let r = hdr + 1; r < rows.length; r++){
    const row = rows[r] || [];
    const idv = idCol >= 0 ? normKey(row[idCol]) : '', nmv = nameCol >= 0 ? normKey(row[nameCol]) : '';
    if(!idv && !nmv) continue;
    let cand = idv ? byId[idv] : null;
    if(!cand || cand.length !== 1) cand = nmv ? byName[nmv] : cand;
    if(!cand || cand.length !== 1){ unmatched.push((nameCol >= 0 && row[nameCol]) ? String(row[nameCol]).trim() : String(row[idCol]).trim()); continue; }
    const stu = cand[0]; if(seen.has(stu.id)) continue; seen.add(stu.id);
    const vals = {};
    Object.keys(subjCols).forEach(k => {
      const raw = row[subjCols[k]];
      if(raw === '' || raw == null) return;
      const n = Number(String(raw).trim());
      if(isNaN(n) || n < 0){ skipped++; return; }
      vals[DB.subjects[k]] = n;
    });
    if(Object.keys(vals).length) updates.push({ sid: stu.id, name: stu.name, vals });
  }
  const subjectsFound = Object.keys(subjCols).map(k => DB.subjects[k]);
  const subjectsMissing = DB.subjects.filter(s => !subjectsFound.includes(s));
  return { updates, unmatched, skipped, subjectsFound, subjectsMissing };
}

function importScoresFile(file){
  const t = activeTestObj(); if(!t){ toast('សូមជ្រើសរើសការប្រឡងជាមុន។', true); return; }
  const done = rows => {
    const res = parseScoreRows(rows);
    if(res.error){ toast(res.error, true); return; }
    if(!res.updates.length){ toast('មិនមានពិន្ទុត្រូវនាំចូលទេ។ ពិនិត្យឈ្មោះ/លេខសម្គាល់សិស្ស។', true); return; }
    const cells = res.updates.reduce((a, u) => a + Object.keys(u.vals).length, 0);
    let msg = 'នាំចូលពិន្ទុទៅ «' + t.name + '»\n• សិស្ស: ' + res.updates.length + ' · ពិន្ទុ: ' + cells + '\n• ពិន្ទុដែលមានស្រាប់នឹងត្រូវជំនួស។';
    if(res.unmatched.length) msg += '\n• រកមិនឃើញសិស្ស ' + res.unmatched.length + ' នាក់ (មិននាំចូល): ' + res.unmatched.slice(0, 5).join(', ') + (res.unmatched.length > 5 ? '…' : '');
    if(res.subjectsMissing.length) msg += '\n• មុខវិជ្ជាមិនមានក្នុងឯកសារ: ' + res.subjectsMissing.join(', ');
    if(res.skipped) msg += '\n• ក្រឡាមិនមែនជាលេខ (រំលង): ' + res.skipped;
    msg += '\n\nបន្ត?';
    if(!confirm(msg)) return;
    const sc = DB.testScores[t.id] = DB.testScores[t.id] || {};
    res.updates.forEach(u => { sc[u.sid] = Object.assign(sc[u.sid] || {}, u.vals); });
    saveDB(); renderGrades();
    toast('បាននាំចូលពិន្ទុ ' + res.updates.length + ' សិស្ស');
  };
  const isCsv = /\.csv$/i.test(file.name);
  const reader = new FileReader();
  reader.onerror = () => toast('មិនអាចអានឯកសារបានទេ។', true);
  if(isCsv && !window.XLSX){
    reader.onload = () => done(parseCSV(String(reader.result)));
    reader.readAsText(file, 'utf-8');
  } else if(window.XLSX){
    reader.onload = () => {
      try {
        const wb = XLSX.read(reader.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        done(XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true }));
      } catch(e){ console.error(e); toast('ឯកសារ Excel មិនត្រឹមត្រូវ។', true); }
    };
    reader.readAsArrayBuffer(file);
  } else toast('មិនអាចផ្ទុកបណ្ណាល័យ Excel បានទេ។ សូមពិនិត្យអ៊ីនធឺណិត។', true);
}

/* ---------- Honor roll (Top 5) ---------- */
const KH_DIGITS = '០១២៣៤៥៦៧៨៩';
function toKhDigits(v){ return String(v == null ? '' : v).replace(/[0-9]/g, d => KH_DIGITS[Number(d)]); }
function cleanTestName(n){ return String(n || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim(); }
// Cambodian school year starts around November: Sep–Dec → year/year+1, Jan–Aug → year-1/year
function honorAcademicYear(d){ const y = d.getFullYear(), st = d.getMonth() >= 8 ? y : y - 1; return toKhDigits(st) + '-' + toKhDigits(st + 1); }
function honorBeYear(d){ return d.getFullYear() + (d.getMonth() >= 4 ? 544 : 543); }   // Buddhist Era changes around Visak Bochea (May)
function honorClassText(){
  const c = String(DB.meta.className || '').trim(); if(!c) return '';
  return /^ថ្នាក់/.test(c) ? toKhDigits(c) : 'ថ្នាក់ទី ' + toKhDigits(c);
}
const HONOR = { testId: '', names: [] };
function honorField(id){ return ($(id).value || '').trim(); }

function renderHonorPage(){
  const t = DB.tests.find(x => x.id === HONOR.testId); if(!t) return;
  const d = new Date((honorField('#hrDate') || t.date || todayStr()) + 'T00:00:00');
  const dateOk = !isNaN(d);
  const nm = i => esc(HONOR.names[i] || '');
  const plaque = i => '<div class="hr-plaque' + (HONOR.names[i] ? '' : ' hr-empty') + '"><img src="rank' + (i + 1) + '.jpeg" alt="ចំណាត់ថ្នាក់លេខ ' + toKhDigits(i + 1) + '" class="hr-plaque-img">' +
    '<div class="hr-student hr-moul" contenteditable="true">' + nm(i) + '</div></div>';
  const cls = honorClassText();
  const sub = esc(cleanTestName(t.name)) + (cls ? ' ' + esc(cls) : '') + '<br>ឆ្នាំសិក្សា ' + esc(honorField('#hrYear'));
  const line1 = 'ថ្ងៃ....................ខែ...................ព.ស. ' + (dateOk ? toKhDigits(honorBeYear(d)) : '២៥៦..');
  const line2 = esc(honorField('#hrPlace')) + ', ' + (dateOk ? 'ថ្ងៃទី' + toKhDigits(d.getDate()) + ' ខែ' + KHMER_MONTHS[d.getMonth()] + ' ឆ្នាំ' + toKhDigits(d.getFullYear()) : 'ថ្ងៃទី........... ខែ..............ឆ្នាំ ២០២.....');
  $('#honorPage').innerHTML =
    '<div class="hr-header"><div class="hr-school hr-moul" contenteditable="true">' + esc(honorField('#hrSchool')) + '</div>' +
      '<img src="motto.jpg" alt="ព្រះរាជាណាចក្រកម្ពុជា" class="hr-motto"></div>' +
    '<div class="hr-title-section"><img src="title.jpeg" alt="តារាងកិត្តិយស" class="hr-title-img">' +
      '<div class="hr-subtitle hr-moul" contenteditable="true">' + sub + '</div></div>' +
    '<div class="hr-ranks">' +
      '<div class="hr-row center">' + plaque(0) + '</div>' +
      '<div class="hr-row">' + plaque(1) + plaque(2) + '</div>' +
      '<div class="hr-row">' + plaque(3) + plaque(4) + '</div>' +
    '</div>' +
    '<div class="hr-footer"><div class="hr-principal" contenteditable="true">បានឃើញ និងឯកភាព<br><span class="hr-moul">នាយកសាលា</span></div>' +
      '<div class="hr-teacher-box" contenteditable="true"><span style="display:inline-block;margin-left:20px">' + line1 + '<br>' + line2 + '</span><br>' +
      '<span class="hr-moul">គ្រូបន្ទុកថ្នាក់</span><div class="hr-teacher-name hr-moul">' + esc(honorField('#hrTeacher')) + '</div></div></div>';
}

function fitHonor(){
  const ov = $('#honorOverlay'); if(!ov.classList.contains('open')) return;
  const W = 793.7, H = 1122.5;
  const s = Math.min(1, (ov.clientWidth - 24) / W);
  $('#honorScale').style.transform = 'scale(' + s + ')';
  $('#honorStage').style.width = (W * s) + 'px';
  $('#honorStage').style.height = (H * s) + 'px';
}

function openHonorRoll(){
  const t = activeTestObj(); if(!t){ toast('សូមជ្រើសរើសការប្រឡងជាមុន។', true); return; }
  const list = rankTest(t.id); if(!list.length){ toast('មិនទាន់មានពិន្ទុទេ។', true); return; }
  HONOR.testId = t.id;
  HONOR.names = list.slice(0, 5).map(x => x.s.name || '');
  const d = new Date((t.date || todayStr()) + 'T00:00:00');
  $('#hrSchool').value = DB.meta.honorSchool || '';
  $('#hrPlace').value = DB.meta.honorPlace || '';
  $('#hrTeacher').value = DB.meta.teacherName || '';
  $('#hrDate').value = t.date || todayStr();
  $('#hrYear').value = honorAcademicYear(isNaN(d) ? new Date() : d);
  $('#honorSub').textContent = '· ' + t.name;

  // warn about ties around the 5th place
  const fifth = list[Math.min(4, list.length - 1)].rank;
  const cands = list.filter(x => x.rank <= fifth), groups = {};
  cands.forEach(x => { (groups[x.rank] = groups[x.rank] || []).push(x); });
  const parts = Object.keys(groups).filter(r => groups[r].length > 1)
    .map(r => 'ចំណាត់ថ្នាក់ទី ' + r + ': ' + groups[r].map(x => x.s.name).join(', ') + ' (' + fmtNum(groups[r][0].r.total) + ' ពិន្ទុ)');
  const note = $('#honorNote');
  if(parts.length){
    note.hidden = false;
    note.textContent = '⚠ មានពិន្ទុស្មើគ្នា — ' + parts.join(' · ') + (cands.length > 5 ? ' · មានសិស្សលើសពី ៥ នាក់' : '') + '។ សូមពិនិត្យ ហើយកែឈ្មោះលើតារាងដោយចុចលើវា។';
  } else note.hidden = true;

  $('#honorOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderHonorPage(); fitHonor();
  $('#honorOverlay').scrollTop = 0;
}
function closeHonorRoll(){ $('#honorOverlay').classList.remove('open'); document.body.style.overflow = ''; }

function printDoc(cls){
  const st = document.createElement('style'); st.id = 'printPageStyle'; st.textContent = '@page{size:A4;margin:0}';
  document.head.appendChild(st);
  document.body.classList.add(cls);
  let cleaned = false;
  const cleanup = () => { if(cleaned) return; cleaned = true; document.body.classList.remove(cls); st.remove(); window.removeEventListener('afterprint', cleanup); };
  window.addEventListener('afterprint', cleanup);
  setTimeout(() => { window.print(); setTimeout(cleanup, 800); }, 100);
}
function printHonor(){ printDoc('printing-honor'); }

function exportRanking(){
  const t = activeTestObj(); if(!t){ toast('សូមជ្រើសរើសការប្រឡង។', true); return; }
  const list = rankTest(t.id); if(!list.length){ toast('មិនទាន់មានពិន្ទុទេ។', true); return; }
  const cfg = gradingCfg(), sc = DB.testScores[t.id] || {};
  const head = ['ចំណាត់ថ្នាក់', 'លេខសម្គាល់', 'ឈ្មោះ', 'ភេទ'].concat(DB.subjects, ['ពិន្ទុសរុប', 'មធ្យមភាគ', 'និទ្ទេស']);
  const body = list.map(x => {
    const row = sc[x.s.id] || {};
    return [x.rank, x.s.studentNo || '', x.s.name || '', x.s.gender || ''].concat(
      DB.subjects.map(sub => (row[sub] == null || row[sub] === '') ? '' : Number(row[sub])), [x.r.total, x.r.avg, x.r.grade]);
  });
  const info = [];
  if(DB.meta.schoolName) info.push([DB.meta.schoolName]);
  if(DB.meta.className) info.push(['ថ្នាក់: ' + DB.meta.className]);
  info.push(['ការប្រឡង: ' + t.name + (t.date ? ' (' + fmtDate(t.date) + ')' : '')]);
  info.push(['មធ្យមភាគ = ពិន្ទុសរុប ÷ ' + cfg.divisor + ' · មធ្យមភាគអតិបរមា ' + cfg.maxAvg]);
  info.push([]);
  const fname = 'ranking-' + String(t.name).replace(/[\\\/:*?"<>|\s]+/g, '-') + '-' + (t.date || todayStr());
  if(window.XLSX){
    const ws = XLSX.utils.aoa_to_sheet(info.concat([head], body));
    ws['!cols'] = head.map((h, i) => ({ wch: i === 2 ? 26 : Math.max(10, String(h).length + 2) }));
    body.forEach((r, ri) => {
      const addr = XLSX.utils.encode_cell({ r: info.length + 1 + ri, c: head.length - 2 });
      if(ws[addr]) ws[addr].z = '0.00';
    });
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Ranking');
    XLSX.writeFile(wb, fname + '.xlsx');
  } else {
    // fallback if the Excel library could not be loaded: Excel-compatible HTML table
    const rows = info.map(r => '<tr><td colspan="' + head.length + '">' + esc(r[0] || '') + '</td></tr>')
      .concat(['<tr>' + head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr>'],
              body.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>'));
    downloadExcel(fname + '.xls', '<table border="1">' + rows.join('') + '</table>');
  }
  toast('នាំចេញចំណាត់ថ្នាក់រួចរាល់');
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

const TEMPLATE_OFFICE = 'មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តតាកែវ';
const TEMPLATE_SCHOOL = 'វិទ្យាល័យសម្តេចក្រុមព្រះ...អង្គរនាប';
let PLACE_OPTS = [];
function letterCfg(){
  const L = DB.meta.letter || {};
  const school = L.school || DB.meta.honorSchool || TEMPLATE_SCHOOL;
  return {
    office: L.office || TEMPLATE_OFFICE,
    school,
    principal: L.principal || 'អ៊ូ ហេង',
    signPlace: L.signPlace || DB.meta.honorPlace || 'វិ.អង្គរនាប',
    place: L.meetingPlace || school,
    time: L.meetingTime || '09:00',
    date: L.meetingDate || '',
    issueDate: L.issueDate || ''
  };
}

function renderLetters(){
  const L = DB.meta.letter, cfg = letterCfg();
  $('#letterThreshold').value = L.threshold;
  $('#letterScope').value = L.scope;
  $('#letterMeetDate').value = L.meetingDate || tomorrowStr();
  $('#letterMeetTime').value = L.meetingTime || '09:00';
  $('#letterMeetPlace').value = cfg.place;
  $('#letterPrincipal').value = cfg.principal;
  $('#letterSchool').value = cfg.school;
  $('#letterOffice').value = cfg.office;
  $('#letterSignPlace').value = cfg.signPlace;
  $('#letterIssueDate').value = L.issueDate || '';

  // quick-pick places: school, common rooms, and places used before
  PLACE_OPTS = [];
  [cfg.school, 'ការិយាល័យនាយកសាលា', 'បន្ទប់ប្រជុំ', 'បន្ទប់គ្រូបន្ទុកថ្នាក់'].concat(L.places || []).forEach(p => { if(p && !PLACE_OPTS.includes(p)) PLACE_OPTS.push(p); });
  $('#placeChips').innerHTML = PLACE_OPTS.map((p, i) => '<button type="button" class="btn sm' + (p === cfg.place ? ' primary' : '') + '" data-place="' + i + '">' + esc(p) + '</button>').join('');

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
  L.school = $('#letterSchool').value.trim();
  L.office = $('#letterOffice').value.trim();
  L.signPlace = $('#letterSignPlace').value.trim();
  L.issueDate = $('#letterIssueDate').value || '';
  // remember typed places for next time
  L.places = Array.isArray(L.places) ? L.places : [];
  if(L.meetingPlace && !PLACE_OPTS.includes(L.meetingPlace)) L.places.unshift(L.meetingPlace);
  L.places = L.places.slice(0, 8);
  saveDB(); renderLetters(); toast('រក្សាទុកការកំណត់លិខិតរួចរាល់');
}

function renderBackup(){
  $('#backupStatusText').innerHTML =
    '<b>សិស្ស:</b> ' + DB.students.length + '<br>' +
    '<b>ថ្ងៃវត្តមាន:</b> ' + Object.keys(DB.attendance).length + '<br>' +
    '<b>ការប្រឡង:</b> ' + DB.tests.length + '<br>' +
    '<b>កំណត់ចំណាំ:</b> ' + DB.notes.length + '<br>' +
    '<b>បម្រុងទុកចុងក្រោយ:</b> ' + (DB.meta.lastBackup ? fmtDate(DB.meta.lastBackup.slice(0,10)) : 'មិនដែល');
}

/* ===================== LETTER GENERATION ===================== */
const KH_ANIMALS = ['ជូត','ឆ្លូវ','ខាល','ថោះ','រោង','ម្សាញ់','មមី','មមែ','វក','រកា','ច','កុរ'];
const KH_SAK = ['ឯកស័ក','ទោស័ក','ត្រីស័ក','ចត្វាស័ក','បញ្ចស័ក','ឆស័ក','សប្តស័ក','អដ្ឋស័ក','នព្វស័ក','សំរឹទ្ធិស័ក'];
function khTime(t){
  const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); if(!m) return '........';
  const h = Number(m[1]), min = m[2];
  const period = h < 12 ? 'ព្រឹក' : h === 12 ? 'ថ្ងៃត្រង់' : h < 18 ? 'រសៀល' : 'ល្ងាច';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return toKhDigits(h12) + (min !== '00' ? ':' + toKhDigits(min) : '') + period;
}
function khDate(dateStr){
  const d = new Date((dateStr || '') + 'T00:00:00'); if(!dateStr || isNaN(d)) return null;
  return { d, text: 'ថ្ងៃទី ' + toKhDigits(d.getDate()) + ' ខែ' + KHMER_MONTHS[d.getMonth()] + ' ឆ្នាំ' + toKhDigits(d.getFullYear()) };
}
function absenceMonthText(details){
  if(!details.length) return 'ក្នុងខែ ........ ឆ្នាំ........';
  const keys = Array.from(new Set(details.map(d => d.date.slice(0, 7)))).sort();
  const p = k => ({ y: Number(k.slice(0, 4)), m: Number(k.slice(5, 7)) - 1 });
  const a = p(keys[0]), b = p(keys[keys.length - 1]);
  if(keys.length === 1) return 'ក្នុងខែ ' + KHMER_MONTHS[a.m] + ' ឆ្នាំ' + toKhDigits(a.y);
  if(a.y === b.y) return 'ចាប់ពីខែ ' + KHMER_MONTHS[a.m] + ' ដល់ខែ ' + KHMER_MONTHS[b.m] + ' ឆ្នាំ' + toKhDigits(a.y);
  return 'ចាប់ពីខែ ' + KHMER_MONTHS[a.m] + ' ឆ្នាំ' + toKhDigits(a.y) + ' ដល់ខែ ' + KHMER_MONTHS[b.m] + ' ឆ្នាំ' + toKhDigits(b.y);
}

function buildLetter(studentId){
  const s = findStudent(studentId); if(!s) return '';
  const L = DB.meta.letter, cfg = letterCfg();
  const details = absenceDetailsFor(s.id, L.scope || 'A');
  const totalHours = details.reduce((a, d) => a + d.hours, 0);
  const days = details.length;

  const issue = khDate(cfg.issueDate) || khDate(todayStr());
  const idt = issue.d;
  const newYear = (idt.getMonth() > 3 || (idt.getMonth() === 3 && idt.getDate() >= 14)) ? idt.getFullYear() : idt.getFullYear() - 1;   // animal year & sak change at Khmer New Year
  const animal = KH_ANIMALS[(((newYear - 4) % 12) + 12) % 12], sak = KH_SAK[(newYear + 541) % 10];
  const line1 = 'ថ្ងៃ' + KHMER_DAY_NAMES[idt.getDay()] + ' ..........កើត/រោច ខែ.......... ឆ្នាំ' + animal + ' ' + sak + ' ព.ស ' + toKhDigits(honorBeYear(idt));
  const line2 = 'ធ្វើនៅ ' + esc(cfg.signPlace) + ' ' + esc(issue.text.replace('ថ្ងៃទី ', 'ថ្ងៃទី'));

  const meet = khDate(cfg.date);
  const meetDate = meet ? meet.text : 'ថ្ងៃទី ........ ខែ........ ឆ្នាំ........';
  const gender = (s.gender === 'ប្រុស' || s.gender === 'ស្រី') ? ' ភេទ' + s.gender : '';
  const cls = honorClassText() || 'ថ្នាក់ទី ........';

  return '<div class="lt-stage"><div class="lt-scale"><div class="lt-page" contenteditable="true">' +
    '<div class="lt-motto lt-moul">ព្រះរាជាណាចក្រកម្ពុជា<br>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>' +
    '<div class="lt-header-left lt-moul">' + esc(cfg.office) + '<br>' + esc(cfg.school) + '<br></div>' +
    '<div class="lt-title"><div class="lt-moul lt-doc-title">លិខិតអញ្ជើញ</div>' +
      '<div class="lt-moul">នាយកនៃ' + esc(cfg.school) + '</div><div class="lt-moul">សូមគោរពអញ្ជើញ</div>' +
      '<div><span class="lt-moul">ឪពុកម្តាយឬអាណាព្យាបាលសិស្សឈ្មោះ</span> <span class="lt-letter-value">' + esc(s.name) + '</span></div></div>' +
    '<table class="lt-subject"><tr><td class="lt-subject-label lt-moul">កម្មវត្ថុ :</td><td>អញ្ជើញចូលរួមប្រជុំពិភាក្សាពិនិត្យលើអវត្តមានរបស់កូនលោក លោកស្រី</td></tr></table>' +
    '<div class="lt-body">' +
      '<p>តបតាមកម្មវត្ថុខាងលើ ខ្ញុំបាទ សូមជំរាបជូនលោក លោកស្រីមេត្តាជ្រាបថា សិស្សឈ្មោះ <span class="lt-letter-value">' + esc(s.name) + '</span><span class="lt-letter-value">' + gender + '</span> រៀន<span class="lt-letter-value">' + esc(cls) + '</span>' +
        ' អវត្តមាន<span class="lt-letter-value">' + toKhDigits(days) + 'ថ្ងៃ</span> (សរុប <span class="lt-letter-value">' + toKhDigits(totalHours) + ' ម៉ោង</span>) ហើយ<span class="lt-letter-value">' + esc(absenceMonthText(details)) + '</span>' +
        ' ដោយគ្មានមូលហេតុច្បាស់លាស់ ។ការឈប់នេះអាចធ្វើអោយប៉ះពាល់ការសិក្សារបស់កូន ហើយក៏អាចអោយកូន រៀនមិនទាន់គេ ហើយបណ្តាលអោយប្រលងធ្លាក់។</p>' +
      '<p>ការប្រជុំនេះ មានគោលបំណង ដើម្បីពិភាក្សាស្វែងរកដំណោះស្រាយ ជួយដល់កូនរបស់ លោក លោកស្រី ដែលបានឈប់ច្រើនដងនោះ អោយកូនបានចូលរៀនជាប់លាប់ឡើងវិញ និងដើម្បីទប់ស្កាត់កុំអោយកូននេះ បោះបង់ការសិក្សាទៀតផង ។ គោលបំណងរបស់សាលារៀន គឺធានាកូនរបស់លោកអ្នកមានចំណេះដឹង ប៉ុន្តែសាលារៀនមិនអាចធ្វើតែម្នាក់ឯងបានឡើយ ។ ដូច្នេះសាលារៀនត្រូវការពិភាក្សាជាមួយលោក លោកស្រី ដើម្បីរិះរកវិធានការឲ្យកូនរបស់លោក អ្នក មករៀនទៀងទាត់វិញ ។</p>' +
      '<p>អាស្រ័យដូចបានជម្រាបជូនខាងលើនេះ សូមលោក លោកស្រីអញ្ជើញចូលរួមក្នុងកិច្ចប្រជុំកុំបីខាន នៅ' + esc(cfg.place) + ' នៅ <span class="lt-letter-value">' + esc(meetDate) + '</span> វេលាម៉ោង <span class="lt-letter-value">' + esc(khTime(cfg.time)) + '</span> ដើម្បីពិភាក្សាអំពីបញ្ហានេះរួមគ្នាកុំបីខានឡើយ ។</p>' +
      '<p>សូមលោក លោកស្រី ទទួលនូវការគោរពរាប់អានអំពីខ្ញុំ។</p>' +
    '</div>' +
    '<div class="lt-footer"><div class="lt-sign">' + line1 + '<br>' + line2 + '<br><div class="lt-moul">នាយក</div><div class="lt-director lt-moul">' + esc(cfg.principal) + '</div></div></div>' +
  '</div></div></div>';
}
function fitLetter(){
  const body = $('#letterBody'), stage = body.querySelector('.lt-stage'), scale = body.querySelector('.lt-scale'), page = body.querySelector('.lt-page');
  if(!stage || !$('#letterOverlay').classList.contains('open')) return;
  const W = 793.7, avail = body.clientWidth - 32;
  const s = Math.min(1, avail / W);
  scale.style.transform = 'scale(' + s + ')';
  stage.style.width = (W * s) + 'px';
  stage.style.height = (page.offsetHeight * s) + 'px';
}
function openLetter(studentId){
  const s = findStudent(studentId); if(!s){ toast('រកមិនឃើញសិស្ស', true); return; }
  UI.letterStudentId = studentId;
  $('#letterBody').innerHTML = buildLetter(studentId);
  $('#letterOverlay').classList.add('open');
  fitLetter(); $('#letterBody').scrollTop = 0;
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
  for(const a in DB.scores) delete DB.scores[a][id]; for(const t in DB.testScores) delete DB.testScores[t][id]; DB.notes = DB.notes.filter(n => n.studentId !== id);
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
  $('#letterPrintBtn').addEventListener('click', () => printDoc('printing-letter'));
  $('#placeChips').addEventListener('click', e => { const b = e.target.closest('[data-place]'); if(!b) return; $('#letterMeetPlace').value = PLACE_OPTS[Number(b.dataset.place)] || ''; saveLetterSettings(); });
  window.addEventListener('resize', fitLetter);
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

  // Tests & scores
  $('#tType').addEventListener('change', syncTestForm);
  $('#addTestBtn').addEventListener('click', () => {
    const type = $('#tType').value, custom = $('#tCustom').value.trim();
    if(type === 'other' && !custom){ toast('សូមបំពេញឈ្មោះការប្រឡង។', true); $('#tCustom').focus(); return; }
    const name = testName(type, $('#tMonth').value, $('#tSemester').value, custom);
    const date = $('#tDate').value || todayStr();
    if(DB.tests.some(t => t.name === name && t.date === date)){ toast('មានការប្រឡងនេះរួចហើយ។', true); return; }
    const t = { id: uid(), type, name, date, createdAt: new Date().toISOString() };
    if(type === 'monthly') t.month = Number($('#tMonth').value);
    if(type === 'semester') t.semester = $('#tSemester').value;
    DB.tests.push(t); DB.testScores[t.id] = {}; UI.activeTest = t.id;
    $('#tCustom').value = ''; saveDB(); renderGrades(); toast('បានបន្ថែមការប្រឡង');
  });
  $('#testBody').addEventListener('click', e => {
    const open = e.target.closest('[data-testopen]'), del = e.target.closest('[data-testdel]');
    if(open){ UI.activeTest = open.dataset.testopen; renderGrades(); $('#scoreCard').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if(del){
      const t = DB.tests.find(x => x.id === del.dataset.testdel); if(!t) return;
      if(!confirm('លុបការប្រឡង "' + t.name + '" និងពិន្ទុទាំងអស់?')) return;
      DB.tests = DB.tests.filter(x => x.id !== t.id); delete DB.testScores[t.id];
      saveDB(); renderGrades();
    }
  });
  $('#testSelect').addEventListener('change', e => { UI.activeTest = e.target.value; renderScoreGrid(); renderRanking(); });
    const saveGrading = () => {
    if(currentRole === 'monitor') return; // Block Class Monitor from changing divisor/max average
    const d = Number($('#gDivisor').value), m = Number($('#gMaxAvg').value);
    if(!(d > 0) || !(m > 0)){ toast('តម្លៃត្រូវធំជាង 0។', true); renderGrades(); return; }
    DB.meta.grading = { divisor: d, maxAvg: m }; saveDB(); renderGrades();
  };
  $('#gDivisor').addEventListener('change', saveGrading);
  $('#gMaxAvg').addEventListener('change', saveGrading);
  $('#exportRankBtn').addEventListener('click', exportRanking);
  $('#exportRankHtmlBtn').addEventListener('click', exportRankingHtml);
  $('#honorBtn').addEventListener('click', openHonorRoll);
  $('#honorCloseBtn').addEventListener('click', closeHonorRoll);
  $('#honorPrintBtn').addEventListener('click', printHonor);
  ['#hrSchool', '#hrYear', '#hrTeacher', '#hrPlace', '#hrDate'].forEach(id => $(id).addEventListener('input', renderHonorPage));
  $('#hrSchool').addEventListener('change', () => { DB.meta.honorSchool = honorField('#hrSchool'); saveDB(); });
  $('#hrPlace').addEventListener('change', () => { DB.meta.honorPlace = honorField('#hrPlace'); saveDB(); });
  $('#hrTeacher').addEventListener('change', () => { DB.meta.teacherName = honorField('#hrTeacher'); saveDB(); });
  window.addEventListener('resize', fitHonor);
  $('#importScoresBtn').addEventListener('click', () => { if(!activeTestObj()){ toast('សូមជ្រើសរើសការប្រឡងជាមុន។', true); return; } $('#scoreFile').click(); });
  $('#scoreFile').addEventListener('change', e => { const f = e.target.files[0]; if(f) importScoresFile(f); e.target.value = ''; });
  $('#scoreTemplateBtn').addEventListener('click', downloadScoreTemplate);

  $('#scoreBody').addEventListener('input', e => {
    if(currentRole === 'monitor') return; // Block Class Monitor from saving any score changes
    const inp = e.target.closest('.score-input'); const t = activeTestObj(); if(!inp || !t) return;
    const sub = DB.subjects[Number(inp.dataset.sub)]; if(sub == null) return;
    const sc = DB.testScores[t.id] = DB.testScores[t.id] || {};
    const v = inp.value.trim();
    if(v === '' || isNaN(Number(v)) || Number(v) < 0){
      if(sc[inp.dataset.sid]){ delete sc[inp.dataset.sid][sub]; if(!Object.keys(sc[inp.dataset.sid]).length) delete sc[inp.dataset.sid]; }
    } else {
      sc[inp.dataset.sid] = sc[inp.dataset.sid] || {}; sc[inp.dataset.sid][sub] = Number(v);
    }
    const tr = inp.closest('tr'), r = testResult(t.id, inp.dataset.sid);
    tr.querySelector('.r-total').outerHTML = resultCellsHtml(r).split('</td>')[0] + '</td>';
    tr.querySelector('.r-avg').outerHTML = '<td class="r-avg">' + (r ? r.avg.toFixed(2) : '—') + '</td>';
    tr.querySelector('.r-grade').outerHTML = '<td class="r-grade"><span class="badge ' + (r ? gradeClass(r.grade) : 'gray') + '">' + (r ? r.grade : '—') + '</span></td>';
    renderRanking();
    saveDB();
  });
  // Enter moves down to the next student in the same subject column
  $('#scoreBody').addEventListener('keydown', e => {
    if(e.key !== 'Enter' || !e.target.classList.contains('score-input')) return;
    e.preventDefault();
    const next = e.target.closest('tr').nextElementSibling;
    const target = next && next.querySelector('.score-input[data-sub="' + e.target.dataset.sub + '"]');
    if(target){ target.focus(); target.select(); } else e.target.blur();
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
function renderRoleBadge() {
  const ROLE_META = {
    admin:   { label: 'អ្នកគ្រប់គ្រង (Admin)', icon: 'shield',  cls: 'role-admin' },
    teacher: { label: 'គ្រូបន្ទុកថ្នាក់',        icon: 'teacher', cls: 'role-teacher' },
    monitor: { label: 'ប្រធានថ្នាក់',          icon: 'monitor', cls: 'role-monitor' }
  };
  const info = ROLE_META[currentRole] || ROLE_META.teacher;
  const html = `<span class="icon sm" data-icon="${info.icon}"></span><span>${info.label}</span>`;

  // 1. Place next to the Topbar Logout button (#logoutBtnTop)
  const topLogout = $('#logoutBtnTop');
  if (topLogout && topLogout.parentElement) {
    let topBadge = $('#roleBadgeTop');
    if (!topBadge) {
      topBadge = document.createElement('span');
      topBadge.id = 'roleBadgeTop';
      topLogout.parentElement.insertBefore(topBadge, topLogout);
    }
    topBadge.className = 'role-badge ' + info.cls;
    topBadge.innerHTML = html;
    fillIcons(topBadge);
  }

  // 2. Place above/next to the Sidebar Logout button (#logoutBtn)
  const sideLogout = $('#logoutBtn');
  if (sideLogout && sideLogout.parentElement) {
    let sideBadge = $('#roleBadgeSide');
    if (!sideBadge) {
      sideBadge = document.createElement('div');
      sideBadge.id = 'roleBadgeSide';
      sideLogout.parentElement.insertBefore(sideBadge, sideLogout);
    }
    sideBadge.className = 'role-badge side ' + info.cls;
    sideBadge.innerHTML = html;
    fillIcons(sideBadge);
  }
}

// Load from Cloud
// Load from Cloud
async function loadDataFromCloud() {
  setSyncStatus('saving');

  // 1. Fetch role and assigned class
  const { data: roleRow, error: roleErr } = await supabaseClient
    .from('user_roles')
    .select('role, class_id')
    .eq('user_id', currentUser.id)
    .single();

  if (roleErr || !roleRow) {
    toast('គណនីនេះមិនទាន់ត្រូវបានកំណត់តួនាទី (Role) ទេ', true);
    setSyncStatus('error');
    return;
  }

  currentRole = roleRow.role;
  document.body.dataset.role = currentRole;
  renderRoleBadge();

  // 2. Determine which class to load
  if (currentRole === 'admin') {
    const { data: allClasses } = await supabaseClient.from('classes').select('id, name').order('name');
    if (!allClasses || !allClasses.length) {
      toast('មិនទាន់មានថ្នាក់រៀនក្នុងប្រព័ន្ធទេ', true);
      return;
    }
    currentClassId = currentClassId || allClasses[0].id;
    renderAdminClassSwitcher(allClasses);
  } else {
    currentClassId = roleRow.class_id;
    if (!currentClassId) {
      toast('គណនីនេះមិនទាន់ត្រូវបានភ្ជាប់ទៅថ្នាក់រៀនណាមួយទេ (class_id)', true);
      setSyncStatus('error');
      return;
    }
  }

  // 3. Load the shared class data
  const { data: clsRow, error: clsErr } = await supabaseClient
    .from('classes')
    .select('data')
    .eq('id', currentClassId)
    .single();

  if (clsErr) {
    toast('មិនអាចទាញយកទិន្នន័យថ្នាក់បានទេ', true);
    setSyncStatus('error');
    return;
  }

  DB = clsRow && clsRow.data ? normalize(clsRow.data) : defaultData();

  $('#loginScreen').style.display = 'none';
  $('#appContainer').style.display = 'flex';
  setSyncStatus('saved');
  fillIcons();
  $('#attDate').value = UI.attDate;

  // 4. Send Class Monitor straight to Attendance; others to Dashboard
  go(currentRole === 'monitor' ? 'attendance' : 'dashboard');
}
function renderAdminClassSwitcher(classes) {
  let sel = $('#adminClassSelect');
  if (!sel) {
    sel = document.createElement('select');
    sel.id = 'adminClassSelect';
    sel.className = 'input';
    sel.style.cssText = 'width:auto;min-height:34px;padding:4px 10px;font-size:13px;';
    sel.addEventListener('change', (e) => {
      currentClassId = e.target.value;
      loadDataFromCloud();
    });
    $('.topbar-actions').prepend(sel);
  }
  sel.innerHTML = classes.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
  sel.value = currentClassId;
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

async function exportRankingHtml(){
  const t = activeTestObj(); if(!t){ toast('សូមជ្រើសរើសការប្រឡង។', true); return; }
  const list = rankTest(t.id); if(!list.length){ toast('មិនទាន់មានពិន្ទុទេ។', true); return; }

  const popup = window.open('', '_blank');
  if(!popup){ toast('កម្មវិធីរារាំងបង្អួចថ្មី។ សូមអនុញ្ញាតបង្អួច។', true); return; }
  popup.document.open();
  popup.document.write('<!doctype html><title>កំពុងបង្កើតតារាងពិន្ទុ</title><body style="font-family:sans-serif;padding:24px">កំពុងបង្កើតតារាងពិន្ទុ...</body>');
  popup.document.close();

  try{
    const response = await fetch('export_ranking.html');
    if(!response.ok) throw new Error('Cannot load ranking template');
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const school = DB.meta.schoolName || 'វិទ្យាល័យសម្តេចក្រុមព្រះ...អង្គរនាប';
    const className = DB.meta.className || '';
    const title = 'តារាងពិន្ទុមធ្យមភាគ ' + t.name + (className ? ' ថ្នាក់ទី ' + className : '');
    const date = khDate(t.date || todayStr());
    const yearStart = date ? date.d.getFullYear() : new Date().getFullYear();

    const schoolEl = doc.getElementById('rankingSchool');
    const titleEl = doc.getElementById('rankingTitle');
    const bodyEl = doc.getElementById('rankingBody');
    const summaryEl = doc.getElementById('rankingSummary');
    const teacherEl = doc.getElementById('rankingTeacher');

    if(schoolEl) schoolEl.textContent = school;
    if(titleEl) titleEl.innerHTML = esc(title) + '<br>ឆ្នាំសិក្សា ' + toKhDigits(yearStart) + '-' + toKhDigits(yearStart + 1);
    if(bodyEl){
      bodyEl.innerHTML = list.map((x, i) => {
        const gender = x.s.gender === 'ស្រី' ? 'ស' : x.s.gender === 'ប្រុស' ? 'ប' : esc(x.s.gender || '');
        return '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + esc(x.s.studentNo || '') + '</td>' +
          '<td class="name-col">' + esc(x.s.name || '') + '</td>' +
          '<td>' + gender + '</td>' +
          '<td>' + x.r.avg.toFixed(2) + '</td>' +
          '<td>' + esc(x.r.grade) + '</td>' +
          '<td class="rank">' + x.rank + '</td>' +
          '</tr>';
      }).join('');
    }
    if(summaryEl){
      const femaleCount = list.filter(x => x.s.gender === 'ស្រី').length;
      summaryEl.textContent = '* សរុបចំនួន៖ ' + toKhDigits(list.length) + ' នាក់, ស្រី ' + toKhDigits(femaleCount) + ' នាក់។';
    }
    if(teacherEl) teacherEl.textContent = DB.meta.teacherName || '................';

    doc.title = title;
    popup.document.open();
    popup.document.write('<!doctype html>\n' + doc.documentElement.outerHTML);
    popup.document.close();
  }catch(err){
    console.error(err);
    popup.document.open();
    popup.document.write('<!doctype html><title>Error</title><body style="font-family:sans-serif;padding:24px">មិនអាចបើកតារាងពិន្ទុបានទេ។ សូមដំណើរការពី server មួយ។</body>');
    popup.document.close();
  }
}
checkSession();

})();
