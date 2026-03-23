# Documento de Requisitos

## Introducción

Vivero Online es una aplicación web de comercio electrónico especializada en la venta de plantas. Permite a los usuarios explorar un catálogo de plantas, obtener información detallada de cada especie, gestionar un carrito de compras y completar pedidos. Los administradores pueden gestionar el inventario, los pedidos y el catálogo de productos.

## Glosario

- **Sistema**: La aplicación web del vivero online en su conjunto.
- **Catálogo**: Colección de plantas disponibles para la venta, con sus datos y disponibilidad.
- **Planta**: Producto vegetal disponible en el vivero, con nombre, descripción, precio, stock y categoría.
- **Usuario**: Persona registrada en el sistema que puede realizar compras.
- **Visitante**: Persona no autenticada que navega el catálogo.
- **Carrito**: Contenedor temporal de plantas seleccionadas por un Usuario antes de confirmar el pedido.
- **Pedido**: Solicitud de compra confirmada por un Usuario, con estado de seguimiento.
- **Administrador**: Usuario con permisos para gestionar el catálogo, inventario y pedidos.
- **Categoría**: Clasificación de plantas (ej. interior, exterior, suculentas, árboles frutales).
- **Stock**: Cantidad de unidades disponibles de una Planta en el inventario.

---

## Requisitos

### Requisito 1: Catálogo de Plantas

**User Story:** Como Visitante, quiero explorar el catálogo de plantas disponibles, para encontrar plantas de mi interés y conocer sus características.

#### Criterios de Aceptación

1. THE Sistema SHALL mostrar el Catálogo de plantas con nombre, imagen, precio y disponibilidad de cada Planta.
2. WHEN un Visitante selecciona una Planta, THE Sistema SHALL mostrar la ficha detallada con nombre, descripción, cuidados, precio, Categoría y Stock disponible.
3. WHEN un Visitante aplica un filtro por Categoría, THE Sistema SHALL mostrar únicamente las Plantas pertenecientes a esa Categoría.
4. WHEN un Visitante introduce un término de búsqueda, THE Sistema SHALL mostrar las Plantas cuyo nombre o descripción contengan dicho término.
5. WHILE el Stock de una Planta es 0, THE Sistema SHALL mostrar la Planta como "Agotada" e impedir su adición al Carrito.

---

### Requisito 2: Registro e Inicio de Sesión

**User Story:** Como Visitante, quiero registrarme e iniciar sesión, para poder realizar compras y hacer seguimiento de mis pedidos.

#### Criterios de Aceptación

1. WHEN un Visitante envía un formulario de registro con email y contraseña válidos, THE Sistema SHALL crear una cuenta de Usuario y enviar un email de confirmación.
2. WHEN un Visitante envía un formulario de registro con un email ya registrado, THE Sistema SHALL mostrar un mensaje de error indicando que el email ya está en uso.
3. WHEN un Usuario envía credenciales correctas, THE Sistema SHALL iniciar la sesión y redirigir al Usuario a la página principal.
4. IF un Usuario envía credenciales incorrectas, THEN THE Sistema SHALL mostrar un mensaje de error genérico sin revelar qué campo es incorrecto.
5. WHEN un Usuario solicita recuperación de contraseña con un email registrado, THE Sistema SHALL enviar un enlace de restablecimiento con validez de 60 minutos.
6. IF el enlace de restablecimiento de contraseña ha expirado, THEN THE Sistema SHALL informar al Usuario y ofrecer la opción de solicitar un nuevo enlace.

---

### Requisito 3: Carrito de Compras

**User Story:** Como Usuario, quiero gestionar un carrito de compras, para seleccionar plantas y revisar mi pedido antes de pagar.

#### Criterios de Aceptación

1. WHEN un Usuario añade una Planta al Carrito, THE Sistema SHALL incrementar la cantidad de esa Planta en el Carrito en una unidad.
2. WHEN un Usuario modifica la cantidad de una Planta en el Carrito, THE Sistema SHALL actualizar el subtotal del Carrito de forma inmediata.
3. WHEN un Usuario elimina una Planta del Carrito, THE Sistema SHALL remover esa Planta y recalcular el total del Carrito.
4. THE Sistema SHALL mostrar en el Carrito el precio unitario, cantidad, subtotal por Planta y total general incluyendo impuestos.
5. IF la cantidad solicitada de una Planta supera el Stock disponible, THEN THE Sistema SHALL limitar la cantidad al Stock disponible e informar al Usuario.
6. WHILE el Carrito está vacío, THE Sistema SHALL mostrar un mensaje indicando que no hay plantas seleccionadas y un enlace al Catálogo.

