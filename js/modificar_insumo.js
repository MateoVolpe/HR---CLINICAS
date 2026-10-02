const formulario = document.getElementById('formulario');
const insumo = document.getElementById('insumo');
const descripcion = document.getElementById('descripcion');
const boton = document.getElementById('boton');
const respuesta = document.getElementById('respuesta');
let insumos = [];

async function cargarInsumos() {
    let datos = new FormData();
    datos.append('accion', 'listar');

    let resultado = await fetch('../php/insumos.php', {
        method: 'POST',
        body: datos
    });

    insumos = await resultado.json();
    insumo.innerHTML = '<option value="">Seleccione un insumo</option>';

    insumos.forEach((elemento) => {
        insumo.add(new Option(elemento.descripcion, elemento.id_elemento));
    });
}

insumo.addEventListener('change', () => {
    const seleccionado = insumos.find((elemento) => elemento.id_elemento === insumo.value);
    descripcion.value = seleccionado ? seleccionado.descripcion : '';
    descripcion.disabled = !seleccionado;
    boton.disabled = !seleccionado;
});

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const datos = new FormData();
    datos.append('accion', 'modificar');
    datos.append('id', insumo.value);
    datos.append('descripcion', descripcion.value);

    let resultado = await fetch('../php/insumos.php', {
        method: 'POST',
        body: datos
    });

    let texto = await resultado.json();
    alert(texto.mensaje);

    if (texto.ok) cargarInsumos();
});

cargarInsumos();