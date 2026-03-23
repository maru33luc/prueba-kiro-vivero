# AGENT.md - Vivero Online

## 📋 Descripción del Proyecto

**Vivero Online** es un e-commerce full-stack especializado en la venta de plantas. Permite a usuarios explorar un catálogo, gestionar carrito y completar compras. Administradores pueden gestionar inventario y pedidos.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión |
|---|---|---|
| **Frontend** | Angular | 17 (standalone) |
| **Backend** | NestJS | 10 |
| **Database** | PostgreSQL | 15 |
| **ORM** | TypeORM | 0.3 |
| **Auth** | JWT + Passport | 0.6 + 10 |
| **Package Manager** | npm | workspaces |
| **Containerization** | Docker | desktop |

---

## 📂 Estructura del Proyecto

```
PRUEBA-KIRO/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT, login, register, recovery
│   │   ├── plants/            # CRUD plantas
│   │   ├── categories/        # Categorías
│   │   ├── users/             # Usuarios, roles
│   │   ├── common/            # Filters, guards, decoradores
│   │   ├── database/
│   │   │   ├── entities/      # Modelos TypeORM
│   │   │   ├── migrations/    # Scripts de migración
│   │   │   └── data-source.ts
│   │   ├── app.module.ts      # Módulo principal
│   │   └── main.ts            # Entry point
│   ├── Dockerfile             # Multi-stage build
│   └── package.json
│
├── frontend/
│   ├── src/app/
│   │   ├── auth/              # Login, registro, reset
│   │   ├── catalog/           # Catálogo y detalles
│   │   ├── cart/              # Carrito de compras
│   │   ├── checkout/          # Proceso de compra
│   │   ├── orders/            # Historial de pedidos
│   │   └── admin/             # Panel administrativo
│   ├── Dockerfile             # Multi-stage + Nginx
│   ├── nginx.conf             # Config servidor web
│   └── package.json
│
├── .kiro/specs/               # Especificaciones del negocio
├── docker-compose.yml         # Orquestador de servicios
├── .env.example               # Template de variables
├── setup.sh                   # One-click setup
├── check-setup.sh             # Verificar configuración
├── README.md                  # Guía rápida
└── AGENT.md                   # Este archivo

```

---

## 🚀 Guía de Setup

### Requisitos Previos
- Docker Desktop instalado
- Verificar: `docker --version && docker-compose --version`

### Setup Rápido (One-Click)

```bash
cd /c/Users/maru3/Desktop/PROJECTOS/PRUEBA-KIRO
bash setup.sh
```

**El script automáticamente:**
1. Verifica Docker
2. Crea `.env.local` desde `.env.example`
3. Construye imágenes Docker
4. Inicia servicios (PostgreSQL, Backend, Frontend)
5. Ejecuta migraciones de BD
6. Verifica que todo funciona

**Tiempo**: 3-4 minutos (primera vez)

### Setup Manual

```bash
# 1. Configuración
cp .env.example .env.local

# 2. Iniciar servicios
docker-compose up -d

# 3. Esperar a PostgreSQL
sleep 30

# 4. Crear tablas
docker-compose exec backend npm run migration:run

# 5. Verificar
docker-compose ps
open http://localhost
```

---

## 🔧 Configuración & Variables de Entorno

### `.env.example` (Template)

```env
# DATABASE
DB_HOST=postgres          # Host del contenedor PostgreSQL
DB_PORT=5432              # Puerto PostgreSQL
DB_USER=vivero            # Usuario BD
DB_PASS=password123       # Contraseña (cambiar en prod)
DB_NAME=vivero_online     # Nombre BD

# JWT
JWT_SECRET=abc123...      # Clave para firmar tokens (cambiar en prod)
JWT_EXPIRATION=7200       # Duración tokens (segundos)

# APPLICATION
NODE_ENV=development      # Modo (development/production)
PORT=3000                 # Puerto backend
FRONTEND_URL=http://localhost  # URL frontend (CORS)
```

