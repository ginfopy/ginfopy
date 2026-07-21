<?php
// ════════════════════════════════════════════════
//  CONFIGURACIÓN — editá estos valores
//  antes de subir los archivos al servidor
// ════════════════════════════════════════════════

// Base de datos MySQL (datos del cPanel)
define('DB_HOST', 'localhost');           // casi siempre 'localhost' en cPanel
define('DB_NAME', 'tu_usuario_dbname');  // nombre de la BD (en cPanel: usuario_nombre)
define('DB_USER', 'tu_usuario_dbuser');  // usuario de la BD
define('DB_PASS', 'contraseña_db');      // contraseña de la BD

// Credenciales del administrador de la agenda
define('ADMIN_EMAIL', 'tu@email.com');

// Hash de contraseña generado con crear_hash.php
// NUNCA pongas la contraseña en texto plano aquí
define('ADMIN_PASSWORD_HASH', 'REEMPLAZAR_CON_HASH_DE_CREAR_HASH_PHP');
