const matricula = document.getElementById('matricula');
const modelo = document.getElementById('modelo');
const estado = document.getElementById('estado');
const boton = document.getElementById('boton');
const formulario = document.getElementById('formulario');

boton.addEventListener('click', async (e) => {

    e.preventDefault();

    let doc = new FormData();

    doc.append('matricula', matricula.value);
    doc.append('modelo', modelo.value);
    doc.append('estado', estado.value);

    let respuesta = await fetch('../php/registrar_ambulancia.php', {
        method: 'POST',
        body: doc
    });

    let texto = await respuesta.text();


    if (texto.trim() === 'ok') {
        alert('Ambulancia guardada correctamente');
        if (formulario && typeof formulario.reset === 'function') {
            formulario.reset();
        }
        
matricula.value = '';
        modelo.value = '';
        estado.selectedIndex = 0;

    } else {
        alert('Error al guardar la ambulancia');
        
    }

})