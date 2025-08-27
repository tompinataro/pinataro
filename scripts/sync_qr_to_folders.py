import os, sqlite3, sys
from pathlib import Path
from PIL import Image, ImageDraw
import qrcode

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from config import DB_PATH

ROOT = Path(__file__).resolve().parents[1]
CONTACTS_DIR = ROOT / "public" / "QR Contacts"

def connect():
    return sqlite3.connect(DB_PATH)

def make_qr(url, box_size=10, border=4):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=box_size, border=border)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.make_image(fill_color="black", back_color="white").convert("RGBA")

def overlay_circle_center(base_img, overlay_img, pct=40, border_px=3):
    W, H = base_img.size
    dpx = int(W * (pct/100))
    overlay = overlay_img.copy().convert("RGBA").resize((dpx, dpx), Image.LANCZOS)
    mask = Image.new("L", (dpx, dpx), 0)
    ImageDraw.Draw(mask).ellipse((0,0,dpx,dpx), fill=255)
    disc = Image.new("RGBA", (dpx+border_px*2, dpx+border_px*2), (255,255,255,0))
    ImageDraw.Draw(disc).ellipse((0,0,disc.width,disc.height), fill=(255,255,255,255))
    disc.paste(overlay, (border_px,border_px), mask)
    pos = ((W-disc.width)//2, (H-disc.height)//2)
    out = base_img.copy()
    out.paste(disc, pos, disc)
    return out

def main():
    conn = connect()
    cur = conn.cursor()
    rows = cur.execute("SELECT id, slug FROM contacts ORDER BY slug").fetchall()
    for cid, slug in rows:
        folder = CONTACTS_DIR / slug
        if not folder.exists():
            print(f"Skip (no folder): {folder}")
            continue
        target_url = f"https://pinataro.com/{slug}/{slug}-Card.html"
        qr = make_qr(target_url)

        headshot_path = folder / f"{slug}.png"
        if headshot_path.exists():
            head = Image.open(headshot_path).convert("RGBA")
            s = min(head.width, head.height)
            left = (head.width - s)//2
            top = (head.height - s)//2
            head_square = head.crop((left, top, left+s, top+s))
            qr = overlay_circle_center(qr, head_square, pct=40, border_px=3)

        out_path = folder / f"{slug}-QR.png"
        qr.save(out_path)
        print(f"Wrote {out_path}")

    conn.close()
    print("QR sync complete.")

if __name__ == "__main__":
    main()
