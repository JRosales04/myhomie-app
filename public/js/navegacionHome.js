
// JS de navegación por el menú principal con el teclado y el movimiento del móvil

// 1. Manejo con el teclado

// Seleccionamos el menú de opciones del HTML "home"
const menu = document.querySelector('.opciones');

// Almacenamos la opción activa
let opcionActiva = null; // Variable para almacenar la opción activa

// Manejamos el intervalo al mantener la tecla, y evitamos múltiples ejecuciones
let intervaloTecla = null;
let teclaPresionada = false; // Variable para evitar múltiples ejecuciones

// Función para inicializar la opción activa
function inicializarOpcionActiva() {
    const opcionesArray = document.querySelectorAll('.opcion');
    if (opcionesArray.length > 0) {
        // Seleccionamos la primera opción por defecto
        opcionActiva = opcionesArray[0];
        opcionActiva.classList.add('active');
        opcionActiva.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
}

// Función para cambiar la opción activa al pulsar las teclas de flecha -> y <-
function cambiarOpcionActiva(direccion) {
    const opcionesArray = Array.from(document.querySelectorAll('.opcion'));
    // Extraemos el índice de la opción activa
    const indiceActual = opcionesArray.indexOf(opcionActiva);
    // Calculamos el nuevo índice basado en la dirección a la que vamos
    let nuevoIndice = indiceActual;
    if (direccion === 'derecha' && indiceActual < opcionesArray.length - 1) {
        nuevoIndice++;
    } else if (direccion === 'izquierda' && indiceActual > 0) {
        nuevoIndice--;
    }
    if (nuevoIndice !== indiceActual) {
        // Cambiamos la clase a .active al nuevo elemento y la eliminamos del anterior
        opcionActiva.classList.remove('active');
        opcionActiva = opcionesArray[nuevoIndice];
        opcionActiva.classList.add('active');
        // Desplazamos el scroll para que el nuevo elemento activo sea visible
        opcionActiva.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}

// Evento para detectar las teclas de flecha
document.addEventListener('keydown', (event) => {
    // Evitamos múltiples ejecuciones mientras la tecla está presionada
    if (teclaPresionada) return;
    teclaPresionada = true;
    // Detectamos la tecla presionada
    if (event.key === 'ArrowRight') {
        cambiarOpcionActiva('derecha');
    } else if (event.key === 'ArrowLeft') {
        cambiarOpcionActiva('izquierda');
    }
});

// Evento para manejar cuando se suelta la tecla
document.addEventListener('keyup', () => {
    teclaPresionada = false;
});

// Inicializamos la opción activa al cargar la página
inicializarOpcionActiva();

// 2. Manejo con el movimiento del móvil

// Evento de detección de inclinación del movil hacia los lados
socket.on('command', (data) => {
    // console.log("Comando recibido en cliente:", data);
    if (data.action === 'inclinacion_lateral_lenta') {
        console.log("Girando a la opción:", data.target);
        cambiarOpcionActiva(data.target);
    }
});
