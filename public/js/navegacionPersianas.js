
// JS de navegación y manejo de persianas con el teclado y el movimiento del móvil

document.addEventListener("DOMContentLoaded", () => {

    // 1. Manejo con el teclado

    // Manejo de los sliders con las flechas del teclado

    // Seleccionamos todas las celdas de las persianas
    const celdas = document.querySelectorAll(".persiana");
    // Seleccionamos la imagen del mapa de la casa
    const mapaCasa = document.querySelector(".mapa-casa img");
    // Inicializamos el índice de la celda seleccionada y la celda seleccionada
    let indiceSeleccionado = 0;
    let celdaSeleccionada = null;
    // Función para manejar la selección de persianas
    function manejarPersiana() {
        celdas.forEach((celda, index) => {
            // Si la celda es seleccionada, se le asigna el id "seleccionado"
            if (index === indiceSeleccionado) {
                celda.id = "seleccionado";
                celdaSeleccionada = celda;
                // Cambiamos la imagen del mapa de la casa según el atributo data-imagen
                const nuevaImagen = celda.getAttribute("data-imagen");
                if (nuevaImagen) {
                    mapaCasa.src = nuevaImagen;
                }
            } 
            // En caso de que no sea la seleccionada, se le quita el id "seleccionado"
            else {
                celda.removeAttribute("id");
            }
        });
    }

    // Función para actualizar la imagen según el porcentaje
    function actualizarEstado(porcentaje, celda) {
        // Obtenemos la imagen de la celda seleccionada
        const imagen = celda.querySelector(".texto img");
        // Si la persiana está bajada (0-25%)
        if (porcentaje >= 0 && porcentaje <= 25) {
            imagen.src = "../img/blindsclosed.png";
            imagen.alt = "Persiana cerrada";
        } 
        // Si la persiana está parcialmente levantada (26-75%)
        else if (porcentaje >= 26 && porcentaje <= 75) {
            imagen.src = "../img/blindsopened.png";
            imagen.alt = "Persiana parcialmente levantada";
        } 
        // Si la persiana está completamente levantada (76-100%)
        else if (porcentaje >= 76 && porcentaje <= 100) {
            imagen.src = "../img/blindsraised.png";
            imagen.alt = "Persiana completamente abierta";
        }
    }

    // Función para guardar el estado de las persianas en localStorage
    function guardarEstado() {
        const estados = Array.from(celdas).map(celda => {
            const slider = celda.querySelector("input[type='range']");
            return parseInt(slider.value, 10);
        });
        // Guardamos el estado de las persianas en localStorage
        localStorage.setItem("persianas", JSON.stringify(estados));
    }

    // Función para restaurar el estado de las persianas desde localStorage
    function restaurarPersianas() {
        const estadosGuardados = JSON.parse(localStorage.getItem("persianas")) || [];
        // Restauramos el estado de las persianas desde localStorage
        celdas.forEach((celda, index) => {
            const slider = celda.querySelector("input[type='range']");
            const porcentaje = estadosGuardados[index] || 0;
            slider.value = porcentaje;
            const porcentajeTexto = slider.nextElementSibling;
            porcentajeTexto.textContent = `${porcentaje}%`;
            actualizarEstado(porcentaje, celda);
        });
    }

    // Eventos del teclado
    document.addEventListener("keydown", (event) => {
        // Si la flecha -> o <- es presionada, se cambia la celda seleccionada
        if (event.key === "ArrowRight") {
            indiceSeleccionado = (indiceSeleccionado + 1) % celdas.length;
            manejarPersiana();
        } else if (event.key === "ArrowLeft") {
            indiceSeleccionado = (indiceSeleccionado - 1 + celdas.length) % celdas.length;
            manejarPersiana();
        } 
        // Si las flechas de arriba o abajo son presionadas, se cambia el valor del slider
        else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            if (celdaSeleccionada) {
                const slider = celdaSeleccionada.querySelector("input[type='range']");
                if (slider) {
                    let nuevoValor = parseInt(slider.value, 10);
                    // Aumenta o disminuye el valor del slider según la tecla presionada
                    if (event.key === "ArrowUp") {
                        nuevoValor = Math.min(nuevoValor + 1, slider.max);
                    } else if (event.key === "ArrowDown") {
                        nuevoValor = Math.max(nuevoValor - 1, slider.min);
                    }
                    slider.value = nuevoValor;
                    const porcentajeTexto = slider.nextElementSibling;
                    porcentajeTexto.textContent = `${nuevoValor}%`;
                    // Actualizamos la imagen según el nuevo valor
                    actualizarEstado(nuevoValor, celdaSeleccionada);
                    // Guardamos el estado de las imágenes
                    guardarEstado();
                }
            }
        }
    });

    // Evento para guardar el estado al mover el slider
    document.querySelectorAll(".slider input").forEach(slider => {
        slider.addEventListener("input", () => {
            const porcentaje = slider.nextElementSibling;
            porcentaje.textContent = `${slider.value}%`;
            const celda = slider.closest(".persiana");
            actualizarEstado(parseInt(slider.value, 10), celda);
            // Guardamos el estado de las imágenes
            guardarEstado();
        });
    });

    // Inicializamos la selección de persianas y restauramos los valores al cargar la página
    manejarPersiana();
    restaurarPersianas();

    // 2. Manejo con el movimiento del móvil

    // Evento de detección de inclinación del movil hacia los lados
    socket.on('command', (data) => {
        // console.log("Comando recibido en cliente:", data);
        if (data.action === 'inclinacion_lateral_lenta') {
            if (data.target === 'derecha') {
                indiceSeleccionado = (indiceSeleccionado + 1) % celdas.length;
                manejarPersiana();
            } else if (data.target === 'izquierda') {
                indiceSeleccionado = (indiceSeleccionado - 1 + celdas.length) % celdas.length;
                manejarPersiana();
            }   
        }
    });

    // Variable para detectar si se esta pulsando o no
    let pulsando = false;
    socket.on("command", (data) => {
        if (data.action === 'pulsando') {
            pulsando = true;
        }
    });
    socket.on("command", (data) => {
        if (data.action === 'soltar') {
            pulsando = false;
        }
    });

    // Se cambia el valor del slider al inclinar el movil adelante o atras y pulsar a la vez
    socket.on("command", (data) => {
        // console.log("Comando recibido en cliente:", data);
        if( data.action === 'inclinacion_frontal' && pulsando) {
            const slider = celdaSeleccionada.querySelector("input[type='range']");
            // Se adquiere el grado de la inclinación y se multuplica por una constante de sensibilidad
            const inclinacion = data.target;
            const sensibilidad = 0.1;
            // Se actualiza el valor del slider según la inclinación y la sensibilidad
            let nuevoValor = parseInt(slider.value, 10);
            nuevoValor += Math.round(inclinacion * sensibilidad);
            // Aseguramos que el valor se mantenga dentro de los límites
            nuevoValor = Math.max(slider.min, Math.min(nuevoValor, slider.max));
            // Actualizamos el valor del slider y el texto del porcentaje
            slider.value = nuevoValor;
            const porcentajeTexto = slider.nextElementSibling;
            porcentajeTexto.textContent = `${nuevoValor}%`;
            // Actualizamos la imagen según el nuevo valor
            actualizarEstado(nuevoValor, celdaSeleccionada);
            // Guardamos el estado de las imágenes
            guardarEstado();
        }
    });
});
