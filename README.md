# VirtualPhysio

Sistema de gestión de fichas clínicas para fisioterapeutas.

## Estructura del Proyecto

```
VirtualPhysio/
├── backend/           # Servidor Node.js con Express
│   ├── src/          # Código fuente del backend
│   ├── prisma/       # Esquemas y migraciones de Prisma
│   └── package.json  # Dependencias del backend
└── frontend/         # Aplicación React
    ├── src/         # Código fuente del frontend
    └── package.json # Dependencias del frontend
```

## Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## Configuración

### Backend

1. Navega al directorio backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configura las variables de entorno en el archivo `.env`

5. Ejecuta las migraciones de la base de datos:
   ```bash
   npx prisma migrate dev
   ```

6. Inicia el servidor:
   ```bash
   npm run dev
   ```

### Frontend

1. Navega al directorio frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Características

- Gestión de pacientes
- Fichas clínicas digitales
- Sincronización offline
- Interfaz moderna y responsiva
- Validación de datos
- Manejo de errores robusto

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Zod (validación)

### Frontend
- React
- Material-UI
- PropTypes
- React Router

## Licencia

MIT 