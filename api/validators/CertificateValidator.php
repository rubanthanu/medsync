<?php
require_once __DIR__ . '/../exceptions/ValidationException.php';

class CertificateValidator {
    public static function validateRequest($startDate, $endDate, $reason, $hasFile) {
        if (empty($startDate) || empty($endDate) || empty($reason) || !$hasFile) {
            throw new ValidationException("All fields and proof file are required.");
        }

        if (strtotime($startDate) > strtotime($endDate)) {
            throw new ValidationException("Start date cannot be greater than end date.");
        }

        $minDate = date('Y-m-d', strtotime('-14 days'));
        $today = date('Y-m-d');

        if ($startDate < $minDate) {
            throw new ValidationException("Start date cannot be more than 2 weeks before today.");
        }

        if ($startDate > $today) {
            throw new ValidationException("Start date cannot be in the future.");
        }
    }

    public static function validateReview($data) {
        if (empty($data->certificate_id) || empty($data->status)) {
            throw new ValidationException("Certificate ID and status are required.");
        }
    }
}
?>
