# 🌿 Vivero Online - E-Commerce Platform

![GitHub CI](https://img.shields.io/github/actions/workflow/status/maru33luc/prueba-kiro-vivero/ci.yml?branch=main&label=CI%20Pipeline&logo=github&style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Plataforma integral de E-commerce desarrollada para la gestión, exhibición y venta en línea de plantas y productos de vivero. Implementada bajo una arquitectura basada en microservicios contenerizados (Monorepo) y prácticas sólidas de desarrollo, este proyecto sirve como un ejemplo de infraestructura Full-Stack lista para producción.

---

## 🏗️ Arquitectura y Pila Tecnológica

El proyecto se divide en diferentes capas de responsabilidad, lo que fomenta el desacoplamiento, la facilidad de prueba y permite escalar componentes independientemente.

### 🎨 1. Frontend SPA (Single Page Application)
La aplicación cliente está construida para optimizar la velocidad y la experiencia del usuario (UX).

- **Framework Core:** Angular 17.
- **Paradigma de Componentes:** Uso extensivo de *Standalone Components* (sin módulos tradicionales) para un árbol de dependencias más limpio y carga rápida.
- **Enrutamiento y Lazy Loading:** Configuración avanzada de `Router` para cargar módulos funcionales (Catálogo, Checkout, Admin) progresivamente bajo demanda.
- **Estilos / UI:** Framework CSS Utility-First (TailwindCSS) optimizado a través de PostCSS.
- **Despliegue (Serving):** Configurado a través de NGINX, utilizando directivas proxy para enmascarar las rutas del backend y servir los estáticos desde un contenedor ultra-ligero Alpine.

### ⚙️ 2. Backend API (API REST)
Servidor robusto, escalable e impulsado por Domain-Driven Design estructurado.

- **Framework Core:** NestJS 10 (basado en Express).
- **Servidor de Base de Datos:** PostgreSQL 15 integrado.
- **ORM / Capa de Datos:** TypeORM manipulando sincronizaciones y migraciones atómicas.
- **Seguridad y Autenticación:**
  - Empleo de Passport.js (Local/JWT).
  - Emisión de `HttpOnly` Cookies en vez del LocalStorage para evitar lectura transversal mediante scripts (XSS).
  - Bcrypt para un almacenado de contraseñas de "1-way-hashing" con factores de *salt*.
  - Funcionalidades robustas de *Password Reset* usando servicios de Mailers acoplados (dummy inyectable).
- **Validaciones:** `ValidationPipe` globales con *Class-Validator* + *Class-Transformer* para asegurar que los DTOs y tipos de entrada coincidan estrictamente antes de llegar a los dominios.

### 🧪 3. Quality Assurance (Testing Avanzado)
Garantizar la estabilidad de las reglas de negocio a lo largo del tiempo.

- **Property-Based Testing (Backend):** Utilizando `fast-check` implementamos pruebas por propiedades para la capa de Auth. Esto en lugar de afirmar flujos (Inputs finitos), inyecta miles de datos aleatorios comprobando los *invariantes de negocio* de manera paramétrica (Por ej: Autenticación, Hashes Seguros, Exclusividad de Correos Electrónicos).
- **Unit Testing Backend:** Suite de Jest.
- **Testing Frontend:** Pruebas controladas localmente por el framework Karma + Jasmine en el navegador `ChromeHeadless`.
- **E2E Testing:** Configurado para pruebas pre-deployment con *Cypress*.

### 🚀 4. DevOps, Contenedores y CI/CD
Flujo industrial automatizado y agnóstico a Sistema Operativo.

- **Imágenes Multi-Stage Docker:** Los Dockerfiles (`backend/Dockerfile`, `frontend/Dockerfile`) optimizan drásticamente el peso de la imagen excluyendo dependencias de testeo y builder del producto final.
- **Docker Compose:** Red privada aislada `vivero_network` para enrutar el tráfico backend <-> db de forma interna, ocultando puertos de BD al exterior.
- **Automatización Github Actions (`.github/workflows/ci.yml`):**
  Un pipeline estricto CI/CD que corre de forma automatizada ante la ocurrencia de un `push` a los branches críticos (`main`, `develop`) o al emitirse un *Pull Request*. 
  Las Actions despliegan:
  1. Un contenedor Postgres aislado como Servicio Efémero de Action.
  2. Descarga y almacenamiento en caché eficiente de `Node Modules`.
  3. Comprobaciones ESlint en Workspaces (Frontend / Backend).
  4. Ejecución del Property Testing de Backend usando el servicio de Postgres Action.
  5. Ejecución del Karma Testing de Angular Headless Mode.
  6. Compilación Multi-Workspace de Build (`npm run build`).

---

## 🚦 Primeros Pasos (Levantando el Entorno local)

Para tu comodidad, proveemos un ecosistema de scripts Bash que configuran y comprueban el estado íntegro de la aplicación con *cero-configuración* manual.

### Requisitos Previos:
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) v2+.
- Shell (Bash / Git Bash si estás en Windows, o WSL).

