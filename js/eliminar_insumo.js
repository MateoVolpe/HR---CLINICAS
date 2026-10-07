const formulario = document.getElementById('formulario');
const insumo = document.getElementById('insumo');
const boton = document.getElementById('boton');
async function cargarInsumos() {
    let datos = new FormData();
    datos.append('accion', 'listar');

    let resultado = await fetch('../php/insumos.php', {
        method: 'POST',
        body: datos
    });

    let insumos = await resultado.json();
    insumo.innerHTML = '<option value="">Seleccione un insumo</option>';

    insumos.forEach((elemento) => {
        insumo.add(new Option(elemento.descripcion, elemento.id_elemento));
    });
}

insumo.addEventListener('change', () => {
    boton.disabled = !insumo.value;
});

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (!confirm('¿Deseas eliminar este insumo?')) return;

    let datos = new FormData();
    datos.append('accion', 'eliminar');
    datos.append('id', insumo.value);

    let resultado = await fetch('../php/insumos.php', {
        method: 'POST',
        body: datos
    });

    let texto = await resultado.json();
    alert(texto.mensaje);

    if (texto.ok) {
        boton.disabled = true;
        cargarInsumos();
    }
});

cargarInsumos();