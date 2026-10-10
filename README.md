# Burgerhaus & Café

Aplicación de menú y pedidos creada con React y Vite.

El `index.html` del directorio padre es una versión HTML independiente; ambas
entradas admiten las mismas rutas. La compilación oficial de producción es la
de este directorio (`react-app/dist`).

## Desarrollo y compilación

Desde `react-app`:

```sh
npm install
npm run dev
npm run build
npm run preview
```

Vite sirve la aplicación como SPA y sus servidores de desarrollo y
previsualización resuelven las rutas del cliente a `index.html`.

## Rutas

- `/`, `/index.html` y `/menu` muestran los combos. La ruta `/index.html`
  permite abrir la versión independiente directamente con Live Server.
- `/menu/:categoria` abre directamente una categoría (`combos`, `simples`,
  `papas`, `cafes` o `bebidas`).
- Cualquier otra ruta muestra una página 404 dentro de la aplicación.

Los enlaces de categoría actualizan el historial del navegador; Atrás y Adelante
restauran la categoría correspondiente. Los enlaces externos, los enlaces que se
abren en otra pestaña y las descargas mantienen el comportamiento nativo.

## Despliegue

Publica el contenido de `react-app/dist`. El servidor estático de producción
debe devolver `index.html` para las rutas de la aplicación (por ejemplo,
`/menu/cafes`) para que React resuelva la ruta; debe seguir sirviendo los
archivos existentes de `assets/` normalmente y no aplicar el fallback a rutas
de API si se añaden en el futuro. La configuración exacta del rewrite depende
del proveedor de hosting, que no está especificado en este proyecto. `npm run
preview` permite probar la salida localmente con el fallback de Vite.

Si se publica en cambio el HTML independiente del directorio padre, publica ese
`index.html` junto con sus imágenes y aplica el mismo fallback de rutas.

El menú se carga desde datos estáticos locales y el pedido se completa mediante
un enlace externo a WhatsApp; no hay llamadas a API ni autenticación de servidor
configuradas.
