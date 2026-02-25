# Electiva III - PWA  

## TALLER – CONCEPTOS FUNDAMENTALES DE PWA – PROMISES - PARTE 2  

### Integrantes

- **Cristian Andrés Basto Largo** - 202010495  
- **Brayan Fabian Borda Quemba** - 201920241  
- **Karina Lucero Alfonso Valderrama** - 202022694  

---

## Actividades  

En grupos de 3 integrantes realice las siguientes actividades a partir de la aplicación “PWA Coffee Shop” disponible en la sesión 5 del aula virtual, una vez revise el código para entender su funcionamiento modifique el código para adicionar las siguientes funcionalidades por medio de promesas:

---

### 1. La funcionalidad que permita ver la lista de productos existente en la cafetería incluyendo el precio por cada uno de ellos de acuerdo al tamaño. Debe permitir manejar la confirmación o rechazo de la operación.

---

Para este punto, primero se debe:

Modificar el array `Coffees` que está en el archivo `app.js` y añadir los precios correspondientes a cada tamaño.

<img width="655" height="865" alt="Captura de pantalla 2026-02-23 170632" src="https://github.com/user-attachments/assets/68c6a463-9009-43cc-a2a7-35694f48089e" />

Ahora en el archivo order.html se añade la sección para la visualización del precio dinámico (que irá cambiando según el tamaño seleccionado del café). 

<img width="548" height="128" alt="Captura de pantalla 2026-02-24 180127" src="https://github.com/user-attachments/assets/299f20da-4649-4e43-a2a4-058f1724d112" />
<img width="887" height="107" alt="Captura de pantalla 2026-02-24 180211" src="https://github.com/user-attachments/assets/36ba97eb-6a69-4e82-b038-228f8890b252" />

También se agregan los botones, en especifico el botón para rechazar o cancelar un pedido que va a funcionar como un retorno a la pantalla principal. 

A su vez también se cambio el archivo order.css para los estilos de dicha ventana quedando como resultado esto:

<img width="531" height="647" alt="Captura de pantalla 2026-02-24 180413" src="https://github.com/user-attachments/assets/aa305a46-6415-4431-aadb-b1f68e0e30a1" />

Ahora para agregar directamente dicha funcionalidad y poder visualizar todo lo anterior visto, es necesario modificar tanto las clases `app.js` como `apporder.js`. 
Se modificó la promesa en `app.js` de capturar la primera interacción del usuario con la app. 

<img width="850" height="440" alt="Captura de pantalla 2026-02-24 180618" src="https://github.com/user-attachments/assets/17290dd1-7821-4162-b4ee-e0bab5e08738" />

Básicamente asegura que se guarde el café seleccionado pero esta vez con todo y los datos de sus precios. 

En `apporder.js` se crea la promesa que obtendrá la información del café desde el localStorage

<img width="818" height="365" alt="Captura de pantalla 2026-02-24 181141" src="https://github.com/user-attachments/assets/a936e33d-1bcd-47a5-9c30-12566f618e08" />

A su vez, se crea la promesa que hará que cada vez que se seleccione el tamaño de la bebida me cambie o me actualice los precios de la misma.

<img width="825" height="417" alt="Captura de pantalla 2026-02-24 180853" src="https://github.com/user-attachments/assets/9c480a6a-6d5b-4cee-b8c9-6cb444199fe1" />

Calcula y muestra el precio según el tamaño y formatea con separadores en miles (estilo pesos colombianos). 

Hacemos un encadenamiento de promesas:

<img width="1077" height="687" alt="Captura de pantalla 2026-02-24 181244" src="https://github.com/user-attachments/assets/a7ee84f4-30e7-4062-b277-f1bf7f4a9cb9" />

Aquí carga el precio inicial al abrir la página o la ventana y actualiza dinámicamente cuando cambia de tamaño.

Añadimos el evento de rechazar la orden o la operación y nos retorne al menú principal.

<img width="802" height="176" alt="Captura de pantalla 2026-02-24 181607" src="https://github.com/user-attachments/assets/c456c71b-1fa6-43b5-8f22-75831013f064" />

Al final se añade el precio actual al formulario que será visto por el usuario.

<img width="679" height="258" alt="Captura de pantalla 2026-02-24 181719" src="https://github.com/user-attachments/assets/ad8d5f25-c0ca-4459-9748-0f12274724ef" />

Ahora verificamos con la herramienta de desarrollo los pedidos realizados y si los cambios se ven reflejados en el almacenamiento local. 

