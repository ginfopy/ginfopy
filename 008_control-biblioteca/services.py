"""Lógica de negocio: libros, alumnos y préstamos."""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta
from typing import Any

from database import get_connection


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return dict(row)


# --- Libros ---


def listar_libros() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT l.*,
                   COALESCE((
                       SELECT COUNT(*) FROM prestamos p
                       WHERE p.libro_id = l.id AND p.fecha_devolucion_real IS NULL
                   ), 0) AS en_prestamo,
                   (l.cantidad - COALESCE((
                       SELECT COUNT(*) FROM prestamos p
                       WHERE p.libro_id = l.id AND p.fecha_devolucion_real IS NULL
                   ), 0)) AS disponibles
            FROM libros l
            ORDER BY l.titulo
            """
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def crear_libro(
    isbn: str,
    titulo: str,
    editorial: str,
    observaciones: str,
    cantidad: int,
) -> int:
    with get_connection() as conn:
        cur = conn.execute(
            """
            INSERT INTO libros (isbn, titulo, editorial, observaciones, cantidad)
            VALUES (?, ?, ?, ?, ?)
            """,
            (isbn.strip(), titulo.strip(), editorial.strip(), observaciones.strip(), cantidad),
        )
        return int(cur.lastrowid)


def actualizar_libro(
    libro_id: int,
    isbn: str,
    titulo: str,
    editorial: str,
    observaciones: str,
    cantidad: int,
) -> None:
    with get_connection() as conn:
        en_prestamo = conn.execute(
            """
            SELECT COUNT(*) FROM prestamos
            WHERE libro_id = ? AND fecha_devolucion_real IS NULL
            """,
            (libro_id,),
        ).fetchone()[0]
        if cantidad < en_prestamo:
            raise ValueError(
                f"La cantidad no puede ser menor que los ejemplares en préstamo ({en_prestamo})."
            )
        conn.execute(
            """
            UPDATE libros
            SET isbn = ?, titulo = ?, editorial = ?, observaciones = ?, cantidad = ?
            WHERE id = ?
            """,
            (
                isbn.strip(),
                titulo.strip(),
                editorial.strip(),
                observaciones.strip(),
                cantidad,
                libro_id,
            ),
        )


def eliminar_libro(libro_id: int) -> None:
    with get_connection() as conn:
        activos = conn.execute(
            "SELECT COUNT(*) FROM prestamos WHERE libro_id = ? AND fecha_devolucion_real IS NULL",
            (libro_id,),
        ).fetchone()[0]
        if activos > 0:
            raise ValueError("No se puede eliminar: hay préstamos activos de este libro.")
        conn.execute("DELETE FROM prestamos WHERE libro_id = ?", (libro_id,))
        conn.execute("DELETE FROM libros WHERE id = ?", (libro_id,))


# --- Alumnos ---


def listar_alumnos() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT * FROM alumnos
            ORDER BY apellidos, nombre
            """
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def crear_alumno(
    nombre: str,
    apellidos: str,
    email: str,
    telefono: str,
    observaciones: str,
) -> int:
    with get_connection() as conn:
        cur = conn.execute(
            """
            INSERT INTO alumnos (nombre, apellidos, email, telefono, observaciones)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                nombre.strip(),
                apellidos.strip(),
                email.strip(),
                telefono.strip(),
                observaciones.strip(),
            ),
        )
        return int(cur.lastrowid)


def actualizar_alumno(
    alumno_id: int,
    nombre: str,
    apellidos: str,
    email: str,
    telefono: str,
    observaciones: str,
) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            UPDATE alumnos
            SET nombre = ?, apellidos = ?, email = ?, telefono = ?, observaciones = ?
            WHERE id = ?
            """,
            (
                nombre.strip(),
                apellidos.strip(),
                email.strip(),
                telefono.strip(),
                observaciones.strip(),
                alumno_id,
            ),
        )


