<?php
require_once __DIR__ . '/../exceptions/ValidationException.php';

class UserValidator {
    public static function validateCompleteProfile($data) {
        if (empty($data->university_id) || empty($data->phone) || empty($data->gender) || 
           empty($data->date_of_birth) || empty($data->address) || empty($data->blood_group) || 
           empty($data->emergency_contact_name) || empty($data->emergency_contact_phone)) {
            throw new ValidationException("Please fill in all required fields.");
        }

        self::validatePhoneFormat($data->phone, "Phone number");
        self::validatePhoneFormat($data->emergency_contact_phone, "Emergency contact phone");
        self::validateAddressFormat($data->address);
    }

    public static function validateUpdateProfile($data) {
    
          if (isset($data->full_name) && !empty($data->full_name)) {
            self::validateFullNameFormat($data->full_name, "Full Name");
        }
    if (isset($data->phone) && !empty($data->phone)) {
            self::validatePhoneFormat($data->phone, "Phone number");
        }
        if (isset($data->emergency_contact_phone) && !empty($data->emergency_contact_phone)) {
            self::validatePhoneFormat($data->emergency_contact_phone, "Emergency contact phone");
        }
         if (isset($data->address) && !empty($data->address)) {
            self::validateAddressFormat($data->address);
        }
    }

    private static function validatePhoneFormat($phone, $fieldName) {
        // Remove all non-digit characters to count digits
        $digitsOnly = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($digitsOnly) !== 10) {
            throw new ValidationException("{$fieldName} must be exactly 10 digits.");
        }
    }
       private static function validateFullNameFormat($name, $fieldName) {
        if (trim($name) === '') {
            throw new ValidationException("{$fieldName} cannot be empty or only spaces.");
        }
        if (!preg_match('/^[a-zA-Z\s\.\-]+$/', $name)) {
            throw new ValidationException("{$fieldName} must only contain letters, spaces, dots, or hyphens.");
        }
    }

    private static function validateAddressFormat($address) {
        $trimmed = trim($address);
        if ($trimmed === '') {
            throw new ValidationException("Address cannot be empty or only spaces.");
        }
        if (preg_match('/^[0-9]+$/', preg_replace('/\s+/', '', $trimmed))) {
            throw new ValidationException("Address cannot contain only numbers.");
        }
    }
}
?>
