/**
 * Dr. Tooth appointment requests: Google Apps Script web app.
 *
 * Deploy this from the PRACTICE's Google Workspace account (HIPAA BAA accepted in the Admin
 * console), never from a personal account. Setup steps: apps-script/README.md.
 *
 * What it does:
 *  - Accepts the website form's JSON (sent as text/plain), validates it, and appends a row to a
 *    restricted Google Sheet.
 *  - Sends the front desk a short notice email with a link to the Sheet. The email deliberately
 *    contains no patient details.
 *  - Spam protection: honeypot field, minimum time-to-submit, a global rate limit, and a
 *    duplicate check per phone number.
 */

const CONFIG = {
  /** Where the notice email goes. Set the script property NOTIFY_EMAIL (Project settings → Script properties). */
  notifyEmail: () => PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL'),
  /** Created by setup(); stored as the script property SHEET_ID. */
  sheetId: () => PropertiesService.getScriptProperties().getProperty('SHEET_ID'),
  minFillMs: 3000,
  /** At most this many accepted requests per 10 minutes, across all visitors. */
  maxPer10Min: 20,
  /** Ignore a repeat from the same phone number within this many seconds. */
  duplicateWindowSec: 600,
};

const OFFICES = { bellevue: 'Bellevue', 'mountlake-terrace': 'Mountlake Terrace' };
const PATIENT_TYPES = { '': '', new: 'New patient', returning: 'Returning patient' };
const TIMES = { any: 'Any time', morning: 'Morning', midday: 'Midday', afternoon: 'Afternoon' };
const HEADERS = ['Received', 'Office', 'First name', 'Last name', 'Phone', 'Email', 'Patient', 'Preferred time', 'Status', 'Notes'];

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Bots: answer "ok" so they don't adapt, but store nothing.
    if (data.company) return json_({ ok: true });
    if (!(Number(data.elapsedMs) >= CONFIG.minFillMs)) return json_({ ok: true });

    const req = validate_(data);
    if (!req) return json_({ ok: false, error: 'invalid' });

    const cache = CacheService.getScriptCache();
    const dupKey = 'dup:' + req.phone.replace(/\D/g, '');
    if (cache.get(dupKey)) return json_({ ok: true });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const bucket = 'rate:' + Math.floor(Date.now() / 600000);
      const count = Number(cache.get(bucket) || 0);
      if (count >= CONFIG.maxPer10Min) return json_({ ok: false, error: 'busy' });
      cache.put(bucket, String(count + 1), 660);

      const sheet = sheet_();
      sheet.appendRow([
        new Date(),
        OFFICES[req.office],
        req.firstName,
        req.lastName,
        req.phone,
        req.email,
        PATIENT_TYPES[req.patientType],
        TIMES[req.preferredTime],
        'New',
        '',
      ].map(safeCell_));
      cache.put(dupKey, '1', CONFIG.duplicateWindowSec);
    } finally {
      lock.releaseLock();
    }

    notify_(req.office);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

/** Health check: open the web-app URL in a browser to confirm it's live. */
function doGet() {
  return json_({ ok: true, service: 'drtooth-appointments' });
}

function validate_(d) {
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const r = {
    firstName: str(d.firstName, 60),
    lastName: str(d.lastName, 60),
    phone: str(d.phone, 25),
    email: str(d.email, 120),
    office: str(d.office, 40),
    patientType: str(d.patientType, 20),
    preferredTime: str(d.preferredTime, 20) || 'any',
  };
  if (!r.firstName || !r.lastName) return null;
  if (!/^[0-9()+.\- ]{7,25}$/.test(r.phone) || r.phone.replace(/\D/g, '').length < 10) return null;
  if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) return null;
  if (!(r.office in OFFICES) || !(r.patientType in PATIENT_TYPES) || !(r.preferredTime in TIMES)) return null;
  return r;
}

/** Stop Sheets from treating submitted text as a formula. */
function safeCell_(v) {
  return typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function sheet_() {
  const id = CONFIG.sheetId();
  if (!id) throw new Error('SHEET_ID not set: run setup() first');
  return SpreadsheetApp.openById(id).getSheets()[0];
}

function notify_(officeId) {
  const to = CONFIG.notifyEmail();
  if (!to) return;
  const url = SpreadsheetApp.openById(CONFIG.sheetId()).getUrl();
  MailApp.sendEmail({
    to: to,
    subject: 'New appointment request: ' + OFFICES[officeId],
    body:
      'A new appointment request came in through drtooth.dental for the ' + OFFICES[officeId] + ' office.\n\n' +
      'Open the requests sheet to see it and call the patient back:\n' + url + '\n\n' +
      '(Patient details are kept in the sheet only, not in this email.)',
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once from the editor: creates the requests Sheet (in the script owner's Drive) and stores its ID.
 * Safe to run again; it won't create a second sheet.
 */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('SHEET_ID')) {
    console.log('Already set up: ' + SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getUrl());
    return;
  }
  const ss = SpreadsheetApp.create('Website appointment requests');
  const sh = ss.getSheets()[0];
  sh.setName('Requests');
  sh.appendRow(HEADERS);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sh.getRange('A:A').setNumberFormat('yyyy-mm-dd h:mm am/pm');
  props.setProperty('SHEET_ID', ss.getId());
  console.log('Created ' + ss.getUrl());
}

/** Run from the editor to check the whole path (writes one TEST row and sends one notice). */
function testSubmission() {
  const res = doPost({
    postData: {
      contents: JSON.stringify({
        firstName: 'TEST',
        lastName: 'Do not call',
        phone: '(425) 555-0100',
        email: '',
        office: 'bellevue',
        patientType: 'new',
        preferredTime: 'morning',
        elapsedMs: 5000,
      }),
    },
  });
  console.log(res.getContent());
}
