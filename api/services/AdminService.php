<?php
require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../repositories/AppointmentRepository.php';
require_once __DIR__ . '/../repositories/PrescriptionRepository.php';
require_once __DIR__ . '/../repositories/CertificateRepository.php';
require_once __DIR__ . '/../repositories/PatientRepository.php';
require_once __DIR__ . '/../repositories/NotificationRepository.php';
require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../helpers/EmailHelper.php';
require_once __DIR__ . '/../exceptions/ValidationException.php';
require_once __DIR__ . '/../exceptions/NotFoundException.php';

class AdminService {
    private $conn;
    private $userRepo;
    private $appointmentRepo;
    private $prescriptionRepo;
    private $certificateRepo;
    private $patientRepo;
    private $notificationRepo;
    private $authService;

    public function __construct($conn) {
        $this->conn = $conn;
        $this->userRepo = new UserRepository($conn);
        $this->appointmentRepo = new AppointmentRepository($conn);
        $this->prescriptionRepo = new PrescriptionRepository($conn);
        $this->certificateRepo = new CertificateRepository($conn);
        $this->patientRepo = new PatientRepository($conn);
        $this->notificationRepo = new NotificationRepository($conn);
        $this->authService = new AuthService($conn);
    }

    public function getStats() {
        $stats = [];
        $stats['total_appointments'] = $this->appointmentRepo->getTotalCount();
        $stats['total_patients'] = $this->userRepo->getTotalPatients();
        $stats['total_certificates'] = $this->certificateRepo->getTotalCount();
        $stats['total_prescriptions'] = $this->prescriptionRepo->getTotalCount();
        return $stats;
    }

    public function getUsers() {
        return $this->userRepo->getAllUsersWithRoles();
    }

    public function updateUserStatus($userId, $status, $currentUserId) {
        // Prevent admin from deactivating themselves
        if ((int)$userId === (int)$currentUserId) {
            throw new ValidationException("You cannot change your own account status.");
        }

        // Validate status is an allowed value
        $allowedStatuses = ['Active', 'Blocked', 'Inactive', 'Suspended'];
        if (!in_array($status, $allowedStatuses, true)) {
            throw new ValidationException("Invalid status value.");
        }

        $user = $this->userRepo->findById($userId);
        if (!$user) {
            throw new NotFoundException("User not found.");
        }

        $this->userRepo->updateStatus($userId, $status);

        // If account is being deactivated, inform user via email
        if ($status !== 'Active' && $user['account_status'] !== $status) {
            $this->sendDeactivationEmail($user);
        }
    }

    private function sendDeactivationEmail($user) {
        if (empty($user['email'])) {
            return;
        }

        $recipientEmail = $user['email'];
        $userName = !empty($user['full_name']) ? $user['full_name'] : 'User';
        $subject = "UWU MedSync - Account Deactivation Notice";

        $mainText = "<p>This is an official notice to inform you that your UWU MedSync account associated with <strong>" . htmlspecialchars($recipientEmail) . "</strong> has been deactivated by an administrator.</p>";
        $box = EmailHelper::createNoticeBox(
            "While your account is deactivated, you will not be able to log in to access your appointments, medical records, or other MedSync services.",
            "Notice:"
        );
        $secText = "<p>If you believe this was done in error or require further assistance, please contact the UWU Medical Center administration.</p>";

        $body = EmailHelper::wrapCard("Account Deactivated", $userName, $mainText, $box, $secText, "#dc3545");

        try {
            EmailHelper::sendEmail($recipientEmail, $subject, $body);
            $this->userRepo->createEmailLog($user['user_id'], $recipientEmail, $subject, $body);
            $this->notificationRepo->create(
                $user['user_id'],
                "Your account has been deactivated by an administrator.",
                "Account"
            );
        } catch (\Throwable $e) {
            error_log("Failed to send deactivation email to {$recipientEmail}: " . $e->getMessage());
        }
    }

    public function createUser($data) {
        if (empty($data->full_name) || empty($data->email) || empty($data->password) || empty($data->role_id)) {
            throw new ValidationException("All fields are required.");
        }

        // Validate role_id is an allowed value (no admin creation via this endpoint)
        $allowedRoles = [2, 3, 4]; // Doctor, Receptionist, Patient
        if (!in_array((int)$data->role_id, $allowedRoles, true)) {
            throw new ValidationException("Invalid role selected.");
        }

        return $this->authService->createUser($data);
    }

    public function getAppointmentWindows() {
        return $this->appointmentRepo->getAllWindows();
    }

    public function updateWindowSlots($windowId, $maxSlots) {
        $this->appointmentRepo->updateWindowSlots($windowId, $maxSlots);
    }

    public function getPatients($params) {
        return $this->patientRepo->searchPatients($params);
    }

    public function getPatientDetails($patientId) {
        $patient = $this->patientRepo->getFullDetails($patientId);
        if (!$patient) {
            throw new NotFoundException("Patient not found.");
        }
        return $patient;
    }
}
?>
