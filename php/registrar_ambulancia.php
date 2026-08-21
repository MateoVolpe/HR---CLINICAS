<?php
require_once 'conexion.php';

$nombre = $_POST['id_ambulancia'];
$apellido = $_POST['matricula'];
$usuario = $_POST['modelo'];
$pass = $_POST['estado'];



$sql = "INSERT INTO ambulancias (id_ambulancia, matricula, modelo, estado) 
        VALUES ('$matricula', '$id_ambulancia', '$modelo', '$estado')";


if ($con->query($sql)) {
    echo "ok";
} else {
    echo "error";
}
