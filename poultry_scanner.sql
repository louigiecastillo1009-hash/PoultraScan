-- ============================================================
-- Poultry Scanner — Database Schema
-- Generated from backend/models/ (SQLAlchemy models)
-- Target: MySQL 8.x (utf8mb4 / utf8mb4_unicode_ci)
--
-- Usage:
--   mysql -u <user> -p < poultry_scanner.sql
-- or paste into your MySQL client / Aiven console.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `chicken_ai`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `chicken_ai`;

-- ------------------------------------------------------------
-- Cleanup: drop tables in reverse dependency order so a re-run
-- starts fresh and all tables are created with matching
-- engine/charset/types (prevents error #3780 < incompatible FK).
-- ⚠️ THIS DELETES ANY EXISTING DATA IN THIS DATABASE.
-- ------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `journal_entries`;
DROP TABLE IF EXISTS `ai_predictions`;
DROP TABLE IF EXISTS `chicken_images`;
DROP TABLE IF EXISTS `detected_chickens`;
DROP TABLE IF EXISTS `scan_summaries`;
DROP TABLE IF EXISTS `scan_sessions`;
DROP TABLE IF EXISTS `farms`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`                  INT           NOT NULL AUTO_INCREMENT,
  `fullname`            VARCHAR(100)  NOT NULL,
  `username`            VARCHAR(50)   NOT NULL,
  `email`               VARCHAR(100)  NOT NULL,
  `password`            VARCHAR(255)  NOT NULL,
  `role`                ENUM('ADMIN', 'USER')           NOT NULL DEFAULT 'USER',
  `avatar_url`          VARCHAR(255)  NULL,
  `reset_token`         VARCHAR(255)  NULL,
  `reset_token_expiry`  DATETIME      NULL,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. farms
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `farms` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `user_id`     INT           NOT NULL,
  `farm_name`   VARCHAR(100)  NOT NULL,
  `location`    VARCHAR(255)  NOT NULL,
  `capacity`    INT           NOT NULL,
  `image_url`   VARCHAR(255)  NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_farms_user_id` (`user_id`),
  CONSTRAINT `fk_farms_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. scan_sessions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `scan_sessions` (
  `id`           INT      NOT NULL AUTO_INCREMENT,
  `farm_id`      INT      NOT NULL,
  `scan_type`    ENUM('WEBCAM', 'UPLOAD')               NOT NULL,
  `status`       ENUM('PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PROCESSING',
  `started_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finished_at`  DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `fk_scan_sessions_farm_id` (`farm_id`),
  CONSTRAINT `fk_scan_sessions_farm_id`
    FOREIGN KEY (`farm_id`) REFERENCES `farms` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. scan_summaries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `scan_summaries` (
  `id`                      INT           NOT NULL AUTO_INCREMENT,
  `scan_session_id`         INT           NOT NULL,
  `total_detected`          INT           NULL,
  `healthy_count`           INT           NULL,
  `diseased_count`          INT           NULL,
  `market_ready_count`      INT           NULL,
  `average_weight`          DECIMAL(5,2)  NULL,
  `estimated_total_oil_ml`  DECIMAL(8,2)  NULL,
  `remarks`                 TEXT          NULL,
  `created_at`              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_scan_summaries_scan_session_id` (`scan_session_id`),
  CONSTRAINT `fk_scan_summaries_scan_session_id`
    FOREIGN KEY (`scan_session_id`) REFERENCES `scan_sessions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. detected_chickens
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `detected_chickens` (
  `id`                    INT           NOT NULL AUTO_INCREMENT,
  `scan_session_id`       INT           NOT NULL,
  `tracking_id`           INT           NULL,
  `confidence`            DECIMAL(5,2)  NULL,
  `bounding_box_x`        FLOAT         NULL,
  `bounding_box_y`        FLOAT         NULL,
  `bounding_box_width`    FLOAT         NULL,
  `bounding_box_height`   FLOAT         NULL,
  `created_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_detected_chickens_scan_session_id` (`scan_session_id`),
  CONSTRAINT `fk_detected_chickens_scan_session_id`
    FOREIGN KEY (`scan_session_id`) REFERENCES `scan_sessions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. chicken_images
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chicken_images` (
  `id`                     INT           NOT NULL AUTO_INCREMENT,
  `detected_chicken_id`    INT           NOT NULL,
  `image_type`             ENUM('WEBCAM', 'FRONT', 'LEFT', 'RIGHT') NOT NULL,
  `image_url`              VARCHAR(255)  NOT NULL,
  `created_at`             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_chicken_images_detected_chicken_id` (`detected_chicken_id`),
  CONSTRAINT `fk_chicken_images_detected_chicken_id`
    FOREIGN KEY (`detected_chicken_id`) REFERENCES `detected_chickens` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. ai_predictions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ai_predictions` (
  `id`                     INT           NOT NULL AUTO_INCREMENT,
  `detected_chicken_id`    INT           NOT NULL,
  `disease`                VARCHAR(100)  NOT NULL,
  `disease_confidence`     DECIMAL(5,2)  NULL,
  `estimated_weight`       DECIMAL(5,2)  NULL,
  `estimated_oil_ml`       DECIMAL(6,2)  NULL,
  `market_ready`           TINYINT(1)    NULL,
  `care_tips`              TEXT          NULL,
  `breed`                  VARCHAR(100)  NULL,
  `recommendation`         TEXT          NULL,
  `prevention_tips`        TEXT          NULL,
  `severity`               VARCHAR(20)   NULL,
  `model_name`             VARCHAR(100)  NULL,
  `model_version`          VARCHAR(50)   NULL,
  `processing_time_ms`     INT           NULL,
  `created_at`             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ai_predictions_detected_chicken_id` (`detected_chicken_id`),
  CONSTRAINT `fk_ai_predictions_detected_chicken_id`
    FOREIGN KEY (`detected_chicken_id`) REFERENCES `detected_chickens` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. journal_entries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `journal_entries` (
  `id`                INT           NOT NULL AUTO_INCREMENT,
  `user_id`           INT           NOT NULL,
  `farm_id`           INT           NULL,
  `scan_session_id`   INT           NULL,
  `title`             VARCHAR(150)  NOT NULL,
  `content`           TEXT          NOT NULL,
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_journal_entries_user_id` (`user_id`),
  KEY `fk_journal_entries_farm_id` (`farm_id`),
  KEY `fk_journal_entries_scan_session_id` (`scan_session_id`),
  CONSTRAINT `fk_journal_entries_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_journal_entries_farm_id`
    FOREIGN KEY (`farm_id`) REFERENCES `farms` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_journal_entries_scan_session_id`
    FOREIGN KEY (`scan_session_id`) REFERENCES `scan_sessions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. notifications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `user_id`     INT           NOT NULL,
  `title`       VARCHAR(150)  NOT NULL,
  `message`     TEXT          NOT NULL,
  `is_read`     TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notifications_user_id` (`user_id`),
  CONSTRAINT `fk_notifications_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. activity_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `user_id`     INT           NOT NULL,
  `action`      VARCHAR(150)  NOT NULL,
  `ip_address`  VARCHAR(45)   NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_activity_logs_user_id` (`user_id`),
  CONSTRAINT `fk_activity_logs_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
