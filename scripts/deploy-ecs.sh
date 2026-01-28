#!/usr/bin/env bash
set -euo pipefail

BRANCH="${BRANCH:-main}"
REPO_DIR="${REPO_DIR:-$HOME/astroplate}"
WEB_ROOT="${WEB_ROOT:-/var/www/lewins-insight}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

usage() {
  cat <<'EOF'
Deploy (build on ECS, publish to Nginx root) with an atomic symlink switch.

Usage:
  scripts/deploy-ecs.sh [--branch BRANCH] [--repo-dir DIR] [--web-root DIR] [--keep N]

Environment:
  BRANCH=main
  REPO_DIR=$HOME/astroplate
  WEB_ROOT=/var/www/lewins-insight
  KEEP_RELEASES=5
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch) BRANCH="${2:-}"; shift 2 ;;
    --repo-dir) REPO_DIR="${2:-}"; shift 2 ;;
    --web-root) WEB_ROOT="${2:-}"; shift 2 ;;
    --keep) KEEP_RELEASES="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1" >&2; exit 1; }; }
need_cmd git
need_cmd node
need_cmd yarn
need_cmd rsync

mkdir -p "$WEB_ROOT"
mkdir -p "$WEB_ROOT/releases"

LOCK_DIR="$WEB_ROOT/.deploy-lock"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Deploy already running (lock: $LOCK_DIR)" >&2
  exit 1
fi
trap 'rm -rf "$LOCK_DIR"' EXIT

cd "$REPO_DIR"

git fetch --prune
git checkout "$BRANCH" >/dev/null 2>&1 || git checkout -b "$BRANCH" "origin/$BRANCH"
git pull --ff-only origin "$BRANCH"

yarn install --frozen-lockfile
yarn build

ts="$(date -u +%Y%m%d%H%M%S)"
release_dir="$WEB_ROOT/releases/$ts"
mkdir -p "$release_dir"

rsync -az --delete dist/ "$release_dir/"

ln -sfn "$release_dir" "$WEB_ROOT/current"

if [[ "$KEEP_RELEASES" =~ ^[0-9]+$ ]] && [[ "$KEEP_RELEASES" -gt 0 ]]; then
  (cd "$WEB_ROOT/releases" && ls -1dt */ 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | xargs -r rm -rf)
fi

echo "Deployed: $release_dir -> $WEB_ROOT/current"
