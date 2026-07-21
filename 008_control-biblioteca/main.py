"""
Control de biblioteca: libros (ISBN, título, editorial, observaciones, existencias),
alumnos y préstamos / devoluciones.
Ejecutar: python main.py
"""

from __future__ import annotations

import sqlite3
import tkinter as tk
from tkinter import messagebox, ttk

import services as svc
from database import init_db

# Paleta sobria (institucional / biblioteca)
_COL = {
    "bg_app": "#e4e9f0",
    "bg_surface": "#ffffff",
    "bg_header": "#1e3a5f",
    "accent": "#2c5282",
    "accent_hover": "#3182ce",
    "accent_pressed": "#1a365d",
    "text": "#1a202c",
    "text_muted": "#4a5568",
    "border": "#cbd5e1",
    "tree_head_bg": "#2c5282",
    "tree_head_fg": "#f7fafc",
    "tree_sel_bg": "#bee3f8",
    "tree_sel_fg": "#1a365d",
    "row_alt": "#f1f5f9",
    "danger": "#9b2c2c",
    "danger_hover": "#c53030",
    "danger_pressed": "#742a2a",
    "field_bg": "#ffffff",
}


def apply_professional_theme(root: tk.Tk) -> None:
    root.configure(bg=_COL["bg_app"])
    try:
        root.option_add("*Font", "Segoe UI 10")
    except tk.TclError:
        root.option_add("*Font", "TkDefaultFont")

    style = ttk.Style(root)
    for name in ("clam", "alt", "default"):
        if name in style.theme_names():
            style.theme_use(name)
            break

    c = _COL
    style.configure(".", background=c["bg_surface"], foreground=c["text"], font=("Segoe UI", 10))
    style.configure("TFrame", background=c["bg_surface"])
    style.configure("TLabel", background=c["bg_surface"], foreground=c["text"])
    style.configure(
        "TLabelframe",
        background=c["bg_surface"],
        foreground=c["text"],
        bordercolor=c["border"],
        relief="solid",
    )
    style.configure(
        "TLabelframe.Label",
        background=c["bg_surface"],
        foreground=c["accent"],
        font=("Segoe UI", 10, "bold"),
    )
    style.configure("TNotebook", background=c["bg_app"], borderwidth=0)
    style.configure(
        "TNotebook.Tab",
        background=c["border"],
        foreground=c["text_muted"],
        padding=(14, 8),
        font=("Segoe UI", 10),
    )
    style.map(
        "TNotebook.Tab",
        background=[("selected", c["bg_surface"])],
        foreground=[("selected", c["accent"])],
        expand=[("selected", (1, 1, 1, 0))],
    )
    style.configure(
        "TEntry",
        fieldbackground=c["field_bg"],
        foreground=c["text"],
        insertcolor=c["text"],
        bordercolor=c["border"],
        lightcolor=c["bg_surface"],
        darkcolor=c["border"],
    )
    style.configure(
        "TSpinbox",
        fieldbackground=c["field_bg"],
        foreground=c["text"],
        insertcolor=c["text"],
        bordercolor=c["border"],
        arrowcolor=c["accent"],
    )
    style.configure(
        "TCombobox",
        fieldbackground=c["field_bg"],
        background=c["field_bg"],
        foreground=c["text"],
        bordercolor=c["border"],
        arrowcolor=c["accent"],
    )
    style.map("TCombobox", fieldbackground=[("readonly", c["field_bg"])])

    style.configure(
        "Primary.TButton",
        background=c["accent"],
        foreground="#ffffff",
        borderwidth=0,
        focuscolor=c["accent_hover"],
        padding=(12, 8),
        font=("Segoe UI", 10),
    )
    style.map(
        "Primary.TButton",
        background=[("pressed", c["accent_pressed"]), ("active", c["accent_hover"])],
    )
    style.configure(
        "Secondary.TButton",
        background=c["bg_surface"],
        foreground=c["accent"],
        bordercolor=c["border"],
        lightcolor=c["bg_surface"],
        darkcolor=c["border"],
        padding=(10, 7),
        font=("Segoe UI", 10),
    )
    style.map(
        "Secondary.TButton",
        background=[("pressed", c["row_alt"]), ("active", c["row_alt"])],
    )
    style.configure(
        "Danger.TButton",
        background=c["bg_surface"],
        foreground=c["danger"],
        bordercolor=c["danger"],
        lightcolor=c["bg_surface"],
        darkcolor=c["danger"],
        padding=(10, 7),
        font=("Segoe UI", 10),
    )
    style.map(
        "Danger.TButton",
        background=[("pressed", "#fff5f5"), ("active", "#fff5f5")],
        foreground=[("pressed", c["danger_pressed"]), ("active", c["danger_hover"])],
    )

    style.configure(
        "Treeview",
        background=c["bg_surface"],
        fieldbackground=c["bg_surface"],
        foreground=c["text"],
        bordercolor=c["border"],
        borderwidth=1,
        rowheight=26,
        font=("Segoe UI", 9),
    )
    style.configure(
        "Treeview.Heading",
        background=c["tree_head_bg"],
        foreground=c["tree_head_fg"],
        borderwidth=0,
        font=("Segoe UI", 9, "bold"),
        padding=(6, 6),
    )
    style.map(
        "Treeview",
        background=[("selected", c["tree_sel_bg"])],
        foreground=[("selected", c["tree_sel_fg"])],
    )

    style.configure(
        "Vertical.TScrollbar",
        background=c["border"],
        troughcolor=c["bg_surface"],
        bordercolor=c["bg_app"],
        arrowcolor=c["accent"],
    )
    style.map("Vertical.TScrollbar", background=[("active", c["accent"]), ("pressed", c["accent_pressed"])])


