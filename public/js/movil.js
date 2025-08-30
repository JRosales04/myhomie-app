const socket = io();  
socket.emit('register', 'movil');

// Enviar 
function redirigir() {   
    socket.emit('command', {
        action: 'redirigir'
    });
}

function volver() {
    socket.emit('command', {
        action: 'volver'
    });
}

// Giroscopio con un Timeout para que no se ejecute 20 veces a la vez
let gyroscope = new Gyroscope({ frequency: 60 });

let timeoutActivo = false;

// Si el giroscopio detecta una inclinación hacia la derecha o izquierda, se envia el emit
gyroscope.addEventListener("reading", () => {
    if (timeoutActivo) return;

    if (gyroscope.x > 10) {
        console.log("Redirigir")
        redirigir();
        activarTimeout();
    }
    if (gyroscope.x < -10) {
        console.log("Volver")
        volver();
        activarTimeout();
    }
});
gyroscope.start();

function activarTimeout() {
    timeoutActivo = true;
    setTimeout(() => {
        timeoutActivo = false;
    }, 1000);
}

// Broadcast del socket para inclinaciones laterales rápidas como el tiempo
function inclinacion_lateral_rapida(inclinacion) {
    socket.emit('command', {
        action: 'inclinacion_lateral_rapida',
        target: inclinacion
    });
}

// Broadcast del socket para inclinaciones laterales lentas como en home/persianas...
function inclinacion_lateral_lenta(lado) {
    socket.emit('command', {
        action: 'inclinacion_lateral_lenta',
        target: lado
    });
}

function inclinacion_frontal(lado) {
    socket.emit('command', {
        action: 'inclinacion_frontal',
        target: lado
    });
}

let alpha, beta, gamma;

// Evento de "devideorientation" para detectar la orientación del dispositivo
window.addEventListener('deviceorientation', function(event) {
    // Rotación alrededor del eje Z, X e Y (en grados), respectivamente
    alpha = event.alpha;
    beta = event.beta;
    gamma = event.gamma;
});

// Función para navegar con el móvil de manera rapida
setInterval(function() {
    // Si giramos el móvil hacia un lado, se navega hacia ese lado
    inclinacion_lateral_rapida(gamma);
}, 20); // Se actualiza cada 20 mseg = 0.02 seg

// Función para navegar con el móvil de manera lenta
setInterval(function() {
    // Si giramos el móvil hacia la derecha, se navega hacia ese lado
    if (gamma > 25) {
        inclinacion_lateral_lenta('derecha');
    // Si giramos el móvil hacia la izquierda, se navega hacia ese lado
    } else if (gamma < -25) {
        inclinacion_lateral_lenta('izquierda');
    }

}, 500); // Se actualiza cada 500 mseg = 0.5 seg

// Inclinacion frontal o trasera del movil, se envía el grado de inclinación
setInterval(function() {
    inclinacion_frontal(beta);

}, 50); // Se actualiza cada 500 mseg = 0.5 seg

// Broadcast del socket si se esta pulsando o se seja de pulsar
function pulsando() {
    socket.emit('command', {
        action: 'pulsando',
    });
}
function soltar() {
    socket.emit('command', {
        action: 'soltar',
    });
}

// Broadcast del socket si se hace un doble tap
function dobletap() {
    socket.emit('command', {
        action: 'dobletap',
    });
}

// Broadcast del socket si se desliza lateralmente
function scroll_lateral(lado) {
    socket.emit('command', {
        action: 'scroll_lateral',
        target: lado
    });
}

let lastTap = 0;

let x_inicial = 0;
let x_final = 0;
// Agregamos los listeners al documento para ver si esta pulsando tactil del movil
document.addEventListener("touchstart", (e) => {
    pulsando();
    x_inicial = e.changedTouches[0].screenX;
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
        dobletap();
    }

    lastTap = currentTime;

});

document.addEventListener("touchend", (e) => {
    soltar();
    x_final = e.changedTouches[0].screenX;
    if (x_final - x_inicial > 100) {
        scroll_lateral('derecha');
    } else if (x_final - x_inicial < -100) {
        scroll_lateral('izquierda');
    }
});

// Variables para detectar la agitación
let ultimaAceleracion = { x: 0, y: 0, z: 0 };
let tiempoUltimaAgitacion = 0;

 // Umbral para detectar la agitación
const UMBRAL_AGITACION = 15;

// Evento para detectar la agitación del móvil
window.addEventListener("devicemotion", (event) => {
    // Si no hay aceleración, no hacemos nada
    const aceleracion = event.accelerationIncludingGravity;
    if (!aceleracion) return;
    // Detectamos el tiempo actual y la diferencia con la última aceleración
    const ahora = Date.now();
    const deltaX = Math.abs(aceleracion.x - ultimaAceleracion.x);
    const deltaY = Math.abs(aceleracion.y - ultimaAceleracion.y);
    const deltaZ = Math.abs(aceleracion.z - ultimaAceleracion.z);
    // Comprobamos si la agitación supera el umbral
    if ((deltaX > UMBRAL_AGITACION || deltaY > UMBRAL_AGITACION || deltaZ > UMBRAL_AGITACION) &&
        ahora - tiempoUltimaAgitacion > 1000) {
        // console.log("Desactivar alarma");
        // Emitimos el evento al servidor
        socket.emit('command', {
            action: 'agitar'
        });
        // Actualizamos el tiempo de la última agitación	
        tiempoUltimaAgitacion = ahora;
    }
    // Guardamos la última aceleración
    ultimaAceleracion = {
        x: aceleracion.x,
        y: aceleracion.y,
        z: aceleracion.z
    };
});
