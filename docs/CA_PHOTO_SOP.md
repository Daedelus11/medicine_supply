# Construction Administration — Photo Documentation SOP

**Effective:** April 2026  
**Applies to:** All Fine Line Studio CA projects

---

## Photo Storage — Server Path

Construction photos are hosted on the Hostineer server. Upload via WinSCP.

**Server path pattern:**
```
/mainwebsite_html/client/[project-slug]/photos/YYYY-MM-DD/
```

**Live URL pattern:**
```
https://fine-linestudio.com/client/[project-slug]/photos/YYYY-MM-DD/filename.jpg
```

**Example — Cacopardo April 9, 2026 site visit:**
```
/mainwebsite_html/client/cacopardo/photos/2026-04-09/IMG_5637.jpg
https://fine-linestudio.com/client/cacopardo/photos/2026-04-09/IMG_5637.jpg
```

---

## File Naming Convention

For architect site visit photos:
```
[Client]-CA-[YYYYMMDD]-[seq].jpg
Example: Cacopardo-CA-20260415-01.jpg
```

For client-submitted or GC-submitted photos, keep original filenames unless they are ambiguous. Date folder provides the context.

---

## Folder Structure Per Project

```
/mainwebsite_html/client/[slug]/photos/
  index.html                        (directory listing block)
  YYYY-MM-DD/                       (one folder per visit or submission date)
    filename.jpg
```

---

## OneDrive Mirror (Local Archive)

All photos also stored locally at:
```
C:\Users\User\OneDrive\Office\Marketing\CLAUDE\PHASE IV\CLIENTS\[ClientName]\CA\Photos\
  YYYY-MM-DD_SiteVisit\         (architect site visits)
  Client-Submitted\
    YYYY-MM-DD\
```

---

## Google Sheet Entry (CA_PHOTOS Tab)

Columns: `visit_date | phase | visit_note | photo_1_url | photo_1_caption | photo_1_flag | photo_2_url ...`

Photo URL format:
```
https://fine-linestudio.com/client/[slug]/photos/YYYY-MM-DD/filename.jpg
```

Flag values (optional): `INFO` | `ACTION REQUIRED` | `NON-CONFORMING`

---

## Upload Workflow (WinSCP)

1. Convert HEIC to JPG if needed (phone photos)
2. Rename per convention if architect-shot
3. Create date folder on server: `/mainwebsite_html/client/cacopardo/photos/YYYY-MM-DD/`
4. Upload JPGs via WinSCP drag-and-drop into that folder
5. Construct URLs and enter into CA_PHOTOS Sheet tab with captions
6. Sheet drives the portal automatically -- no other steps

---

## WordPress Media Library

Do not use WordPress for CA photo hosting. WordPress media is for portfolio and marketing images only.

---

## Projects Currently Active

| Project | Slug | Photos Path |
|---|---|---|
| Cacopardo Residence | cacopardo | `/client/cacopardo/photos/` |
| Dayspring Church | dayspring-church | `/client/dayspring-church/photos/` |