### `.env.local` (Tu Configuración)

```bash
# Copiar desde .env.example
cp .env.example .env.local

# Editar con tus valores (archivo NO se commitea)
# Variables overrides de .env.example
```

---

## 📊 Servicios Corriendo

Cuando haces `docker-compose up -d`:

| Servicio | URL | Puerto | Datos |
|---|---|---|---|
| **Frontend** | http://localhost | 80 | Angular app |
| **Backend API** | http://localhost:3000 | 3000 | NestJS API |
| **PostgreSQL** | localhost | 5432 | vivero_online |

---

## 🎯 Comandos del Día a Día

```bash
# 🟢 INICIAR
docker-compose up -d

# 🔴 PARAR
docker-compose down

# 📊 VER ESTADO
docker-compose ps

# 📝 VER LOGS
docker-compose logs -f backend      # Backend en vivo
docker-compose logs backend | tail   # Últimas líneas
docker-compose logs -f               # Todo en vivo

# 💻 ACCESO A CONTENEDORES
docker-compose exec backend bash    # Terminal backend
docker-compose exec postgres psql -U vivero -d vivero_online  # Terminal BD

# 🔨 RECONSTRUIR (después cambios en dependencias)
docker-compose up -d --build

# 🗑️ LIMPIAR COMPLETAMENTE
docker-compose down -v
docker system prune -a

# 🧪 TESTS
docker-compose exec backend npm run test
docker-compose exec frontend npm run test

# 📚 MIGRACIONES
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run migration:generate -- src/database/migrations/MigrationName
```

---

## 🏗️ Arquitectura & Patrones

### Frontend (Angular 17 Standalone)

**Estructura por Feature:**
```
app/
├── auth/              # Módulo autenticación
│   ├── login/
│   ├── register/
│   └── reset-password/
├── catalog/           # Módulo catálogo
│   ├── plant-list/
│   └── plant-detail/
├── cart/              # Módulo carrito
├── checkout/          # Módulo compra
├── orders/            # Módulo pedidos
└── admin/             # Módulo admin
```

**Convenciones:**
- Componentes: `[name].component.ts` (kebab-case)
- Selectores: `app-[name]` o `app-shared-[name]`
- Servicios: `[name].service.ts`
- Pipes: `[name].pipe.ts`

**Patrones Recomendados:**
- ✅ Async pipe para observables en templates
- ✅ OnPush change detection en presentacionales
- ✅ takeUntil para cancelar subscripciones
- ✅ BehaviorSubject para estado global
- ✅ Guards para rutas protegidas

### Backend (NestJS 10)

**Estructura Modular:**
```
src/
├── auth/              # Módulo autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   └── auth.module.ts
├── plants/            # Módulo plantas
│   ├── plants.controller.ts
│   ├── plants.service.ts
│   ├── plant.entity.ts
│   ├── dto/
│   └── plants.module.ts
├── categories/
├── users/
├── common/            # Elementos compartidos
│   ├── filters/
│   ├── guards/
│   ├── decorators/
│   └── interceptors/
└── app.module.ts      # Módulo principal
```

**Convenciones:**
- Controllers: `[resource].controller.ts`
- Services: `[resource].service.ts`
- Entities: `[Entity].entity.ts` (PascalCase)
- DTOs: `[Action]-[resource].dto.ts`

---

## 🗄️ Base de Datos (TypeORM + PostgreSQL)

### Entidades Principales

- **User** - Usuarios (email, password hash, rol)
- **Plant** - Plantas (nombre, descripción, precio, stock)
- **Category** - Categorías de plantas
- **Cart** - Carrito de compras (user_id)
- **CartItem** - Items en carrito (plant_id, cantidad)
- **Order** - Pedidos (user_id, estado, fecha)
- **OrderItem** - Productos del pedido (plant_id, cantidad, precio)

### Migraciones

