<?php
require_once 'conexion.php';

$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$usuario = $_POST['usuario'];
$pass = $_POST['contraseña'];
$cargo = $_POST['cargo'];


$estado = "Activo";

$sql = "INSERT INTO funcionarios (nombre, apellido, usuario, contrasena, cargo, estado) 
        VALUES ('$nombre', '$apellido', '$usuario', '$pass', '$cargo', '$estado')";


if ($con->query($sql)) {
    echo "ok";
} else {
    echo "error";
}

$con->close();
?>