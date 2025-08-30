
// JS que maneja la API del tiempo Open-Meteo Weather Forcast

// Fecha actual y la de mañana
const hoy = new Date();
const mañana = new Date();
mañana.setDate(hoy.getDate() + 1);

// Fecha actual + 7 días
const sieteDias = new Date();
sieteDias.setDate(hoy.getDate() + 7);

// Formatos de fecha (YYYY-MM-DD) para las peticiones a la API
const fechaHoy = hoy.toISOString().split('T')[0];
const fechaMañana = mañana.toISOString().split('T')[0];
const fechaSieteDias = sieteDias.toISOString().split('T')[0];

// Coordenadas del navegador almacenadas en el localStorage
const lat = localStorage.getItem("latitude");
const lon = localStorage.getItem("longitude");
// console.log("latitude: ", lat, " longitude: ", lon);

// Zona horaria del navegador
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// console.log("Zona horaria:", timezone);

// Almacenamiento de resultados weather24h
const horas = [];
const temperaturas = [];
const problluvias = [];
const vientos = [];
const humedad = [];
const dia_noche = [];

// Almacenamiento de resultados weather7d
const dias = [];
const temperaturasMax = [];
const temperaturasMin = [];
const codigosClima = [];

// Codigos meteorologicos (para el clima de los próximos 7 días)
// Debido a que son varios, se agrupan en categorías para facilitar la asignación de imágenes
const sunny = [0,1,2]
const cloudy = [3,45,48,51,53,56,61]
const rainy = [55,57,63,66,71,73,75,77,80,81,85]
const storm = [65,67,82,86,95,96,99]

// Cuando se carga la página, ejecutamos las funciones getWeather24h y getWeather7d
document.addEventListener("DOMContentLoaded", tiempoDia);
document.addEventListener("DOMContentLoaded", tiempoSemana);

// Función para obtener el clima de las siguientes 24h de la ubicación del usuario
function tiempoDia() {
    // Verificamos si las coordenadas están disponibles
    if (lat && lon) {
        // Consultamos el clima con la API Open-Meteo Weather Forcast API para obtener el clima de la fecha actual y la del día siguiente
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,wind_speed_10m,relative_humidity_2m,is_day&start_date=${fechaHoy}&end_date=${fechaMañana}&timezone=${timezone}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // console.log("Consulta 24h:", data);
                // Filtramos las horas de la consulta para obtener solo las siguientes 24h
                filtrarHoras(data);
                // Asignamos los datos a los elementos del HTML
                asignarDatosHoras();
            })
            .catch(error => {
                console.error("Error al hacer la solicitud:", error);
            });
    } else {
        console.error("Coordenadas no disponibles en localStorage.");
    }
}

// Función para filtrar las horas de la consulta y mostrar solo las siguientes 24h
function filtrarHoras(consulta24h) {
    // Normalizamos las fechas para eliminar los minutos y segundos
    const hoyNormalizado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), hoy.getHours(), 0, 0, 0);
    // Obtenemos las horas de la consulta
    const horasConsulta = consulta24h.hourly.time.map(time => new Date(time));
    // console.log("Horas consulta:", horasConsulta);
    // Contador para limitar las horas (25 horas = 24h + 1h actual)
    let horasProcesadas = 0;
    // Recorremos el array y buscamos las horas del rango que queremos
    for (let i = 0; i < horasConsulta.length; i++) {
        if (horasProcesadas >= 25) break;
        // Comprobamos si la hora está dentro del rango de hoy (hora actual) a mañana (00:00)
        const hora = horasConsulta[i];
        const horaNormalizada = new Date(hora.getFullYear(), hora.getMonth(), hora.getDate(), hora.getHours(), 0, 0, 0);
        if (horaNormalizada >= hoyNormalizado) {
            horas.push(hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            temperaturas.push(consulta24h.hourly.temperature_2m[i]);
            problluvias.push(consulta24h.hourly.precipitation_probability[i]);
            vientos.push(consulta24h.hourly.wind_speed_10m[i]);
            humedad.push(consulta24h.hourly.relative_humidity_2m[i]);
            dia_noche.push(consulta24h.hourly.is_day[i]);
            // Incrementamos el contador
            horasProcesadas++;
        }
    }
    // console.log("Horas:", horas);
    // console.log("Temperaturas:", temperaturas);
    // console.log("Probabilidad de lluvia:", problluvias);
    // console.log("Vientos:", vientos);
    // console.log("Humedad:", humedad);
    // console.log("Día/Noche:", dia_noche);
}

