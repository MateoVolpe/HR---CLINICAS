const matricula = document.getElementById("matricula");
const modelo = document.getElementById("modelo");
const estado = document.getElementById("estado");
const boton = document.getElementById("boton");
const divRespuesta = document.getElementById("respuesta");

boton.addEventListener("click", async (e) => {

    e.preventDefault();

    let doc = new FormData();

    doc.append("matricula", matricula.value.trim());
    doc.append("modelo", modelo.value.trim());
    doc.append("id_estado", estado.value);

    try {

        const respuesta = await fetch("../php/actualizarambulancia.php", {
            method: "POST",
            body: doc
        });

        const mensaje = await respuesta.text();
        divRespuesta.innerText = mensaje;
    } catch (error) {

        divRespuesta.innerText = "Error al enviar los datos.";

        console.error(error);
    }

});