<?php
declare(strict_types=1);
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'bootstrap.php';

ensurePost();

$hash = (string) ($_POST['hash'] ?? '');
$password = (string) ($_POST['password'] ?? '');

if ($hash === '' || $password === '') {
	respondWithError('Etwas ist schiefgelaufen.');
}

$pdo = db_connect();
$stmt = $pdo->prepare('SELECT file_hash, password_hash, original_name, mime_type, size_bytes, stored_path FROM files WHERE file_hash = :file_hash LIMIT 1');
$stmt->execute([':file_hash' => $hash]);
$row = $stmt->fetch();

// Generic failure to avoid revealing if hash or password was wrong
if (!$row || !is_array($row)) {
	respondWithError('Etwas ist schiefgelaufen.', 404);
}

if (!password_verify($password, (string) $row['password_hash'])) {
	respondWithError('Etwas ist schiefgelaufen.', 403);
}

$path = (string) $row['stored_path'];
if (!is_file($path) || !is_readable($path)) {
	respondWithError('Etwas ist schiefgelaufen.', 410);
}

// Send file for download
$mime = $row['mime_type'] ?: 'application/octet-stream';
$downloadName = $row['original_name'] ?: ('datei-' . $row['file_hash']);

// Clean output buffers
while (ob_get_level() > 0) {
	ob_end_clean();
}

header('Content-Description: File Transfer');
header('Content-Type: ' . $mime);
header('Content-Disposition: attachment; filename="' . rawurlencode($downloadName) . '"');
header('Content-Transfer-Encoding: binary');
header('Content-Length: ' . (string) filesize($path));
header('X-Content-Type-Options: nosniff');

$fp = fopen($path, 'rb');
if ($fp === false) {
	respondWithError('Etwas ist schiefgelaufen.', 500);
}
fpassthru($fp);
fclose($fp);
exit;


