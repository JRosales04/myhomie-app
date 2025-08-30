
// JS para mostrar la fecha actual en cada HTML

// Función para mostrar la fecha actual
function mostrarFecha() {
    const fechaElemento = document.getElementById('fecha');
    const hoy = new Date();
    // El formato de la fecha es "día de la semana, día mes año"
    const formato = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = hoy.toLocaleDateString('es-ES', formato);
    // Mostramos la fecha en la interfaz
    fechaElemento.textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1); // Capitaliza la primera letra
}

// Ejcutamos la función al cargar la página
mostrarFecha();
