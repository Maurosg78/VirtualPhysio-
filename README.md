# VirtualPhysio

Sistema de gestión de fisioterapia virtual que incluye asistente virtual inteligente y gestión de exámenes médicos.

## Características

- Asistente virtual inteligente para la evaluación de pacientes
- Gestión de exámenes médicos (subida y visualización)
- Interfaz moderna y responsiva
- Sistema de validación de datos
- Gestión de historias clínicas

## Tecnologías Utilizadas

### Frontend
- React
- Material-UI
- Vite
- Context API

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/VirtualPhysio.git
cd VirtualPhysio
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la carpeta `backend` con las siguientes variables:
   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/virtualphysio"
   PORT=3001
   ```

5. Inicializar la base de datos:
```bash
cd backend
npx prisma migrate dev
```

## Ejecución

1. Iniciar el servidor backend:
```bash
cd backend
npm run dev
```

2. Iniciar el servidor frontend:
```bash
cd frontend
npm run dev
```

3. Acceder a la aplicación:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Estructura del Proyecto

```
VirtualPhysio/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   └── uploads/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   └── utils/
    └── public/
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 