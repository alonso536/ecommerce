# Ecommerce - Segunda Pre Entrega

### Alonso Díaz

-   Ejecute `npm install` para inicializar los modulos de node
-   Ejecute `npm start` para ejecutar la aplicación

### Rutas para subir las imagenes

-   Subir imágenes: POST `/api/products/img/:pid`, se puede agregar más de una imagen
-   Ver imagen: GET `/api/products/img/:pid`, solo muestra la primera imagen

### Rutas para el chat con websocket

-   `localhost:8080/login`, pide un nombre de usuario para acceder al chat
-   `localhost:8080/chat`, escriba un mensaje y aparecerá

### Rutas para los productos y el carrito

-   `localhost:8080/products`
-   `localhost:8080/carts/:idcart`
