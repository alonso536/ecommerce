# Ecommerce - Implementación de arquitectura por capas

### Alonso Díaz

-   Ejecute `npm install` para inicializar los modulos de node
-   Ejecute `npm start` para ejecutar la aplicación

### Rutas de la aplicación

-   `localhost:8080/login`, pide las credenciales al usuario, si hay una sesión activa redirige a `/profile`
-   `localhost:8080/register`, muestra un formulario para registrar usuarios en la base de datos, si hay una sesión activa redirige a `/profile`
-   `localhost:8080/products`, muestra los productos con paginación, si no hay una sesión activa redirige a `/login`
-   `localhost:8080/profile`, muestra los datos del usuario, excepto la contraseña, si no hay una sesión activa redirige a `/login`
-   `localhost:8080/cart` muestra los productos agregados al carrito
-   `localhost:8080/chat`, pagina del chat con websockets (No ingresar a esta ruta)

### Rutas para subir las imagenes

-   Subir imágenes: POST `/api/products/img/:pid`, se puede agregar más de una imagen
-   Ver imagen: GET `/api/products/img/:pid`, solo muestra la primera imagen
