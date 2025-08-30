
// JS de navegación y manejo de temperaturas con el teclado y el movimiento del móvil

document.addEventListener("DOMContentLoaded", () => {

    // 1. Manejo con el teclado

    // Manejo de los sliders con las flechas del teclado

    // Seleccionamos todas las celdas de las temperaturas
    const celdas = document.querySelectorAll(".temperatura");
    // Seleccionamos la imagen del mapa de la casa
    const mapaCasa = document.querySelector(".mapa-casa img");
    // Inicializamos el índice de la celda seleccionada y la celda seleccionada
    let indiceSeleccionado = 0;
    let celdaSeleccionada = null;
    // Función para manejar la selección de temperaturas
    function manejarTemperatura() {
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

    // Función para guardar el estado de las temperaturas en localStorage
    function guardarEstado() {
        const estados = Array.from(celdas).map(celda => {
            const slider = celda.querySelector("input[type='range']");
            return parseInt(slider.value, 10);
        });
        // Guardamos el estado de las temperaturas en localStorage
        localStorage.setItem("temperaturas", JSON.stringify(estados));
    }

    // Función para restaurar el estado de las temperaturas desde localStorage
    function restaurarTemperaturas() {
        const estadosGuardados = JSON.parse(localStorage.getItem("temperaturas")) || [];
        // Restauramos el estado de las temperaturas desde localStorage
        celdas.forEach((celda, index) => {
            const slider = celda.querySelector("input[type='range']");
            const porcentaje = estadosGuardados[index] || 0;
            slider.value = porcentaje;
            const porcentajeTexto = slider.nextElementSibling;
            porcentajeTexto.textContent = `${porcentaje}ºC`;
        });
    }

    // Función para calcular la temperatura media
    function calcularTemperaturaMedia() {
        // Obtenemos la media de las temperaturas guardadas en localStorage
        const estadosGuardados = JSON.parse(localStorage.getItem("temperaturas"));
        // Calculamos la temperatura media
        const sumaTemperaturas = estadosGuardados.reduce((acumulador, temperatura) => acumulador + temperatura, 0);
        const temperaturaMedia = sumaTemperaturas / temperaturas.length;
        // Guardamos la temperatura media en el localStorage
        localStorage.setItem("media", temperaturaMedia.toFixed(2));
    }

    // Función para calcular la potencia de los calefactores y aire acondicionado de cada habitación
    function calcularPotencia() {
        // Obtenemos los valores de de temperaturas de las habitaciones
        const temperaturas = JSON.parse(localStorage.getItem("temperaturas"));
        // Almacenamiento de porcentajes de calefacción y aire acondicionado
        let calefacciones = [];
        let aires = [];
        // Temperaturas base y límites
        const tempBase = 22;
        const tempMin = 15;
        const tempMax = 30;
        // Recorremos las temperaturas de las habitaciones
        temperaturas.forEach((temperatura) => {
            // Calculamos el porcentaje de calefacción y aire acondicionado activado en cada habitación
            let aire = 0;
            let calefaccion = 0;
            if (temperatura < tempBase) {
                aire = ((tempBase - temperatura) / (tempBase - tempMin)) * 100;
            } 
            else if (temperatura > tempBase) {
                calefaccion = ((temperatura - tempBase) / (tempMax - tempBase)) * 100;
            }
            // Almacenamos los porcentajes en los arrays
            aires.push(Math.round(Math.min(aire, 100)));
            calefacciones.push(Math.round(Math.min(calefaccion, 100)));
        });
        // Guardamos los porcentajes en el localStorage
        localStorage.setItem("aires", JSON.stringify(aires));
        localStorage.setItem("calefacciones", JSON.stringify(calefacciones));
    }

    // Eventos del teclado
    document.addEventListener("keydown", (event) => {
        // Si la flecha -> o <- es presionada, se cambia la celda seleccionada
        if (event.key === "ArrowRight") {
            indiceSeleccionado = (indiceSeleccionado + 1) % celdas.length;
            manejarTemperatura();
        } else if (event.key === "ArrowLeft") {
            indiceSeleccionado = (indiceSeleccionado - 1 + celdas.length) % celdas.length;
            manejarTemperatura();
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
                    porcentajeTexto.textContent = `${nuevoValor}ºC`;
                    // Guardamos el estado de las imágenes
                    guardarEstado();
                    // Calculamos la temperatura media y la almacenamos en el localStorage
                    calcularTemperaturaMedia();
                    // Calculamos la potencia de los calefactores y aire acondicionado
                    calcularPotencia();
                }
            }
        }
    });

    // Evento para guardar el estado al mover el slider
    document.querySelectorAll(".slider input").forEach(slider => {
        slider.addEventListener("input", () => {
            const porcentaje = slider.nextElementSibling;
            porcentaje.textContent = `${slider.value}ºC`;
            // Guardamos el estado de las imágenes
            guardarEstado();
            // Calculamos la temperatura media y la almacenamos en el localStorage
            calcularTemperaturaMedia();
        });
    });

    // Temperaturas de las habitaciones
    const temperaturas = document.querySelectorAll(".temperatura-actual");
    // console.log(temperaturas);

    // Porcentaje del slider
    const porcentajes = document.querySelectorAll(".porcentaje");
    // console.log(porcentajes);

    // Función de asignación de temperaturas al actualizar la página
    function reiniciarTemperaturas() {
        // Asignamos los valores según los porcentajes
        temperaturas.forEach((temperatura, index) => {
            temperatura.textContent = porcentajes[index].textContent;
        });

    }    
    // Inicializamos la selección de temperaturas y restauramos los valores al cargar la página
    manejarTemperatura();
    restaurarTemperaturas();
    reiniciarTemperaturas();
    calcularTemperaturaMedia();

    // Función de graduación de temperaturas según el slider
    function graduarTemperaturas() {
        temperaturas.forEach((temperatura, index) => {
            // Obtenemos el valor actual de la temperatura y el porcentaje objetivo
            const valorActual = parseFloat(temperatura.textContent.replace("ºC", ""));
            const valorObjetivo = parseFloat(porcentajes[index].textContent.replace("ºC", ""));
            // Gradualmente ajustamos la temperatura hacia el valor objetivo
            if (valorActual > valorObjetivo) {
                temperatura.textContent = (valorActual - 0.2).toFixed(1) + "ºC";
            } else if (valorActual < valorObjetivo) {
                temperatura.textContent = (valorActual + 0.2).toFixed(1) + "ºC";
            }
        });
    }

    // Ejecutamos la función de graduación cada segundo y medio (1200 mseg)
    setInterval(graduarTemperaturas, 1200);

    // 2. Manejo con el movimiento del móvil

    // Evento de detección de inclinación del móvil hacia los lados para cambiar de celda
    socket.on('command', (data) => {
        // console.log("Comando recibido en cliente:", data);
        if (data.action === 'inclinacion_lateral_lenta') {
            if (data.target === 'derecha') {
                indiceSeleccionado = (indiceSeleccionado + 1) % celdas.length;
                manejarTemperatura();
            } else if (data.target === 'izquierda') {
                indiceSeleccionado = (indiceSeleccionado - 1 + celdas.length) % celdas.length;
                manejarTemperatura();
            }   
        }
    });
    
    // Se cambiara el valor del slider al pulsar e inclinar el movil hacia adelante o atras

    // Variable para confirmar que la pantalla está siendo pulsada
    let pulsando = false;

    // Eventos de detección de pulsación y liberación de la pantalla
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

    // Variable para almacenar el acumulador de inclinación
    let acumulador = 0;

    // Evento de detección de inclinación del móvil hacia adelante o atrás
    socket.on("command", (data) => {
        if (data.action === 'inclinacion_frontal' && pulsando && celdaSeleccionada) {
            // Obtenemos el slider de la celda seleccionada
            const slider = celdaSeleccionada.querySelector("input[type='range']");
            if (!slider) return;
            // Obtenemos el valor de inclinación y configuramos la sensibilidad del movimiento
            const inclinacion = data.target;
            const sensibilidad = 0.02;
            // Acumulamos el valor de inclinación multiplicado por la sensibilidad
            acumulador += inclinacion * sensibilidad;
            // Cuando el acumulador pasa de 1 unidad, aplicamos el cambio
            if (Math.abs(acumulador) >= 1) {
                // Aplicamos el cambio al slider
                let cambio = Math.trunc(acumulador);
                acumulador -= cambio;
                // Aumentamos o disminuimos el valor del slider según la inclinación
                let nuevoValor = parseInt(slider.value, 10) + cambio;
                nuevoValor = Math.max(slider.min, Math.min(nuevoValor, slider.max));
                slider.value = nuevoValor;
                // Actualizamos el texto del slider según el nuevo valor
                const porcentajeTexto = slider.nextElementSibling;
                porcentajeTexto.textContent = `${nuevoValor}ºC`;
                // Guardamos el estado de las temperaturas en el localStorage
                guardarEstado();
                // Calculamos la temperatura media y la almacenamos en el localStorage
                calcularTemperaturaMedia();
                // Calculamos la potencia de los calefactores y aire acondicionado
                calcularPotencia();
            }
        }
    });
});
