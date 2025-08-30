
// JS que maneja toda la lógica de creación de historias y eventos de botones de la seguridad

// Contenedor del historial
const contenedorHistorial = document.querySelector(".contenedor-historias");

// Función para crear una historia a partir de un mensaje
export function crearHistoria(mensaje) {
    // Obtenemos las historias almacenadas
    const historiasGuardadas = JSON.parse(localStorage.getItem("historias")) || [];
    // Añadimos la nueva historia con la hora actual
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    historiasGuardadas.unshift({
        mensaje: mensaje,
        hora: hora
    });
    // Guardamos las historias en el localStorage
    localStorage.setItem("historias", JSON.stringify(historiasGuardadas));
    // Actualizamos el contenedor de historias
    if (contenedorHistorial) {
        // Creamos un nuevo div
        const nuevaHistoria = document.createElement("div");
        nuevaHistoria.classList.add("historia");
        // Añadimos el mensaje al div
        const mensajeElement = document.createElement("p");
        mensajeElement.textContent = mensaje;
        mensajeElement.classList.add("mensaje");
        nuevaHistoria.appendChild(mensajeElement);
        // Añadimos la hora a la historia
        const horaTexto = document.createElement("p");
        horaTexto.textContent = hora;
        horaTexto.classList.add("hora-historia");
        nuevaHistoria.appendChild(horaTexto);
        // Agregamos el nuevo div al principio del contenedor
        contenedorHistorial.prepend(nuevaHistoria);
    }
}

// Función para restaurar las historias desde el localStorage
function restaurarHistorias() {
    if (contenedorHistorial) {
        // Obtenemos las historias almacenadas en el localStorage
        const historiasGuardadas = JSON.parse(localStorage.getItem("historias")) || [];
        // Limpiamos el contenedor de historias
        contenedorHistorial.innerHTML = "";
        // Recorremos las historias guardadas y las añadimos al contenedor
        historiasGuardadas.forEach(({ mensaje, hora }) => {
            // Creamos un nuevo div para la historia
            const nuevaHistoria = document.createElement("div");
            nuevaHistoria.classList.add("historia");
            // Creamos un elemento para el mensaje
            const mensajeHistoria = document.createElement("p");
            mensajeHistoria.textContent = mensaje;
            mensajeHistoria.classList.add("mensaje");
            // Añadimos el mensaje al contenedor
            nuevaHistoria.appendChild(mensajeHistoria);
            // Creamos un elemento para la hora
            const horaTexto = document.createElement("p");
            horaTexto.textContent = hora;
            horaTexto.classList.add("hora-historia");
            // Añadimos la hora al contenedor
            nuevaHistoria.appendChild(horaTexto);
            // Agregamos el nuevo div al contenedor
            contenedorHistorial.appendChild(nuevaHistoria);
        });
    }
}

// Al recargar la página, restauramos las historias
if (contenedorHistorial) {
    restaurarHistorias();
}

// Función para eliminar historias antiguas
function eliminarHistoriasAntiguas() {
    // Obtenemos todas las historias del localStorage
    const historiasGuardadas = JSON.parse(localStorage.getItem("historias")) || [];
    const ahora = new Date();
    // Filtramos historias más antiguas de 24 horas
    const historiasActualizadas = historiasGuardadas.filter(historia => {
        const [hora, minutos] = historia.hora.split(":").map(Number);
        const fechaHistoria = new Date(ahora);
        fechaHistoria.setHours(hora, minutos, 0, 0);
        // Si la historia es de ayer pero a la misma hora, debemos ajustar la fecha
        if (fechaHistoria > ahora) {
            fechaHistoria.setDate(fechaHistoria.getDate() - 1);
        }
        // Comprobamos si la historia es más reciente que 24 horas
        const diferenciaHoras = (ahora - fechaHistoria) / (1000 * 60 * 60);
        return diferenciaHoras <= 24;
    });
    // Actualizamos el localStorage si hay cambios
    if (historiasGuardadas.length !== historiasActualizadas.length) {
        localStorage.setItem("historias", JSON.stringify(historiasActualizadas));
        // Actualizamos el contenedor de historias
        if (contenedorHistorial) {
            restaurarHistorias();
        }
    }
}

// Llamamos a la función al cargar la página y cada minuto
eliminarHistoriasAntiguas();
const intervaloHistorias = setInterval(eliminarHistoriasAntiguas, 60000);

// Botones de emergencia (policía, bomberos y ambulancia)
const botonesEmergencia = document.querySelectorAll(".policia, .bomberos, .ambulancia, .reiniciar");

// Función para manejar los eventos de botones
if (botonesEmergencia.length > 0) {
    botonesEmergencia.forEach(boton => {
        boton.addEventListener("click", () => {
            // Obtenemos la clase del boton
            const tipoEmergencia = boton.classList[0];
            // Botón de policía
            if (tipoEmergencia === "policia") {
                crearHistoria("EMERGENCIA: POLICÍA en camino");
            }
            // Botón de bomberos
            else if (tipoEmergencia === "bomberos") {
                crearHistoria("EMERGENCIA: BOMBEROS en camino");
            }
            // Botón de ambulancia
            else if (tipoEmergencia === "ambulancia") {
                crearHistoria("EMERGENCIA: AMBULANCIA en camino");
            }
            // Botón de reiniciar
            else if (tipoEmergencia === "reiniciar") {
                // Borramos las historias del localStorage
                localStorage.removeItem("historias");
                if (contenedorHistorial) {
                    contenedorHistorial.innerHTML = "";
                }
                crearHistoria("EMERGENCIA: REINICIO del sistema");
            }
        });
    });
}

