<?php
	$servername = "localhost";
	$username = "zdujkpdi_ava";
	$password = "?uvxX*}#bRVXt{(-r8";
	$dbname = "zdujkpdi_avatar";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Ket noi CSDL that bai: " . $conn->connect_error);
	} 
?>