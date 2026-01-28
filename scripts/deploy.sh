#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8080}"
HOST="${HOST:-0.0.0.0}"

usage() {
  cat <<'EOF'
Usage:
  scripts/deploy.sh [--pull] [--install] [--build] [--restart SERVICE] [--preview]

Environment:
  PORT=8080   Preview port (default: 8080)
  HOST=0.0.0.0 Preview host (default: 0.0.0.0)

Examples:
  scripts/deploy.sh --install --build
  scripts/deploy.sh --pull --install --build --restart lewins-insight --preview
EOF
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

do_pull=false
do_install=false
do_build=false
do_preview=false
restart_service=""

if [[ $# -eq 0 ]]; then
  do_install=true
  do_build=true
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pull) do_pull=true; shift ;;
    --install) do_install=true; shift ;;
    --build) do_build=true; shift ;;
    --preview) do_preview=true; shift ;;
    --restart)
      restart_service="${2:-}"
      if [[ -z "$restart_service" ]]; then
        echo "--restart requires a SERVICE name" >&2
        exit 1
      fi
      shift 2
      ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

need_cmd git
need_cmd node
need_cmd yarn

if $do_pull; then
  git pull --ff-only
fi

if $do_install; then
  yarn --version >/dev/null
  yarn install --frozen-lockfile
fi

if $do_build; then
  yarn build
fi

if [[ -n "$restart_service" ]]; then
  if command -v systemctl >/dev/null 2>&1; then
    if systemctl --user status "$restart_service" >/dev/null 2>&1; then
      systemctl --user restart "$restart_service"
    else
      echo "systemd user service not found: $restart_service" >&2
      echo "Tip: place a unit in ~/.config/systemd/user/ and run: systemctl --user daemon-reload && systemctl --user enable --now $restart_service" >&2
      exit 1
    fi
  else
    echo "systemctl not found; cannot restart service automatically." >&2
    exit 1
  fi
fi

if $do_preview; then
  yarn preview -- --host "$HOST" --port "$PORT"
fi

