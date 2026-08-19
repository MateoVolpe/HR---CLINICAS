<?php

$servidor = "localhost";
$usuario = "root";
$password = "";
$base_datos = "hospital_clinicas";

$con = new mysqli($servidor, $usuario, $password, $base_datos);

if ($con->connect_error) {
    die("Error de conexión: " . $con->connect_error);
}

$con->set_charset("utf8mb4");

?>