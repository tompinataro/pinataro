Project Notes — QR Contacts & Email

- Public pages should never embed full email HTML. Use public contact pages only.
- Paste-ready email templates live outside `public/` (in `emails/`) and are copied per-contact with correct absolute links.
- Each contact page should include a centered "Download QR Code" button linking to `/dl/<contact>/<slug>-QR.png` so users can re-download.
- The download route `/dl/*` is served by Express to force an attachment in production; `public/qr-download.js` adapts links for Live Server.
- Absolute domain for production is `https://pinataro.com`.
- Future: SQLite store (see `config.py` and `scripts/sync_qr_to_folders.py`) drives slugs and QR generation; target URL pattern: `https://pinataro.com/{slug}/{slug}-Card.html`.

