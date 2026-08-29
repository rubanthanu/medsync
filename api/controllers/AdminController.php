<?php
require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../services/AdminService.php';

class AdminController extends BaseController {

    private $adminService;

    public function __construct() {
        parent::__construct();
        $this->adminService = new AdminService($this->conn);
    }

    public function get_stats() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $stats = $this->adminService->getStats();

            http_response_code(200);
            echo json_encode($stats);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function get_users() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $users = $this->adminService->getUsers();

            http_response_code(200);
            echo json_encode($users);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function update_user_status() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->user_id) || empty($data->status)) {
                throw new ValidationException("User ID and status are required.");
            }

            $this->adminService->updateUserStatus($data->user_id, $data->status);

            http_response_code(200);
            echo json_encode(["message" => "User status updated successfully."]);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function create_user() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $data = json_decode(file_get_contents("php://input"));

            $this->adminService->createUser($data);

            http_response_code(201);
            echo json_encode(["message" => "User created successfully."]);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function get_appointment_windows() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $windows = $this->adminService->getAppointmentWindows();

            http_response_code(200);
            echo json_encode($windows);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function update_window_slots() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->window_id) || !isset($data->max_slots)) {
                throw new ValidationException("Window ID and max slots are required.");
            }

            $this->adminService->updateWindowSlots($data->window_id, $data->max_slots);

            http_response_code(200);
            echo json_encode(["message" => "Window slots updated successfully."]);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function get_patients() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $params = [
                'search'      => isset($_GET['search']) ? trim($_GET['search']) : '',
                'gender'      => isset($_GET['gender']) ? trim($_GET['gender']) : '',
                'status'      => isset($_GET['status']) ? trim($_GET['status']) : '',
                'blood_group' => isset($_GET['blood_group']) ? trim($_GET['blood_group']) : '',
                'date_from'   => isset($_GET['date_from']) ? trim($_GET['date_from']) : '',
                'date_to'     => isset($_GET['date_to']) ? trim($_GET['date_to']) : '',
                'page'        => isset($_GET['page']) ? (int)$_GET['page'] : 1,
                'limit'       => isset($_GET['limit']) ? (int)$_GET['limit'] : 10,
                'sort'        => isset($_GET['sort']) ? trim($_GET['sort']) : 'created_at',
                'order'       => isset($_GET['order']) ? trim($_GET['order']) : 'desc',
            ];

            $result = $this->adminService->getPatients($params);

            http_response_code(200);
            echo json_encode($result);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    public function get_patient_details() {
        try {
            $auth = AuthMiddleware::authenticate();
            if ($auth->role_id != 1) {
                throw new PermissionException("Unauthorized access.");
            }

            $patientId = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : 0;
            if ($patientId <= 0) {
                throw new ValidationException("Patient ID is required.");
            }

            $patient = $this->adminService->getPatientDetails($patientId);

            http_response_code(200);
            echo json_encode($patient);
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }
}
?>
