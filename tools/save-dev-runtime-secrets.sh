#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRET_FILE="${1:-$SCRIPT_DIR/../.secrets/dev-runtime.secure.txt}"
SECRET_DIR="$(dirname "$SECRET_FILE")"

mkdir -p "$SECRET_DIR"

rand_b64() {
  node.exe -e "console.log(require('crypto').randomBytes($1).toString('base64url'))"
}

ps_quote() {
  printf "%s" "$1" | sed "s/'/''/g"
}

DB_USER="${DB_USER:-vivero}"
DB_PASS="${DB_PASS:-$(rand_b64 32)}"
DB_NAME="${DB_NAME:-vivero_online}"
JWT_SECRET="${JWT_SECRET:-$(rand_b64 48)}"

export DB_USER DB_PASS DB_NAME JWT_SECRET
PAYLOAD="$(node.exe -e 'const env = process.env; process.stdout.write(JSON.stringify({DB_USER: env.DB_USER, DB_PASS: env.DB_PASS, DB_NAME: env.DB_NAME, JWT_SECRET: env.JWT_SECRET}))')"

WINDOWS_SECRET_FILE="$(wslpath -w "$SECRET_FILE")"
PS_SECRET_FILE="$(ps_quote "$WINDOWS_SECRET_FILE")"
PS_PAYLOAD="$(ps_quote "$PAYLOAD")"
read -r -d '' ENCODE_CMD <<EOF || true
\$ErrorActionPreference = "Stop"
\$path = '$PS_SECRET_FILE'
\$value = '$PS_PAYLOAD'
\$secure = ConvertTo-SecureString -String \$value -AsPlainText -Force
\$encrypted = ConvertFrom-SecureString -SecureString \$secure
Set-Content -LiteralPath \$path -Value \$encrypted
EOF

powershell.exe -NoProfile -NonInteractive -Command "$ENCODE_CMD" >/dev/null
echo "Encrypted runtime secrets saved to $SECRET_FILE"
