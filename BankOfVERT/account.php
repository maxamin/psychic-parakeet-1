<?php
session_start();

// check session variable to see if user is logged in
if(!isset($_SESSION['username'])) {
    echo 'You must be logged in to view this page.';
    echo '<meta http-equiv="refresh" content="3; url=http://bankofvert/" />';
    die();
}

// we set this variable for any user-facing messages
$message = '';

// import db creds
include('dbcreds.php');

// connect to mysql
$handle = mysql_connect($hostname, $username, $password)
    or die('mysql_connect() failed');

// connect to database
$db = mysql_select_db('bankofvert', $handle)
    or die('mysql_select_db() failed');


// if acount type is set, get balance from database
if(isset($_GET['cc'])) {
    // show list of accounts
    $query = "SELECT amount from balance where credit_card_number='" .$_GET['cc']. "'";
    
    // send query
    $res = mysql_query($query) or die (mysql_error());

    $amount = 0;

    // if $res is false, query failed
    if($res) {
        // retrieve result set
        $row = mysql_fetch_assoc($res);
        if(isset($row['amount'])) {
           $amount = $row['amount'];
        }
    }
}
else {
    // get list of accounts to show user
    $query = "SELECT credit_card_number from account where username='" .$_SESSION['username']. "'";

     // send query
    $res = mysql_query($query) or die (mysql_error());

    // set to -1 and check later to see if it was set
    $cc = -1;

    // if $res is false, query failed
    if($res) {
        // retrieve result set
        $row = mysql_fetch_assoc($res);
        if(isset($row['credit_card_number'])) {
           $cc = $row['credit_card_number'];
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
        .username {
            color: #33CC33;
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
        <h3>Hello <span class="username"><?php echo $_SESSION['username']; ?></span>!</h3>
        
        <?php if(!isset($_GET['cc'])) : ?>
            <h3>Which account's balance would you like to view?</h3>
            <div>Account #<a href="account.php?cc=<?php echo $cc; ?>"><?php echo $cc; ?></a></div>
        <?php else : ?>
            <h3>Your balance is: $<?php echo $amount; ?></h3>
        <?php endif; ?>
        
        <br/><br/>
        <span class="message"><?php echo $message; ?><span>
        <br/><br/>
        <h6><a href="logout.php">logout</a></h6>
    </center>
</body>

</html>