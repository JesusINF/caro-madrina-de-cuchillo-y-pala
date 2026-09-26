# Invitación para Caro

Invitación estática, mobile-first y preparada para GitHub Pages. La composición toma como referencia el lenguaje de papel recortado de Mary y Everardo: cielo azul niebla, hoja marfil, acentos blush y salvia, tipografía borgoña y un toque dorado. Cormorant Garamond y Manrope se sirven como fuentes locales.

## Arte y movimiento

- `assets/santuario-papercraft-v1.webp` y `assets/cubiertos-papercraft-v1.webp` son recortes transparentes de IA con acabado de cartulina en capas. El templo conserva su torre frontal izquierda y la cúpula azul con paneles dorados; el cuchillo y la pala mantienen sus siluetas completas.
- El SVG inline solo posiciona esas imágenes mediante elementos `<image>`; no redibuja arte. La capa conjunta tiene movimiento de desplazamiento ligado al timeline de scroll nativo de CSS, sin listener de scroll por frame. La historia usa `IntersectionObserver` de una sola entrada; `prefers-reduced-motion` elimina los movimientos.

## Publicar en GitHub Pages

El workflow de `.github/workflows/pages.yml` publica desde GitHub Actions al hacer push a `main` o al ejecutarlo manualmente desde **Actions**. Este trabajo no inicializó ni publicó un repositorio.

## Respuesta y Firebase

Al confirmar, la invitación inicia sesión anónima y realiza una sola creación en `responses/caro-cuchillo-pala`, con los campos de aceptación, fecha del servidor, identificador, destinataria y UID anónimo. No consulta documentos. El archivo de reglas existente permanece sin cambios y conserva Mary/Everardo, Felipe, Gaby, la creación única de Caro y denegación predeterminada. No se desplegaron reglas desde este trabajo; Anonymous Auth debe estar habilitado para aceptar respuestas.

`localStorage` solo recuerda la respuesta en ese navegador; la regla de Firestore es la que impide cambios o respuestas duplicadas. `firebase-config.js` es configuración cliente pública del proyecto Firebase compartido, no una clave privada.

## Comprobaciones

Con Node.js instalado, ejecuta `npm run check` para validar sintaxis y los contratos estáticos esenciales. La revisión visual adicional cubre 320, 360, 390, 768 y 1280 px.
