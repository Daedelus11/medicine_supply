// MaRu Spain 2026 — Google Apps Script v4
// Handles: checklist toggle, checklist add, expense add, expense delete, expense edit,
//          saveParking, getParking
// Spreadsheet ID: 1ZxX9u3CgIJ6WISCk438kJ8D86Tx7oIpRofXGEFsFgQI

const SPREADSHEET_ID = '1ZxX9u3CgIJ6WISCk438kJ8D86Tx7oIpRofXGEFsFgQI';
const CHECKLIST_SHEET = 'Checklist';
const EXPENSES_SHEET  = 'Expenses';
const PARKING_SHEET   = 'Parking';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // ── SAVE PARKING SPOT ─────────────────────────────────────
    // Writes lat/lng/accuracy/note to a single-row Parking sheet.
    // Overwrites any previous spot — only one spot at a time.
    if (data.action === 'saveParking') {
      let sheet = ss.getSheetByName(PARKING_SHEET);
      if (!sheet) sheet = ss.insertSheet(PARKING_SHEET);
      sheet.clearContents();
      sheet.getRange('A1:D1').setValues([[
        data.lat, data.lng, data.accuracy, data.note
      ]]);
      return ok({ lat: data.lat, lng: data.lng });
    }

    // ── GET PARKING SPOT ──────────────────────────────────────
    // Returns the saved spot as JSON, or {} if none saved.
    if (data.action === 'getParking') {
      const sheet = ss.getSheetByName(PARKING_SHEET);
      if (!sheet || sheet.getLastRow() === 0) {
        return ContentService
          .createTextOutput(JSON.stringify({}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const row = sheet.getRange('A1:D1').getValues()[0];
      return ContentService
        .createTextOutput(JSON.stringify({
          lat:      row[0].toString(),
          lng:      row[1].toString(),
          accuracy: row[2],
          note:     row[3].toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── EXPENSE ADD ───────────────────────────────────────────
    if (data.action === 'expense') {
      const sheet = ss.getSheetByName(EXPENSES_SHEET);
      if (!sheet) throw new Error('Expenses sheet not found');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Description', 'Who', 'Amount', 'Currency']);
      }
      sheet.appendRow([data.date, data.desc, data.who, data.amount, data.currency]);
      return ok();
    }

    // ── EXPENSE DELETE ────────────────────────────────────────
    if (data.action === 'deleteExpense') {
      const sheet = ss.getSheetByName(EXPENSES_SHEET);
      if (!sheet) throw new Error('Expenses sheet not found');
      sheet.deleteRow(data.row);
      return ok();
    }

    // ── EXPENSE EDIT ──────────────────────────────────────────
    if (data.action === 'editExpense') {
      const sheet = ss.getSheetByName(EXPENSES_SHEET);
      if (!sheet) throw new Error('Expenses sheet not found');
      sheet.getRange(data.row, 1, 1, 5).setValues([[data.date, data.desc, data.who, data.amount, data.currency]]);
      return ok();
    }

    // ── CHECKLIST ADD ─────────────────────────────────────────
    if (data.action === 'add') {
      const sheet = ss.getSheetByName(CHECKLIST_SHEET);
      if (!sheet) throw new Error('Checklist sheet not found');
      sheet.appendRow([data.section, data.item, data.done, data.isParent]);
      return ok();
    }

    // ── CHECKLIST TOGGLE ──────────────────────────────────────
    if (data.row && data.done !== undefined) {
      const sheet = ss.getSheetByName(CHECKLIST_SHEET);
      if (!sheet) throw new Error('Checklist sheet not found');
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const doneCol = headers.findIndex(h => h.toString().toLowerCase() === 'done') + 1;
      if (doneCol < 1) throw new Error('Done column not found');
      sheet.getRange(data.row, doneCol).setValue(data.done ? 'TRUE' : 'FALSE');
      return ok();
    }

    throw new Error('Unknown action');

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ok(extra) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ status: 'ok' }, extra || {})))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'MaRu Spain 2026 v4' }))
    .setMimeType(ContentService.MimeType.JSON);
}
