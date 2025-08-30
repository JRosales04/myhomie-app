
// JS que maneja los datos de la casa almacenados en el localStorage

// Función para determinar el estado de la casa según los datos del localStorage
function estadoCasa() {
    // Obtenemos los modos actualizados del localStorage
    const modos = JSON.parse(localStorage.getItem("modos"));
    // console.log(modos);
    // Span de la celda con id="estado"
    const estadoSpan = document.querySelector("#estado span");
    // Imagen dentro del span
    const imagen = estadoSpan.querySelector("img");
    // Accedemos al estado de la casa (el último modo guardado)
    const estado = modos[modos.length - 1].estado;
    // console.log(estado);
    // Cambiamos el texto del span según el estado de la casa
    let texto = "";
    if (estado === "0") {
        texto = "Modo Ahorro de energía y recursos en la casa. Consumo mínimo.";
    } else if (estado === "1") {
        texto = "Modo Hogar. Consumo habitual de recursos y energía, personalizable por el usuario.";
    } else if (estado === "2") {
        texto = "Modo Fuera. Sin consumo de energía, excepto el de seguridad.";
    }
    // Limpiamos el contenido del span
    estadoSpan.innerHTML = "";
    // Agregamos la imagen y el texto
    estadoSpan.appendChild(imagen);
    estadoSpan.appendChild(document.createTextNode(texto));
}

// Función para calcular y mostrar la temperatura interior de la casa
function temperaturaMedia() {
    // Span de la celda con id="temperatura"
    const temperaturaSpan = document.querySelector("#temperatura span");
    // Imagen dentro del span
    const imagen = temperaturaSpan.querySelector("img");
    // Limpiamos el contenido del span
    temperaturaSpan.innerHTML = "";
    // Agregamos la imagen
    temperaturaSpan.appendChild(imagen);
    // Obtenemos la temperatura media del localStorage
    const temperaturaMedia = parseFloat(localStorage.getItem("media"));
    temperaturaSpan.appendChild(document.createTextNode(`Temperatura media: ${temperaturaMedia.toFixed(2)} °C`));
}

// Función para calcular el porcentaje de calefacción y aire acondicionado
function calefaccionAire() {
    // Celdas del span con id="calefaccion"
    const calefaccionCeldas = document.querySelectorAll("#calefaccion span div");
    // Contador de celdas
    let contador = 0;
    // Obtenemos el porcentaje de calefacción y aire acondicionado del localStorage
    const calefacciones = JSON.parse(localStorage.getItem("calefacciones"));
    const aires = JSON.parse(localStorage.getItem("aires"));
    // Rellenamos las celdas de las calefacciones
    calefacciones.forEach((calefaccion) => {
        // Obtenemos la celda correspondiente dentro del span
        const celda = calefaccionCeldas[contador];
        // Obtenemos la imagen de la celda
        const imagen = celda.querySelector("img");
        // Limpiamos el contenido de la celda
        celda.innerHTML = "";
        // Agregamos la imagen
        celda.appendChild(imagen);
        // Agregamos el texto como un <p>
        const parrafo = document.createElement("p");
        parrafo.textContent = `${calefaccion}%`;
        celda.appendChild(parrafo);
        // Aumentamos el contador
        contador += 1;
    });
    // Celdas del span con id="calefaccion"
    const aireCeldas = document.querySelectorAll("#aire span div");
    // Contador de celdas
    contador = 0;
    // Rellenamos las celdas de las calefacciones
    aires.forEach((aire) => {
        // Obtenemos la celda correspondiente dentro del span
        const celda = aireCeldas[contador];
        // Obtenemos la imagen de la celda
        const imagen = celda.querySelector("img");
        // Limpiamos el contenido de la celda
        celda.innerHTML = "";
        // Agregamos la imagen
        celda.appendChild(imagen);
        // Agregamos el texto como un <p>
        const parrafo = document.createElement("p");
        parrafo.textContent = `${aire}%`;
        celda.appendChild(parrafo);
        // Aumentamos el contador
        contador += 1;
    });
}

// Función para determinar el estado de los dispositivos de la casa
function estadoDispositivos() {
    // Modos de la casa del localStorage
    const modos = JSON.parse(localStorage.getItem("modos"));
    // Luces de las habitaciones del localStorage
    const luces = JSON.parse(localStorage.getItem("luces"));
    // Obtenemos el estado de cada dispositivo en función del localStorage
    const estadoPuertas = modos[0].estado;
    const estadoVentanas = modos[1].estado;
    const estadoBuzon = modos[3].estado;
    let estadoLuces = "0";
    luces.forEach(luz => {
        if (luz === "1") {
            estadoLuces = "1";
        }
    });
    // Almacenamos los estados en un array
    const estadosDispositivos = [estadoLuces, estadoPuertas, estadoVentanas, estadoBuzon];
    // Obtenemos los div dentro del span con id="dispositivos"
    const dispositivosCeldas = document.querySelectorAll("#dispositivos span div");
    // console.log(dispositivosCeldas);
    // Obtenemos las imagenes de cada div dentro del span
    const imagenes = Array.from(dispositivosCeldas).map(celda => celda.querySelector("img"));
    // console.log(imagenes);
    // Contador
    let contador = 0;
    // Recorremos los divs y los rellenamos
    dispositivosCeldas.forEach(celda => {
        // Limpiamos el contenido de la celda
        celda.innerHTML = "";
        // Agregamos la imagen
        celda.appendChild(imagenes[contador]);
        // Agregamos el texto como un <p>
        const parrafo = document.createElement("p");
        // Cambiamos el texto según el estado del dispositivo
        if (estadosDispositivos[contador] === "0") {
            parrafo.textContent = "OFF";
        } else if (estadosDispositivos[contador] === "1") {
            parrafo.textContent = "ON";
        } else if (estadosDispositivos[contador] === true) {
            parrafo.textContent = "ON";
        } else if (estadosDispositivos[contador] === false) {
            parrafo.textContent = "OFF";
        }
        // Agregamos el parrafo a la celda
        celda.appendChild(parrafo);
        contador += 1;
    });
}

// Función para calcular la humedad media de la casa
function humedadMedia() {
    // Temperaturas de las habitaciones del localStorage
    const temperaturas = JSON.parse(localStorage.getItem("temperaturas"));
    // Span de la celda con id="humedad"
    const humedadSpan = document.querySelector("#humedad span");
    // Imagen dentro del span
    const imagen = humedadSpan.querySelector("img");
    // Calculamos la temperatura media
    const temperaturaMedia = parseFloat(localStorage.getItem("media"));
    // console.log(sumaHumedades);
    const humedadMedia = temperaturaMedia / temperaturas.length;
    // console.log(humedadMedia);
    // Limpiamos el contenido del span
    humedadSpan.innerHTML = "";
    // Agregamos la imagen y el texto
    humedadSpan.appendChild(imagen); 
    humedadSpan.appendChild(document.createTextNode(`Humedad media: ${humedadMedia.toFixed(2)} %`));
}

// Escuchamos el evento storage para sincronizar los datos
window.addEventListener("storage", (event) => {
    if (event.key === "calefacciones" || event.key === "aires") {
        calefaccionAire();
    } else if (event.key === "modos") {
        estadoCasa();
        estadoDispositivos();
    } else if (event.key === "temperaturas") {
        temperaturaMedia();
        humedadMedia();
    }
});

// Llamamos a las funciones al inicializar la página
estadoCasa();
temperaturaMedia();
calefaccionAire();
estadoDispositivos();
humedadMedia();
