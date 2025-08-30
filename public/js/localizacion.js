
// JS que maneja la API Nominatim para obtener la geolocalización del usuario en función de sus coordenadas

// Cuando la página termine de cargarse, ejecutamos la función getLocation
document.addEventListener("DOMContentLoaded", getLocation);

// Función para obtener la geolocalización del usuario a partir del navegador
function getLocation() {
    // Verificamos si el navegador soporta geolocalización
    if (navigator.geolocation) {
        // Obtenemos las coordenadas actuales
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Las escribimos en el span "location"
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // console.log("Ubicación obtenida:", lat, lon);
                // Consultamos el nombre de la geolocalización con la API Nominatim
                // https://nominatim.org/
                // https://nominatim.openstreetmap.org/reverse?lat={latitud}&lon={longitud}
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error: " + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Guardamos el resultado de la consulta
                        let city, country;
                        if (data.address) {
                            city = data.address.city || data.address.town || data.address.village || "Desconocida";
                            country = data.address.country || "Desconocido";
                        }
                        // console.log("Ubicación obtenida:", city, country);
                        // Actualizamos el span "location"
                        document.getElementById("location").innerText = `${city}, ${country} (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
                        // Guardamos las variables en el localStorage para poder usarlas en otras páginas
                        localStorage.setItem("latitude", lat);
                        localStorage.setItem("longitude", lon);
                    })
                    .catch(error => {
                        console.error("Error al hacer la solicitud:", error);
                        document.getElementById("location").innerText = `Error obteniendo la ubicación (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
                    });
            },
            (error) => {
                // Error de obtención de ubicación
                console.error("Error obteniendo ubicación:", error);
                document.getElementById("location").innerText = `Ubicación desconocida`;
            }
        );
    } else {
        // El navegador no soporta geolocalización
        alert("La geolocalización no es compatible con este navegador.");
    }
}
