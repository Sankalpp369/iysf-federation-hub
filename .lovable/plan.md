# CMS Phase 2 — remaining admin sections

Done already: staff account for sankalp.xo@gmail.com created with staff access; invite email sent (link opens /reset-password, then /login lands on /admin).

## Testing split
- I test (signed in as you via preview session after you set your password): every block type post, publish + /news check, scheduling a few minutes ahead, JPG/PNG/WebP/AVIF uploads, resize + 5 MB error, autosave/"Saved"/unsaved warning, logged-out blocking of /admin and previews, phone-size admin.
- You test: receiving the invite email and setting your password; real email notifications once a sender domain is connected.
- Bugs found get fixed and listed in the summary.

## Build order (same patterns as News: search/filter list, draft/publish editor, autosave, delete confirmation, mobile cards)
1. Events — title, slug, start/end, location, block-editor description, cover, registration link, status. Public /events (Upcoming / Past tabs) and detail page; added to sitemap. Existing hand-built event pages (e.g. World Championship 2026) stay as-is.
2. Results — competition, date, location, category/age group, results table (rank, athlete, country, score) with manual rows and spreadsheet paste; optional PDF/image score sheet. Public /results + detail page.
3. Officials — name, role, country, photo, bio, drag-to-reorder, visible toggle. Public /officials grouped by role.
4. Homepage — editable hero image + headline, button text/link, intro text, section visibility and order. Hero uses your uploaded championship artwork (no video).
5. Membership applications — existing form already saves; admin list with status (new/reviewed/approved/rejected), detail view, internal notes, search/filter, CSV export. Email notification to staff per submission (needs a connected sender domain to actually send).
6. Menu/footer show Events and Results only when published content exists.

## Rules
- All staff full access; admin routes staff-only; every write protected by database rules using the existing staff check.
- Images via the existing media library; score-sheet PDFs stored in the private media storage.

## Reminder
Delete sample content (3 sample posts) before launch.
