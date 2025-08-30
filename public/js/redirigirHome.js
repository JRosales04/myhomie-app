
// JS de redirección según la opción activa usando la tecla Enter y el giroscopio del móvil
// Evento de confirmación de una opción

// 1. Manejo de la tecla Enter

// Función para redirigir al HTML correspondiente al presionar Enter
function redirigirSegunOpcion() {
    // Obtenemos el contenido de texto de la opción activa
    const opcionTexto = opcionActiva.textContent.trim();
    // Redirigimos a la página correspondiente
    window.location.href = opcionTexto + '.html';
}
// Evento para detectar las teclas de flecha y Enter
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        redirigirSegunOpcion();
    }
});

// 2. Manejo del giroscopio

// Recibimos el evento de movimiento del giroscopio
socket.on('command', (data) => {
    if (data.action === 'redirigir') {
        console.log("Redirigiendo");
        redirigirSegunOpcion();
    }
});
