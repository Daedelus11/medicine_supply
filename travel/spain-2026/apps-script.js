// ============================================================
// MaRu Spain 2026 — Google Apps Script v2
// Handles: Checklist toggles, checklist adds, expense adds
// Deploy as: Web app, Execute as: Me, Access: Anyone
// Spreadsheet ID: 1ZxX9u3CgIJ6WISCk438kJ8D86Tx7oIpRofXGEFsFgQI
// ============================================================

const SPREADSHEET_ID = '1ZxX9u3CgIJ6WISCk438kJ8D86Tx7oIpRofXGEFsFgQI';
const CHECKLIST_SHEET = 'Checklist';
const EXPENSES_SHEET  = 'Expenses';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // ── EXPENSE ADD (action:'expense') ───────────────────────
    if (data.action === 'expense') {
      const sheet = ss.getSheetByName(EXPENSES_SHEET);
      if (!sheet) throw new Error('Expenses sheet not found');
      // Ensure header row exists
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Description', 'Who', 'Amount', 'Currency']);
      }
      sheet.appendRow([
        data.date,
        data.desc,
        data.who,
        data.amount,
        data.currency
      ]);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── CHECKLIST ADD ────────────────────────────────────────
    if (data.action === 'add') {
      const sheet = ss.getSheetByName(CHECKLIST_SHEET);
      if (!sheet) throw new Error('Checklist sheet not found');
      sheet.appendRow([data.section, data.item, data.done, data.isParent]);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── CHECKLIST TOGGLE ─────────────────────────────────────
    if (data.row && data.done !== undefined) {
      const sheet = ss.getSheetByName(CHECKLIST_SHEET);
      if (!sheet) throw new Error('Checklist sheet not found');
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const doneCol = headers.findIndex(h => h.toString().toLowerCase() === 'done') + 1;
      if (doneCol < 1) throw new Error('Done column not found');
      sheet.getRange(data.row, doneCol).setValue(data.done ? 'TRUE' : 'FALSE');
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    throw new Error('Unknown action');

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'MaRu Spain 2026 script running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
