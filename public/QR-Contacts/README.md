# Folders → DB-lite
We keep per-contact folders (for static hosting), and add a small SQLite database as an index and configuration layer.

## Why
Static hosting remains simple and fast.
The database becomes the single source of truth for names, slugs, and asset paths.
Scripts automate repetitive work (e.g., regenerating QR codes).

## Layout
public/QR Contacts/<slug>/
  <slug>.png
  <slug>-QR.png
  <slug>.html
  <slug>-Card.html
  <slug>.vcf

## Database (DB-lite)
contacts(slug, display_name, ...) holds who the person is.
assets(contact_id, asset_type, file_path) holds where each file lives in the repo.

## Scripts
scripts/ingest_from_folders.py scans public/QR Contacts/* and upserts rows into the database (contacts + file paths).
scripts/sync_qr_to_folders.py regenerates QR PNGs back into each contact’s folder, optionally overlaying the headshot.

## Workflow
1. Add or edit a contact folder under public/QR Contacts/.
2. Run: python3 scripts/ingest_from_folders.py
3. Run: python3 scripts/sync_qr_to_folders.py
