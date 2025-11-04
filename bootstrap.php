<?php
declare(strict_types=1);

// Simple bootstrap: paths, PDO (MySQL), and table creation

// Base paths
define('BASE_PATH', __DIR__);
define('PUBLIC_PATH', BASE_PATH . DIRECTORY_SEPARATOR . 'public');
define('DATA_PATH', BASE_PATH . DIRECTORY_SEPARATOR . 'data');
define('STORAGE_PATH', BASE_PATH . DIRECTORY_SEPARATOR . 'storage');

// Ensure required directories exist
@mkdir(DATA_PATH, 0775, true);
@mkdir(STORAGE_PATH, 0775, true);

// Composer autoload and .env loading (phpdotenv)
$autoload = BASE_PATH . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
if (is_file($autoload)) {
    require_once $autoload;
    if (class_exists(\Dotenv\Dotenv::class)) {
        $dotenv = \Dotenv\Dotenv::createImmutable(BASE_PATH);
        $dotenv->safeLoad();
    }
}

function envVar(string $key, $default = null): mixed
{
    if (array_key_exists($key, $_ENV)) {
        return $_ENV[$key];
    }
    $val = getenv($key);
    return $val !== false ? $val : $default;
}

// Create database connection (MySQL via PDO)
function db_connect(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $host = (string) (envVar('DB_HOST', '127.0.0.1'));
    $port = (int) (envVar('DB_PORT', 3306));
    $db = (string) (envVar('DB_NAME', 'image_upload'));
    $user = (string) (envVar('DB_USER', 'root'));
    $pass = (string) (envVar('DB_PASS', ''));
    $charset = (string) (envVar('DB_CHARSET', 'utf8mb4'));

    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    init_schema($pdo);
    return $pdo;
}

function init_schema(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS files (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            file_hash VARCHAR(64) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            mime_type VARCHAR(255) NULL,
            size_bytes BIGINT UNSIGNED NOT NULL,
            stored_path VARCHAR(1024) NOT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uniq_file_hash (file_hash)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function generateRandomHash(int $bytes = 16): string
{
    return bin2hex(random_bytes($bytes)); // 32 hex chars for 16 bytes
}

function nowIso8601(): string
{
    return (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format(DATE_ATOM);
}

function respondWithError(string $message, int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    exit;
}

function ensurePost(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        respondWithError('Ungültige Anforderung.', 405);
    }
}




