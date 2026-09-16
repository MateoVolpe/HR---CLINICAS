<?php
require_once 'conexion.php';

$sql = "SELECT a.matricula, a.modelo, e.nombre AS estado
        FROM ambulancias a
        INNER JOIN estados_ambulancia e ON e.id_estado = a.id_estado
        WHERE e.nombre = 'En traslado'
        ORDER BY a.matricula";

$resultado = $con->query($sql);
$ambulancias = [];

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $ambulancias[] = $fila;
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($ambulancias);
$con->close();
?>