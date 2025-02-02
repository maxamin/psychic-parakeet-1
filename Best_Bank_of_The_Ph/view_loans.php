<?php
	session_start();
	
	if(!isset($_SESSION['user'])){
		header("Location: index.php");
	}
	
	include("mysql_connect_init.php");
	
	$search_key = "";
	if(isset($_GET['search'])){
		$search_key = $_GET['search'];
	}
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
						
						<h3>Loans Avilable</h3>
						<br>
						<form class="form-group" method="get">
							<label for="search"> Search a loan: </label>
							<input class="form-control" type="text" name="search" id="search">
							<br>
							<input class="btn btn-navbar" style="background-color: #0080FF" type="submit" name="srch_btn" value="Search">
						</form>
						<br><br>
						<div class="list-group">
						<?php
							
						
							$query = '
								SELECT * FROM loans WHERE loan_title LIKE "%'.$search_key.'%"
							';
							
							echo $query;
							
							$res = mysqli_query($conn, $query);
							
							while($row = mysqli_fetch_assoc($res)){
								echo "
									<h3>".$row['loan_title']."</h3>
									<a href='applying_loan.php?loan_id=".$row['id_loans']."'><img src='".$row['loan_img_link']."' style='width: 100%; height: 90%;'></a>
									<br>
									<br>
									<br>
									<br>
									<br>
									<br>
								";
							}
						?>
						</div>
						<a class="btn btn-navbar" style="background-color: #0080FF" href="home.php">Back</a>
					</div>
				</div>
			</div>
		</div>
	</div>


</body>


</html>