---

### Requisito 4: Proceso de Compra (Checkout)

**User Story:** Como Usuario, quiero completar la compra de las plantas en mi carrito, para recibirlas en mi domicilio.

#### Criterios de Aceptación

1. WHEN un Usuario inicia el proceso de compra, THE Sistema SHALL solicitar dirección de entrega y método de pago.
2. WHEN un Usuario confirma un Pedido con datos válidos, THE Sistema SHALL crear el Pedido, reducir el Stock de cada Planta comprada y enviar un email de confirmación al Usuario.
3. IF el pago es rechazado por el proveedor de pagos, THEN THE Sistema SHALL informar al Usuario con un mensaje descriptivo y mantener el Carrito intacto.
4. WHEN un Pedido es confirmado, THE Sistema SHALL asignar al Pedido un identificador único y un estado inicial de "Pendiente".
5. IF el Stock de una Planta se agota entre el momento en que el Usuario la añadió al Carrito y la confirmación del Pedido, THEN THE Sistema SHALL notificar al Usuario y solicitar que actualice el Carrito.

---

### Requisito 5: Seguimiento de Pedidos

**User Story:** Como Usuario, quiero consultar el estado de mis pedidos, para saber cuándo recibiré mis plantas.

#### Criterios de Aceptación

1. WHEN un Usuario accede a su historial de pedidos, THE Sistema SHALL mostrar todos los Pedidos del Usuario ordenados por fecha de creación descendente.
2. WHEN un Usuario selecciona un Pedido, THE Sistema SHALL mostrar el detalle con plantas compradas, cantidades, precios, dirección de entrega y estado actual.
3. WHEN el estado de un Pedido cambia, THE Sistema SHALL enviar una notificación por email al Usuario con el nuevo estado.
4. THE Sistema SHALL soportar los siguientes estados de Pedido: "Pendiente", "Confirmado", "En preparación", "Enviado" y "Entregado".

---

### Requisito 6: Gestión de Inventario (Administrador)

**User Story:** Como Administrador, quiero gestionar el catálogo e inventario de plantas, para mantener la información actualizada y el Stock controlado.

#### Criterios de Aceptación

1. WHEN un Administrador crea una Planta con datos válidos (nombre, descripción, precio, categoría, stock e imagen), THE Sistema SHALL añadir la Planta al Catálogo y hacerla visible en la tienda.
2. WHEN un Administrador actualiza el precio o Stock de una Planta, THE Sistema SHALL reflejar los cambios en el Catálogo de forma inmediata.
3. WHEN un Administrador elimina una Planta del Catálogo, THE Sistema SHALL marcarla como inactiva y ocultarla del Catálogo sin eliminar el historial de Pedidos que la contengan.
4. IF un Administrador intenta establecer un Stock negativo, THEN THE Sistema SHALL rechazar la operación y mostrar un mensaje de error.
5. THE Sistema SHALL permitir al Administrador gestionar las Categorías de plantas (crear, renombrar y desactivar).

---

### Requisito 7: Gestión de Pedidos (Administrador)

**User Story:** Como Administrador, quiero gestionar los pedidos recibidos, para coordinar la preparación y el envío de las plantas.

#### Criterios de Aceptación

1. WHEN un Administrador accede al panel de pedidos, THE Sistema SHALL mostrar todos los Pedidos ordenados por fecha de creación descendente, con filtros por estado.
2. WHEN un Administrador actualiza el estado de un Pedido, THE Sistema SHALL registrar el cambio con marca de tiempo y notificar al Usuario por email.
3. IF un Administrador intenta asignar un estado inválido a un Pedido, THEN THE Sistema SHALL rechazar la operación y mostrar los estados válidos disponibles.

---

### Requisito 8: Seguridad y Acceso

**User Story:** Como sistema, quiero controlar el acceso a las funcionalidades según el rol del usuario, para proteger los datos y las operaciones sensibles.

#### Criterios de Aceptación

1. WHILE un Visitante no ha iniciado sesión, THE Sistema SHALL restringir el acceso al Carrito, al proceso de compra y al historial de Pedidos.
2. WHILE un Usuario autenticado no tiene rol de Administrador, THE Sistema SHALL restringir el acceso al panel de administración.
3. THE Sistema SHALL almacenar las contraseñas de los Usuarios usando un algoritmo de hash con sal (bcrypt o equivalente).
4. WHEN una sesión de Usuario permanece inactiva durante 30 minutos, THE Sistema SHALL cerrar la sesión automáticamente.
5. THE Sistema SHALL servir todas las comunicaciones a través de HTTPS.
