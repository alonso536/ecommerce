# Ecommerce - Desafio: Mocking y manejo de errores

## Alonso Díaz

-   Ejecute `npm install` para inicializar los modulos de node
-   Ejecute `npm start` para ejecutar la aplicación

## Todos los errores son manejados por express-validator

## Rutas de la aplicación

### Ruta de mock de productos

-   `localhost:8080/api/mock/mockingproducts`, muestra 100 productos generados con faker.js

### Rutas de autenticación

-   `localhost:8080/login`, pide las credenciales al usuario, si hay una sesión activa redirige a `/profile`
-   `localhost:8080/register`, muestra un formulario para registrar usuarios en la base de datos, si hay una sesión activa redirige a `/profile`

### Rutas globales

-   `localhost:8080/products`, muestra los productos con paginación, si no hay una sesión activa redirige a `/login`
-   `localhost:8080/profile`, muestra los datos del usuario, excepto la contraseña, si no hay una sesión activa redirige a `/login`

### Rutas del administrador

-   `localhost:8080/add`, muestra un formulario para agregar productos
-   `localhost:8080/edit?id=:pid`, muestra un formulario para editar los productos, viene con los datos seteados

### Rutas del usuario

-   `localhost:8080/cart`, muestra los productos agregados al carrito
-   `localhost:8080/chat`, pagina del chat con websockets

### Rutas para subir las imagenes

-   Subir imágenes: POST `/api/products/img/:pid`, se puede agregar más de una imagen
-   Ver imagen: GET `/api/products/img/:pid`, solo muestra la primera imagen

### Rutas para enviar email

-   Enviar email: GET `/api/mail`, se debe agregar el to, el subject y el body dentro del req.body

## Credenciales del admin

-   Email: admin@admin.com
-   Contraseña: admin
