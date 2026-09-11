const formulario = document.getElementById('formulario');
const respuesta = document.getElementById('respuesta');

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (!window.confirm('¿Deseas eliminar este funcionario?')) return;

    try {
        const resultado = await fetch('../php/eliminar_funcionario.php', {
            method: 'POST',
            body: new FormData(formulario)
        });
        const texto = (await resultado.text()).trim();

        if (resultado.ok && texto === 'ok') {
            formulario.reset();
            respuesta.textContent = 'Funcionario eliminado correctamente.';
            return;
        }

        respuesta.textContent = texto || 'No se pudo eliminar el funcionario.';
    } catch (error) {
        respuesta.textContent = 'No se pudo conectar con el servidor.';
    }
});
