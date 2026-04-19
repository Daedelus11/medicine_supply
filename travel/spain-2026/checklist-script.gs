// MaRu Spain 2026 — Checklist Web App
// Deploy: Extensions > Apps Script > Deploy > New Deployment > Web App
// Execute as: Me | Who has access: Anyone
// Copy the deployment URL and paste into spain-2026.html as CHECKLIST_SCRIPT_URL

const SHEET_ID = '1ZxX9u3CgIJ6WISCk438kJ8D86Tx7oIpRofXGEFsFgQI';
const TAB_NAME = 'Checklist';

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Use POST to toggle items' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const rowIndex = parseInt(params.row); // 1-based row in sheet (including header)
    const done = params.done === true || params.done === 'true';

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(TAB_NAME);

    // Column D = Done (col 4)
    sheet.getRange(rowIndex, 4).setValue(done ? 'TRUE' : 'FALSE');

    const result = { status: 'ok', row: rowIndex, done: done };
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
