# Arte de la invitación

- `templo-transparente.png`: recorte transparente de la fachada del Santuario del Señor de La Piedad, generado con OpenAI ImageGen.
- `cuchillo-pala-invitacion-v2.webp`: cuchillo para pastel y pala de plata grabada, generados con OpenAI ImageGen. Prompt resumido: dos utensilios ceremoniales ornamentados, aislados, sin fondo, letras ni manos. El recorte PNG transparente se optimizó a WebP de 1024 × 1536 px preservando alfa.
- `cuchillo-pala-invitacion-v2.png` y `cuchillo-pala-transparente.png`: variantes PNG heredadas conservadas; la portada actual usa el WebP optimizado.

La página compone los recortes con elementos `<image>` dentro del SVG inline. El movimiento del grupo está ligado al timeline de scroll nativo de CSS y se desactiva cuando el sistema solicita movimiento reducido; no se redibujan las imágenes ni se registra un listener de scroll por frame.
