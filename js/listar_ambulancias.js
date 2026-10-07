const lista = document.getElementById('listaAmbulancias');

async function cargarAmbulancias() {
    try {
        const respuesta = await fetch('../php/listar_ambulancias.php');
        const ambulancias = await respuesta.json();
        lista.replaceChildren();

        if (ambulancias.length === 0) {
            lista.textContent = 'No hay ambulancias registradas.';
            return;
        }

        ambulancias.forEach((ambulancia) => {
            const fila = document.createElement('div');
            fila.className = 'fila';
            [ambulancia.matricula, ambulancia.modelo, ambulancia.estado].forEach((dato) => {
                const texto = document.createElement('span');
                texto.textContent = dato || '';
                fila.appendChild(texto);
            });
            lista.appendChild(fila);
        });
    } catch (error) {
        lista.textContent = 'No se pudo cargar la lista.';
    }
}

cargarAmbulancias();