<?php
require_once 'conexion.php';

$resultado = $con->query('SELECT nombre, apellido, usuario, cargo, estado FROM funcionarios ORDER BY apellido, nombre');
$funcionarios = [];

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $funcionarios[] = $fila;
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($funcionarios);
$con->close();
?>