// Función para asignar los datos a los divs .hora del HTML
function asignarDatosHoras() {
    // Obtenemos todos los elementos con la clase .hora
    const elementosHora = document.querySelectorAll(".hora");
    // Para cada elemento (24), asignamos sus datos correspondientes
    elementosHora.forEach((elemento, index) => {
        if (index < horas.length) {
            // Limpiamos el contenido previo
            elemento.innerHTML = "";
            // Creamos un contenedor para la imagen y los datos principales (hora y temperatura)
            const datosPrincipales = document.createElement("div");
            datosPrincipales.classList.add("datos-principales");
            // Configuramos el elemento para la imagen
            const imagen = document.createElement("img");
            const probLluvia = problluvias[index];
            const esDia = dia_noche[index];
            let imagenSrc = "";
            // En función de la precipitación, asignamos la imagen correspondiente
            if (probLluvia <= 40) {
                imagenSrc = esDia ? "sun.png" : "moon.png";
            } else if (probLluvia > 40 && probLluvia <= 65) {
                imagenSrc = "cloudy.png";
            } else if (probLluvia > 65 && probLluvia <= 85) {
                imagenSrc = "rainy.png";
            } else if (probLluvia > 85) {
                imagenSrc = "storm.png";
            }
            imagen.src = `../img/${imagenSrc}`;
            imagen.alt = "Imagen clima";
            // Agregamos la imagen al div
            datosPrincipales.appendChild(imagen);
            // Creamos un contenedor interno para los datos de hora y temperatura
            const datosHT = document.createElement("div");
            datosHT.classList.add("datos-HT");
            // Agregamos la hora y la temperatura como texto plano al div principal
            datosHT.innerHTML = `
                ${horas[index]}<br>
                ${temperaturas[index]}°C
            `;
            datosPrincipales.appendChild(datosHT);
            // Creamos un contenedor para los datos adicionales (lluvia, humedad, viento)
            const datosAdicionales = document.createElement("div");
            datosAdicionales.classList.add("datos-adicionales");
            // Probabilidad de lluvia con imagen
            const lluviaDiv = document.createElement("div");
            const lluviaImg = document.createElement("img");
            lluviaImg.src = "../img/raindrops.png";
            lluviaImg.alt = "Lluvia";
            lluviaImg.classList.add("icono-dato");
            lluviaDiv.appendChild(lluviaImg);
            lluviaDiv.innerHTML += ` ${problluvias[index]}%`;
            datosAdicionales.appendChild(lluviaDiv);
            // Humedad con imagen
            const humedadDiv = document.createElement("div");
            const humedadImg = document.createElement("img");
            humedadImg.src = "../img/humidity.png";
            humedadImg.alt = "Humedad";
            humedadImg.classList.add("icono-dato");
            humedadDiv.appendChild(humedadImg);
            humedadDiv.innerHTML += ` ${humedad[index]}%`;
            datosAdicionales.appendChild(humedadDiv);
            // Viento con imagen
            const vientoDiv = document.createElement("div");
            const vientoImg = document.createElement("img");
            vientoImg.src = "../img/wind.png";
            vientoImg.alt = "Viento";
            vientoImg.classList.add("icono-dato");
            vientoDiv.appendChild(vientoImg);
            vientoDiv.innerHTML += ` ${vientos[index]} km/h`;
            datosAdicionales.appendChild(vientoDiv);
            // Añadimos todo al div .hora
            elemento.appendChild(datosPrincipales);
            elemento.appendChild(datosAdicionales);
        } else {
            // Si no hay datos, dejamos el contenedor vacío
            elemento.innerHTML = "";
        }
    });
}