def eliminar_alumno(alumno_id: int) -> None:
    with get_connection() as conn:
        activos = conn.execute(
            "SELECT COUNT(*) FROM prestamos WHERE alumno_id = ? AND fecha_devolucion_real IS NULL",
            (alumno_id,),
        ).fetchone()[0]
        if activos > 0:
            raise ValueError("No se puede eliminar: el alumno tiene préstamos activos.")
        conn.execute("DELETE FROM prestamos WHERE alumno_id = ?", (alumno_id,))
        conn.execute("DELETE FROM alumnos WHERE id = ?", (alumno_id,))


# --- Préstamos ---


def disponibles_para_libro(libro_id: int) -> int:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT l.cantidad - COALESCE((
                SELECT COUNT(*) FROM prestamos p
                WHERE p.libro_id = l.id AND p.fecha_devolucion_real IS NULL
            ), 0) AS d
            FROM libros l WHERE l.id = ?
            """,
            (libro_id,),
        ).fetchone()
    if not row:
        return 0
    return int(row[0])


def crear_prestamo(
    libro_id: int,
    alumno_id: int,
    dias_prestamo: int,
    observaciones: str,
) -> int:
    if dias_prestamo < 1:
        raise ValueError("Los días de préstamo deben ser al menos 1.")
    hoy = date.today().isoformat()
    esperada = (date.today() + timedelta(days=dias_prestamo)).isoformat()
    with get_connection() as conn:
        disp = conn.execute(
            """
            SELECT l.cantidad - COALESCE((
                SELECT COUNT(*) FROM prestamos p
                WHERE p.libro_id = l.id AND p.fecha_devolucion_real IS NULL
            ), 0)
            FROM libros l WHERE l.id = ?
            """,
            (libro_id,),
        ).fetchone()
        if not disp or disp[0] < 1:
            raise ValueError("No hay ejemplares disponibles de este libro.")
        cur = conn.execute(
            """
            INSERT INTO prestamos (
                libro_id, alumno_id, fecha_prestamo,
                fecha_devolucion_esperada, fecha_devolucion_real, observaciones
            )
            VALUES (?, ?, ?, ?, NULL, ?)
            """,
            (libro_id, alumno_id, hoy, esperada, observaciones.strip()),
        )
        return int(cur.lastrowid)


def registrar_devolucion(prestamo_id: int) -> None:
    hoy = date.today().isoformat()
    with get_connection() as conn:
        row = conn.execute(
            "SELECT fecha_devolucion_real FROM prestamos WHERE id = ?",
            (prestamo_id,),
        ).fetchone()
        if not row:
            raise ValueError("Préstamo no encontrado.")
        if row[0] is not None:
            raise ValueError("Este préstamo ya fue devuelto.")
        conn.execute(
            "UPDATE prestamos SET fecha_devolucion_real = ? WHERE id = ?",
            (hoy, prestamo_id),
        )


def listar_prestamos_activos() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT p.id, p.fecha_prestamo, p.fecha_devolucion_esperada, p.observaciones AS obs_prestamo,
                   l.id AS libro_id, l.isbn, l.titulo,
                   a.id AS alumno_id, a.nombre, a.apellidos
            FROM prestamos p
            JOIN libros l ON l.id = p.libro_id
            JOIN alumnos a ON a.id = p.alumno_id
            WHERE p.fecha_devolucion_real IS NULL
            ORDER BY p.fecha_devolucion_esperada, l.titulo
            """
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def listar_historial_prestamos(limite: int = 200) -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT p.id, p.fecha_prestamo, p.fecha_devolucion_esperada, p.fecha_devolucion_real,
                   p.observaciones AS obs_prestamo,
                   l.isbn, l.titulo,
                   a.nombre, a.apellidos
            FROM prestamos p
            JOIN libros l ON l.id = p.libro_id
            JOIN alumnos a ON a.id = p.alumno_id
            ORDER BY p.fecha_prestamo DESC, p.id DESC
            LIMIT ?
            """,
            (limite,),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]
