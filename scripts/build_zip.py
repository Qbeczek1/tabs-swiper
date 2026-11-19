"""Buduje paczke do Chrome Web Store: tabs-swiper-<wersja>.zip w roocie repo.

Uzycie (z roota repo):  python scripts/build_zip.py
Wersje bierze z manifest.json. Sciezki w ZIP zawsze z "/" (tar z Git Basha
robi zwykly tar, a Compress-Archive w PS 5.1 potrafi zapisac backslashe).
"""
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INCLUDE = ["manifest.json", "background.js", "swiper", "icons", "_locales"]


def main():
    version = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))["version"]
    out = ROOT / f"tabs-swiper-{version}.zip"

    files = []
    for item in INCLUDE:
        path = ROOT / item
        files += sorted(p for p in path.rglob("*") if p.is_file()) if path.is_dir() else [path]

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for i, f in enumerate(files, 1):
            arcname = f.relative_to(ROOT).as_posix()
            z.write(f, arcname)
            print(f"[{i}/{len(files)}] {arcname}", flush=True)

    print(f"OK: {out.name} ({out.stat().st_size // 1024} KB), wersja {version}", flush=True)


if __name__ == "__main__":
    main()
