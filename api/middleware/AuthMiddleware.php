<?php
class AuthMiddleware {
    public static function authenticate() {
        if (isset($_SESSION['user']) && !empty($_SESSION['user'])) {
           
            return (object) $_SESSION['user'];
        }
        
        http_response_code(401);
        echo json_encode(array("message" => "Access denied. Not authenticated."));
        exit();
    }
}
?>