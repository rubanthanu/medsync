-- ==============================================================================
-- MedSync Database Seed File
-- Run this after importing schema.sql to populate roles and sample accounts.
-- ==============================================================================

-- 1. Initial System Roles
INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Doctor'),
(3, 'Receptionist'),
(4, 'Patient')
ON DUPLICATE KEY UPDATE `role_name` = VALUES(`role_name`);

-- 2. Optional Sample / Demo User Accounts (Passwords default to: Password123!)
-- Password hash generated with password_hash('Password123!', PASSWORD_BCRYPT)
-- $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi is 'password'

-- Default Admin: admin@medsync.local / Password123!
INSERT INTO `users` (`user_id`, `role_id`, `email`, `password`, `full_name`, `phone`, `gender`, `is_verified`, `account_status`)
VALUES (1, 1, 'admin@medsync.local', '$2y$10$wE99KkZc4gLd3H7y8vH98.J297d02l3r8KqG44d.D1G375e2r93G.', 'System Administrator', '+94712345678', 'Other', 1, 'Active')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

INSERT INTO `admin_profiles` (`user_id`)
SELECT 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `admin_profiles` WHERE `user_id` = 1);
