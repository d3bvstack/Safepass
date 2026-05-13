#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHARED_DIR="$ROOT_DIR/shared_extension"
BROWSER_SPECIFIC_DIR="$ROOT_DIR/browser_specific"
BUILD_DIR="$ROOT_DIR/build"

usage() {
  cat <<'EOF'
Usage: scripts/sync-extensions.sh [--check]

Sync mode (default):
  Copies shared files into build/chrome_extension and build/firefox_extension and overlays
  browser-exclusive files from browser_specific/.

Check mode:
  Verifies that generated build folders match what sync mode would produce.
  Exits non-zero if drift is detected.
EOF
}

ensure_structure() {
  local required=(
    "$SHARED_DIR"
    "$BROWSER_SPECIFIC_DIR/chrome"
    "$BROWSER_SPECIFIC_DIR/firefox"
  )
  local path
  for path in "${required[@]}"; do
    if [[ ! -d "$path" ]]; then
      echo "Missing required directory: $path" >&2
      exit 1
    fi
  done
}

copy_file() {
  local src="$1"
  local dst="$2"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
}

sync_browser() {
  local browser="$1"
  local out_dir="$2"
  local target="$out_dir/${browser}_extension"
  local specific="$BROWSER_SPECIFIC_DIR/$browser"

  rm -rf "$target"
  mkdir -p "$target"
  cp -R "$SHARED_DIR/." "$target/"

  # Browser-specific overlays
  copy_file "$specific/manifest.json" "$target/manifest.json"
  copy_file "$specific/components/footer-buttons.js" "$target/components/footer-buttons.js"
}

build_all() {
  local out_dir="$1"
  local browser
  for browser in "chrome" "firefox"; do
    sync_browser "$browser" "$out_dir"
  done
}

check_browser_file() {
  local expected="$1"
  local actual="$2"
  if [[ ! -f "$actual" ]]; then
    echo "Missing file: $actual" >&2
    return 1
  fi

  if ! cmp -s "$expected" "$actual"; then
    echo "Drift detected: $actual" >&2
    return 1
  fi

  return 0
}

check_browser() {
  local browser="$1"
  local expected_root="$2"
  local actual_root="$3"
  local expected="$expected_root/${browser}_extension"
  local actual="$actual_root/${browser}_extension"
  local ok=0

  if [[ ! -d "$actual" ]]; then
    echo "Missing build folder: $actual" >&2
    return 1
  fi

  if ! diff -qr "$expected" "$actual" >/dev/null; then
    echo "Drift detected in: $actual" >&2
    ok=1
  fi

  return "$ok"
}

main() {
  ensure_structure

  local mode="sync"
  if [[ $# -gt 1 ]]; then
    usage
    exit 1
  fi

  if [[ $# -eq 1 ]]; then
    case "$1" in
      --check)
        mode="check"
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        usage
        exit 1
        ;;
    esac
  fi

  local browsers=("chrome" "firefox")

  if [[ "$mode" == "sync" ]]; then
    build_all "$BUILD_DIR"
    echo "Sync complete: build/chrome_extension and build/firefox_extension are up to date."
    exit 0
  fi

  local temp_build
  temp_build="$(mktemp -d)"
  trap 'rm -rf "${temp_build:-}"' EXIT
  build_all "$temp_build"

  local failed=0
  local browser
  for browser in "${browsers[@]}"; do
    if ! check_browser "$browser" "$temp_build" "$BUILD_DIR"; then
      failed=1
    fi
  done

  if [[ "$failed" -ne 0 ]]; then
    echo "Check failed: build outputs have drift. Run scripts/sync-extensions.sh." >&2
    exit 1
  fi

  echo "Check passed: build outputs match shared + browser-specific sources."
}

main "$@"
