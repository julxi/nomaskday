<?php declare(strict_types=1);
$log_file = './errors.log';
ini_set('log_errors', 'TRUE');
ini_set('error_log', $log_file);


// Set up DB-Connection
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    require __DIR__.'/db_credentials.php';
    $db = new mysqli($host, $user, $pass, $db, $port);
    $db->set_charset($charset);
    $db->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
} catch (\mysqli_sql_exception $e) {
     throw new \mysqli_sql_exception($e->getMessage(), $e->getCode());
}

function testMail() {
  $to = "bitt.j@pm.me";
  $subject = "My subject";
  $txt = "Hello world!";
  $headers = "From: bet@no-mask-day.com";

  mail($to,$subject,$txt,$headers);

}



function sendMail(String $email, String $name, String $passcode) : bool {

  $to = $email;
  $subject = "No-Mask-Day: You placed your bet!";
  $headers = "From: bet@no-mask-day.com";
  $message = "Hey $name,\r\n\r\n
  I'm happy that you participate in this little bet. There is not much to do for you right now, except waiting.
  \r\n You can change your bet under https://no-mask-day.com/?p=$passcode \r\n
  Good Luck!";

  $to2 = "bitt.j@pm.me";
  $subject2 = "No-Mask-Day: New bet by $name";
  $headers2 = "From: bet@no-mask-day.com";
  $message2 = "There has been a new bet:\r\n
  name: $name\r\n
  email: $email";

  return (mail($to,$subject,$message, $headers) && mail($to2, $subject2, $message2, $headers2));

}



function createResponse(
                      array $errors
                    , array $issues
                    , ?String $payLoadkey = null
                    , ?array $payLoad = null): array {
  if (!empty($errors)) {
    $response = array(
        'status' => 'error'
      , 'issues' => $issues
      , 'errors' => $errors
    );
  } elseif (!empty($issues)){
    $response = array(
        'status' => 'nok'
      , 'issues' => $issues
      , 'errors' => array()
    );
  } else {
    if (is_null($payLoadkey) or is_null($payLoad)) {
      $response = array(
          'status' => 'ok'
        , 'issues' => array()
        , 'errors' => array()
      );
    } else{
      $response = array(
          'status' => 'ok'
        , $payLoadkey => $payLoad
        , 'issues' => array()
        , 'errors' => array()
      );
    }
  }
  return $response;
}

