<?php
	include("common.php");
	session_start();

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		// POST params
		$username = $_POST['user'];
		$password = $_POST['pass'];

		// The query is intentionally vulnerable to display SQLi :(
		$query = "SELECT * FROM " . DB_TABLE_NAME . " WHERE UserName = '" . $username . "' AND Password = '" . $password . "'" ;
		// result is an object
		$result = mysqli_query($conn,$query);
		// get the number of rows returned
		$num = mysqli_num_rows($result);

		// Check to see if the user pass combo is in the db
		if ($num > 0){
			$_SESSION['loggedin_user'] = $username;
			header("location: landing.php");
		}
		else{
			header("location: index.html?error=credentialsIncorrect");
			exit();
		}
	}
?>