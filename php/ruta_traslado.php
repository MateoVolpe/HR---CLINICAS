<?php
header('Content-Type: application/json; charset=utf-8');

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

$idTraslado = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$idTraslado) {
    responder(['exito' => false, 'mensaje' => 'El traslado no es válido.'], 422);
}

$apiKey = require __DIR__ . '/serpapi_config.php';
if (!is_string($apiKey) || trim($apiKey) === '' || $apiKey === 'PEGA_TU_CLAVE_AQUI') {
    responder(['exito' => false, 'mensaje' => 'Pega tu clave en php/serpapi_config.php para habilitar las rutas.'], 503);
}

require_once __DIR__ . '/conexion.php';
$stmt = $con->prepare('SELECT r.origen, r.destino FROM traslados t INNER JOIN rutas r ON r.id_ruta = t.id_ruta WHERE t.id_traslado = ? AND t.id_estado <> 5');
$stmt->bind_param('i', $idTraslado);
$stmt->execute();
$traslado = $stmt->get_result()->fetch_assoc();
$stmt->close();
$con->close();
if (!$traslado) {
    responder(['exito' => false, 'mensaje' => 'No se encontró el traslado activo.'], 404);
}

$parametros = http_build_query([
    'engine' => 'google_maps_directions',
    'start_addr' => $traslado['origen'],
    'end_addr' => $traslado['destino'],
    'travel_mode' => '0',
    'hl' => 'es',
    'api_key' => $apiKey
]);
$contexto = stream_context_create(['http' => ['timeout' => 20, 'ignore_errors' => true]]);
$respuesta = @file_get_contents('https://serpapi.com/search.json?' . $parametros, false, $contexto);
if ($respuesta === false) {
    responder(['exito' => false, 'mensaje' => 'No se pudo conectar con SerpAPI.'], 502);
}

$datos = json_decode($respuesta, true);
if (!is_array($datos) || isset($datos['error'])) {
    responder(['exito' => false, 'mensaje' => $datos['error'] ?? 'SerpAPI devolvió una respuesta no válida.'], 502);
}

$tramo = $datos['directions'][0]['trips'][0] ?? null;
if (!$tramo) {
    responder(['exito' => false, 'mensaje' => 'SerpAPI no encontró una ruta para estas direcciones.'], 404);
}

$puntos = [];
foreach ($tramo['details'] ?? [] as $detalle) {
    $coordenadas = $detalle['gps_coordinates'] ?? null;
    if (isset($coordenadas['latitude'], $coordenadas['longitude'])) {
        $puntos[] = [(float) $coordenadas['latitude'], (float) $coordenadas['longitude']];
    }
}
if (count($puntos) < 2) {
    responder(['exito' => false, 'mensaje' => 'SerpAPI no devolvió suficientes puntos para dibujar la ruta.'], 502);
}

responder([
    'exito' => true,
    'puntos' => $puntos,
    'distancia' => $tramo['formatted_distance'] ?? '',
    'duracion' => $tramo['formatted_duration'] ?? ''
]);