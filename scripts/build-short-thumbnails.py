#!/usr/bin/env python3

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "jeff-berlin-videos.json"
SOURCE_PATH = ROOT / "public" / "images" / "videos" / "source" / "dani-rabin-base.jpg"
OUTPUT_DIR = ROOT / "public" / "images" / "videos" / "shorts"
TITLE_FONT = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
BOTTOM_FONT = "/System/Library/Fonts/Avenir Next Condensed.ttc"


def run(command):
    subprocess.run(command, check=True)


def make_title_panel(title, destination):
    escaped_title = title.replace("\\", "\\\\")
    run(
        [
            "magick",
            "-background",
            "none",
            "-fill",
            "#ffd233",
            "-font",
            TITLE_FONT,
            "-gravity",
            "northwest",
            "-size",
            "570x255",
            "caption:" + escaped_title,
            str(destination),
        ]
    )


def make_bottom_panel(left_text, right_text, destination):
    run(
        [
            "magick",
            "-size",
            "860x84",
            "canvas:none",
            "-font",
            BOTTOM_FONT,
            "-pointsize",
            "50",
            "-fill",
            "white",
            "-gravity",
            "west",
            "-annotate",
            "+0+0",
            left_text,
            "-fill",
            "#ffd233",
            "-annotate",
            "+470+0",
            right_text,
            str(destination),
        ]
    )


def build_thumbnail(video_id, title):
    title_panel = OUTPUT_DIR / f"{video_id}-title.png"
    bottom_panel = OUTPUT_DIR / f"{video_id}-bottom.png"
    output_path = OUTPUT_DIR / f"{video_id}.jpg"

    make_title_panel(title, title_panel)
    make_bottom_panel("Driving Lessons |", "youtube short", bottom_panel)

    run(
        [
            "magick",
            str(SOURCE_PATH),
            "-fill",
            "black",
            "-draw",
            "rectangle 0,0 760,360",
            "-draw",
            "rectangle 0,560 1280,720",
            "(",
            str(title_panel),
            ")",
            "-geometry",
            "+128+92",
            "-composite",
            "(",
            str(bottom_panel),
            ")",
            "-geometry",
            "+132+598",
            "-composite",
            "-quality",
            "92",
            str(output_path),
        ]
    )

    title_panel.unlink(missing_ok=True)
    bottom_panel.unlink(missing_ok=True)

    return output_path


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    for video in data.get("videos", []):
      if video.get("mediaType") != "short":
          continue

      build_thumbnail(video["id"], video["title"])
      video["customThumbnailUrl"] = f"/images/videos/shorts/{video['id']}.jpg"
      video["thumbnailWidth"] = 1280
      video["thumbnailHeight"] = 720

    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
