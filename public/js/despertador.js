
// JS que maneja la lógica de crear y gestionar las alarmas y su estado

// Contenedor de hora actual
const reloj = document.querySelector("#reloj");

// Función para actualizar la hora en el elemento el elemento #reloj
function actualizarReloj() {
    const ahora = new Date();
    // Formateamos la hora, minutos y segundos para que tengan dos dígitos
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");
    // Actualizamos el contenido del elemento #reloj
    reloj.textContent = `${horas}:${minutos}:${segundos}`;
}

// Actualizamos el reloj cada segundo y cuando se carga la página
setInterval(actualizarReloj, 1000);
actualizarReloj();

// Modal para agregar alarmas
const modal = document.querySelector("#modal");

// Botón de la interfaz principal para abrir el modal
const botonAgregar = document.querySelector(".alarmas button");

// Evento de interacción para mostrar el modal
botonAgregar.addEventListener("click", () => {
    modal.classList.add("mostrar");
});

// Boton del modal para cerrarlo
const cerrarModal = document.querySelector("#cerrar-modal");

// Evento de interacción para cerrar el modal
cerrarModal.addEventListener("click", () => {
    modal.classList.remove("mostrar");
});

// Función para guardar las alarmas y su estado en el localStorage
function guardarAlarmas() {
    const alarmas = [];
    document.querySelectorAll(".alarma").forEach(alarma => {
        // Extraemos la hora establecida
        const hora = alarma.querySelector("p").textContent;
        // Extraemos el estado del switch (activado/desactivado)
        const switchInput = alarma.querySelector("input[type='checkbox']");
        // Añadimos un diccionario con las claves "hora" y "activa"
        alarmas.push({ hora, activa: switchInput.checked });
    });
    localStorage.setItem("alarmas", JSON.stringify(alarmas));
}

// Contenedor de alarmas programadas
const alarmasProgramadas = document.querySelector(".alarmas-programadas");
// console.log(alarmasProgramadas);

// Función para restaurar las alarmas desde el localStorage
function restaurarAlarmas() {
    const alarmasGuardadas = JSON.parse(localStorage.getItem("alarmas")) || [];
    // Limpiamos el contenedor de alarmas programadas antes de restaurar
    alarmasProgramadas.innerHTML = "";
    alarmasGuardadas
        .sort((a, b) => {
            // Ordenamos las alarmas según la hora (las mas cercanas primero)
            const [ha, ma] = a.hora.split(":").map(Number);
            const [hb, mb] = b.hora.split(":").map(Number);
            return ha !== hb ? ha - hb : ma - mb;
        })
        // Creamos una alarma por cada una guardada en el localStorage
        .forEach(({ hora, activa }) => {
            const [horas, minutos] = hora.split(":").map(Number);
            crearAlarma(horas, minutos, activa);
        });
}

// Función para crear una alarma
function crearAlarma(horas, minutos, activa = false) {
    // Creamos el contenedor de la alarma
    const nuevaAlarma = document.createElement("div");
    nuevaAlarma.classList.add("alarma");
    // Le agregamos el índice para poder navegar por las alarmas
    nuevaAlarma.setAttribute("tabindex", "0");
    // Añadimos la hora
    const horaTexto = document.createElement("p");
    horaTexto.textContent = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
    // Creamos el switch
    const switchDiv = document.createElement("div");
    switchDiv.classList.add("switch");
    const switchLabel = document.createElement("label");
    switchLabel.classList.add("switch-label");
    // Asignamos al switch el estado de la alarma (activada/desactivada)
    const switchInput = document.createElement("input");
    switchInput.type = "checkbox";
    switchInput.checked = activa;
    const sliderSwitch = document.createElement("span");
    sliderSwitch.classList.add("slider-switch");
    // Estructuramos el contenedor de la alarma
    switchLabel.appendChild(switchInput);
    switchLabel.appendChild(sliderSwitch);
    switchDiv.appendChild(switchLabel);
    nuevaAlarma.appendChild(horaTexto);
    nuevaAlarma.appendChild(switchDiv);
    alarmasProgramadas.appendChild(nuevaAlarma);
    // Añadimos el evento para actualizar la alarma
    switchInput.addEventListener("change", guardarAlarmas);
    // Guardamos las alarmas en el localStorage
    guardarAlarmas();
}

// Inputs del modal
const horasInput = document.querySelector("#horas");
const minutosInput = document.querySelector("#minutos");

// Botón para crear una alarma en el modal
const confirmarAlarma = document.querySelector("#confirmar-alarma");

// Eventos para el input de horas y minutos
confirmarAlarma.addEventListener("click", () => {
    // Validamos que las horas y minutos sean válidos
    const horas = parseInt(horasInput.value, 10);
    const minutos = parseInt(minutosInput.value, 10);
    if (isNaN(horas) || isNaN(minutos) || horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
        alert("Por favor, introduce una hora válida.");
        return;
    }
    // Creamos la nueva alarma
    crearAlarma(horas, minutos);
    // Cerramos el modal
    modal.classList.remove("mostrar");
});

// Restauramos las alarmas al cargar la página
restaurarAlarmas();
