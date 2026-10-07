const formulario = document.getElementById('formulario');
const respuesta = document.getElementById('respuesta');

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);
    const confirmada = window.confirm('¿Deseas eliminar esta ambulancia?');
    if (!confirmada) return;

    try {
        const resultado = await fetch('../php/eliminarambulancia.php', {
            method: 'POST',
            body: datos
        });
        respuesta.textContent = await resultado.text();
        if (resultado.ok && respuesta.textContent.trim() === 'ok') {
            formulario.reset();
            respuesta.textContent = 'Ambulancia eliminada correctamente.';
        }
    } catch (error) {
        respuesta.textContent = 'No se pudo conectar con el servidor.';
    }
});