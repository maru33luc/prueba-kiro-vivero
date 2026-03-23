# Plan de Implementación: Vivero Online

## Visión General

Implementación incremental de la aplicación web de vivero online con Angular 17+ (frontend), NestJS (backend) y PostgreSQL/TypeORM (base de datos). Cada tarea construye sobre la anterior, comenzando por la infraestructura base y terminando con la integración completa.

## Tareas

- [x] 1. Configuración del proyecto y estructura base
  - Inicializar monorepo con workspace de Angular y proyecto NestJS
  - Configurar TypeORM con conexión a PostgreSQL y migraciones
  - Configurar Jest con fast-check en el backend
  - Configurar Cypress en el frontend
  - _Requirements: 8.5_

- [x] 2. Módulo de autenticación — Backend
  - [x] 2.1 Crear entidad `User`, DTOs de registro/login y `AuthModule` en NestJS
    - Implementar `User` entity con TypeORM (id, email, passwordHash, role, emailVerified, createdAt)
    - Crear `RegisterDto`, `LoginDto` con validación via `class-validator`
    - Configurar `UsersModule` y `AuthModule` con JWT strategy (access 15 min + refresh 7 días en httpOnly cookies)
    - Implementar `AuthService`: register (hash bcrypt), login, logout, refreshToken
    - Implementar endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.3_

  - [x] 2.2 Test de propiedad: round-trip de autenticación (P5)
    - **Property 5: Round-trip de autenticación**
    - **Validates: Requirements 2.1, 2.3, 2.4**
    - `// Feature: online-plant-nursery, Property 5: Round-trip de autenticación`

  - [x] 2.3 Test de propiedad: unicidad de email (P6)
    - **Property 6: Unicidad de email en registro**
    - **Validates: Requirements 2.2**
    - `// Feature: online-plant-nursery, Property 6: Unicidad de email en registro`

  - [x] 2.4 Test de propiedad: hash bcrypt (P19)
    - **Property 19: Contraseñas almacenadas como hash bcrypt**
    - **Validates: Requirements 8.3**
    - `// Feature: online-plant-nursery, Property 19: Contraseñas almacenadas como hash bcrypt`

  - [x] 2.5 Implementar recuperación de contraseña
    - Crear `ForgotPasswordDto`, `ResetPasswordDto`
    - Implementar generación de token con expiración de 60 minutos
    - Implementar endpoints: `POST /auth/forgot-password`, `POST /auth/reset-password`
    - Integrar `MailModule` para envío del enlace de reset
    - _Requirements: 2.5, 2.6_

  - [x] 2.6 Test de propiedad: validez temporal del token de reset (P7)
    - **Property 7: Validez temporal del token de reset de contraseña**
    - **Validates: Requirements 2.5, 2.6**
    - `// Feature: online-plant-nursery, Property 7: Validez temporal del token de reset`


- [x] 3. Control de acceso — Backend
  - [x] 3.1 Implementar guards JWT y de roles en NestJS
    - Crear `JwtAuthGuard` y `RolesGuard` con decorador `@Roles()`
    - Aplicar guards a endpoints protegidos (carrito, checkout, historial, admin)
    - Configurar `ExceptionFilter` global para errores HTTP estándar `{ statusCode, message, error }`
    - _Requirements: 8.1, 8.2_

  - [x] 3.2 Test de propiedad: control de acceso basado en roles (P18)
    - **Property 18: Control de acceso basado en roles**
    - **Validates: Requirements 8.1, 8.2**
    - `// Feature: online-plant-nursery, Property 18: Control de acceso basado en roles`

