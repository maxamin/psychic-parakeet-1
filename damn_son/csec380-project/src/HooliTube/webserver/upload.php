<?php
session_start();

// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Upload Video</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="css/sidebar.css">
    <style type="text/css">
	body{ font: 14px sans-serif; text-align: center; }
    </style>
</head>
<body >
    <div class="page-header">
        <h1>Upload and contribute to our amazing selection, <b><?php echo htmlspecialchars($_SESSION["username"]); ?></b>!</h1>
    </div>

    <div class="sidenav">
        <a href="browse.php" class="btn btn-default btn-lg">Browse</a>
        <br>
        <a href="upload.php" class="btn btn-default btn-lg">Upload</a>
        <br>
        <a href="delete.php" class="btn btn-default btn-lg">Delete</a>
        <br>
        <a href="logout.php" class="btn btn-danger">Sign Out</a>
    </div>

    <div class="main">

    <!-- Upload by URL -->
    <form action="upload.php" method="POST" enctype="multipart/form-data" class="border-top">
	<div class="col-sm-4 col-md-offset-2">
    <label>Upload by URL or upload by file below!</label>
	<input type="text" class="form-control" name="url" />
	</div>
        <input type="submit" name="byurl" value="Upload by URL" />
    </form>

    <br><br><br><br>

    <!-- Upload by file -->
    <form action="upload.php" method="POST" enctype="multipart/form-data">
	<div class="col-sm-4 col-md-offset-2">
	<input type="file" name="file" />
	</div>
        <input type="submit" name="upload" value="Upload by File" />
    </form>

      <?php
        // Include config file
        require_once "common.php";
        if (isset($_SERVER["CONTENT_LENGTH"])) {
            if ($_SERVER["CONTENT_LENGTH"] > ((int)ini_get('post_max_size') * 1024 * 1024)) {
                die("<script>alert('File not uploaded, filesize exceeded 200MB!')</script>");
            }
        }

        // If an upload by url is given
        if(isset($_POST['byurl'])){
            $url = $_POST['url'];
            echo "<h3 align='center'> Uploaded! </h3>";

            $from_url = 1;
            $session_id = session_id();
            $sql = "SELECT user_id FROM sessions WHERE session_id = ?";
            $stmt = mysqli_prepare($link,$sql);
            mysqli_stmt_bind_param($stmt, "s", $session_id);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_store_result($stmt);
            mysqli_stmt_bind_result($stmt, $user_id);
            mysqli_stmt_fetch($stmt);
            

            $sql = "INSERT INTO videos(video_name, user_id, from_url) VALUES(?, ?, ?)";
            $stmt = mysqli_prepare($link,$sql);
            mysqli_stmt_bind_param($stmt ,"sii", $url, $user_id, $from_url);
            mysqli_stmt_execute($stmt);
        }

        // If an upload by file is given
        if(isset($_POST['upload'])){
            $name = $_FILES['file']['name'];
            $temp = $_FILES['file']['tmp_name'];
            $dir = "videos/".$_SESSION["username"];


            if(!is_dir($dir)){
                mkdir($dir, 0777, true);
            }
            if(move_uploaded_file($temp, $dir."/".$name)){

                echo "<h3 align='center'> Uploaded! </h3>";
                $session_id = session_id();
                $sql = "SELECT user_id FROM sessions WHERE session_id = ?";
                $stmt = mysqli_prepare($link,$sql);
                mysqli_stmt_bind_param($stmt, "s", $session_id);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_store_result($stmt);
                mysqli_stmt_bind_result($stmt, $user_id);
                mysqli_stmt_fetch($stmt);


                $sql = "INSERT INTO videos(video_name, user_id) VALUES(?, ?)";
                $stmt = mysqli_prepare($link,$sql);
                mysqli_stmt_bind_param($stmt ,"si", $name, $user_id);
                mysqli_stmt_execute($stmt);
            }
            else{
                echo "<h3 align='center'>NOT uploaded! </h3>";
            }
        }

      ?>

    </div>

</body>
</html>
