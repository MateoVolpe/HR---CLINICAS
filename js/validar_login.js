const formulario = document.querySelector('#inicio');
const modalPrivacidad = document.getElementById('modalPrivacidad');
const aceptacionDatos = document.getElementById('acepta_datos_personales');

document.getElementById('enlacePrivacidad').addEventListener('click', (evento) => {
    evento.preventDefault();
    modalPrivacidad.showModal();
});

document.getElementById('cerrarPrivacidad').addEventListener('click', () => {
    modalPrivacidad.close();
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!aceptacionDatos.checked) {
        alert('Marque la casilla de aceptación para continuar.');
        aceptacionDatos.focus();
        return;
    }

    const datosI = new FormData();
    datosI.set('usuario', formulario.elements.namedItem('usuario').value);
    datosI.set('contrasenia', formulario.elements.namedItem('contrasenia').value);
    datosI.set('acepta_datos_personales', '1');

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
