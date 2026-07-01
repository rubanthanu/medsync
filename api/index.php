<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/middleware/CsrfMiddleware.php';
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
header("Content-Type: application/json; charset=UTF-8");

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

date_default_timezone_set('Asia/Colombo');

ini_set('session.cookie_httponly', 1);       // JS cannot read session cookie
ini_set('session.cookie_samesite', 'Lax');   // Blocks cross-site POST with cookie
ini_set('session.use_strict_mode', 1);       // Reject uninitialized session IDs
ini_set('session.use_only_cookies', 1);      // Never accept session ID from URL
ini_set('session.gc_maxlifetime', 1800);     // 30-minute idle timeout
ini_set('session.cookie_lifetime', 0);       // Cookie expires when browser closes

session_start();

if (isset($_SESSION['last_activity'])) {
    $idle = time() - $_SESSION['last_activity'];
    if ($idle > 1800) { // 30 minutes
        session_unset();
        session_destroy();
        session_start(); // Start a fresh session for the error response
        http_response_code(401);
        echo json_encode(["message" => "Session expired. Please log in again."]);
        exit();
    }
}
$_SESSION['last_activity'] = time();


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request = isset($_GET['request']) ? $_GET['request'] : '';
$uri = explode('/', rtrim($request, '/'));

$controllerName = isset($uri[0]) && $uri[0] != '' ? ucfirst($uri[0]) . 'Controller' : null;
$methodName = isset($uri[1]) ? $uri[1] : null;

$csrfExemptRoutes = [
    'auth/login',
    'auth/register',
    'auth/verify_otp',
    'auth/resend_otp',
    'auth/forgot_password',
    'auth/verify_forgot_password_otp',
    'auth/reset_password',
    'auth/csrf_token',
];

$currentRoute = strtolower(($uri[0] ?? '') . '/' . ($uri[1] ?? ''));

if (CsrfMiddleware::shouldValidate() && !in_array($currentRoute, $csrfExemptRoutes, true)) {
    CsrfMiddleware::validate();
}

if ($controllerName && file_exists(__DIR__ . '/controllers/' . $controllerName . '.php')) {
    require_once __DIR__ . '/controllers/' . $controllerName . '.php';
    $controller = new $controllerName();
    
    if ($methodName && method_exists($controller, $methodName)) {
        // Pass the remaining URI parts as arguments
        $args = array_slice($uri, 2);
        call_user_func_array([$controller, $methodName], $args);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "Controller not found."]);
}
?>
