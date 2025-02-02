<?php

	include('../mysql_connect_init.php');
?>

<!DOCTYPE HTML>

<html>

<head>

</head>

<body>

	<table border=1>
	<tbody>

	<?php
		if (isset($_POST['query'])){
				$query = $_POST['query'];
				
				$res = mysqli_query($conn, $query);
				
				if ($row = mysqli_fetch_assoc($res)){
					
					echo '<tr>';
					foreach(array_keys($row) as $key){
						echo '
							<td><b>'.$key.'</b></td>
						';
					}
					echo '</tr>';
					
					echo '<tr>';
					foreach(array_keys($row) as $key){
						echo '
							<td>'.$row[$key].'</td>
						';
					}
					echo '</tr>';
					
				}
				
				while ($row = mysqli_fetch_assoc($res)){
					
					echo '<tr>';
					$array_keys = array_keys($row);
					$length = count($array_keys);
					
					foreach($array_keys as $key){
						echo '<td>'.$row[$key].'</td>';
					}
					echo '</tr>';
				}
		}
	?>
	
	</tbody>
	
	</table>
	<br>
	<form method="POST">
		Query: 
		<input type="text" name="query" style="width: 600px">
	</form>

</body>


</html>