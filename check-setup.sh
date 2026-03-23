#!/bin/bash

# VIVERO ONLINE - CHECKLIST DE SETUP
# Ejecuta este script para verificar que todo está listo para levantar

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  VIVERO ONLINE - CHECKLIST DE SETUP${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

PASSED=0
FAILED=0

check() {
  local name=$1
  local command=$2

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $name"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $name"
    ((FAILED++))
  fi
}

warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

section() {
  echo ""
  echo -e "${BLUE}$1${NC}"
}

# ===== DOCKER =====
section "Docker"
check "Docker instalado" "docker --version"
check "Docker corriendo" "docker ps > /dev/null"
check "docker-compose instalado" "docker-compose --version"

# ===== ARCHIVOS =====
section "Archivos Necesarios"
check ".env.example existe" "[ -f .env.example ]"
check ".env.local existe" "[ -f .env.local ]"
check "docker-compose.yml existe" "[ -f docker-compose.yml ]"
check "backend/Dockerfile existe" "[ -f backend/Dockerfile ]"
check "frontend/Dockerfile existe" "[ -f frontend/Dockerfile ]"
check "frontend/nginx.conf existe" "[ -f frontend/nginx.conf ]"

# ===== CONFIGURACIÓN =====
section "Configuración"
check "DB_HOST configurado" "grep 'DB_HOST' .env.local"
check "JWT_SECRET configurado" "grep 'JWT_SECRET' .env.local"
check "NODE_ENV configurado" "grep 'NODE_ENV' .env.local"

# ===== DEPENDENCIAS =====
section "Dependencias"
check "backend/package.json existe" "[ -f backend/package.json ]"
check "frontend/package.json existe" "[ -f frontend/package.json ]"
check "backend/src/main.ts existe" "[ -f backend/src/main.ts ]"
check "backend/src/app.module.ts existe" "[ -f backend/src/app.module.ts ]"

# ===== MIGRACIONES =====
section "Base de Datos"
check "migrations/ directorio existe" "[ -d backend/src/database/migrations ]"
check "data-source.ts existe" "[ -f backend/src/database/data-source.ts ]"

# ===== RESULTADO =====
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "Pasados: ${GREEN}$PASSED${NC}"
echo -e "Fallidos: ${RED}$FAILED${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ Todo listo para levantar${NC}"
  echo ""
  echo "Próximos pasos:"
  echo "  1. docker-compose up -d"
  echo "  2. sleep 30"
  echo "  3. docker-compose exec backend npm run migration:run"
  echo "  4. open http://localhost"
  exit 0
else
  echo -e "${RED}✗ Hay problemas. Revisa arriba.${NC}"
  exit 1
fi
