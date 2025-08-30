const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';
recognition.continuous = false;  // Se reinicia manualmente
recognition.interimResults = false;

const estado = document.getElementById("estado");

let escuchando = true;

function iniciarReconocimiento() {
if (escuchando) recognition.start();
}

let comando = "";
recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Escuchado:", transcript);

    // Palabra clave
    const keywords = ["hey homie", "hey home", "hey jumi", "hey hobby", "hey home y", 
    "hey how me", "hijo me", "hijo mío", "te dijo jumi", "hey google", "hijo",
    "oye homie", "oye home", "oye jumi", "oye hobby", "oye home y", "oye jaume", "oye jaume y",
    "hey javi", "oye javi", "oye hobby", "oye how me", "hey homi", "el homi", "lumi", "el jumi",
    "el javi", "el hobby", "el home y", "el home", "el hijo", "el hijo mío", "hijo me", "hey homing",
    "hey homy", "hey jou mi", "hey holy", "hey joey", "hey yo y me", "come", "hey holmi", 
    "hey joe me", "high homi", "fair home", "feijóo", "hi home"
    ];

    if (keywords.find(h => transcript.startsWith(h))) {
        comando = transcript.replace(keywords, "").trim();
    }
});

// Solo se envía el comando cuando deja de hablar la persona para no enviar 10 distintos
recognition.addEventListener("end", () => {
    console.log(`Comando reconocido: ${comando}`);
    ejecutarComando(comando);
    comando = "";
    setTimeout(() => iniciarReconocimiento(), 500);
});


function ejecutarComando(comando) {
    comando = comando.toLowerCase().trim();
    // Comandos de las luces
    if (comando.includes("luces") || comando.includes("luz")) {
        socket.emit('command', {
            action: 'voz_luces',
            target: comando
        });
    }
    // Comandos de las persianas
    if (comando.includes("persiana") || comando.includes("persianas")) {
        socket.emit('command', {
            action: 'voz_persianas',
            target: comando
        });
    }
    // Comandos de la calefacción
    if (comando.includes("calefacción") || comando.includes("temperatura")) {
        socket.emit('command', {
            action: 'voz_climatizacion',
            target: comando
        });
    }
    // Comandos del tiempo
    if (comando.includes("tiempo") || comando.includes("clima")) {
        socket.emit('command', {
            action: 'voz_tiempo',
            target: comando
        });
    }
    // Comandos de seguridad
    // Bloqueo de puertas y ventanas 
        if (comando.includes("bloqueo") || comando.includes("bloquear") || 
            comando.includes("bloquéame") || comando.includes("bloquea") || 
            comando.includes("cierra") || comando.includes("cerrar") || comando.includes("ciérrame")){
        socket.emit('command', {
            action: 'voz_bloqueo',
            target: comando
        });
    }
    // Desbloqueo de puertas y ventanas
    if (comando.includes("desbloqueo") || comando.includes("desbloquear") || 
    comando.includes("desbloqueame") || comando.includes("desbloquea") ||
    comando.includes("abre") || comando.includes("abrir") || comando.includes("ábreme")) {
        socket.emit('command', {
            action: 'voz_desbloqueo',
            target: comando
        });
    }
    // Comando llamadas de emergencia
    if (comando.includes("llamada") || comando.includes("llama")) {
        socket.emit('command', {
            action: 'voz_llamada',
            target: comando
        });
    }
    // Comando cambio modo casa
    if (comando.includes("modo") && comando.includes("casa")) {
        socket.emit('command', {
            action: 'voz_modo_casa',
            target: comando
        });
    }
    // comando modo dia y noche
    if (comando.includes("modo") && (comando.includes("noche")|| comando.includes("día"))) {
        socket.emit('command', {
            action: 'voz_modo_noche_dia',
            target: comando
        });
    }
    // Comando poner/quitar alarma
    if (comando.includes("alarma") || (comando.includes("despertador")|| comando.includes("alarmas"))) {
        console.log("Comando despertador: ", comando);
        socket.emit('command', {
            action: 'voz_despertador',
            target: comando
        });
        console.log("Comando despertador: ", comando);
    }

}


// Comenzar al cargar la página
iniciarReconocimiento();
