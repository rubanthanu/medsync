<?php
require_once __DIR__ . '/DatabaseInterface.php';

class Database implements DatabaseInterface {
    private $host = "localhost";
    private $db_name = "medsync_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function __construct() {
        $this->host = getenv('DB_HOST') ?: (isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : $this->host);
        $this->db_name = getenv('DB_NAME') ?: (isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : $this->db_name);
        $this->username = getenv('DB_USER') ?: (isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : $this->username);
        $this->password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : $this->password);
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
