const socket = io();  

// Guarda el ordenador como pantalla
socket.emit('register', 'pantalla');

