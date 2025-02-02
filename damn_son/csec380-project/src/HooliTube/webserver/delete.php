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
    <title>Delete Video</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="css/sidebar.css">
    <style type="text/css">
        body{ font: 14px sans-serif; text-align: center; }
    </style>
</head>
<body>
    <div class="page-header">
        <h1>Be careful when deleting your videos, <b><?php echo htmlspecialchars($_SESSION["username"]); ?></b>!</h1>
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

    <?php
    // Include config file
    require_once "common.php";


        if(isset($_POST['delete'])){

            $name = $_POST['videoname'];


            $sql = "DELETE FROM videos WHERE video_name = ?";
            $stmt = mysqli_prepare($link,$sql);
            mysqli_stmt_bind_param($stmt ,"s", $name);
            mysqli_stmt_execute($stmt);

            $sql = "SELECT from_url FROM videos WHERE video_name = ?";
            $stmt = mysqli_prepare($link,$sql);
            mysqli_stmt_bind_param($stmt ,"s", $name);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_store_result($stmt);
            mysqli_stmt_bind_result($stmt, $from_url);
            mysqli_stmt_fetch($stmt);




            if ($from_url == 1){
                echo "<h3 align='center'> Video has been deleted! </h3>";
            }
            elseif ($from_url == 0){
                unlink("videos/".$_SESSION["username"]."/".$name);
                echo "<h3 align='center'> Video has been deleted! </h3>";
            }
            else{
                echo "<h3 align='center'>Could not delete video! </h3>";
            }
        }
        else {
          $sql = "SELECT videos.video_name, users.username FROM videos JOIN users ON videos.user_id = users.user_id WHERE users.username = '".$_SESSION["username"]."'";
          $result = mysqli_query($link, $sql);

          if (mysqli_num_rows($result) > 0) {
              // output data of each row
              while($row = mysqli_fetch_assoc($result)) {
                  echo "<h3>". $row["video_name"] ."</h3>";
              }
          } else {
              echo "<h3> You haven't uploaded any videos! </h3>";
          }
        }
    ?>

    <form action="delete.php" method="POST" enctype="multipart/form-data">
    <div class="col-sm-6 col-md-offset-3">
        <div class="form-group">
            <label class="text-danger">Type the FULL name of the video EXACTLY as it appears above for your video to be deleted!</label>
            <input type="text" class="form-control" name="videoname"/>
        </div>

        <input type="submit" name="delete" class="btn btn-danger" value="Delete"/>
    </div>
    </form>

    </div>

</body>
</html>
