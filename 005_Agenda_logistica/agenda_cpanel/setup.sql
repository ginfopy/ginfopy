-- ════════════════════════════════════════════════
--  Ejecutar este script en:
--  cPanel → phpMyAdmin → seleccionar la BD → pestaña SQL
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `eventos` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `nombre`     VARCHAR(500) NOT NULL,
  `inicio`     DATE         NOT NULL,
  `fin`        DATE         DEFAULT NULL,
  `dias_prev`  INT(3)       NOT NULL DEFAULT 0,
  `done`       TINYINT(1)   NOT NULL DEFAULT 0,
  `done_logs`  TEXT         DEFAULT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
