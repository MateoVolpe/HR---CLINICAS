<?php
require_once 'conexion.php';
session_start();

// Indica que la respuesta del archivo sera JSON.
header('Content-Type: application/json; charset=utf-8');

// 1. Obtener datos enviados desde el formulario
$usuario = $_POST['usuario'] ?? '';
$contrasenia = $_POST['contrasenia'] ?? $_POST['password'] ?? '';

if ($usuario === '' || $contrasenia === '') {
    echo json_encode(['error' => 'Complete usuario y contraseña']);
    exit;
}

// 2. Buscar el funcionario activo en la base de datos
$stmt = $con->prepare(
    'SELECT id_funcionario, nombre, apellido, usuario, contrasena, cargo
     FROM funcionarios
     WHERE usuario = ? AND estado = \'Activo\'
     LIMIT 1'
);
$stmt->bind_param('s', $usuario);
$stmt->execute();

// 3. Obtener el resultado de la consulta
$resultado = $stmt->get_result();

// 4. Verificar si el usuario existe
if ($resultado->num_rows === 0) {
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

$funcionario = $resultado->fetch_assoc();

// 5. Verificar la contraseña guardada en funcionarios.contrasena
if ($contrasenia !== $funcionario['contrasena']) {
    echo json_encode(['error' => 'Contraseña incorrecta']);
    exit;
}

// 6. Guardar los datos del funcionario en la sesión
$_SESSION['funcionario'] = [
    'id' => $funcionario['id_funcionario'],
    'nombre' => $funcionario['nombre'],
    'apellido' => $funcionario['apellido'],
    'usuario' => $funcionario['usuario'],
    'cargo' => $funcionario['cargo']
];

// 7. Enviar respuesta de éxito en JSON
echo json_encode([
    'exito' => true,
    'usuario' => $funcionario
]);

// 8. Cerrar conexión y sentencia
$stmt->close();
$con->close();
?>