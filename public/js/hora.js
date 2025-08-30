
// JS para mostrar la hora actual en cada página

// Función para actualizar la hora
function actualizarHora() {
    const horaElemento = document.getElementById('hora');
    const ahora = new Date();
    // Formateamos la hora y los minutos con ceros a la izquierda
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    horaElemento.textContent = `${horas}:${minutos}`;
}

// Actualizamos la hora cada segundo y al refrescar la página
setInterval(actualizarHora, 1000);
actualizarHora();
