<?php
// Initialize the session
session_start();

// Include config file
require_once "common.php";

$sql = "DELETE FROM sessions WHERE session_id = ?";
$stmt = mysqli_prepare($link,$sql);
mysqli_stmt_bind_param($stmt ,"s", session_id());
mysqli_stmt_execute($stmt);


// Unset all of the session variables
$_SESSION = array();

// Destroy the session.
session_destroy();

// Redirect to login page
header("location: login.php");
exit;
?>
