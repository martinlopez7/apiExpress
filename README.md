# Notes App

Una aplicación moderna de notas que permite a los usuarios crear, gestionar y organizar sus notas de manera eficiente y segura.

## 🚀 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución para JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** con Mongoose - Base de datos NoSQL y ODM
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Middleware para habilitar Cross-Origin Resource Sharing
- **dotenv** - Gestión de variables de entorno

## 🛠️ Requisitos Previos

- Node.js (versión 14 o superior)
- MongoDB instalado y en ejecución (opcional)
- npm como gestor de paquetes

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone [URL del repositorio]
cd apiExpress
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
MONGODB_URI=tu_connectionString_de_mongodb
JWT_SECRET=tu_clave_secreta
PORT=3000
```

> **Nota sobre JWT_SECRET**: 
> - Longitud mínima recomendada: 32 caracteres
> - Debe ser única y difícil de adivinar
> - No usar palabras del diccionario
> - No compartir ni exponer este valor
> - En producción, se recomienda usar un generador de claves seguras
> - Se recomienda usar una combinación de letras (mayúsculas y minúsculas), números y caracteres especiales.

> **Nota sobre MONGODB_URI**: 
> - Si tienes MongoDB instalado utiliza tu connection string local
> - Si no tienes MongoDB instalado, hay una base de datos de Atlas, simplemente pega esto para conectarte a ella: *mongodb+srv://usuario:6MNFAlyToeGgXDa5@cluster0.hnykk.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0*


## 🚀 Ejecución

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

Navegar a: localhost:3000

## 📝 Características

- Autenticación de usuarios
- CRUD completo de notas
- Organización por categorías
- API RESTful
- Seguridad mediante JWT
- Encriptación de datos sensibles

## 🔐 Endpoints de la API

### Autenticación
- POST /api/auth/register - Registro de usuarios
- POST /api/auth/login - Inicio de sesión

### Notas
- GET /api/notes - Obtener todas las notas
- POST /api/notes - Crear nueva nota
- GET /api/notes/:id - Obtener nota específica
- PUT /api/notes/:id - Actualizar nota
- DELETE /api/notes/:id - Eliminar nota

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📄 Licencia

ISC
