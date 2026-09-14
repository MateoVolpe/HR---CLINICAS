// CODIGO DADO POR EL PROFESOR CARBONEL


const formulario = document.querySelector('#inicio');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosI = new FormData();
    datosI.append('usuario', formulario.usuario.value);
    datosI.append('contrasenia', formulario.contrasenia.value);

    try {
        const respuesta = await fetch(formulario.action, {
            method: 'POST',
            body: datosI
        });

        const texto = await respuesta.text();
        let resultado;

        try {
            resultado = JSON.parse(texto);
        } catch (error) {
            throw new Error(texto || 'Respuesta vacía del servidor');
        }

        if (resultado.error) {
            alert(resultado.error);
        } else if (resultado.exito) {
            window.location.href = 'bienvenido_funcionario.html';
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor: ' + error.message);
    }
});
