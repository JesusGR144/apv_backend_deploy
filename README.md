# API Backend - APV (Veterinaria)

Este README documenta el backend del proyecto APV (Administración de Pacientes de Veterinaria).
Contiene descripción del stack, arquitectura, rutas principales, modelos, variables de entorno y recomendaciones para desarrollo y producción.

## Resumen
Una API REST construida con Node.js y Express que gestiona veterinarios y sus pacientes. Implementa autenticación con JWT, almacenamiento en MongoDB mediante Mongoose y envío de emails para confirmación y recuperación de contraseña (Mailtrap en desarrollo y Resend en producción).

## Tecnologías y librerías principales
- Node.js (ES Modules)
- Express (v5)
- MongoDB
- Mongoose (ODM)
- bcrypt (hash de contraseñas)
- jsonwebtoken (JWT)
- dotenv (variables de entorno)
- nodemon (devDependency)

Opcional/Integración de correo
- Mailtrap (entorno de desarrollo)
- Resend (entorno de producción)

## Estructura del proyecto (carpeta `backend/`)
- `index.js` - punto de entrada del servidor; configura Express, carga variables de entorno y conecta a la base de datos.
- `config/db.js` - conexión a MongoDB con Mongoose.
- `models/` - definiciones de Mongoose:
  - `Veterinario.js` - modelo de usuario (nombre, email, password, token, confirmado, etc.).
  - `Paciente.js` - modelo de paciente (nombre, propietario, email, fecha, sintomas, veterinario).
- `controllers/` - controladores con la lógica de negocio:
  - `veterinarioController.js` - registro, confirmación, login, recuperación de password, perfil.
  - `pacienteController.js` - CRUD de pacientes (agregar, obtener, actualizar, eliminar).
- `routes/` - definición de rutas Express y protección con middleware:
  - `veterinarioRoutes.js` - rutas públicas y protegidas para veterinarios.
  - `pacienteRoutes.js` - rutas protegidas para pacientes.
- `middleware/` - middlewares:
  - `authMiddleware.js` - verifica JWT y añade `req.veterinario`.
- `helpers/` - utilidades:
  - `generarId.js` - genera token aleatorio (confirmación/recuperación).
  - `generarJWT.js` - wrapper para firmar JWT.
  - `emailRegistro.js`, `emailOlvidePassword.js` - helpers para enviar correos (integración con Mailtrap/Resend según entorno).

## Arquitectura y patrones
- Patrón MVC (Model - Controller - Route): los modelos definen la forma de los datos (Mongoose), los controladores implementan la lógica y las rutas exponen los endpoints.
- Autenticación: JWT (stateless). El usuario recibe un token firmado al autenticarse.
- Seguridad de contraseñas: bcrypt para hashear antes de guardar (hook pre-save en el modelo `Veterinario`).

## Rutas principales (endpoints)
Base: `/api/veterinarios` (para acciones de usuario) y `/api/pacientes` (para pacientes, protegidas)

Veterinarios (ejemplos):
- POST `/api/veterinarios` - registrar nuevo veterinario. Body: { nombre, email, password, telefono?, web? }
- GET `/api/veterinarios/confirmar/:token` - confirmar cuenta mediante token de registro
- POST `/api/veterinarios/login` - autenticar. Body: { email, password } → Response: { token }
- POST `/api/veterinarios/olvide-password` - solicitar cambio de password (genera token y envía email)
- GET/POST `/api/veterinarios/olvide-password/:token` - comprobar token / establecer nuevo password
- GET `/api/veterinarios/perfil` - obtener perfil (ruta protegida, requiere Authorization: Bearer <token>)

Pacientes (protegidas):
- POST `/api/pacientes` - crear paciente. Body: { nombre, propietario, email, fecha, sintomas }
- GET `/api/pacientes` - obtener pacientes del veterinario autenticado
- GET `/api/pacientes/:id` - obtener un paciente por id (verifica propietario)
- PUT `/api/pacientes/:id` - actualizar paciente
- DELETE `/api/pacientes/:id` - eliminar paciente

> Nota: las rutas exactas se encuentran en `routes/*.js`.

## Modelos (resumen)
- Veterinario
  - nombre: String
  - email: String (único)
  - password: String (hasheado con bcrypt)
  - telefono, web: String (opcionales)
  - token: String (para confirmación/recuperación)
  - confirmado: Boolean

- Paciente
  - nombre, propietario, email, sintomas: String
  - fecha: Date (por defecto Date.now)
  - veterinario: ObjectId (ref: 'Veterinario')

## Variables de entorno (usar `.env`, no subirlas al repo)
No incluyas tus valores reales en el repo. Crea un `.env` en `backend/` con al menos las siguientes variables:

- MONGO_URI=...    # cadena de conexión a MongoDB
- JWT_SECRET=...   # secreto para firmar JWT
- PORT=4000        # opcional

Variables relacionadas con emails (dependen del proveedor que uses):
- MAILTRAP_USER / MAILTRAP_PASS (ej. para Mailtrap en desarrollo)
- RESEND_API_KEY (ej. para usar Resend en producción)

## Emails: Mailtrap (dev) y Resend (prod)
- Desarrollo: se recomienda usar Mailtrap para capturar correos enviados desde la app sin enviarlos a usuarios reales. Configura las credenciales en variables de entorno y usa la configuración SMTP en `helpers/email*.js`.
- Producción: Resend (u otro proveedor) para el envío real. Guarda la API key en `RESEND_API_KEY` y cambia la integración en `helpers` según el proveedor.

## Seguridad y recomendaciones
- No guardes secrets en el repositorio. Usa `.env` y un `.env.example` sin valores reales.
- Añadir CORS si el frontend se sirve desde otro origen (ej. `app.use(cors())`).
- Usar helmet y rate-limiter en producción.
- Validar inputs (express-validator o Zod) para endpoints públicos (registro, login, reset password, creación de paciente).

## Ejecutar localmente (desarrollo)
1. Ir a la carpeta `backend`:
```bash
cd backend
```
2. Instalar dependencias:
```bash
npm install
```
3. Crear `.env` con las variables mínimas (MONGO_URI, JWT_SECRET)
4. Ejecutar en modo desarrollo (nodemon):
```bash
npm run dev
```

## Ejemplos de uso (curl)
```bash
curl -X POST http://localhost:4000/api/veterinarios -H "Content-Type: application/json" -d '{"nombre":"Juan","email":"a@b.com","password":"123456"}'
```
```bash
curl -X POST http://localhost:4000/api/veterinarios/login -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"123456"}'
```
```bash
curl -X POST http://localhost:4000/api/pacientes -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nombre":"Rex","propietario":"Juan","email":"j@d.com","fecha":"2025-10-09","sintomas":"Nada"}'
```

## Tests y próximos pasos

Archivos incluidos en este repositorio:

- `.env.example` - ejemplo de variables de entorno necesarias (sin valores). Revisa y copia a `.env` para configurar tu entorno local.
- `postman_collection.json` - colección de Postman con ejemplos de peticiones (registro, login, perfil, crear paciente).
