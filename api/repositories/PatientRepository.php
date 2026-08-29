<?php
class PatientRepository {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function findByUserId($userId) {
        $query = "SELECT patient_id FROM patients WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $userId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById($patientId) {
        $query = "SELECT p.*, u.full_name, u.email, u.phone, u.gender, u.date_of_birth, u.address, u.profile_image 
                  FROM patients p 
                  JOIN users u ON p.user_id = u.user_id 
                  WHERE p.patient_id = :patient_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":patient_id", $patientId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($userId) {
        $query = "INSERT INTO patients (user_id) VALUES (:user_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $userId);
        $stmt->execute();
    }

    public function findByEmail($email) {
        $query = "SELECT u.user_id, u.email, p.patient_id 
                  FROM users u 
                  JOIN patients p ON u.user_id = p.user_id 
                  WHERE u.email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateProfile($userId, $bloodGroup, $allergies, $medicalConditions, $emergencyContactName, $emergencyContactPhone) {
        $query = "UPDATE patients SET 
                    blood_group = :bg, 
                    allergies = :allergies, 
                    medical_conditions = :mc, 
                    emergency_contact_name = :ecn, 
                    emergency_contact_phone = :ecp 
                  WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":bg", $bloodGroup);
        $stmt->bindParam(":allergies", $allergies);
        $stmt->bindParam(":mc", $medicalConditions);
        $stmt->bindParam(":ecn", $emergencyContactName);
        $stmt->bindParam(":ecp", $emergencyContactPhone);
        $stmt->bindParam(":user_id", $userId);
        $stmt->execute();
    }

    public function getPatientDetails($userId) {
        $query = "SELECT blood_group, allergies, medical_conditions, emergency_contact_name, emergency_contact_phone 
                  FROM patients WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $userId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function searchPatients($params) {
        $conditions = ["u.role_id = 4"];
        $bindings = [];

        // Search filter (name, email, phone)
        if (!empty($params['search'])) {
            $searchTerm = '%' . $params['search'] . '%';
            $conditions[] = "(u.full_name LIKE :search OR u.email LIKE :search_email OR u.phone LIKE :search_phone)";
            $bindings[':search'] = $searchTerm;
            $bindings[':search_email'] = $searchTerm;
            $bindings[':search_phone'] = $searchTerm;
        }

        // Gender filter
        if (!empty($params['gender'])) {
            $conditions[] = "u.gender = :gender";
            $bindings[':gender'] = $params['gender'];
        }

        // Status filter
        if (!empty($params['status'])) {
            $conditions[] = "u.account_status = :status";
            $bindings[':status'] = $params['status'];
        }

        // Blood group filter
        if (!empty($params['blood_group'])) {
            $conditions[] = "p.blood_group = :blood_group";
            $bindings[':blood_group'] = $params['blood_group'];
        }

        // Date range filter
        if (!empty($params['date_from'])) {
            $conditions[] = "DATE(u.created_at) >= :date_from";
            $bindings[':date_from'] = $params['date_from'];
        }
        if (!empty($params['date_to'])) {
            $conditions[] = "DATE(u.created_at) <= :date_to";
            $bindings[':date_to'] = $params['date_to'];
        }

        $whereClause = implode(' AND ', $conditions);

        // Sorting
        $allowedSort = ['full_name', 'created_at', 'email'];
        $sort = in_array($params['sort'] ?? '', $allowedSort) ? $params['sort'] : 'u.created_at';
        if (!str_contains($sort, '.')) $sort = 'u.' . $sort;
        $order = (strtolower($params['order'] ?? '') === 'asc') ? 'ASC' : 'DESC';

        // Pagination
        $page = max(1, (int)($params['page'] ?? 1));
        $limit = max(1, min(100, (int)($params['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;

        // Count query
        $countQuery = "SELECT COUNT(*) as total FROM users u 
                       LEFT JOIN patients p ON u.user_id = p.user_id 
                       WHERE $whereClause";
        $countStmt = $this->conn->prepare($countQuery);
        foreach ($bindings as $key => $val) {
            $countStmt->bindValue($key, $val);
        }
        $countStmt->execute();
        $total = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Data query
        $dataQuery = "SELECT u.user_id, u.full_name, u.email, u.phone, u.gender, u.date_of_birth, 
                             u.address, u.profile_image, u.account_status, u.created_at, u.updated_at,
                             p.patient_id, p.blood_group, p.allergies, p.medical_conditions, 
                             p.emergency_contact_name, p.emergency_contact_phone
                      FROM users u 
                      LEFT JOIN patients p ON u.user_id = p.user_id 
                      WHERE $whereClause 
                      ORDER BY $sort $order 
                      LIMIT :limit OFFSET :offset";
        $dataStmt = $this->conn->prepare($dataQuery);
        foreach ($bindings as $key => $val) {
            $dataStmt->bindValue($key, $val);
        }
        $dataStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $dataStmt->execute();
        $patients = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'patients' => $patients,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ];
    }

    public function getFullDetails($patientId) {
        $query = "SELECT u.user_id, u.full_name, u.email, u.phone, u.gender, u.date_of_birth, 
                         u.address, u.profile_image, u.account_status, u.created_at, u.updated_at,
                         p.patient_id, p.blood_group, p.allergies, p.medical_conditions, 
                         p.emergency_contact_name, p.emergency_contact_phone
                  FROM patients p 
                  JOIN users u ON p.user_id = u.user_id 
                  WHERE p.patient_id = :patient_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":patient_id", $patientId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
