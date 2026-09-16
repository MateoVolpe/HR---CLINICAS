const formulario = document.getElementById('formulario');
const descripcion = document.getElementById('descripcion');
const lista = document.getElementById('lista');

async function enviar(datos) {
    const respuesta = await fetch('../php/insumos.php', { method: 'POST', body: datos });
    return respuesta.json();
}

async function cargar() {
    const datos = new FormData();
    datos.append('accion', 'listar');
    const insumos = await enviar(datos);

    if (insumos.length === 0) {
        lista.innerHTML = '<div class="fila">No hay insumos registrados.</div>';
        return;
    }

    lista.innerHTML = '';
    insumos.forEach((insumo) => {
        const fila = document.createElement('div');
        fila.className = 'fila';

        const nombre = document.createElement('span');
        const acciones = document.createElement('div');
        acciones.className = 'acciones';

        const modificar = document.createElement('button');
        const eliminar = document.createElement('button');

        nombre.textContent = insumo.descripcion;
        modificar.textContent = 'Modificar';
        eliminar.textContent = 'Eliminar';
        eliminar.className = 'eliminar';

        modificar.onclick = () => modificarInsumo(insumo.id_elemento, insumo.descripcion);
        eliminar.onclick = () => eliminarInsumo(insumo.id_elemento);

        acciones.append(modificar, eliminar);
        fila.append(nombre, acciones);
        lista.appendChild(fila);
    });
}

formulario.onsubmit = async (e) => {
    e.preventDefault();
    const datos = new FormData(formulario);
    datos.append('accion', 'registrar');
    datos.append('descripcion', descripcion.value);
    const resultado = await enviar(datos);
    alert(resultado.mensaje);
    if (resultado.ok) {
        descripcion.value = '';
        cargar();
    }
};

async function modificarInsumo(id, nombreActual) {
    const nuevoNombre = prompt('Nuevo nombre del insumo:', nombreActual);
    if (!nuevoNombre) return;

    const datos = new FormData();
    datos.append('accion', 'modificar');
    datos.append('id', id);
    datos.append('descripcion', nuevoNombre);
    const resultado = await enviar(datos);
    alert(resultado.mensaje);
    cargar();
}

async function eliminarInsumo(id) {
    if (!confirm('¿Eliminar este insumo?')) return;

    const datos = new FormData();
    datos.append('accion', 'eliminar');
    datos.append('id', id);
    const resultado = await enviar(datos);
    alert(resultado.mensaje);
    cargar();
}

cargar();
