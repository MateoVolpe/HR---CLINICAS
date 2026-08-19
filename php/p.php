<?php
regenere_once 'conexion.php';
$archivo = $_Files['archivo'];
$nombre =$_POST['nombre'];

if($archivo['error']===0){
    $ruta= "documentos/" . $archivo['name'];