<img width="1158" height="937" alt="Captura de pantalla 2026-02-24 182604" src="https://github.com/user-attachments/assets/d0fa5f6d-34e8-459e-bdf2-454f816b30f6" />

---

### 2.	La funcionalidad que permita ver la lista de órdenes de productos actual. Debe permitir manejar la confirmación o rechazo de la operación.

--- 

Este punto va a funcionar como el carrito de compra. Aprovecharemos el item de “Órdenes: ” para convertirlo en un botón que me redirigirá al susodicho carrito de pedidos.  

Para esto fue necesario crear otro archivo html llamado `cart.html` y un archivo css para los estilos llamado `cart.css`.

<img width="504" height="95" alt="Captura de pantalla 2026-02-24 190957" src="https://github.com/user-attachments/assets/ac323eb9-9706-4a2e-a77a-a09f5cb717d1" />

Se cambió la etiqueta de Órdenes en el `index.html` para que sea un botón y me lleve a la ventana del carrito. Además en `style.css` se añadió un hover al botón de Órdenes para que se viera visualmente mejor.  

Al darle click a dicho botón me abre la ventana del carrito que se vería así:

<img width="1001" height="558" alt="Captura de pantalla 2026-02-24 191435" src="https://github.com/user-attachments/assets/d843b997-a186-4475-b035-c732cc4674b5" />

En la carpeta `js` creamos una nueva clase llamada `ordersCart.js` que se va a encargar de mostrarme todos los pedidos en el carrito. Funciona igual que `apporder.js` pero la diferencia radica que `apporder.js` trabaja los pedidos de forma individual, en cambio esta nueva clase será para mostrar absolutamente todos los productos pedidos.  

En esta clase `ordersCart.js` lo primero fue obviamente pedir todos los pedidos al `localStorage`.

<img width="752" height="464" alt="Captura de pantalla 2026-02-24 192223" src="https://github.com/user-attachments/assets/38dbc7a6-9f2a-453d-9d39-641b4d27e958" />

La segunda promesa realizada fue la de renderizar las órdenes en el DOM.

<img width="824" height="479" alt="Captura de pantalla 2026-02-24 192554" src="https://github.com/user-attachments/assets/15e256e6-b342-46fa-a77e-cc888affe627" />

Genera un html para cada tarjeta o item y lo inserta en el DOM. Resuelve devolviendo las órdenes para la siguiente promesa.

<img width="658" height="602" alt="Captura de pantalla 2026-02-24 192825" src="https://github.com/user-attachments/assets/caca0920-43ea-40ab-bd30-f8ebf5022471" />

La tercera promesa es el resumen total de los pedidos. Suma todos los precios y cuenta la cantidad total de órdenes.  

<img width="900" height="648" alt="Captura de pantalla 2026-02-24 192850" src="https://github.com/user-attachments/assets/0a3f43fb-b02d-49fe-9be2-a378effe922d" />

Mostramos tanto los botones de acción para confirmar o rechazar los pedidos y las promesas para cada uno, promesa para confirmar pedidos y otra en el caso de rechazar.  

<img width="764" height="719" alt="Captura de pantalla 2026-02-24 193414" src="https://github.com/user-attachments/assets/3f833531-b6b2-47e8-97a7-aac9e495b799" />

Ahora solo queda hacer un encadenamiento de promesas.

<img width="886" height="736" alt="Captura de pantalla 2026-02-24 193507" src="https://github.com/user-attachments/assets/327e4f73-161b-4080-93ab-d0876b2a030e" />

También se añaden los `eventListener` para los botones de confirmar o rechazar las operaciones los cuales abrirán un aviso emergente preguntando al usuario si está seguro de continuar con dicha operación, ya que eso reiniciará el contador.  

Básicamente lo que se tenía en el `localStorage`, `misOrdenesArray` ahora lo mostramos visualmente para el usuario. Quedando así con productos ya colocados:

<img width="807" height="938" alt="Captura de pantalla 2026-02-24 194023" src="https://github.com/user-attachments/assets/b823bcac-bcc7-49e6-b687-f2a717d0d3c5" />

---

### 3.	La funcionalidad que permita modificar una orden existente (tamaño del producto o si quiere azúcar o nó). Debe permitir manejar la confirmación o rechazo de la operación.

---

### 4.	La funcionalidad que permita simular el pago del pedido. Para esto suponga que puede haber solo dos tipos de pago: efectivo y tarjeta de crédito. Dependiendo el que seleccione aparecerá los elementos necesarios para completar la funcionalidad y al final deberá mostrar un mensaje en la misma interfaz de aprobación. Debe permitir manejar la confirmación o rechazo de los dos medios de pago.

---
