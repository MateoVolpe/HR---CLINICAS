<?php
require_once 'conexion.php';
header('Content-Type: application/json; charset=utf-8');

$atencion = $_POST['atencion'] ?? '';
$comentario = trim($_POST['comentario'] ?? '');
$opciones = ['Excelente', 'Buena', 'Regular', 'Mala'];

if (!in_array($atencion, $opciones, true)) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'Seleccione una calificación válida.']);
    exit;
}

try {
    $con->begin_transaction();

    // Crea la encuesta una sola vez si todavía no existe.
    $titulo = 'Encuesta de satisfacción';
    $consulta = $con->prepare('SELECT id_encuesta FROM encuestas WHERE titulo = ? LIMIT 1');
    $consulta->bind_param('s', $titulo);
    $consulta->execute();
    $encuesta = $consulta->get_result()->fetch_assoc();
    $consulta->close();

    if ($encuesta) {
        $idEncuesta = (int) $encuesta['id_encuesta'];
    } else {
        $descripcion = 'Opinión sobre la atención recibida';
        $consulta = $con->prepare('INSERT INTO encuestas (titulo, descripcion, fecha_creacion) VALUES (?, ?, CURDATE())');
        $consulta->bind_param('ss', $titulo, $descripcion);
        $consulta->execute();
        $idEncuesta = $con->insert_id;
        $consulta->close();
    }

    $preguntas = [
        '¿Cómo califica la atención recibida?' => $atencion,
        'Comentarios adicionales' => $comentario
    ];

    foreach ($preguntas as $textoPregunta => $valorRespuesta) {
        // Reutiliza cada pregunta para que cada envío no duplique el formulario.
        $consulta = $con->prepare('SELECT id_pregunta FROM preguntas WHERE id_encuesta = ? AND pregunta = ? LIMIT 1');
        $consulta->bind_param('is', $idEncuesta, $textoPregunta);
        $consulta->execute();
        $pregunta = $consulta->get_result()->fetch_assoc();
        $consulta->close();

        if ($pregunta) {
            $idPregunta = (int) $pregunta['id_pregunta'];
        } else {
            $consulta = $con->prepare('INSERT INTO preguntas (id_encuesta, pregunta) VALUES (?, ?)');
            $consulta->bind_param('is', $idEncuesta, $textoPregunta);
            $consulta->execute();
            $idPregunta = $con->insert_id;
            $consulta->close();
        }

        $consulta = $con->prepare('INSERT INTO respuestas (id_pregunta, respuesta) VALUES (?, ?)');
        $consulta->bind_param('is', $idPregunta, $valorRespuesta);
        $consulta->execute();
        $consulta->close();
    }

    $con->commit();
    echo json_encode(['exito' => true, 'mensaje' => 'Gracias. Su respuesta quedó guardada.']);
} catch (Throwable $error) {
    $con->rollback();
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'No se pudo guardar la respuesta.']);
}

$con->close();
?>