// Función para obtener el clima de los siguientes 7 días de la ubicación del usuario
function tiempoSemana() {
    // Verificamos si las coordenadas están disponibles
    if (lat && lon) {
        // Consultamos el clima con la API Open-Meteo Weather Forcast API para obtener el clima durante las próximas fechas
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&start_date=${fechaHoy}&end_date=${fechaSieteDias}&timezone=${timezone}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // console.log("Consulta 7d:", data);
                // Recogemos los resultados de la consulta
                // Filtramos las horas de la consulta para obtener solo las siguientes 24h
                filtrarDias(data);
                // Asignamos los datos al elemento HTML
                asignarDatosDias();
            })
            .catch(error => {
                console.error("Error al hacer la solicitud:", error);
            });
    } else {
        console.error("Coordenadas no disponibles en localStorage.");
    }
}

// Funcion para filtrar los días de la consulta y mostrar solo los siguientes 7 días
function filtrarDias(data) {
    // Normalizamos las fechas para eliminar la hora
    const hoyNormalizado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const sieteDiasNormalizado = new Date(sieteDias.getFullYear(), sieteDias.getMonth(), sieteDias.getDate());
    // Obtenemos las fechas de la consulta
    const diasConsulta = data.daily.time.map(time => new Date(time));
    // console.log("Dias consulta:", diasConsulta);
    // Filtramos las fechas
    for (let i = 0; i < diasConsulta.length; i++) {
        const dia = diasConsulta[i];
        const diaNormalizado = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        // Comprobamos si la fecha está dentro del rango de hoy a siete días
        if (diaNormalizado >= hoyNormalizado && diaNormalizado <= sieteDiasNormalizado) {
            dias.push(dia.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' }));
            temperaturasMax.push(data.daily.temperature_2m_max[i]);
            temperaturasMin.push(data.daily.temperature_2m_min[i]);
            codigosClima.push(data.daily.weather_code[i]);
        }
    }
    // console.log("Dias:", dias);
    // console.log("Temperaturas Max:", temperaturasMax);
    // console.log("Temperaturas Min:", temperaturasMin);
    // console.log("Códigos Clima:", codigosClima);
}

// Funcion para asignar los datos a los divs .dia del HTML
function asignarDatosDias() {
    // Obtenemos todos los elementos con la clase .dia
    const elementosDia = document.querySelectorAll(".dia");
    // Para cada elemento (8), asignamos sus datos correspondientes
    elementosDia.forEach((elemento, index) => {
        if (index < dias.length) {
            // Quitamos el día de la semana del string de la fecha y dejamos solo DD/MM
            const fecha = dias[index].split(",")[1].trim(); // Parte después de la coma
            const [dia, mes, anio] = fecha.split("/"); // Dividimos en día, mes y año
            const fechaFormateada = `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}`; // Formato DD/MM con mes de dos dígitos
            // Determinamos la imagen según el código del clima
            let imagenClima = "";
            const codigo = codigosClima[index];
            if (sunny.includes(codigo)) {
                imagenClima = "sun.png";
            } else if (cloudy.includes(codigo)) {
                imagenClima = "cloudy.png";
            } else if (rainy.includes(codigo)) {
                imagenClima = "rainy.png";
            } else if (storm.includes(codigo)) {
                imagenClima = "storm.png";
            } else {
                imagenClima = "unknown.png"; // Imagen por defecto si no se encuentra el código
            }
            // Asignamos los datos al contenido del div
            elemento.innerHTML = `
                <img src="../img/${imagenClima}" alt="Clima" class="icono-clima">
                <p>${fechaFormateada}</p>
                <img src="../img/maxtemperature.png" alt="Clima" class="icono-clima">
                <p>${temperaturasMax[index]}°C</p>
                <img src="../img/mintemperature.png" alt="Clima" class="icono-clima">
                <p>${temperaturasMin[index]}°C</p>
            `;
        } else {
            // Si no hay datos, dejamos el contenedor vacío
            elemento.innerHTML = "";
        }
    });
}

export function obtenerClimaPorHora(horaBuscada) {
    const index = horas.findIndex(h => h === horaBuscada);
    if (index === -1) return null;

    return {
        hora: horas[index],
        temperatura: temperaturas[index],
        probabilidadLluvia: problluvias[index],
        viento: vientos[index],
        humedad: humedad[index],
        esDia: dia_noche[index]
    };
}