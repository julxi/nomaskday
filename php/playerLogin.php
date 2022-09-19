<?php
$log_file = './errors.log';
ini_set('log_errors', TRUE);
ini_set('error_log', $log_file);

include 'mysqli.php';


if((getenv('REQUEST_METHOD') == 'POST')) {
  $json_data = file_get_contents('php://input');

  $php_data = json_decode($json_data);

  $pass = $php_data -> pass;

  $stmt = $db->prepare("SELECT name FROM players WHERE pass = ?");
  $stmt -> bind_param('s', $pass);
  $stmt -> execute();

  //if( $stmt -> fetch){
  //  echo "1";
  //}else{
  //  echo "2 $pass";
  //}

  $stmt -> bind_result($name);
  $stmt -> fetch();

  echo "your json: $json_data your pass: $pass and your name: $name";




}



?>
