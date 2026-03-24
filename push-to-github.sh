#!/bin/bash

# Este script crea el repo en GitHub y hace push
# Uso: GITHUB_TOKEN="tu_token" bash push-to-github.sh

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN no está configurado"
    echo "Configura: export GITHUB_TOKEN='tu_token_aqui'"
    exit 1
fi

# Crear repositorio en GitHub
echo "Creando repositorio en GitHub..."
curl -X POST https://api.github.com/user/repos \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "name": "prueba-kiro-vivero",
    "description": "Vivero Online - Angular 17 Frontend + NestJS Backend",
    "private": false,
    "auto_init": false
  }'

echo -e "\n✓ Repositorio creado"

# Hacer push
echo "Haciendo push del código..."
git push -u origin main

echo -e "\n✓ Push completado"
echo "Repositorio disponible en: https://github.com/maru33luc/prueba-kiro-vivero"
