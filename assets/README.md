# Arte de la invitación

- `santuario-papercraft-v1.webp`: ilustración de IA en relieve de cartulina, recortada con transparencia. Conserva la torre a la izquierda y la cúpula azul con paneles dorados del Santuario del Señor de La Piedad.
- `cubiertos-papercraft-v1.webp`: muestra un cuchillo de pastel y una pala ornamentados como piezas superpuestas de cartulina, con transparencia y encuadre completo.
- Las ilustraciones papercraft se optimizaron a WebP preservando el canal alfa y se componen mediante elementos `<image>` dentro del SVG inline; el SVG no redibuja los objetos.
- `cuchillo-pala-invitacion-v2.png` y `cuchillo-pala-transparente.png`: variantes PNG originales heredadas que se conservan; la portada usa las dos nuevas piezas papercraft WebP.

La página compone los recortes con elementos `<image>` dentro del SVG inline. El movimiento del grupo está ligado al timeline de scroll nativo de CSS y se desactiva cuando el sistema solicita movimiento reducido; no se redibujan las imágenes ni se registra un listener de scroll por frame.
