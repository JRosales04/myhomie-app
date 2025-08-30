
// JS de navegación y manejo de alarmas con el teclado y el movimiento del móvil

// 1. Manejo con el teclado

// Función para obtener los elementos interactivos de la interfaz
// Se crea esta función porque las alarmas se agregan dinámicamente, de manera que se pueda actualizar
function obtenerElementosInteractivos() {
    // Devolvemos el botón de agregar alarmas y todas las alarmas creadas
    return [botonAgregar, ...document.querySelectorAll(".alarma")];
}

// Evento de navegación por la interfaz con el teclado
document.addEventListener("keydown", (e) => {
    // Si el modal está abierto, manejamos las teclas dentro del modal
    if (modal.classList.contains("mostrar")) {
        // Obtenemos los elementos interactivos del modal
        const elementosModal = [horasInput, minutosInput, cerrarModal, confirmarAlarma];
        // console.log(elementosModal);
        // Obtenemos el índice del elemento actualmente enfocado
        const indiceActual = elementosModal.indexOf(document.activeElement);
        // console.log(indiceActual);
        // Eventos de navegación con el teclado
        // Navegar hacia la derecha
        if (e.key === "ArrowRight") {
            const siguienteIndice = (indiceActual + 1) % elementosModal.length;
            elementosModal[siguienteIndice].focus();
            e.preventDefault();
        } 
        // Navegar hacia la izquierda
        else if (e.key === "ArrowLeft") {
            const anteriorIndice = (indiceActual - 1 + elementosModal.length) % elementosModal.length;
            elementosModal[anteriorIndice].focus();
            e.preventDefault();
        } 
        // Ajustar horas y minutos con las flechas de arriba y abajo
        else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            if (document.activeElement === horasInput || document.activeElement === minutosInput) {
                const incremento = e.key === "ArrowUp" ? 1 : -1;
                // Ajustar la hora
                if (document.activeElement === horasInput) {
                    let horas = parseInt(horasInput.value, 10) || 0;
                    // Comprobamos que la hora no exceda el rango de 0 a 23
                    horas = (horas + incremento + 24) % 24;
                    horasInput.value = String(horas).padStart(2, "0");
                } 
                // Ajustar los minutos
                else if (document.activeElement === minutosInput) {
                    let minutos = parseInt(minutosInput.value, 10) || 0;
                    // Comprobamos que los minutos no excedan el rango de 0 a 59
                    minutos = (minutos + incremento + 60) % 60;
                    minutosInput.value = String(minutos).padStart(2, "0");
                }
                e.preventDefault();
            }
        } 
        // Acción al pulsar la tecla Enter
        else if (e.key === "Enter") {
            // Obtenemos el elemento actualmente enfocado
            const elementoActual = document.activeElement;
            // console.log(elementoActual);
            // Si el elemento es el botón de cerrar el modal, lo cerramos
            if (elementoActual === cerrarModal) {
                // Cerramos el modal
                modal.classList.remove("mostrar");
            } 
            // Si el elemento es el botón de confirmar la alarma, creamos una nueva alarma
            else if (elementoActual === confirmarAlarma) {
                // Detenemos la propagación para evitar conflictos con el evento de clic
                e.preventDefault();
                e.stopPropagation();
                // Configuramos las horas y los minutos
                const horas = parseInt(horasInput.value, 10);
                const minutos = parseInt(minutosInput.value, 10);
                if (isNaN(horas) || isNaN(minutos) || horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
                    alert("Por favor, introduce una hora válida.");
                    return;
                }
                // Creamos la alarma
                crearAlarma(horas, minutos);
                // Cerramos el modal
                modal.classList.remove("mostrar");
            }
        }
        // Detenemos la propagación del evento para evitar conflictos
        e.stopPropagation();
    } 
    // Si el modal no está abierto, manejamos los elementos interactivos de la interfaz principal
    else {
        // Obtenemos los elementos interactivos de la intefaz
        const elementosInteractivos = obtenerElementosInteractivos();
        // console.log(elementosInteractivos);
        // Obtenemos el índice del elemento actualmente enfocado
        const indiceActual = elementosInteractivos.indexOf(document.activeElement);
        // console.log(indiceActual);
        // Eventos de navegación con el teclado
        // Navegar hacia abajo
        if (e.key === "ArrowDown") {
            const siguienteIndice = (indiceActual + 1) % elementosInteractivos.length;
            elementosInteractivos[siguienteIndice].focus();
            e.preventDefault();
        } 
        // Navegar hacia arriba
        else if (e.key === "ArrowUp") {
            const anteriorIndice = (indiceActual - 1 + elementosInteractivos.length) % elementosInteractivos.length;
            elementosInteractivos[anteriorIndice].focus();
            e.preventDefault();
        } 
        // Acción al pulsar la tecla Enter
        else if (e.key === "Enter") {
            // Obtenemos el elemento actualmente enfocado
            const elementoActual = document.activeElement;
            // console.log(elementoActual);
            // Si el elemento es el botón de agregar alarmas, mostramos el modal
            if (elementoActual === botonAgregar) {
                if (!modal.classList.contains("mostrar")) {
                    modal.classList.add("mostrar");
                }
                // Detenemos la propagación del evento para evitar conflictos
                e.stopPropagation();
            } 
            // Si el elemento es una alarma, alternamos su estado (activada/desactivada)
            else if (elementoActual.classList.contains("alarma")) {
                const switchInput = elementoActual.querySelector("input[type='checkbox']");
                switchInput.checked = !switchInput.checked;
                // Actualizamos las alarmas en el localStorage
                guardarAlarmas();
            }
        }
    }
});