- [ ] 4. Módulo de categorías y plantas — Backend
  - [ ] 4.1 Crear entidades `Category` y `Plant` con sus módulos y endpoints CRUD
    - Implementar `Category` entity y `CategoriesModule` con endpoints `GET/POST /categories`, `PATCH/DELETE /categories/:id`
    - Implementar `Plant` entity con soft delete (`active` flag) y `PlantsModule`
    - Implementar endpoints: `GET /plants` (con filtros `categoryId`, `search`, paginación), `GET /plants/:id`, `POST /plants`, `PATCH /plants/:id`, `DELETE /plants/:id`
    - Aplicar `ValidationPipe` global para DTOs con `class-validator`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [~] 4.2 Test de propiedad: filtrado por categoría exhaustivo y exclusivo (P2)
    - **Property 2: Filtrado por categoría es exhaustivo y exclusivo**
    - **Validates: Requirements 1.3**
    - `// Feature: online-plant-nursery, Property 2: Filtrado por categoría es exhaustivo y exclusivo`

  - [~] 4.3 Test de propiedad: búsqueda por término inclusiva (P3)
    - **Property 3: Búsqueda por término es inclusiva**
    - **Validates: Requirements 1.4**
    - `// Feature: online-plant-nursery, Property 3: Búsqueda por término es inclusiva`

  - [~] 4.4 Test de propiedad: plantas agotadas no añadibles al carrito (P4)
    - **Property 4: Plantas agotadas no son añadibles al carrito**
    - **Validates: Requirements 1.5**
    - `// Feature: online-plant-nursery, Property 4: Plantas agotadas no son añadibles al carrito`

  - [~] 4.5 Test de propiedad: rechazo de stock negativo (P16)
    - **Property 16: Rechazo de stock negativo**
    - **Validates: Requirements 6.4**
    - `// Feature: online-plant-nursery, Property 16: Rechazo de stock negativo`

  - [~] 4.6 Test de propiedad: round-trip CRUD de plantas (P15)
    - **Property 15: Round-trip de CRUD de plantas**
    - **Validates: Requirements 6.1, 6.2, 6.3**
    - `// Feature: online-plant-nursery, Property 15: Round-trip de CRUD de plantas`

  - [~] 4.7 Test de propiedad: round-trip CRUD de categorías (P17)
    - **Property 17: Round-trip de CRUD de categorías**
    - **Validates: Requirements 6.5**
    - `// Feature: online-plant-nursery, Property 17: Round-trip de CRUD de categorías`

  - [~] 4.8 Test de propiedad: completitud de datos en catálogo y detalle (P1)
    - **Property 1: Completitud de datos de planta en catálogo y detalle**
    - **Validates: Requirements 1.1, 1.2**
    - `// Feature: online-plant-nursery, Property 1: Completitud de datos de planta en catálogo y detalle`

- [~] 5. Checkpoint — Verificar módulos de auth, plantas y categorías
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.


- [ ] 6. Módulo de carrito — Backend
  - [~] 6.1 Implementar `CartModule` con lógica de carrito persistido por usuario
    - Crear entidades `Cart` y `CartItem` (o gestión en sesión) con endpoints: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:plantId`, `DELETE /cart/items/:plantId`
    - Implementar validación de stock al añadir/actualizar ítems (limitar al stock disponible)
    - Calcular subtotales y total con impuestos en cada operación
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [~] 6.2 Test de propiedad: invariante de totales del carrito (P8)
    - **Property 8: Invariante de totales del carrito**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
    - `// Feature: online-plant-nursery, Property 8: Invariante de totales del carrito`

  - [~] 6.3 Test de propiedad: límite de cantidad por stock disponible (P9)
    - **Property 9: Límite de cantidad por stock disponible**
    - **Validates: Requirements 3.5**
    - `// Feature: online-plant-nursery, Property 9: Límite de cantidad por stock disponible`

- [ ] 7. Módulo de pedidos y pagos — Backend
  - [~] 7.1 Implementar `OrdersModule` y `PaymentsModule`
    - Crear entidades `Order` y `OrderItem` con TypeORM
    - Implementar `POST /orders` (checkout): validar stock, procesar pago con Stripe, reducir stock, crear pedido con estado "Pendiente", enviar email de confirmación
    - Implementar `GET /orders/me`, `GET /orders/:id`, `GET /orders` (admin), `PATCH /orders/:id/status`
    - Manejar pago rechazado (HTTP 402) preservando el carrito intacto
    - Validar estados de pedido con enum `OrderStatus`; rechazar estados inválidos (HTTP 422)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3_

  - [~] 7.2 Test de propiedad: confirmación de pedido reduce stock (P10)
    - **Property 10: Confirmación de pedido reduce stock**
    - **Validates: Requirements 4.2, 4.4**
    - `// Feature: online-plant-nursery, Property 10: Confirmación de pedido reduce stock`

  - [~] 7.3 Test de propiedad: pago rechazado preserva el carrito (P11)
    - **Property 11: Pago rechazado preserva el carrito**
    - **Validates: Requirements 4.3**
    - `// Feature: online-plant-nursery, Property 11: Pago rechazado preserva el carrito`

  - [~] 7.4 Test de propiedad: historial de pedidos ordenado por fecha descendente (P12)
    - **Property 12: Historial de pedidos ordenado por fecha descendente**
    - **Validates: Requirements 5.1, 7.1**
    - `// Feature: online-plant-nursery, Property 12: Historial de pedidos ordenado por fecha descendente`

  - [~] 7.5 Test de propiedad: notificación por email en cambio de estado (P13)
    - **Property 13: Notificación por email en cambio de estado**
    - **Validates: Requirements 5.3, 7.2**
    - `// Feature: online-plant-nursery, Property 13: Notificación por email en cambio de estado`

  - [~] 7.6 Test de propiedad: estados de pedido válidos y rechazo de inválidos (P14)
    - **Property 14: Estados de pedido válidos y rechazo de inválidos**
    - **Validates: Requirements 5.4, 7.3**
    - `// Feature: online-plant-nursery, Property 14: Estados de pedido válidos y rechazo de inválidos`

- [~] 8. Checkpoint — Verificar módulos de carrito, pedidos y pagos
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.