```bash
# Generar nueva migración
docker-compose exec backend npm run migration:generate -- src/database/migrations/AddNewColumn

# Ejecutar migraciones
docker-compose exec backend npm run migration:run

# Revertir última migración
docker-compose exec backend npm run migration:revert
```

---

## 🔐 Seguridad & Mejores Prácticas

### Autenticación
- JWT tokens en headers `Authorization: Bearer <token>`
- Tokens expirables (JWT_EXPIRATION)
- Bcrypt para hash de contraseñas
- Refresh tokens (implementar)

### Autorización
- Roles: USER, ADMIN
- Guards protegen rutas sensibles
- @Roles() decorador en controladores

### CORS
- Configurado para desarrollo (flexible)
- En producción: restringir a dominio específico

### Variables Sensibles
- ❌ NO commitear `.env.local`
- ✅ Commitetar `.env.example` (template)
- ✅ Cambiar JWT_SECRET en producción
- ✅ Cambiar DB_PASS en producción

---

## 📋 Testing

### Frontend (Jasmine + Karma)
```bash
docker-compose exec frontend npm run test
```

### Backend (Jest)
```bash
docker-compose exec backend npm run test
docker-compose exec backend npm run test:cov  # Con coverage
```

### E2E (Cypress)
```bash
docker-compose exec frontend npm run cypress:open   # UI
docker-compose exec frontend npm run cypress:run    # Headless
```

---

## 🐛 Debugging & Troubleshooting

### Frontend no carga
```bash
docker-compose logs frontend
docker-compose ps frontend
```

### Backend falla al conectar BD
```bash
docker-compose logs backend
docker-compose exec backend bash
npm run start  # Ver error detallado
```

### BD no conecta
```bash
docker-compose logs postgres
docker-compose exec postgres psql -U vivero -d vivero_online
```

### Puerto en uso
```bash
lsof -i :80    # Puerto 80
lsof -i :3000  # Puerto 3000
kill -9 <PID>  # Matar proceso
```

### Empezar de cero
```bash
docker-compose down -v          # Borra volúmenes (datos)
docker-compose up -d --build    # Reconstruye
sleep 30
docker-compose exec backend npm run migration:run
```

---

## 📚 Recursos Importantes

- **Especificaciones**: `.kiro/specs/online-plant-nursery/`
- **Angular Docs**: https://angular.io/docs
- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io
- **Docker Docs**: https://docs.docker.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 🚀 Flujo de Desarrollo

### 1. Crear Feature
```bash
# Backend: Nuevo módulo
nest generate module plants
nest generate controller plants
nest generate service plants

# Frontend: Nuevo componente
ng generate component features/plants/plant-list
```

### 2. Implementar
- Backend: Servicio + Controller + DTO
- Frontend: Componente + Servicio + Template
- BD: Entity + Relationships

### 3. Testear
```bash
docker-compose exec backend npm run test
docker-compose exec frontend npm run test
```

### 4. Commit & Push
```bash
git add .
git commit -m "feat: agregar CRUD de plantas"
git push origin feature/plants
```

---

## ✅ Decisiones Arquitectónicas

### Implementadas ✓
- Monorepo con npm workspaces
- JWT + Passport para auth
- TypeORM para ORM
- Docker multi-stage builds
- Modular architecture
- RxJS para programación reactiva

### Por Implementar (Sprint Futuro)

#### 1️⃣ Caché (Redis)

**Patrón**: Lazy loading con invalidación manual

```typescript
// backend/src/common/cache/cache.decorator.ts
export function Cacheable(ttl: number = 300) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const key = `${target.name}:${propertyKey}:${JSON.stringify(args)}`;
      const cached = await this.cacheService.get(key);
      if (cached) return cached;
      const result = await originalMethod.apply(this, args);
      await this.cacheService.set(key, result, ttl);
      return result;
    };
    return descriptor;
  };
}
```

**Uso en servicios:**
```typescript
@Cacheable(300) // 5 minutos
async getPlants() { ... }
```

**Docker**: Agregar Redis a docker-compose.yml
- Imagen: redis:7-alpine
- Puerto: 6379

