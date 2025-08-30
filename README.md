# MyHomie: Un sistema interactivo para controlar el hogar

## :ok_man: Autores

- Javier Rosales Lozano
- Guillermo Sánchez González
- Alonso Rios Guerra

Última modificación: 30/08/2025
Grupo 14

## :globe_with_meridians: Descripción

Trabajo de prácticas (2024-2025) para la asignatura de Sistemas Interactivos y Ubicuos del Grado de Ingeniería Informática.

Universidad Carlos III de Madrid.

## :book: Resumen

Desarrollo desde cero de un sistema interactivo que simula una aplicación para manejar la domótica de una casa con gestos realizados a través del teléfono móvil, usando la metodología __Design Thinking__ aprendida en la asignatura.

El proyecto global consta de tres partes, desarrolladas consecutivamente, según el modelo del doble diamante en el diseño de sistemas interactivos:

<table>
  <thead>
    <tr>
      <th>Fase</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1. Ideación y Diseño</td>
      <td>
        La primera parte consiste en la ideación y diseño de<br>contextos y problemas cotidianos que empaticen con<br>un grupo de usuarios establecido, 
        y por medio de<br>técnicas de definición y diseño se elige el más<br>conveniente de todos. A partir de ahí, se trabaja en el<br>desarrollo de idear las soluciones a los problemas<br>especificados por dichos usuarios finales.
      </td>
    </tr>
    <tr>
      <td>2. Prototipado e Iteración</td>
      <td>
        Una vez definida la idea y su solución, se avanza hacia<br>la segunda parte del proyecto, la cual se enfoca en el<br>prototipado de dicha idea 
        y en la documentación<br>pertinente al desarrollo iterativo del producto y al<br>resultado final de éste.
      </td>
    </tr>
    <tr>
      <td>3. Evaluación y Entrega</td>
      <td>
        Finalmente, una vez desarrollado el producto final, la<br>tercera parte se resume en un proceso de evaluación<br>con usuarios donde se pone a prueba el producto final,<br>y se examinan a fondo las fortalezas y debilidades<br>encontradas según dicho estudio.
      </td>
    </tr>
  </tbody>
</table>

## :construction: Estructura del proyecto

```plaintext
myhomie-app/
├── public/                     # Fuente de archivos de código
│   ├── css/                    # Archivos de estilos
│   ├── js/                     # Lógica del la interfaz
│   ├── img/                    # Imágenes utilizadas en la interfaz
│   ├── audio/                  # Archivos de audio
│   └── html/                   # Archivos HTML de la interfaz
├── certs/                      # Certificados HTTPS (no implementado)
├── docs/                       # Documentación adicional del proyecto
├── node_modules/               # Dependencias instaladas con npm
├── server.js                   # Servidor Node.js con Express y Socket.IO
├── package.json                # Configuración del proyecto y dependencias
├── package-lock.json           # Versión exacta de las dependencias instaladas
└── README.md                   # Este archivo
```
## :link: Dependencias

<table>
  <tbody>
    <tr>
      <td align="center">Frontend</td>
      <td align="center">
        <a href="https://go-skill-icons.vercel.app/">
          <img src="https://go-skill-icons.vercel.app/api/icons?i=html,css,js,jquery,chartjs&theme=dark&titles=true"/>
        </a>
      </td>
      <td>HTML/CSS<br>JavaScript<br>JQuery<br>ChartJS</td>
    </tr>
    <tr>
      <td align="center">Backend</td>
      <td align="center">
        <a href="https://go-skill-icons.vercel.app/">
          <img src="https://go-skill-icons.vercel.app/api/icons?i=nodejs,npm,expressjs,socketio,api&theme=dark&titles=true"/>
        </a>
      </td>
      <td>NodeJS<br>Node Package Manager<br>Express<br>SocketIO<br>API Nominatim<br>API Open-Meteo</td>
    </tr>
    <tr>
      <td align="center">Adicionales</td>
      <td align="center">
        <a href="https://go-skill-icons.vercel.app/">
          <img src="https://go-skill-icons.vercel.app/api/icons?i=canva,miro&theme=dark&titles=true"/>
        </a>
      </td>
      <td>Canva<br>Miro</td>
    </tr>
  </tbody>
</table>

## :pencil: Requisitos

- nodejs v22.14.0 o superior

## :inbox_tray: Instalación y uso

1. __Clonar el repositorio__.

```bash
git clone https://github.com/username/myhomie-app.git
```
Reemplaza `username` por tu nombre de usuario de Github.

2. __Instala las dependencias del entorno__.

Asegúrate de tener __Node.js__ instalado en tu máquina.

```bash
npm install
```

4. __Inicia el servidor__.

Ejecuta `server.js` desde la raíz del proyecto

