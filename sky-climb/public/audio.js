const AudioKit = (() => {
  let ctx = null;
  let muted = false;
  let ambient = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(f1, f2, dur, type = "sine", vol = 0.12) {
    if (muted) return;
    const c = ac();
    const n = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, n);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), n + dur);
    g.gain.setValueAtTime(vol, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + dur);
    o.connect(g).connect(c.destination);
    o.start(n);
    o.stop(n + dur + 0.02);
  }

  function chord(freqs, dur, vol = 0.04) {
    freqs.forEach((f, i) => tone(f, f * 0.98, dur, i % 2 ? "triangle" : "sine", vol));
  }

  return {
    ready() { ac(); },
    setMuted(v) { muted = v; if (v && ambient) { try { ambient.stop(); } catch {} ambient = null; } },
    isMuted() { return muted; },
    jump() { tone(340, 620, 0.13); },
    spring() { tone(180, 900, 0.28, "triangle", 0.18); },
    collect() { tone(720, 1400, 0.15, "sine", 0.2); },
    fall() { tone(160, 45, 0.45, "sawtooth", 0.12); },
    ui() { tone(520, 880, 0.08, "square", 0.05); },
    buy() { chord([523, 659, 784], 0.28, 0.06); },
    equip() { tone(240, 480, 0.16, "triangle", 0.1); },
    whoosh() { tone(140, 40, 0.35, "sawtooth", 0.06); },
    sting(kind) {
      if (kind === "capa") chord([196, 247, 294], 0.5, 0.05);
      else if (kind === "teia") { tone(880, 1320, 0.08, "square", 0.06); setTimeout(() => tone(660, 990, 0.08, "square", 0.05), 80); }
      else chord([330, 415, 494], 0.4, 0.045);
    },
    biome(type) {
      const map = [220, 262, 196, 110, 98, 349, 311, 415, 82];
      tone(map[type] || 220, (map[type] || 220) * 1.5, 0.4, "sine", 0.05);
    },
    combo(n) {
      const f = 420 + Math.min(18, n) * 55;
      tone(f, f * 1.6, 0.1, "square", 0.07);
    },
    perfect() { chord([784, 988, 1175], 0.22, 0.07); },
    fever() { chord([392, 523, 659, 784], 0.45, 0.07); },
    gem() { tone(980, 1560, 0.18, "sine", 0.16); tone(1320, 1980, 0.22, "triangle", 0.08); },
    rocket() { tone(90, 420, 0.32, "sawtooth", 0.1); },
    magnet() { tone(280, 640, 0.2, "triangle", 0.1); },
    tick() { tone(880, 880, 0.04, "square", 0.03); },
    clutch() { chord([523, 784, 1046], 0.35, 0.08); tone(180, 720, 0.28, "sawtooth", 0.08); },
    jackpot() {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, f * 1.2, 0.12, "square", 0.08), i * 55));
    },
    record() { chord([392, 523, 659, 784, 1046], 0.55, 0.08); },
    near() { tone(220, 140, 0.35, "triangle", 0.1); },
    heat() { tone(440, 880, 0.12, "square", 0.06); },
    warn() { tone(90, 70, 0.12, "sine", 0.06); }
  };
})();
