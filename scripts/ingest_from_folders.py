import os, sqlite3, sys
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from config import DB_PATH

ROOT = Path(__file__).resolve().parents[1]
CONTACTS_DIR = ROOT / "public" / "QR Contacts"

def connect():
    return sqlite3.connect(DB_PATH)

def ensure_schema(conn):
    cur = conn.cursor()
    cur.executescript("""
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      display_name TEXT,
      title TEXT, org TEXT, email TEXT, phone TEXT
    );
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      asset_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      UNIQUE(contact_id, asset_type)
    );
    """)
    conn.commit()

def guess_display_name(slug: str) -> str:
    parts = slug.replace("_","-").split("-")
    return " ".join(p.capitalize() for p in parts if p)

def upsert_contact(conn, slug, display_name):
    cur = conn.cursor()
    cur.execute(
      "INSERT INTO contacts(slug, display_name) VALUES(?, ?) "
      "ON CONFLICT(slug) DO UPDATE SET display_name=excluded.display_name",
      (slug, display_name)
    )
    conn.commit()
    cur.execute("SELECT id FROM contacts WHERE slug=?", (slug,))
    return cur.fetchone()[0]

def upsert_asset(conn, contact_id, asset_type, rel_path):
    cur = conn.cursor()
    cur.execute(
      "INSERT INTO assets(contact_id, asset_type, file_path) VALUES(?,?,?) "
      "ON CONFLICT(contact_id, asset_type) DO UPDATE SET file_path=excluded.file_path",
      (contact_id, asset_type, rel_path)
    )
    conn.commit()

def main():
    if not CONTACTS_DIR.exists():
        print(f"Not found: {CONTACTS_DIR}")
        return
    conn = connect()
    ensure_schema(conn)

    for folder in sorted(CONTACTS_DIR.iterdir()):
        if not folder.is_dir():
            continue
        slug = folder.name
        display_name = guess_display_name(slug)
        cid = upsert_contact(conn, slug, display_name)

        files = {p.name: p for p in folder.iterdir() if p.is_file()}
        candidates = {
            "headshot": [f"{slug}.png", f"{slug}.jpg", f"{slug}.jpeg"],
            "qr": [f"{slug}-QR.png"],
            "landing_html": [f"{slug}.html"],
            "card_html": [f"{slug}-Card.html"],
            "vcf": [f"{slug}.vcf"],
        }
        for atype, names in candidates.items():
            for name in names:
                if name in files:
                    rel_path = str(files[name].relative_to(ROOT))
                    upsert_asset(conn, cid, atype, rel_path)
                    break

    conn.close()
    print("Ingest complete.")

if __name__ == "__main__":
    main()
