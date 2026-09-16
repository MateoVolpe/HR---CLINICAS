<?php
require_once 'conexion.php';

$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$usuario = $_POST['usuario'] ?? '';
$pass = $_POST['contraseña'] ?? $_POST['password'] ?? '';
$cargo = $_POST['cargo'] ?? '';

$pass = password_hash($pass, PASSWORD_DEFAULT);

$estado = "Activo";

$stmt = $con->prepare('INSERT INTO funcionarios (nombre, apellido, usuario, contrasena, cargo, estado)
               VALUES (?, ?, ?, ?, ?, ?)');
$stmt->bind_param('ssssss', $nombre, $apellido, $usuario, $pass, $cargo, $estado);

if ($stmt->execute()) {
    echo "ok";
} else {
    echo "error";
}

$con->close();
?>