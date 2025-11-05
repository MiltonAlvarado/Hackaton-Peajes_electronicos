# Sistema de Peaje Electrónico

Este proyecto es una demostración de una aplicación web para convertir los pagos de peaje físicos a electrónicos. Permite a un usuario identificarse mediante su número de identidad y consultar las placas asociadas, los montos adeudados, la fecha de pago de la matrícula y el historial de cobros de peaje por placa.

## Estructura del proyecto

La aplicación está dividida en un backend con Node.js y un frontend construido con HTML, Tailwind CSS y JavaScript vanilla. No se utiliza una base de datos real temporalmente; los datos están almacenados en un fichero JSON que se carga en memoria al iniciar el servidor.

```
Hackaton-Peajes_electronicos/
├── package.json         
├── server/
│   └── index.js        
├── data/
│   └── data.json       
├── public/
│   ├── index.html       # Página de inicio con formulario de login
│   ├── login.js         # Lógica de autenticación en el cliente
│   ├── dashboard.html   # Página que muestra la información del usuario
│   └── dashboard.js     # Lógica para renderizar placas e historial
└── README.md            
```

## Cómo ejecutar el proyecto

1. **Requisitos**: Se necesita tener instalado Node.js (versión 14 o superior). No se requiere instalar paquetes adicionales porque se usa únicamente el núcleo de Node.js.

2. **Clonar o copiar** el contenido de este directorio en la computadora.

3. **Ejecutar el servidor**:

   ```
   npm run dev
   ```

4. **Abrir la aplicación** `http://localhost:3000/`.

5. **Probar el login** usando una de las identidades de ejemplo definidas en `data/data.json`. Por ejemplo:

   - `0501 1995 23456`
   - `0303-1987-23678`

   El campo acepta guiones, espacios o números continuos. Si la identidad existe, la aplicación mostrará la información del usuario. Si no, mostrará un mensaje de error.

## Notas de diseño

- **Seguridad**: Se valida y normaliza la identidad eliminando guiones y espacios antes de compararla con los registros. Todas las respuestas se devuelven en JSON para evitar interpolaciones de HTML y posibles inyecciones.
- **Modo oscuro/claro**: la interfaz permite alternar entre tema oscuro y claro mediante un botón. La elección se guarda en `localStorage` para respetar la preferencia del usuario en sesiones posteriores.
- **Internacionalización**: los textos están en español y los importes se muestran en lempiras (`HNL`) usando `Intl.NumberFormat` para formatear correctamente la moneda.
- **Escalabilidad**: El frontend genera dinámicamente tarjetas para cada placa. Se podrían añadir más registros en `data/data.json` sin modificar el código.