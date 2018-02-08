<?php

// Get variables from JS file
$name = $_GET["name"];
$class = $_GET["cl"];
$level = $_GET["level"];
$kills = $_GET["kills"];
$slainBy = $_GET["slainby"];

// Connect to the database
include('config.php');
$dbSuccess = false;

$dbConnected = mysqli_connect($db['hostname'], $db['username'], $db['password']);

if ($dbConnected) {
	$dbSelected = mysqli_select_db($dbConnected, $db['database']);
	if ($dbSelected) {
		$dbSuccess = true;
	} else {
		echo "DB Selection FAILED";
	}
} else {
	echo "MySQL Connection FAILED";
}

if ($dbSuccess) {
	// Insert the players score into the database
	$scoreInsert = "INSERT INTO scores (name, class, level, kills, slainby) values('$name', '$class', $level, $kills, '$slainBy')";
	mysqli_query($dbConnected, $scoreInsert);

	// Echo the full scores table back to JS
	$scoresSelect = "SELECT * FROM scores ORDER BY kills DESC LIMIT 10";
	$scoresSelectQuery = mysqli_query($dbConnected, $scoresSelect);
	$scores = mysqli_fetch_all($scoresSelectQuery, MYSQLI_ASSOC);

	foreach ($scores as $value) {
		echo 
		"<tr>
			<td>".$value['name']."</td>
			<td>".$value['class']."</td>
			<td>".$value['level']."</td>
			<td>".$value['kills']."</td>
			<td>".$value['slainby']."</td>
		</tr>";
	}
}
?>