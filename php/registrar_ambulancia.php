<?php
require_once 'conexion.php';

$matricula = $_POST['matricula'];
$modelo = $_POST['modelo'];
$estado = $_POST['estado'];



$sql = "INSERT INTO ambulancias (matricula, modelo, estado) 
        VALUES ('$matricula', '$modelo', '$estado')";


if ($con->query($sql)) {
    echo "ok";
} else {
    echo "error";
}
