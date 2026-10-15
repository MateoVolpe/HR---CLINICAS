const formularioEncuesta = document.getElementById('formEncuesta');
const mensajeEncuesta = document.getElementById('mensajeEncuesta');

formularioEncuesta.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensajeEncuesta.textContent = 'Guardando respuesta...';

    try {
        const respuesta = await fetch('../php/guardar_encuesta.php', {
            method: 'POST',
            body: new FormData(formularioEncuesta)
        });
        const resultado = await respuesta.json();

        mensajeEncuesta.textContent = resultado.mensaje;
        mensajeEncuesta.className = resultado.exito ? 'text-success mt-3 mb-0' : 'text-danger mt-3 mb-0';
        if (resultado.exito) formularioEncuesta.reset();
    } catch (error) {
        mensajeEncuesta.textContent = 'No se pudo guardar la respuesta. Intente nuevamente.';
        mensajeEncuesta.className = 'text-danger mt-3 mb-0';
    }
});