function deleteBets(int $playerId): bool {
  global $db;
  $stmt = $db->prepare('DELETE FROM bets WHERE playerId = ?');
  $stmt -> bind_param("i", $playerId);
  if ($stmt -> execute() === TRUE) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function insertBet(int $playerId,  int $confidence, DateTime $date): bool {
  global $db;
  $stmt = $db->prepare('INSERT INTO bets(playerId, confidence, date) VALUES (?,?,?)');
  $stmt -> bind_param("iis", $playerId, $confidence,  $date->format('Y-m-d') );
  if ($stmt -> execute() === TRUE) {
    return TRUE;
  } else {
    return FALSE;
  }
}

//Returns (player_id, name) if token is in db otherwise null
function getBet(string $passcode): ?array {
  global $db;
  $stmt = $db->prepare("SELECT name, spread, date, isWagerPayed FROM bets WHERE pass = ?");
  $stmt -> bind_param('s', $passcode);
  $stmt -> execute();
  $stmt -> bind_result($name, $spread, $dateStr, $isWagerPayedInt);
  if ($stmt -> fetch() === TRUE) {
    $date = new DateTime($dateStr);
    $isWagerPayed = (boolean) $isWagerPayedInt;
    return array($name, $spread, $date, $isWagerPayed);
  } else {
    return null;
  }
}


//Old Code
/*
function getBet(int $playerId) : ?array {
  global $db;
  $stmt = $db->prepare('SELECT confidence, date FROM bets WHERE playerId = ?');
  $stmt -> bind_param('i', $playerId);
  $stmt -> execute();
  $stmt -> bind_result($confidence, $dateStr);
  if ($stmt -> fetch() === TRUE) {
    $date = new DateTime($dateStr);
    return array($confidence, $date);
  } else {
    return null;
  }
}
*/


//Returns friendId if invite is in db otherwise null
function getfriendId(string $invite): ?int {
  global $db;
  $stmt = $db->prepare("SELECT id FROM friends WHERE invite = ?");
  $stmt -> bind_param('s', $invite);
  $stmt -> execute();
  $stmt -> bind_result($id);
  if ($stmt -> fetch() === TRUE) {
    return $id;
  } else {
    return null;
  }
}


//True <=> a bet with this friend id already exists
function hasFriendBet(int $friendId): bool {
  global $db;
  $stmt = $db->prepare("SELECT * FROM bets WHERE friendId = ?");
  $stmt -> bind_param('i', $friendId);
  $stmt -> execute();
  if ($stmt -> fetch() === TRUE) {
    return true;
  } else {
    return false;
  }
}



// Returns (array(errors), array(issues))
function checkName(string $name):array {
    global $db;
    $issues = [];
    $errors = [];

    // Expression for ([a-z]+[A-Z]+[0-9])*
    $antipattern = '/[^\.\_\ \'\-A-Za-z\x{0021}-\x{017F}0-9]/u';
    preg_match_all($antipattern, $name, $forbiddenSymbols);
    $forbiddenSymbols = array_unique($forbiddenSymbols[0]);
    if (!empty($forbiddenSymbols)) {
        array_push($issues, "please don't use the symbols: " .join(" ", $forbiddenSymbols));
    }
    if(trim($name) != $name){
      array_push($issues, "please don't use a whitespace at the start or at the end");
    }
    if (mb_strlen($name) < 3)  {
        array_push($issues, "please use at least 3 symbols");
    }
    if (mb_strlen($name) > 20)  {
        array_push($issues, "please use at most 20 symbols");
    }
    if ($issues == []) {
      $stmt = $db->prepare("SELECT name FROM bets WHERE name = ?");
      $stmt -> bind_param('s', $name);
      $stmt -> bind_result($similar_name);
      $stmt -> execute();
      $status = $stmt -> fetch();
      if ($status === TRUE) {
        array_push($issues, "please use a different username. The name $similar_name is already taken.");
      } elseif ($status === FALSE) {
        array_push($errors, 'some error occured while connecting the database. I cannot verify your username right now. Sorry for that');
      } elseif (is_null($status)) {
        //Do Nothing, name is fine
      }
    }

    return array($errors, $issues);
}


function checkEmail(string $email):array {
    global $db;
    $issues = [];
    $errors = [];

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
      array_push($issues, "it does not seem to be a valid e-mail address");
    }
    if ($issues == [])  {
      $stmt = $db->prepare("SELECT * FROM bets WHERE email = ?");
      $stmt -> bind_param('s', $email);
      $stmt -> execute();
      $status = $stmt -> fetch();
      if ($status === TRUE) {
        array_push($issues, "the email is already in used");
      }elseif ($status === FALSE) {
        array_push($errors, "some error occured while connecting the database. I cannot verify your username right now. Sorry for that");
      } elseif (is_null($status)) {
        //Do Nothing, email is fine
      }
    }

    return array($errors, $issues);
}

function isInBetRange(DateTime $date) : bool {
  $beginOfBet = new DateTime('2022-01-01');
  $endOfBet = new DateTime('2024-12-31');
  return (($beginOfBet <= $date) and ($date <= $endOfBet));
}

function memberArray(string $passcode, string $name, int $spread, DateTime $date, bool $isWagerPayed) : array{
  $year = (int) $date -> format('Y');
  $month = (int) $date -> format('n');
  $day = (int) $date -> format('j');
  //encode everything stepwise
  $dateArray = array('year' => $year, 'month' => $month, 'day' => $day);
  $bet = array('spread' => $spread, 'date' => $dateArray);
  $memberData = array('passcode' => $passcode, 'name' => $name, 'bet' => $bet, 'isWagerPayed' => $isWagerPayed);
  return $memberData;
}


function generate_new_passcode($words = 3, $length = 5)
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


?>