// Evento para detener la alarma pulsando la tecla Espacio
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        // Detenemos el sonido de la alarma y reiniciamos el audio
        audio.pause();
        audio.currentTime = 0;
        // Cambiamos el estado de "sonar" a false en el localStorage
        localStorage.setItem("sonar", false);
        // Obtenemos las alarmas guardadas en el localStorage
        const alarmasGuardadas = JSON.parse(localStorage.getItem("alarmas")) || [];
        // Obtenemos la hora actual
        const horaActual = obtenerHoraActual();
        // Actualizamos el estado de la alarma que coincide con la hora actual
        const alarmasActualizadas = alarmasGuardadas.map((alarma) => {
            if (alarma.hora === horaActual) {
                // Desactivamos la alarma
                return { ...alarma, activa: false };
            }
            return alarma;
        });
        // Guardamos las alarmas actualizadas en el localStorage
        localStorage.setItem("alarmas", JSON.stringify(alarmasActualizadas));
        // Restauramos las alarmas en la interfaz
        restaurarAlarmas();
    }
});

// 2. Manejo con el movimiento del móvil

// Variable para detectar si la pantalla está siendo pulsada
let pulsando = false;

// Evento para manejar si la pantalla se pulsa o no y para los comandos del móvil
socket.on('command', (data) => {
    if (data.action === 'pulsando') {
        pulsando = true;
        return;
    } else if (data.action === 'soltar') {
        pulsando = false;
        return;
    }
    // Verificamos si el modal está abierto
    if (modal.classList.contains("mostrar")) {
        // Función para manejar la navegación dentro del modal
        // console.log("Modal abierto");
        manejarNavegacionModal(data);
    } else {
        // Función para manejar la navegación en la interfaz principal
        // console.log("Modal cerrado");
        manejarNavegacionPrincipal(data); // Función para manejar la navegación en la interfaz principal
    }
});

