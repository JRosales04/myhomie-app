
// JS que controla la creación y actualización del gráfico de consumo del hogar

// Función para obtener la potencia total consumida por la casa en cada momento
// Se priorizan algunos dispositivos y se normaliza la potencia total acumulada para no superar el 100% de consumo
function obtenerPotencia() {
    // Datos del localStorage
    const luces = JSON.parse(localStorage.getItem("luces")) || [];
    const modos = JSON.parse(localStorage.getItem("modos")) || [0, 0, 1, 0];
    // Puertas, ventanas, modo de la casa y buzón
    const puertas = modos[0].estado ? 1 : 0;
    const ventanas = modos[1].estado ? 1 : 0;
    const modoCasa = parseInt(modos[4].estado);
    const buzon = modos[3].estado ? 1 : 0;
    // console.log(puertas, ventanas, modoDiaNoche, modoCasa, buzon);
    // Temperatura media
    const temperaturaMedia = JSON.parse(localStorage.getItem("media"));
    // Potencia por temperatura
    const tempPower = Math.min(100, Math.abs(temperaturaMedia - 22) * 100 / 8);
    // Dispositivos (puertas, ventanas, buzon)
    const devicePower = ((puertas + ventanas) * 2 + buzon * 1) * 2;
    // Luces encendidas
    const lucesEncendidas = luces.filter(luz => luz === 1).length;
    const lightPower = (lucesEncendidas / 6) * 20;
    // Suma de potencia total (<= 123)
    const rawPower = tempPower + devicePower + lightPower;
    // Normalizamos la potencia total para establecer un rango entre 0 y 100
    const maxPower = 123;
    const normalizedRawPower = Math.min((rawPower / maxPower) * 100, 100);
    // Según el modo de la casa, aplicamos diferentes reglas
    let consumoTotal;
    switch (modoCasa) {
        // Modo ahorro
        case 0:
            // Limitamos el consumo al 50% de la potencia total
            consumoTotal = Math.min(normalizedRawPower, 50);
            break;
        // Modo hogar
            case 1:
            // No limitamos el consumo
            consumoTotal = normalizedRawPower;
            break;
        // Modo fuera
            case 2:
            // Limitamos el consumo al 10% de la potencia total
            consumoTotal = Math.min(normalizedRawPower, 10);
            break;
    }
    // Devolvemos el consumo total
    return {
        consumoTotal: consumoTotal.toFixed(2)
    };
}

// Configuración inicial del gráfico
const ctx = document.getElementById("grafico-estadisticas").getContext("2d");
const grafico = new Chart(ctx, {
    // Gráfico de líneas que muestra el consumo de energía en kwH por segundo
    type: "line",
    data: {
        datasets: [
            {
                label: "Consumo de Energía (kwH/seg)",
                data: [],
                borderColor: "#457B9D",
                backgroundColor: "rgb(69, 123, 157, 0.2)",
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: "linear",
                title: {
                    display: true,
                },
                ticks: {
                    callback: function (value) {
                        return new Date(value).toLocaleTimeString();
                    },
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Potencia Consumida (kwH)"
                }
            }
        }
    }
});

// Función para añadir instancias al gráfico cada segundo
function actualizarGrafico() {
    // Obtenemos la potencia consumida en cada instante
    const estadisticas = obtenerPotencia();
    // Obtenemos la hora
    const ahora = Date.now();
    // Añadimos el consumo y la hora hora al array de etiquetas
    grafico.data.datasets[0].data.push({
        x: ahora,
        y: parseFloat(estadisticas.consumoTotal)
    });
    // Actualizamos el gráfico
    grafico.update();
}

// Inicializamos el gráfico cada vez que se recarga la página y lo actualizamos cada segundo
actualizarGrafico();
setInterval(actualizarGrafico, 1000);
