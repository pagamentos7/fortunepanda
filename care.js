const CareSystem = (() => {
  let stats = {
    fome: 80,
    banho: 70,
    energia: 90,
    felicidade: 85
  };

  function load() {
    try {
      const saved = localStorage.getItem("sky_care_stats");
      if (saved) stats = JSON.parse(saved);
    } catch (e) {}
    updateUI();
  }

  function save() {
    try {
      localStorage.setItem("sky_care_stats", JSON.stringify(stats));
    } catch (e) {}
    updateUI();
  }

  function updateUI() {
    for (const key in stats) {
      const el = document.getElementById(`care-val-${key}`);
      if (el) el.textContent = Math.round(stats[key]) + "%";
    }
  }

  return {
    init() {
      load();
      setInterval(() => {
        stats.fome = Math.max(0, stats.fome - 0.5);
        stats.banho = Math.max(0, stats.banho - 0.3);
        stats.energia = Math.max(0, stats.energia - 0.4);
        stats.felicidade = Math.max(0, stats.felicidade - 0.5);
        save();
      }, 10000);
    },
    feed() {
      stats.fome = Math.min(100, stats.fome + 25);
      save();
      if (window.AudioKit) AudioKit.collect?.();
    },
    wash() {
      stats.banho = Math.min(100, stats.banho + 30);
      save();
      if (window.AudioKit) AudioKit.collect?.();
    },
    sleep() {
      stats.energia = Math.min(100, stats.energia + 35);
      save();
      if (window.AudioKit) AudioKit.collect?.();
    },
    play() {
      stats.felicidade = Math.min(100, stats.felicidade + 20);
      save();
      if (window.AudioKit) AudioKit.collect?.();
    },
    getStats() { return stats; }
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  CareSystem.init();
});