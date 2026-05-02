<?php
/**
 * Fine Line Studio - CA Photo Upload Handler
 * Path: /mainwebsite_html/client/admin/upload.php
 *
 * Accepts multipart POST with:
 *   - project_slug  (string)  e.g. "cacopardo"
 *   - visit_date    (string)  e.g. "2026-05-02"
 *   - photos[]      (files)   one or more JPG/PNG files
 *
 * Saves files to:
 *   /mainwebsite_html/client/{project_slug}/photos/{visit_date}/{filename}
 *
 * Returns JSON:
 *   { "success": true, "urls": ["https://...", ...] }
 *   { "success": false, "error": "message" }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://fine-linestudio.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// --- AUTH ---
// Simple token check. Token is set here and matched against X-Admin-Token header.
$ADMIN_TOKEN = 'FLS-CA-Admin-2026';
$receivedToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if ($receivedToken !== $ADMIN_TOKEN) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

// --- VALIDATE INPUTS ---
$projectSlug = preg_replace('/[^a-z0-9_-]/', '', strtolower($_POST['project_slug'] ?? ''));
$visitDate   = preg_replace('/[^0-9-]/', '', $_POST['visit_date'] ?? '');

if (!$projectSlug || !$visitDate) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing project_slug or visit_date']);
    exit;
}

if (!isset($_FILES['photos'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No photos received']);
    exit;
}

// --- BUILD TARGET PATH ---
$webRoot  = '/var/www/html'; // symlinked from /mainwebsite_html
$photosDir = $webRoot . '/client/' . $projectSlug . '/photos/' . $visitDate;

if (!is_dir($photosDir)) {
    mkdir($photosDir, 0755, true);
}

$baseUrl = 'https://fine-linestudio.com/client/' . $projectSlug . '/photos/' . $visitDate;

// --- PROCESS UPLOADS ---
$uploaded = [];
$errors   = [];

// Normalize $_FILES['photos'] to always be an array
$files = $_FILES['photos'];
if (!is_array($files['name'])) {
    $files = array_map(function($v) { return [$v]; }, $files);
}

$count = count($files['name']);
for ($i = 0; $i < $count; $i++) {
    if ($files['error'][$i] !== UPLOAD_ERR_OK) {
        $errors[] = $files['name'][$i] . ': upload error ' . $files['error'][$i];
        continue;
    }

    $origName = basename($files['name'][$i]);
    $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

    // Only allow jpg/png (HEIC converted to JPG client-side before upload)
    if (!in_array($ext, ['jpg', 'jpeg', 'png'])) {
        $errors[] = $origName . ': unsupported type (must be jpg or png)';
        continue;
    }

    // Sanitize filename
    $safeName = preg_replace('/[^a-zA-Z0-9_.-]/', '-', pathinfo($origName, PATHINFO_FILENAME));
    $fileName = $safeName . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
    $destPath = $photosDir . '/' . $fileName;

    // Avoid overwriting -- append counter if exists
    $counter = 1;
    while (file_exists($destPath)) {
        $destPath = $photosDir . '/' . $safeName . '-' . $counter . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
        $fileName = $safeName . '-' . $counter . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
        $counter++;
    }

    if (move_uploaded_file($files['tmp_name'][$i], $destPath)) {
        chmod($destPath, 0644);
        $uploaded[] = $baseUrl . '/' . $fileName;
    } else {
        $errors[] = $origName . ': failed to save';
    }
}

echo json_encode([
    'success' => count($uploaded) > 0,
    'urls'    => $uploaded,
    'errors'  => $errors,
    'count'   => count($uploaded)
]);
