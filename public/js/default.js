
// JS para establecer valores por defecto en el localStorage al inicializar la aplicación
// Sólo funciona en "home.html" (inicio de la app)

// Valores por defecto de cada variable en el localStorage
const aires = [0, 0, 0, 0, 0, 0];
const alarmas = [];
const calefacciones = [0, 0, 0, 0, 0, 0];
const luces = [0, 0, 0, 0, 0, 0];
const media = 22;
const modos = [
    {
        id: "switch-puertas",
        estado: false
    },
    {
        id: "switch-ventanas",
        estado: false
    },
    {
        id: "switch-dianoche",
        estado: false
    },
    {
        id: "switch-buzon",
        estado: false
    },
    {
        id: "modocasa",
        estado: "1"
    },
];
const persianas = [0, 0, 0, 0, 0, 0];
const sonar = false;
const temperaturas = [22, 22, 22, 22, 22, 22];
const historias = [];

// Función para establecer los valores por defecto en el localStorage
function defaultStorage() {
    // Comprobamos si el localStorage ya tiene valores establecidos
    // Si no los tiene, los establecemos con los valores por defecto
    if (!localStorage.getItem("aires")) {
        localStorage.setItem("aires", JSON.stringify(aires));
    }
    if (!localStorage.getItem("alarmas")) {
        localStorage.setItem("alarmas", JSON.stringify(alarmas));
    }
    if (!localStorage.getItem("calefacciones")) {
        localStorage.setItem("calefacciones", JSON.stringify(calefacciones));
    }
    if (!localStorage.getItem("luces")) {
        localStorage.setItem("luces", JSON.stringify(luces));
    }
    if (!localStorage.getItem("media")) {
        localStorage.setItem("media", JSON.stringify(media));
    }
    if (!localStorage.getItem("modos")) {
        localStorage.setItem("modos", JSON.stringify(modos));
    }
    if (!localStorage.getItem("persianas")) {
        localStorage.setItem("persianas", JSON.stringify(persianas));
    }
    if (!localStorage.getItem("sonar")) {
        localStorage.setItem("sonar", JSON.stringify(sonar));
    }
    if (!localStorage.getItem("temperaturas")) {
        localStorage.setItem("temperaturas", JSON.stringify(temperaturas));
    }
    if (!localStorage.getItem("historias")) {
        localStorage.setItem("historias", JSON.stringify(historias));
    }
}

// Llamamos a la función al cargar la página
defaultStorage();