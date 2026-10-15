<?php
require_once __DIR__ . '/DatabaseInterface.php';
require_once __DIR__ . '/../helpers/EnvHelper.php';

class Database implements DatabaseInterface {
    private $host = "localhost";
    private $db_name = "medsync_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function __construct() {
        $this->host = EnvHelper::get('DB_HOST', $this->host);
        $this->db_name = EnvHelper::get('DB_NAME', $this->db_name);
        $this->username = EnvHelper::get('DB_USER', $this->username);
        $this->password = EnvHelper::get('DB_PASS', $this->password);
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
