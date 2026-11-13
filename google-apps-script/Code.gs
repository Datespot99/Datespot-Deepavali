/**
 * Datespot Deepavali registration and screenshot collection.
 * Private payment screenshots are stored in Drive and linked from column C.
 *
 * Deploy as Apps Script Web App: Execute as Me; Who has access: Anyone.
 * Run authorizeScreenshotStorage in the editor once to authorize Drive access.
 */
const SPREADSHEET_ID = '1J0VGBnaFuIECasUjp5wqG_xa2ZThXXZ1RDbIqlgA4o4';
const SHEET_NAME = 'Sheet1';
const TIME_ZONE = 'Asia/Kolkata';
const MAX_IMAGE_BYTES = 1900000;
const INITIAL_SLOTS = 26;
const SLOTS_PROPERTY = 'ds_remaining_slots_v1';
const RECEIPT_PREFIX = 'ds_receipt_';
const JOIN_PREFIX = 'ds_join_';

function doGet(e) {
  const p = (e && e.parameter) || {};
  // Public, non-sensitive JSONP status for cross-origin browser requests.
  if (p.action === 'slots') return jsonp_(p.callback, { slots: remainingSlots_() });
  if (p.action === 'upload-status') {
    const id = String(p.id || '');
    if (!validReceiptId_(id)) return jsonp_(p.callback, { status: 'error', message: 'Invalid receipt' });
    const receipt = PropertiesService.getScriptProperties().getProperty(RECEIPT_PREFIX + id);
    const status = receipt === 'saved' ? 'saved' : (receipt && receipt.indexOf('error:') === 0 ? 'error' : 'pending');
    return jsonp_(p.callback, {
      status: status,
      slots: remainingSlots_(),
      ...(status === 'error' ? { message: receipt.slice(6) } : {}),
    });
  }
  const name = normalizeName_(p.name);
  const phone = String(p.phone || '').trim();
  if (!name || name.length > 120 || !/^[6-9]\d{9}$/.test(phone)) {
    return reply_('Invalid lead');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = sheet_();
    const dateTime = Utilities.formatDate(new Date(), TIME_ZONE, 'dd-MM hh:mma');
    sheet.appendRow([safe_(name), '', '', phone]);
    const row = sheet.getLastRow();
    sheet.getRange(row, 2).setNumberFormat('@').setValue(dateTime);
    sheet.getRange(row, 1, 1, 3).setVerticalAlignment('middle');
    sheet.setRowHeight(row, 32);
    return reply_('OK');
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  let payload;
  try { payload = JSON.parse(e.postData.contents); }
  catch (err) { return reply_('Invalid JSON'); }
  if (payload.action !== 'screenshot') return reply_('Unknown action');

  const id = String(payload.uploadId || '');
  if (!validReceiptId_(id)) return reply_('Invalid upload ID');
  const name = normalizeName_(payload.name);
  const phone = String(payload.phone || '').trim();
  if (!name || !/^[6-9]\d{9}$/.test(phone)) return rejectUpload_(id, 'Invalid member');
  if (payload.mimeType !== 'image/jpeg') return rejectUpload_(id, 'Unsupported image');
  const encoded = String(payload.image || '');
  if (!encoded || encoded.length > 2600000) return rejectUpload_(id, 'Image too large');
  let bytes;
  try { bytes = Utilities.base64Decode(encoded); }
  catch (err) { return rejectUpload_(id, 'Invalid image'); }
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) return rejectUpload_(id, 'Image exceeds 1.9 MB');

  // Serialize uploads, retries and count updates across all visitors.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const props = PropertiesService.getScriptProperties();
    const receiptKey = RECEIPT_PREFIX + id;
    if (props.getProperty(receiptKey) === 'saved') return reply_('OK');
    const sheet = sheet_();
    const row = matchingRow_(sheet, name, phone);
    if (row < 2) return rejectUpload_(id, 'No matching signup');
    const cell = sheet.getRange(row, 3);

    // The same screenshot row cannot be used twice to claim a slot.
    if (cell.getDisplayValue() === 'View Screenshot') {
      props.setProperty(receiptKey, 'saved');
      return reply_('OK');
    }

    const timestamp = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyyMMdd_HHmmss');
    const filename = 'datespot_payment_' + timestamp + '_row_' + row + '.jpg';
    const blob = Utilities.newBlob(bytes, 'image/jpeg', filename);
    const file = getProofFolder_().createFile(blob);
    const fileUrl = file.getUrl();
    setScreenshotLink_(cell, fileUrl);
    cell.setNote('Private screenshot: ' + fileUrl);
    sheet.setRowHeight(row, 32);
    sheet.getImages().filter(img => {
      const anchor = img.getAnchorCell();
      return anchor.getRow() === row && anchor.getColumn() === 3;
    }).forEach(img => img.remove());
    SpreadsheetApp.flush();

    // Only after successful Drive storage + sheet link, count one new
    // joining per phone. A repeat receipt, signup or re-upload does not
    // take another slot. The count cannot go below zero.
    const joinedKey = JOIN_PREFIX + phoneHash_(phone);
    const updates = {};
    updates[receiptKey] = 'saved';
    if (!props.getProperty(joinedKey)) {
      updates[joinedKey] = '1';
      updates[SLOTS_PROPERTY] = String(Math.max(0, remainingSlots_() - 1));
    }
    props.setProperties(updates, false);
    return reply_('OK');
  } catch (err) {
    console.error('Screenshot upload error: ' + err);
    return rejectUpload_(id, 'Upload failed. Please retry.');
  } finally { lock.releaseLock(); }
}

