# SpiderFlink

Juego vertical para navegador, con 30 niveles, 10 jefes, tres dificultades y modos Arcade y Práctica. Esta versión incluye el traje azul y celeste, telarañas detalladas, láser amarillo con avance visible, iluminación gradual y tres tipos de civiles.

## Jugar

Sirve la carpeta con un servidor web estático y abre `index.html`. El juego no necesita instalar dependencias ni descargar recursos externos: la configuración y la música se publican junto a la aplicación.

- Toca para disparar.
- Mantén y suelta para trepar por el mismo muro o saltar al otro.
- Mientras trepas, desliza hacia el otro muro para saltar hacia él.
- Mantén dos dedos alineados aproximadamente con el objetivo para activar el láser, cuando esté desbloqueado.
- Mantén durante más tiempo para lanzar la telaraña atrapadora, cuando esté desbloqueada.

## Publicar con Netlify

Conecta este repositorio a Netlify y selecciona la rama `main`.

- Directorio base: raíz del repositorio (dejar vacío).
- Comando de compilación: vacío; no hace falta compilar.
- Directorio de publicación: `.` (raíz).

`netlify.toml` deja definidos el directorio de publicación y el comando vacío. `index.html` es el punto de entrada. No hace falta un servidor de aplicación, variables de entorno ni una base de datos. Las dependencias de `tests/` solo sirven para comprobar el juego y no son necesarias para publicarlo.

Documentación oficial: https://docs.netlify.com/build/configure-builds/file-based-configuration/

## Menú oculto y configuración

Toca cinco veces rápidamente a SpiderFlink en la pantalla de inicio.

El menú permite ajustar cada dificultad, configurar qué jefe aparece en cada nivel, asignar varias recompensas por nivel (incluido el nivel 0, inicio), personalizar Práctica de forma independiente o heredar Arcade, e importar o exportar todos los ajustes como JSON.

En «Probar un nivel o un jefe» puedes entrar directamente en cualquiera de los 30 niveles o los 10 jefes. Se usan los cambios del borrador, sin modificar los récords; puedes repetir o volver conservando los cambios pendientes.

`SpiderFlink-config-default.json` se carga automáticamente al arrancar y tiene prioridad sobre ajustes anteriores de `localStorage`. Así, la configuración publicada es siempre la que gobierna una nueva carga. Si el archivo no se puede solicitar (por ejemplo, al abrir `index.html` directamente con `file://`), el juego conserva como respaldo la configuración local o integrada. Los cambios guardados desde el menú se aplican a la sesión actual; exporta el JSON y reemplaza el archivo publicado para hacerlos permanentes.

Los niveles 1, 4, 7 y 10 permiten comparar noche, amanecer, día y atardecer. La iluminación cambia gradualmente durante el ascenso.

## Archivos

- `index.html`: juego completo, incluyendo gráficos, efectos de sonido y control de la música.
- `against_the_rising_tide.mp3`: música de fondo en bucle; suena más baja durante el juego y sube en menús, pausas e intermedios.
- `netlify.toml`: configuración de publicación.
- `SpiderFlink-config-default.json`: configuración inicial exportable.
- `LEEME.txt`: instrucciones detalladas.
- `tests/`: pruebas, simulación del navegador y medición local del tiempo de dibujo.

## Comprobar cambios

Con Node.js instalado (comprobado con Node 24), ejecuta:

```sh
cd tests
npm install
npm test
npm run benchmark
```

Las pruebas comprueban controles, progresión, recompensas, configuración, pruebas directas de niveles y jefes, láser y gráficos. Usan una simulación del navegador y dibujo en memoria: no sustituyen una prueba de tacto y rendimiento en un móvil real. Sus archivos generados quedan en `tests/tmp/`, excluido de Git.
