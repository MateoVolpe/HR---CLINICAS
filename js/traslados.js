const formTraslado = document.getElementById('formTraslado');
const selectorAmbulancia = document.getElementById('ambulancia');
const listaTraslados = document.getElementById('listaTraslados');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo} mt-3 mb-0`;
}

async function solicitarJson(url, opciones) {
    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json();
    if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || 'No se pudo completar la solicitud.');
    }
    return datos;
}

async function cargarAmbulancias() {
    const datos = await solicitarJson('../php/traslados.php?accion=ambulancias');
    selectorAmbulancia.replaceChildren();

    const inicial = document.createElement('option');
    inicial.value = '';
    inicial.textContent = datos.ambulancias.length ? 'Seleccionar ambulancia' : 'No hay ambulancias disponibles';
    selectorAmbulancia.appendChild(inicial);

    datos.ambulancias.forEach((ambulancia) => {
        const opcion = document.createElement('option');
        opcion.value = ambulancia.id_ambulancia;
        opcion.textContent = `${ambulancia.matricula} · ${ambulancia.modelo}`;
        selectorAmbulancia.appendChild(opcion);
    });
}

async function cargarTraslados() {
    try {
        const datos = await solicitarJson('../php/traslados.php?accion=listar');
        listaTraslados.replaceChildren();

        if (!datos.traslados.length) {
            listaTraslados.textContent = 'No hay traslados activos.';
            return;
        }

        datos.traslados.forEach((traslado) => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'traslado';

            const encabezado = document.createElement('div');
            encabezado.className = 'd-flex justify-content-between align-items-start gap-2';
            const ambulancia = document.createElement('strong');
            ambulancia.textContent = `${traslado.matricula} · ${traslado.modelo}`;
            const estado = document.createElement('span');
            estado.className = 'badge text-bg-light border';
            estado.textContent = traslado.estado;
            encabezado.append(ambulancia, estado);

            const ruta = document.createElement('p');
            ruta.className = 'traslado-ruta my-2';
            ruta.textContent = `${traslado.origen} → ${traslado.destino}`;

            const acciones = document.createElement('div');
            acciones.className = 'd-flex gap-2';
            const botonFinalizar = document.createElement('button');
            botonFinalizar.type = 'button';
            botonFinalizar.className = 'btn btn-sm btn-outline-secondary';
            botonFinalizar.textContent = 'Finalizar';
            botonFinalizar.addEventListener('click', () => finalizarTraslado(traslado.id_traslado));

            acciones.appendChild(botonFinalizar);
            tarjeta.append(encabezado, ruta, acciones);
            listaTraslados.appendChild(tarjeta);
        });
    } catch (error) {
        listaTraslados.textContent = error.message;
    }
}

async function finalizarTraslado(idTraslado) {
    const datosFormulario = new FormData();
    datosFormulario.append('accion', 'finalizar');
    datosFormulario.append('id_traslado', idTraslado);

    try {
        const datos = await solicitarJson('../php/traslados.php', { method: 'POST', body: datosFormulario });
        mostrarMensaje(datos.mensaje);
        await Promise.all([cargarTraslados(), cargarAmbulancias()]);
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

formTraslado.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datosFormulario = new FormData(formTraslado);
    datosFormulario.append('accion', 'registrar');

    try {
        const datos = await solicitarJson('../php/traslados.php', { method: 'POST', body: datosFormulario });
        mostrarMensaje(datos.mensaje);
        formTraslado.reset();
        await Promise.all([cargarTraslados(), cargarAmbulancias()]);
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
});

document.getElementById('actualizar').addEventListener('click', async () => {
    await Promise.all([cargarTraslados(), cargarAmbulancias()]);
});

Promise.all([cargarTraslados(), cargarAmbulancias()]).catch((error) => mostrarMensaje(error.message, 'error'));