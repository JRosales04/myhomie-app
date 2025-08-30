
// JS de navegación y manejo de luces con el teclado y con el giroscopio

// 1. Navegación con el teclado

// Selección de la luz activa
document.addEventListener("DOMContentLoaded", () => {
    // Extraemos todos los contenedores de clase .luz
    const luces = document.querySelectorAll(".luz");
    // Seleccionamos la imagen del mapa de la casa
    const mapaCasa = document.querySelector(".mapa-casa img"); // Selecciona la imagen del mapa de la casa
    // Inicializamos una variable para almacenar el índice de la luz seleccionada
    let indiceSeleccionado = 0;
    // Función para manejar la selección de luces
    function manejarLuces() {
        luces.forEach((luz, index) => {
            // Si la luz es la seleccionada, le añadimos el id "seleccionado"
            if (index === indiceSeleccionado) {
                luz.id = "seleccionado";
                const nuevaImagen = luz.getAttribute("data-imagen");
                // Cambiamos la imagen del mapa según la luz seleccionada
                if (nuevaImagen) {
                    mapaCasa.src = nuevaImagen;
                }
            } 
            // Si no es la seleccionada, le quitamos el id "seleccionado"
            else {
                luz.removeAttribute("id");
            }
        });
    }

    // Función para cambiar el estado del switch y la imagen de la luz
    function cambiarEstado(luz) {
        // Seleccionamos el switch y el icono dentro del contenedor .luz
        const switchInput = luz.querySelector("input[type='checkbox']");
        const icono = luz.querySelector(".texto img");
        // Inicializamos el estado del switch
        const nuevoEstado = !switchInput.checked;
        switchInput.checked = nuevoEstado;
        // Cambiamos la imagen según el estado del switch
        if (nuevoEstado) {
            // Si está en ON, encendemos la luz
            icono.src = "../img/lightbulbon.png";
            icono.alt = "Luz encendida";
        } else {
            // Si está en OFF, apagamos la luz
            icono.src = "../img/lightbulboff.png";
            icono.alt = "Luz apagada";
        }
        // Guardamos el estado de los switches en localStorage para recuperarlo al reiniciar la página
        guardarEstadoLuces();
    }

    // Función para guardar el estado de los switches en localStorage
    function guardarEstadoLuces() {
        const estados = Array.from(luces).map(luz => {
            const switchInput = luz.querySelector("input[type='checkbox']");
            // Guarda 1 si está encendido, 0 si está apagado
            return switchInput && switchInput.checked ? 1 : 0;
        });
        // Guardamos el array de estados en localStorage
        localStorage.setItem("luces", JSON.stringify(estados));
    }

    // Función para restaurar el estado de los switches desde localStorage
    function restaurarLuces() {
        const estadosGuardados = JSON.parse(localStorage.getItem("luces")) || [];
        // Recorremos cada luz y restauramos su estado
        luces.forEach((luz, index) => {
            const switchInput = luz.querySelector("input[type='checkbox']");
            const icono = luz.querySelector(".texto img");
            const estado = estadosGuardados[index] || 0;
            switchInput.checked = estado === 1;
            // Cambiamos la imagen de la luz según el estado restaurado
            if (estado === 1) {
                icono.src = "../img/lightbulbon.png";
                icono.alt = "Luz encendida";
            } else {
                icono.src = "../img/lightbulboff.png";
                icono.alt = "Luz apagada";
            }
        });
    }

    // Eventos del teclado con las flechas y Enter
    document.addEventListener("keydown", (event) => {
        // Si se presiona la tecla ->, navegamos a la derecha
        if (event.key === "ArrowRight") {
            indiceSeleccionado = (indiceSeleccionado + 1) % luces.length;
            manejarLuces();
        } 
        // Si se presiona la tecla <-, navegamos a la izquierda
        else if (event.key === "ArrowLeft") {
            indiceSeleccionado = (indiceSeleccionado - 1 + luces.length) % luces.length;
            manejarLuces();
        }
        // Si presionamos Enter, cambiamos el estado del switch
        else if (event.key === "Enter") {
            const luzSeleccionada = luces[indiceSeleccionado];
            if (luzSeleccionada) {
                cambiarEstado(luzSeleccionada);
            }
        }
    });

    // Inicializamos la selección de luces
    manejarLuces();
    // Restauramos los estados desde el localStorage
    restaurarLuces();

    // 2. Navegación con el giroscopio

    // Evento de detección de inclinación del movil hacia los lados
    socket.on('command', (data) => {
        // console.log("Comando recibido en cliente:", data);
        if (data.action === 'inclinacion_lateral_lenta') {
            if (data.target === 'derecha') {
                indiceSeleccionado = (indiceSeleccionado + 1) % luces.length;
                manejarLuces();
            } else if (data.target === 'izquierda') {
                indiceSeleccionado = (indiceSeleccionado - 1 + luces.length) % luces.length;
                manejarLuces();
            }   
        }
    });

    // Evento de detección de pulsar doble la pantalla para encender o apagar una luz
    socket.on('command', (data) => {
        if (data.action === 'dobletap') {
            const luzSeleccionada = luces[indiceSeleccionado];
            if (luzSeleccionada) {
                cambiarEstado(luzSeleccionada);
            }
        }
    });
});
