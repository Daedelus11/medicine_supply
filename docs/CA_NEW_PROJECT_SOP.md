# Fine Line Studio — CA Module New Project Setup SOP
**Version:** 1.0  
**System:** Static HTML + Google Sheets (observations) + Supabase (submittals, RFIs)  
**Template file:** `client/templates/ca-template.html`

---

## Overview

Each active project gets a single Construction Administration page at:

```
https://fine-linestudio.com/client/[CLIENT_SLUG]/[CLIENT_SLUG]-construction-admin.html
```

This page contains three modules in one password-gated interface:
- **Site Observations** — photo log driven by Google Sheets
- **Submittals** — Supabase-backed log with file upload
- **RFI Log** — Supabase-backed log with dual file upload

Supabase tables (`submittals`, `rfis`) are shared across all projects, scoped by `client_slug` + `project_no`. No database changes are needed for new projects.

---

## Required Information Before Starting

Gather these before touching any files:

| Item | Example | Where to get it |
|---|---|---|
| Project name | Dayspring Church | Contract |
| Project number | 24-0701 | Project Master List |
| Client slug | dayspring | Choose: lowercase, URL-safe, no spaces |
| CA password | Dayspring2026 | Assign now; log in Fine Line Client List Sheet |
| Phase order | (customize or use default) | Based on project type |

---

## Step 1 — Create the Google Sheet

1. Open the **Fine Line CA Master Template Sheet**:  
   `https://docs.google.com/spreadsheets/d/15IUH9-w-sjFufismUaYavFLJ6PhDKG48vs7DZmSOaT4`

2. Make a copy: **File > Make a copy**  
   Name it: `[PROJECT_NO] - [Project Name] - CA Data`  
   Save to the project's Google Drive folder.

3. The sheet must contain these tabs:

### CONFIG tab
Key/value pairs (Column A = key, Column B = value):

| Key | Example Value |
|---|---|
| contractor | Big D Construction |
| last_updated | May 2, 2026 |
| status_note | Framing in progress — upper level |
| current_phase | Framing |

`current_phase` must exactly match one of the phase names in `PHASE_ORDER`.

### CA_PHOTOS tab
One row per site visit. Columns:

| Column | Description |
|---|---|
| visit_date | YYYY-MM-DD |
| phase | Phase label e.g. "Framing" |
| visit_note | Brief visit summary |
| photo_1_url ... photo_12_url | Full server URL to uploaded photo |
| photo_1_caption ... photo_12_caption | Caption text |
| photo_1_flag ... photo_12_flag | INFO, ACTION REQUIRED, or NON-CONFORMING |

Photos must be uploaded to the server first (see CA Photo SOP at `docs/CA_PHOTO_SOP.md`).

4. **Publish the sheet to web:**  
   File > Share > Publish to web > Select sheet > CSV > Publish  
   Copy the base URL. It will look like:  
   `https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?output=csv`

5. **Get the GIDs for each tab:**  
   Click each tab in the browser. The URL will show `#gid=XXXXXXXXXX`.  
   Record the decimal GID for CONFIG and CA_PHOTOS.

---

## Step 2 — Configure the Template

1. Get the template from the repo:  
   `client/templates/ca-template.html`

2. Open the file and locate the CONFIG block near the bottom (search for `EDIT THESE VALUES`).

3. Replace all `{{TOKEN}}` values:

```javascript
const CONFIG = {
  PASS:        '{{CA_PASSWORD}}',       // e.g. 'Dayspring2026'
  SESS_KEY:    '{{CLIENT_SLUG}}_ca_auth', // e.g. 'dayspring_ca_auth'
  PROJECT_NO:  '{{PROJECT_NO}}',        // e.g. '24-0701'
  CLIENT_SLUG: '{{CLIENT_SLUG}}',       // e.g. 'dayspring'
  CONFIG_CSV:  '{{SHEET_CSV_BASE}}&gid={{CONFIG_GID}}&single=true&output=csv',
  PHOTOS_CSV:  '{{SHEET_CSV_BASE}}&gid={{PHOTOS_GID}}&single=true&output=csv',
  SB_URL:      'https://mrhgitbdobfnelnulnbg.supabase.co',  // never changes
  SB_KEY:      '[anon key - copy from existing deployed file]', // never changes
  BUCKET:      'fine-line-portals',     // never changes
  PHASE_ORDER: '{{PHASE_ORDER}}'
};
```

