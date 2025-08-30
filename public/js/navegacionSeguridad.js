
// JS de navegación y manejo de elementos de seguridad con el teclado y el movimiento del móvil

// Importación de funciones de otros módulos necesarias
import { crearHistoria, guardarModos } from "./seguridad.js";

// 1. Manejo con el teclado

// Elementos interactivos de la interfaz
let elementosInteractivos = [];
// Botones de emergencia
elementosInteractivos.push(...document.querySelectorAll(".policia, .bomberos, .ambulancia"));
// Switch de puertas
elementosInteractivos.push(document.getElementById("switch-puertas"));
// Switch de ventanas
elementosInteractivos.push(document.getElementById("switch-ventanas"));
// Slider modo-casa
elementosInteractivos.push(document.querySelector(".slider"));
// Switch de modo día/noche
elementosInteractivos.push(document.getElementById("switch-dianoche"));
// Switch de buzón
elementosInteractivos.push(document.getElementById("switch-buzon"));
// Botón de reinicio
elementosInteractivos.push(document.querySelector(".reiniciar"));
// Botones de las cámaras
elementosInteractivos.push(document.querySelector(".camaras #retroceder"));
elementosInteractivos.push(document.querySelector(".camaras #avanzar"));

// console.log(elementosInteractivos);

// Función para crear historias dependiendo de la opción seleccionada
function aceptarOpcion(){
    const elementoActual = document.activeElement;
    // Pulsar botón de policía
    if (elementoActual.classList.contains("policia")) {
        crearHistoria("EMERGENCIA: POLICÍA en camino");
    } 
    // Pulsar botón de bomberos
    else if (elementoActual.classList.contains("bomberos")) {
        crearHistoria("EMERGENCIA: BOMBEROS en camino");
    } 
    // Pulsar botón de ambulancia
    else if (elementoActual.classList.contains("ambulancia")) {
        crearHistoria("EMERGENCIA: AMBULANCIA en camino");
    } 
    // Pulsar switch de puertas
    else if (elementoActual.id === "switch-puertas") {
        elementoActual.checked = !elementoActual.checked;
        crearHistoria(`ESTADO: Puertas ${elementoActual.checked ? "bloqueadas" : "desbloqueadas"}`);
        guardarModos();
    } 
    // Pulsar switch de ventanas
    else if (elementoActual.id === "switch-ventanas") {
        elementoActual.checked = !elementoActual.checked;
        crearHistoria(`ESTADO: Ventanas ${elementoActual.checked ? "bloqueadas" : "desbloqueadas"}`);
        guardarModos();
    } 
    // Pulsar switch de modo casa
    else if (elementoActual.classList.contains("slider")) {
        crearHistoria(`ESTADO: Modo casa ajustado a ${elementoActual.value}`);
        guardarModos();
    }
    // Pulsar switch de modo día/noche
    else if (elementoActual.id === "switch-dianoche") {
        elementoActual.checked = !elementoActual.checked;
        crearHistoria(`ESTADO: Modo ${elementoActual.checked ? "noche activado" : "día activado"}`);
        guardarModos();
    } 
    // Pulsar switch de buzón
    else if (elementoActual.id === "switch-buzon") {
        elementoActual.checked = !elementoActual.checked;
        crearHistoria(`ESTADO: Buzón electrónico ${elementoActual.checked ? "cerrado" : "abierto"}`);
        guardarModos();
    } 
    // Pulsar botón de reinicio
    else if (elementoActual.classList.contains("reiniciar")) {
        // Reiniciar el sistema
        localStorage.removeItem("historias");
        const contenedorHistorial = document.querySelector(".contenedor-historias");
        contenedorHistorial.innerHTML = "";
        crearHistoria("EMERGENCIA: REINICIO del sistema");
    }
    // Pulsar botón de retroceder cámara
    else if (elementoActual.id === "retroceder") {
        indice = (indice - 1 + camaras.length) % camaras.length;
        actualizarCamara();
        crearHistoria("CÁMARA: Retrocediendo cámara");
    }
    // Pulsar botón de avanzar cámara
    else if (elementoActual.id === "avanzar") {
        indice = (indice + 1) % camaras.length;
        actualizarCamara();
        crearHistoria("CÁMARA: Avanzando cámara");
    }
}


// Evento de navegación por la interfaz con el teclado
document.addEventListener("keydown", (e) => {
    const indiceActual = elementosInteractivos.indexOf(document.activeElement);
    if (e.key === "ArrowRight") {
        // Navegar hacia la derecha
        const siguienteIndice = (indiceActual + 1) % elementosInteractivos.length;
        elementosInteractivos[siguienteIndice].focus();
        e.preventDefault();
    } else if (e.key === "ArrowLeft") {
        // Navegar hacia la izquierda
        const anteriorIndice = (indiceActual - 1 + elementosInteractivos.length) % elementosInteractivos.length;
        elementosInteractivos[anteriorIndice].focus();
        e.preventDefault();
    } else if (e.key === "Enter") {
        // Detenemos la propagación del evento para evitar duplicados
        e.preventDefault();
        e.stopPropagation();
        // Acción al pulsar Enter
        aceptarOpcion();
    }
});


// 2. Manejo con el móvil

// Evento de detección de inclinación del movil hacia los lados
socket.on('command', (data) => {
    if (data.action === 'inclinacion_lateral_lenta'){
        if (data.target === 'derecha'){
            // Navegar a la derecha
            const indiceActual = elementosInteractivos.indexOf(document.activeElement);
            const siguienteIndice = (indiceActual + 1) % elementosInteractivos.length;
            elementosInteractivos[siguienteIndice].focus();
        }
        else if (data.target === 'izquierda'){
            // Navegar a la izquierda
            const indiceActual = elementosInteractivos.indexOf(document.activeElement);
            const anteriorIndice = (indiceActual - 1 + elementosInteractivos.length) % elementosInteractivos.length;
            elementosInteractivos[anteriorIndice].focus();
        }
    }
    // Acción al tocar dos veces la pantalla para presionar un botón
    if (!document.activeElement.classList.contains("slider")) {
        if (data.action === 'dobletap'){
            // Acción al pulsar Enter
            aceptarOpcion();
        }
    }
    // Acción para deslizar hacia la derecha o izquierda y cambiar el modo de la casa
    else {
        if (data.action === 'scroll_lateral'){
            let slider = document.getElementById("modocasa");
            // Deslizamientos hacia la derecha o izquierda
            if (data.target === 'derecha' && slider.value <2){
                slider.value += 1;
            }
            else if (data.target === 'izquierda' && slider.value > 0){
                slider.value -= 1;
            }
            // Modo ahorro
            if (slider.value === '0'){
                crearHistoria("ESTADO: Cambio a modo AHORRO");
            }
            // Modo hogar
            else if (slider.value === '1'){
                crearHistoria("ESTADO: Cambio a modo HOGAR");
            }
            // Modo valor
            else if (slider.value === '2'){
                crearHistoria("ESTADO: Cambio a modo FUERA")
            }
            // Guardamos el estado en el localStorage
            guardarModos();
        }
    }
});