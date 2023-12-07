# Ecommerce - Desafío complementario: Cuarta practica integradora

## Alonso Díaz

- Ejecute `npm install` para inicializar los modulos de node
- Ejecute `npm start` para ejecutar la aplicación
- Cambie la propiedad del archivo .env `NODE_ENV='prod'` para ejecutar la aplicación en modo producción
- Cambie la propiedad del archivo .env `NODE_ENV='dev'` para ejecutar la aplicación en modo desarrollo
- Si quiere probar el sistema de recuperación de contraseña, asegurese de estar de acceder desde la misma máquina donde está ejecuntando la aplicación, y de usar un correo real.

### Ruta de la documentación

- `localhost:8080/docs`

### Ruta para probar los logs

- `localhost:8080/api/util/loggerTest`, los logs se ven en la consola

### Ruta de mock de productos

- `localhost:8080/api/util/mockingproducts`, muestra 100 productos generados con faker.js

### Rutas de autenticación

- `localhost:8080/login`, pide las credenciales al usuario, si hay una sesión activa redirige a `/profile`
- `localhost:8080/register`, muestra un formulario para registrar usuarios en la base de datos, si hay una sesión activa redirige a `/profile`

### Rutas globales

- `localhost:8080/products`, muestra los productos con paginación, si no hay una sesión activa redirige a `/login`
- `localhost:8080/profile`, muestra los datos del usuario, excepto la contraseña, si no hay una sesión activa redirige a `/login`

### Rutas del administrador

- `localhost:8080/add`, muestra un formulario para agregar productos
- `localhost:8080/edit?id=:pid`, muestra un formulario para editar los productos, viene con los datos seteados

### Rutas del usuario

- `localhost:8080/cart`, muestra los productos agregados al carrito
- `localhost:8080/chat`, pagina del chat con websockets

### Rutas para crear usuarios premium

- Agregar usuario premium: PATCH `localhost:8080/api/users/premium/:id`, debe hacerlo con las credenciales de admin, si el usuario ya es premium lo cambia a usuario normal, si el usuario no ha subido los documentos no podrá ser premium.
- Eliminar usuario: DELETE `localhost:8080/api/users/:id`, ruta para borrar el usuario (por si quiere borrarlo luego de probar la recuperación de contraseña)

### Rutas para subir las imagenes

- Subir imágenes: POST `/api/products/img/:pid`, se puede agregar más de una imagen
- Ver imagen: GET `/api/products/img/:pid`, solo muestra la primera imagen

### Rutas para enviar email

- Enviar email: POST `/api/mail`, se debe agregar el to, el subject y el body dentro del req.body

### Ruta para subir los documentos

- Subir documentos: POST `localhost:8080/api/users/:id/documents`, se deben subir todos de una vez

## Credenciales del admin

- Email: admin@admin.com
- Contraseña: admin