function validReceiptId_(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function remainingSlots_() {
  const stored = PropertiesService.getScriptProperties().getProperty(SLOTS_PROPERTY);
  // Never initialize the value on a GET: concurrent reads cannot reset a deduction.
  if (stored === null) return INITIAL_SLOTS;
  const n = Number(stored);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : INITIAL_SLOTS;
}

function phoneHash_(phone) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, phone)
    .map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
}

function rejectUpload_(id, reason) {
  if (validReceiptId_(id)) {
    const key = RECEIPT_PREFIX + id;
    const props = PropertiesService.getScriptProperties();
    if (props.getProperty(key) !== 'saved') props.setProperty(key, 'error:' + reason);
  }
  return reply_(reason);
}

function jsonp_(callback, payload) {
  const name = String(callback || '');
  if (!/^[A-Za-z_$][\w$]{0,99}$/.test(name)) return reply_('Invalid callback');
  return ContentService.createTextOutput(name + '(' + JSON.stringify(payload) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function normalizeName_(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function matchingRow_(sheet, name, phone) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const first = Math.max(2, last - 999);
  const entries = sheet.getRange(first, 1, last - first + 1, 4).getDisplayValues();
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i][0] === name && entries[i][3] === phone) {
      return first + i;
    }
  }
  return -1;
}

function setScreenshotLink_(cell, url) {
  const richText = SpreadsheetApp.newRichTextValue()
    .setText('View Screenshot')
    .setLinkUrl(url)
    .build();
  cell.setRichTextValue(richText);
  cell.setVerticalAlignment('middle');
}

/**
 * Run this to authorize Google Drive access before updating the deployment.
 * Folder and files remain private unless you choose to share them.
 */
function authorizeScreenshotStorage() {
  const folder = getProofFolder_();
  console.log('Private screenshot folder ready: ' + folder.getName());
}

/**
 * Run once to convert old note-based Drive backups into clickable links.
 * Screenshots with no saved Drive backup cannot be recovered automatically.
 */
function restoreExistingScreenshotLinks() {
  const sheet = sheet_();
  const last = sheet.getLastRow();
  if (last < 2) return 'No rows to repair';
  const notes = sheet.getRange(2, 3, last - 1, 1).getNotes();
  let linked = 0;
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i] || '';
    const match = note.match(/(?:Private backup:|Private screenshot:)\s*(https:\/\/drive\.google\.com\/file\/d\/[^\s]+)/);
    if (!match) continue;
    const row = i + 2;
    setScreenshotLink_(sheet.getRange(row, 3), match[1]);
    sheet.setRowHeight(row, 32);
    sheet.getImages().filter(img => {
      const a = img.getAnchorCell();
      return a.getRow() === row && a.getColumn() === 3;
    }).forEach(img => img.remove());
    linked++;
  }
  SpreadsheetApp.flush();
  console.log('Restored screenshot links: ' + linked);
  return 'Restored ' + linked + ' screenshot links';
}

function getProofFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('proofFolderId');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (err) {}
  }
  const folder = DriveApp.createFolder('Datespot Deepavali Payment Screenshots');
  props.setProperty('proofFolderId', folder.getId());
  return folder;
}

function safe_(value) {
  return /^[=+@-]/.test(value) ? "'" + value : value;
}

function sheet_() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet tab not found');
  return sheet;
}

function reply_(message) {
  return ContentService.createTextOutput(message);
}
