
// JS de redirección a la página principal "home" al presionar la tecla ESC o con el giroscopio del móvil
// Evento de salida de una opción

// 1. Manejo de la tecla ESC

// Evento para detectar la tecla ESC
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        // Redirige a home.html si no estás ya en home.html
        if (!window.location.pathname.includes("home.html")) {
            window.location.href = "/html/home.html";
        }
    }
});

// 2. Manejo del giroscopio

// Recibimos el evento de movimiento del giroscopio
socket.on('command', (data) => {
    if (data.action === 'volver') {
        console.log("Redirigiendo");
        window.location.href = "/html/home.html";
    }
});
