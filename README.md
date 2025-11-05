# Sistema de Peaje Electrónico

Este proyecto es una demostración de una aplicación web para convertir los pagos de peaje físicos a electrónicos. Permite a un usuario identificarse mediante su número de identidad y consultar las placas asociadas, los montos adeudados, la fecha de pago de la matrícula y el historial de cobros de peaje por placa.

## Estructura del proyecto

La aplicación está dividida en un backend sencillo con Node.js y un frontend estático construido con HTML, Tailwind CSS y JavaScript vanilla. No se utiliza una base de datos real; los datos están almacenados en un fichero JSON que se carga en memoria al iniciar el servidor.

```
peaje-electronico-app/
├── package.json         # Configuración de npm con script de inicio
├── server/
│   └── index.js         # Servidor HTTP que maneja las rutas y la autenticación
├── data/
│   └── data.json        # Datos de ejemplo con personas, placas y sus historiales
├── public/
│   ├── index.html       # Página de inicio con formulario de login
│   ├── login.js         # Lógica de autenticación en el cliente
│   ├── dashboard.html   # Página que muestra la información del usuario
│   └── dashboard.js     # Lógica para renderizar placas e historial
└── README.md            # Este archivo con instrucciones
```

## Cómo ejecutar el proyecto

1. **Requisitos**: Se necesita tener instalado Node.js (versión 14 o superior). No se requiere instalar paquetes adicionales porque se usa únicamente el núcleo de Node.js.

2. **Clonar o copiar** el contenido de este directorio en su máquina local.

3. **Ejecutar el servidor**:

   ```bash
   cd peaje-electronico-app
   npm start
   ```

   Esto levantará un servidor HTTP en el puerto `3000`. Puede cambiar el puerto editando la variable `PORT` en `server/index.js`.

4. **Abrir la aplicación** en su navegador favorito navegando a `http://localhost:3000/`.

5. **Probar el login** usando una de las identidades de ejemplo definidas en `data/data.json`. Por ejemplo:

   - `0801-1999-12345`
   - `0501 1995 23456`
   - `0303-1987-23678`

   El campo acepta guiones, espacios o números continuos. Si la identidad existe, la aplicación mostrará la información del usuario. Si no, mostrará un mensaje de error.

## Notas de diseño

- **Seguridad**: aunque no hay base de datos, se valida y normaliza la identidad eliminando guiones y espacios antes de compararla con los registros. Todas las respuestas se devuelven en JSON para evitar interpolaciones de HTML y posibles inyecciones.
- **Modo oscuro/claro**: la interfaz permite alternar entre tema oscuro y claro mediante un botón. La elección se guarda en `localStorage` para respetar la preferencia del usuario en sesiones posteriores.
- **Internacionalización**: los textos están en español y los importes se muestran en lempiras (`HNL`) usando `Intl.NumberFormat` para formatear correctamente la moneda.
- **Escalabilidad**: aunque los datos de ejemplo son estáticos, el frontend genera dinámicamente tarjetas para cada placa. Se podrían añadir más registros en `data/data.json` sin modificar el código del cliente.

## Limitaciones

- Este proyecto es puramente académico y no está integrado con un proveedor de pago ni con cámaras reales de detección de placas.
- El backend no persiste cambios; todas las modificaciones residen en memoria mientras el servidor está en ejecución.
- No se implementan sesiones ni tokens seguros. Los datos del usuario se almacenan en `sessionStorage` solo con fines demostrativos.