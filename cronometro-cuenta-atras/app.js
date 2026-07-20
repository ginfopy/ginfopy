(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elHours = $("hours");
  const elMinutes = $("minutes");
  const elSeconds = $("seconds");
  const elSetup = $("setup");
  const elRun = $("run");
  const elDisplay = $("display");
  const elApp = document.querySelector(".app");
  const elHint = $("hint");
  const btnStart = $("btnStart");
  const btnPause = $("btnPause");
  const btnReset = $("btnReset");

  let audioCtx = null;
  let intervalId = null;
  let remaining = 0;
  let initialTotal = 0;
  let running = false;

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      return audioCtx.resume();
    }
    return Promise.resolve();
  }

  function playTone(freq, duration, gainStart = 0.12, type = "sine") {
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gainStart, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  /** Pitido corto cada segundo */
  function playTick() {
    playTone(880, 0.045, 0.1, "square");
  }

  /** Otro sonido al “cerrar” un minuto en pantalla (p. ej. 03:01 → 03:00) */
  function playMinuteChime() {
    const t0 = audioCtx.currentTime;
    const freqs = [523.25, 659.25];
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t0 + i * 0.12);
      g.gain.setValueAtTime(0, t0 + i * 0.12);
      g.gain.linearRampToValueAtTime(0.18, t0 + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.12 + 0.35);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start(t0 + i * 0.12);
      osc.stop(t0 + i * 0.12 + 0.4);
    });
  }

  /** Alarma al llegar a cero */
  function playAlarm() {
    const t0 = audioCtx.currentTime;
    for (let i = 0; i < 4; i++) {
      const start = t0 + i * 0.22;
      playToneAt(740, start, 0.18, 0.14);
      playToneAt(980, start + 0.11, 0.18, 0.14);
    }
  }

  function playToneAt(freq, startTime, duration, gain) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, startTime);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gain, startTime + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function clampInputs() {
    let h = Math.max(0, Math.min(99, parseInt(elHours.value, 10) || 0));
    let m = Math.max(0, Math.min(59, parseInt(elMinutes.value, 10) || 0));
    let s = Math.max(0, Math.min(59, parseInt(elSeconds.value, 10) || 0));
    elHours.value = h;
    elMinutes.value = m;
    elSeconds.value = s;
    return h * 3600 + m * 60 + s;
  }

  function formatTime(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function clearHeatStyle() {
    ["--heat-h", "--heat-s", "--heat-l", "--heat-a"].forEach((p) => elDisplay.style.removeProperty(p));
  }

  function updateHeatColor() {
    if (initialTotal <= 0) return;
    const r = Math.max(0, Math.min(1, remaining / initialTotal));
    const hue = Math.round(r * 232);
    const sat = Math.round(50 + 48 * (1 - r));
    const light = Math.round(42 + 22 * r);
    const glowA = (0.18 + 0.68 * (1 - r)).toFixed(3);
    elDisplay.style.setProperty("--heat-h", String(hue));
    elDisplay.style.setProperty("--heat-s", `${sat}%`);
    elDisplay.style.setProperty("--heat-l", `${light}%`);
    elDisplay.style.setProperty("--heat-a", glowA);
  }

  function refreshDisplay() {
    elDisplay.textContent = formatTime(remaining);
    elDisplay.classList.toggle("display--long", remaining >= 3600);
    updateHeatColor();
  }

  function showRun() {
    elSetup.hidden = true;
    elRun.hidden = false;
    if (elApp) elApp.classList.add("app--running");
  }

  function showSetup() {
    elRun.hidden = true;
    elSetup.hidden = false;
    clearHeatStyle();
    if (elApp) elApp.classList.remove("app--running");
  }

  function stopInterval() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    running = false;
  }

  function tick() {
    const prev = remaining;
    if (prev <= 0) {
      stopInterval();
      return;
    }

    remaining = prev - 1;
    refreshDisplay();

    if (remaining > 0) {
      playTick();
    }

    if (remaining > 0 && prev % 60 !== 0 && remaining % 60 === 0) {
      playMinuteChime();
    }

    if (remaining === 0) {
      playAlarm();
      elDisplay.classList.add("flash-zero");
      elDisplay.addEventListener(
        "animationend",
        () => elDisplay.classList.remove("flash-zero"),
        { once: true }
      );
      btnPause.textContent = "Pausar";
      stopInterval();
    }
  }

  function startTimer() {
    stopInterval();
    running = true;
    intervalId = setInterval(tick, 1000);
    btnPause.textContent = "Pausar";
  }

  btnStart.addEventListener("click", async () => {
    const total = clampInputs();
    if (total <= 0) {
      elHint.hidden = false;
      elHint.textContent = "Indica al menos 1 segundo de cuenta atrás.";
      return;
    }
    await ensureAudio();
    elHint.hidden = true;
    remaining = total;
    initialTotal = total;
    refreshDisplay();
    showRun();
    startTimer();
  });

  btnPause.addEventListener("click", async () => {
    if (!running) {
      await ensureAudio();
      startTimer();
      btnPause.textContent = "Pausar";
      return;
    }
    stopInterval();
    btnPause.textContent = "Continuar";
  });

  btnReset.addEventListener("click", () => {
    stopInterval();
    remaining = initialTotal;
    elDisplay.textContent = formatTime(remaining);
    elDisplay.classList.toggle("display--long", remaining >= 3600);
    btnPause.textContent = "Pausar";
    showSetup();
    elHint.hidden = false;
    elHint.textContent = "Pulsa Iniciar para activar el audio (los navegadores lo exigen tras un gesto del usuario).";
  });
})();
