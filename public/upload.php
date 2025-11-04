<?php
declare(strict_types=1);
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'bootstrap.php';

ensurePost();

// 20 MB in bytes
$MAX_BYTES = 20 * 1024 * 1024;

// Validate presence
if (!isset($_FILES['file']) || !isset($_POST['password'])) {
	respondWithError('Etwas ist schiefgelaufen.');
}

$password = (string) ($_POST['password'] ?? '');
if ($password === '' || mb_strlen($password) < 6) {
	respondWithError('Etwas ist schiefgelaufen.');
}

$upload = $_FILES['file'];
if (!is_array($upload) || (int) $upload['error'] !== UPLOAD_ERR_OK) {
	respondWithError('Etwas ist schiefgelaufen.');
}

// Enforce size
$size = (int) ($upload['size'] ?? 0);
if ($size <= 0 || $size > $MAX_BYTES) {
	respondWithError('Etwas ist schiefgelaufen.');
}

// Determine safe mime using finfo
$tmpPath = (string) $upload['tmp_name'];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmpPath) ?: null;

// Optional: basic allowlist (commented). If desired, define allowed MIME types.
// $allowed = ['image/png','image/jpeg','application/pdf','text/plain'];
// if ($mime !== null && !in_array($mime, $allowed, true)) { respondWithError('Etwas ist schiefgelaufen.'); }

$originalName = $upload['name'];
$clientName = (string) ($upload['name'] ?? '');
$clientName = basename(trim($clientName));
if ($originalName === '') {
	$originalName = 'unbenannt';
}

// Generate random hash filename and keep original extension (if any)
$hash = generateRandomHash(16); // 32 hex chars
$ext = pathinfo($originalName, PATHINFO_EXTENSION);
$storedFilename = $ext !== '' ? ($hash . '.' . $ext) : $hash;
$storedPath = STORAGE_PATH . DIRECTORY_SEPARATOR . $storedFilename;

// Move uploaded file
if (!move_uploaded_file($tmpPath, $storedPath)) {
	respondWithError('Etwas ist schiefgelaufen.');
}

// Tighten permissions (best effort on non-Windows)
@chmod($storedPath, 0640);

// Store metadata in DB with password hash
$pdo = db_connect();
$stmt = $pdo->prepare('INSERT INTO files (file_hash, password_hash, original_name, mime_type, size_bytes, stored_path, created_at) VALUES (:file_hash, :password_hash, :original_name, :mime_type, :size_bytes, :stored_path, :created_at)');
$ok = $stmt->execute([
	':file_hash' => $hash,
	':password_hash' => password_hash($password, PASSWORD_DEFAULT),
	':original_name' => $originalName,
	':mime_type' => $mime,
	':size_bytes' => $size,
	':stored_path' => $storedPath,
	':created_at' => nowIso8601(),
]);

if (!$ok) {
	@unlink($storedPath);
	respondWithError('Etwas ist schiefgelaufen.');
}

// Respond to user with the hash
http_response_code(200);
?><!doctype html>
<html lang="de">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Upload erfolgreich</title>
	<style>
		body {
			font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif;
			max-width: 900px;
			margin: 40px auto;
			padding: 0 16px;
		}

		pre {
			background: #f6f8fa;
			padding: 12px;
			border-radius: 6px;
			border: 1px solid #e5e7eb;
		}

		button,
		a.btn {
			display: inline-block;
			margin-top: 12px;
			padding: 10px 14px;
			border: 1px solid #0a66c2;
			background: #0a66c2;
			color: #fff;
			border-radius: 6px;
			text-decoration: none;
		}
	</style>
</head>

<body>
	<h1>Upload erfolgreich</h1>
	<p>Bewahren Sie den folgenden Datei-Hash sicher auf. Er wird für den Download benötigt:</p>
	<pre><?= htmlspecialchars($hash, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></pre>
	<p><a class="btn" href="/index.php">Zurück</a></p>
</body>

</html>