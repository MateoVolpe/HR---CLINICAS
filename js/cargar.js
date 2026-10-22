// CODIGO DADO POR EL PROFESOR CARBONEL

const formulario = document.getElementById('formDocumento');
const mensaje = document.getElementById('mensaje');
const inputTitulo = document.getElementById('titulo');
const inputArchivo = document.getElementById('archivo');
const btnActualizar = document.getElementById('btnObtenerDocumentos');
const listaDocumentos = document.getElementById('listaDocumentos');
const preview = document.getElementById('preview');
const resultadoQr = document.getElementById('resultadoQr');
const codigoQr = document.getElementById('codigoQr');
const enlaceDocumento = document.getElementById('enlaceDocumento');

function mostrarMensaje(texto, tipo = 'ok') {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

function mostrarCodigoQr(rutaDocumento) {
    const urlDocumento = new URL(rutaDocumento, window.location.href).href;
    codigoQr.innerHTML = '';
    new QRCode(codigoQr, {
        text: urlDocumento,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.M
    });
    enlaceDocumento.href = urlDocumento;
    resultadoQr.hidden = false;
}

async function obtenerDocumentos() {
    if (!listaDocumentos) return;

    try {
        const respuesta = await fetch('../php/obtener_documentos.php');
        const documentos = await respuesta.json();

        listaDocumentos.innerHTML = '';

        if (!documentos.length) {
            const opcion = document.createElement('option');
            opcion.textContent = 'No hay documentos cargados';
            opcion.value = '';
            listaDocumentos.appendChild(opcion);
            return;
        }

        documentos.forEach((documento) => {
            const opcion = document.createElement('option');
            opcion.value = documento.id;
            opcion.dataset.archivo = documento.archivo;
            opcion.textContent = documento.titulo;
            listaDocumentos.appendChild(opcion);
        });

        listaDocumentos.selectedIndex = 0;
        listaDocumentos.dispatchEvent(new Event('change'));
    } catch (error) {
        console.error(error);
        mostrarMensaje('No se pudo cargar la lista de documentos.', 'error');
    }
}

if (formulario) {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!inputArchivo.files[0]) {
            mostrarMensaje('Debes seleccionar un archivo.', 'error');
            return;
        }

        if (!inputTitulo.value.trim()) {
            mostrarMensaje('El nombre del documento es obligatorio.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', inputTitulo.value.trim());
        formData.append('descripcion', document.getElementById('descripcion').value.trim());
        formData.append('archivo', inputArchivo.files[0]);

        try {
            mostrarMensaje('Subiendo documento...', 'ok');

            const respuesta = await fetch('../php/guardar.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await respuesta.json();

            if (resultado.exito) {
                mostrarMensaje(resultado.mensaje, 'ok');
                mostrarCodigoQr(resultado.url);
                formulario.reset();
                await obtenerDocumentos();
            } else {
                mostrarMensaje(resultado.mensaje, 'error');
            }
        } catch (error) {
            console.error(error);
            mostrarMensaje('Ocurrió un error al subir el documento.', 'error');
        }
    });
}

if (btnActualizar) {
    btnActualizar.addEventListener('click', obtenerDocumentos);
}

if (listaDocumentos) {
    listaDocumentos.addEventListener('change', async function () {
        const idSeleccionado = this.value;
        if (!idSeleccionado) {
            preview.style.display = 'none';
            preview.src = '';
            resultadoQr.hidden = true;
            return;
        }

        try {
            const respuesta = await fetch('../php/obtener_documentos.php');
            const documentos = await respuesta.json();
            const documento = documentos.find(item => String(item.id) === String(idSeleccionado));

            if (!documento || !documento.archivo) {
                preview.style.display = 'none';
                return;
            }

            const ruta = `../documentos/${documento.archivo}`;
            preview.src = ruta;
            preview.style.display = 'block';
            mostrarCodigoQr(ruta);
        } catch (error) {
            console.error(error);
        }
    });
}

obtenerDocumentos();