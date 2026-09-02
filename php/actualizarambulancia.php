<?php

require_once 'conexion.php';

$matricula = $_POST['matricula'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$id_estado = $_POST['id_estado'] ?? '';

$matricula = trim($matricula);
$modelo = trim($modelo);
$id_estado = intval($id_estado);

if ($matricula == '') {
    echo "Debe ingresar una matrícula.";
    exit;
}

if ($modelo == '' && $id_estado == 0) {
    echo "No se ingresaron datos par a actualizar.";
    exit;
}


if ($modelo != '' && $id_estado > 0) {

    $stmt = $con->prepare("
        UPDATE ambulancias
        SET modelo = ?, id_estado = ?
        WHERE matricula = ?
    ");

    $stmt->bind_param(
        "sis",
        $modelo,
        $id_estado,
        $matricula
    );

}

else if ($modelo != '') {

    $stmt = $con->prepare("
        UPDATE ambulancias
        SET modelo = ?
        WHERE matricula = ?
    ");

    $stmt->bind_param(
        "ss",
        $modelo,
        $matricula
    );

}

else {

    $stmt = $con->prepare("
        UPDATE ambulancias
        SET id_estado = ?
        WHERE matricula = ?
    ");

    $stmt->bind_param(
        "is",
        $id_estado,
        $matricula
    );
}


if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo "Ambulancia actualizada con éxito.";

    } else {

        echo "No se encontró la ambulancia o no hubo cambios.";
    }

} else {

    echo "Error al actualizar la ambulancia.";
}


$stmt->close();
$con->close();

?>