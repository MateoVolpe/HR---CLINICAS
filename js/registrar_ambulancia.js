const matricula = document.getElementById('matricula');
const modelo = document.getElementById('modelo');
const estado = document.getElementById('estado');
const formulario = document.getElementById('formulario');
const latitud = document.getElementById('latitud');
const longitud = document.getElementById('longitud');
const mapa = L.map('mapa').setView([-34.89, -56.16], 13);
const iconoAmbulancia = L.divIcon({ html: '🚑', className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
let pin;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(mapa);

// Al tocar el mapa, guarda las coordenadas y mueve el pin.
mapa.on('click', (evento) => {
    latitud.value = evento.latlng.lat.toFixed(6);
    longitud.value = evento.latlng.lng.toFixed(6);
    if (pin) mapa.removeLayer(pin);
    pin = L.marker(evento.latlng, { icon: iconoAmbulancia }).addTo(mapa).bindPopup('Ambulancia');
});

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    try {
        const respuesta = await fetch('../php/registrar_ambulancia.php', {
            method: 'POST',
            body: datos
        });
        const texto = await respuesta.text();

        if (texto.trim() === 'ok') {
            alert('Ambulancia guardada correctamente');
            formulario.reset();
            if (pin) mapa.removeLayer(pin);
        } else {
            alert('Error al guardar la ambulancia. Revise también la base de datos.');
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor.');
    }
});