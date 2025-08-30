
// JS que maneja el control de las cámaras y el seguimiento de éstas en sus respectivos enlaces

// Botones de cambio de cámaras
const botonRetroceder = document.getElementById("retroceder");
const botonAvanzar = document.getElementById("avanzar");

// Array de cámaras con sus URLs e identificadores
const camaras = [
    {
        src: "http://2.139.183.22:84/cgi-bin/viewer/video.jpg", id: "camaraMostoles"
    },
    {
        src: "http://95.9.96.3:91/mjpg/video.mjpg", id: "camaraTienda"
    },
    {
        src: "http://62.131.207.209:8080/cam_1.cgi", id: "camaraHabitacion"
    },
    {
        src: "http://80.32.125.254:8080/cgi-bin/faststream.jpg?stream=half&fps=15&rand=COUNTER", id: "camaraPlaya"
    }
];

// Índice de la cámara
let indice = 0;

// Elemento de imagen en el HTML
let camaraActual = document.getElementById("camaraActual");

// Función para refrescar la imagen de la cámara actual (sin cambiar de cámara)
function refrescarCamara() {
    // Obtenemos la cámara actual
    const camara = camaras[indice];
    const hora_ms = new Date().getTime();
    const hora_s = Math.floor(hora_ms / 1000);
    const nuevaSrc = camara.src.split('?')[0] + "?r=" + hora_s;
    camaraActual.src = nuevaSrc;
    // console.log("Recargando cámara:", camara.id, nuevaSrc);
}

let intervalo = null;

function refrescarCamaraIntervalo() {
    if (intervalo) clearInterval(intervalo); // Detener cualquier intervalo anterior
    // Solo refrescar cada 500ms si la cámara actual es la primera
    if (indice === 0) {
        intervalo = setInterval(refrescarCamara, 500);
    }
}

// Función para cambiar de cámara
function actualizarCamara() {
    // Obtenemos la cámara actual y le cambiamos el alt
    const camara = camaras[indice];
    camaraActual.alt = camara.id;
    // Actualizamos la cámara
    refrescarCamara();
    refrescarCamaraIntervalo();
}

// Eventos para los botones de retroceder y avanzar

// Al hacer clic en el botón de retroceder, disminuimos el índice en 1
botonRetroceder.addEventListener("click", () => {
    indice = (indice - 1 + camaras.length) % camaras.length;
    actualizarCamara();
});

// Al hacer clic en el botón de avanzar, aumentamos el índice en 1
botonAvanzar.addEventListener("click", () => {
    indice = (indice + 1) % camaras.length;
    actualizarCamara();
});

// Al cargar la página, refrescamos la cámara inicial
refrescarCamara();
refrescarCamaraIntervalo();