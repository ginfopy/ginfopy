(function () {
  const montoEl = document.getElementById("monto");
  const cuotasEl = document.getElementById("cuotas");
  const interesEl = document.getElementById("interes");
  const outInteres = document.getElementById("outInteres");
  const outTotal = document.getElementById("outTotal");
  const outCuota = document.getElementById("outCuota");
  const formulaNote = document.getElementById("formulaNote");

  const fmt = new Intl.NumberFormat("es", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function formatMoney(n) {
    return fmt.format(n);
  }

  function calc() {
    const monto = Number(montoEl.value);
    const cuotas = Math.floor(Number(cuotasEl.value));
    const interesPct = Number(interesEl.value);

    if (
      !Number.isFinite(monto) ||
      monto < 0 ||
      !Number.isFinite(cuotas) ||
      cuotas < 1 ||
      !Number.isFinite(interesPct) ||
      interesPct < 0
    ) {
      outInteres.textContent = "—";
      outTotal.textContent = "—";
      outCuota.textContent = "—";
      formulaNote.textContent =
        "Revisa los valores: monto ≥ 0, al menos 1 cuota e interés ≥ 0.";
      return;
    }

    const montoInteres = monto * (interesPct / 100);
    const totalAPagar = monto + montoInteres;
    const valorCuota = totalAPagar / cuotas;

    outInteres.textContent = formatMoney(montoInteres);
    outTotal.textContent = formatMoney(totalAPagar);
    outCuota.textContent = formatMoney(valorCuota);
    formulaNote.textContent =
      `Total = cuenta × (1 + ${interesPct}% / 100); cuota = total ÷ ${cuotas}. ` +
      "Los importes usan la misma unidad monetaria que el monto que ingreses.";
  }

  [montoEl, cuotasEl, interesEl].forEach((el) => {
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });

  calc();
})();
