<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';

// Nur POST akzeptieren: erwartet werden 'hash' und optional 'password'
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$hash = isset($_POST['hash']) ? trim((string) $_POST['hash']) : '';
$password = isset($_POST['password']) ? (string) $_POST['password'] : '';

if ($hash === '') {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Hash fehlt.']);
    exit;
}

try {
    $pdo = get_pdo();
    $pdo->beginTransaction();

    // Datensatz suchen
    $stmt = $pdo->prepare('SELECT id, hash, original_name, stored_name, mime_type, size_bytes, password_hash, max_downloads, downloads FROM uploads WHERE hash = :hash');
    $stmt->execute([':hash' => $hash]);
    $row = $stmt->fetch();

    if (!$row) {
        $pdo->rollBack();
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Datei nicht gefunden.']);
        exit;
    }

    $uploadsDir = storage_uploads_dir();
    $filepath = $uploadsDir . DIRECTORY_SEPARATOR . $row['stored_name'];
    if (!is_file($filepath)) {
        $pdo->rollBack();
        http_response_code(410);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Datei ist nicht mehr verfügbar.']);
        exit;
    }

    // Passwort prüfen (falls gesetzt)
    if (!empty($row['password_hash'])) {
        if ($password === '' || !password_verify($password, $row['password_hash'])) {
            $pdo->rollBack();
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Passwort ist ungültig.']);
            exit;
        }
    }

    $maxDownloads = (int) $row['max_downloads'];
    $deleteAfterSend = false;

    if ($maxDownloads > 0) {
        // Limit aktiv
        if ($maxDownloads === 1) {
            // Letzter erlaubter Download
            $upd = $pdo->prepare('UPDATE uploads SET max_downloads = 0, downloads = downloads + 1 WHERE id = :id');
            $upd->execute([':id' => $row['id']]);
            $deleteAfterSend = true;
        } else {
            $upd = $pdo->prepare('UPDATE uploads SET max_downloads = max_downloads - 1, downloads = downloads + 1 WHERE id = :id');
            $upd->execute([':id' => $row['id']]);
        }
    } else {
        // Unendlich (0) -> nur Zähler erhöhen
        $upd = $pdo->prepare('UPDATE uploads SET downloads = downloads + 1 WHERE id = :id');
        $upd->execute([':id' => $row['id']]);
    }

    $pdo->commit();

    // Datei ausliefern
    $mime = $row['mime_type'] ?: 'application/octet-stream';
    $filesize = filesize($filepath);
    $downloadName = $row['original_name'] ?: $row['hash'];

    // Schutz vor Ausgabe-Fehlern
    if (ob_get_level()) {
        ob_end_clean();
    }
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string) $filesize);
    header("Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode($downloadName));
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');

    $chunkSize = 8192;
    $fp = fopen($filepath, 'rb');
    if ($fp === false) {
        // Falls Öffnen fehlschlägt
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Datei konnte nicht geöffnet werden.']);
        exit;
    }
    while (!feof($fp)) {
        echo fread($fp, $chunkSize);
        flush();
    }
    fclose($fp);

    // Nach erfolgreichem Versand ggf. löschen
    if ($deleteAfterSend) {
        @unlink($filepath);
        try {
            $pdo2 = get_pdo();
            $del = $pdo2->prepare('DELETE FROM uploads WHERE id = :id');
            $del->execute([':id' => $row['id']]);
        } catch (Throwable $e) {
            // Schlucken, um die Auslieferung nicht zu stören
        }
    }
    exit;
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Interner Fehler beim Download.']);
    exit;
}