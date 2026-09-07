<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido.');
}

$usuario = trim($_POST['usuario'] ?? '');
if ($usuario === '') {
    http_response_code(400);
    exit('Debe ingresar un usuario.');
}

$consulta = $con->prepare('DELETE FROM funcionarios WHERE usuario = ?');
if (!$consulta) {
    http_response_code(500);
    exit('Error al preparar la eliminación.');
}

$consulta->bind_param('s', $usuario);
$consulta->execute();

if ($consulta->affected_rows === 0) {
    http_response_code(404);
    exit('No se encontró un funcionario con ese usuario.');
}

$consulta->close();
$con->close();
echo 'ok';
?>