// Función para manejar la navegación dentro del modal
function manejarNavegacionModal(data) {
    // Obtenemos los elementos interactivos del modal
    const elementosModal = [horasInput, minutosInput, cerrarModal, confirmarAlarma];
    // Obtenemos el índice del elemento actualmente enfocado
    const indiceActual = elementosModal.indexOf(document.activeElement);
    // Navegamos con inclinaciones laterales dentro del modal
    if (data.action === 'inclinacion_lateral_lenta') {
        if (data.target === 'derecha') {
            const siguienteIndice = (indiceActual + 1) % elementosModal.length;
            elementosModal[siguienteIndice].focus();
        } else if (data.target === 'izquierda') {
            const anteriorIndice = (indiceActual - 1 + elementosModal.length) % elementosModal.length;
            elementosModal[anteriorIndice].focus();
        }
    }
    
    // Tiempo del último ajuste e intervalo mínimo entre ajustes
    let ultimoAjuste = 0;
    const intervaloAjuste = 500;
    
    // Ajuste de horas y minutos con inclinación frontal
    if ((document.activeElement === horasInput || document.activeElement === minutosInput) &&
        data.action === 'inclinacion_frontal' && pulsando) {
        // Obtenemos el tiempo actual
        const ahora = Date.now();
        // Verificamos si ha pasado suficiente tiempo desde el último ajuste
        if (ahora - ultimoAjuste >= intervaloAjuste) {
            // Actualizamos el tiempo del último ajuste
            ultimoAjuste = ahora; 
            // Obtenemos el grado de inclinación
            const inclinacion = data.target;
            // Ajustamos horas o minutos según la inclinación
            if (document.activeElement === horasInput) {
                let horas = parseInt(horasInput.value, 10) || 0;
                horas += Math.sign(inclinacion);
                // Aseguramos que las horas estén en el rango 0-23
                horas = (horas + 24) % 24;
                horasInput.value = String(horas).padStart(2, "0");
            } else if (document.activeElement === minutosInput) {
                let minutos = parseInt(minutosInput.value, 10) || 0;
                minutos += Math.sign(inclinacion);
                // Aseguramos que los minutos estén en el rango 0-59
                minutos = (minutos + 60) % 60;
                minutosInput.value = String(minutos).padStart(2, "0");
            }
        }
    }

    // Confirmar o cerrar modal con doble tap
    if (data.action === 'dobletap') {
        const elementoActual = document.activeElement;
        if (elementoActual === cerrarModal) {
            modal.classList.remove("mostrar");
        } else if (elementoActual === confirmarAlarma) {
            const horas = parseInt(horasInput.value, 10);
            const minutos = parseInt(minutosInput.value, 10);
            if (isNaN(horas) || isNaN(minutos) || horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
                alert("Por favor, introduce una hora válida.");
                return;
            }
            crearAlarma(horas, minutos);
            modal.classList.remove("mostrar");
            location.reload();
        }
    }
}

// Función para manejar la navegación en la interfaz principal
function manejarNavegacionPrincipal(data) {
    // Obtenemos el botón de agregar alarmas y todas las alarmas
    const elementosInteractivos = obtenerElementosInteractivos();
    // Obtenemos el índice del elemento actualmente enfocado
    const indiceActual = elementosInteractivos.indexOf(document.activeElement);
    // Navegamos en la interfaz principal con inclinaciones laterales
    if (data.action === 'inclinacion_lateral_lenta') {
        if (data.target === 'derecha') {
            const siguienteIndice = (indiceActual + 1) % elementosInteractivos.length;
            elementosInteractivos[siguienteIndice].focus();
        } else if (data.target === 'izquierda') {
            const anteriorIndice = (indiceActual - 1 + elementosInteractivos.length) % elementosInteractivos.length;
            elementosInteractivos[anteriorIndice].focus();
        }
    }
    // Confirmamos acciones con doble tap
    if (data.action === 'dobletap') {
        const elementoActual = document.activeElement;
        // Si es el botón de agregar alarmas, mostramos el modal
        if (elementoActual === botonAgregar) {
            if (!modal.classList.contains("mostrar")) {
                modal.classList.add("mostrar");
            }
        } 
        // Si es una alarma, cambiamos su estado
        else if (elementoActual.classList.contains("alarma")) {
            const switchInput = elementoActual.querySelector("input[type='checkbox']");
            switchInput.checked = !switchInput.checked;
            guardarAlarmas();
        }
    }
    // Detener alarma con agitación del dispositivo
    if (data.action === 'agitar') {
        // Detenemos el sonido de la alarma y reiniciamos el audio
        audio.pause();
        audio.currentTime = 0;
        // Actualizamos el localStorage
        localStorage.setItem("sonar", false);
        // Cambiamos el estado de la alarma a desactivada
        const alarmasGuardadas = JSON.parse(localStorage.getItem("alarmas")) || [];
        const horaActual = obtenerHoraActual();
        const alarmasActualizadas = alarmasGuardadas.map((alarma) => {
            if (alarma.hora === horaActual) {
                return { ...alarma, activa: false };
            }
            return alarma;
        });
        // Guardamos las alarmas actualizadas en el localStorage
        localStorage.setItem("alarmas", JSON.stringify(alarmasActualizadas));
        restaurarAlarmas();
    }
}
