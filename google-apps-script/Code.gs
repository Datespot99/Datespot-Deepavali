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

function doGet(e) {
  const p = (e && e.parameter) || {};
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
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_('Invalid JSON');
  }
  if (payload.action !== 'screenshot') return reply_('Unknown action');

  const name = normalizeName_(payload.name);
  const phone = String(payload.phone || '').trim();
  if (!name || !/^[6-9]\d{9}$/.test(phone)) return reply_('Invalid member');
  if (payload.mimeType !== 'image/jpeg') return reply_('Unsupported image');

  const encoded = String(payload.image || '');
  if (!encoded || encoded.length > 2600000) return reply_('Image too large');
  let bytes;
  try {
    bytes = Utilities.base64Decode(encoded);
  } catch (err) {
    return reply_('Invalid image');
  }
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) {
    return reply_('Image exceeds 1.9 MB');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = sheet_();
    const row = matchingRow_(sheet, name, phone);
    if (row < 2) return reply_('No matching signup');

    const cell = sheet.getRange(row, 3);
    const timestamp = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyyMMdd_HHmmss');
    const filename = 'datespot_deepavali_payment_' + timestamp + '_row_' + row + '.jpg';
    const blob = Utilities.newBlob(bytes, 'image/jpeg', filename);

    // Create the private Drive file first. Do not mark a screenshot as saved
    // unless Drive actually accepted the upload.
    const file = getProofFolder_().createFile(blob);
    const fileUrl = file.getUrl();
    setScreenshotLink_(cell, fileUrl);
    cell.setNote('Private screenshot: ' + fileUrl);
    sheet.setRowHeight(row, 32);

    // Only remove prior floating thumbnails after the Drive file and link exist.
    sheet.getImages().filter(img => {
      const anchor = img.getAnchorCell();
      return anchor.getRow() === row && anchor.getColumn() === 3;
    }).forEach(img => img.remove());

    SpreadsheetApp.flush();
    return reply_('OK');
  } catch (err) {
    console.error('Screenshot upload error: ' + err);
    return reply_('Upload failed. Please retry.');
  } finally {
    lock.releaseLock();
  }
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
