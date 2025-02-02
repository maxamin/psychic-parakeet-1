<?php
session_start();

// Include config file
require_once "common.php";

if (session_id()==""){
  session_regenerate_id(TRUE);

}

// populate session table
$is_locked = $attempts = 0;
$timestamp = date("Y-m-d H:i:s");
$session_id = session_id();
$sql = "INSERT INTO sessions (session_id, is_locked, attempts, lockout_time) VALUES(?,?,?,?)";
$stmt = mysqli_prepare($link,$sql);
mysqli_stmt_bind_param($stmt ,"siis", $session_id, $is_locked,$attempts, $timestamp);
mysqli_stmt_execute($stmt);




// Check if the user is already logged in, if yes then redirect him to welcome page
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    header("location: home.php");
    exit;
}

// Define variables and initialize with empty values
$username = $password = "";
$username_err = $password_err = "";

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){

    // Check if username is empty
    if(empty(trim($_POST["username"]))){
        $username_err = "Please enter username.";
    } else{
        $username = trim($_POST["username"]);
    }

    // Check if password is empty
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter your password.";
    } else{
        $password = trim($_POST["password"]);
    }

    // Validate credentials
    if(empty($username_err) && empty($password_err)){
        // Prepare a select statement
        $sql = "SELECT user_id, username, password FROM users WHERE username = ?";

        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);

            // Set parameters
            $param_username = $username;

            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                // Store result
                mysqli_stmt_store_result($stmt);

                // Check if username exists, if yes then verify password
                if(mysqli_stmt_num_rows($stmt) == 1){
                    // Bind result variables
                    mysqli_stmt_bind_result($stmt, $user_id, $username, $hashed_password);

                    // Check for lockout

                    $sql = "SELECT is_locked, attempts, lockout_time FROM sessions WHERE session_id = ?";
                    $lockout_time = "";
                    $session_id = session_id();
                    $stmt2 = mysqli_prepare($link,$sql);
                    mysqli_stmt_bind_param($stmt2, "s", $session_id);
                    mysqli_stmt_execute($stmt2);
                    mysqli_stmt_store_result($stmt2);
                    mysqli_stmt_bind_result($stmt2, $is_locked, $attempts, $lockout_time);
                    mysqli_stmt_fetch($stmt2);

                    if ($attempts > 4){
                      $timestamp = date("Y-m-d H:i:s");
                      $session_id = session_id();
                      $sql = "UPDATE sessions SET is_locked = 1, lockout_time = ?, attempts = 0 WHERE session_id = ?";
                      $stmt2 = mysqli_prepare($link, $sql);
                      mysqli_stmt_bind_param($stmt2, "ss", $timestamp, $session_id);
                      mysqli_stmt_execute($stmt2);
                    }


                    if ($is_locked == 1){
                        $dif = strtotime(date("Y-m-d H:i:s")) - strtotime($lockout_time);
                        if ($dif >= 120)
                        {
                          $session_id = session_id();
                          $sql = "UPDATE sessions SET is_locked = 0 WHERE session_id = ?";
                          $stmt2 = mysqli_prepare($link, $sql);
                          mysqli_stmt_bind_param($stmt2, "s", $session_id);
                          mysqli_stmt_execute($stmt2);

                          $sql = "SELECT is_locked FROM sessions WHERE session_id = ?";
                          $stmt2 = mysqli_prepare($link,$sql);
                          $session_id = session_id();
                          mysqli_stmt_bind_param($stmt2, "s", $session_id);
                          mysqli_stmt_execute($stmt2);
                          mysqli_stmt_store_result($stmt2);
                          mysqli_stmt_bind_result($stmt2, $is_locked);
                          mysqli_stmt_fetch($stmt2);
                        }
                    }


                    if ($is_locked==0){

                        if(mysqli_stmt_fetch($stmt)){

                            if(password_verify($password, $hashed_password)){
                                // Password is correct, so start a new session
                                session_start();


                                $sql = "UPDATE sessions SET user_id = ? WHERE session_id = ?";
                                $stmt = mysqli_prepare($link, $sql);
                                $session_id = session_id();
                                if($stmt === false){
                                    die("ERROR: Could not connect. " . mysqli_connect_error());
                                }
                                mysqli_stmt_bind_param($stmt, "is", $user_id, $session_id);
                                mysqli_stmt_execute($stmt);

                                session_regenerate_id(TRUE);

                                // populate session table
                                $sql = "UPDATE sessions SET session_id = ?, is_locked = 0, attempts = 0 WHERE user_id = ?";
                                $session_id = session_id();
                                $stmt = mysqli_prepare($link, $sql);
                                if($stmt === false){
                                    die("ERROR: Could not connect here. " . mysqli_connect_error());
                                }
                                mysqli_stmt_bind_param($stmt ,"si", $session_id, $user_id);
                                mysqli_stmt_execute($stmt);


                                // Store data in session variables
                                $_SESSION["loggedin"] = true;
                                $_SESSION["user_id"] = $user_id;
                                $_SESSION["username"] = $username;

                                // Redirect user to welcome page
                                header("location: home.php");
                            } else{
                                // Display an error message if password is not valid
                                $sql = "UPDATE sessions SET attempts=attempts+1 WHERE session_id = ?";
                                $session_id = session_id();
                                $stmt = mysqli_prepare($link,$sql);
                                mysqli_stmt_bind_param($stmt ,"s", $session_id);
                                mysqli_stmt_execute($stmt);

                                $password_err = "The username or password you entered was not valid.";
                            }
                         }
                      }

                } else{
                    // Display an error message if username doesn't exist
                    $username_err = "The username or password you entered was not valid.";
                }
            }
            else{
                echo "Something went wrong. Please try again later.";
            }
            // Close statement
            mysqli_stmt_close($stmt);
        }
    }
    // Close connection
    mysqli_close($link);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <style type="text/css">
        body{ font: 14px sans-serif; margin: 0 auto; width:400px;}
	.wrapper{ width: 350px; padding: 20px; margin: 0 auto }
	.form-group{ margin:0 auto; width:200px;}
	.login-form{ padding:10px; margin:0 auto; width:90px;}
    </style>
</head>
<body>
    <div class="wrapper">
        <h3 align="center">Login to HooliTube!</h3>
        <p align="center">Please fill in your credentials to login.</p>
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
                <label>Username</label>
                <input type="text" name="username" class="form-control" value="<?php echo $username; ?>">
                <span class="help-block"><?php echo $username_err; ?></span>
            </div>
            <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
                <label>Password</label>
                <input type="password" name="password" class="form-control">
                <span class="help-block"><?php echo $password_err; ?></span>
            </div>
            <div class="login-form">
                <input type="submit" class="btn btn-primary" value="Login">
            </div>
            <p align="center">Don't have an account? <a href="index.php">Sign up now</a>.</p>
        </form>
    </div>
</body>
</html>
