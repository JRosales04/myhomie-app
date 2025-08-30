
// Librerías necesarias para la arquitectura del servidor
const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const fs = require("fs")

// Creamos la aplicación Express
const app = express();

// Configuramos las opciones de HTTPS (certificado y clave privada)
// No se usa debido a que da conflictos con algunas APIs implementadas
const options = {
    key: fs.readFileSync('certs/MiServidorHTTPS.key'),
    cert: fs.readFileSync('certs/MiServidorHTTPS.crt'),
};

// Configuramos Express para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));
const server = http.createServer(app);
const io = socketIO(server);

// Variables para almacenar el socket de los clientes (pantalla y movil)
let pantallaSocket = null;
let movilSocket = null;

// Eventos de conexión y desconexión de clientes
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    // Evento de registro para identificar el tipo de cliente
    socket.on('register', (role) => {
        // Asociamos cada socket a las variables correspondientes
        if (role === 'pantalla') {
            pantallaSocket = socket;
            console.log('Pantalla registrada');
        } else if (role === 'movil') {
            movilSocket = socket;
            console.log('Movil registrado');
        }
    });
    // Evento de envío de comandos desde el movil a la pantalla
    socket.on('command', (data) => {
        if (pantallaSocket) {
            // console.log("Enviando comando al controlador:", data);
            pantallaSocket.emit('command', data);
        } else {
            //console.log("No hay pantalla conectada.");
        }
    });
    // Evento de envío de respuestas desde la pantalla al movil
    socket.on('respuesta', (data) => {
        if (movilSocket) {
            // console.log("Enviando respuesta al movil:", data);
            movilSocket.emit('respuesta', data);
        } else {
            //console.log("No hay movil conectado.");
        }
    });
    // Evento de desconexión del cliente
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    })
});

// Configuramos el puerto del servidor HTTP y lo arrancamos
const PORT = 5500;
server.listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en: http://localhost:${PORT}/html/home.html`);
}); 
