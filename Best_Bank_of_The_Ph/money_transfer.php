<?php
	session_start();
	
	if(!isset($_SESSION['user'])){
		header('Location: index.php');
	}
	
	include('mysql_connect_init.php');
	
	if (isset($_POST['send_amount'])){
		
		if($_POST['amount'] > 0){
			$query = '
				SELECT * FROM accounts WHERE username = "'.$_SESSION['user'].'"
				AND balance >= '.((int)$_POST['send_amount']).'
			';
			
			$res = mysqli_query($conn, $query);
			
			if (($row = mysqli_fetch_assoc($res)) and ($row['balance'] >= $_POST['amount'])){
				$new_value = $row['balance'] - $_POST['amount'];
				
				if (strcmp($_POST['recipient'],$_SESSION['user']) != 0){
					
					$query = '
						UPDATE accounts SET balance = balance + '.$_POST['amount'].'
						WHERE username = "'.$_POST['recipient'].'"
					';
					
					mysqli_query($conn, $query);
					
					$query = '
						UPDATE accounts SET balance = '.$new_value.' WHERE username = "'.$_SESSION['user'].'"
					';
					
					mysqli_query($conn, $query);
					
					$_SESSION['success'] = 1;
					header("Location: money_transfer.php");
				}
				else {
					$_SESSION['error'] = 4;
				}
			}	
			else {
				$_SESSION['error'] = 3;
			}
		}
		else {
			$_SESSION['error'] = 2;
		}
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
						<h3>Money Transfer</h3>
						<br>
						<?php
							$query = '
								SELECT balance FROM accounts WHERE username = "'.$_SESSION['user'].'"
							';
							
							$res = mysqli_query($conn, $query);
							$row = mysqli_fetch_assoc($res);
							
							echo "
								<h4>Your current balance: &#8369 ".(number_format($row['balance'],2))."</h4>
							";
							
							$error_msgs = array(
								"",
								"
									<div class='alert alert-danger'>
										<strong>Transfer Money Failed!</strong> Please try again.
									</div>
								",
								"	
									<div class='alert alert-warning'>
										<strong>Amount to send must be greater than 0.</strong> Please try again.
									</div>
								",
								"
									<div class='alert alert-warning'>
										<strong>You have insufficient funds.</strong> Please try again.
									</div>
								",
								"
									<div class='alert alert-warning'>
										<strong>Your can't transfer money to yourself.</strong> Please try again.
									</div>
								"
								
							);
							
							$success_msgs = array(
								"",
								"<div class='alert alert-warning'>
									Money transfer is successful!
								</div>"
							);
							
							echo $error_msgs[$_SESSION['error']];
							echo $success_msgs[$_SESSION['success']];
							
							$_SESSION['error'] = 0;	
							$_SESSION['success'] = 0;
						?>
						<br>
						<form method="post" class="form-group">
							<label for="recipient">Money Recipient</label>
							<input type="text" class="form-control" id="recipient" name="recipient">
							<br>
							<label for="amount">Amount to Transfer</label>
							<input type="number" class="form-control" min=1 name="amount" id="amount" >
							<br>
							<input type="submit" class="btn btn-navbar" style="background-color: #0080FF" name="send_amount" value="Transfer">
						</form>
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