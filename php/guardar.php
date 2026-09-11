// CODIGO DADO POR EL PROFESOR CARBONEL

<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

if (!isset($_FILES['archivo']) || !isset($_POST['titulo'])) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Faltan datos: archivo o título.'
    ]);
    exit;
}

$archivo = $_FILES['archivo'];
$titulo = trim($_POST['titulo'] ?? '');
$descripcion = trim($_POST['descripcion'] ?? '');

if ($titulo === '') {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'El nombre del documento es obligatorio.'
    ]);
    exit;
}

if ($archivo['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Hubo un problema al subir el archivo.'
    ]);
    exit;
}

$extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
$permitidas = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];

if (!in_array($extension, $permitidas, true)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Extensión no permitida. Solo: ' . implode(', ', $permitidas)
    ]);
    exit;
}

$directorio = __DIR__ . '/../documentos/';

if (!is_dir($directorio) && !mkdir($directorio, 0777, true) && !is_dir($directorio)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'No se pudo crear la carpeta de documentos.'
    ]);
    exit;
}

if (!is_writable($directorio)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'La carpeta de documentos no tiene permisos de escritura.'
    ]);
    exit;
}

$nombreArchivo = uniqid('doc_', true) . '.' . $extension;
$rutaCompleta = $directorio . $nombreArchivo;

if (!move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'No se pudo guardar el archivo en el servidor.'
    ]);
    exit;
}

$idFuncionario = $_SESSION['id_funcionario'] ?? null;

if ($idFuncionario !== null) {
    $sql = "INSERT INTO documentos (titulo, descripcion, archivo, id_funcionario) VALUES (?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param('sssi', $titulo, $descripcion, $nombreArchivo, $idFuncionario);
} else {
    $sql = "INSERT INTO documentos (titulo, descripcion, archivo) VALUES (?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param('sss', $titulo, $descripcion, $nombreArchivo);
}

if (!$stmt || !$stmt->execute()) {
    @unlink($rutaCompleta);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'No se pudo guardar la información en la base de datos: ' . $con->error
    ]);
    exit;
}

$stmt->close();
$con->close();

echo json_encode([
    'exito' => true,
    'mensaje' => 'Documento subido correctamente.',
    'archivo' => $nombreArchivo
]);
