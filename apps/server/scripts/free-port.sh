#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4000}"

declare -a pids=()

while IFS= read -r pid; do
  if [[ -n "$pid" ]]; then
    pids+=("$pid")
  fi
done < <(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)

if [[ ${#pids[@]} -eq 0 ]]; then
  ss_pid="$(ss -ltnp 2>/dev/null | awk -v needle=":${PORT} " '$0 ~ needle { if (match($0, /pid=([0-9]+)/, m)) { print m[1]; exit } }')"
  if [[ -n "$ss_pid" ]]; then
    pids+=("$ss_pid")
  fi
fi

if [[ ${#pids[@]} -eq 0 ]]; then
  echo "No process is listening on port ${PORT}."
  exit 0
fi

for pid in "${pids[@]}"; do
  cmd="$(ps -p "$pid" -o args= 2>/dev/null || true)"
  if kill "$pid"; then
    echo "Killed PID ${pid} on port ${PORT}${cmd:+ (${cmd})}."
  else
    echo "Failed to kill PID ${pid} on port ${PORT}." >&2
    exit 1
  fi
done

remaining="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "$remaining" ]]; then
  echo "Port ${PORT} is still in use by: ${remaining}" >&2
  exit 1
fi

echo "Port ${PORT} is now free."
