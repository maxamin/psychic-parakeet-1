<?php
	session_start();
	
	include('mysql_connect_init.php');
	
	
	$query = "
		SELECT * FROM accounts WHERE username = '".$_POST['user']."' AND password = '".$_POST['pass']."'
	";
	
	$res = mysqli_query($conn, $query);
	
	if ($row = mysqli_fetch_assoc($res)){
		$_SESSION['user'] = $row['username'];
		header("Location: home.php");
	}else {
		$_SESSION['error'] = 1;
		header("Location: index.php");
	}
	
?>