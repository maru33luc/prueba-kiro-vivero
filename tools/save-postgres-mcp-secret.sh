#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRET_FILE="${1:-$SCRIPT_DIR/../.secrets/postgres-mcp-url.secure.txt}"
SECRET_DIR="$(dirname "$SECRET_FILE")"

mkdir -p "$SECRET_DIR"

printf 'Postgres connection string for MCP: ' >&2
IFS= read -r CONNECTION_STRING

if [[ -z "${CONNECTION_STRING// }" ]]; then
  echo "Connection string cannot be empty." >&2
  exit 1
fi

ps_quote() {
  printf "%s" "$1" | sed "s/'/''/g"
}

WINDOWS_SECRET_FILE="$(wslpath -w "$SECRET_FILE")"
PS_SECRET_FILE="$(ps_quote "$WINDOWS_SECRET_FILE")"
PS_CONNECTION_STRING="$(ps_quote "$CONNECTION_STRING")"
read -r -d '' ENCODE_CMD <<EOF || true
\$ErrorActionPreference = "Stop"
\$path = '$PS_SECRET_FILE'
\$value = '$PS_CONNECTION_STRING'
\$secure = ConvertTo-SecureString -String \$value -AsPlainText -Force
\$encrypted = ConvertFrom-SecureString -SecureString \$secure
Set-Content -LiteralPath \$path -Value \$encrypted
EOF

powershell.exe -NoProfile -NonInteractive -Command "$ENCODE_CMD" >/dev/null
echo "Encrypted MCP secret saved to $SECRET_FILE"
