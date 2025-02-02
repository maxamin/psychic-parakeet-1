<?php
	session_start();
	
	if(isset($_SESSION['user'])){
		$_SESSION = array();
		header("Location: index.php");
	}
?>