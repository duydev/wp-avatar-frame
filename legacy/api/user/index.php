<?php
	session_start();
	include('../../inc/mainfile.php');
	header('content-type: application/json; charset=utf-8');

	switch ($_GET['func']) {
	  case 'login':
	      login();
	    break;
	  case 'logout':
	  	  logout();
	  	break;
	  default:
	      echo "Oop! Something went wrong.";
	    break;
	}


	function login()
	{
		global $conn;
		$success = false;
		$message = "";
		$username = htmlentities($_POST['username']);
		$password = md5(htmlentities($_POST['password']));

		$sql = "SELECT id, username, fullname FROM users WHERE username = '$username' AND password = '$password'";
		$result = $conn->query($sql);

		if($result->num_rows > 0)
		{
			$row = $result->fetch_row();

			$token = generateToken($row[1]); 
			
			$_SESSION['login'] = 1;
			$_SESSION['userid'] = $row[0];
			$_SESSION['username'] = $row[1];
			$_SESSION['userfullname'] = $row[2];
			$_SESSION['token'] = $token;
			$success = true;
		}

		$message = "Đăng nhập thất bại. Vui lòng thử lại.";
		echo json_encode(array(
							'success'=>$success, 
							'message'=>$message
						));
	}

	function logout()
	{
		global $conn;
		$sql = "UPDATE users SET access_token = '' WHERE id =".$_SESSION['userid'];
		$conn->query($sql);

		// remove all session variables
		session_unset(); 
		// destroy the session 
		session_destroy(); 
		
		echo json_encode(array(
							'success'=>true, 
							'message'=>''
						));
	}

	function generateToken($username)
	{
		global $conn;
		$token = md5($username.time());
		$sql = "UPDATE users SET access_token = '$token' WHERE username = '$username'";
		$conn->query($sql);
		return $token;
	}	
?>