# Invitación para Caro

Invitación estática, mobile-first y lista para GitHub Pages. La portada usa dos recortes transparentes generados con IA: `assets/templo-transparente.png` (fachada reconocible del Santuario del Señor de La Piedad) y `assets/cuchillo-pala-transparente.png`. El SVG solo dispone y anima esos recortes; el texto y los controles son HTML.

## Publicar en GitHub Pages

El sitio se publica desde `JesusINF/caro-madrina-de-cuchillo-y-pala` con **GitHub Actions** al hacer push a `main` o al ejecutarlo manualmente desde **Actions**.

## Respuesta y Firebase

La página inicia sesión anónima y envía una sola creación para `responses/caro-cuchillo-pala`. No consulta documentos. `firestore.rules` conserva las reglas desplegadas de Mary/Everardo y Felipe, y añade ambas invitaciones nuevas con creación única; no habilita lecturas, cambios ni borrados. Para aceptar respuestas, Anonymous Auth debe estar habilitado. El `localStorage` solo mejora la experiencia en ese navegador: la regla de Firestore es la que impide una segunda respuesta.

El archivo `firebase-config.js` se reutiliza del proyecto Firebase compartido. Es configuración cliente pública, no una clave privada.

## Comprobación local

Con Node.js instalado, ejecuta `npm run check` para revisar sintaxis y las referencias esenciales del sitio.
