const formulario = document.getElementById('formFuncionario');
const boton = document.getElementById('boton');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    boton.disabled = true;

    try {
        const respuesta = await fetch('../php/registrar_funcionario.php', {
            method: 'POST',
            body: new FormData(formulario)
        });
        const texto = await respuesta.text();

        if (respuesta.ok && texto.trim() === 'ok') {
            alert('Funcionario guardado correctamente');
            formulario.reset();
        } else {
            alert(texto.trim() || 'Error al guardar el funcionario');
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor.');
    } finally {
        boton.disabled = false;
    }
});