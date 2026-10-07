const lista = document.getElementById('lista');

async function cargarInsumos() {
    let datos = new FormData();
    datos.append('accion', 'listar');

    let respuesta = await fetch('../php/insumos.php', {
        method: 'POST',
        body: datos
    });

    let insumos = await respuesta.json();
    lista.innerHTML = '';

    if (insumos.length === 0) {
        lista.innerHTML = '<tr><td>No hay insumos registrados.</td></tr>';
        return;
    }

    insumos.forEach((insumo) => {
        let fila = document.createElement('tr');
        let descripcion = document.createElement('td');
        descripcion.textContent = insumo.descripcion;
        fila.appendChild(descripcion);
        lista.appendChild(fila);
    });
}

cargarInsumos();