import { obtenerClimaPorHora } from './clima.js';
import { crearHistoria } from './seguridad.js';

const habitaciones_luces = ["descansillo", "despacho", "baño", "salón", 
    "dormitorio grande", "dormitorio pequeño"];
const habitaciones_persianas = ["despacho", "cocina", "comedor alto", "comedor medio", 
    "comedor bajo", "dormitorio grande", "dormitorio pequeño"];
const habitaciones_climatizacion = ["descansillo", "despacho", "baño", "salón", 
    "dormitorio grande", "dormitorio pequeño"];

// Función para reproducir confirmaciones de las acciones al usuario
// API de síntesis de voz del navegador
function decirTexto(texto) {
    console.log("Reproduciendo texto:", texto);
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';       // Español de España
    utterance.rate = 1;             // Velocidad (1 = normal)
    utterance.pitch = 1;            // Tono
    speechSynthesis.speak(utterance);
}
let texto = "";

socket.on("command", (data) => {
    if (typeof data.target != "string") {
        return;
    }
    // Obtenemos el comando de voz recibido
    let comando = data.target;
    comando = comando.toLowerCase().trim();

    // Para las acciones del apartado climatizacion
    if (data.action === 'voz_climatizacion'){
        console.log("Comando recibido en cliente:", data);
        let realmente_es_climatizacion = false;
        // Obtener la temperatura objetivo
        let temperaturaObjetivo = comando.match(/\d+/);
        if (!temperaturaObjetivo){
            return;
        }
        temperaturaObjetivo = parseInt(temperaturaObjetivo[0]);
        if (temperaturaObjetivo < 15 || temperaturaObjetivo > 30){
            decirTexto("La calefacción de tu casa debe estar entre 15 y 30 grados. Espabila crack");
            return;
        }
        // Modifica en localStorage el nuevo valor asociado a la habitacion
        let estados_guardados = JSON.parse(localStorage.getItem("temperaturas"))
        for (let habitacion of habitaciones_climatizacion){
            if (comando.includes(habitacion)){
                realmente_es_climatizacion = true;
                let indice = habitaciones_climatizacion.indexOf(habitacion);
                estados_guardados[indice] = temperaturaObjetivo;
                texto = `La temperatura de ${habitacion} se ha cambiado a 
                ${temperaturaObjetivo} grados.`;
            }
        }
        // Si no dice ninguna hacitacion, se supone que el usuario quiere saber temperatura (clima)
        if (!realmente_es_climatizacion){
            decirTiempo(comando);
            return;
        }
        localStorage.setItem("temperaturas", JSON.stringify(estados_guardados));
        if (window.location.pathname.endsWith("Climatizacion.html")) {
            location.reload();
        }
        // Reproduce el texto de confirmación al usuario
        decirTexto(texto);
        texto = "";
    }

    // Para las acciones del apartado persianas
    if (data.action === 'voz_persianas'){
        console.log("Comando recibido en cliente:", data);
        let porcentageObjetivo = null;
        // Si dice sube o baja se le asigna el 100 o 0 respectivamente
        if (comando.includes("sube") || comando.includes("súbeme") || comando.includes("subir")){
            porcentageObjetivo = 100;
        }
        else if (comando.includes("baja") || comando.includes("bájame") || comando.includes("bajar")){
            porcentageObjetivo = 0;
        }
        // Si dice un porcentaje se le asigna ese porcentaje
        let numero = comando.match(/\d+/);
        if (numero != null){
            porcentageObjetivo = parseInt(numero[0]);
        }
        if (porcentageObjetivo < 0 || porcentageObjetivo > 100){
            decirTexto("El porcentaje de la persiana debe estar entre 0 y 100. Espabila crack");
            return;
        }
        if (!porcentageObjetivo){
            return;
        }

        // Modifica en localStorage el nuevo valor asociado a la persiana
        let estados_guardados = JSON.parse(localStorage.getItem("persianas"))
        for (let habitacion of habitaciones_persianas){
            if (comando.includes(habitacion)){
                let indice = habitaciones_persianas.indexOf(habitacion);
                estados_guardados[indice] = porcentageObjetivo;
                texto = `La persiana de ${habitacion} se ha cambiado al ${porcentageObjetivo} por ciento.`;
            }
        }
        localStorage.setItem("persianas", JSON.stringify(estados_guardados));
        if (window.location.pathname.endsWith("Persianas.html")) {
            location.reload();
        }
        // Reproduce el texto de confirmación al usuario
        decirTexto(texto);
        texto = "";
    }

    // Para las acciones del apartado luces
    if (data.action === 'voz_luces'){
        console.log("Comando recibido en cliente:", data);
        let valor = null;
        if (comando.includes("enciende") || comando.includes("enciéndeme") || comando.includes("encender")){
            valor = 1;
        }
        else if (comando.includes("apaga") || comando.includes("apágame") || comando.includes("apagar")){
            valor = 0;
        }
        if (valor == null){return;}

        let estados_guardados = JSON.parse(localStorage.getItem("luces"))
        for (let habitacion of habitaciones_luces){
            if (comando.includes(habitacion)){
                let indice = habitaciones_luces.indexOf(habitacion);
                estados_guardados[indice] = valor;
                if (valor == 1){
                    texto = `La luz de ${habitacion} se ha encendido.`;
                }
                else{
                    texto = `La luz de ${habitacion} se ha apagado.`;
                }
            }
        }
        localStorage.setItem("luces", JSON.stringify(estados_guardados));
        if (window.location.pathname.endsWith("Luces.html")) {
            location.reload();
        }
        decirTexto(texto);
        texto = "";
    }

    // Funcion para obtener el clima de una hora concreta
    function decirTiempo(comando) {
        console.log("Comando recibido en cliente:", data);
        let hora = comando.match(/\d+/);
        // Si el comando pedido quiere temperatura de un dia, no de una hora
        if (!hora){
            return;
        }
        let hora_int = parseInt(hora[0]);

        // Si se dice mañana o tarde, se le suma 12 horas
        if (comando.includes("tarde")|| comando.includes("noche")){
            hora_int += 12;
            if (hora_int == 24){
                hora_int = 0;
            }
        }

        if (hora_int < 0 || hora_int > 23) {
            return;
        }
        hora = hora_int.toString();
        const horaFormateada = hora.padStart(2, "0") + ":00";
        if (!horaFormateada){return;}

        console.log("Hora formateada:", horaFormateada);

        const clima = obtenerClimaPorHora(horaFormateada)
        if (!clima) {return;}
        console.log("Clima recibido:", clima);
        
        const { temperatura, humedad, viento } = clima;
        texto = `La temperatura a las ${horaFormateada} es de ${temperatura} grados, la humedad es del ${humedad} por ciento y la velocidad del viento es de ${viento} kilometros por hora.`;
        decirTexto(texto);
        texto = "";
    }

    // Comando recibido para obtener el clima
    if (data.action === 'voz_tiempo'){
        decirTiempo(comando);
    }

    // Comandos para el apartado de seguridad
    // Caso de bloqueo de puertas, ventanas o buzón
    if (data.action === 'voz_bloqueo'){
        console.log("Comando recibido en cliente:", data);
        // Comprobar que se quiere bloquear
        let puerta, ventana, buzon = false;
        if (comando.includes("puerta") || comando.includes("puertas")){
            puerta = true;
        }
        if (comando.includes("ventana") || comando.includes("ventanas")){
            ventana = true;
        }
        if (comando.includes("buzón") || comando.includes("buzones")){
            buzon = true;
        }
        // Modificar valores en localStorage
        let modos = JSON.parse(localStorage.getItem("modos"))
        if (puerta){
            modos[0]["estado"] = true
            crearHistoria("ESTADO: Puertas bloqueadas")
        }
        if (ventana){
            modos[1]["estado"] = true
            crearHistoria("ESTADO: Ventanas bloqueadas")
        }
        if (buzon){
            modos[3]["estado"] = true
            crearHistoria("ESTADO: Buzón electrónico cerrado")
        }
        localStorage.setItem("modos", JSON.stringify(modos));
        if (window.location.pathname.endsWith("Seguridad.html")) {
            location.reload();
        }
        // Reproduce el texto de confirmación al usuario
        if (puerta){
            decirTexto("La puerta se ha bloqueado.");
        }
        if (ventana){
            decirTexto("Las ventanas se han bloqueado.");
        }
        if (buzon){
            decirTexto("El buzon se han bloqueado.");
        }
    }
    // Caso de desbloqueo de puertas, ventanas o buzón
    if (data.action === 'voz_desbloqueo'){
        console.log("Comando recibido en cliente:", data);
        let puerta, ventana, buzon = false;
        if (comando.includes("puerta") || comando.includes("puertas")){
            puerta = true;
        }
        if (comando.includes("ventana") || comando.includes("ventanas")){
            ventana = true;
        }
        if (comando.includes("buzón") || comando.includes("buzones")){
            buzon = true;
        }
        let modos = JSON.parse(localStorage.getItem("modos"))
        // En este caso también se crean Historias que se almacenan en el historial
        if (puerta){
            modos[0]["estado"] = false
            crearHistoria("ESTADO: Puertas desbloqueadas")
        }
        if (ventana){
            modos[1]["estado"] = false
            crearHistoria("ESTADO: Ventanas desbloqueadas")
        }
        if (buzon){
            modos[3]["estado"] = false
            crearHistoria("ESTADO: Buzón electrónico abierto")
        }
        localStorage.setItem("modos", JSON.stringify(modos));
        if (window.location.pathname.endsWith("Seguridad.html")) {
            location.reload();
        }
        if (puerta){
            decirTexto("La puerta se ha desbloqueado.");
        }
        if (ventana){
            decirTexto("Las ventanas se han desbloqueado.");
        }
        if (buzon){
            decirTexto("El buzon se ha desbloqueado.");
        }
    }
    // Caso llamadas de emergencia
    if (data.action === 'voz_llamada'){
        if (comando.includes("policía")){
            crearHistoria("EMERGENCIA: POLICÍA en camino");
            decirTexto("La policía ha sido llamada.");
        }
        if (comando.includes("bomberos")){
            crearHistoria("EMERGENCIA: BOMBEROS en camino");
            decirTexto("Los bomberos han sido llamados.");
        }
        if (comando.includes("ambulancia")){
            crearHistoria("EMERGENCIA: POLICÍA en camino");
            decirTexto("La ambulancia ha sido llamada.");
        }
    }
    // Caso modos de la casa
    if (data.action === 'voz_modo_casa'){
        console.log("Comando recibido en cliente:", data);
        let modos = JSON.parse(localStorage.getItem("modos"))

        if (comando.includes("ahorro")){
            modos[4]["estado"] = 0
            crearHistoria("ESTADO: Modo ahorro activado")
            decirTexto("Modo ahorro se ha activado.");
        }
        else if (comando.includes("hogar")){
            modos[4]["estado"] = 1
            crearHistoria("ESTADO: Modo hogar activado")
            decirTexto("Modo hogar se ha activado.");
        }
        else if (comando.includes("fuera")){
            modos[4]["estado"] = 2
            crearHistoria("ESTADO: Modo fuera activado")
            decirTexto("Modo fuera se ha activado.");
        }

        localStorage.setItem("modos", JSON.stringify(modos));
        if (window.location.pathname.endsWith("Seguridad.html")) {
            location.reload();
        }
    }
    // Caso modo noche y día
    if (data.action === 'voz_modo_noche_dia'){
        console.log("Comando recibido en cliente:", data);
        let modos = JSON.parse(localStorage.getItem("modos"))
        if (comando.includes("noche")){
            modos[2]["estado"] = true
            crearHistoria("ESTADO: Modo noche activado")
            decirTexto("Modo noche se ha activado.");
        }
        else{
            modos[2]["estado"] = false
            crearHistoria("ESTADO: Modo día activado")
            decirTexto("Modo día se ha activado.");
        }
        localStorage.setItem("modos", JSON.stringify(modos));
        if (window.location.pathname.endsWith("Seguridad.html")) {
            location.reload();
        }
    }
    // Comando para poner o quitar el despertador
    if (data.action === 'voz_despertador'){
        console.log("Comando recibido en cliente:", data);
        let alarmas = JSON.parse(localStorage.getItem("alarmas"))
        // Comprobar que el comando tenga hora en formato HH:MM
        const regex = /\b([01]?\d|2[0-3]):[0-5]\d\b/;
        let hora = comando.match(regex);
        hora = hora ? hora[0] : null;
        // Si no se encuentra hora como tal, buscar un número para ponerlo a en punto
        if (hora === null){
            hora = comando.match(/\d+/);
            if (!hora){
                return;
            }
            hora +=':00';
        }
        // Si la hora pedida es por la tarde se cambia el valor de la hora
        let [horas2, minutos2] = hora.split(":").map(Number);
        if (horas2 < 10) {
            hora = '0' + hora;
        }
        if ((comando.includes('tarde') || comando.includes('noche')) && horas2 < 13) {
            horas2 = (horas2 + 12) % 24;
            horas2 = horas2.toString().padStart(2, '0');
            minutos2 = minutos2.toString().padStart(2, '0');
            hora = `${horas2}:${minutos2}`;
        }

        console.log("Hora formateada:", hora);

        // Caso que se quiera desactivar alarma
        if (comando.includes("desactívame") || comando.includes("desactiva") || comando.includes("desactivar") ||
            comando.includes("apágame") || comando.includes("apaga") || comando.includes("apagar") ||
            comando.includes("quítame") || comando.includes("quita") || comando.includes("quitar")){

                alarmas.forEach((alarma) => {
                    if (alarma.hora === hora) {
                        alarma.activa = false;
                        console.log(alarma);	
                    }
                });
                decirTexto("La alarma de las " + hora + " se ha desactivado.");
        }
        // Caso de que se quiera poner una alarma
        else {
            alarmas.push({ hora: hora, activa: true });
            decirTexto("La alarma se ha programado a las " + hora + ".");
        }

        localStorage.setItem("alarmas", JSON.stringify(alarmas));
        if (window.location.pathname.endsWith("Despertador.html")) {
            location.reload();
        }
    }
});