const nombre = document.getElementById('nombre');
const archivo = document.getElementById('archivo');
const boton = document.getElementById('subir');

boton.addEventListener('click', async (e) => {

    e.preventDefault();

    let doc = new FormData();

    doc.append('nombre', nombre.value);
    doc.append('archivo', archivo.files[0]);

    let respuesta = await fetch('cargar.php', {
        method: 'POST',
        body: doc
    });

});