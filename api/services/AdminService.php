<?php
require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../repositories/AppointmentRepository.php';
require_once __DIR__ . '/../repositories/PrescriptionRepository.php';
require_once __DIR__ . '/../repositories/CertificateRepository.php';
require_once __DIR__ . '/../repositories/PatientRepository.php';
require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../exceptions/ValidationException.php';

class AdminService {
    private $conn;
    private $userRepo;
    private $appointmentRepo;
    private $prescriptionRepo;
    private $certificateRepo;
    private $patientRepo;
    private $authService;

    public function __construct($conn) {
        $this->conn = $conn;
        $this->userRepo = new UserRepository($conn);
        $this->appointmentRepo = new AppointmentRepository($conn);
        $this->prescriptionRepo = new PrescriptionRepository($conn);
        $this->certificateRepo = new CertificateRepository($conn);
        $this->patientRepo = new PatientRepository($conn);
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

        $this->userRepo->updateStatus($userId, $status);
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
