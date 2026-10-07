<?php
require_once 'conexion.php';
header('Content-Type: application/json; charset=utf-8');

$accion = $_POST['accion'] ?? 'listar';

if ($accion === 'listar') {
    $resultado = $con->query("SELECT id_elemento, descripcion FROM elementos WHERE id_tipo = 4 ORDER BY id_elemento DESC");
    $insumos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $insumos[] = $fila;
    }

    echo json_encode($insumos);
    exit;
}

if ($accion === 'registrar') {
    $descripcion = trim($_POST['descripcion'] ?? '');
    $stmt = $con->prepare('INSERT INTO elementos (descripcion, id_tipo) VALUES (?, 4)');
    $stmt->bind_param('s', $descripcion);
    $ok = $descripcion !== '' && $stmt->execute();
    echo json_encode(['ok' => $ok, 'mensaje' => $ok ? 'Insumo registrado.' : 'Ingrese una descripción.']);
    exit;
}

$id = intval($_POST['id'] ?? 0);

if ($accion === 'modificar') {
    $descripcion = trim($_POST['descripcion'] ?? '');
    $stmt = $con->prepare('UPDATE elementos SET descripcion = ? WHERE id_elemento = ? AND id_tipo = 4');
    $stmt->bind_param('si', $descripcion, $id);
    $ok = $descripcion !== '' && $stmt->execute() && $stmt->affected_rows > 0;
    echo json_encode(['ok' => $ok, 'mensaje' => $ok ? 'Insumo modificado.' : 'No se modificó el insumo.']);
    exit;
}

if ($accion === 'eliminar') {
    $stmt = $con->prepare('DELETE FROM elementos WHERE id_elemento = ? AND id_tipo = 4');
    $stmt->bind_param('i', $id);
    $ok = $stmt->execute() && $stmt->affected_rows > 0;
    echo json_encode(['ok' => $ok, 'mensaje' => $ok ? 'Insumo eliminado.' : 'No se encontró el insumo.']);
    exit;
}

echo json_encode(['ok' => false, 'mensaje' => 'Acción no válida.']);
$con->close();
?>
