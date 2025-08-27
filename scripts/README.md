# Python Utilities (scripts/)
These are back-office tools you run manually. Your public site is served by Node/Express (server.js on Heroku). Python here is only for maintenance tasks: ingest folders into the DB, regenerate QR codes, etc.

## Setup
Python 3.10+
Install once: python3 -m pip install --upgrade pillow qrcode[pil]

## Env / Config
config.py defines DB_PATH. Override with:
CONTACT_CARDS_DB=/absolute/path/to/contacts_cards.db

## Commands
Ingest existing folders into the DB:
python3 scripts/ingest_from_folders.py

Sync (rebuild) all QR images from DB/folders:
python3 scripts/sync_qr_to_folders.py
