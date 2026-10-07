const lista = document.getElementById('lista');

async function cargarFuncionarios() {
    let respuesta = await fetch('../php/listar_funcionarios.php');
    let funcionarios = await respuesta.json();

    lista.innerHTML = '';

    if (funcionarios.length === 0) {
        lista.innerHTML = '<tr><td colspan="5">No hay funcionarios registrados.</td></tr>';
        return;
    }

    funcionarios.forEach((funcionario) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${funcionario.nombre}</td>
            <td>${funcionario.apellido}</td>
            <td>${funcionario.usuario}</td>
            <td>${funcionario.cargo}</td>
            <td>${funcionario.estado}</td>
        `;
        lista.appendChild(fila);
    });
}

cargarFuncionarios();