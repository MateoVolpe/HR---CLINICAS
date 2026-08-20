const nom_doc = document.getElementById('nombre');
const archivo = document.getElementById('archivo');
const boton = document.getElementById('boton');
boton.addEventListener('click', async function(e) {
        let doc = new FormData();
        doc.append('nombre', 'nom_doc.value');
        doc.append('archivo', archivo.files[0]);
        let respuesta = await fetch(carger.inthod = 'POST', body, doc);
    });
