<?php
session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

// Conexión PDO
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$raw    = file_get_contents('php://input');
$input  = json_decode($raw, true) ?? [];

function isAuth(): bool {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}
function requireAuth(): void {
    if (!isAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }
}
function rowToFront(array $row): array {
    return [
        'id'        => (string)$row['id'],
        'nombre'    => $row['nombre'],
        'inicio'    => $row['inicio'],
        'fin'       => $row['fin'] ?? '',
        'dias_prev' => (int)$row['dias_prev'],
        'done'      => (bool)$row['done'],
        'done_logs' => json_decode($row['done_logs'] ?? '[]', true) ?: [],
    ];
}

switch ($action) {

    // ── Verificar sesión ──────────────────────────────
    case 'check_auth':
        echo json_encode(['authenticated' => isAuth()]);
        break;

    // ── Login ─────────────────────────────────────────
    case 'login':
        $email = trim($input['email'] ?? '');
        $pass  = $input['password'] ?? '';
        if ($email === ADMIN_EMAIL && password_verify($pass, ADMIN_PASSWORD_HASH)) {
            $_SESSION['is_admin'] = true;
            echo json_encode(['ok' => true]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales incorrectas']);
        }
        break;

    // ── Logout ────────────────────────────────────────
    case 'logout':
        session_destroy();
        echo json_encode(['ok' => true]);
        break;

    // ── Listar eventos (público) ──────────────────────
    case 'eventos':
        $rows = $pdo->query('SELECT * FROM eventos ORDER BY inicio ASC')->fetchAll();
        echo json_encode(array_map('rowToFront', $rows));
        break;

    // ── Agregar evento ────────────────────────────────
    case 'add':
        requireAuth();
        $nombre   = trim($input['nombre'] ?? '');
        $inicio   = $input['inicio'] ?? '';
        $fin      = !empty($input['fin']) ? $input['fin'] : null;
        $diasPrev = (int)($input['dias_prev'] ?? 0);
        if (!$nombre || !$inicio) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            break;
        }
        $stmt = $pdo->prepare(
            'INSERT INTO eventos (nombre, inicio, fin, dias_prev, done, done_logs)
             VALUES (?, ?, ?, ?, 0, ?)'
        );
        $stmt->execute([$nombre, $inicio, $fin, $diasPrev, '[]']);
        echo json_encode(['id' => (string)$pdo->lastInsertId()]);
        break;

    // ── Actualizar evento ─────────────────────────────
    case 'update':
        requireAuth();
        $id = $input['id'] ?? '';
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requerido']); break; }

        $allowed = ['nombre', 'inicio', 'fin', 'dias_prev', 'done', 'done_logs'];
        $sets = []; $params = [];
        foreach ($allowed as $f) {
            if (!array_key_exists($f, $input)) continue;
            $sets[]   = "`$f` = ?";
            $val = $input[$f];
            if ($f === 'done_logs') {
                $val = is_array($val) ? json_encode($val) : (string)$val;
            }
            if ($f === 'done') $val = $val ? 1 : 0;
            if ($f === 'fin' && empty($val)) $val = null;
            $params[] = $val;
        }
        if (empty($sets)) { echo json_encode(['ok' => true]); break; }
        $params[] = $id;
        $pdo->prepare('UPDATE eventos SET ' . implode(', ', $sets) . ' WHERE id = ?')
            ->execute($params);
        echo json_encode(['ok' => true]);
        break;

    // ── Eliminar evento ───────────────────────────────
    case 'delete':
        requireAuth();
        $id = $input['id'] ?? '';
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requerido']); break; }
        $pdo->prepare('DELETE FROM eventos WHERE id = ?')->execute([$id]);
        echo json_encode(['ok' => true]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Acción no encontrada: ' . htmlspecialchars($action)]);
}
