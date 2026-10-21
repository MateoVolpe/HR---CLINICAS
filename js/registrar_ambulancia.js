const formulario = document.getElementById('formulario');

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
        } else {
            alert('Error al guardar la ambulancia. Revise también la base de datos.');
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor.');
    }
});