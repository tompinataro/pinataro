#!/usr/bin/env bash
set -euo pipefail

# Regenerate Kevin's QR with a cache-busting query param so clients bypass stale caches.
# Usage: ./scripts/cache_bust_kevin_qr.sh

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KEVIN_DIR="$ROOT/public/QR-Contacts/Kevin"

BUST="$(date +%s)"
TARGET_URL="https://pinataro.com/QR-Contacts/Kevin/Kevin.html?bust=${BUST}"

python3 - <<'PY'
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance
import qrcode

root = Path(os.environ["KEVIN_DIR"])
url = os.environ["TARGET_URL"]
photo_path = root / "Kevin.jpg"
out_path = root / "Kevin-QR.png"

def center_crop_square(img):
    s = min(img.width, img.height)
    left = (img.width - s) // 2
    top = (img.height - s) // 2
    return img.crop((left, top, left + s, top + s))

def make_qr(url, box_size=10, border=4):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=box_size, border=border)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.make_image(fill_color="black", back_color="white").convert("RGBA")

def overlay_circle(base_img, overlay_img, pct=30, border_px=10):
    W, H = base_img.size
    dpx = int(W * (pct / 100))
    overlay = overlay_img.copy().convert("RGBA").resize((dpx, dpx), Image.LANCZOS)

    circle_d = dpx + border_px * 2
    disc = Image.new("RGBA", (circle_d, circle_d), (255, 255, 255, 0))
    ImageDraw.Draw(disc).ellipse((0, 0, circle_d, circle_d), fill=(255, 255, 255, 255))

    mask = Image.new("L", (dpx, dpx), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, dpx, dpx), fill=255)
    disc.paste(overlay, (border_px, border_px), mask)

    pos = ((W - disc.width) // 2, (H - disc.height) // 2)
    out = base_img.copy()
    out.paste(disc, pos, disc)
    return out

qr = make_qr(url)

head = Image.open(photo_path).convert("RGBA")
head = center_crop_square(head)
head = ImageEnhance.Color(head).enhance(1.2)
head = ImageEnhance.Brightness(head).enhance(1.15)
head = ImageEnhance.Contrast(head).enhance(1.1)

qr = overlay_circle(qr, head, pct=30, border_px=12)
qr.save(out_path)
print(f"Wrote {out_path} pointing to {url}")
PY

echo "Done. New QR points to: ${TARGET_URL}"
