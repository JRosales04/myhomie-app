
// JS que controla el funcionamiento de las alarmas, cuándo tienen que sonar y cuándo no

// Sonido de la alarma
let audio = document.getElementById("audio");
// Creamos el elemento audio si no existe para permitir que la alarma suene en cualquier pantalla
if (!audio) {
    audio = document.createElement("audio");
    audio.id = "audio";
    audio.src = "../audio/audio.mp3";
    audio.style.display = "none";
    document.body.appendChild(audio);
}

// Detección de alarmas (guardada en el localStorage)
localStorage.setItem("sonar", JSON.stringify(false))

// Función para obtener la hora actual en formato HH:MM
function obtenerHoraActual() {
    const ahora = new Date();
    // Formateamos la hora, minutos y segundos para que tengan dos dígitos
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
}

// Función para comprobar que debe sonar una alarma
function comprobarAlarmas() {
    // Obtenemos el estado de "sonar" desde el localStorage
    let sonar = JSON.parse(localStorage.getItem("sonar"));
    // Si ya está sonando, no hacemos nada
    if (sonar) return;
    // Obtenemos las alarmas guardadas en el localStorage
    const alarmasGuardadas = JSON.parse(localStorage.getItem("alarmas")) || [];
    // Obtenemos la hora actual
    const horaActual = obtenerHoraActual();
    // Recorremos las alarmas guardadas
    alarmasGuardadas.forEach(({ hora, activa }) => {
        // Si la alarma está activa y coincide con la hora actual, la hacemos sonar
        if (activa && hora === horaActual) {
            localStorage.setItem("sonar", true);
            // Reproducimos el sonido
            audio.play();
        }
    });
}

// Comprobamos si hay alarmas activas cada segundo (1000ms)
setInterval(comprobarAlarmas, 1000);