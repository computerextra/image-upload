# Sicherer Datei-Upload (PHP, MySQL)

Dieses kleine Projekt stellt einen sicheren Datei-Upload und passwortgeschützten Download bereit.

## Funktionen
- Upload bis max. 20 MB
- Speicherung mit zufälligem Hash als Dateiname (ohne Erweiterung)
- Passwort wird mit `password_hash()` sicher gehasht
- Metadaten (Hash, Passwort-Hash, Originalname, MIME, Größe, Pfad, Zeit) in MySQL (Tabelle `files`)
- Download nur mit korrektem Hash + Passwort, bei Fehlern generische Meldung

## Projektstruktur
```
bootstrap.php        # Bootstrap, DB-Verbindung (PDO SQLite), Schema, Hilfsfunktionen
public/index.php     # Startseite mit Formularen
public/upload.php    # Upload-Handler
public/download.php  # Download-Handler
storage/             # Gespeicherte Dateien (außerhalb des Webroots verwenden, wenn möglich)
data/                # SQLite-Datenbank-Datei
```

## Voraussetzungen
- PHP ≥ 8.0 mit `pdo_mysql` und `fileinfo`
- MySQL 5.7+/8.0+
- Webserver, der `public/` als DocumentRoot nutzt (Empfehlung)

## Konfiguration & Hinweise
- PHP-`upload_max_filesize` und `post_max_size` sollten ≥ 20M sein. Beispiel (php.ini):
  ```ini
  upload_max_filesize = 20M
  post_max_size = 21M
  ```
  Der Code prüft die Größe zusätzlich serverseitig und lehnt größere Uploads ab.
- Der Ordner `storage/` sollte für den Webserver-Prozess beschreibbar sein. Idealerweise liegt er außerhalb des DocumentRoots.
- Fehlerausgaben sind absichtlich generisch (keine Unterscheidung, ob Hash oder Passwort falsch ist).
- MIME-Type wird via `finfo` ermittelt; optional lässt sich eine Allowlist aktivieren (siehe Kommentar in `public/upload.php`).

## Konfiguration (MySQL)
Variante A – .env (empfohlen):

1) Abhängigkeiten installieren
```bash
composer install
```
2) `.env` erstellen
```bash
copy env.example .env   # Windows PowerShell/CMD
# oder: cp env.example .env
```
3) Werte in `.env` anpassen (DB-Host, User, Passwort, Name)

Variante B – Umgebungsvariablen:
Setze folgende Umgebungsvariablen für die DB-Verbindung (Beispiele):

```bash
set DB_HOST=127.0.0.1
set DB_PORT=3306
set DB_NAME=image_upload
set DB_USER=root
set DB_PASS=meinPasswort
set DB_CHARSET=utf8mb4
```

Die Datenbank (`DB_NAME`) muss existieren; die Tabelle `files` wird automatisch erstellt.

## Starten (lokal, eingebauter PHP-Entwicklungsserver)
```bash
php -S 127.0.0.1:8000 -t public
```
Dann im Browser: `http://127.0.0.1:8000`

## Sicherheit
- Passwörter werden gehasht gespeichert (kein Klartext)
- Datei-Download nur nach erfolgreicher Passwortprüfung
- Generische Fehlermeldungen vermeiden Informationslecks
- Zufällige, nicht erratbare Dateinamen (Hash)
- Keine direkten Zugriffe auf `storage/` per Webserver