def _style_text_widget(w: tk.Text) -> None:
    w.configure(
        bg=_COL["field_bg"],
        fg=_COL["text"],
        insertbackground=_COL["text"],
        relief=tk.FLAT,
        highlightthickness=1,
        highlightbackground=_COL["border"],
        highlightcolor=_COL["accent"],
        selectbackground=_COL["tree_sel_bg"],
        selectforeground=_COL["tree_sel_fg"],
        padx=6,
        pady=4,
        font=("Segoe UI", 10),
    )


def _show_error(title: str, err: Exception) -> None:
    messagebox.showerror(title, str(err))


class LibrosFrame(ttk.Frame):
    def __init__(self, parent: tk.Misc, **kwargs) -> None:
        super().__init__(parent, **kwargs)
        self._build()
        self.refresh()

    def _build(self) -> None:
        form = ttk.LabelFrame(self, text="Datos del libro", padding=8)
        form.pack(fill=tk.X, padx=8, pady=8)

        ttk.Label(form, text="ISBN:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.var_isbn = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_isbn, width=22).grid(row=0, column=1, sticky=tk.W)

        ttk.Label(form, text="Título:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.var_titulo = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_titulo, width=50).grid(row=1, column=1, columnspan=3, sticky=tk.W)

        ttk.Label(form, text="Editorial:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.var_editorial = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_editorial, width=40).grid(row=2, column=1, columnspan=3, sticky=tk.W)

        ttk.Label(form, text="Cantidad:").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.var_cantidad = tk.StringVar(value="1")
        ttk.Spinbox(form, from_=0, to=99999, textvariable=self.var_cantidad, width=10).grid(
            row=3, column=1, sticky=tk.W
        )

        ttk.Label(form, text="Observaciones:").grid(row=4, column=0, sticky=tk.NW, pady=2)
        self.txt_obs = tk.Text(form, width=50, height=3, wrap=tk.WORD)
        self.txt_obs.grid(row=4, column=1, columnspan=3, sticky=tk.W)
        _style_text_widget(self.txt_obs)

        btns = ttk.Frame(form)
        btns.grid(row=5, column=0, columnspan=4, pady=8, sticky=tk.W)
        ttk.Button(btns, text="Guardar (nuevo)", style="Primary.TButton", command=self._guardar_nuevo).pack(
            side=tk.LEFT, padx=(0, 6)
        )
        ttk.Button(btns, text="Actualizar seleccionado", style="Secondary.TButton", command=self._actualizar).pack(
            side=tk.LEFT, padx=(0, 6)
        )
        ttk.Button(btns, text="Eliminar seleccionado", style="Danger.TButton", command=self._eliminar).pack(
            side=tk.LEFT
        )

        list_frame = ttk.LabelFrame(self, text="Inventario", padding=8)
        list_frame.pack(fill=tk.BOTH, expand=True, padx=8, pady=(0, 8))

        cols = ("id", "isbn", "titulo", "editorial", "cantidad", "en_prestamo", "disponibles")
        self.tree = ttk.Treeview(list_frame, columns=cols, show="headings", height=14, selectmode=tk.BROWSE)
        headings = {
            "id": "ID",
            "isbn": "ISBN",
            "titulo": "Título",
            "editorial": "Editorial",
            "cantidad": "Existencias",
            "en_prestamo": "En préstamo",
            "disponibles": "Disponibles",
        }
        widths = {"id": 40, "isbn": 130, "titulo": 220, "editorial": 120, "cantidad": 90, "en_prestamo": 90, "disponibles": 90}
        for c in cols:
            self.tree.heading(c, text=headings[c])
            self.tree.column(c, width=widths[c], stretch=True)
        scroll = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scroll.set)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.bind("<<TreeviewSelect>>", self._on_select)
        self.tree.tag_configure("odd", background=_COL["row_alt"])
        self.tree.tag_configure("even", background=_COL["bg_surface"])

    def _on_select(self, _event: object) -> None:
        sel = self.tree.selection()
        if not sel:
            return
        vals = self.tree.item(sel[0], "values")
        if not vals:
            return
        libro_id = int(vals[0])
        for r in svc.listar_libros():
            if r["id"] == libro_id:
                self.var_isbn.set(r["isbn"])
                self.var_titulo.set(r["titulo"])
                self.var_editorial.set(r["editorial"] or "")
                self.var_cantidad.set(str(r["cantidad"]))
                self.txt_obs.delete("1.0", tk.END)
                self.txt_obs.insert("1.0", r["observaciones"] or "")
                break

    def _leer_form(self) -> tuple[str, str, str, str, int]:
        obs = self.txt_obs.get("1.0", tk.END).strip()
        try:
            cant = int(self.var_cantidad.get().strip())
        except ValueError as e:
            raise ValueError("La cantidad debe ser un número entero.") from e
        return (
            self.var_isbn.get(),
            self.var_titulo.get(),
            self.var_editorial.get(),
            obs,
            cant,
        )

    def _guardar_nuevo(self) -> None:
        try:
            isbn, titulo, ed, obs, cant = self._leer_form()
            if not isbn or not titulo:
                messagebox.showwarning("Datos incompletos", "ISBN y título son obligatorios.")
                return
            svc.crear_libro(isbn, titulo, ed, obs, cant)
            self.refresh()
            messagebox.showinfo("Guardado", "Libro registrado correctamente.")
        except sqlite3.IntegrityError:
            _show_error("ISBN duplicado", Exception("Ya existe un libro con ese ISBN."))
        except Exception as e:
            _show_error("Error", e)

    def _actualizar(self) -> None:
        sel = self.tree.selection()
        if not sel:
            messagebox.showinfo("Selección", "Seleccione un libro en la tabla.")
            return
        libro_id = int(self.tree.item(sel[0], "values")[0])
        try:
            isbn, titulo, ed, obs, cant = self._leer_form()
            if not isbn or not titulo:
                messagebox.showwarning("Datos incompletos", "ISBN y título son obligatorios.")
                return
            svc.actualizar_libro(libro_id, isbn, titulo, ed, obs, cant)
            self.refresh()
            messagebox.showinfo("Actualizado", "Libro actualizado.")
        except sqlite3.IntegrityError:
            _show_error("ISBN duplicado", Exception("Ya existe otro libro con ese ISBN."))
        except Exception as e:
            _show_error("Error", e)

    def _eliminar(self) -> None:
        sel = self.tree.selection()
        if not sel:
            messagebox.showinfo("Selección", "Seleccione un libro en la tabla.")
            return
        libro_id = int(self.tree.item(sel[0], "values")[0])
        if not messagebox.askyesno("Confirmar", "¿Eliminar este libro y su historial de préstamos?"):
            return
        try:
            svc.eliminar_libro(libro_id)
            self.refresh()
            messagebox.showinfo("Eliminado", "Libro eliminado.")
        except Exception as e:
            _show_error("Error", e)

    def refresh(self) -> None:
        for i in self.tree.get_children():
            self.tree.delete(i)
        for n, r in enumerate(svc.listar_libros()):
            tag = "odd" if n % 2 else "even"
            self.tree.insert(
                "",
                tk.END,
                values=(
                    r["id"],
                    r["isbn"],
                    r["titulo"],
                    r["editorial"] or "",
                    r["cantidad"],
                    r["en_prestamo"],
                    r["disponibles"],
                ),
                tags=(tag,),
            )


class AlumnosFrame(ttk.Frame):
    def __init__(self, parent: tk.Misc, **kwargs) -> None:
        super().__init__(parent, **kwargs)
        self._build()
        self.refresh()

    def _build(self) -> None:
        form = ttk.LabelFrame(self, text="Datos del alumno", padding=8)
        form.pack(fill=tk.X, padx=8, pady=8)

        ttk.Label(form, text="Nombre:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.var_nombre = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_nombre, width=28).grid(row=0, column=1, sticky=tk.W)

        ttk.Label(form, text="Apellidos:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.var_apellidos = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_apellidos, width=28).grid(row=1, column=1, sticky=tk.W)

        ttk.Label(form, text="Email:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.var_email = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_email, width=36).grid(row=2, column=1, sticky=tk.W)

        ttk.Label(form, text="Teléfono:").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.var_tel = tk.StringVar()
        ttk.Entry(form, textvariable=self.var_tel, width=20).grid(row=3, column=1, sticky=tk.W)

        ttk.Label(form, text="Observaciones:").grid(row=4, column=0, sticky=tk.NW, pady=2)
        self.txt_obs = tk.Text(form, width=44, height=3, wrap=tk.WORD)
        self.txt_obs.grid(row=4, column=1, sticky=tk.W)
        _style_text_widget(self.txt_obs)

        btns = ttk.Frame(form)
        btns.grid(row=5, column=0, columnspan=2, pady=8, sticky=tk.W)
        ttk.Button(btns, text="Guardar (nuevo)", style="Primary.TButton", command=self._guardar_nuevo).pack(
            side=tk.LEFT, padx=(0, 6)
        )
        ttk.Button(btns, text="Actualizar seleccionado", style="Secondary.TButton", command=self._actualizar).pack(
            side=tk.LEFT, padx=(0, 6)
        )
        ttk.Button(btns, text="Eliminar seleccionado", style="Danger.TButton", command=self._eliminar).pack(
            side=tk.LEFT
        )

        list_frame = ttk.LabelFrame(self, text="Alumnos registrados", padding=8)
        list_frame.pack(fill=tk.BOTH, expand=True, padx=8, pady=(0, 8))

        cols = ("id", "nombre", "apellidos", "email", "telefono")
        self.tree = ttk.Treeview(list_frame, columns=cols, show="headings", height=16, selectmode=tk.BROWSE)
        for c, h, w in [
            ("id", "ID", 45),
            ("nombre", "Nombre", 140),
            ("apellidos", "Apellidos", 160),
            ("email", "Email", 200),
            ("telefono", "Teléfono", 100),
        ]:
            self.tree.heading(c, text=h)
            self.tree.column(c, width=w, stretch=True)
        scroll = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scroll.set)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.bind("<<TreeviewSelect>>", self._on_select)
        self.tree.tag_configure("odd", background=_COL["row_alt"])
        self.tree.tag_configure("even", background=_COL["bg_surface"])

    def _on_select(self, _event: object) -> None:
        sel = self.tree.selection()
        if not sel:
            return
        alumno_id = int(self.tree.item(sel[0], "values")[0])
        for r in svc.listar_alumnos():
            if r["id"] == alumno_id:
                self.var_nombre.set(r["nombre"])
                self.var_apellidos.set(r["apellidos"] or "")
                self.var_email.set(r["email"] or "")
                self.var_tel.set(r["telefono"] or "")
                self.txt_obs.delete("1.0", tk.END)
                self.txt_obs.insert("1.0", r["observaciones"] or "")
                break

    def _leer_form(self) -> tuple[str, str, str, str, str]:
        return (
            self.var_nombre.get(),
            self.var_apellidos.get(),
            self.var_email.get(),
            self.var_tel.get(),
            self.txt_obs.get("1.0", tk.END).strip(),
        )

    def _guardar_nuevo(self) -> None:
        try:
            n, a, e, t, obs = self._leer_form()
            if not n.strip():
                messagebox.showwarning("Datos incompletos", "El nombre es obligatorio.")
                return
            svc.crear_alumno(n, a, e, t, obs)
            self.refresh()
            messagebox.showinfo("Guardado", "Alumno registrado.")
        except Exception as e:
            _show_error("Error", e)

    def _actualizar(self) -> None:
        sel = self.tree.selection()
        if not sel:
            messagebox.showinfo("Selección", "Seleccione un alumno en la tabla.")
            return
        aid = int(self.tree.item(sel[0], "values")[0])
        try:
            n, a, e, t, obs = self._leer_form()
            if not n.strip():
                messagebox.showwarning("Datos incompletos", "El nombre es obligatorio.")
                return
            svc.actualizar_alumno(aid, n, a, e, t, obs)
            self.refresh()
            messagebox.showinfo("Actualizado", "Datos del alumno actualizados.")
        except Exception as e:
            _show_error("Error", e)

    def _eliminar(self) -> None:
        sel = self.tree.selection()
        if not sel:
            messagebox.showinfo("Selección", "Seleccione un alumno en la tabla.")
            return
        aid = int(self.tree.item(sel[0], "values")[0])
        if not messagebox.askyesno("Confirmar", "¿Eliminar este alumno y su historial de préstamos?"):
            return
        try:
            svc.eliminar_alumno(aid)
            self.refresh()
            messagebox.showinfo("Eliminado", "Alumno eliminado.")
        except Exception as e:
            _show_error("Error", e)

    def refresh(self) -> None:
        for i in self.tree.get_children():
            self.tree.delete(i)
        for n, r in enumerate(svc.listar_alumnos()):
            tag = "odd" if n % 2 else "even"
            self.tree.insert(
                "",
                tk.END,
                values=(
                    r["id"],
                    r["nombre"],
                    r["apellidos"] or "",
                    r["email"] or "",
                    r["telefono"] or "",
                ),
                tags=(tag,),
            )


class PrestamosFrame(ttk.Frame):
    def __init__(self, parent: tk.Misc, on_change: object, **kwargs) -> None:
        self._on_change = on_change
        super().__init__(parent, **kwargs)
        self._build()
        self.refresh()

    def _build(self) -> None:
        nuevo = ttk.LabelFrame(self, text="Nuevo préstamo", padding=8)
        nuevo.pack(fill=tk.X, padx=8, pady=8)

        ttk.Label(nuevo, text="Libro:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.combo_libro = ttk.Combobox(nuevo, width=55, state="readonly")
        self.combo_libro.grid(row=0, column=1, columnspan=2, sticky=tk.W)

        ttk.Label(nuevo, text="Alumno:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.combo_alumno = ttk.Combobox(nuevo, width=55, state="readonly")
        self.combo_alumno.grid(row=1, column=1, columnspan=2, sticky=tk.W)

        ttk.Label(nuevo, text="Días de préstamo:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.var_dias = tk.StringVar(value="14")
        ttk.Spinbox(nuevo, from_=1, to=365, textvariable=self.var_dias, width=8).grid(row=2, column=1, sticky=tk.W)

        ttk.Label(nuevo, text="Observaciones:").grid(row=3, column=0, sticky=tk.NW, pady=2)
        self.txt_obs_p = tk.Text(nuevo, width=50, height=2, wrap=tk.WORD)
        self.txt_obs_p.grid(row=3, column=1, columnspan=2, sticky=tk.W)
        _style_text_widget(self.txt_obs_p)

        ttk.Button(nuevo, text="Registrar préstamo", style="Primary.TButton", command=self._nuevo_prestamo).grid(
            row=4, column=0, columnspan=3, pady=8, sticky=tk.W
        )

        activos = ttk.LabelFrame(self, text="Préstamos activos (pendientes de devolución)", padding=8)
        activos.pack(fill=tk.BOTH, expand=True, padx=8, pady=(0, 8))

        cols = ("id", "titulo", "alumno", "fecha_p", "fecha_esperada")
        self.tree_act = ttk.Treeview(activos, columns=cols, show="headings", height=10, selectmode=tk.BROWSE)
        for c, h, w in [
            ("id", "ID préstamo", 80),
            ("titulo", "Libro", 260),
            ("alumno", "Alumno", 200),
            ("fecha_p", "Prestado", 100),
            ("fecha_esperada", "Devolver antes", 110),
        ]:
            self.tree_act.heading(c, text=h)
            self.tree_act.column(c, width=w, stretch=True)
        s1 = ttk.Scrollbar(activos, orient=tk.VERTICAL, command=self.tree_act.yview)
        self.tree_act.configure(yscrollcommand=s1.set)
        self.tree_act.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        s1.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree_act.tag_configure("odd", background=_COL["row_alt"])
        self.tree_act.tag_configure("even", background=_COL["bg_surface"])
        ttk.Button(
            activos,
            text="Registrar devolución (seleccionado)",
            style="Primary.TButton",
            command=self._devolucion,
        ).pack(pady=6, anchor=tk.W)

        hist = ttk.LabelFrame(self, text="Historial reciente", padding=8)
        hist.pack(fill=tk.BOTH, expand=True, padx=8, pady=(0, 8))

        cols2 = ("id", "titulo", "alumno", "fecha_p", "esperada", "devuelto")
        self.tree_hist = ttk.Treeview(hist, columns=cols2, show="headings", height=8, selectmode=tk.BROWSE)
        for c, h, w in [
            ("id", "ID", 50),
            ("titulo", "Libro", 220),
            ("alumno", "Alumno", 180),
            ("fecha_p", "Prestado", 95),
            ("esperada", "Esperada", 95),
            ("devuelto", "Devuelto", 95),
        ]:
            self.tree_hist.heading(c, text=h)
            self.tree_hist.column(c, width=w, stretch=True)
        s2 = ttk.Scrollbar(hist, orient=tk.VERTICAL, command=self.tree_hist.yview)
        self.tree_hist.configure(yscrollcommand=s2.set)
        self.tree_hist.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        s2.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree_hist.tag_configure("odd", background=_COL["row_alt"])
        self.tree_hist.tag_configure("even", background=_COL["bg_surface"])

    def _libros_combo_map(self) -> list[tuple[int, str]]:
        out: list[tuple[int, str]] = []
        for r in svc.listar_libros():
            disp = r["disponibles"]
            label = f"[{r['isbn']}] {r['titulo']} — disponibles: {disp}"
            out.append((int(r["id"]), label))
        return out

    def _alumnos_combo_map(self) -> list[tuple[int, str]]:
        return [
            (int(r["id"]), f"{r['apellidos'] or ''}, {r['nombre']}".strip(", "))
            for r in svc.listar_alumnos()
        ]

    def refresh(self) -> None:
        lm = self._libros_combo_map()
        self._libro_ids = [x[0] for x in lm]
        self.combo_libro["values"] = [x[1] for x in lm]
        if self._libro_ids:
            self.combo_libro.current(0)
        else:
            self.combo_libro.set("")

        am = self._alumnos_combo_map()
        self._alumno_ids = [x[0] for x in am]
        self.combo_alumno["values"] = [x[1] for x in am]
        if self._alumno_ids:
            self.combo_alumno.current(0)
        else:
            self.combo_alumno.set("")

        for i in self.tree_act.get_children():
            self.tree_act.delete(i)
        for n, r in enumerate(svc.listar_prestamos_activos()):
            alumno = f"{r.get('apellidos') or ''}, {r.get('nombre') or ''}".strip(", ")
            tag = "odd" if n % 2 else "even"
            self.tree_act.insert(
                "",
                tk.END,
                values=(
                    r["id"],
                    r["titulo"],
                    alumno,
                    r["fecha_prestamo"],
                    r["fecha_devolucion_esperada"] or "",
                ),
                tags=(tag,),
            )

        for i in self.tree_hist.get_children():
            self.tree_hist.delete(i)
        for n, r in enumerate(svc.listar_historial_prestamos()):
            alumno = f"{r.get('apellidos') or ''}, {r.get('nombre') or ''}".strip(", ")
            tag = "odd" if n % 2 else "even"
            self.tree_hist.insert(
                "",
                tk.END,
                values=(
                    r["id"],
                    r["titulo"],
                    alumno,
                    r["fecha_prestamo"],
                    r["fecha_devolucion_esperada"] or "",
                    r["fecha_devolucion_real"] or "—",
                ),
                tags=(tag,),
            )

    def _nuevo_prestamo(self) -> None:
        if not self._libro_ids or not self._alumno_ids:
            messagebox.showwarning("Datos", "Debe haber al menos un libro y un alumno registrados.")
            return
        try:
            li = self.combo_libro.current()
            ai = self.combo_alumno.current()
            if li < 0 or ai < 0:
                messagebox.showwarning("Selección", "Elija libro y alumno.")
                return
            libro_id = self._libro_ids[li]
            alumno_id = self._alumno_ids[ai]
            dias = int(self.var_dias.get())
            obs = self.txt_obs_p.get("1.0", tk.END).strip()
            svc.crear_prestamo(libro_id, alumno_id, dias, obs)
            self.refresh()
            self._on_change()
            messagebox.showinfo("Préstamo", "Préstamo registrado.")
        except Exception as e:
            _show_error("Error", e)

    def _devolucion(self) -> None:
        sel = self.tree_act.selection()
        if not sel:
            messagebox.showinfo("Selección", "Seleccione un préstamo activo.")
            return
        pid = int(self.tree_act.item(sel[0], "values")[0])
        try:
            svc.registrar_devolucion(pid)
            self.refresh()
            self._on_change()
            messagebox.showinfo("Devolución", "Devolución registrada.")
        except Exception as e:
            _show_error("Error", e)


class App(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Control de biblioteca")
        self.geometry("920x720")
        self.minsize(800, 600)

        apply_professional_theme(self)

        header = tk.Frame(self, bg=_COL["bg_header"], height=56)
        header.pack(fill=tk.X, side=tk.TOP)
        header.pack_propagate(False)
        tk.Label(
            header,
            text="Control de biblioteca",
            bg=_COL["bg_header"],
            fg="#f7fafc",
            font=("Segoe UI", 13, "bold"),
            anchor="w",
        ).pack(side=tk.LEFT, padx=16, pady=14)

        nb = ttk.Notebook(self)
        nb.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))

        self.frame_libros = LibrosFrame(nb)
        self.frame_alumnos = AlumnosFrame(nb)
        self.frame_prestamos = PrestamosFrame(nb, on_change=self._global_refresh)

        nb.add(self.frame_libros, text="Libros")
        nb.add(self.frame_alumnos, text="Alumnos")
        nb.add(self.frame_prestamos, text="Préstamos")

        nb.bind("<<NotebookTabChanged>>", self._on_tab)

    def _on_tab(self, _event: object) -> None:
        self._global_refresh()

    def _global_refresh(self) -> None:
        self.frame_libros.refresh()
        self.frame_alumnos.refresh()
        self.frame_prestamos.refresh()


def main() -> None:
    init_db()
    app = App()
    app.mainloop()


if __name__ == "__main__":
    main()
