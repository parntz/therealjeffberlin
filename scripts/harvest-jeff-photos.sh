#!/bin/zsh
set -euo pipefail

ROOT_DIR="${1:-public/images/photos/harvest}"
TMP_DIR="${TMPDIR:-/tmp}/jeff-berlin-harvest"
DELETED_HASHES="$TMP_DIR/deleted-hashes.txt"
mkdir -p "$ROOT_DIR" "$TMP_DIR"

ARTICLE_URLS="$TMP_DIR/article-urls.txt"
IMAGE_URLS="$TMP_DIR/image-urls.txt"
VALID_IMAGE_URLS="$TMP_DIR/valid-image-urls.txt"

: > "$ARTICLE_URLS"
: > "$IMAGE_URLS"
: > "$VALID_IMAGE_URLS"
: > "$DELETED_HASHES"

node --input-type=module -e '
import fs from "node:fs";
const filepath = "data/deleted-photos.json";
if (!fs.existsSync(filepath)) process.exit(0);
const entries = JSON.parse(fs.readFileSync(filepath, "utf8"));
for (const entry of entries) {
  if (entry && typeof entry.sha256 === "string" && entry.sha256.length) {
    console.log(entry.sha256);
  }
}
' > "$DELETED_HASHES"

search_pages=(
  "https://bassmusicianmagazine.com/?s=Jeff+Berlin"
  "https://bassmusicianmagazine.com/page/2/?s=Jeff+Berlin"
  "https://bassmusicianmagazine.com/page/3/?s=Jeff+Berlin"
  "https://bassmusicianmagazine.com/page/4/?s=Jeff+Berlin"
  "https://www.notreble.com/?s=Jeff+Berlin"
  "https://www.notreble.com/page/2/?s=Jeff+Berlin"
  "https://www.notreble.com/page/3/?s=Jeff+Berlin"
  "https://www.notreble.com/page/4/?s=Jeff+Berlin"
  "https://www.notreble.com/page/5/?s=Jeff+Berlin"
  "https://www.notreble.com/page/6/?s=Jeff+Berlin"
  "https://www.notreble.com/page/7/?s=Jeff+Berlin"
  "https://www.notreble.com/page/8/?s=Jeff+Berlin"
  "https://www.notreble.com/page/9/?s=Jeff+Berlin"
  "https://www.notreble.com/page/10/?s=Jeff+Berlin"
  "https://musicplayers.com/?s=Jeff+Berlin"
  "https://musicplayers.com/page/2/?s=Jeff+Berlin"
  "https://musicplayers.com/page/3/?s=Jeff+Berlin"
)

direct_pages=(
  "https://www.jeffberlinofficial.com/about"
  "https://www.jeffberlinmusicgroup.com/aboutus"
  "https://www.jeffberlinmusicgroup.com/welcome-jeff-berlin"
  "https://www.cortguitars.com/artist/jeff-berlin/"
  "https://www.cortguitars.com/product/item.php?ca_id=103040&it_id=1617343994"
  "https://www.namm.org/library/oral-history/jeff-berlin"
  "https://www.guitarworld.com/features/jeff-berlin-look-at-jaco-pastorius-clearly-a-genius-but-misunderstood"
  "https://www.guitarworld.com/features/jeff-berlin-names-his-5-favorite-bass-albums"
  "https://dmme.net/interviews/berlin"
)

for page in "${search_pages[@]}"; do
  curl -L "$page" |
    rg -o 'https://[^"<> ]+' -N |
    rg -i 'jeff|berlin|brand-x|bruford|holdsworth|jaco|cort' |
    rg -v 'feed/rss|/page/[0-9]+/\?s=|/search/|facebook|twitter|instagram|youtube|pinterest|linkedin|author|tag/' >> "$ARTICLE_URLS" || true
done

printf '%s\n' "${direct_pages[@]}" >> "$ARTICLE_URLS"

sort -u "$ARTICLE_URLS" -o "$ARTICLE_URLS"

for page in $(cat "$ARTICLE_URLS"); do
  curl -L "$page" |
    rg -o 'https://[^"'\'' )>]+\.(jpg|jpeg|png|webp)(\?[^"'\'' )>]*)?' -i -N >> "$IMAGE_URLS" || true
done

sort -u "$IMAGE_URLS" |
  rg -v 'favicon|logo|avatar|gravatar|sprite|icon-|apple-touch|mstile|googleads|doubleclick|ytimg|wpstats|pixel|badge|emoji|branding|featureindex|header-logo|favicons|ad-|\bsvg\b|twitter\.png|facebook\.png|instagram\.png' |
  rg -i 'jeff|berlin|jaco|jack-bruce|rithimic|cort|holdsworth|bruford|namm|futurecdn|wixstatic|squarespace-cdn|i0\.wp\.com|musicplayers\.com/wp-content|cortguitars\.com/wp-content|namm\.org/sites/default/files/styles|dmme\.net' \
  > "$VALID_IMAGE_URLS"

count=1
while IFS= read -r image_url; do
  ext="${image_url%%\?*}"
  ext="${ext##*.}"
  ext="${ext:l}"
  if [[ "$ext" != "jpg" && "$ext" != "jpeg" && "$ext" != "png" && "$ext" != "webp" ]]; then
    ext="jpg"
  fi
  outfile=$(printf "%s/harvest-%03d.%s" "$ROOT_DIR" "$count" "$ext")
  curl -L "$image_url" -o "$outfile" || true
  if [[ -s "$outfile" ]]; then
    filehash=$(shasum -a 256 "$outfile" | awk "{print \$1}")
    if rg -qx "$filehash" "$DELETED_HASHES"; then
      rm -f "$outfile"
    fi
  fi
  count=$((count + 1))
done < "$VALID_IMAGE_URLS"

find "$ROOT_DIR" -type f | sort
