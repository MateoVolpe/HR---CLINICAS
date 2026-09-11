// CODIGO DADO POR EL PROFESOR CARBONEL

<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/conexion.php';

$sql = "SELECT id_documento AS id, titulo, descripcion, archivo, fecha_subida FROM documentos ORDER BY fecha_subida DESC";
$resultado = $con->query($sql);

$documentos = [];

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $documentos[] = $fila;
    }
}

echo json_encode($documentos);

if (isset($con)) {
    $con->close();
}
