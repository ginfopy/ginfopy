"""Esquema SQLite y conexión para el control de biblioteca."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "biblioteca.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS libros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                isbn TEXT NOT NULL UNIQUE,
                titulo TEXT NOT NULL,
                editorial TEXT DEFAULT '',
                observaciones TEXT DEFAULT '',
                cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0)
            );

            CREATE TABLE IF NOT EXISTS alumnos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellidos TEXT DEFAULT '',
                email TEXT DEFAULT '',
                telefono TEXT DEFAULT '',
                observaciones TEXT DEFAULT ''
            );

            CREATE TABLE IF NOT EXISTS prestamos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                libro_id INTEGER NOT NULL REFERENCES libros(id) ON DELETE RESTRICT,
                alumno_id INTEGER NOT NULL REFERENCES alumnos(id) ON DELETE RESTRICT,
                fecha_prestamo TEXT NOT NULL,
                fecha_devolucion_esperada TEXT,
                fecha_devolucion_real TEXT,
                observaciones TEXT DEFAULT ''
            );

            CREATE INDEX IF NOT EXISTS idx_prestamos_libro_activo
            ON prestamos(libro_id) WHERE fecha_devolucion_real IS NULL;
            """
        )
