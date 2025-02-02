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
    <title>Browse HooliTube</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="css/sidebar.css">
    <style type="text/css">
        body{ font: 14px sans-serif; text-align: center; }
    </style>
</head>
<body>
    <div class="page-header">
        <h1>Happy browsing, <b><?php echo htmlspecialchars($_SESSION["username"]); ?></b>!</h1>
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

    $sql = "SELECT videos.video_name, videos.from_url, users.username, videos.video_id FROM videos JOIN users ON videos.user_id = users.user_id";
    $result = mysqli_query($link, $sql);

    if (mysqli_num_rows($result) > 0) {
        // output data of each row
        while($row = mysqli_fetch_assoc($result)) {

            if($row["from_url"] == 1){
                echo "<video width='800' height='450' controls><source src='" . $row["video_name"] . "' type='video/mp4'>Your browser is bad.</video>";
                echo "<h3 align='center'> Video " . $row["video_id"] . " - Uploaded by: ". $row["username"] ."</h3> <br>";
            }
            else{
                echo "<video width='800' height='450' controls><source src='videos/" . $row["username"] . "/" .$row["video_name"] . "' type='video/mp4'>Your browser is bad.</video>";
                echo "<h3 align='center'>" . $row["video_name"] . " - Uploaded by: ". $row["username"] ."</h3> <br>";
            }
        }
    } else {
        echo "<h3 align='center'> Sorry, no videos have been uploaded! </h3>";
    }
    ?>
    </div>

</body>
</html>
