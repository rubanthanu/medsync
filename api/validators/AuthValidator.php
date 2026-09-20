<?php
require_once __DIR__ . '/../exceptions/ValidationException.php';

class AuthValidator {
    public static function validatePasswordComplexity($password, $fieldName = 'Password') {
        if (empty($password)) {
            throw new ValidationException("{$fieldName} is required.");
        }
        if (strlen($password) < 8) {
            throw new ValidationException("{$fieldName} must be at least 8 characters long.");
        }
        if (!preg_match('/[A-Z]/', $password)) {
            throw new ValidationException("{$fieldName} must contain at least one uppercase letter (A-Z).");
        }
        if (!preg_match('/[a-z]/', $password)) {
            throw new ValidationException("{$fieldName} must contain at least one lowercase letter (a-z).");
        }
        if (!preg_match('/[0-9]/', $password)) {
            throw new ValidationException("{$fieldName} must contain at least one number (0-9).");
        }
        if (!preg_match('/[@$!%*?&]/', $password)) {
            throw new ValidationException("{$fieldName} must contain at least one special character (@$!%*?&).");
        }
    }

    public static function validatePasswordMatch($password, $confirmPassword, $fieldName = 'Confirm Password') {
        if ($password !== $confirmPassword) {
            throw new ValidationException("Passwords do not match.");
        }
    }

    public static function validateRegister($data) {
       if (empty($data->full_name) || trim($data->full_name) === '' || empty($data->email) || empty($data->password)){
            throw new ValidationException("All fields are required.");
        }
        if (!preg_match('/^[a-zA-Z\s\.\-]+$/', $data->full_name)) {
            throw new ValidationException("Full Name must only contain letters, spaces, dots, or hyphens.");
        }

        if (!str_ends_with($data->email, '@std.uwu.ac.lk') && !str_ends_with($data->email, '@uwu.ac.lk')) {
            throw new ValidationException("Please use a valid university email (@std.uwu.ac.lk or @uwu.ac.lk).");
        }

        self::validatePasswordComplexity($data->password);

        if (isset($data->confirm_password)) {
            self::validatePasswordMatch($data->password, $data->confirm_password);
        }
    }

    public static function validateLogin($data) {
        if (empty($data->email) || empty($data->password)) {
            throw new ValidationException("Email and password are required.");
        }
    }

    public static function validateOtp($data) {
        if (empty($data->email) || empty($data->otp)) {
            throw new ValidationException("Email and OTP are required.");
        }
    }

    public static function validateResendOtp($data) {
        if (empty($data->email) || empty($data->type)) {
            throw new ValidationException("Email and type are required.");
        }
    }

    public static function validateForgotPassword($data) {
        if (empty($data->email)) {
            throw new ValidationException("Email is required.");
        }
    }

    public static function validateResetPassword($data) {
        if (empty($data->email) || empty($data->otp) || empty($data->new_password)) {
            throw new ValidationException("Email, OTP and new password are required.");
        }

        self::validatePasswordComplexity($data->new_password, 'New password');

        if (isset($data->confirm_password)) {
            self::validatePasswordMatch($data->new_password, $data->confirm_password);
        }
    }

    public static function validateChangePassword($data) {
        if (empty($data->current_password) || empty($data->new_password)) {
            throw new ValidationException("Current and new password are required.");
        }

        self::validatePasswordComplexity($data->new_password, 'New password');

        if (isset($data->confirm_password)) {
            self::validatePasswordMatch($data->new_password, $data->confirm_password);
        }
    }
}
?>
