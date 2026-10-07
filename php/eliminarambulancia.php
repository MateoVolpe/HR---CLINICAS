<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido.');
}

$matricula = trim($_POST['matricula'] ?? '');
if ($matricula === '') {
    http_response_code(400);
    exit('Debe ingresar una matrícula.');
}

$consulta = $con->prepare('DELETE FROM ambulancias WHERE matricula = ?');
if (!$consulta) {
    http_response_code(500);
    exit('Error al preparar la eliminación.');
}

$consulta->bind_param('s', $matricula);
$consulta->execute();

if ($consulta->affected_rows === 0) {
    http_response_code(404);
    exit('No se encontró una ambulancia con esa matrícula.');
}

$consulta->close();
$con->close();
echo 'ok';
?>