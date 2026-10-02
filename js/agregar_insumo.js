const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    let datos = new FormData(formulario);
    datos.append('accion', 'registrar');

    let resultado = await fetch('../php/insumos.php', {
        method: 'POST',
        body: datos
    });

    let texto = await resultado.json();
    alert(texto.mensaje);

    if (texto.ok) formulario.reset();
});