// Switches de la interfaz
const switches = document.querySelectorAll(".switch input[type='checkbox']");

// Slider modo-casa
const slider = document.querySelector(".slider");

// Función para almacenar el estado de los switches y sliders en el localStorage
export function guardarModos() {
    const modos = [];
    // Verificamos si hay switches en la página actual
    if (switches.length > 0) {
        // Guardamos el estado de cada switch
        switches.forEach(switchInput => {
            modos.push({
                id: switchInput.id,
                estado: switchInput.checked
            });
        });
    } else {
        // Si no hay switches, obtenemos los valores actuales del localStorage
        const modosGuardados = JSON.parse(localStorage.getItem("modos")) || [];
        // Copiamos los primeros 4 elementos (los switches)
        for (let i = 0; i < 4 && i < modosGuardados.length; i++) {
            modos.push(modosGuardados[i]);
        }
    }
    // Verificamos si hay slider en la página actual
    if (slider) {
        // Guardamos el estado del slider como el último elemento
        modos.push({
            id: slider.id,
            estado: slider.value
        });
    } else {
        // Si no hay slider, obtenemos el valor actual del localStorage
        const modosGuardados = JSON.parse(localStorage.getItem("modos")) || [];
        // Si existe el valor del slider, lo usamos
        if (modosGuardados.length >= 5) {
            modos.push(modosGuardados[4]);
        } else {
            // Si no existe, usamos un valor por defecto
            modos.push({
                id: "modocasa",
                estado: 1
            });
        }
    }
    // Guardamos la lista completa en el localStorage
    localStorage.setItem("modos", JSON.stringify(modos));
}

// Función para restaurar el estado de los switches y sliders desde el localStorage
function restaurarModos() {
    const modos = JSON.parse(localStorage.getItem("modos")) || [];
    // Solo intentamos restaurar si hay elementos en la página
    if (modos.length > 0) {
        // Recorremos los modos guardados y restauramos el estado
        modos.forEach(modo => {
            let elemento = document.getElementById(modo.id);
            if (elemento) {
                // Si es un input checkbox (switch)
                if (elemento.type === "checkbox") {
                    elemento.checked = modo.estado;
                } 
                // Si es un input range (slider)
                else if (elemento.type === "range") {
                    elemento.value = modo.estado;
                }
            }
        });
    }
}

// Al recargar la página, restauramos los estados de los switches y sliders
restaurarModos();

// Configuramos los eventos solo si existen elementos en la página
if (switches.length > 0) {
    // Función para manejar los eventos de los switches
    switches.forEach(switchInput => {
        switchInput.addEventListener("change", () => {
            // Obtenemos el id del switch
            const tipo = switchInput.id;
            // Switch de puertas
            if (tipo === "switch-puertas") {
                // Si se activa el switch, bloqueamos puertas
                if (switchInput.checked) {
                    crearHistoria("ESTADO: Puertas BLOQUEADAS");
                }
                // Si no se activa, desbloqueamos puertas
                else {
                    crearHistoria("ESTADO: Puertas DESBLOQUEADAS");
                }
            }
            // Switch de ventanas
            else if (tipo === "switch-ventanas") {
                // Si se activa el switch, bloqueamos ventanas
                if (switchInput.checked) {
                    crearHistoria("ESTADO: Ventanas BLOQUEADAS");
                }
                // Si no se activa, desbloqueamos ventanas
                else {
                    crearHistoria("ESTADO: Ventanas DESBLOQUEADAS");
                }
            }
            // Switch modo dia/noche
            else if (tipo === "switch-dianoche") {
                // Si se activa el switch, modo noche
                if (switchInput.checked) {
                    crearHistoria("ESTADO: Modo NOCHE activado");
                }
                // Si no se activa, modo día
                else {
                    crearHistoria("ESTADO: Modo DÍA activado");
                }
            }
            // Switch buzon electrónico
            else if (tipo === "switch-buzon") {
                // Si se activa el switch, buzón electrónico activado
                if (switchInput.checked) {
                    crearHistoria("ESTADO: Buzón electrónico CERRADO");
                }
                // Si no se activa, buzón electrónico desactivado
                else {
                    crearHistoria("ESTADO: Buzón electrónico ABIERTO");
                }
            }
            // Guardamos el estado en el localStorage
            guardarModos();
        });
    });
}

// Configuramos los eventos del
if (slider) {
    // Función para manejar el evento del slider
    slider.addEventListener("input", () => {
        // Obtenemos el valor del slider
        const valor = slider.value;
        // Modo ahorro
        if (valor === '0'){
            crearHistoria("ESTADO: Cambio a modo AHORRO");
        }
        // Modo hogar
        else if (valor === '1'){
            crearHistoria("ESTADO: Cambio a modo HOGAR");
        }
        // Modo valor
        else if (valor === '2'){
            crearHistoria("ESTADO: Cambio a modo FUERA")
        }
        // Guardamos el estado en el localStorage
        guardarModos();
    });
}

// Limpiamos el historial cuando se cambia de página
window.addEventListener('beforeunload', () => {
    clearInterval(intervaloHistorias);
});
