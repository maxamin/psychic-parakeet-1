<?php
	
	include("mysql_connect_init.php");
	
	$conn = mysqli_connect($host, $user, $password);	

	$query = 'CREATE DATABASE bbp_db';
	
	mysqli_query($conn, $query);
	
	$query = '
		USE bbp_db
	';

	mysqli_query($conn, $query);
	
	$query = '
		CREATE TABLE accounts (
			id_account INT NOT NULL AUTO_INCREMENT,
			username varchar(50) NOT NULL,
			password varchar(100) NOT NULL,
			balance INT NOT NULL,
			PRIMARY KEY (id_account)
		)
	';
	
	mysqli_query($conn, $query);
	
	$query = '
		CREATE TABLE loans (
			id_loans INT NOT NULL AUTO_INCREMENT,
			loan_title varchar(200) NOT NULL,
			loan_img_link varchar(200) NOT NULL,
			PRIMARY KEY (id_loans)
		)
	';
	
	mysqli_query($conn, $query);
	
	$query = '
		CREATE TABLE comments (
			id_comment INT NOT NULL AUTO_INCREMENT,
			id_loans INT NOT NULL,
			username varchar(50) NOT NULL,
			content varchar(200) NOT NULL,
			date_created varchar(50) NOT NULL,
			PRIMARY KEY (id_comment)
		)
	';
	
	mysqli_query($conn, $query);
	
	$query = '
		INSERT INTO accounts (`username`, `password`, `balance`) VALUES 
		("Melchor_Mayaman", "s3cr3t_1s_n0w_r3v34l3d", 1000000),
		("Fiona_May","jdkjbErJYS",0),
		("Richard_Clarkson","vtXJBNxhnV",0),
		("Amy_Metcalfe","lUFxMaaRIk",0),
		("Sue_Thomson","OhpShnTxwk",0),
		("Keith_Fisher","lkzQyktQil",0),
		("Amy_Abraham","rTNsBnpFUX",0),
		("Rose_Jones","HyNHFBECdd",0),
		("Penelope_Mills","xezeORIqae",0),
		("Ruth_Henderson","VgrsEBVkfX",0),
		("Trevor_Rampling","GMcdYymmTg",0),
		("Elite_Hacker","password",0)
	';
	
	mysqli_query($conn, $query);

	date_default_timezone_set("Asia/Manila");
	
	$query = '
		INSERT INTO loans (`loan_title`,`loan_img_link`) VALUES
		("Lamborghini Aventador SVJ Loan", "lambo_loan.png"),
		("Manor Loan", "manor_loan.png")
	';
	
	mysqli_query($conn, $query);
	
	$query = '
		INSERT INTO comments (`id_loans`,`username`,`content`, `date_created`) VALUES
		(1,"Melchor_Mayaman","Wooow. So cool. Maybe I should get one!","03/12/2018 5:05:16 pm"),
		(1,"Fiona_May","When is the deadline for its applicaction?","23/12/2018 12:23:43 pm"),
		(1,"Richard_Clarkson","Naks naman. Ang ganda!","02/01/2019 08:25:31 pm"),
		(2,"Sue_Thomson","Looks nice.","02/01/2019 07:01:26 pm")
	';
	
	mysqli_query($conn, $query);
?>
