#!/usr/bin/env python3
"""
Generate a QR code for a given URL and overlay a circular-cropped headshot
in the center. Saves a PNG output.

Usage:
  python scripts/generate_qr_overlay.py \
    --url https://pinataro.com/QR-Contacts/Marco/Marco.html \
    --headshot public/QR-Contacts/Marco/Marco.jpg \
    --out public/QR-Contacts/Marco/Marco-QR.png \
    [--pct 40] [--border 3] [--box-size 10] [--border-mod 4]
"""

import argparse
from PIL import Image, ImageDraw
import qrcode


def make_qr(url: str, box_size: int = 10, border: int = 4) -> Image.Image:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H,
                        box_size=box_size, border=border)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.make_image(fill_color="black", back_color="white").convert("RGBA")


def overlay_circle_center(base_img: Image.Image, overlay_img: Image.Image,
                          pct: int = 40, border_px: int = 3) -> Image.Image:
    W, H = base_img.size
    dpx = int(W * (pct/100.0))
    overlay = overlay_img.copy().convert("RGBA").resize((dpx, dpx), Image.LANCZOS)
    # circular mask for the headshot
    mask = Image.new("L", (dpx, dpx), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, dpx, dpx), fill=255)
    # white circular border disc
    disc = Image.new("RGBA", (dpx + border_px*2, dpx + border_px*2), (255, 255, 255, 0))
    ImageDraw.Draw(disc).ellipse((0, 0, disc.width, disc.height), fill=(255, 255, 255, 255))
    disc.paste(overlay, (border_px, border_px), mask)
    pos = ((W - disc.width)//2, (H - disc.height)//2)
    out = base_img.copy()
    out.paste(disc, pos, disc)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--url', required=True)
    ap.add_argument('--headshot', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--pct', type=int, default=40, help='overlay diameter as % of QR width')
    ap.add_argument('--border', type=int, default=3, help='white border thickness around circle')
    ap.add_argument('--box-size', type=int, default=10, dest='box_size')
    ap.add_argument('--border-mod', type=int, default=4, dest='border_mod', help='QR quiet-zone modules')
    args = ap.parse_args()

    qr = make_qr(args.url, box_size=args.box_size, border=args.border_mod)
    head = Image.open(args.headshot).convert("RGBA")
    # center-crop to square
    s = min(head.width, head.height)
    left = (head.width - s)//2
    top = (head.height - s)//2
    head_sq = head.crop((left, top, left+s, top+s))

    out = overlay_circle_center(qr, head_sq, pct=args.pct, border_px=args.border)
    out.save(args.out)
    print(f"Wrote {args.out}")


if __name__ == '__main__':
    main()

