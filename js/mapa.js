const mapa = L.map('visualizar').setView([-34.9011, -56.1645], 15);
const ingresarO = document.getElementById('ingresarO');
const ubicar = document.getElementById('ubicar');
const departamento = document.getElementById('departamento');
const direccion = document.getElementById('dir');
const rutear = document.getElementById('rutear');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapa);

const ImagenMarcador = L.icon({
    iconUrl: '../img/189983.png',
    iconSize: [38, 45]
});
const ImagenDestino = L.icon({
    iconUrl: '../img/mapa.png',
    iconSize: [38, 45]
});

const marcador = L.marker([-34.9011, -56.1645], {
    draggable: true,
    icon: ImagenMarcador
}).addTo(mapa);
const insertlat = document.getElementById('lat');
const insertlng = document.getElementById('lng');

function actualizarOrigen() {
    const lugarO = marcador.getLatLng();
    insertlat.value = lugarO.lat;
    insertlng.value = lugarO.lng;
}

actualizarOrigen();
marcador.on('dragend', actualizarOrigen);

ingresarO.addEventListener('click', () => {
    actualizarOrigen();
    L.marker([-34.900362955713476, -56.163353436677056], {
        draggable: true,
        icon: ImagenMarcador
    }).addTo(mapa);
});

ubicar.addEventListener('click', async () => {
    const texto = `${direccion.value}, ${departamento.value}, Uruguay`;
    const url = `https://api.geoapify.com/v1/geocode/search?` +
        `text=${encodeURIComponent(texto)}` +
        `&filter=countrycode:uy` +
        `&lang=es&limit=1&format=json&apiKey=4572a7318c164b3b873097a1f7b2c618`;

    try {
        const respuesta = await fetch(url);
        const dato = await respuesta.json();
        const resultado = dato.results[0];
        if (!resultado) {
            alert('No se encontró la dirección.');
            return;
        }

        L.marker([resultado.lat, resultado.lon], {
            draggable: true,
            icon: ImagenDestino
        }).addTo(mapa);
        alert(`${resultado.lat}, ${resultado.lon}`);

        const origen = [insertlat.value, insertlng.value];
        const destino = [resultado.lat, resultado.lon];
        const urlRuta =
            `https://api.geoapify.com/v1/routing?` +
            `waypoints=${origen[0]},${origen[1]}|${destino[0]},${destino[1]}` +
            `&mode=drive` +
            `&units=metric` +
            `&lang=es` +
            `&apiKey=4572a7318c164b3b873097a1f7b2c618`;

        const resp = await fetch(urlRuta);
        const routeo = await resp.json();
        const ruta = routeo.features[0];
        const routeoDatos = ruta.properties;
        console.log('Distancia (m):', routeoDatos.distance);
        console.log('Tiempo (s):', routeoDatos.time);
        console.log('Instrucciones:', routeoDatos.legs[0].steps);

        const coordenadas = ruta.geometry.coordinates;
        const puntosRuta = Array.isArray(coordenadas[0][0])
            ? coordenadas.flat()
            : coordenadas;
        const dibujo = puntosRuta.map(([lon, lat]) => [lat, lon]);
        const linea = L.polyline(dibujo, { color: 'blue', weight: 5 }).addTo(mapa);
        mapa.fitBounds(linea.getBounds(), { maxZoom: 15 });
    } catch (error) {
        alert(`No se pudo ubicar o trazar la ruta: ${error.message}`);
    }
});

rutear.addEventListener('click', () => ubicar.click());
