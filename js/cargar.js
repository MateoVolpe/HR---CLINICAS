const datos = document.querySelector("#datos")

datos.addEventListener('submit', async (e) => {

    e.preventDefault()

    const persona = new FormData()
    persona.append('nombre', datos.nombre.value)
    persona.append('direccion', datos.direccion.value)

    const respuesta = await fetch('guardar.php', {
        method: 'POST',
        body: 'persona'
    })

    const mensaje = await respuesta.text()

    if (mensaje == "ok") {
        alert('guardado')
    } else {
        alert('no guardado');
    }

})