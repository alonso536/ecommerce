# Ecommerce - Entrega Final

## Alonso Díaz

- Ejecute `npm install` para inicializar los modulos de node
- Ejecute `npm start` para ejecutar la aplicación

### Ruta de la documentación

- `/docs`

### Rutas de autenticación

- `/login`, pide las credenciales al usuario, si hay una sesión activa redirige a `/profile`
- `/register`, muestra un formulario para registrar usuarios en la base de datos, si hay una sesión activa redirige a `/profile`

### Rutas globales

- `/products`, muestra los productos con paginación, si no hay una sesión activa redirige a `/login`
- `/profile`, muestra los datos del usuario, excepto la contraseña, si no hay una sesión activa redirige a `/login`

### Rutas del administrador

- `/add`, muestra un formulario para agregar productos
- `/edit?id=:pid`, muestra un formulario para editar los productos, viene con los datos seteados

### Rutas del usuario

- `/cart`, muestra los productos agregados al carrito
- `/chat`, pagina del chat con websockets

## Credenciales del admin

- Email: admin@admin.com
- Contraseña: admin
