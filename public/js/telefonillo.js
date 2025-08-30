
// JS de control del telefonillo con las teclas y gestos del móvil

// 1. Manejo con teclado

// Imagen del telefonillo
const imagen = document.getElementById('telefonillo');

// Audio del telefonillo
const llamada = document.getElementById('ring');

// Estado del telefonillo
let estado = 0;

document.addEventListener('keydown', function(event) {
    // Tecla Enter para simular una llamada
    if (event.key === 'Enter' && estado === 0) {
        // Cambiamos la imagen del telefonillo (empieza a sonar)
        imagen.src = '../img/ring.gif';
        // Reproducimos el sonido de llamada
        llamada.play();
        estado = 1;  
        console.log('Enviando socket suena telefonillo');
        socket.emit('respuesta', { action: 'telefonillo_sonando' });
    }
    // Tecla Space para coger la llamada
    else if (event.key === ' ' && estado === 1) {
        imagen.src = '../img/talking.png';
        // Pausamos el sonido del telefonillo
        llamada.pause();
        llamada.currentTime = 0;
        estado = 2;
    }
    // Tecla Space para colgar la llamada
    else if (event.key === ' ' && estado === 2) {
        imagen.src = '../img/not-ring.png';
        estado = 0;
    }
});

// 2. Manejo con gestos del móvil

// Evento de detección de coger la llamada
socket.on('command', (data) => {
    if (data.action === 'contestarTelefonillo') {
        // Cambiamos la imagen del telefonillo (como si estuvieramos hablando)
        imagen.src = '../img/talking.png';
        // console.log('El usuario ha cogido el movil');
        // Pausamos el sonido del telefonillo
        llamada.pause();
        llamada.currentTime = 0;
        estado = 2;
        
    } else if (data.action === 'dobletap') {
        // Cambiamos la imagen del telefonillo (como si hubiéramos colgado)
        // console.log('El usuario ha colgado el movil');
        imagen.src = '../img/not-ring.png';
        estado = 0;
    }
});
