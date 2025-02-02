<?php
	session_start();
	
	if(!isset($_SESSION['user'])){
		header('Location: index.php');
	}
	
	include('mysql_connect_init.php');
?>


<!DOCTYPE HTML>

<html>

<head>

	<link rel="stylesheet" href="bootstrap_3.3.7/css/bootstrap.min.css">
	<script src="bootstrap_3.3.7/js/bootstrap.min.js"></script>
	<script src="bootstrap_3.3.7/jquery.js"></script>
	<link rel="stylesheet" href="style.css"></link>
	
</head>


<body>

	<div class="container" style="text-align: center; height: 100%;">
		<div style="text-align: center; display: inline-block; background-color: #1034A6; width: 70%; height: 100%;">
			<h1 style="color: white;"><img src="bbp_icon.png" width=70 height=70><strong>Best Bank of The Philippines</strong></h1>
			<div class="jumbotron" style="text-align: center;background-color: #111E6C; display: inliine-block; margin: 10px; height: 90%; padding: 0px;">
				<div class="jumbotron" style="display: inline-block; width: 95%; height: 50%; margin: 5px; padding: 10px;">
					<div class="jumbotron" style="color: white; margin: 100px; height: 100%; width: 100%; background-color: #0E4D92; float: left; margin: 0px; padding: 10px; text-align: left;">
						<?php
							echo "<h2>Welcome, ".$_SESSION['user']."</h2>";
						?>
						<br>
						<?php
							$query = '
								SELECT * FROM accounts WHERE username = "'.$_SESSION['user'].'"
							';
							
							$res = mysqli_query($conn, $query);
							
							$row = mysqli_fetch_assoc($res);
							
							echo "
								<h3>Your account balance is: ".(number_format($row['balance'],2))."</h3>
							";
						?>
						<br>
						<br>
						<a class="btn btn-navbar" style="background-color: #0080FF" href="home.php">Back</a>
					</div>
				</div>
			</div>
		</div>
	</div>


</body>


</html>

