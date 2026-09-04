const formulario = document.querySelector('#inicio');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosI = new FormData();
    datosI.append('usuario', formulario.usuario.value);
    datosI.append('contrasenia', formulario.contrasenia.value);

    try {
        const respuesta = await fetch('../php/validar_login.php', {
            method: 'POST',
            body: datosI
        });

        const resultado = await respuesta.json();

        if (resultado.error) {
            alert(resultado.error);
        } else if (resultado.exito) {
            window.location.href = 'bienvenido_funcionario.html';
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor.');
    }
});
