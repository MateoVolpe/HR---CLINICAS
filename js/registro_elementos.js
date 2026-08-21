const tipo = document.getElementById('tipo');
const descripcion = document.getElementById('descripcion');
const boton = document.getElementById('boton');

boton.addEventListener('click', async (e) => {

    e.preventDefault();

    let doc = new FormData();

    doc.append('tipo', tipo.value);
    doc.append('descripcion', descripcion.value);

    let respuesta = await fetch('../php/registrar_elemento.php', {
        method: 'POST',
        body: doc
    });

    let texto = await respuesta.text();

    if (texto.trim() === 'ok') {
        alert('Elemento guardado correctamente');
    } else {
        alert('Error al guardar el elemento');
    }

});