### 🥇 Opción 1: El Script "One-Click" Autorizado (Recomendado)

Abre tu emulador bash (Git Bash) posicionado en la raíz de este proyecto, y corre:
```bash
bash setup.sh
```

**Este comando autónomo realiza las siguientes tareas de fondo:**
1. Valida de manera obligatoria de que cuentes con el Engine de Docker operante.
2. Clona e inyecta los `environments` locales `.env.local`.
3. Anula instancias remanentes, construye imágenes en paralelo en modo Background (`-d --build`).
4. Revisa sistemáticamente el puerto local de Postgres hasta que devuelva señal afirmativa (`pg_isready`).
5. Desencadena asincrónicamente los comandos del CLI de TypeORM para ejecutar las *Migraciones* y estipular tus entidades iniciales en Postgres.

Para ver si surgen anomalías, puedes abrir la herramienta diagnóstica:
```bash
bash check-setup.sh
```

### ⚙️ Opción 2: Ejecución a Mano y Personalizada
Preferible si quieres usar `ts-node`, Angular Watchers o realizar debug sin red Docker. Toma en cuenta el tener Postgre corriendo expuesto en `5432`.

1. Replicar variables `.env.example` -> `.env.local` y agregar DB details.
2. Servidor Backend (`http://localhost:3000/api`):
   ```bash
   cd backend && npm install
   npm run migration:run
   npm run start:dev
   ```
3. Angular Dev Server (`http://localhost:4200`):
   ```bash
   cd frontend && npm install
   npm start
   ```

---

## 📂 Organización de Repositorio Monorepo

```text
├── .github/workflows/       # (CI Pipeline) Validaciones automatizadas de Github 
├── backend/                 # Backend API (NestJS)
│   ├── src/
│   │   ├── auth/            # Auth, JWT Strategies, Property Testing de fast-check (.spec)
│   │   ├── users/           # Manejo Roles de Usuario
│   │   ├── mail/            # Mock Service para Mails/Resets de Cuenta
│   │   └── database/        # Data-source conf + Migrations
│   └── Dockerfile           # Stage 1: Build NestJS -> Stage 2: Producción Alpine
├── frontend/                # Aplicación Web Embebida (Angular 17)
│   ├── src/
│   │   └── app/             # Rutas por Dominios (Cart, Checkout, Admin, Auth)
│   ├── nginx.conf           # Balanceador de tráfico y servidor de assets NGINX
│   └── Dockerfile           # Stage 1: Build Angular -> Stage 2: Producción NGINX
├── docker-compose.yml       # Orquestación de infraestructura global.
├── setup.sh                 # Entrypoint rápido automatizado
├── check-setup.sh           # Utilidad de escaneo de compatibilidades de requerimientos
└── push-to-github.sh        # Utilidad CLI para pushear repos sin pasos adicionales de curl
```

---

## 🔍 Interacción Continua y CI

Al estar este proyecto emparejado con un pipeline activo de GitHub (`ci.yml`), cada vez que efectúes un `git push` a `origin main`, GitHub creará Instancias Virtuales tipo Ubuntu y verificará la salud íntegra del repositorio. Si tu código rompe los linters o falla pruebas, se denegará en la bandera de estado de GitHub repotando por error en el Action Logs.
