<?php
require_once 'conexion.php';

$apellido = $_POST['matricula'];
$usuario = $_POST['modelo'];
$pass = $_POST['estado'];



$sql = "INSERT INTO ambulancias (matricula, modelo, estado) 
        VALUES ('$matricula', '$modelo', '$estado')";


if ($con->query($sql)) {
    echo "ok";
} else {
    echo "error";
}
