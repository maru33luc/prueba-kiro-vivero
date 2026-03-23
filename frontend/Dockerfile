# STAGE 1: Build (compilar aplicación Angular)
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev para compilación)
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Build de producción de Angular
RUN npm run build -- --configuration production


# STAGE 2: Servir con Nginx
FROM nginx:alpine

# Copiar aplicación compilada a directorio de Nginx
COPY --from=builder /app/dist/vivero-online/browser /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorio de logs
RUN mkdir -p /var/log/nginx

# Exponer puerto HTTP
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
