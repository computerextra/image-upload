<?php

declare(strict_types=1);

// Konfiguration und Datenbank-Helfer

// Erwartete Umgebungsvariablen:
// DB_DSN (z.B. "mysql:host=localhost;dbname=image_upload;charset=utf8mb4" oder "sqlite:../storage/database.sqlite")
// DB_USER
// DB_PASS

function get_pdo(): PDO
{
	$dsn = getenv('DB_DSN') ?: '';
	$user = getenv('DB_USER') ?: '';
	$pass = getenv('DB_PASS') ?: '';

	if ($dsn === '') {
		// Fallback auf SQLite in storage, wenn kein DSN gesetzt ist
		$storageDir = __DIR__ . DIRECTORY_SEPARATOR . 'storage';
		if (!is_dir($storageDir)) {
			mkdir($storageDir, 0750, true);
		}
		$dsn = 'sqlite:' . $storageDir . DIRECTORY_SEPARATOR . 'database.sqlite';
	}

	$options = [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	];

	$pdo = new PDO($dsn, $user, $pass, $options);
	ensure_schema($pdo);
	return $pdo;
}

function ensure_schema(PDO $pdo): void
{
	// Erstelle Tabelle, falls nicht vorhanden
	$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
	$createdAtType = ($driver === 'sqlite') ? 'TEXT' : 'DATETIME';

	$sql = "CREATE TABLE IF NOT EXISTS uploads (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		hash TEXT NOT NULL UNIQUE,
		original_name TEXT NOT NULL,
		stored_name TEXT NOT NULL,
		mime_type TEXT,
		size_bytes INTEGER NOT NULL,
		password_hash TEXT,
		max_downloads INTEGER NOT NULL DEFAULT 0,
		downloads INTEGER NOT NULL DEFAULT 0,
		created_at $createdAtType NOT NULL
	)";
	$pdo->exec($sql);
}

function hash_password(?string $password): ?string
{
	if ($password === null || $password === '') {
		return null;
	}
	$algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
	return password_hash($password, $algo);
}

function now_iso8601(): string
{
	return gmdate('Y-m-d\\TH:i:s\\Z');
}

function storage_uploads_dir(): string
{
	$dir = __DIR__ . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'uploads';
	if (!is_dir($dir)) {
		mkdir($dir, 0750, true);
	}
	return $dir;
}


