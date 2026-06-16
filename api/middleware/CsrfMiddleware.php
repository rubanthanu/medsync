<?php

class CsrfMiddleware {

 
    public static function getToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

   
    public static function validate() {
       
        $headers = array_change_key_case(getallheaders(), CASE_LOWER);
        $token = $headers['x-csrf-token'] ?? '';

        if (
            empty($_SESSION['csrf_token']) ||
            empty($token) ||
            !hash_equals($_SESSION['csrf_token'], $token)
        ) {
            http_response_code(403);
            echo json_encode(["message" => "CSRF token validation failed."]);
            exit();
        }
    }

    public static function shouldValidate() {
        $method = strtoupper($_SERVER['REQUEST_METHOD']);
        return in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true);
    }
}
?>