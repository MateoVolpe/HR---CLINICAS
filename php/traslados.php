<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/conexion.php';

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

$accion = $_GET['accion'] ?? $_POST['accion'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $accion === 'ambulancias') {
    $resultado = $con->query('SELECT id_ambulancia, matricula, modelo FROM ambulancias WHERE id_estado = 1 ORDER BY matricula');
    if (!$resultado) {
        responder(['exito' => false, 'mensaje' => 'No se pudieron consultar las ambulancias.'], 500);
    }
    responder(['exito' => true, 'ambulancias' => $resultado->fetch_all(MYSQLI_ASSOC)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $accion === 'listar') {
    $sql = "SELECT t.id_traslado, a.matricula, a.modelo, r.origen, r.destino, e.nombre AS estado
            FROM traslados t
            INNER JOIN ambulancias a ON a.id_ambulancia = t.id_ambulancia
            INNER JOIN rutas r ON r.id_ruta = t.id_ruta
            INNER JOIN estados_traslado e ON e.id_estado = t.id_estado
            WHERE t.id_estado <> 5
            ORDER BY t.hora_salida DESC, t.id_traslado DESC";
    $resultado = $con->query($sql);
    if (!$resultado) {
        responder(['exito' => false, 'mensaje' => 'No se pudieron consultar los traslados.'], 500);
    }
    responder(['exito' => true, 'traslados' => $resultado->fetch_all(MYSQLI_ASSOC)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $accion === 'registrar') {
    $idAmbulancia = filter_input(INPUT_POST, 'id_ambulancia', FILTER_VALIDATE_INT);
    $origen = trim($_POST['origen'] ?? '');
    $destino = trim($_POST['destino'] ?? '');
    if (!$idAmbulancia || $origen === '' || $destino === '') {
        responder(['exito' => false, 'mensaje' => 'Selecciona una ambulancia e ingresa origen y destino.'], 422);
    }

    $con->begin_transaction();
    try {
        $stmt = $con->prepare('SELECT id_estado FROM ambulancias WHERE id_ambulancia = ? FOR UPDATE');
        $stmt->bind_param('i', $idAmbulancia);
        $stmt->execute();
        $ambulancia = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$ambulancia || (int) $ambulancia['id_estado'] !== 1) {
            throw new RuntimeException('La ambulancia seleccionada ya no está disponible.');
        }

        $stmt = $con->prepare('INSERT INTO rutas (origen, destino) VALUES (?, ?)');
        $stmt->bind_param('ss', $origen, $destino);
        $stmt->execute();
        $idRuta = $con->insert_id;
        $stmt->close();

        $stmt = $con->prepare('INSERT INTO traslados (id_ambulancia, id_ruta, id_estado, hora_salida) VALUES (?, ?, 2, NOW())');
        $stmt->bind_param('ii', $idAmbulancia, $idRuta);
        $stmt->execute();
        $stmt->close();

        $stmt = $con->prepare('UPDATE ambulancias SET id_estado = 2 WHERE id_ambulancia = ?');
        $stmt->bind_param('i', $idAmbulancia);
        $stmt->execute();
        $stmt->close();
        $con->commit();
        responder(['exito' => true, 'mensaje' => 'Traslado registrado.']);
    } catch (Throwable $error) {
        $con->rollback();
        responder(['exito' => false, 'mensaje' => $error instanceof RuntimeException ? $error->getMessage() : 'No se pudo registrar el traslado.'], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $accion === 'finalizar') {
    $idTraslado = filter_input(INPUT_POST, 'id_traslado', FILTER_VALIDATE_INT);
    if (!$idTraslado) {
        responder(['exito' => false, 'mensaje' => 'El traslado no es válido.'], 422);
    }

    $con->begin_transaction();
    try {
        $stmt = $con->prepare('SELECT id_ambulancia FROM traslados WHERE id_traslado = ? AND id_estado <> 5 FOR UPDATE');
        $stmt->bind_param('i', $idTraslado);
        $stmt->execute();
        $traslado = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$traslado) {
            throw new RuntimeException('El traslado ya está finalizado o no existe.');
        }

        $stmt = $con->prepare('UPDATE traslados SET id_estado = 5, hora_llegada = NOW() WHERE id_traslado = ?');
        $stmt->bind_param('i', $idTraslado);
        $stmt->execute();
        $stmt->close();

        $idAmbulancia = (int) $traslado['id_ambulancia'];
        $stmt = $con->prepare('UPDATE ambulancias SET id_estado = 1 WHERE id_ambulancia = ?');
        $stmt->bind_param('i', $idAmbulancia);
        $stmt->execute();
        $stmt->close();
        $con->commit();
        responder(['exito' => true, 'mensaje' => 'Traslado finalizado.']);
    } catch (Throwable $error) {
        $con->rollback();
        responder(['exito' => false, 'mensaje' => $error instanceof RuntimeException ? $error->getMessage() : 'No se pudo finalizar el traslado.'], 500);
    }
}

responder(['exito' => false, 'mensaje' => 'Acción no válida.'], 400);