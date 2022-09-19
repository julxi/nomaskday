<?php declare(strict_types=1);
include 'utils.php';


if((getenv('REQUEST_METHOD') == 'REGISTER_NEW_BET')) {
  $json_data = file_get_contents('php://input');
  $php_data = json_decode($json_data);
  $allIssues = [];
  $inviteIssues = [];
  $allErrors = [];


  $invite = $php_data -> invite;
  $name = $php_data -> name;
  $email = $php_data -> email;
  $bet = $php_data -> bet;
  $spread = $bet -> spread;
  $date = new DateTime();
  $date -> setDate($bet -> date -> year
                 ,$bet -> date -> month
                 ,$bet -> date -> day);

  //Betting Period is over
  $allIssues[] =  "I cannot accept new bets, sorry";

  //Check Name
  list($errors, $issues) = checkName($name);
  if (!empty($errors)) {
    $allErrors = array_merge($allErrors, $errors);
  } elseif (!empty($issues)) {
    $allIssues = array_merge($allIssues, $issues);
  }

  //Check Email
  list($errors, $issues) = checkEmail($email);
  if (!empty($errors)) {
    $allErrors = array_merge($allErrors, $errors);
  } elseif (!empty($issues)) {
    $allIssues = array_merge($allIssues, $issues);
  }

  //Check spread
  if(!is_int($spread) or $spread < 0 or 100 < $spread) {
    array_push($allIssues, "The confidence  value is not an int betwenn 0 and 100");
  }

  //Check date
  if (!$date) {
    $allIssues[] =  "The date submited does not correspond to a calendar date";
  } elseif (!isInBetRange($date)) {
    $allIssues[] =  "The date is not in the possible range";
  }


  //Check invite
  $maybeFriendId = getFriendId($invite);
  if (is_null($maybeFriendId)) {
    array_push($inviteIssues, "I can't find this invitation.");
  } elseif (hasFriendBet($maybeFriendId)) {
    array_push($inviteIssues, "This invitation has already been used.");
  }


  //Try to upload data
  if(empty($allErrors) and empty($allIssues) and empty($inviteIssues)){
    $passcode = generate_new_passcode();
    $insertDate = $date->format('Y-m-d');
    $stmt = $db->prepare("INSERT INTO bets(pass, friendId, name, email, spread, date) VALUES (?,?,?,?,?,?)");
    $stmt -> bind_param("sissis", $passcode, $maybeFriendId, $name, $email, $spread, $insertDate);
    if ($stmt -> execute() === TRUE) {
          //Everything Worked
          sendMail($email, $name, $passcode);
    } else {
      array_push($allErrors, $stmt->error);
    }
  }

  //Return the server-response
  if (!empty($allErrors)) {
    $response = array( 'status' => 'error', 'issues' => $allIssues, 'errors' => $errors);
  } elseif (!empty($allIssues)){
    $response = array( 'status' => 'nok', 'issues' => $allIssues, 'errors' => array());
  } elseif (!empty($inviteIssues)) {
    $response = array( 'status' => 'inviteIssue', 'issues' => $inviteIssues, 'errors' => array());
  } else {
    $memberArray = memberArray($passcode, $name, $spread, $date, false);
    $response = array( 'status' => 'ok', 'member' => $memberArray, 'issues' => $allIssues, 'errors' => array());
  }
  echo json_encode($response);
}


if((getenv('REQUEST_METHOD') == 'UPDATE_BET')) {
  $json_data = file_get_contents('php://input');
  $php_data = json_decode($json_data);
  $allIssues = [];
  $allErrors = [];

  //Betting Period is over
  $allIssues[] =  "I cannot accept changes in your bet anymore, sorry";         

  $passcode = $php_data -> passcode;
  $bet = $php_data -> bet;
  $spread = $bet -> spread;
  $betDate = new DateTime();
  $date = new DateTime();
  $date -> setDate($bet -> date -> year
                 ,$bet -> date -> month
                 ,$bet -> date -> day);

  //Check spread
  if(!is_int($spread) or $spread < 0 or 100 < $spread) {
    $allIssues[] = "The confidence  value is not an int betwenn 0 and 100";
  }

  //Check date
  if (!$date) {
    $allIssues[] =  "The date submited does not correspond to a calendar date";
  } elseif (!isInBetRange($date)) {
    $allIssues[] =  "The date is not in the possible range";
  }


  //Check passcode
  $maybeMember = getBet($passcode);
  if (is_null($maybeMember)) {
    $allIssues[] = "I couldn't find a bet under the passcode $passcode";
  } else {
    $name = $maybeMember[0];
    $isWagerPayed = $maybeMember[3];
  }
  //update Bet
  if(empty($allErrors) and empty($allIssues)) {
    $insertDate = $date->format('Y-m-d');
    $stmt = $db->prepare("UPDATE bets SET spread = ?, date = ? WHERE pass = ?");
    $stmt -> bind_param("iss", $spread, $insertDate, $passcode);
    if ($stmt -> execute() === TRUE) {
      //Everything Worked
    } else {
      array_push($allErrors, $stmt->error);
    }
  }

  $memberArray = memberArray($passcode, $name, $spread, $date, $isWagerPayed);
  echo json_encode(createResponse($allErrors, $allIssues, 'member', $memberArray));
}





if((getenv('REQUEST_METHOD') == 'LOGIN')) {
  $json_data = file_get_contents('php://input');
  $php_data = json_decode($json_data);
  $passcode = $php_data -> passcode;
  if (list($name, $spread, $date, $isWagerPayed) = getBet($passcode)) {
      $memberData = memberArray($passcode, $name, $spread, $date, $isWagerPayed);
      $response = createResponse([],[],'member',$memberData);
  }else{
    $issue = "Passcode $passcode not found";
    $response = createResponse([],[$issue]);
  }
  echo json_encode($response);
}


if((getenv('REQUEST_METHOD') == 'VERIFY_NAME')) {
  $json_data = file_get_contents('php://input');
  $php_data = json_decode($json_data);
  $name = $php_data -> name;
  list($problems, $issues) = checkName($name);

  if (!empty($errors)) {
    $result =  array('status' => "error", 'issues' => $problems, 'errors' => array());
  } elseif (!empty($issues)) {
    $result = array( 'status' => "nok", 'issues' => $issues, 'errors' => array());
  } else {
    $result = array( 'status' => "ok", 'issues' => array(), 'errors' => array());
  }
  echo json_encode($result);
}


if((getenv('REQUEST_METHOD') == 'VERIFY_EMAIL')) {
  $json_data = file_get_contents('php://input');
  $php_data = json_decode($json_data);
  $email = $php_data -> email;
  list($problems, $issues) = checkEmail($email);


  if (!empty($errors)) {
    $result =  array('status' => "error", 'issues' => $problems, 'errors' => array());
  } elseif (!empty($issues)) {
    $result = array( 'status' => "nok", 'issues' => $issues, 'errors' => array());
  } else {
    $result = array( 'status' => "ok", 'issues' => array(), 'errors' => array());
  }
  echo json_encode($result);
}






?>
