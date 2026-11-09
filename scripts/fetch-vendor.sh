#!/usr/bin/env sh
# Optional: download a local copy of three.js r128 into vendor/ so the 3D globe
# still works if the public CDN is ever unreachable. Run from the project root:
#   sh scripts/fetch-vendor.sh
set -e
cd "$(dirname "$0")/.."
curl -fsSL -o vendor/three.min.js https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
echo "Saved vendor/three.min.js ($(wc -c < vendor/three.min.js) bytes)"
