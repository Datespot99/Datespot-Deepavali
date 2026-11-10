/**
 * Datespot Deepavali signup + payment proof collection.
 * Deploy as a Google Apps Script Web App (Execute as: Me, Access: Anyone).
 * Images are inserted as actual spreadsheet images, not public links.
 */
const SPREADSHEET_ID = '1J0VGBnaFuIECasUjp5wqG_xa2ZThXXZ1RDbIqlgA4o4';
const SHEET_NAME = 'Sheet1';
const TIME_ZONE = 'Asia/Kolkata';

function doGet(e) {
  const p = e && e.parameter || {};
  const name = String(p.name || '').trim().replace(/\s+/g, ' ');
  const phone = String(p.phone || '').trim();
  if (!name || name.length > 120 || !/^[6-9]\d{9}$/.test(phone)) return reply_('Invalid lead');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = sheet_();
    const dateTime = Utilities.formatDate(new Date(), TIME_ZONE, 'dd-MM hh:mma');
    sheet.appendRow([safe_(name), dateTime, '', phone]);
    return reply_('OK');
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  let p;
  try {
    p = JSON.parse(e.postData.contents);
  } catch (_) {
    return reply_('Invalid JSON');
  }
  if (p.action !== 'screenshot') return reply_('Unknown action');
  const name = String(p.name || '').trim().replace(/\s+/g, ' ');
  const phone = String(p.phone || '').trim();
  if (!name || !/^[6-9]\d{9}$/.test(phone)) return reply_('Invalid member');
  if (p.mimeType !== 'image/jpeg') return reply_('Unsupported image');
  const bytes = Utilities.base64Decode(String(p.image || ''));
  if (!bytes.length || bytes.length > 1900000) return reply_('Image exceeds 1.9 MB');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = sheet_();
    const last = sheet.getLastRow();
    if (last < 2) return reply_('No matching signup');
    // Search from the latest signup backwards to avoid attaching proof to another user.
    const first = Math.max(2, last - 999);
    const data = sheet.getRange(first, 1, last - first + 1, 4).getDisplayValues();
    let row = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i][0] === name && data[i][3] === phone) {
        row = first + i;
        break;
      }
    }
    if (row < 0) return reply_('No matching signup');
    const cell = sheet.getRange(row, 3);
    if (cell.getNote() === 'Payment screenshot uploaded') return reply_('Already uploaded');
    const blob = Utilities.newBlob(bytes, 'image/jpeg', 'payment-proof.jpg');
    // insertImage(blob, column, row) creates an image object anchored to this cell.
    const img = sheet.insertImage(blob, 3, row);
    img.setWidth(180).setHeight(115);
    sheet.setRowHeight(row, 126);
    cell.setNote('Payment screenshot uploaded');
    return reply_('OK');
  } finally {
    lock.releaseLock();
  }
}

function safe_(value) {
  return /^[=+@-]/.test(value) ? "'" + value : value;
}

function sheet_() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Missing sheet tab');
  return sheet;
}

function reply_(message) {
  return ContentService.createTextOutput(message);
}
