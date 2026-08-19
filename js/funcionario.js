const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const usuario = document.getElementById('usuario');
const contraseña = document.getElementById('contraseña');
const cargo = document.getElementById('cargo');
const boton = document.getElementById('boton');

boton.addEventListener('click', async(e) => {
    e.preventDefault();

    let doc = new FormData();
    doc.append('nombre', nombre.value);
    doc.append('apellido', apellido.value);
    doc.append('usuario', usuario.value);
    doc.append('contraseña', contraseña.value);
    doc.append('cargo', cargo.value);

    let respuesta = await fetch('../php/registrar_funcionario.php', {
        method: 'POST',
        body: doc
    });

    
    let texto = await respuesta.text();
    alert('Este texto:', texto)

    if (texto.trim() === 'ok') {
        alert('Funcionario guardado correctamente');
    } else {
        alert('Error al guardar el funcionario');
    }
});