# 🧾 Portal de Productos — Práctica 1

## 👨‍💻 Datos del alumno
**Nombre:** Sergio Moreno  
**Asignatura:** Programación Web

---

## 🎯 Objetivo de la práctica

Desarrollar una aplicación web completa (**frontend + backend**) que permita:

- Autenticación de usuarios mediante **JWT**.  
- Gestión de roles (`admin` y `user`).  
- CRUD completo de productos con persistencia en **MongoDB**.  
- Un **chat en tiempo real** con **Socket.IO**.

Además, se añadieron mejoras opcionales para ampliar la calificación:

1. **Persistencia del historial del chat** en la base de datos.  
2. **Subida de imágenes** en productos.  
3. **Envío de imágenes en el chat**.

---

## ⚙️ Instalación y ejecución

### 📋 Requisitos previos
- [Node.js 18+](https://nodejs.org/en/)  
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) ejecutándose en local (puerto 27017 por defecto)

### 🧰 Instalación

```bash
# 1. Clonar el repositorio o descomprimir la carpeta
cd portal-productos

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm run dev
# o
npm start

🌐 Acceso

Una vez iniciado el servidor, abrir en el navegador:
👉 http://localhost:3000

⸻

🔑 Configuración del entorno

Crear un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=3000
MONGO_URI=mongodb://localhost:27017/portal
JWT_SECRET=clave-ultrasecreta
JWT_EXPIRES=2h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
ALLOW_ADMIN_REGISTER=true

Al arrancar, el sistema crea automáticamente un usuario administrador con las credenciales admin / admin.

⸻

🧩 Estructura del proyecto

src/
 ├── models/
 │   ├── User.js
 │   ├── Product.js
 │   └── ChatMessage.js
 ├── routes/
 │   ├── authRoutes.js
 │   └── productRoutes.js
 ├── middleware/
 │   └── authenticateJWT.js
 ├── public/
 │   ├── index.html       ← Portal de productos
 │   ├── chat.html        ← Chat en tiempo real
 │   ├── client.js        ← Lógica del frontend
 │   └── styles.css       ← Tema oscuro y diseño visual
 ├── config.js
 └── server.js
.env


⸻

🧪 Cómo ejecutar y probar la aplicación

🟩 1. Registro y login
	1.	Accede a http://localhost:3000.
	2.	Regístrate con un nuevo usuario o entra como admin (admin/admin).
	3.	Tras iniciar sesión, se genera un token JWT almacenado en localStorage.
	4.	El rol del usuario aparece en la parte superior derecha.

⸻

🟦 2. Gestión de productos (CRUD)
	•	User: puede ver los productos existentes.
	•	Admin: puede crear, editar y eliminar productos.
	•	Cada producto puede incluir una imagen al crearlo o editarlo.
	•	Las imágenes se guardan en /uploads/ dentro de src/public y se sirven directamente al cliente.

Pasos para probar:
	1.	Inicia sesión como admin.
	2.	Usa el botón “Nuevo” para añadir un producto.
	3.	Pulsa “Editar” para modificar los datos o cambiar la imagen.
	4.	Pulsa “Eliminar” para borrarlo.
	5.	Los cambios se reflejan instantáneamente en la lista.

⸻

💬 3. Chat en tiempo real
	•	Acceso mediante el botón “Chat” en la barra superior.
	•	Solo usuarios autenticados pueden entrar (el servidor valida el JWT).
	•	Funcionalidades implementadas:
	•	Mensajes con nombre, color, hora y texto.
	•	Indicador de usuarios conectados.
	•	Eventos de entrada y salida (🟢 / 🔴).
	•	Estado “escribiendo…” visible en tiempo real.
	•	Sonido y animación al recibir nuevos mensajes.
	•	Envío de imágenes con el icono 📎.
	•	Carga de los últimos 20 mensajes guardados en MongoDB.

Cómo probar:
	1.	Abre dos navegadores diferentes y conéctate con distintos usuarios.
	2.	Envía mensajes o imágenes.
	3.	Observa los eventos de “usuario escribiendo”, el contador y el historial persistente.

⸻

🗃️ Persistencia de datos
	•	Usuarios: se almacenan con bcryptjs (hash de contraseñas).
	•	Productos: colección products en MongoDB.
	•	Mensajes del chat: colección chatmessages con campos user, text, image y timestamp.
	•	Todo permanece tras reiniciar el servidor.

⸻

🧱 Decisiones de desarrollo

🔧 Arquitectura modular

El proyecto sigue una estructura MVC simplificada:
	•	models/: define los esquemas de datos de MongoDB.
	•	routes/: gestiona las rutas REST.
	•	middleware/: contiene la lógica de autenticación y roles.
	•	public/: contiene el frontend servido desde Express.
	•	server.js: punto de entrada que configura Express, Socket.IO y la conexión a Mongo.

🔐 Autenticación JWT
	•	Los tokens se generan con jsonwebtoken y se validan tanto en las rutas REST como en los sockets.
	•	Cada token incluye _id, username, role y color.
	•	Los middlewares authenticateJWT y authorizeRole garantizan la seguridad.

🧠 Gestión de roles
	•	user: acceso de solo lectura (visualización de productos y chat).
	•	admin: acceso total al CRUD.
	•	Se usa un middleware para validar el rol antes de ejecutar cada acción protegida.

💾 Persistencia y subida de imágenes
	•	Multer maneja la subida de archivos.
	•	Las imágenes se guardan en src/public/uploads/ con un nombre único.
	•	Validación del tipo MIME y tamaño máximo de 2 MB.
	•	Los productos y los mensajes del chat almacenan la ruta de la imagen en MongoDB.

⚙️ Chat persistente con Socket.IO
	•	Los mensajes (texto o imagen) se guardan en la base de datos al enviarse.
	•	Al conectarse un usuario, recibe los últimos 20 mensajes guardados.
	•	Los eventos del socket (connection, disconnect, typing, chat message) mantienen la sincronización en tiempo real.

🎨 Interfaz de usuario
	•	Tema oscuro moderno con colores suaves y esquinas redondeadas.
	•	Interfaz responsive: funciona tanto en ordenador como en móvil.
	•	Animaciones de hover, zoom en imágenes y sombras.
	•	Se priorizó la claridad visual y la usabilidad.

⸻

📦 Dependencias principales

Paquete	Uso principal
express	Servidor web y gestión de rutas
mongoose	Conexión y modelado de datos en MongoDB
jsonwebtoken	Generación y validación de tokens JWT
bcryptjs	Encriptación de contraseñas
socket.io	Comunicación en tiempo real
multer	Subida y gestión de archivos
cors	Permitir peticiones desde el frontend
morgan	Logging de peticiones HTTP


⸻

🧰 Ampliaciones implementadas (extras)

Extra	Descripción	Estado
🗂️ Historial de chat persistente	Guarda mensajes en MongoDB y los carga al conectarse un usuario	✅
🖼️ Imágenes en productos	Subida y visualización en CRUD	✅
📎 Imágenes en el chat	Envío y visualización de fotos en tiempo real	✅
🔔 Sonido y animaciones	Mejora de la experiencia de usuario	✅


⸻

📈 Conclusión

El proyecto cumple todos los requisitos del enunciado y añade tres ampliaciones opcionales.
Durante el desarrollo se aplicaron principios de modularidad, reutilización y separación de responsabilidades.
El resultado es una aplicación completa, funcional y extensible, con integración total entre backend y frontend, y preparada para desplegarse en un entorno real.
