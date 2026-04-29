#!/usr/bin/env python3
"""
Fine Line Studio -- HEIC to JPG Converter
Converts HEIC photos to JPG and organizes them into the CA photo folder structure.

Usage:
  python heic_convert.py --input <folder> --client <slug> --date <YYYY-MM-DD> [--type visit|client] [--quality 88]

Examples:
  python heic_convert.py --input "C:/Users/User/Desktop/site_photos" --client cacopardo --date 2026-04-09 --type client
  python heic_convert.py --input "C:/Users/User/Desktop/site_photos" --client cacopardo --date 2026-04-15 --type visit

Output goes to:
  C:/Users/User/OneDrive/Office/Marketing/CLAUDE/PHASE IV/CLIENTS/<Client>/CA/Photos/<date>/

Requires:
  pip install pillow-heif pillow
"""

import argparse
import os
import sys
from pathlib import Path
from datetime import datetime

OUTPUT_BASE = Path(r"C:/Users/User/OneDrive/Office/Marketing/CLAUDE/PHASE IV/CLIENTS")

CLIENT_MAP = {
    "cacopardo": "Cacopardo",
    "dayspring": "Dayspring",
    "dayspring-church": "Dayspring",
}

HEIC_EXTS = {".heic", ".heif", ".HEIC", ".HEIF"}
IMAGE_EXTS = {".jpg", ".jpeg", ".JPG", ".JPEG", ".png", ".PNG"}


def setup_pillow_heif():
    try:
        from pillow_heif import register_heif_opener
        register_heif_opener()
        return True
    except ImportError:
        print("ERROR: pillow-heif is not installed.")
        print("Run: pip install pillow-heif pillow")
        sys.exit(1)


def get_client_folder(slug):
    slug_lower = slug.lower()
    if slug_lower in CLIENT_MAP:
        return CLIENT_MAP[slug_lower]
    # Capitalize first letter as fallback
    return slug.capitalize()


def build_output_path(client_slug, date_str, visit_type):
    client_folder = get_client_folder(client_slug)
    base = OUTPUT_BASE / client_folder / "CA" / "Photos"
    if visit_type == "client":
        out = base / "Client-Submitted" / date_str
    else:
        out = base / f"{date_str}_SiteVisit"
    out.mkdir(parents=True, exist_ok=True)
    return out


def build_server_url(client_slug, date_str, filename):
    return f"https://fine-linestudio.com/client/{client_slug}/photos/{date_str}/{filename}"


def convert_file(src_path, out_dir, rename_prefix, idx, quality, dry_run):
    from PIL import Image

    ext = src_path.suffix.lower()
    is_heic = ext in {s.lower() for s in HEIC_EXTS}
    is_image = ext in {s.lower() for s in IMAGE_EXTS}

    if not (is_heic or is_image):
        return None

    if rename_prefix:
        out_name = f"{rename_prefix}-{str(idx).zfill(2)}.jpg"
    else:
        # Keep original name, just change extension
        out_name = src_path.stem + ".jpg"

    out_path = out_dir / out_name

    if dry_run:
        print(f"  [DRY RUN] {src_path.name} -> {out_name}")
        return out_name

    try:
        with Image.open(src_path) as img:
            # Convert to RGB (strips alpha, handles CMYK, etc.)
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            img.save(out_path, "JPEG", quality=quality, optimize=True)
        print(f"  OK  {src_path.name} -> {out_name}")
        return out_name
    except Exception as e:
        print(f"  ERR {src_path.name}: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description="HEIC to JPG converter for Fine Line Studio CA photos")
    parser.add_argument("--input", required=True, help="Folder containing HEIC/image files")
    parser.add_argument("--client", required=True, help="Client slug (e.g. cacopardo)")
    parser.add_argument("--date", required=True, help="Visit date in YYYY-MM-DD format")
    parser.add_argument("--type", choices=["visit", "client"], default="client",
                        help="visit = architect site visit, client = client/GC submitted (default: client)")
    parser.add_argument("--rename", default="",
                        help="Optional rename prefix. If set, files become PREFIX-01.jpg, PREFIX-02.jpg ...\n"
                             "Example: --rename Cacopardo-CA-20260415")
    parser.add_argument("--quality", type=int, default=88, help="JPEG quality 1-95 (default: 88)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    args = parser.parse_args()

    # Validate date
    try:
        datetime.strptime(args.date, "%Y-%m-%d")
    except ValueError:
        print("ERROR: --date must be YYYY-MM-DD format")
        sys.exit(1)

    setup_pillow_heif()

    input_dir = Path(args.input)
    if not input_dir.is_dir():
        print(f"ERROR: Input folder not found: {input_dir}")
        sys.exit(1)

    out_dir = build_output_path(args.client, args.date, args.type)
    print(f"\nInput:  {input_dir}")
    print(f"Output: {out_dir}")
    print(f"Client: {args.client}  |  Date: {args.date}  |  Type: {args.type}")
    if args.dry_run:
        print("(DRY RUN -- no files will be written)")
    print()

    # Collect eligible files, sorted by name
    all_exts = {s.lower() for s in HEIC_EXTS} | {s.lower() for s in IMAGE_EXTS}
    files = sorted([f for f in input_dir.iterdir()
                    if f.is_file() and f.suffix.lower() in all_exts])

    if not files:
        print("No HEIC or image files found in input folder.")
        sys.exit(0)

    print(f"Found {len(files)} file(s) to convert:\n")

    converted = []
    for idx, f in enumerate(files, start=1):
        name = convert_file(f, out_dir, args.rename, idx, args.quality, args.dry_run)
        if name:
            converted.append(name)

    print(f"\n{len(converted)} file(s) converted.")

    if converted and not args.dry_run:
        print("\n--- Server URLs (paste into CA_PHOTOS Sheet) ---")
        for name in converted:
            print(build_server_url(args.client, args.date, name))

    print(f"\nOutput folder: {out_dir}")
    print("Next step: WinSCP upload to /mainwebsite_html/client/{}/photos/{}/".format(
        args.client, args.date))


if __name__ == "__main__":
    main()