**Default PHASE_ORDER** (residential/commercial construction):
```
Pre-Construction,Bidding,Site Preparation,Foundation,Framing,Envelope,MEP Rough,Insulation,Drywall,Finishes,Punch List,Substantial Completion
```

4. Also replace these locations in the HTML (search for `{{PROJECT_NAME}}` and `{{PROJECT_NO}}`):
   - Page `<title>` tag
   - Gate subtitle line
   - Page header title and project no meta

5. Save as: `[CLIENT_SLUG]-construction-admin.html`

---

## Step 3 — Update the Portal Home Page

Add a CA card to the project's portal home page (`[CLIENT_SLUG]-portal.html`).

The card should link to `[CLIENT_SLUG]-construction-admin.html`.  
Add it to the portal footer nav as the last item with class `active` when on the CA page.

---

## Step 4 — Deploy

Upload via WinSCP to:
```
/mainwebsite_html/client/[CLIENT_SLUG]/[CLIENT_SLUG]-construction-admin.html
```

**FTP credentials:**
- Host: `64.22.68.21`
- User: `mwagner@fine-linestudio.com`
- Password: in memory
- Port: 21, FTPS explicit SSL

The file is typically ~65KB. WinSCP handles this reliably. Do not use curl (blocked at port 21 from Claude sandbox; files over ~14KB also fail via server-side buffer).

---

## Step 5 — Log the Password

Record the CA password in the **Fine Line Client List Google Sheet** under the project row.  
Convention: `[ClientName][Year]` e.g. `Dayspring2026`

Portal passwords (separate from CA password) follow the same pattern and are also logged in that sheet.

---

## Step 6 — Verify

1. Navigate to `https://fine-linestudio.com/client/[CLIENT_SLUG]/[CLIENT_SLUG]-construction-admin.html`
2. Enter the CA password
3. Confirm three tabs load: Site Observations, Submittals, RFI Log
4. Confirm Site Observations pulls data from the Google Sheet (or shows empty state cleanly)
5. Confirm Submittals and RFI tabs show empty state with working New buttons
6. Test New Submittal modal — save a test record, verify it appears in the table

---

## Logging Submittals

Use the **New Submittal** modal on the CA page. Required fields:
- Submittal No. — format: `[PROJECT_NO]-SUB-001`
- Description

All other fields optional but recommended:
- Spec Section (CSI format e.g. `08 50 00`)
- Submitted By
- Date Submitted / Received / Reviewed
- Status
- Document upload (PDF, JPG, DOCX, XLSX — max 50MB)
- Remarks

Files are stored in Supabase Storage at:
`fine-line-portals/[client_slug]/[project_no]/submittals/[submittal_no]/[filename]`

---

## Logging RFIs

Use the **New RFI** modal. Required fields:
- RFI No. — format: `[PROJECT_NO]-RFI-001`
- Subject

Two file slots: RFI document + Response document.  
Files stored at: `fine-line-portals/[client_slug]/[project_no]/rfis/[rfi_no]/[filename]`

---

## Logging Site Observations (Photos)

See `docs/CA_PHOTO_SOP.md` for the full photo upload workflow.

Summary:
1. Convert HEIC to JPG if needed using `tools/heic_convert.py`
2. Upload via WinSCP to `/mainwebsite_html/client/[CLIENT_SLUG]/photos/YYYY-MM-DD/`
3. Paste server URLs into the CA_PHOTOS tab of the project Google Sheet
4. The CA page refreshes data on each load — no deployment needed

---

## Project Status Reference

| Project | Slug | No. | CA Status |
|---|---|---|---|
| Cacopardo Residence | cacopardo | 25-0301 | Active - CA page live |
| Dayspring Church | dayspring | 24-0701 | Pre-construction |
| Rob Nyhof / Eastman | nyhof | 26-0401 | No CA module |

---

## Supabase Reference

- **Project:** `mrhgitbdobfnelnulnbg` (us-west-2)
- **Dashboard:** `https://supabase.com/dashboard/project/mrhgitbdobfnelnulnbg`
- **Tables:** `submittals`, `rfis` - both RLS-enabled, anon read/insert/update
- **Storage bucket:** `fine-line-portals` (private, 50MB per file)
- **No action needed** when adding new projects - tables scope by slug + project_no automatically
