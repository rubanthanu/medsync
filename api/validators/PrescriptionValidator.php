<?php
require_once __DIR__ . '/../exceptions/ValidationException.php';

class PrescriptionValidator {
    public static function validateCreate($data) {
        if (empty($data->appointment_id)) {
            throw new ValidationException("Appointment ID is required.");
        }
        if (empty($data->medicines)) {
            throw new ValidationException("At least one medicine is required.");
        }
        if (is_array($data->medicines)) {
            $hasValid = false;
            foreach ($data->medicines as $item) {
                if (is_object($item) && !empty(trim($item->name ?? ''))) {
                    $hasValid = true;
                    break;
                } else if (is_array($item) && !empty(trim($item['name'] ?? ''))) {
                    $hasValid = true;
                    break;
                } else if (is_string($item) && !empty(trim($item))) {
                    $hasValid = true;
                    break;
                }
            }
            if (!$hasValid) {
                throw new ValidationException("Please enter at least one valid medicine name.");
            }
        }
    }
}
?>