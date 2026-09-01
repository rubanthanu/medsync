<?php
require_once __DIR__ . '/../repositories/PrescriptionRepository.php';
require_once __DIR__ . '/../repositories/DoctorRepository.php';
require_once __DIR__ . '/../repositories/AppointmentRepository.php';
require_once __DIR__ . '/../repositories/PatientRepository.php';
require_once __DIR__ . '/../services/NotificationService.php';
require_once __DIR__ . '/../helpers/PDFHelper.php';
require_once __DIR__ . '/../exceptions/NotFoundException.php';
require_once __DIR__ . '/../exceptions/PermissionException.php';
require_once __DIR__ . '/../exceptions/ValidationException.php';

class PrescriptionService {
    private $conn;
    private $prescriptionRepo;
    private $doctorRepo;
    private $appointmentRepo;
    private $patientRepo;
    private $notificationService;

    public function __construct($conn) {
        $this->conn = $conn;
        $this->prescriptionRepo = new PrescriptionRepository($conn);
        $this->doctorRepo = new DoctorRepository($conn);
        $this->appointmentRepo = new AppointmentRepository($conn);
        $this->patientRepo = new PatientRepository($conn);
        $this->notificationService = new NotificationService($conn);
    }

    public function createPrescription($userId, $data) {
        // Get Doctor ID
        $doctor = $this->doctorRepo->findByUserId($userId);

        // Get Patient from appointment
        $patient = $this->prescriptionRepo->getPatientFromAppointment($data->appointment_id);
        if (!$patient) {
            throw new NotFoundException("Appointment not found.");
        }

        $this->conn->beginTransaction();
        try {
            // Fetch reviewer doctor's signature details
            $doc_details = $this->doctorRepo->getDetailsWithSignature($doctor['doctor_id']);

            $sig_html = "";
            if (extension_loaded('gd') && $doc_details && !empty($doc_details['digital_signature'])) {
                $sig_path = __DIR__ . '/../' . $doc_details['digital_signature'];
                if (file_exists($sig_path)) {
                    $sig_data = base64_encode(file_get_contents($sig_path));
                    $sig_html = "<img src='data:image/png;base64,{$sig_data}' style='max-height:80px; max-width:200px; display:block; margin: 10px 0 0 auto;' />";
                }
            }
            if (empty($sig_html)) {
                $sig_html = "<div style='margin-top: 20px; text-align: right;'><div style='display:inline-block; padding: 10px 18px; border: 1px solid #0056b3; border-radius: 999px; background: #f4f8ff; color: #0056b3; font-weight: 700; letter-spacing: 0.04em;'>Dr. " . ($doc_details['doctor_name'] ?? 'Doctor') . "</div></div>";
            }

            // Process medicines (handles array of structured items or plain text)
            $medicineRowsHtml = "";
            $medicineSummaryLines = [];
            $dosageSummaryLines = [];
            $instructionSummaryLines = [];

            if (is_array($data->medicines)) {
                $counter = 1;
                foreach ($data->medicines as $item) {
                    if (is_object($item)) {
                        $mName = trim($item->name ?? '');
                        $mDosage = trim($item->dosage ?? '');
                        $mTiming = trim($item->timing ?? '');
                        $mDuration = trim($item->duration ?? '');
                        $mInst = trim($item->instruction ?? '');
                    } else if (is_array($item)) {
                        $mName = trim($item['name'] ?? '');
                        $mDosage = trim($item['dosage'] ?? '');
                        $mTiming = trim($item['timing'] ?? '');
                        $mDuration = trim($item['duration'] ?? '');
                        $mInst = trim($item['instruction'] ?? '');
                    } else {
                        $mName = trim((string)$item);
                        $mDosage = trim($data->dosage ?? '');
                        $mTiming = '';
                        $mDuration = '';
                        $mInst = trim($data->instructions ?? '');
                    }

                    if (empty($mName)) continue;

                    // Text summary line
                    $metaParts = [];
                    if (!empty($mDosage)) $metaParts[] = $mDosage;
                    if (!empty($mTiming)) $metaParts[] = $mTiming;
                    if (!empty($mDuration)) $metaParts[] = $mDuration;
                    $metaStr = !empty($metaParts) ? " (" . implode(", ", $metaParts) . ")" : "";
                    $instStr = !empty($mInst) ? " — " . $mInst : "";
                    $medicineSummaryLines[] = "{$counter}. {$mName}{$metaStr}{$instStr}";

                    if (!empty($mDosage)) $dosageSummaryLines[] = "{$mName}: {$mDosage}";
                    if (!empty($mInst)) $instructionSummaryLines[] = "{$mName}: {$mInst}";

                    // PDF Table Row
                    $eName = htmlspecialchars($mName);
                    $eDosage = htmlspecialchars($mDosage ?: '-');
                    $eTiming = htmlspecialchars($mTiming ?: '-');
                    $eDuration = htmlspecialchars($mDuration ?: '-');
                    $eInst = htmlspecialchars($mInst ?: '-');
                    $bgStyle = ($counter % 2 === 0) ? "background-color: #f8fafc;" : "background-color: #ffffff;";

                    $medicineRowsHtml .= "
                        <tr style='border-bottom: 1px solid #e2e8f0; {$bgStyle}'>
                            <td style='padding: 8px 6px; text-align: center; font-weight: bold; color: #64748b;'>{$counter}</td>
                            <td style='padding: 8px 10px; font-weight: bold; color: #1e293b;'>{$eName}</td>
                            <td style='padding: 8px 6px; text-align: center; color: #0056b3; font-weight: bold;'>{$eDosage}</td>
                            <td style='padding: 8px 10px; color: #334155;'>{$eTiming}</td>
                            <td style='padding: 8px 10px; color: #334155;'>{$eDuration}</td>
                            <td style='padding: 8px 10px; color: #64748b; font-size: 12px;'>{$eInst}</td>
                        </tr>
                    ";
                    $counter++;
                }
            } else {
                $rawLines = explode("\n", (string)$data->medicines);
                $counter = 1;
                foreach ($rawLines as $line) {
                    $mName = trim($line);
                    if (empty($mName)) continue;
                    $mDosage = trim($data->dosage ?? '');
                    $mInst = trim($data->instructions ?? '');

                    $medicineSummaryLines[] = "{$counter}. {$mName}" . (!empty($mDosage) ? " ({$mDosage})" : "");
                    $eName = htmlspecialchars($mName);
                    $eDosage = htmlspecialchars($mDosage ?: '-');
                    $eInst = htmlspecialchars($mInst ?: '-');
                    $bgStyle = ($counter % 2 === 0) ? "background-color: #f8fafc;" : "background-color: #ffffff;";

                    $medicineRowsHtml .= "
                        <tr style='border-bottom: 1px solid #e2e8f0; {$bgStyle}'>
                            <td style='padding: 8px 6px; text-align: center; font-weight: bold; color: #64748b;'>{$counter}</td>
                            <td style='padding: 8px 10px; font-weight: bold; color: #1e293b;'>{$eName}</td>
                            <td style='padding: 8px 6px; text-align: center; color: #0056b3; font-weight: bold;'>{$eDosage}</td>
                            <td style='padding: 8px 10px; color: #334155;'>-</td>
                            <td style='padding: 8px 10px; color: #334155;'>-</td>
                            <td style='padding: 8px 10px; color: #64748b; font-size: 12px;'>{$eInst}</td>
                        </tr>
                    ";
                    $counter++;
                }
            }

            $medicinesDbText = implode("\n", $medicineSummaryLines);
            $dosageDbText = !empty($dosageSummaryLines) ? implode(", ", $dosageSummaryLines) : ($data->dosage ?? 'As prescribed');
            $generalInstructions = trim($data->general_instructions ?? $data->instructions ?? '');
            $instructionsDbText = !empty($generalInstructions) ? $generalInstructions : (!empty($instructionSummaryLines) ? implode("; ", $instructionSummaryLines) : 'Take as instructed');

            // Advice / Notes section in PDF
            $adviceHtml = "";
            if (!empty($generalInstructions) || !empty($data->notes)) {
                $adviceContent = "";
                if (!empty($generalInstructions)) {
                    $adviceContent .= "<p style='margin: 3px 0; color: #334155;'><strong>Advice:</strong> " . nl2br(htmlspecialchars($generalInstructions)) . "</p>";
                }
                if (!empty($data->notes)) {
                    $adviceContent .= "<p style='margin: 3px 0; color: #475569;'><strong>Notes:</strong> " . nl2br(htmlspecialchars($data->notes)) . "</p>";
                }
                $adviceHtml = "
                    <div style='margin-top: 18px; background-color: #f8fafc; border-left: 4px solid #0056b3; padding: 10px 14px; border-radius: 4px;'>
                        {$adviceContent}
                    </div>
                ";
            }

            // Generate PDF with modern table design
            $html = "
                <div style='font-family: sans-serif; padding: 25px; border: 1px solid #cbd5e1; background: #ffffff;'>
                    <div style='text-align:center;'>
                        <h2 style='color:#0056b3; margin-bottom:4px; font-size: 22px;'>UWU MedSync</h2>
                        <h4 style='color:#64748b; margin-top:0; font-weight: normal; font-size: 14px;'>University Medical Center — e-Prescription</h4>
                        <hr style='border: 0; border-top: 2px solid #0056b3; margin: 10px 0 15px 0;'>
                    </div>
                    
                    <table style='width: 100%; font-size: 13px; margin-bottom: 15px; color: #334155;'>
                        <tr>
                            <td style='width: 50%;'><strong>Patient Name:</strong> {$patient['patient_name']}</td>
                            <td style='width: 50%; text-align: right;'><strong>Date:</strong> " . date('Y-m-d') . "</td>
                        </tr>
                        <tr>
                            <td style='width: 50%; padding-top: 4px;'><strong>Diagnosis:</strong> " . htmlspecialchars($data->diagnosis ?? 'General Checkup') . "</td>
                            <td style='width: 50%; text-align: right; padding-top: 4px;'><strong>Appointment ID:</strong> #{$data->appointment_id}</td>
                        </tr>
                    </table>

                    <h4 style='color:#0056b3; margin: 15px 0 8px 0; font-size: 15px;'>Prescribed Medications:</h4>
                    <table style='width: 100%; border-collapse: collapse; font-size: 12px;'>
                        <thead>
                            <tr style='background-color: #0056b3; color: #ffffff;'>
                                <th style='padding: 8px 6px; text-align: center; width: 28px; border: 1px solid #0056b3;'>#</th>
                                <th style='padding: 8px 10px; text-align: left; border: 1px solid #0056b3;'>Medicine Name</th>
                                <th style='padding: 8px 6px; text-align: center; width: 85px; border: 1px solid #0056b3;'>Dosage</th>
                                <th style='padding: 8px 10px; text-align: left; width: 105px; border: 1px solid #0056b3;'>Timing</th>
                                <th style='padding: 8px 10px; text-align: left; width: 85px; border: 1px solid #0056b3;'>Duration</th>
                                <th style='padding: 8px 10px; text-align: left; border: 1px solid #0056b3;'>Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$medicineRowsHtml}
                        </tbody>
                    </table>

                    {$adviceHtml}

                    <br><br>
                    <div style='float: right; text-align: right;'>
                        {$sig_html}
                        <p style='border-top: 1px solid #cbd5e1; width: 220px; margin: 6px 0 0 auto; font-size: 13px; font-weight: bold; color:#334155;'>Dr. " . ($doc_details['doctor_name'] ?? 'Doctor') . "</p>
                    </div>
                    <div style='clear: both;'></div>
                </div>
            ";

            $target_dir = __DIR__ . "/../uploads/generated_pdfs/";
            $file_name = "presc_" . uniqid() . ".pdf";
            PDFHelper::generatePDF($html, $file_name, $target_dir);

            // Save to prescriptions table
            $this->prescriptionRepo->create(
                $data->appointment_id,
                $patient['patient_id'],
                $doctor['doctor_id'],
                $medicinesDbText,
                $dosageDbText,
                $instructionsDbText,
                $file_name
            );

            // Save to checkup_history table
            $this->prescriptionRepo->createCheckupHistory(
                $data->appointment_id,
                $patient['patient_id'],
                $doctor['doctor_id'],
                $data->diagnosis,
                $data->notes
            );

            // Update appointment status to Completed
            $this->appointmentRepo->updateStatus($data->appointment_id, 'Completed');

            // Notify
            $msg = "A new prescription has been generated for you.";
            $this->notificationService->create($patient['patient_user_id'], $msg, 'Prescription');

            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function getHistory($userId, $roleId, $patientId = null) {
        if ($roleId == 4) { // Patient
            $patient = $this->patientRepo->findByUserId($userId);
            if (!$patient) {
                throw new NotFoundException("Patient record not found.");
            }
            $patientId = $patient['patient_id'];
        } else if ($roleId == 1 || $roleId == 2) { // Admin or Doctor
            if (empty($patientId)) {
                throw new ValidationException("Patient ID is required.");
            }
            $patient = $this->patientRepo->findById($patientId);
            if (!$patient) {
                throw new NotFoundException("Patient not found.");
            }
        } else {
            throw new PermissionException("Unauthorized access.");
        }

        return $this->prescriptionRepo->getHistory($patientId);
    }

    public function getPatientPrescriptions($userId) {
        return $this->prescriptionRepo->getPatientPrescriptions($userId);
    }
}
?>
