#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRET_FILE="${1:-$SCRIPT_DIR/../.secrets/postgres-mcp-url.secure.txt}"

if [[ ! -f "$SECRET_FILE" ]]; then
  echo "Missing encrypted MCP secret file at '$SECRET_FILE'. Run tools/save-postgres-mcp-secret.sh first." >&2
  exit 1
fi

ps_quote() {
  printf "%s" "$1" | sed "s/'/''/g"
}

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

CONNECTION_STRING="$(powershell.exe -NoProfile -NonInteractive -Command "$DECODE_CMD" | tr -d '\r')"

exec cmd.exe /c npx.cmd -y @ahmetkca/mcp-server-postgres "$CONNECTION_STRING"
