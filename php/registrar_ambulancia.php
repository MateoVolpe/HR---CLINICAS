<?php
require_once 'conexion.php';

$matricula = $_POST['matricula'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$estado = $_POST['estado'] ?? '';

$estados = [
    'Disponible' => 1,
    'En traslado' => 2,
    'Mantenimiento' => 3
];

 // con esto ve si la matricula el modelo y el estado sean validos antes de guardar.
if ($matricula === '' || $modelo === '' || !isset($estados[$estado])) {
    echo 'error';
    exit;
}

$id_estado = $estados[$estado];

$sql = "INSERT INTO ambulancias (matricula, modelo, id_estado)
        VALUES ('$matricula', '$modelo', '$id_estado')";

if ($con->query($sql)) {
    echo "ok";
} else {
    echo "error";
}
