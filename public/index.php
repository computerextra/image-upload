<?php
declare(strict_types=1);
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'bootstrap.php';
?>
<!doctype html>
<html lang="de">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Datei Upload/Download</title>
	<style>
		body {
			font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif;
			max-width: 900px;
			margin: 40px auto;
			padding: 0 16px;
		}

		h1 {
			font-size: 1.6rem;
		}

		form {
			border: 1px solid #ddd;
			border-radius: 8px;
			padding: 16px;
			margin: 16px 0;
		}

		label {
			display: block;
			margin: 8px 0 4px;
			font-weight: 600;
		}

		input[type="text"],
		input[type="password"],
		input[type="file"] {
			width: 100%;
			padding: 8px;
			box-sizing: border-box;
		}

		button {
			margin-top: 12px;
			padding: 10px 14px;
			border: 1px solid #0a66c2;
			background: #0a66c2;
			color: #fff;
			border-radius: 6px;
			cursor: pointer;
		}

		.small {
			color: #555;
			font-size: 0.9rem;
		}

		.note {
			background: #f6f8fa;
			padding: 10px;
			border-radius: 6px;
			border: 1px solid #e5e7eb;
		}
	</style>
</head>

<body>
	<h1>Sicherer Datei-Upload und -Download</h1>

	<section>
		<h2>Datei hochladen</h2>
		<div class="note small">Maximalgröße: 20 MB. Der Dateiname wird als zufälliger Hash gespeichert. Bitte ein
			Passwort vergeben, um den späteren Download zu schützen.</div>
		<form action="/upload.php" method="post" enctype="multipart/form-data">
			<label for="file">Datei</label>
			<input type="file" id="file" name="file" required>

			<label for="password">Passwort</label>
			<input type="password" id="password" name="password" minlength="6" required>

			<button type="submit">Hochladen</button>
		</form>
	</section>

	<section>
		<h2>Datei herunterladen</h2>
		<form action="/download.php" method="post">
			<label for="hash">Datei-Hash</label>
			<input type="text" id="hash" name="hash" required>

			<label for="password_dl">Passwort</label>
			<input type="password" id="password_dl" name="password" required>

			<button type="submit">Download starten</button>
		</form>
	</section>

	<section>
		<h2>Gesetzliches</h2>
		<a href="https://computer-extra.de/Datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz</a>
		<a href="https://computer-extra.de/Impressum" target="_blank" rel="noopener noreferrer">Impressum</a>
	</section>
</body>

</html>