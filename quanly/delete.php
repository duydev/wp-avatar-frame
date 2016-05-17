<?php 
	session_start();
	include('db.php');

	if(!isset($_SESSION['login'])){
	  header("Location: login.php");
	}

	$id = $_GET['id'];

	$sql = "SELECT value FROM frames WHERE id = ".$id;
	$result = $conn->query($sql);
  
    if ($result->num_rows > 0) { 
    	$row = $result->fetch_row();
    	unlink('../img/frame/'.$row[0]);
    	$sql = "DELETE FROM frames WHERE id = ".$id;
    	$result = $conn->query($sql);
    	header("Location: index.php");
    }
?>