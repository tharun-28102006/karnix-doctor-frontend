# Karnix Spine Edge — Doctor Workstation Frontend

A standalone, offline-friendly React/Vite frontend prototype for a doctor-facing Karnix Spine Edge workstation. This package contains **frontend only**. It does not include or connect to the C++ engine, backend, SQLite database, authentication server, or KarnixOS record file.

## Features
- Clinical overview and worklist with search and status filters
- Local image selection and preview (JPG, PNG, BMP, PPM, PGM; up to 10 MB in the UI)
- DICOM unsupported message
- Study detail view with synthetic demo-fixture outputs clearly labeled
- History, fixture trend chart, two-study comparison and JSON export
- Print-friendly detail/history via browser print
- Model card with limitations and baseline-metric verification warning
- Responsive layout; bundled inline SVG icons and local synthetic illustration; no CDN or runtime external calls

## Run locally
Prerequisite: Node.js 20.19+ or 22.12+ recommended for current Vite.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (configured for `http://127.0.0.1:3000`). The dev server binds to loopback. To create a static production build:

```bash
npm run build
npm run preview
```

No environment variables are required.

## Honest demo boundaries
- Persistent banner labels the project as a research prototype and indicates DEMO FIXTURE MODE.
- All included study rows and result values are synthetic fixtures, not patient records or real inference.
- The image in result details is a synthetic SVG illustration, not an X-ray or MRI scan.
- Uploads are read only by the browser for optional preview. They are not uploaded, persisted, or analyzed.
- Adding an imported item creates an in-memory “Awaiting engine” draft. It does not call Karnix or create a KarnixOS record.
- There is no real login/authentication, role enforcement, or protected data storage.
- No heatmap is fabricated. Experimental metrics remain “Not supplied.”
- The implementation plan contains conflicting baseline accuracy figures; verify against the engine README/evaluation report before publishing any exact metric. This frontend intentionally avoids asserting an unverified baseline.
- Browser-side file checks are usability checks only. They are not an upload-security boundary.

## Project files
- `src/App.jsx` — pages and local prototype interactions
- `src/styles.css` — responsive design system and components
- `public/demo-spine.svg` — synthetic placeholder illustration, not medical imagery
- `DESIGN.md` — UI tokens and rules

## Next integration step
When the backend is available, replace local fixture state with authenticated API calls. The backend must validate image contents and size, normalize image formats safely, call the engine with `spawn` (no shell), persist records and enforce authorization. Do not enable clinical-use claims until the engine outputs and clinical limitations have been verified.
