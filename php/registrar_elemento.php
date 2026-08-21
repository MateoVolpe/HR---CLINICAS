<?php

require_once 'conexion.php';

$tipo = $_POST['tipo'];
$descripcion = $_POST['descripcion'];

$sql = "INSERT INTO elementos (tipo, descripcion)
        VALUES ('$tipo', '$descripcion')";

if ($con->query($sql)) {
    echo "ok";
} else {
    echo "error";
}

?>