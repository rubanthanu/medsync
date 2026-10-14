<?php
require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../validators/CertificateValidator.php';
require_once __DIR__ . '/../services/CertificateService.php';

class CertificateController extends BaseController {

    private $certificateService;

    public function __construct() {
        parent::__construct();
        $this->certificateService = new CertificateService($this->conn);
    }

    public function request() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 4) {
                throw new PermissionException("Only patients can request medical certificates.");
            }

            $start_date = $_POST['start_date'] ?? '';
            $end_date = $_POST['end_date'] ?? '';
            $reason = $_POST['reason'] ?? '';

            CertificateValidator::validateRequest($start_date, $end_date, $reason, !empty($_FILES['proof_pdf']));

            $this->certificateService->requestCertificate($auth->id, $start_date, $end_date, $reason, $_FILES['proof_pdf']);

            http_response_code(201);
            echo json_encode(["message" => "Medical certificate requested successfully."]);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function review() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 2) {
                throw new PermissionException("Only doctors can review requests.");
            }

            $data = json_decode(file_get_contents("php://input"));
            CertificateValidator::validateReview($data);

            $rejectionReason = isset($data->rejection_reason) ? $data->rejection_reason : null;
            $message = $this->certificateService->reviewCertificate($auth->id, $data->certificate_id, $data->status, $rejectionReason);

            http_response_code(200);
            echo json_encode(["message" => $message]);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function get_requests() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 2 && $auth->role_id != 1 && $auth->role_id != 3) {
                throw new PermissionException("Unauthorized access.");
            }

            $requests = $this->certificateService->getRequests();

            http_response_code(200);
            echo json_encode($requests);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function get_patient_certificates() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 4) {
                throw new PermissionException("Unauthorized access.");
            }

            $requests = $this->certificateService->getPatientCertificates($auth->id);

            http_response_code(200);
            echo json_encode($requests);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * Authenticated file download endpoint.
     * Route: GET /api/?request=certificate/download_file/{type}/{filename}
     * Types: cert | proof | presc
     * Requires an active user session; enforces per-role ownership rules.
     */
    public function download_file($fileType = null, $filename = null) {
        try {
            // Must be authenticated
            $auth = AuthMiddleware::authenticate();

            // Validate file type
            $allowedTypes = ['cert', 'proof', 'presc'];
            if (!in_array($fileType, $allowedTypes, true) || empty($filename)) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid request."]);
                return;
            }

            // Strict filename whitelist: only alphanumeric, underscore, hyphen, dot
            if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid filename."]);
                return;
            }

            // Map type to directory
            $dirMap = [
                'cert'  => __DIR__ . '/../uploads/generated_pdfs/',
                'presc' => __DIR__ . '/../uploads/generated_pdfs/',
                'proof' => __DIR__ . '/../uploads/medical_proofs/',
            ];
            $dir = $dirMap[$fileType];
            $filepath = realpath($dir . $filename);

            // Path traversal guard
            if (!$filepath || strpos($filepath, realpath($dir)) !== 0) {
                http_response_code(404);
                echo json_encode(["message" => "File not found."]);
                return;
            }

            // Authorization: verify the user owns or is permitted to access this file
            $this->certificateService->authorizeFileAccess($auth->id, $auth->role_id, $fileType, $filename);

            // Detect real MIME type — proof files can be JPG/PNG/PDF
            $mimeType = 'application/octet-stream';
            if (function_exists('finfo_open')) {
                $finfo    = finfo_open(FILEINFO_MIME_TYPE);
                $detected = finfo_file($finfo, $filepath);
                finfo_close($finfo);
                if ($detected) $mimeType = $detected;
            } elseif (function_exists('mime_content_type')) {
                $mimeType = mime_content_type($filepath);
            }

            // Stream file to client with correct MIME type
            ob_end_clean();
            header('Content-Description: File Transfer');
            header('Content-Type: ' . $mimeType);
            header('Content-Disposition: inline; filename="' . basename($filepath) . '"');
            header('Content-Length: ' . filesize($filepath));
            header('Cache-Control: private');
            readfile($filepath);
            exit();

        } catch (Exception $e) {
            $this->handleException($e);
        }
    }
}
?>
