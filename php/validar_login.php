<?php
session_start();
require_once 'conexion.php';

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

if ($usuario === '' || $password === '') {
    header('Location: ../pages/login_funcionario.html?error=datos');
    exit;
}

$consulta = $con->prepare(
    'SELECT id_funcionario, nombre, apellido, usuario, cargo
     FROM funcionarios
     WHERE usuario = ? AND contrasena = ? AND estado = \'Activo\'
     LIMIT 1'
);
$consulta->bind_param('ss', $usuario, $password);
$consulta->execute();
$funcionario = $consulta->get_result()->fetch_assoc();
$consulta->close();

if (!$funcionario) {
    header('Location: ../pages/login_funcionario.html?error=1');
    exit;
}

session_regenerate_id(true);
$_SESSION['funcionario'] = [
    'id' => $funcionario['id_funcionario'],
    'nombre' => $funcionario['nombre'],
    'apellido' => $funcionario['apellido'],
    'usuario' => $funcionario['usuario'],
    'cargo' => $funcionario['cargo']
];

header('Location: ../pages/bienvenido_funcionario.html');
exit;
?>