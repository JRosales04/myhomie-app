
// JS de navegación por el tiempo con el teclado y el movimiento del móvil

// 1. Manejo con el teclado

// Contenedor de horas
const contenedor = document.querySelector(".horas");

// Evento de teclado para mover el scroll
document.addEventListener("keydown", (event) => {
    // Número de píxeles a mover en el scroll con las teclas
    const scrollStep1 = 1000;
    // Si se presiona la tecla ->, desplazamos el scroll hacia la derecha
    if (event.key === "ArrowRight") {
        contenedor.scrollBy({
            left: scrollStep1,
            behavior: "smooth",
        });
    // Si se presiona la tecla <-, desplazamos el scroll hacia la izquierda
    } else if (event.key === "ArrowLeft") {
        contenedor.scrollBy({
            left: -scrollStep1,
            behavior: "smooth",
        });
    }
});

// 2. Manejo con el giroscopio

// Evento de detección de inclinación hacia los lados del movil
socket.on('command', (data) => {
    if (data.action === 'inclinacion_lateral_rapida') {
        contenedor.scrollLeft += data.target * 0.3;
    }
});