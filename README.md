# Weather App

Aplicación del tiempo en HTML, CSS y JavaScript puro. Busca una ciudad y muestra las condiciones actuales y la previsión de 5 días.

Usa las APIs públicas de [Open-Meteo](https://open-meteo.com/) (geocodificación y previsión), que no requieren clave.

## Funcionalidades

- Búsqueda de ciudades por nombre
- Temperatura, sensación térmica, viento y humedad
- Previsión de los próximos 5 días
- Gestión de errores (ciudad no encontrada, fallos de red)
- Recuerda la última ciudad consultada
- Diseño responsive

## Estructura

```
index.html
css/styles.css
js/api.js    llamadas a la API y traducción de códigos meteorológicos
js/app.js    interfaz y eventos
```

## Uso

Al hacer peticiones a una API, conviene servir los archivos por HTTP en lugar de abrirlos con `file://`:

```bash
npx serve .
```

## Autor

Allen Iverson Gatdula · [Portfolio](https://allenmatira.netlify.app/) · [LinkedIn](https://www.linkedin.com/in/alleniversonn)
