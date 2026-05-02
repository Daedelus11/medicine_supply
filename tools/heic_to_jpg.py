#!/usr/bin/env python3
"""
Fine Line Studio - HEIC to JPG Converter
Converts HEIC/HEIF images to JPG and outputs server-ready URLs
for the Cacopardo CA_PHOTOS Google Sheet.

Usage:
    python heic_to_jpg.py
    -- Drag HEIC files into the INPUT folder, then run.
    -- Converted JPGs appear in OUTPUT folder.
    -- Ready-to-paste URLs are printed to console.

Setup (one time):
    pip install pillow pillow-heif
"""

import os
import sys
from pathlib import Path
from datetime import datetime

try:
    from PIL import Image
    from pillow_heif import register_heif_opener
except ImportError:
    print("ERROR: Missing dependencies.")
    print("Run: pip install pillow pillow-heif")
    sys.exit(1)

register_heif_opener()

# ---------------------------------------------------------------
# CONFIGURATION - edit these paths for your machine
# ---------------------------------------------------------------

# Folder where you drop HEIC files before running
INPUT_FOLDER = Path(r"C:\Users\User\OneDrive\Office\CLIENTS\Cacopardo\CA\Photos\HEIC_Inbox")

# Folder where converted JPGs will be saved (organize by date)
# Script will auto-create a YYYY-MM-DD subfolder inside this
OUTPUT_BASE = Path(r"C:\Users\User\OneDrive\Office\CLIENTS\Cacopardo\CA\Photos\Converted")

# Base server URL (photos uploaded to Hostineer via WinSCP)
SERVER_BASE = "https://fine-linestudio.com/client/cacopardo/photos"

# JPG quality (85-95 is ideal for site photos)
JPG_QUALITY = 90

# ---------------------------------------------------------------

def convert_heic_to_jpg(input_folder: Path, output_folder: Path):
    """Convert all HEIC/HEIF files in input_folder to JPG in output_folder."""

    heic_files = [
        f for f in input_folder.iterdir()
        if f.suffix.lower() in ('.heic', '.heif') and f.is_file()
    ]

    if not heic_files:
        print(f"No HEIC files found in: {input_folder}")
        print("Drop HEIC files into that folder and re-run.")
        return

    output_folder.mkdir(parents=True, exist_ok=True)
    today = datetime.today().strftime('%Y-%m-%d')
    server_date_path = today  # used in URL construction

    print(f"\nFine Line Studio - HEIC Converter")
    print(f"Input:  {input_folder}")
    print(f"Output: {output_folder}")
    print(f"Found {len(heic_files)} file(s) to convert.\n")
    print("-" * 60)

    converted = []
    errors = []

    for heic_path in sorted(heic_files):
        # Build output filename: swap extension
        jpg_name = heic_path.stem + ".jpg"
        jpg_path = output_folder / jpg_name

        try:
            img = Image.open(heic_path)
            # Convert to RGB (removes alpha channel if present)
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            img.save(jpg_path, 'JPEG', quality=JPG_QUALITY, optimize=True)

            size_kb = jpg_path.stat().st_size // 1024
            server_url = f"{SERVER_BASE}/{server_date_path}/{jpg_name}"
            converted.append((jpg_name, server_url, size_kb))
            print(f"  OK   {heic_path.name} -> {jpg_name} ({size_kb} KB)")

        except Exception as e:
            errors.append((heic_path.name, str(e)))
            print(f"  FAIL {heic_path.name}: {e}")

    print("-" * 60)
    print(f"\nConverted: {len(converted)}  |  Errors: {len(errors)}")

    if converted:
        print("\n--- SERVER URLs (paste into CA_PHOTOS Sheet) ---\n")
        for name, url, size in converted:
            print(f"  {url}")

        print("\n--- WinSCP UPLOAD PATH ---")
        print(f"  Upload JPGs to: /mainwebsite_html/client/cacopardo/photos/{server_date_path}/")
        print(f"  Remote URL base: {SERVER_BASE}/{server_date_path}/")

        print("\n--- GOOGLE SHEET ENTRY ---")
        print(f"  visit_date:  {today}")
        print(f"  phase:       [enter phase - e.g. Site Preparation]")
        print(f"  visit_note:  [enter summary of site conditions]")
        for i, (name, url, _) in enumerate(converted, 1):
            print(f"  photo_{i}_url:     {url}")
            print(f"  photo_{i}_caption: [enter caption for {name}]")

    if errors:
        print("\n--- ERRORS ---")
        for name, err in errors:
            print(f"  {name}: {err}")


if __name__ == '__main__':
    # Auto-create date subfolder inside OUTPUT_BASE
    today_str = datetime.today().strftime('%Y-%m-%d')
    output_folder = OUTPUT_BASE / today_str

    # Verify input folder exists
    if not INPUT_FOLDER.exists():
        print(f"Creating input folder: {INPUT_FOLDER}")
        INPUT_FOLDER.mkdir(parents=True, exist_ok=True)
        print("Drop HEIC files into that folder and re-run.")
        sys.exit(0)

    convert_heic_to_jpg(INPUT_FOLDER, output_folder)
    print("\nDone. Press Enter to close.")
    input()
