<?php
// php sessions
session_start();

// if already logged in, redirect to account page
if(isset($_SESSION['username'])) {
    header('Location: http://bankofvert/account.php');
    die();
}

// import db creds
include('dbcreds.php');

// connect to mysql
$handle = mysql_connect($hostname, $username, $password)
    or die('mysql_connect() failed');

// connect to database
$db = mysql_select_db('bankofvert', $handle)
    or die('mysql_select_db() failed');


// we set this variable for any user-facing messages
$message = '';

// check if login request
if(isset($_GET['username'])) {
    // craft vulnerable query
    $query = "SELECT * from users where username='" .$_GET['username']. "'";

    // get result of query from mysql
    $res = mysql_query($query);

    // if $res is false, query failed
    if(!$res) {
        $message = 'Username not found';
    }
    else {
        // retrieve result set
        $row = mysql_fetch_assoc($res);
        
        // if username is set, the query was successful
        // show email sent message
        if(isset($row['username'])) {
            $message = 'An email containing a reset link was sent to the email address of this username.';
        }
	else {
	    $message = 'Username not found';
	}
    }
}

?>

<html>

<head>
    <style>
        body {
            font-family: sans-serif;
            font-size: 20;
        }
        .hdr {
            color: #ea7125;
        }
        .message {
            color: #ff0000;
        }
    </style>
    <title>Bank of VERT</title>
</head>

<body>
    <center>
        <h1 class="hdr">Welcome to the Bank of VERT</h1>
        <h3>Enter your username to receive the reset link</h3>
        <div>
            <form method="GET">
                Username: <input type="text" name="username" size="120" value="<?php if(isset($_GET['username'])) {echo $_GET['username'];};?>"><br/><br/>
                <input type="submit" value="Submit">
            </form>
            <span class="message"><?php echo $message; ?><span>
        </div>
    </center>
</body>

</html>