- [ ] 9. Frontend Angular — Infraestructura base
  - [~] 9.1 Configurar Angular Router, interceptores HTTP y guards
    - Definir rutas principales con lazy loading para `CatalogModule`, `AuthModule`, `CartModule`, `CheckoutModule`, `OrdersModule`, `AdminModule`
    - Implementar `JwtInterceptor` para adjuntar access token a requests y manejar refresh automático (HTTP 401)
    - Implementar `ErrorInterceptor` para capturar errores HTTP y mostrar notificaciones al usuario
    - Implementar `AuthGuard` (redirige a `/auth/login`), `RoleGuard` (redirige a `/`) e `InactivityService` (logout tras 30 min)
    - _Requirements: 8.1, 8.2, 8.4_

- [ ] 10. Frontend Angular — Módulo de autenticación
  - [~] 10.1 Implementar `AuthModule` con componentes de registro, login y reset de contraseña
    - Crear `LoginComponent` y `RegisterComponent` con formularios reactivos y validación
    - Crear `ResetPasswordComponent` (solicitud y confirmación de reset)
    - Implementar `AuthService` con métodos `login`, `register`, `logout`, `refreshToken` y `currentUser$`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 11. Frontend Angular — Catálogo de plantas
  - [~] 11.1 Implementar `CatalogModule` con listado, filtros y detalle de planta
    - Crear `PlantListComponent` con grid de plantas (nombre, imagen, precio, disponibilidad)
    - Crear `PlantFilterComponent` con selector de categoría y campo de búsqueda
    - Crear `PlantDetailComponent` con ficha completa (descripción, cuidados, stock, botón añadir al carrito)
    - Implementar `PlantService` con `getPlants(filters)` y `getPlantById(id)`
    - Mostrar badge "Agotada" y deshabilitar botón cuando stock = 0
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 12. Frontend Angular — Carrito de compras
  - [~] 12.1 Implementar `CartModule` con gestión de ítems y totales
    - Crear `CartComponent` con listado de ítems, subtotales, total con impuestos y enlace al catálogo cuando está vacío
    - Crear `CartItemComponent` con controles de cantidad (validando límite de stock) y botón eliminar
    - Implementar `CartService` con `addItem`, `removeItem`, `updateQty`, `getCart` y `clear`
    - Mostrar mensaje de carrito vacío con enlace al catálogo
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 13. Frontend Angular — Checkout y confirmación
  - [~] 13.1 Implementar `CheckoutModule` con formulario de checkout y confirmación de pedido
    - Crear `CheckoutComponent` con formulario de dirección de entrega y campo de método de pago (token Stripe)
    - Crear `OrderConfirmationComponent` mostrando resumen del pedido confirmado
    - Implementar `OrderService` con `createOrder`, `getMyOrders` y `getOrderById`
    - Manejar pago rechazado mostrando mensaje descriptivo sin vaciar el carrito
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 14. Frontend Angular — Historial de pedidos
  - [~] 14.1 Implementar `OrdersModule` con listado y detalle de pedidos del usuario
    - Crear `OrderListComponent` con pedidos ordenados por fecha descendente
    - Crear `OrderDetailComponent` con plantas, cantidades, precios, dirección y estado actual
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 15. Frontend Angular — Panel de administración
  - [~] 15.1 Implementar `AdminModule` con gestión de plantas, categorías y pedidos
    - Crear `AdminPlantFormComponent` para crear y editar plantas (nombre, descripción, precio, stock, categoría, imagen)
    - Crear `AdminCategoryComponent` para crear, renombrar y desactivar categorías
    - Crear `AdminOrderListComponent` con todos los pedidos, filtros por estado y selector de cambio de estado
    - Proteger todas las rutas `/admin/*` con `RoleGuard`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3_

- [~] 16. Checkpoint — Verificar integración frontend-backend
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.


- [ ] 17. Tests E2E con Cypress
  - [~] 17.1 Flujo completo de compra E2E
    - Implementar test: registro → catálogo → añadir al carrito → checkout → confirmación de pedido
    - _Requirements: 2.1, 3.1, 4.1, 4.2, 4.4_

  - [~] 17.2 Flujo de administración E2E
    - Implementar test: login admin → crear planta → actualizar stock → cambiar estado de pedido
    - _Requirements: 6.1, 6.2, 7.2_

  - [~] 17.3 Verificación de redirecciones de acceso E2E
    - Implementar test: visitante intenta acceder a `/cart` → redirige a `/auth/login`
    - Implementar test: usuario sin rol admin intenta acceder a `/admin` → redirige a `/`
    - _Requirements: 8.1, 8.2_

- [~] 18. Checkpoint final — Verificar todos los tests
  - Asegurarse de que todos los tests (unitarios, propiedades y E2E) pasan. Consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los tests de propiedades usan fast-check con mínimo 100 iteraciones por propiedad
- Cada test de propiedad incluye el comentario: `// Feature: online-plant-nursery, Property N: <texto>`
- Los tests unitarios y de propiedades son complementarios; evitar duplicar cobertura
- Los checkpoints garantizan validación incremental antes de continuar
