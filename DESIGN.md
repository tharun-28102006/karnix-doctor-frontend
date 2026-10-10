# Karnix Spine Edge — Doctor Workstation Design System

This document is the single source of truth for the frontend-only prototype.

## Intent
A calm, compact clinical workstation for doctors to review studies and engine-provided results. Do not use generic “AI dashboard” decoration. Prioritize original study access, provenance, clear states and honest limitations.

## Current prototype mode
- Persistent banner: “Research prototype — not a medical device or diagnosis.”
- Visible “DEMO FIXTURE MODE” badge.
- All preloaded cases and generated example outputs are explicitly synthetic.
- Uploaded images are previewed in the browser only. No engine/backend connection is present.
- Never fabricate a heatmap. Only show a heatmap when a real backend response supplies one.

## Tokens
- Deep blue: `#17365F`; secondary deep blue: `#214B7E`.
- Link/active blue: `#347DC0`; light-blue surface: `#EAF3FC`.
- One positive accent: `#168767`; positive surface: `#E8F7F0`.
- Background: `#F5F7FA`; card: `#FFFFFF`; border: `#E2E8EF`.
- Primary text: `#17263B`; secondary text: `#708095`.
- Warning: `#A96811` on `#FFF4DF`; error: `#B34A51` on `#FFF0F0`.

## Typography
Use a locally available system UI stack. Do not fetch fonts from a CDN. Use tabular numerals where appropriate. Page titles 25–27 px, panel headings 13–14 px, body 11–14 px, captions 9–11 px. Maintain clear heading structure and readable line-height.

## Spacing and shape
4 px base scale; common gaps 8, 12, 14, 18, 24, 32 px. Cards use 11–14 px radius with thin borders and very subtle shadows. Inputs/buttons use 8–9 px radius. Avoid large gradients, glow effects, emoji, and decorative motion.

## Layout
Desktop: 246 px sidebar, slim top bar, max content width 1600 px. Tablet compresses the sidebar and grids. At <=700 px use a temporary mobile navigation sheet and a single-column content layout. Support 390, 768 and 1440 px widths.

## Components
- Persistent research disclaimer and visible demo-mode state.
- Status labels are textual and colored; color is never the only signal.
- Risk labels apply to fixture scores only, with explicit demo context.
- Experimental fields live in a collapsed section and say “Not supplied” until sourced from the engine.
- No heatmap toggle that fakes an overlay.
- File import rejects DICOM with a clear unsupported message. Browser extension checks are for UX only; the future backend must verify file bytes and enforce limits.
- All controls have labels, keyboard focus styling and useful accessible names.
- Honor `prefers-reduced-motion`.

## Icons and assets
Icons use inline SVG definitions bundled with the app. The spine image is a local synthetic illustration and is explicitly labeled not to be a medical scan. No external assets or runtime network calls are used.