#### 2️⃣ Logging Centralizado (Winston + Sentry)

**Backend logging** con Winston:
```typescript
// backend/src/common/logger/logger.service.ts
import * as winston from 'winston';

export const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/app.log'
    })
  ]
};

export const logger = winston.createLogger(loggerConfig);
```

**Sentry para errores críticos** (opcional):
```typescript
// .env.example: SENTRY_DSN=https://...
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}
```

**Logs por nivel:**
- ✅ ERROR - Fallos críticos (BD down, auth fail)
- ✅ WARN - Comportamiento inesperado (stock bajo)
- ✅ INFO - Eventos importantes (orden creada)
- ❌ DEBUG - No loguear en producción

#### 3️⃣ CI/CD Pipeline (GitHub Actions)

**Archivo**: `.github/workflows/ci.yml`

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_PASSWORD: test

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm

      - run: npm ci
      - run: npm run test:backend
      - run: npm run test:frontend
      - run: npm run build:backend
      - run: npm run build:frontend
```

**Validaciones en cada push:**
- ✅ Linting
- ✅ Tests unitarios
- ✅ Build
- ✅ Coverage > 70%

#### 4️⃣ Versionado de API (/api/v1, /api/v2)

**Implementación NestJS**:

```typescript
// backend/src/main.ts
app.enableVersioning({
  type: VersioningType.URI,
  prefix: 'api/v',
});

// backend/src/plants/plants.controller.ts
@Controller('plants')
export class PlantsController {

  @Version('1')
  @Get()
  getPlantsV1() { ... }  // GET /api/v1/plants

  @Version('2')
  @Get()
  getPlantsV2() {
    // Versión 2 con más datos
    ...
  }  // GET /api/v2/plants
}
```

**Frontend**: Auto-detectar versión
```typescript
// frontend/src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api/v1'
};
```

**Beneficios:**
- Backwards compatibility
- Deprecar endpoints gradualmente
- Breaking changes sin afectar clientes

#### 5️⃣ Websockets para Notificaciones

**Gateway NestJS** (simple pero funcional):

```typescript
// backend/src/notifications/notifications.gateway.ts
import { WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL }
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Enviar notificación a todos
  notifyOrderCreated(orderId: string) {
    this.server.emit('order:created', { orderId, timestamp: new Date() });
  }

  // Enviar a usuario específico
  notifyUser(userId: string, message: string) {
    this.server.to(userId).emit('notification', { message });
  }
}
```

**Uso en servicio**:
```typescript
// backend/src/orders/orders.service.ts
constructor(private gateway: NotificationsGateway) {}

async createOrder(dto: CreateOrderDto) {
  const order = await this.ordersRepository.save(dto);
  this.gateway.notifyOrderCreated(order.id);  // Notificar en tiempo real
  return order;
}
```

**Frontend listener**:
```typescript
// frontend/src/app/shared/services/notifications.service.ts
import { io } from 'socket.io-client';

export class NotificationsService {
  private socket = io('http://localhost:3000');

  subscribeToOrderCreated() {
    this.socket.on('order:created', (data) => {
      console.log('Nueva orden:', data);
      // Actualizar UI
    });
  }
}
```

---

## 📋 Roadmap (Próximas Sprints)

| Sprint | Item | Estimación |
|---|---|---|
| 1 | **API Versioning** | 4h |
| 2 | **Redis Caché** | 8h |
| 2 | **Winston Logging** | 6h |
| 3 | **GitHub Actions CI/CD** | 10h |
| 3 | **Websockets** | 12h |

**Total**: ~40h (2-3 sprints)

---

## 📞 Contacto & Soporte

Si algo no funciona:
1. Revisa logs: `docker-compose logs -f`
2. Verifica setup: `bash check-setup.sh`
3. Lee README.md
4. Pregunta a un senior del equipo

---

**Última actualización**: 2026-03-23
**Estado**: ✅ Producción Ready (con ajustes de seguridad)
