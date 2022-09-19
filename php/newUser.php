<?php
$log_file = './errors.log';
ini_set('log_errors', TRUE);
ini_set('error_log', $log_file);

include 'mysqli.php';

function random_words($words = 1, $length = 6)
{
    $string = '';
    for ($o=1; $o <= $words; $o++)
    {
        $vowels = array("a","e","i","o","u");
        $consonants = array(
            'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'm',
            'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
        );

        $word = '';
        for ($i = 1; $i <= $length; $i++)
        {
            $word .= $consonants[rand(0,18)];
            $word .= $vowels[rand(0,4)];
        }
        $string .= mb_substr($word, 0, $length);
        $string .= "-";
    }
    return mb_substr($string, 0, -1);
}



if((getenv('REQUEST_METHOD') == 'POST')) {
  $json_data = file_get_contents('php://input');

  $php_data = json_decode($json_data);

  $name = $php_data -> name;
  $email = $php_data -> email;
  $pass = random_words(3,5);
  if (!mb_check_encoding($name, 'UTF-8')) {
    echo "Sorry name is not UTF-8";
  } elseif (strlen($name) < 3) {
    echo "Sorry, name is too short";
  } elseif (strlen($name) > 30) {
    echo "Sorry, name is too long";
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Your email $email is not a valid email";
  } else {
    try {
      $stmt = $db->prepare("INSERT INTO players(name, email,pass) VALUES (?, ?,?)");
      $stmt -> bind_param("sss", $name, $email, $pass);
      $stmt -> execute();
    } catch (\mysqli_sql_exception $e) {
      if ($e -> getCode() == 1062) {
        echo "Your name and/or email is already forgiven";
      } else {
         echo $e->getMessage();
       }
    }
  }



  //prepared_select($db, "INSERT INTO players(name, email) VALUES (?, ?)", [$id])->fetch_assoc();
}



?>
