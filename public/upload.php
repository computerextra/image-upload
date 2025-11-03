<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . './config.php';

// Maximale erlaubte Größe: 20 MB
$maxBytes = 20 * 1024 * 1024;

// Nur POST mit Datei akzeptieren
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Keine Datei übermittelt. Feldname: file']);
    exit;
}

$file = $_FILES['file'];

if (!isset($file['error']) || is_array($file['error'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige Dateiübermittlung.']);
    exit;
}

switch ($file['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_NO_FILE:
        http_response_code(400);
        echo json_encode(['error' => 'Keine Datei ausgewählt.']);
        exit;
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        http_response_code(413);
        echo json_encode(['error' => 'Datei zu groß.']);
        exit;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unbekannter Upload-Fehler.']);
        exit;
}

if (!is_uploaded_file($file['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige temporäre Datei.']);
    exit;
}

if ((int) $file['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(['error' => 'Maximale Dateigröße von 20 MB überschritten.']);
    exit;
}

// Optional: Passwort und maximale Downloads
$plainPassword = isset($_POST['password']) ? trim((string) $_POST['password']) : '';
$passwordHash = hash_password($plainPassword);

$maxDownloads = 0; // 0 = unendlich
if (isset($_POST['max_downloads'])) {
    $maxDownloads = (int) $_POST['max_downloads'];
    if ($maxDownloads < 0) {
        $maxDownloads = 0;
    }
}

// MIME-Type prüfen
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']) ?: 'application/octet-stream';

// Sicheren Speicherort bestimmen (außerhalb des Webroots)
$uploadsDir = storage_uploads_dir();

// Zufälligen Hash als Dateiname erzeugen
$hash = bin2hex(random_bytes(16));
$storedName = $hash; // Ohne Erweiterung speichern
$destination = $uploadsDir . DIRECTORY_SEPARATOR . $storedName;

// Verschieben
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['error' => 'Datei konnte nicht gespeichert werden.']);
    exit;
}

// Dateirechte einschränken
@chmod($destination, 0640);

// Metadaten sammeln
$originalName = isset($file['name']) ? (string) $file['name'] : 'unbekannt';
$sizeBytes = (int) $file['size'];

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('INSERT INTO uploads (hash, original_name, stored_name, mime_type, size_bytes, password_hash, max_downloads, created_at) VALUES (:hash, :original_name, :stored_name, :mime_type, :size_bytes, :password_hash, :max_downloads, :created_at)');
    $stmt->execute([
        ':hash' => $hash,
        ':original_name' => $originalName,
        ':stored_name' => $storedName,
        ':mime_type' => $mime,
        ':size_bytes' => $sizeBytes,
        ':password_hash' => $passwordHash,
        ':max_downloads' => $maxDownloads,
        ':created_at' => now_iso8601(),
    ]);
} catch (Throwable $e) {
    // Aufräumen, falls DB-Insert fehlschlägt
    @unlink($destination);
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler beim Speichern.', 'detail' => '']);
    exit;
}

echo json_encode([
    'success' => true,
    'hash' => $hash,
    'filename' => $storedName,
    'size' => $sizeBytes,
    'mime' => $mime,
    'max_downloads' => $maxDownloads,
]);
