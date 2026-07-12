<?php
require_once __DIR__ . '/../exceptions/ValidationException.php';

class UploadHelper {

    // Allowed MIME types per upload category
    private static $ALLOWED_TYPES = [
        'image' => [
            'mimes' => ['image/jpeg', 'image/png', 'image/webp'],
            'extensions' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_size' => 5 * 1024 * 1024, // 5 MB
        ],
        'document' => [
            'mimes' => ['application/pdf'],
            'extensions' => ['pdf'],
            'max_size' => 10 * 1024 * 1024, // 10 MB
        ],
        'proof' => [
            'mimes' => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
            'extensions' => ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
            'max_size' => 10 * 1024 * 1024, // 10 MB
        ],
    ];

    /**
     * Securely upload a file to the specified directory.
     *
     * Validates upload errors, file size, extension (against whitelist),
     * and MIME type (via PHP finfo). Generates a cryptographically random
     * filename so user-supplied names are never used on disk.
     *
     * @param array  $file      The $_FILES entry (e.g. $_FILES['proof_pdf'])
     * @param string $targetDir Absolute path to the target directory
     * @param string $type      Upload category: 'image' or 'document'
     * @param string $prefix    Optional filename prefix (e.g. 'profile_', 'sig_')
     * @return string The generated filename on success
     * @throws ValidationException on any validation failure
     */
    public static function uploadFile($file, $targetDir, $type = 'document', $prefix = '') {

        // 1. Check for PHP upload errors
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit.',
                UPLOAD_ERR_FORM_SIZE  => 'File exceeds form upload limit.',
                UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded.',
                UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
                UPLOAD_ERR_NO_TMP_DIR => 'Server configuration error.',
                UPLOAD_ERR_CANT_WRITE => 'Server configuration error.',
                UPLOAD_ERR_EXTENSION  => 'Upload blocked by server.',
            ];
            $code = $file['error'] ?? UPLOAD_ERR_NO_FILE;
            $msg = $errorMessages[$code] ?? 'Unknown upload error.';
            throw new ValidationException($msg);
        }

        // 2. Verify the upload category is known
        if (!isset(self::$ALLOWED_TYPES[$type])) {
            throw new ValidationException("Invalid upload type specified.");
        }
        $rules = self::$ALLOWED_TYPES[$type];

        // 3. Check file size
        if ($file['size'] > $rules['max_size']) {
            $limitMB = $rules['max_size'] / (1024 * 1024);
            throw new ValidationException("File size exceeds the {$limitMB} MB limit.");
        }

        // 4. Validate file extension (lowercase, strip double-extensions)
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        // Block double extensions like "shell.php.jpg" — only the final
        // extension is kept, but also reject names whose *base* contains
        // a dangerous extension anywhere (e.g. "file.php.jpg").
        $dangerousExtensions = ['php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'phar', 'shtml', 'cgi'];
        $nameLower = strtolower($file['name']);
        foreach ($dangerousExtensions as $dangerousExt) {
            if (strpos($nameLower, '.' . $dangerousExt) !== false) {
                throw new ValidationException("File type not allowed.");
            }
        }

        if (!in_array($extension, $rules['extensions'], true)) {
            throw new ValidationException(
                "Invalid file type. Allowed: " . implode(', ', $rules['extensions']) . "."
            );
        }

        // 5. Validate MIME type using PHP finfo (reads actual file content)
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($file['tmp_name']);

        if (!in_array($detectedMime, $rules['mimes'], true)) {
            throw new ValidationException(
                "Invalid file content. The file does not match the expected type."
            );
        }

        // 6. Ensure target directory exists with safe permissions
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // 7. Generate a cryptographically random filename
        //    Never use the original user-supplied filename.
        $randomName = bin2hex(random_bytes(16));
        $fileName   = $prefix . $randomName . '.' . $extension;
        $targetPath = $targetDir . $fileName;

        // 8. Move the uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new ValidationException("Failed to save uploaded file.");
        }

        return $fileName;
    }
}
?>
