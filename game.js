const Game = (() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const W = canvas.width;
  const H = canvas.height;
  const $ = (id) => document.getElementById(id);

  let equippedSkin = "panda";
  let onRunEnd = null;

  let points = 1240;
  let totalCoins = 0;
  let floaters = [];
  let shake = 0;
  let combo = 0;
  let comboT = 0;
  let fever = false;
  let powerTimer = 2.2;
  let lastMilestone = 0;

  function toast(msg) {
    const el = $("game-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
  }
  function floatText(x, y, text, color) {
    floaters.push({ x, y, text, color: color || "#ffe27a", life: 0.85 });
  }
  function bumpShake(n) { shake = Math.min(6, shake + n); }
  function setCombo(n) {
    combo = n; comboT = 1.25;
    const hud = $("combo-hud");
    const xel = $("combo-x");
    if (!hud) return;
    if (n < 2) { hud.hidden = true; fever = false; document.querySelector(".game-panel")?.classList.remove("fever-glow"); return; }
    hud.hidden = false;
    if (xel) xel.textContent = "x" + n;
    hud.classList.toggle("fever", n >= 8);
    if (n === 8 && !fever) { fever = true; AudioKit.fever?.(); toast("FEVER"); document.querySelector(".game-panel")?.classList.add("fever-glow"); }
    if (n > 8) fever = true;
  }
  function addCoins(cents, x, y) {
    const mult = 1 + Math.min(10, combo) * 0.12 + (fever ? 0.4 : 0);
    const got = Math.round(cents * mult);
    totalCoins += got;
    updateCoinUI();
    triggerChipPop("coin-val");
    if (x != null) floatText(x, y, "+" + formatMoney(got), "#ffe27a");
  }
  const player = {
    x: W / 2, y: 560, vx: 0, vy: 0, radius: 20, moveSpeed: 560, jumpForce: -820,
    gravity: 1980, fallClamp: 1180, inputDir: 0, umbrella: false, umbrellaTimer: 0, squashPulse: 0, tilt: 0,
    magnet: 0, rocket: 0
  };

  function spawnBurst(x, y, count, colors, opts = {}) {
    const spread = opts.spread ?? 140, upBias = opts.upBias ?? 100, life = opts.life ?? 0.5, size = opts.size ?? 3, grav = opts.grav ?? 260;
    const n = Math.min(count, 10);
    if (particles.length > 70) particles.splice(0, particles.length - 50);
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2, spd = 30 + Math.random() * spread;
      particles.push({ x, y, vx: Math.cos(ang) * spd * 0.6, vy: Math.sin(ang) * spd * 0.6 - upBias * Math.random(), life: life * (0.6 + Math.random() * 0.7), maxLife: life, size: size * (0.6 + Math.random() * 0.8), color: colors[(Math.random() * colors.length) | 0], grav });
    }
  }
  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) { particles[i] = particles[particles.length - 1]; particles.pop(); }
    }
  }
  function drawParticles() {
    for (const p of particles) {
      const sy = p.y - cameraY;
      if (sy < -40 || sy > H + 40) continue;
      const a = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, sy, p.size * a + p.size * 0.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function triggerChipPop(valId) {
    const el = $(valId); if (!el) return;
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
    const chip = el.closest(".hud-chip");
    if (chip) { chip.classList.remove("pop"); void chip.offsetWidth; chip.classList.add("pop"); }
  }
  function animateNumber(el, from, to, duration, fmt) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  let lastBiomeName = null;
  function updateBiomeChip() {
    const name = getBiome().name;
    const el = $("biome-val");
    if (name !== lastBiomeName) {
      lastBiomeName = name;
      el.classList.add("fade");
      AudioKit.biome(getBiome().type);
      if (gameState === "playing") toast(name.toUpperCase());
      setTimeout(() => { el.textContent = name; el.classList.remove("fade"); }, 180);
    }
  }

  const POOL_SIZE = 48, TYPES = { DIRT: "dirt", CLOUD: "cloud", SPRING: "spring", MOVE: "move" };
  let platforms = [];
  for (let i = 0; i < POOL_SIZE; i++) platforms.push({ active: false, x: 0, y: 0, w: 75, h: 18, type: TYPES.DIRT, fade: 0, used: false, hasCoin: false, coinY: 0, drift: 0, dir: 1 });

  const biomes = [
    { name: "Superfície", start: 0, end: 900, sky1: "#6ec6ff", sky2: "#bdeaff", type: 0 },
    { name: "Céu e Nuvens", start: 900, end: 2600, sky1: "#2b8fd7", sky2: "#7cc7ff", type: 1 },
    { name: "Estratosfera", start: 2600, end: 4400, sky1: "#123a6b", sky2: "#3f6fae", type: 2 },
    { name: "Espaço", start: 4400, end: 6600, sky1: "#101436", sky2: "#020610", type: 3 },
    { name: "Órbita Distante", start: 6600, end: 9000, sky1: "#050b24", sky2: "#1b1140", type: 4 },
    { name: "Paraíso", start: 9000, end: 11400, sky1: "#e88a3a", sky2: "#7b3da3", type: 5 },
    { name: "Aurora Cósmica", start: 11400, end: 14000, sky1: "#0b3d2e", sky2: "#4d1a6b", type: 6 },
    { name: "Portal Estelar", start: 14000, end: 17000, sky1: "#1a0b3d", sky2: "#ff2fb0", type: 7 },
    { name: "Além do Infinito", start: 17000, end: 999999, sky1: "#05010f", sky2: "#160029", type: 8 }
  ];
  function heightNow() { return Math.max(0, -cameraY); }
  function getBiome(h = heightNow()) { return biomes.find((b) => h >= b.start && h < b.end) || biomes[biomes.length - 1]; }
  function difficulty(h) { return Math.min(1, Math.max(0, (h - 300) / 16000)); }
  function chaseSpeedAt(h) { return 7 + Math.sqrt(Math.max(0, h)) * 1.55; }
  function pickType(h) {
    const d = difficulty(h), r = Math.random();
    const spring = 0.08, move = 0.14 + 0.08 * d, cloud = 0.18 + 0.16 * d;
    if (r < spring) return TYPES.SPRING;
    if (r < spring + move) return TYPES.MOVE;
    if (r < spring + move + cloud) return TYPES.CLOUD;
    return TYPES.DIRT;
  }
  const COIN_TYPES = {
    real1: { r: 20, label: "1", value: 100, bimetal: true, burst: ["#eec969", "#fff6d8", "#c99a3a"] },
    c50: { r: 14, label: "50", value: 50, tone: "silver", burst: ["#e6ebef", "#ffffff", "#aab4bd"] },
    c25: { r: 13, label: "25", value: 25, tone: "gold", burst: ["#eec969", "#fff2c9", "#b8903a"] },
    c10: { r: 10, label: "10", value: 10, tone: "gold", burst: ["#eec969", "#fff2c9", "#b8903a"] }
  };
  function pickCoinType() {
    const r = Math.random();
    if (r < 0.06) return "real1";
    if (r < 0.26) return "c50";
    if (r < 0.56) return "c25";
    return "c10";
  }

  let lastPlatX = W / 2;
  function spawnPlatformAt(y, h) {
    const p = platforms.find((x) => !x.active); if (!p) return;
    const d = difficulty(h);
    p.active = true; p.y = y; p.fade = 0; p.used = false; p.type = pickType(h);
    p.w = Math.max(34, 58 + Math.random() * 24 - d * 18);
    const rawX = 24 + Math.random() * (W - 48 - p.w);
    const maxReach = 185;
    const minX = Math.max(24, lastPlatX - maxReach), maxX = Math.min(W - 24 - p.w, lastPlatX + maxReach);
    p.x = Math.max(minX, Math.min(maxX, rawX));
    lastPlatX = p.x + p.w / 2;
    p.drift = p.type === TYPES.MOVE ? 55 + Math.random() * 70 : 0;
    p.dir = Math.random() < 0.5 ? 1 : -1;
    // ALTERAÇÃO: reduz a chance de moeda para 1/3 do valor original
    p.hasCoin = Math.random() < (0.1 + (fever ? 0.06 : 0));
    p.coinY = p.y - 38;
    if (p.hasCoin) p.coinType = pickCoinType();
    p.jackpot = Math.random() < 0.05;
  }
  let highestSpawnY = 0;
  function resetPlatforms() {
    platforms.forEach((p) => (p.active = false));
    const origin = -startHeight;
    highestSpawnY = origin + 600;
    const p0 = platforms[0];
    Object.assign(p0, { active: true, x: W / 2 - 48, y: origin + 620, w: 96, h: 18, type: TYPES.DIRT, fade: 0, used: false, hasCoin: false });
    lastPlatX = p0.x + p0.w / 2;
    for (let i = 0; i < 12; i++) { highestSpawnY -= 68 + Math.random() * 40; spawnPlatformAt(highestSpawnY, startHeight); }
  }
  function ensurePlatforms() {
    while (highestSpawnY > cameraY - 950) {
      const d = difficulty(heightNow());
      const gapMin = 68 + 22 * d, gapMax = 100 + 26 * d;
      highestSpawnY -= gapMin + Math.random() * (gapMax - gapMin);
      spawnPlatformAt(highestSpawnY, heightNow());
    }
  }

  let cameraY = 0, heightScore = 0, bestHeight = 0, startHeight = 0, gameState = "start", lastTime = 0, planeTimer = 1.2, umbrellaTimer = 0, objects = [], particles = [], globalTime = 0, autoCamY = 0;
  function multiplier(h = heightScore) { return 1 + h * 0.0016; }

  let keyLeft = false, keyRight = false, pointerActive = false, pointerX = 0, gyroDir = 0, gyroActive = false;

  async function requestGyroPermission() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") window.addEventListener("deviceorientation", handleOrientation);
      } catch {}
    } else if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }
  function handleOrientation(e) {
    if (e.gamma == null) return;
    gyroActive = true;
    const gamma = Math.max(-30, Math.min(30, e.gamma));
    gyroDir = Math.abs(gamma) < 2 ? 0 : gamma / 18;
  }
  canvas.addEventListener("touchstart", (e) => { pointerActive = true; pointerX = e.touches[0].clientX; }, { passive: true });
  canvas.addEventListener("touchmove", (e) => { if (pointerActive) pointerX = e.touches[0].clientX; }, { passive: true });
  canvas.addEventListener("touchend", () => { pointerActive = false; }, { passive: true });
  canvas.addEventListener("mousedown", (e) => { pointerActive = true; pointerX = e.clientX; });
  window.addEventListener("mousemove", (e) => { if (pointerActive) pointerX = e.clientX; });
  window.addEventListener("mouseup", () => { pointerActive = false; });
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keyLeft = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keyRight = true;
    if (e.repeat) return;
    if ((e.code === "Space" || e.key === "Enter") && gameState !== "playing") {
      e.preventDefault();
      requestGyroPermission();
      startGame();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keyLeft = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keyRight = false;
  });

  function formatMoney(cents) { return "R$ " + (cents / 100).toFixed(2).replace(".", ","); }
  function updateCoinUI() { $("coin-val").textContent = formatMoney(totalCoins); }

  let recordM = 0, saveLeft = 1, brokePB = false, warnT = 0, heat = 1;

  function sessionHeat() {
    heat = Math.min(8, (Number(sessionStorage.getItem("sky-heat")) || 0) + 1);
    sessionStorage.setItem("sky-heat", String(heat));
    return heat;
  }

  function startGame() {
    try { AudioKit.ready(); } catch {}
    cameraY = -startHeight;
    autoCamY = cameraY;
    player.x = W / 2; player.y = cameraY + 560; player.vx = 0; player.vy = -620; player.umbrella = false; player.squashPulse = 0; player.tilt = 0;
    heightScore = startHeight; bestHeight = startHeight; totalCoins = 0; updateCoinUI();
    particles = []; floaters = []; shake = 0; combo = 0; comboT = 0; fever = false; lastMilestone = Math.floor(startHeight / 500);
    player.magnet = 0; player.rocket = 0; powerTimer = 1.4;
    saveLeft = 1; brokePB = false; warnT = 0;
    sessionHeat();
    if (heat >= 2) toast("SEQUÊNCIA x" + heat);
    AudioKit.heat?.();
    setCombo(0);
    planeTimer = 1; umbrellaTimer = 0; objects = []; resetPlatforms(); gameState = "playing";
    const overlay = $("hub-overlay");
    if (overlay) overlay.classList.add("hidden");
    document.querySelector(".game-panel")?.classList.remove("menu", "fever-glow");
    lastTime = performance.now();
  }

  function endGame() {
    if (gameState !== "playing") return;
    gameState = "gameover";
    setCombo(0);
    document.querySelector(".game-panel")?.classList.remove("fever-glow");
    const climbed = Math.max(0, bestHeight - startHeight);
    const meters = Math.floor(bestHeight / 10);
    const heatBonus = 1 + (heat - 1) * 0.08;
    let gained = Math.round(climbed * multiplier(climbed) * heatBonus);
    const gap = recordM - meters;
    const near = !brokePB && recordM > 0 && gap > 0 && gap <= 12;
    if (near) {
      const pity = 40 + (12 - gap) * 8;
      addCoins(pity);
      gained += 80;
      AudioKit.near?.();
    } else if (brokePB) AudioKit.record?.();
    else AudioKit.fall();
    const prevPoints = points;
    points += gained;
    let hook = "Uma a mais. O céu não termina.";
    if (brokePB) hook = "Recorde novo. Agora defende.";
    else if (near) hook = "Faltaram " + gap + "m. Isso não é coincidência.";
    else if (heat >= 4) hook = "Sequência x" + heat + ". Tá quente.";
    else if (combo >= 6) hook = "O combo tava vivo. Recupera.";
    else hook = "Caiu. START. 8 segundos.";
    animateNumber($("points-display"), prevPoints, points, 650, (v) => v.toLocaleString("pt-BR") + " pts");
    animateNumber($("final-height"), 0, meters, 600, (v) => v + "m");
    animateNumber($("final-coins"), 0, totalCoins, 600, (v) => formatMoney(v));
    animateNumber($("final-points"), 0, gained, 700, (v) => "+" + v.toLocaleString("pt-BR"));
    $("hub-overlay").classList.remove("hidden");
    document.querySelector(".game-panel")?.classList.add("menu");
    if (onRunEnd) onRunEnd({ height: meters, coins: totalCoins, pointsGained: gained, skin: equippedSkin, points, pb: brokePB, near, gap, heat, hook });
  }

  function spawnPlane() {
    const b = getBiome(heightNow());
    if (b.type !== 2 && b.type !== 3) return;
    const fromLeft = Math.random() < 0.5;
    const y = cameraY + 80 + Math.random() * (H - 180);
    objects.push({ kind: "plane", x: fromLeft ? -90 : W + 90, y, w: 62, h: 25, vx: fromLeft ? 170 : -170, scale: Math.random() < 0.4 ? 1.4 : 1.1 });
  }
  function spawnUmbrella() {
    if (getBiome().type < 3) return;
    objects.push({ kind: "umbrella", x: 30 + Math.random() * (W - 60), y: cameraY + 120 + Math.random() * 360, t: 0 });
  }
  function spawnPower() {
    const kinds = ["gem", "gem", "magnet", "rocket"];
    const kind = kinds[(Math.random() * kinds.length) | 0];
    objects.push({ kind, x: 36 + Math.random() * (W - 72), y: cameraY + 90 + Math.random() * 280, t: 0 });
  }
  function updateObjects(dt) {
    globalTime += dt;
    const d = difficulty(heightNow());
    planeTimer -= dt;
    if (planeTimer <= 0) {
      if (getBiome().type === 2 || getBiome().type === 3) spawnPlane();
      planeTimer = Math.max(0.4, 1.9 - d * 1.1) + Math.random() * 0.9;
    }
    umbrellaTimer -= dt;
    if (getBiome().type >= 3 && umbrellaTimer <= 0) { spawnUmbrella(); umbrellaTimer = 3.4; }
    powerTimer -= dt;
    if (powerTimer <= 0) { spawnPower(); powerTimer = 2.4 + Math.random() * 2.2; }
    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i];
      o.t = (o.t || 0) + dt;
      if (o.kind === "plane") {
        o.x += o.vx * dt;
        if (o.x < -130 || o.x > W + 130) { objects.splice(i, 1); continue; }
        if (player.rocket > 0) continue;
        if (Math.abs(player.x - o.x) < 38 * o.scale && Math.abs(player.y - o.y) < 26 * o.scale) {
          if (player.vy < 250) player.vy = 250;
          player.vx += o.vx > 0 ? 90 : -90;
          combo = 0; setCombo(0); bumpShake(5);
        }
      } else if (o.kind === "umbrella") {
        o.y += Math.sin(o.t * 2) * 0.15;
        if (Math.hypot(player.x - o.x, player.y - o.y) < 35) {
          player.umbrella = true; player.umbrellaTimer = 1.35; AudioKit.collect();
          spawnBurst(o.x, o.y, 12, ["#ffffff", "#f04b4b", "#dee2e6"], { spread: 170, upBias: 80, life: 0.5, size: 3 });
          toast("PLANAR");
          objects.splice(i, 1);
        }
      } else {
        o.y += Math.sin(o.t * 3) * 0.2;
        if (Math.hypot(player.x - o.x, player.y - o.y) < 34) {
          if (o.kind === "rocket") {
            player.rocket = 1.15; AudioKit.rocket(); bumpShake(8); toast("FOGUETE");
            spawnBurst(o.x, o.y, 18, ["#ff7a3a", "#ffe27a", "#fff"], { spread: 240, upBias: 200, life: 0.7, size: 4 });
          } else if (o.kind === "magnet") {
            player.magnet = 7; AudioKit.magnet(); toast("ÍMÃ");
            spawnBurst(o.x, o.y, 14, ["#7ad0ff", "#fff"], { spread: 180, upBias: 80, life: 0.5, size: 3 });
          } else {
            AudioKit.gem(); addCoins(80, o.x, o.y); bumpShake(3); toast("GEMA");
            spawnBurst(o.x, o.y, 16, ["#b388ff", "#fff", "#ffe27a"], { spread: 200, upBias: 120, life: 0.55, size: 3.4 });
          }
          objects.splice(i, 1);
        }
      }
    }
  }

  function update(dt) {
    if (gameState !== "playing") return;
    let targetDir = 0;
    if (keyLeft) targetDir = -1;
    else if (keyRight) targetDir = 1;
    else if (pointerActive) {
      const r = canvas.getBoundingClientRect();
      const rx = ((pointerX - r.left) / r.width) * W;
      const diff = rx - player.x;
      targetDir = Math.abs(diff) < 3 ? 0 : Math.max(-1, Math.min(1, diff / 16));
    } else if (gyroActive) targetDir = gyroDir;
    player.inputDir = targetDir;
    const targetVx = player.inputDir * player.moveSpeed;
    player.vx += (targetVx - player.vx) * Math.min(1, dt * 16);
    player.x += player.vx * dt;
    if (player.x < -player.radius) player.x = W + player.radius;
    if (player.x > W + player.radius) player.x = -player.radius;
    const gravity = player.rocket > 0 ? 0 : (player.umbrella ? player.gravity * 0.18 : player.gravity);
    const clamp = player.umbrella ? 240 : player.fallClamp;
    if (player.rocket > 0) { player.vy = -1680; player.rocket -= dt; }
    else player.vy += gravity * dt;
    if (player.vy > clamp) player.vy = clamp;
    const prevY = player.y;
    player.y += player.vy * dt;
    if (player.vy > 0 && player.rocket <= 0) {
      for (const p of platforms) {
        if (!p.active || p.fade > 0) continue;
        const withinX = player.x + player.radius * 0.65 > p.x && player.x - player.radius * 0.65 < p.x + p.w;
        const crossed = prevY + player.radius <= p.y && player.y + player.radius >= p.y;
        if (withinX && crossed) {
          const cx = p.x + p.w / 2;
          const perfect = Math.abs(player.x - cx) < Math.max(8, p.w * 0.16);
          comboT = 1.25;
          setCombo(combo + 1);
          AudioKit.combo?.(combo);
          if (perfect) { AudioKit.perfect(); addCoins(15, player.x, p.y); floatText(player.x, p.y - 18, "PERFEITO", "#fff6c2"); bumpShake(4); }
          else bumpShake(combo >= 8 ? 3 : 1.6);
          if (p.jackpot) {
            p.jackpot = false;
            addCoins(180, player.x, p.y);
            AudioKit.jackpot?.();
            toast("JACKPOT");
            bumpShake(5);
          }
          if (p.type === TYPES.SPRING) {
            player.vy = player.jumpForce * (perfect ? 3.35 : 3);
            AudioKit.spring(); player.squashPulse = 1.3;
            spawnBurst(player.x, p.y, 16, ["#ffd43b", "#f59f00", "#ffe066"], { spread: 260, upBias: 220, life: 0.6, size: 4 });
          } else {
            player.vy = player.jumpForce * (perfect ? 1.12 : 1);
            AudioKit.jump(); player.squashPulse = 1;
            const col = p.type === TYPES.CLOUD ? ["#ffffff", "#dbe9f4"] : p.type === TYPES.MOVE ? ["#7ad0ff", "#fff"] : ["#a97c50", "#7a5a36", "#c9a06a"];
            spawnBurst(player.x, p.y, 10, col, { spread: 130, upBias: 100, life: 0.45, size: 2.8 });
            if (p.type === TYPES.CLOUD) { p.fade = 0.4; player.umbrella = false; player.umbrellaTimer = 0; }
          }
        }
      }
    }
    for (const p of platforms) {
      if (p.active && p.drift) {
        p.x += p.dir * p.drift * dt;
        if (p.x < 16) { p.x = 16; p.dir = 1; }
        if (p.x + p.w > W - 16) { p.x = W - 16 - p.w; p.dir = -1; }
      }
      if (p.active && p.hasCoin) {
        const cx = p.x + p.w / 2;
        if (player.magnet > 0) {
          const pull = Math.hypot(player.x - cx, player.y - p.coinY);
          if (pull < 160) { p.coinY += (player.y - p.coinY) * dt * 8; p.x += ((player.x - p.w / 2) - p.x) * dt * 3; }
        }
        if (Math.hypot(player.x - (p.x + p.w / 2), player.y - p.coinY) < 40) {
          const cfg = COIN_TYPES[p.coinType] || COIN_TYPES.real1;
          p.hasCoin = false; addCoins(cfg.value, p.x + p.w / 2, p.coinY); AudioKit.collect();
          spawnBurst(p.x + p.w / 2, p.coinY, 12, cfg.burst, { spread: 160, upBias: 70, life: 0.5, size: 2.8 });
        }
      }
    }
    if (player.umbrella) { player.umbrellaTimer -= dt; if (player.umbrellaTimer <= 0) player.umbrella = false; }
    if (player.magnet > 0) player.magnet -= dt;
    comboT -= dt;
    if (comboT <= 0 && combo > 0) setCombo(0);
    for (const p of platforms) if (p.fade > 0) { p.fade -= dt; if (p.fade <= 0) p.active = false; }
    const target = player.y - H * 0.55;
    if (target < cameraY) cameraY += (target - cameraY) * 0.16;
    autoCamY -= chaseSpeedAt(Math.max(0, -cameraY)) * dt;
    if (cameraY < autoCamY) autoCamY = cameraY;
    if (cameraY > autoCamY) cameraY = autoCamY;
    const climbed = Math.max(0, -cameraY);
    if (climbed > bestHeight) { bestHeight = climbed; heightScore = climbed; }
    const metersNow = Math.floor(bestHeight / 10);
    if (!brokePB && metersNow > recordM && recordM > 0 && metersNow > Math.floor(startHeight / 10)) {
      brokePB = true;
      recordM = metersNow;
      AudioKit.record?.();
      toast("NOVO RECORDE");
      bumpShake(5);
    } else if (metersNow > recordM) recordM = metersNow;
    const mile = Math.floor(bestHeight / 500);
    if (mile > lastMilestone) { lastMilestone = mile; AudioKit.fever?.(); toast(Math.floor(bestHeight / 10) + "m"); bumpShake(4); }
    ensurePlatforms();
    platforms.forEach((p) => { if (p.active && p.y > cameraY + H + 80) p.active = false; });
    updateObjects(dt);
    const tiltTarget = Math.max(-1, Math.min(1, player.vx / 260)) * 0.22;
    player.tilt += (tiltTarget - player.tilt) * Math.min(1, dt * 9);
    player.squashPulse = Math.max(0, player.squashPulse - dt * 5.2);
    updateParticles(dt);
    for (let i = floaters.length - 1; i >= 0; i--) {
      floaters[i].y -= 42 * dt; floaters[i].life -= dt;
      if (floaters[i].life <= 0) floaters.splice(i, 1);
    }
    shake = Math.max(0, shake - dt * 28);
    $("height-val").textContent = metersNow + "m";
    $("mult-val").textContent = (multiplier() * (1 + Math.min(10, combo) * 0.05) * (1 + (heat - 1) * 0.08)).toFixed(2) + "x";
    const ghost = $("ghost-chip");
    if (ghost) {
      if (recordM > 0 && metersNow < recordM) ghost.textContent = "faltam " + (recordM - metersNow) + "m";
      else if (brokePB) ghost.textContent = "recorde vivo";
      else ghost.textContent = heat >= 2 ? "seq x" + heat : "sobe";
    }
    const b = getBiome();
    const fill = $("hunt-fill");
    if (fill) fill.style.width = (Math.min(1, Math.max(0, (heightNow() - b.start) / ((b.end - b.start) || 1))) * 100).toFixed(1) + "%";
    const deathLine = cameraY + H + 45;
    const dist = deathLine - player.y;
    const danger = Math.max(0, Math.min(1, 1 - dist / 230));
    warnT -= dt;
    if (danger > 0.62 && warnT <= 0) { AudioKit.warn?.(); warnT = 0.42; }
    updateBiomeChip();
    if (player.y > deathLine && player.rocket <= 0) {
      if (saveLeft > 0 && (combo >= 3 || fever || heat >= 3)) {
        saveLeft = 0;
        player.y = cameraY + H * 0.52;
        player.vy = player.jumpForce * 1.85;
        player.squashPulse = 1.2;
        toast("SEGUNDA CHANCE");
        AudioKit.clutch?.();
        bumpShake(6);
      } else endGame();
    }
  }

  function hexToRgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function drawBackground() {
    const b = getBiome(), h = heightNow();
    const t = Math.min(1, Math.max(0, (h - b.start) / (b.end - b.start || 1)));
    const a = hexToRgb(b.sky1), c = hexToRgb(b.sky2);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgb(${a[0]},${a[1]},${a[2]})`);
    g.addColorStop(1, `rgb(${c[0]},${c[1]},${c[2]})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (b.type === 0) drawSurface();
    if (b.type === 1) drawSky();
    if (b.type === 2) drawStratosphere();
    if (b.type === 3) drawSpace();
    if (b.type === 4) drawOrbit();
    if (b.type === 5) drawParadise();
    if (b.type === 6) drawAurora();
    if (b.type === 7) drawPortal();
    if (b.type === 8) drawBeyond();
  }
  function drawStratosphere() {
    ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const x = ((i * 150 - cameraY * 0.1) % (W + 200) + W + 200) % (W + 200) - 100, y = 120 + i * 95;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 70, y - 2); ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,240,200,.15)"; ctx.beginPath(); ctx.arc(W * 0.7, H * 0.15, 90, 0, Math.PI * 2); ctx.fill();
  }
  function drawOrbit() {
    ctx.fillStyle = "rgba(255,255,255,.7)";
    for (let i = 0; i < 50; i++) {
      const x = (i * 89) % W, y = ((i * 151 - cameraY * 0.06) % (H + 40) + H + 40) % (H + 40) - 20;
      ctx.beginPath(); ctx.arc(x, y, i % 11 === 0 ? 1.6 : 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.save(); ctx.translate(W * 0.25, H * 0.3); ctx.fillStyle = "#5b3a86";
    ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(200,170,255,.5)"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, 0, 90, 20, -0.3, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  function drawAurora() {
    ctx.fillStyle = "rgba(255,255,255,.55)";
    for (let i = 0; i < 40; i++) {
      const x = (i * 101) % W, y = ((i * 173 - cameraY * 0.05) % (H + 40) + H + 40) % (H + 40) - 20;
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < 3; i++) {
      const off = (globalTime * 20 + i * 140 - cameraY * 0.03) % (H + 200);
      ctx.strokeStyle = i % 2 ? "rgba(90,255,180,.18)" : "rgba(180,90,255,.18)"; ctx.lineWidth = 26;
      ctx.beginPath(); ctx.moveTo(-30, off); ctx.quadraticCurveTo(W * 0.5, off - 70, W + 30, off + 30); ctx.stroke();
    }
  }
  function drawPortal() {
    ctx.save(); ctx.translate(W / 2, H * 0.4);
    const rot = globalTime * 0.6;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(rot * (i % 2 ? 1 : -1) * 0.15);
      ctx.strokeStyle = `rgba(${180 + i * 15},60,${255 - i * 20},.3)`; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 0, 70 + i * 26, 26 + i * 10, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.6)";
    for (let i = 0; i < 35; i++) {
      const x = (i * 113) % W, y = ((i * 167 - cameraY * 0.09) % (H + 40) + H + 40) % (H + 40) - 20;
      ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill();
    }
  }
  function drawBeyond() {
    ctx.fillStyle = "rgba(255,255,255,.5)";
    for (let i = 0; i < 60; i++) {
      const x = (i * 79) % W, y = ((i * 181 - cameraY * 0.04) % (H + 40) + H + 40) % (H + 40) - 20;
      ctx.beginPath(); ctx.arc(x, y, i % 13 === 0 ? 1.6 : 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.save(); ctx.globalAlpha = 0.15; ctx.strokeStyle = "#8b6bff"; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const s = 70 + i * 50, rot = globalTime * 0.1 * (i % 2 ? 1 : -1);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rot); ctx.strokeRect(-s, -s, s * 2, s * 2); ctx.restore();
    }
    ctx.restore();
  }
  function drawChaseZone() {
    const deathLine = cameraY + H + 45;
    const dist = deathLine - player.y;
    const danger = Math.max(0, Math.min(1, 1 - dist / 230));
    if (danger <= 0.02) return;
    const topY = H - danger * 170;
    const grad = ctx.createLinearGradient(0, topY, 0, H + 40);
    const r = Math.round(90 + danger * 165), g2 = Math.round(20 + danger * 10), b = Math.round(120 - danger * 80);
    grad.addColorStop(0, `rgba(${r},${g2},${b},0)`);
    grad.addColorStop(0.35, `rgba(${r},${g2},${b},${0.55 + danger * 0.35})`);
    grad.addColorStop(1, `rgba(${Math.max(20, r - 40)},${g2},${Math.max(10, b - 40)},.9)`);
    ctx.fillStyle = grad; ctx.fillRect(0, topY, W, H - topY + 40);
    ctx.strokeStyle = `rgba(255,${180 - danger * 140},${230 - danger * 180},${0.6 + danger * 0.4})`; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 20) {
      const wobble = Math.sin(x * 0.05 + globalTime * 4) * 6 + Math.sin(x * 0.13 + globalTime * 2.3) * 4;
      if (x === 0) ctx.moveTo(x, topY + wobble); else ctx.lineTo(x, topY + wobble);
    }
    ctx.stroke();
  }
  function drawSurface() {
    const gY = 650 - cameraY; if (gY > H + 60) return;
    ctx.fillStyle = "#4a7c3f"; ctx.fillRect(0, gY, W, Math.max(50, H - gY + 50));
    ctx.fillStyle = "#3a6132"; ctx.fillRect(0, gY, W, 7);
    ctx.fillStyle = "#8B4513"; ctx.fillRect(60, gY - 60, 12, 60);
    ctx.fillStyle = "#228B22"; ctx.beginPath(); ctx.arc(66, gY - 75, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(240, gY - 60, 75, 60);
    ctx.fillStyle = "#d93838"; ctx.beginPath(); ctx.moveTo(235, gY - 60); ctx.lineTo(275, gY - 95); ctx.lineTo(320, gY - 60); ctx.fill();
    ctx.fillStyle = "#654321"; ctx.fillRect(260, gY - 30, 15, 15);
  }
  function drawSky() {
    ctx.strokeStyle = "rgba(0,50,100,0.15)"; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const x = ((i * 130 - cameraY * 0.12) % (W + 140) + W + 140) % (W + 140) - 70, y = 170 + i * 105;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y - 4); ctx.stroke();
    }
  }
  function drawSpace() {
    ctx.fillStyle = "rgba(255,255,255,.8)";
    for (let i = 0; i < 70; i++) {
      const x = (i * 97) % W, y = ((i * 163 - cameraY * 0.08) % (H + 40) + H + 40) % (H + 40) - 20;
      ctx.beginPath(); ctx.arc(x, y, i % 9 === 0 ? 1.8 : 0.7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(110,140,255,.12)"; ctx.beginPath(); ctx.arc(W * 0.78, H * 0.25, 105, 0, Math.PI * 2); ctx.fill();
  }
  function drawParadise() {
    ctx.strokeStyle = "rgba(255,240,170,.35)"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(W / 2, H + 90, 220, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    ctx.fillStyle = "rgba(255,244,190,.5)";
    for (let i = 0; i < 22; i++) {
      const x = (i * 53) % W, y = ((i * 137 - cameraY * 0.2) % (H + 100) + H + 100) % (H + 100);
      ctx.beginPath(); ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2); ctx.fill();
    }
  }
  function drawPlatforms() {
    for (const p of platforms) {
      if (!p.active) continue;
      const sy = p.y - cameraY; if (sy < -50 || sy > H + 50) continue;
      ctx.save(); ctx.globalAlpha = p.fade > 0 ? Math.max(0, p.fade / 0.4) : 1;
      if (p.type === TYPES.DIRT) {
        ctx.fillStyle = "#6b4423"; ctx.fillRect(p.x, sy + 5, p.w, p.h - 5);
        ctx.fillStyle = "#5a3a1e"; ctx.fillRect(p.x + 6, sy + 5, p.w - 12, 8);
        ctx.fillStyle = "#2f9e44"; ctx.fillRect(p.x, sy, p.w, 8);
        ctx.fillStyle = "#37b24d"; ctx.fillRect(p.x + 8, sy + 2, p.w - 20, 3);
      } else if (p.type === TYPES.CLOUD) {
        ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.strokeStyle = "#b3c7d8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x + 18, sy + 8, 12, 0, Math.PI * 2); ctx.arc(p.x + 34, sy + 3, 16, 0, Math.PI * 2); ctx.arc(p.x + 52, sy + 8, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (p.type === TYPES.MOVE) {
        ctx.fillStyle = "#1d4f7a"; ctx.fillRect(p.x, sy + 4, p.w, p.h - 3);
        ctx.fillStyle = "#3ec6ff"; ctx.fillRect(p.x, sy, p.w, 6);
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.moveTo(p.x + 8, sy + 10); ctx.lineTo(p.x + 16, sy + 6); ctx.lineTo(p.x + 16, sy + 14); ctx.fill();
        ctx.beginPath(); ctx.moveTo(p.x + p.w - 8, sy + 10); ctx.lineTo(p.x + p.w - 16, sy + 6); ctx.lineTo(p.x + p.w - 16, sy + 14); ctx.fill();
      } else drawSpringGraphic(p, sy);
      if (p.hasCoin) drawCoin(p.x + p.w / 2, p.coinY - cameraY, p.coinType);
      if (p.jackpot) {
        ctx.strokeStyle = "rgba(255,226,122,.85)";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x - 1, sy - 3, p.w + 2, p.h + 6);
      }
      ctx.restore();
    }
  }
  function drawSpringGraphic(p, sy) {
    const cx = p.x + p.w / 2;
    ctx.fillStyle = "#6b4423"; ctx.fillRect(p.x, sy + 5, p.w, p.h - 5);
    ctx.fillStyle = "#5a3a1e"; ctx.fillRect(p.x + 6, sy + 5, p.w - 12, 8);
    ctx.fillStyle = "#2f9e44"; ctx.fillRect(p.x, sy, p.w, 8);
    ctx.fillStyle = "#37b24d"; ctx.fillRect(p.x + 8, sy + 2, p.w - 20, 3);
    const wob = Math.sin(globalTime * 4 + p.x * 0.05) * 0.4;
    const coilRX = Math.min(10, p.w * 0.18) + wob, coilRY = coilRX * 0.4;
    const rings = 3, baseY = sy - 2, topY = sy - 18, spacing = (baseY - topY) / (rings - 1);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(cx, baseY + 2, coilRX * 0.9, coilRY * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < rings; i++) {
      const cy = baseY - i * spacing;
      ctx.strokeStyle = "#232323"; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(cx, cy, coilRX, coilRY, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "#4b4b4b"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(cx, cy + 0.3, coilRX - 0.6, coilRY - 0.6, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
      ctx.strokeStyle = "#a8a8a8"; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.ellipse(cx, cy - 0.5, coilRX - 1, coilRY - 0.9, 0, Math.PI * 1.08, Math.PI * 1.82); ctx.stroke();
    }
  }
  function drawUmbrellaGraphic() {
    ctx.strokeStyle = "#8b5e34"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.quadraticCurveTo(0, 38, 8, 36); ctx.stroke();
    const colors = ["#f04b4b", "#fdfdfd"], segs = 6, r = 22, cyOff = -4;
    for (let i = 0; i < segs; i++) {
      const a0 = Math.PI + (Math.PI / segs) * i, a1 = Math.PI + (Math.PI / segs) * (i + 1);
      ctx.beginPath(); ctx.moveTo(0, cyOff); ctx.arc(0, cyOff, r, a0, a1); ctx.closePath(); ctx.fillStyle = colors[i % 2]; ctx.fill();
    }
    ctx.strokeStyle = "#c8391f"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, cyOff, r, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "#c8391f"; ctx.beginPath(); ctx.arc(0, cyOff - r, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  function goldGrad(r) {
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    g.addColorStop(0, "#fff6d8"); g.addColorStop(0.4, "#eec969"); g.addColorStop(0.75, "#c99a3a"); g.addColorStop(1, "#8f6a22"); return g;
  }
  function silverGrad(r) {
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.45, "#e6ebef"); g.addColorStop(0.8, "#bcc5cd"); g.addColorStop(1, "#8a94a0"); return g;
  }
  // ---- Moedas com a arte do coin-art.js (carregar antes do game.js) ----
  const COIN_TIER = { c10: 0, c25: 1, c50: 2, real1: 3 };
  const COIN_COUNTRIES = ["br", "co", "pe", "mx", "ar"];
  let coinCountry = "br";
  try { const sc = localStorage.getItem("skyCountry"); if (COIN_COUNTRIES.includes(sc)) coinCountry = sc; } catch (e) {}
  const coinSprites = {};
  function coinSprite(type) {
    const key = coinCountry + ":" + type;
    if (coinSprites[key]) return coinSprites[key];
    const CA = window.CoinArt; if (!CA) return null;
    const ct = CA.COUNTRIES.find((c) => c.id === coinCountry) || CA.COUNTRIES[0];
    const spec = ct.coins[COIN_TIER[type]]; if (!spec) return null;
    const mk = (side) => {
      const src = CA.faceCanvas(spec, side), c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d"); g.beginPath(); g.arc(64, 64, 62, 0, Math.PI * 2); g.clip(); g.drawImage(src, 0, 0, 128, 128); return c;
    };
    return (coinSprites[key] = { rev: mk("rev"), obv: mk("obv") });
  }
  function drawCoin(x, y, type) {
    const cfg = COIN_TYPES[type] || COIN_TYPES.real1; const r = cfg.r;
    const t = globalTime * 3; const cs = Math.cos(t); const scaleX = Math.abs(cs) * 0.7 + 0.3; const pulse = 1 + Math.sin(globalTime * 6) * 0.1;
    const spr = coinSprite(type);
    ctx.save(); ctx.translate(x, y); ctx.scale(scaleX, 1 * pulse);
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.arc(1, 3, r, 0, Math.PI * 2); ctx.fill();
    if (spr) {
      ctx.drawImage(cs >= 0 ? spr.rev : spr.obv, -r, -r, r * 2, r * 2);
    } else if (cfg.bimetal) {
      ctx.fillStyle = goldGrad(r); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      const coreR = r * 0.6; ctx.fillStyle = silverGrad(coreR); ctx.beginPath(); ctx.arc(0, 0, coreR, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = cfg.tone === "gold" ? goldGrad(r) : silverGrad(r); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.26, r * 0.15, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawObjects() {
    for (const o of objects) {
      const sy = o.y - cameraY + Math.sin((o.t || 0) * 3) * 3;
      if (o.kind === "plane") {
        ctx.save(); ctx.translate(o.x, o.y - cameraY); ctx.scale(o.vx < 0 ? -1 : 1, o.scale);
        ctx.fillStyle = "#e9ecef"; ctx.beginPath(); ctx.moveTo(-45, 0); ctx.lineTo(30, -6); ctx.lineTo(45, 0); ctx.lineTo(30, 6); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#adb5bd"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#dee2e6"; ctx.fillRect(-10, -22, 10, 45); ctx.restore();
      } else if (o.kind === "umbrella") {
        ctx.save(); ctx.translate(o.x, sy); drawUmbrellaGraphic(); ctx.restore();
      } else if (o.kind === "rocket") {
        ctx.save(); ctx.translate(o.x, sy);
        ctx.fillStyle = "#ff5a2a"; ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(8, 10); ctx.lineTo(-8, 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#ffe27a"; ctx.fillRect(-3, 10, 6, 6 + Math.sin(globalTime * 20) * 3);
        ctx.restore();
      } else if (o.kind === "magnet") {
        ctx.save(); ctx.translate(o.x, sy);
        ctx.strokeStyle = "#7ad0ff"; ctx.lineWidth = 4; ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        ctx.restore();
      } else {
        ctx.save(); ctx.translate(o.x, sy); ctx.rotate(globalTime * 2);
        ctx.fillStyle = "#c9a6ff";
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11);
          ctx.lineTo(Math.cos(a + Math.PI / 4) * 5, Math.sin(a + Math.PI / 4) * 5);
        }
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
  }
  function drawFloaters() {
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const f of floaters) {
      ctx.save(); ctx.globalAlpha = Math.max(0, f.life / 0.85);
      ctx.fillStyle = f.color; ctx.font = "800 13px Outfit, sans-serif";
      ctx.fillText(f.text, f.x, f.y - cameraY);
      ctx.restore();
    }
  }
  function drawPlayer() {
    const sy = player.y - cameraY;
    ctx.save(); ctx.translate(player.x, sy);
    const velFactor = Math.max(-1, Math.min(1, player.vy / 900));
    let bodySx = 1 - velFactor * 0.12, bodySy = 1 + velFactor * 0.12;
    if (player.squashPulse > 0) { const s = Math.min(1, player.squashPulse); bodySx = 1 + s * 0.32; bodySy = 1 - s * 0.32; }
    ctx.rotate(player.tilt); ctx.scale(bodySx, bodySy);
    if (player.magnet > 0) {
      ctx.strokeStyle = `rgba(122,208,255,${0.25 + Math.sin(globalTime * 8) * 0.15})`;
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 28 + Math.sin(globalTime * 6) * 3, 0, Math.PI * 2); ctx.stroke();
    }
    if (player.umbrella) { ctx.save(); ctx.translate(0, -46); ctx.scale(0.9, 0.9); drawUmbrellaGraphic(); ctx.restore(); }
    SkinArt.draw(ctx, equippedSkin, globalTime);
    ctx.restore();
  }
  function draw() {
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    drawBackground(); drawPlatforms(); drawParticles(); drawObjects(); drawFloaters(); drawChaseZone();
    if (fever && gameState === "playing") {
      ctx.fillStyle = "rgba(255, 180, 80, 0.06)"; ctx.fillRect(0, 0, W, H);
    }
    if (gameState === "playing" || gameState === "gameover") drawPlayer();
    else {
      ctx.save(); ctx.translate(W / 2, 430); ctx.scale(1.4, 1.4); SkinArt.draw(ctx, equippedSkin, globalTime); ctx.restore();
    }
    ctx.restore();
  }
  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    try { update(dt); draw(); } catch (err) { console.error(err); }
    requestAnimationFrame(loop);
  }

  resetPlatforms(); player.x = W / 2; player.y = 560;
  lastTime = performance.now();
  requestAnimationFrame(loop);

  return {
    setSkin(id) { equippedSkin = id; },
    setPoints(n) { points = n; const el = $("points-display"); if (el) el.textContent = n.toLocaleString("pt-BR") + " pts"; },
    onRunEnd(fn) { onRunEnd = fn; },
    play() {
      try { AudioKit.ready(); } catch {}
      try { requestGyroPermission(); } catch {}
      startGame();
    },
    setRecord(m) { recordM = Math.max(0, Math.floor(m) || 0); },
    setPhase(worldH) { startHeight = Math.max(0, worldH); },
    preview(worldH) {
      if (gameState === "playing") return;
      cameraY = -Math.max(0, worldH);
      player.y = cameraY + 430;
    },
    getPhase() { return startHeight; },
    isPlaying() { return gameState === "playing"; },
    setCoinCountry(id) { if (!COIN_COUNTRIES.includes(id)) return; coinCountry = id; try { localStorage.setItem("skyCountry", id); } catch (e) {} },
    getCoinCountry() { return coinCountry; }
  };
})();
window.Game = Game;
