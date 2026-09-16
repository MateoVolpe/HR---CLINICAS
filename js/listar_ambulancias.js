const lista = document.getElementById('listaAmbulancias');

async function cargarAmbulancias() {
    try {
        const respuesta = await fetch('../php/listar_ambulancias.php');
        const ambulancias = await respuesta.json();

        if (ambulancias.length === 0) {
            lista.innerHTML = '<div class="fila">No hay ambulancias en curso.</div>';
            return;
        }

        lista.innerHTML = ambulancias.map((ambulancia) => `
            <div class="fila">
                <span>${ambulancia.matricula}</span>
                <span>${ambulancia.modelo}</span>
                <span>${ambulancia.estado}</span>
                <span>En curso</span>
            </div>
        `).join('');
    } catch (error) {
        lista.innerHTML = '<div class="fila">No se pudo cargar la lista.</div>';
    }
}

cargarAmbulancias();