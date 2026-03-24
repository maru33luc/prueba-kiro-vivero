#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRET_FILE="$SCRIPT_DIR/../.secrets/dev-runtime.secure.txt"
DETACHED=0
PROMPT=0

ps_quote() {
  printf "%s" "$1" | sed "s/'/''/g"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --secret-file)
      SECRET_FILE="$2"
      shift 2
      ;;
    --prompt)
      PROMPT=1
      shift
      ;;
    -d|--detached)
      DETACHED=1
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "$PROMPT" -eq 0 && -f "$SECRET_FILE" ]]; then
  WINDOWS_SECRET_FILE="$(wslpath -w "$SECRET_FILE")"
  PS_SECRET_FILE="$(ps_quote "$WINDOWS_SECRET_FILE")"
  read -r -d '' DECODE_CMD <<EOF || true
\$ErrorActionPreference = "Stop"
\$path = '$PS_SECRET_FILE'
\$secure = Get-Content -LiteralPath \$path | ConvertTo-SecureString
\$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR(\$secure)
try {
  [Runtime.InteropServices.Marshal]::PtrToStringBSTR(\$bstr)
}
finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(\$bstr)
}
EOF
  PAYLOAD="$(powershell.exe -NoProfile -NonInteractive -Command "$DECODE_CMD" | tr -d '\r')"
  export DB_USER="$(node.exe -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.DB_USER);' "$PAYLOAD")"
  export DB_PASS="$(node.exe -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.DB_PASS);' "$PAYLOAD")"
  export DB_NAME="$(node.exe -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.DB_NAME);' "$PAYLOAD")"
  export JWT_SECRET="$(node.exe -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.JWT_SECRET);' "$PAYLOAD")"
else
  read -r -p "DB_USER: " DB_USER
  read -r -s -p "DB_PASS: " DB_PASS
  printf '\n'
  read -r -p "DB_NAME: " DB_NAME
  read -r -s -p "JWT_SECRET: " JWT_SECRET
  printf '\n'
  export DB_USER DB_PASS DB_NAME JWT_SECRET
fi

for required in DB_USER DB_PASS DB_NAME JWT_SECRET; do
  if [[ -z "${!required// }" ]]; then
    echo "All required secrets must be provided." >&2
    exit 1
  fi
done

export NODE_ENV="${NODE_ENV:-development}"
export FRONTEND_URL="${FRONTEND_URL:-http://localhost}"
export LOG_LEVEL="${LOG_LEVEL:-debug}"
export DB_PORT_HOST="${DB_PORT_HOST:-5432}"

if [[ "$DETACHED" -eq 1 ]]; then
  exec docker compose up -d --build
else
  exec docker compose up --build
fi
