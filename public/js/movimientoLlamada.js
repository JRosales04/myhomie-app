// Función para detectar cuando el usuario lleva el teléfono al oído
function detectarMovimientoLlamada() {
  // Variables para el seguimiento del movimiento
  let ultimaAceleracion = { x: 0, y: 0, z: 0 };
  let ultimaOrientacion = { alpha: 0, beta: 0, gamma: 0 };
  let movimientoDetectado = false;
  let tiempoInicio = null;
  let telefonoEnOido = false; // Añadida para detectar cuando el teléfono está en posición de llamada
  
  // Umbrales de detección
  const UMBRAL_ACELERACION = 10; // m/s²
  const UMBRAL_ORIENTACION_VERTICAL = 60; // grados
  const TIEMPO_DETECCION = 500; // ms
  
  // Función para procesar datos de aceleración
  function procesarAceleracion(event) {
    const aceleracion = event.accelerationIncludingGravity;
    
    // Calcular el cambio en la aceleración
    const deltaX = Math.abs(aceleracion.x - ultimaAceleracion.x);
    const deltaY = Math.abs(aceleracion.y - ultimaAceleracion.y);
    const deltaZ = Math.abs(aceleracion.z - ultimaAceleracion.z);
    
    // Actualizar los valores de la última aceleración
    ultimaAceleracion = { 
      x: aceleracion.x, 
      y: aceleracion.y, 
      z: aceleracion.z 
    };
    
    // Detectar un movimiento significativo
    const movimientoRapido = (deltaX + deltaY + deltaZ) > UMBRAL_ACELERACION;
    
    if (movimientoRapido && !tiempoInicio) {
      tiempoInicio = Date.now();
    }
  }
  
  // Función para procesar datos de orientación
  function procesarOrientacion(event) {
    const orientacion = {
      alpha: event.alpha, // rotación alrededor del eje z (0-360)
      beta: event.beta,   // inclinación frontal/trasera (-180 a 180)
      gamma: event.gamma  // inclinación izquierda/derecha (-90 a 90)
    };
    
    // Detectar posición vertical (teléfono cerca de la oreja)
    const posicionVertical = Math.abs(orientacion.beta) > UMBRAL_ORIENTACION_VERTICAL;
    
    // Actualizar última orientación
    ultimaOrientacion = orientacion;
    
    // Si estamos en proceso de detección y el teléfono está en posición vertical
    if (tiempoInicio && posicionVertical) {
      const tiempoTranscurrido = Date.now() - tiempoInicio;
      
      // Si el movimiento ocurrió en un tiempo razonable
      if (tiempoTranscurrido < TIEMPO_DETECCION && !movimientoDetectado) {
        movimientoDetectado = true;
        telefonoEnOido = true; // Marcamos que el teléfono está en el oído
        tiempoInicio = null;
        
        // Evento de detección completada
        console.log("Movimiento de llamada detectado");
        document.dispatchEvent(new CustomEvent('movimientoLlamadaDetectado'));
      }
    } else if (tiempoInicio && Date.now() - tiempoInicio > TIEMPO_DETECCION) {
      // Resetear si ha pasado demasiado tiempo
      tiempoInicio = null; 
    }
    
    // Detectar cuando el teléfono se separa del oído
    if (telefonoEnOido && !posicionVertical) {
      // El teléfono estaba en el oído y ahora ya no está en posición vertical
      telefonoEnOido = false;
      movimientoDetectado = false; // Reseteamos para futuras detecciones
      
      console.log("Teléfono separado del oído");
      document.dispatchEvent(new CustomEvent('telefonoSeparadoDetectado'));
    }
  }
  
  // Activar los sensores
  function activarSensores() {
    window.addEventListener('devicemotion', procesarAceleracion);
    window.addEventListener('deviceorientation', procesarOrientacion);
    console.log('Detector de movimiento de llamada activado');
  }
  
  // Detener detección
  function detener() {
    window.removeEventListener('devicemotion', procesarAceleracion);
    window.removeEventListener('deviceorientation', procesarOrientacion);
    console.log('Detector de movimiento de llamada desactivado');
  }
  
  // API pública
  return {
    iniciar: activarSensores,
    detener: detener
  };
}
  
// Ejemplo de uso
const detectorLlamada = detectarMovimientoLlamada();
const audio = document.getElementById('audio');

socket.on('respuesta', data => {
  if (data.action === 'telefonillo_sonando') {
    console.log("Telefonillo sondando, iniciamos deteccion movimiento")
    detectorLlamada.iniciar();
  }
});

// Escuchar el evento de detección para contestar
document.addEventListener('movimientoLlamadaDetectado', function() {
  socket.emit('command', { 
    action: 'contestarTelefonillo' // Reproducir el sonido de llamada
  });
  console.log("Movimiento de llamada detectado")
  audio.play(); // Reproducir el sonido de llamada
  detectorLlamada.detener(); // Detener el detector de movimiento
});

let lastTap2 = 0;

document.addEventListener("touchstart", (e) => {
  const currentTime2 = new Date().getTime();
  const tapLength2 = currentTime2 - lastTap2;

  if (tapLength2 < 300 && tapLength2 > 0) {
    console.log("Movimiento parar llamada detectado")
    audio.pause(); // Pausar el sonido de llamada
    audio.currentTime = 0; // Reiniciar el sonido
  }
  lastTap2 = currentTime2;
});