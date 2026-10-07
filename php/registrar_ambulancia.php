<?php
require_once 'conexion.php';

$matricula = $_POST['matricula'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$estado = $_POST['estado'] ?? '';
$latitud = filter_var($_POST['latitud'] ?? null, FILTER_VALIDATE_FLOAT);
$longitud = filter_var($_POST['longitud'] ?? null, FILTER_VALIDATE_FLOAT);

$estados = [
    'Disponible' => 1,
    'En traslado' => 2,
    'Mantenimiento' => 3
];

 // con esto ve si la matricula el modelo y el estado sean validos antes de guardar.
if ($matricula === '' || $modelo === '' || !isset($estados[$estado]) ||
    $latitud === false || $longitud === false || $latitud < -90 || $latitud > 90 ||
    $longitud < -180 || $longitud > 180) {
    echo 'error';
    exit;
}

$id_estado = $estados[$estado];

$stmt = $con->prepare('INSERT INTO ambulancias (matricula, modelo, id_estado, latitud, longitud) VALUES (?, ?, ?, ?, ?)');
$stmt->bind_param('ssidd', $matricula, $modelo, $id_estado, $latitud, $longitud);

if ($stmt->execute()) {
    echo "ok";
} else {
    echo "error";
}
