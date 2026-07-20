<?php
// ════════════════════════════════════════════════
//  UTILIDAD: generador de hash de contraseña
//  USO: subilo al servidor, abrilo en el navegador,
//       copiá el hash y pegalo en config.php.
//       BORRALO del servidor después de usarlo.
// ════════════════════════════════════════════════
$hash = '';
$msg  = '';
if (!empty($_POST['password'])) {
    if (strlen($_POST['password']) < 8) {
        $msg = '❌ La contraseña debe tener al menos 8 caracteres.';
    } else {
        $hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
        $msg  = '✅ Hash generado. Copialo y pegalo en config.php como valor de ADMIN_PASSWORD_HASH.';
    }
}
?><!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Generador de Hash</title>
<style>body{font-family:sans-serif;max-width:520px;margin:40px auto;padding:0 16px;background:#0f1117;color:#e8eaf6;}
h2{color:#4f7cff;}label{display:block;margin-bottom:6px;font-size:.85rem;color:#8b90b3;}
input[type=password]{width:100%;padding:9px 12px;border-radius:6px;border:1px solid #2e3350;background:#1a1d27;color:#e8eaf6;font-size:.9rem;margin-bottom:12px;}
button{background:linear-gradient(135deg,#4f7cff,#7c5cfc);color:#fff;border:none;border-radius:6px;padding:9px 20px;cursor:pointer;font-weight:600;}
.hash{background:#1a1d27;border:1px solid #2e3350;border-radius:6px;padding:12px;font-family:monospace;font-size:.78rem;word-break:break-all;color:#69f0ae;margin-top:12px;}
.msg{margin-top:10px;font-size:.82rem;color:#ffd740;}
.warn{margin-top:20px;padding:10px 14px;background:rgba(255,82,82,.12);border:1px solid rgba(255,82,82,.3);border-radius:6px;font-size:.78rem;color:#ff5252;}
</style></head>
<body>
<h2>🔑 Generador de Hash de Contraseña</h2>
<form method="post">
  <label>Ingresá tu contraseña de administrador:</label>
  <input type="password" name="password" placeholder="Mínimo 8 caracteres" required />
  <button type="submit">Generar hash</button>
</form>
<?php if ($msg): ?>
  <p class="msg"><?= htmlspecialchars($msg) ?></p>
  <?php if ($hash): ?>
    <div class="hash"><?= htmlspecialchars($hash) ?></div>
  <?php endif; ?>
<?php endif; ?>
<div class="warn">⚠ <strong>Importante:</strong> eliminá este archivo del servidor después de usarlo. No lo dejes accesible públicamente.</div>
</body></html>
