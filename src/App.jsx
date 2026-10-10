import { useEffect, useMemo, useRef, useState } from 'react';

const initialCases = [
  { id: 'KS-DEMO-1042', patient: 'DEMO-2041', study: 'Lumbar spine study', modality: 'X-ray', date: '2026-10-10T08:42:00', status: 'Needs review', className: 'Uncertain', risk: 44, riskLabel: 'Review advised', normal: 48, abnormal: 52, processing: 86, source: 'DEMO FIXTURE', notes: ['Example engine suggestion text would appear here when supplied by Karnix.'], model: 'SpineCNN · fixture' },
  { id: 'KS-DEMO-1041', patient: 'DEMO-1987', study: 'Knee imaging', modality: 'X-ray', date: '2026-10-10T08:18:00', status: 'Complete', className: 'Demo abnormal', risk: 68, riskLabel: 'Higher review priority', normal: 32, abnormal: 68, processing: 94, source: 'DEMO FIXTURE', notes: ['Illustrative suggestion from fixture only. No clinical recommendation generated.'], model: 'SpineCNN · fixture' },
  { id: 'KS-DEMO-1038', patient: 'DEMO-1876', study: 'Lumbar spine study', modality: 'MRI', date: '2026-10-09T16:25:00', status: 'Complete', className: 'Demo normal', risk: 18, riskLabel: 'Lower review priority', normal: 82, abnormal: 18, processing: 122, source: 'DEMO FIXTURE', notes: ['Fixture output only. Clinical assessment is still required.'], model: 'SpineCNN · fixture' },
  { id: 'KS-DEMO-1034', patient: 'DEMO-1760', study: 'Lumbar spine study', modality: 'X-ray', date: '2026-10-09T14:07:00', status: 'Failed', className: 'Not available', risk: null, riskLabel: 'No result', normal: null, abnormal: null, processing: null, source: 'DEMO FIXTURE', notes: [], model: 'Not run' },
  { id: 'KS-DEMO-1029', patient: 'DEMO-1553', study: 'Spine study', modality: 'CT', date: '2026-10-08T11:51:00', status: 'Complete', className: 'Uncertain', risk: 37, riskLabel: 'Review advised', normal: 58, abnormal: 42, processing: 137, source: 'DEMO FIXTURE', notes: ['Illustrative fixture only.'], model: 'SpineCNN · fixture' },
];

const navItems = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'worklist', label: 'Study worklist', icon: 'layers' },
  { id: 'upload', label: 'Import study', icon: 'upload' },
  { id: 'history', label: 'History & compare', icon: 'history' },
  { id: 'model', label: 'Model card', icon: 'book' },
];

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v4h16v-4"/></>,
    history: <><path d="M3 12a9 9 0 1 0 2.4-6.1L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M4 4.5V22"/><path d="M8 7h8M8 11h7"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    down: <path d="m6 9 6 6 6-6"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    scan: <><path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3"/><path d="M5 12h14"/><path d="M8 9v6m4-6v6m4-6v6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v4m0 3h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 19v2h16v-2"/></>,
    print: <><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    external: <><path d="M14 3h7v7M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
  };
  return <svg {...common}>{paths[name] || paths.file}</svg>;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}
