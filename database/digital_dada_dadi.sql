-- Digital Dada Dadi Help Management Desk Database Schema
-- Compatible with MySQL / MariaDB (XAMPP environment)

CREATE DATABASE IF NOT EXISTS `digital_dada_dadi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `digital_dada_dadi`;

-- 1. Users Table (Senior Citizens)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `age` INT NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `mobile_number` VARCHAR(15) NOT NULL,
  `address` TEXT NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Admins Table (Management Staff)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Help Requests Table
CREATE TABLE IF NOT EXISTS `help_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `request_type` VARCHAR(50) NOT NULL, -- Medical, Transport, Grocery, Technical Help, Emergency
  `description` TEXT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Pending', -- Pending, In Progress, Completed
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_help_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Contact Messages Table (Feedback / Inquiries)
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Admin
-- Username: admin
-- Password: adminpassword123
-- Bcrypt Hash for "adminpassword123": $2y$10$tZ261r7G5.hVl15Q3Wv.7udUqTzW.CzeUo5n30QWl9g.mX95u3Y0S
INSERT INTO `admins` (`username`, `password`, `full_name`)
SELECT 'admin', '$2y$10$tZ261r7G5.hVl15Q3Wv.7udUqTzW.CzeUo5n30QWl9g.mX95u3Y0S', 'Desk Administrator'
WHERE NOT EXISTS (SELECT 1 FROM `admins` WHERE `username` = 'admin');
