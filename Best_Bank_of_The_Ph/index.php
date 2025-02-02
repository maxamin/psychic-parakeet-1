<?php
	session_start();
	
	if(isset($_SESSION['user'])){
		header('Location: home.php');
		exit(0);
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
					<div class="jumbotron" style="color: white; margin: 100px; height: 100%; width: 68%; background-color: #0E4D92; float: left; margin: 0px; padding: 10px; text-align: left;">
						<h3>Updates:</h3>
						<ul>
							<li>Lamborghini Aventador SVJ loan.	<a href="#"><img src="lambo_loan.png" style="width: 90%; height: 90%;"></a></li>
							<br>
							<li>2-floor 600x600 square meter manor.	<a href="#"><img src="manor_loan.png" style="width: 90%; height: 90%;"></a></li>
						</ul>
						<h3>What is BBP?</h3>
						<br>
						BBP is the best and most reliable bank for Filipino people.
						<br>
						<h3>What services does online BBP offer?</h3>
						<ul>
							<li><h5><strong>SECURE</strong> online banking transcations such as:</h5>
								<ul>
									<li>Money transfer</li>
									<li>Balance Checking</li>
									<li>Online Loan Application</li>
								</ul>
							</li>
						</ul>
						<br>
					</div>
					<div class="jumbotron" style="color: white; height: 100%; width: 30%; background-color: #0080FF; float:right; margin: 0px; padding: 10px">
						<form action="login_auth.php" method="post" class="form-group">
							<h4 ><strong>Login </strong><span class="glyphicon glyphicon-lock"></span></h4>
							<?php
								if(isset($_SESSION['error']) AND $_SESSION['error'] == 1){
									echo "
										<div class='alert alert-danger'>
											<strong>Login Failed!</strong> Wrong username or password
										</div>
									";
								}
								$_SESSION['error'] = 0;
								$_SESSION['success'] = 0;
							?>
							<br>
							<label for="user">Username: </label>
							<input class="form-control" type="text" name="user" id="user" value="">
							<br>
							<br>
							<label for="user">Password: </label>
							<input class="form-control" type="password" name="pass" id="passs" value="">
							<br>
							<input style="color: white;" class="btn btn-navbar" type="submit" name="login" value="Login">
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>


</body>


</html>