```bash
node server.js
```

5. __Enlaza tu dispositivo__

Activa el __modo desarrollador en tu móvil__, y luego activa la casilla "__Depuración USB__".

Después, conecta mediante cable USB el móvil a la máquina.

Visita en el navegador de Google Chrome de tu máquina "__chrome://inspect__", y selecciona tu dispositivo.

6. __Ejecuta ambos clientes__

En tu teléfono móvil, visita en Chrome:

```
http://localhost:5500/html/controlador.html
```

En tu máquina, visita en Chrome:

```
http://localhost:5500/html/home.html
```
## :round_pushpin: Características del sistema

Principalmente, el sistema consta de las siguientes funcionalidades:

- **Control de cámaras y seguridad del hogar**:

  - Cambia entre diferentes cámaras disponibles y actualiza las imágenes de las cámaras en tiempo real.
  - Establecer seguridad de puertas y ventanas; modos de la casa y consumo, y alertas de emergencias.
  - Navegación intuitiva mediante botones o comandos desde el móvil.
- **Gestión de alarmas**:

  - Configura alarmas ajustando horas y minutos.
  - Ajuste preciso mediante inclinación del móvil.
  - Confirmación y cierre de alarmas mediante interacción táctil o comandos desde el móvil.
- **Control de temperaturas, persianas y luces de las habitaciones del hogar**:

  - Manejo de las temperaturas, luces y persianas de la casa.
  - Ajuste personalizado y preciso mediante interacción táctil o comandos desde el móvil.
- **Atención al portero o "telefonillo de la casa"**:

  - Permite simular llamadas entrantes al telefonillo de la casa.
  - Responde o cuelga las llamadas mediante teclas o gestos del móvil.
- **Control del consumo del hogar mediante estadísticas y gráficos interactivos**:

  - Visualiza el consumo energético del hogar en tiempo real mediante gráficos interactivos.
  - Analiza estadísticas de consumo para optimizar el uso de energía.
- **Consulta del tiempo y climatología en las 24h y próximos 7 días**:

  - Muestra la previsión meteorológica de las próximas 24 horas y los próximos 7 días.
  - Incluye información detallada como temperatura, probabilidad de lluvia, y velocidad del viento.

Además de estas funcionalidades, se ofrece como base:

- **Conexión entre dispositivos**:

  - Comunicación en tiempo real entre el móvil y la pantalla principal mediante **Socket.IO**.
  - Registro de roles para identificar el dispositivo como "pantalla" o "móvil".
- **Interfaz adaptada**:

  - Diseño responsivo para dispositivos móviles y pantallas grandes.
  - Elementos interactivos como sliders, botones y entradas de texto.

## :video_game: Controles

La interfaz es manejable, además, con el __teclado de la máquina__ (en caso de no vincular el móvil):

| Acción | Tecla(s) |
|-----------|--------|
| Moverse entre los elementos de la pantalla | Teclas 🡠 🡢 |
| Manejar un slider / Manejar un input | Teclas 🡡 🡣 |
| Pulsar un botón / Acceder a una pantalla / Desactivar una alarma | Tecla Enter |
| Volver atrás | Tecla ESC |

Para __controlar la interfaz con el móvil__ es necesario vincular el dispositivo mediante la depuración USB, como se ha explicado anteriormente.

<table>
  <thead>
    <tr>
      <th>Acción</th>
      <th>Gesto(s)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">Moverse entre los<br>elementos de la pantalla</td>
      <td>Inclinar el movil hacia la derecha o izquierda</td>
    </tr>
    <tr>
      <td align="center">Acceder a una pantalla<br>desde la principal</td>
      <td>Gesto brusco hacia arriba</td>
    </tr>
    <tr>
      <td align="center">Retroceder</td>
      <td>Gesto brusco hacia abajo</td>
    </tr>
    <tr>
      <td align="center">Pulsar un botón</td>
      <td>Doble tap en la pantalla</td>
    </tr>
    <tr>
      <td align="center">Manejar un slider</td>
      <td>Mantener pulsada la pantalla con el dedo gordo e inclinar<br>hacia arriba o abajo el dispositivo</td>
    </tr>
    <tr>
      <td align="center">Desactivar una alarma</td>
      <td>Agitar el móvil</td>
    </tr>
    <tr>
      <td align="center">Atender una llamada</td>
      <td>Acercarse el móvil a la oreja (responder una llamada de<br>teléfono)</td>
    </tr>
    <tr>
      <td align="center">Colgar una llamada</td>
      <td>Doble tap en la pantalla</td>
    </tr>
  </tbody>
</table>

Para entender aún más cómo funcionan los controles, se recomienda visitar los enlaces a los videos del proyecto, dentro del directorio `/docs`.