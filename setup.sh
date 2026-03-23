#!/bin/bash

# VIVERO ONLINE - ONE-CLICK SETUP
# Ejecuta este script una sola vez para levantar TODO

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VIVERO ONLINE - SETUP AUTOMÁTICO    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ===== PASO 1: VERIFICAR DOCKER =====
echo -e "${YELLOW}[1/6]${NC} Verificando Docker..."
if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗ Docker no está instalado${NC}"
  echo "Descargar desde: https://www.docker.com/products/docker-desktop"
  exit 1
fi
echo -e "${GREEN}✓${NC} Docker instalado"

# ===== PASO 2: CREAR .env.local =====
echo -e "${YELLOW}[2/6]${NC} Configurando variables de entorno..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo -e "${GREEN}✓${NC} .env.local creado"
else
  echo -e "${GREEN}✓${NC} .env.local ya existe"
fi

# ===== PASO 3: LIMPIAR CONTENEDORES VIEJOS =====
echo -e "${YELLOW}[3/6]${NC} Limpiando contenedores anteriores..."
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✓${NC} Limpieza completada"

# ===== PASO 4: CONSTRUIR E INICIAR =====
echo -e "${YELLOW}[4/6]${NC} Construyendo imágenes e iniciando servicios..."
echo "     (Esto puede tomar 2-3 minutos la primera vez)"
echo ""
docker-compose up -d --build
echo ""
echo -e "${GREEN}✓${NC} Servicios iniciados"

# ===== PASO 5: ESPERAR A POSTGRES =====
echo -e "${YELLOW}[5/6]${NC} Esperando a que PostgreSQL esté listo..."
for i in {1..30}; do
  if docker-compose exec -T postgres pg_isready -U vivero &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL está listo"
    break
  fi
  echo -n "."
  sleep 1
done
echo ""

# ===== PASO 6: EJECUTAR MIGRACIONES =====
echo -e "${YELLOW}[6/6]${NC} Ejecutando migraciones de BD..."
if docker-compose exec backend npm run migration:run; then
  echo -e "${GREEN}✓${NC} Migraciones ejecutadas"
else
  echo -e "${YELLOW}⚠${NC} Las migraciones pueden estar sin tareas"
fi

# ===== RESUMEN =====
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ SETUP COMPLETADO${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Accede a:"
echo -e "  ${GREEN}Frontend:${NC}  http://localhost"
echo -e "  ${GREEN}Backend:${NC}   http://localhost:3000/api"
echo ""
echo "Próximos pasos:"
echo "  • Abre http://localhost en navegador"
echo "  • Ver logs: docker-compose logs -f backend"
echo "  • Parar: docker-compose down"
echo ""
echo "¿Problemas? Lee PRIMEROS_PASOS.md o DOCKER_QUICK_START.md"
echo ""
