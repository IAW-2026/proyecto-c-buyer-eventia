![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)

# Buyer — Eventia (cliente comprador)

Deploy
------
URL: https://proyecto-c-buyer-eventia.vercel.app/
-----------------
Listado usuarios
------------------------------
- Usuario general: Email: buyer+clerk_test@iaw.com Contraseña: iawuser#
- Administrador: admin+clerk_test@iaw.com Contraseña: iawuser#
  Este usuario podrá acceder a `/admin`.

-----------------
Necesario para evaluar la aplicación
------------------------------
- Los eventos listados seran los que tengan una fecha posterior al momento de ingresar, de ser necesario se pueden modificar estas fechas en data/eventos.ts. No vamos a listar los eventos que ya pasaron.
- Si se quieren devolver entradas, solo es posible dentro de las 48 horas previas al evento, sino figurará en lugar del boton devolver, "no disponible para devolución". La fecha y la hora se ven en el mock data/eventos.ts.
  
-----------------
Descripción app
------------------------------
Buyer es la aplicación para compradores en Eventia. Permite explorar eventos, comprar entradas, ver historial de compras, devolver entradas y gestionar roles de usuario.

Funcionalidades - Usuario comprador
--------
- Cartelera de Eventos: Exploración del listado de eventos consumiendo API de `seller` (los datos de los eventos se encuentran mockeados en data/eventos.ts).
- Flujo de Compra: Adquisición de entradas consumiendo apis de `seller`, `payments` y `shipping` , guardando los pedidos exitosos o capturando errores para mostrar aviso apropiado.
- Gestión de Pedidos ("Mis Eventos"): Visualización de eventos que fueron adquiridos, con la opción de devolución dentro de los plazos permitidos.
-----------------
Funcionalidades - Usuario administrador
--------
- Posee todas las funcionalidades del usuario comprador, sumando un panel exclusivo de gestión.
- Dashboard Estadístico: Métricas como el ranking de los eventos más vendidos y las categorías más populares.
- Auditoría General: Listado global de todos los usuarios y de la totalidad de las compras del sistema con su información detallada.

-----------------
Notas
-------------------------
- Las integraciones con `payments`, `shipping` y `seller` están simuladas en la carpeta api.
- La app ya incluye llamadas reales a los servicios `seller`, `payments`, `shipping`  (utilizando variables de entorno que actualmente almacenan el deploy buyer) y en la próxima entrega deberá apuntar a los deploy reales de cada servicio.
- API Propia: Se expondrá un endpoint propio diseñado para que Seller nos notifique cuando expire el plazo de finalización de una compra (por falta de pago, por ejemplo), permitiéndonos purgar de nuestra base de datos aquellos pedidos que no se concretaron. (api/buyer/pedidoCancelado). 
- Nota sobre stock: actualmente el stock se refleja en la interfaz durante la compra para que el usuario vea consistencia. Luego el stock estará sincronizado correctamente con  `seller` antes de confirmar compras y luego de realizarlas o de devolver entradas, ya que en el mockeo no se reflejan las modificaciones en datos de los eventos, esto es información de Seller. 
- Persistencia de pedidos: Los pedidos se muestran en el listado "mis eventos" mientras su pago se encuentra en proceso o termina y es exitoso. Si el pago queda inconcluso, vence o presenta errores, el evento no aparecerá en "Mis Eventos". En estos casos, disponemos de un endpoint para actualizar la base de datos y eliminarlo.
- Por el momento, la busqueda en admin/compras no funciona correctamente al utilizar mayusculas,para ver resultados correctos usar minusculas.








