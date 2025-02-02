<?php
	session_start();
	
	$_SESSION['user'] = "Melchor_Mayaman";
	header("Location: home.php");
?>