function formatTime(value) {
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
function StatusPill({ status }) {
  const cls = status.toLowerCase().replace(/[^a-z]+/g, '-');
  return <span className={`status-pill status-${cls}`}><span className="status-dot" />{status}</span>;
}
function RiskBadge({ risk, label }) {
  if (risk === null || risk === undefined) return <span className="risk-badge risk-neutral">No result</span>;
  const kind = risk >= 60 ? 'high' : risk >= 30 ? 'medium' : 'low';
  return <span className={`risk-badge risk-${kind}`}><span className="risk-number">{risk}</span><span>{label || kind}</span></span>;
}
function BrandMark() {
  return <div className="brand-lockup"><div className="brand-mark"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 3 29 9v12L18 33 7 27V9Z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M14 9c-2 4 2 5 0 9s-2 5 0 8M22 9c2 4-2 5 0 9s2 5 0 8M13 13h10M12 18h12M13 23h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div><div><div className="brand-name">KARNIX</div><div className="brand-sub">SPINE EDGE</div></div></div>;
}
function Disclaimer() {
  return <div className="prototype-banner"><Icon name="shield" size={16}/><span><strong>Research prototype</strong> — not a medical device or diagnosis. Verify all findings clinically.</span><span className="banner-mode">DEMO FIXTURE MODE</span></div>;
}
function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>;
}
function StatCard({ label, value, detail, icon, tone = 'blue' }) {
  return <div className="stat-card"><div className={`stat-icon stat-icon-${tone}`}><Icon name={icon} size={19}/></div><div className="stat-copy"><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div></div>;
}
function MiniSparkline({ points = [8, 12, 10, 14, 9, 11, 7, 10], color = '#3879bf' }) {
  const min = Math.min(...points), max = Math.max(...points);
  const coords = points.map((p, i) => `${i * (100 / (points.length - 1))},${28 - ((p - min) / Math.max(1, max - min)) * 22}`).join(' ');
  return <svg className="mini-sparkline" viewBox="0 0 100 32" aria-hidden="true"><polyline points={coords} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ResultsSparkline({ cases }) {
  const vals = cases.filter(c => c.risk != null).slice().reverse().map(c => c.risk);
  if (vals.length < 2) return <div className="empty-chart">Not enough results to show a trend.</div>;
  const W = 620, H = 146, pad = 18;
  const min = 0, max = 100;
  const coords = vals.map((v, i) => `${pad + i * (W - 2 * pad) / (vals.length - 1)},${H - pad - (v - min) / (max - min) * (H - 2 * pad)}`).join(' ');
  return <svg className="trend-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Demo fixture risk scores over recent studies">
    {[0, 25, 50, 75, 100].map(v => { const y = H - pad - v / 100 * (H - 2 * pad); return <g key={v}><line x1={pad} y1={y} x2={W-pad} y2={y} stroke="#e7edf3" strokeWidth="1"/><text x="0" y={y+4} fontSize="10" fill="#7c8998">{v}</text></g>; })}
    <polyline points={coords} fill="none" stroke="#3b82c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    {vals.map((v, i) => { const x = pad + i * (W - 2 * pad) / (vals.length - 1), y = H - pad - v / 100 * (H - 2 * pad); return <circle key={`${v}-${i}`} cx={x} cy={y} r="4" fill="#fff" stroke="#3b82c4" strokeWidth="2"/>; })}
  </svg>;
}
function StudyTable({ items, onOpen, selectable = false, checkedIds = [], onCheck }) {
  if (!items.length) return <div className="empty-state"><div className="empty-icon"><Icon name="file" size={22}/></div><h3>No matching studies</h3><p>Try changing the search or filter.</p></div>;
  return <div className="table-scroll"><table className="study-table"><thead><tr>{selectable && <th className="check-col"><span className="sr-only">Compare</span></th>}<th>Study / patient</th><th>Modality</th><th>Received</th><th>Status</th><th>Risk indicator</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{items.map(item => <tr key={item.id} className="clickable-row" onClick={() => onOpen(item)} tabIndex="0" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(item); } }}>
    {selectable && <td onClick={e => e.stopPropagation()}><input className="compare-check" aria-label={`Select ${item.id} for comparison`} type="checkbox" checked={checkedIds.includes(item.id)} onChange={() => onCheck(item.id)} /></td>}
    <td><div className="study-cell"><div className="study-avatar">{item.modality === 'MRI' ? 'MR' : item.modality === 'CT' ? 'CT' : item.modality === 'DEXA' ? 'DX' : 'XR'}</div><div><div className="study-id">{item.id}</div><div className="study-sub">{item.patient} <span className="sub-divider">·</span> {item.study}</div></div></div></td>
    <td><span className="modality-label">{item.modality}</span></td><td><div className="date-main">{formatDate(item.date)}</div><div className="date-sub">{formatTime(item.date)}</div></td><td><StatusPill status={item.status}/></td><td><RiskBadge risk={item.risk} label={item.riskLabel}/></td><td><button className="icon-button row-open" aria-label={`Open ${item.id}`} onClick={e => { e.stopPropagation(); onOpen(item); }}><Icon name="chevron"/></button></td>
  </tr>)}</tbody></table></div>;
}
function ImageFrame({ compact = false }) {
  return <div className={`image-frame ${compact ? 'image-frame-compact' : ''}`}><img src="/demo-spine.svg" alt="Synthetic spine illustration for layout demonstration, not a medical scan"/><div className="image-watermark">SYNTHETIC DEMO IMAGE</div><div className="image-frame-controls"><button className="viewer-chip" type="button" title="Viewer controls are UI-only"><span>Fit</span></button><button className="viewer-chip" type="button" title="Viewer controls are UI-only"><span>1:1</span></button></div></div>;
}
function Overview({ cases, onGo, onOpen }) {
  const pending = cases.filter(c => ['Needs review', 'Awaiting engine'].includes(c.status)).length;
  const completed = cases.filter(c => c.status === 'Complete').length;
  const latest = cases[0];
  return <>
    <PageHeader eyebrow="CLINICAL WORKSPACE" title="Overview" description="Review incoming spine studies and research-model outputs." action={<button className="button button-primary" onClick={() => onGo('upload')}><Icon name="plus" size={17}/> Import study</button>}/>
    <div className="fixture-note"><span className="fixture-dot"/> Demonstration environment — all displayed studies and results are synthetic fixtures, not patient records.</div>
    <section className="stat-grid" aria-label="Demo fixture summary"><StatCard label="Studies in worklist" value={String(cases.length).padStart(2,'0')} detail="Local demo records" icon="layers"/><StatCard label="Awaiting review" value={String(pending).padStart(2,'0')} detail="Requires clinician review" icon="clock" tone="amber"/><StatCard label="Completed analyses" value={String(completed).padStart(2,'0')} detail="Fixture outputs only" icon="check" tone="green"/><StatCard label="Engine connection" value="Offline" detail="Frontend-only build" icon="shield" tone="slate"/></section>
    <section className="overview-grid">
      <div className="panel worklist-panel"><div className="panel-heading"><div><h2>Recent studies</h2><p>Latest items in the demo worklist</p></div><button className="button button-quiet" onClick={() => onGo('worklist')}>View worklist <Icon name="arrow" size={16}/></button></div><StudyTable items={cases.slice(0,4)} onOpen={onOpen}/><div className="panel-footer"><span><span className="fixture-dot small"/> Demo fixtures</span><button className="text-button" onClick={() => onGo('history')}>Open history <Icon name="arrow" size={14}/></button></div></div>
      <div className="panel priority-panel"><div className="panel-heading"><div><h2>Review queue</h2><p>Priority is illustrative, not clinical triage</p></div><span className="count-badge">{pending}</span></div><div className="queue-list">{cases.filter(c => ['Needs review','Awaiting engine'].includes(c.status)).slice(0,3).map((c, i) => <button className="queue-item" key={c.id} onClick={() => onOpen(c)}><span className={`queue-index queue-${i}`}>{String(i+1).padStart(2,'0')}</span><span className="queue-info"><strong>{c.id}</strong><span>{c.patient} · {c.modality}</span></span><span className="queue-time">{formatTime(c.date)}</span><Icon name="chevron" size={16}/></button>)}</div><div className="queue-callout"><Icon name="alert" size={17}/><span>Real engine status and medical prioritization are not connected in this build.</span></div></div>
    </section>
    <section className="panel trend-panel"><div className="panel-heading"><div><h2>Risk history</h2><p>Fixture risk scores for interface testing only</p></div><span className="unit-label">Score 0–100 · demo</span></div><ResultsSparkline cases={cases}/><div className="chart-legend"><span><i className="legend-line"/> Fixture risk score</span><span>Not for clinical interpretation</span></div></section>
    <div className="overview-footnote">Latest item: <strong>{latest?.id || 'No study'}</strong> · Created in the browser prototype; no data has been sent to KarnixOS.</div>
  </>;
}
function Worklist({ cases, onOpen, onGo }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All statuses');
  const filtered = cases.filter(c => `${c.id} ${c.patient} ${c.study} ${c.modality}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All statuses' || c.status === filter));
  return <><PageHeader eyebrow="CASE MANAGEMENT" title="Study worklist" description="Track imported studies and open their available results." action={<button className="button button-primary" onClick={() => onGo('upload')}><Icon name="plus" size={17}/> Import study</button>}/><div className="panel table-panel"><div className="toolbar"><div className="search-field"><Icon name="search" size={17}/><input aria-label="Search worklist" placeholder="Search study or demo patient ID" value={query} onChange={e=>setQuery(e.target.value)}/></div><select aria-label="Filter by status" value={filter} onChange={e=>setFilter(e.target.value)}><option>All statuses</option><option>Needs review</option><option>Complete</option><option>Failed</option><option>Awaiting engine</option></select><span className="results-count">{filtered.length} studies</span></div><StudyTable items={filtered} onOpen={onOpen}/><div className="panel-footer"><span>Showing local fixture records only</span><span>{filtered.length} visible</span></div></div></>;
}
function UploadPage({ onAdded, onGo }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [modality, setModality] = useState('Auto-detect');
  const [patient, setPatient] = useState('DEMO-NEW');
  const [accession, setAccession] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const fileInput = useRef(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  function pickFile(next) {
    setError(''); setAdded(false);
    if (!next) return;
    const ext = next.name.split('.').pop().toLowerCase();
    if (ext === 'dcm' || ext === 'dicom') { setFile(null); setPreview(''); setError('DICOM is not supported in this frontend-only prototype. The planned backend will need a dedicated DICOM ingestion path.'); return; }
    if (!['jpg','jpeg','png','bmp','ppm','pgm'].includes(ext)) { setFile(null); setPreview(''); setError('Unsupported file type. Choose JPG, PNG, BMP, PPM or PGM.'); return; }
    if (next.size > 10 * 1024 * 1024) { setFile(null); setPreview(''); setError('File exceeds the 10 MB frontend demo limit.'); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(['jpg','jpeg','png','bmp'].includes(ext) ? URL.createObjectURL(next) : '');
  }
  function addDraft() {
    if (!file) { setError('Choose a scan image first.'); return; }
    const item = { id: `LOCAL-${Math.random().toString(36).slice(2,7).toUpperCase()}`, patient: patient.trim() || 'DEMO-NEW', study: accession.trim() || 'Imported study draft', modality: modality === 'Auto-detect' ? 'X-ray' : modality, date: new Date().toISOString(), status: 'Awaiting engine', className: 'No result', risk: null, riskLabel: 'No result', normal: null, abnormal: null, processing: null, source: 'LOCAL PREVIEW', notes: [], model: 'Not run', localFileName: file.name };
    onAdded(item); setAdded(true); setError('');
  }
  return <><PageHeader eyebrow="INPUT STUDY" title="Import a study" description="Select a local image to preview the intended ingestion workflow." action={<button className="button button-secondary" onClick={() => onGo('worklist')}>Return to worklist</button>}/><div className="two-column upload-layout"><div className="panel upload-panel"><div className="section-title-row"><div><h2>Study image</h2><p>Accepted for UI preview: JPG, PNG, BMP, PPM, PGM</p></div><span className="format-pill">Max 10 MB</span></div><div className={`dropzone ${dragging?'dragging':''} ${file?'has-file':''}`} role="button" tabIndex="0" onClick={()=>fileInput.current?.click()} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fileInput.current?.click();}}} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);pickFile(e.dataTransfer.files?.[0]);}}><input ref={fileInput} type="file" accept=".jpg,.jpeg,.png,.bmp,.ppm,.pgm,image/jpeg,image/png,image/bmp" onChange={e=>pickFile(e.target.files?.[0])} hidden/><div className="drop-icon"><Icon name={file?'file':'upload'} size={23}/></div>{file?<><strong>{file.name}</strong><span>{(file.size/1024).toFixed(0)} KB · selected for local preview</span><button className="text-button" type="button" onClick={e=>{e.stopPropagation();setFile(null);if(preview)URL.revokeObjectURL(preview);setPreview('');setAdded(false);}}>Remove file</button></>:<><strong>Drop an imaging file here</strong><span>or choose a file from this computer</span><span className="button button-secondary choose-file">Choose image</span></>}<span className="drop-helper">No file is uploaded in this prototype. File selection stays in this browser tab.</span></div>{error&&<div className="inline-error" role="alert"><Icon name="alert" size={17}/>{error}</div>}{file&&<div className="preview-wrap"><div className="preview-caption"><span>Selected image preview</span><span className="fixture-label">LOCAL ONLY</span></div>{preview?<img className="local-preview" src={preview} alt={`Local preview of ${file.name}`}/>:<div className="preview-unavailable"><Icon name="file" size={22}/><span>Browser preview unavailable for this format.</span><small>Backend conversion has not been implemented.</small></div>}</div>}</div>
  <div className="panel form-panel"><h2>Study details</h2><p className="panel-intro">Metadata is kept in the current UI session only.</p><label className="field-label" htmlFor="patient-id">Patient / demo identifier</label><input id="patient-id" className="text-input" value={patient} onChange={e=>setPatient(e.target.value)} placeholder="e.g. DEMO-2041"/><label className="field-label" htmlFor="accession">Study description (optional)</label><input id="accession" className="text-input" value={accession} onChange={e=>setAccession(e.target.value)} placeholder="e.g. Lumbar spine follow-up"/><label className="field-label" htmlFor="modality">Modality</label><select id="modality" className="text-input" value={modality} onChange={e=>setModality(e.target.value)}><option>Auto-detect</option><option>X-ray</option><option>DEXA</option><option>CT</option><option>MRI</option></select><div className="form-callout"><Icon name="shield" size={17}/><span><strong>Local-only prototype.</strong> No patient data leaves this browser. No engine call or diagnosis is performed.</span></div><button className="button button-primary button-full" onClick={addDraft} disabled={!file}><Icon name="plus" size={17}/> Add local draft to worklist</button>{added&&<div className="inline-success" role="status"><Icon name="check" size={17}/><div><strong>Draft added to this session</strong><span>Status: Awaiting engine. No analysis was run.</span><button className="text-button" onClick={()=>onGo('worklist')}>Open worklist <Icon name="arrow" size={14}/></button></div></div>}<p className="microcopy">The eventual backend must verify magic bytes, normalize images, store files securely and call the real Karnix engine.</p></div></div></>;
}
function ResultDetail({ item, onBack, onGo }) {
  const [experimentalOpen, setExperimentalOpen] = useState(false);
  const [heatmap, setHeatmap] = useState(false);
  const [notice, setNotice] = useState('');
  function exportJSON() {
    const payload = { disclaimer: 'DEMO FIXTURE — not a patient record or clinical result', study: item };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${item.id}-demo.json`; a.click(); URL.revokeObjectURL(url);
  }
  const hasResult = item.risk !== null && item.risk !== undefined;
  return <><div className="breadcrumb"><button className="text-button" onClick={onBack}>Study worklist</button><Icon name="chevron" size={14}/><span>{item.id}</span></div><PageHeader eyebrow="STUDY DETAIL · DEMO FIXTURE" title={item.study} description={`${item.id} · ${item.patient} · ${item.modality} · ${formatDate(item.date)}`} action={<><button className="button button-secondary" onClick={exportJSON}><Icon name="download" size={16}/> Export JSON</button><button className="button button-secondary" onClick={()=>window.print()}><Icon name="print" size={16}/> Print</button></>}/><div className="fixture-note"><span className="fixture-dot"/> DEMO FIXTURE — illustrative records only. No real engine response is connected.</div>
    <div className="detail-layout"><div className="detail-main"><section className="panel viewer-panel"><div className="panel-heading"><div><h2>Original image</h2><p>Viewer placeholder · synthetic artwork, not diagnostic imaging</p></div><span className="modality-label">{item.modality}</span></div>{item.localFileName ? <div className="preview-unavailable wide"><Icon name="file" size={23}/><strong>{item.localFileName}</strong><span>Original upload preview was held only in the prior page state and is not persisted.</span></div> : <ImageFrame/>}<div className="viewer-footer"><span><Icon name="shield" size={14}/> Synthetic image · no patient data</span><button className="text-button" onClick={()=>setNotice('No heatmap is supplied by this frontend. The heatmap control remains unavailable until the engine returns a real overlay.')}>Heatmap availability <Icon name="chevron" size={14}/></button></div>{notice&&<div className="inline-info" role="status">{notice}<button aria-label="Dismiss message" className="icon-button" onClick={()=>setNotice('')}><Icon name="close" size={14}/></button></div>}</section>
    <section className="panel probability-panel"><div className="panel-heading"><div><h2>Model output</h2><p>Displayed values belong to the demo fixture</p></div><span className="source-chip">{item.model}</span></div>{hasResult?<><div className="result-summary"><div><div className="result-class-label">Fixture classification</div><div className="result-class">{item.className}</div><div className="result-context">{item.riskLabel}</div></div><RiskBadge risk={item.risk} label="fixture score"/></div><div className="probability-row"><div className="prob-heading"><span>Normal class</span><strong>{item.normal}%</strong></div><div className="prob-track"><div className="prob-fill prob-normal" style={{width:`${item.normal}%`}}/></div></div><div className="probability-row"><div className="prob-heading"><span>Abnormal class</span><strong>{item.abnormal}%</strong></div><div className="prob-track"><div className="prob-fill prob-abnormal" style={{width:`${item.abnormal}%`}}/></div></div><div className="uncalibrated-note"><Icon name="alert" size={16}/><span>Probabilities are illustrative and uncalibrated. They must not guide clinical decisions.</span></div></>:<div className="no-result"><div className="empty-icon"><Icon name="clock" size={22}/></div><h3>No analysis result</h3><p>This item is awaiting the real Karnix engine. No classification, probability or risk score is available.</p></div>}</section>
    <section className="panel suggestions-panel"><div className="panel-heading"><div><h2>Engine suggestions</h2><p>Research-only strings, when returned by the engine</p></div></div>{item.notes?.length ? <ul className="suggestion-list">{item.notes.map((s,i)=><li key={i}><span className="suggestion-bullet"><Icon name="file" size={14}/></span><span>{s}</span></li>)}</ul>:<div className="muted-empty">No engine-supplied suggestions are available for this item.</div>}</section>
    </div><aside className="detail-side"><section className="panel side-panel"><div className="side-section-title">Study status</div><StatusPill status={item.status}/><div className="key-value-list"><div><span>Received</span><strong>{formatTime(item.date)}</strong></div><div><span>Modality</span><strong>{item.modality}</strong></div><div><span>Processing time</span><strong>{item.processing != null ? `${item.processing} ms · fixture` : 'Not available'}</strong></div><div><span>Model version</span><strong>{item.model}</strong></div></div></section>
      <section className="panel side-panel"><div className="side-section-title">Experimental image-feature estimates</div><p className="experimental-description">Pixel-derived values are not validated clinical measurements and are not provided by this frontend.</p><button className="accordion-trigger" aria-expanded={experimentalOpen} onClick={()=>setExperimentalOpen(v=>!v)}>{experimentalOpen?'Hide field list':'View field list'}<Icon name="down" size={16}/></button>{experimentalOpen&&<div className="experimental-list">{['Cobb-like angle','T-score-like estimate','TBS proxy','Cortical thinning index','Marrow signal ratio','Disc degeneration grade','Fracture-risk estimate','Instability score'].map(v=><div key={v}><span>{v}</span><span className="not-provided">Not supplied</span></div>)}</div>}</section>
      <section className="panel side-panel review-panel"><div className="review-mark"><Icon name="shield" size={18}/></div><h3>Clinician review required</h3><p>This software prototype does not establish a diagnosis. Review the original study and use independent clinical judgement.</p><button className="button button-secondary button-full" onClick={()=>setNotice('Review-state updates are not persisted in this frontend-only version.')}>Mark reviewed <Icon name="check" size={15}/></button></section>
    </aside></div>
  </>;
}
function HistoryPage({ cases, onOpen }) {
  const [query, setQuery] = useState(''); const [selected, setSelected] = useState([]); const [sort, setSort] = useState('newest');
  const filtered = useMemo(()=>cases.filter(c=>`${c.id} ${c.patient} ${c.study} ${c.modality}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='newest'?new Date(b.date)-new Date(a.date):sort==='oldest'?new Date(a.date)-new Date(b.date):(b.risk??-1)-(a.risk??-1)),[cases,query,sort]);
  const selectedItems = selected.map(id=>cases.find(c=>c.id===id)).filter(Boolean);
  function toggle(id){setSelected(old=>old.includes(id)?old.filter(x=>x!==id):old.length<2?[...old,id]:[old[1],id]);}
  function exportJSON(){const blob=new Blob([JSON.stringify({disclaimer:'DEMO FIXTURE — illustrative records only',studies:filtered},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='karnix-demo-history.json';a.click();URL.revokeObjectURL(url);}
  return <><PageHeader eyebrow="LONGITUDINAL REVIEW" title="History & comparison" description="Browse prior fixture entries and compare two studies side by side." action={<><button className="button button-secondary" onClick={exportJSON}><Icon name="download" size={16}/> Export JSON</button><button className="button button-secondary" onClick={()=>window.print()}><Icon name="print" size={16}/> Print</button></>}/><div className="fixture-note"><span className="fixture-dot"/> All records below are synthetic demo fixtures, not a real patient history.</div><section className="panel trend-panel"><div className="panel-heading"><div><h2>Risk score over time</h2><p>Fixture values only · not for clinical interpretation</p></div><span className="unit-label">0–100</span></div><ResultsSparkline cases={filtered}/></section><section className="panel table-panel history-list"><div className="toolbar"><div className="search-field"><Icon name="search" size={17}/><input aria-label="Search history" placeholder="Search demo records" value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={sort} aria-label="Sort history" onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="risk">Risk score</option></select><span className="results-count">{filtered.length} records</span></div><StudyTable items={filtered} onOpen={onOpen} selectable checkedIds={selected} onCheck={toggle}/><div className="panel-footer"><span>Select up to two studies to compare</span><button className="text-button" onClick={()=>setSelected([])} disabled={!selected.length}>Clear selection</button></div></section>{selectedItems.length>0&&<section className="panel comparison-panel"><div className="panel-heading"><div><h2>Side-by-side comparison</h2><p>Selected demo studies</p></div><span className="count-badge">{selectedItems.length}/2</span></div>{selectedItems.length===1?<div className="compare-prompt">Select one more study from the table to compare.</div>:<div className="comparison-grid">{selectedItems.map(it=><div className="compare-card" key={it.id}><div className="compare-card-head"><span>{it.id}</span><StatusPill status={it.status}/></div><ImageFrame compact/><div className="key-value-list"><div><span>Modality</span><strong>{it.modality}</strong></div><div><span>Fixture classification</span><strong>{it.className}</strong></div><div><span>Fixture risk score</span><strong>{it.risk ?? 'Not available'}</strong></div><div><span>Date</span><strong>{formatDate(it.date)}</strong></div></div><button className="text-button" onClick={()=>onOpen(it)}>Open study <Icon name="arrow" size={14}/></button></div>)}</div>}</section>}</>;
}
function ModelCard() {
  return <><PageHeader eyebrow="MODEL TRANSPARENCY" title="Model card" description="Review the intended scope, current evidence and known limits of the screening engine."/><div className="fixture-note"><span className="fixture-dot"/> Research prototype — not a medical device. This front end is not connected to the engine binary.</div><section className="panel model-hero"><div className="model-symbol"><Icon name="scan" size={27}/></div><div className="model-hero-copy"><div className="eyebrow">KARNIX SPINE EDGE</div><h2>Spine imaging screening engine</h2><p>Screening-mode C++ engine described in the implementation plan. Exact runtime version and live performance are not available in this frontend-only package.</p><div className="tag-row"><span className="soft-tag">Local-first design</span><span className="soft-tag">Research prototype</span><span className="soft-tag tag-muted">Engine disconnected</span></div></div></section><div className="model-grid"><section className="panel model-section"><h2>Intended use</h2><p>Present engine-provided spine-screening outputs to a clinician for review, alongside the original image and explanatory context. It is not intended to make autonomous clinical decisions.</p><h3>Input scope in current plan</h3><ul className="simple-list"><li>Image screening through the C++ engine.</li><li>PPM and PGM handled natively by the engine; other inputs require the planned backend normalization.</li><li>DICOM is not supported by this frontend prototype.</li></ul></section><section className="panel model-section"><h2>Performance evidence</h2><div className="evidence-callout"><Icon name="file" size={19}/><div><strong>Baseline figures need source verification</strong><p>The provided plan contains conflicting knee-OA accuracy figures. Confirm the definitive numbers in the engine README and evaluation report before publishing them.</p></div></div><div className="evidence-row"><span>Calibration</span><strong>Not established here</strong></div><div className="evidence-row"><span>Clinical validation</span><strong>Not established here</strong></div><div className="evidence-row"><span>Runtime measurement</span><strong>Engine not connected</strong></div></section><section className="panel model-section"><h2>Known limitations</h2><ul className="simple-list"><li>Probabilities may be uncalibrated and should not be interpreted as clinical certainty.</li><li>Pixel-derived metrics are experimental estimates, not validated measurements.</li><li>Heatmaps are hidden unless a real engine response supplies them.</li><li>Output quality depends on input image type, quality, and the engine's supported screening task.</li></ul></section><section className="panel model-section"><h2>Safe presentation</h2><ul className="simple-list"><li>Keep the original image available for clinician review.</li><li>Clearly distinguish engine output from physician interpretation.</li><li>Do not generate new medical suggestions in the interface.</li><li>Verify findings using independent clinical judgement.</li></ul></section></div></>;
}

export default function App() {
  const [page, setPage] = useState('overview');
  const [cases, setCases] = useState(initialCases);
  const [activeCase, setActiveCase] = useState(initialCases[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  function openCase(item) { setActiveCase(item); setPage('result'); setMenuOpen(false); }
  function addDraft(item) { setCases(old=>[item,...old]); setActiveCase(item); }
  function go(next) { setPage(next); setMenuOpen(false); }
  useEffect(()=>{ document.title = `${page === 'result' ? activeCase.id : navItems.find(n=>n.id===page)?.label || 'Karnix'} — Karnix Spine Edge`; },[page,activeCase]);
  const nav = <nav aria-label="Main navigation" className="nav-list">{navItems.map(item=><button key={item.id} onClick={()=>go(item.id)} className={`nav-item ${page===item.id?'active':''}`} aria-current={page===item.id?'page':undefined}><Icon name={item.icon}/><span>{item.label}</span>{item.id==='worklist'&&<span className="nav-count">{cases.length}</span>}</button>)}</nav>;
  return <div className="app-shell"><aside className="sidebar"><BrandMark/><div className="workspace-label">DOCTOR WORKSTATION</div>{nav}<div className="sidebar-bottom"><div className="connection-card"><span className="connection-light"/><div><strong>Local prototype</strong><span>Engine disconnected</span></div><Icon name="chevron" size={14}/></div><div className="sidebar-footer"><div className="avatar-doctor">DR</div><div><strong>Clinician workspace</strong><span>Demo session · offline</span></div><button className="icon-button" title="Session info" onClick={()=>alert('Frontend-only demo. No authentication service is connected.')}><Icon name="down" size={15}/></button></div></div></aside>
    {menuOpen&&<div className="mobile-nav-overlay" onClick={()=>setMenuOpen(false)}><div className="mobile-nav-sheet" onClick={e=>e.stopPropagation()}><div className="mobile-brand"><BrandMark/><button className="icon-button" onClick={()=>setMenuOpen(false)} aria-label="Close menu"><Icon name="close"/></button></div>{nav}</div></div>}
    <div className="main-shell"><header className="topbar"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={()=>setMenuOpen(true)}><Icon name="menu" size={21}/></button><div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={13}/><strong>{page==='result'?'Study detail':navItems.find(n=>n.id===page)?.label||'Overview'}</strong></div><div className="topbar-right"><div className="offline-indicator"><span/>Offline mode</div><label className="global-search"><Icon name="search" size={16}/><input value={globalSearch} onChange={e=>{setGlobalSearch(e.target.value); if(e.target.value) setPage('worklist');}} placeholder="Search studies…" aria-label="Search studies globally"/><kbd>Ctrl K</kbd></label><button className="icon-button notification-button" aria-label="Prototype notices" onClick={()=>alert('No live engine or notification service is connected.')}><Icon name="bell" size={19}/><span className="notification-dot"/></button><div className="top-avatar" aria-label="Doctor demo profile">DR</div></div></header><Disclaimer/><main id="main-content" className="main-content" tabIndex="-1">
      {page==='overview'&&<Overview cases={cases} onGo={go} onOpen={openCase}/>}
      {page==='worklist'&&<Worklist cases={cases.filter(c=>`${c.id} ${c.patient} ${c.study} ${c.modality}`.toLowerCase().includes(globalSearch.toLowerCase()))} onOpen={openCase} onGo={go}/>}
      {page==='upload'&&<UploadPage onAdded={addDraft} onGo={go}/>}
      {page==='result'&&<ResultDetail item={activeCase} onBack={()=>go('worklist')} onGo={go}/>}
      {page==='history'&&<HistoryPage cases={cases} onOpen={openCase}/>}
      {page==='model'&&<ModelCard/>}
    </main><footer className="app-footer"><span>KARNIX SPINE EDGE <span className="footer-sep">/</span> DOCTOR WORKSTATION</span><span>Frontend prototype · No external service calls</span></footer></div></div>;
}
