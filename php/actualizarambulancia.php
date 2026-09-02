<?php

require_once '../conexion.php';

$matricula = $_POST['matricula'] ?? '';
$marcamodelo = $_POST['marcamodelo'] ?? '';
$id_estado = $_POST['id_estado'] ?? '';

$matricula = trim($matricula);
$marcamodelo = trim($marcamodelo);
$id_estado = intval($id_estado);

if ($matricula == '') {
    echo "Debe ingresar una matrícula.";
    exit;
}

if ($marcamodelo == '' && $id_estado == 0) {
    echo "No se ingresaron datos para actualizar.";
    exit;
}


if ($marcamodelo != '' && $id_estado > 0) {

    $stmt = $con->prepare("
        UPDATE ambulancias
        SET modelo = ?, id_estado = ?
        WHERE matricula = ?
    ");

    $stmt->bind_param(
        "sis",
        $marcamodelo,
        $id_estado,
        $matricula
    );

}

else if ($marcamodelo != '') {

    $stmt = $con->prepare("
        UPDATE ambulancias
        SET modelo = ?
        WHERE matricula = ?
    ");

    $stmt->bind_param(
        "ss",
        $marcamodelo,
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