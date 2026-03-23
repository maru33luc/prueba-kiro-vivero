# STAGE 1: Build (compilar código TypeScript)
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias (incluye devDependencies para compilar)
RUN npm install

# Copiar código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build


# STAGE 2: Runtime (ejecutar aplicación compilada)
FROM node:18-alpine

WORKDIR /app

# Copiar package.json para instalar solo dependencias de producción
COPY package*.json ./

# Instalar SOLO dependencias de producción (elimina devDependencies)
RUN npm install --omit=dev

# Copiar código compilado del stage anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Health check para verificar que el servicio está vivo
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
