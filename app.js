const Hub = (() => {
  const PHASES = [
    { name: "Superfície", start: 0 },
    { name: "Céu e Nuvens", start: 900 },
    { name: "Estratosfera", start: 2600 },
    { name: "Espaço", start: 4400 },
    { name: "Órbita Distante", start: 6600 },
    { name: "Paraíso", start: 9000 },
    { name: "Aurora Cósmica", start: 11400 },
    { name: "Portal Estelar", start: 14000 },
    { name: "Além do Infinito", start: 17000 }
  ];

  const state = {
    player: null,
    skins: SkinArt.CATALOG,
    biomes: [],
    phase: 0
  };

  const API_ROOT = "";

  // Configuração do Supabase (vinda do Fortune Panda)
  const SUPABASE_URL = window.SITE_CONFIG?.SUPABASE_URL || '';
  const SUPABASE_KEY = window.SITE_CONFIG?.SUPABASE_KEY || '';

  async function api(path, body) {
    const url = API_ROOT + path;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    try {
      const res = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw Object.assign(new Error(err.error || "fail"), err);
      }
      return res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function localPlayer(name) {
    // PEGA O SALDO REAL DO FORTUNE PANDA
    const saldoReal = parseFloat(localStorage.getItem('fortune_panda_saldo')) || 0;
    
    return {
      id: localStorage.getItem("sky-id") || ("local-" + Date.now()),
      name: name || "Saltador",
      points: 1240,
      coins: Math.round(saldoReal * 100), // converte reais para centavos
      ownedSkins: SkinArt.CATALOG.map((s) => s.id),
      equipped: "panda",
      bestHeight: Number(localStorage.getItem("sky-best") || 0),
      runs: 0
    };
  }

  function money(cents) {
    return "R$ " + (cents / 100).toFixed(2).replace(".", ",");
  }

  function phaseName() {
    return PHASES.find((p) => p.start === state.phase)?.name || "Superfície";
  }

  function paintHud() {
    const p = state.player;
    if (!p) return;
    document.getElementById("wallet-coins").textContent = money(p.coins);
    document.getElementById("wallet-best").textContent = p.bestHeight + "m";
    document.getElementById("player-name").value = p.name;
    document.getElementById("hub-phase-label").textContent = "Fase: " + phaseName();
    Game.setPoints(p.points);
    Game.setSkin(p.equipped);
    Game.setRecord?.(p.bestHeight);
    const cap = document.getElementById("poster-cap");
    if (cap) cap.textContent = (state.skins.find((s) => s.id === p.equipped) || {}).name || "Panda";
  }

  function renderSkins() {
    const box = document.getElementById("skin-grid");
    box.innerHTML = "";
    state.skins.forEach((s, i) => {
      const eq = state.player.equipped === s.id;
      const btn = document.createElement("button");
      btn.className = "skin-card owned" + (eq ? " eq" : "");
      btn.style.setProperty("--i", i);
      btn.innerHTML = `<div class="thumb"><canvas width="128" height="128"></canvas></div>
        <div><b>${s.name}</b><div class="meta">${s.rarity} · ${s.role}</div></div>
        <div class="price">${eq ? "em uso" : "grátis"}</div>`;
      SkinArt.paintThumb(btn.querySelector("canvas"), s.id);
      btn.onclick = () => pickSkin(s);
      box.appendChild(btn);
    });
  }

  function renderPhases() {
    const best = state.player?.bestHeight || 0;
    document.getElementById("phase-list").innerHTML = PHASES.map((ph, i) => {
      const need = Math.floor(ph.start / 10);
      const lock = best < need;
      const on = state.phase === ph.start;
      return `<button type="button" class="phase-btn${on ? " on" : ""}${lock ? " lock" : ""}" style="--i:${i}" data-start="${ph.start}" ${lock ? "disabled" : ""}>
        <b>${ph.name}</b>
        <small>${lock ? "Abre com " + need + "m" : "Começa aos " + need + "m"}</small>
      </button>`;
    }).join("");
    document.querySelectorAll(".phase-btn").forEach((btn) => {
      btn.onclick = () => {
        if (btn.disabled) return;
        state.phase = Number(btn.dataset.start);
        Game.setPhase(state.phase);
        Game.preview(state.phase);
        AudioKit.biome(PHASES.findIndex((p) => p.start === state.phase));
        paintHud();
        renderPhases();
        closeSheets();
      };
    });
  }

  function renderWorld() {
    document.getElementById("world-list").innerHTML = state.biomes.map((b, i) =>
      `<article class="biome-card" style="--i:${i}"><strong>${b.name}</strong><span>${b.copy}</span></article>`
    ).join("");
  }

  async function renderRanks() {
    const { board } = await api("/api/leaderboard");
    document.getElementById("ranks").innerHTML = board.map((r, i) =>
      `<div class="rank" style="--i:${i}"><span class="n">${r.rank}</span><div><b>${r.name}</b><div class="meta">${r.equipped}</div></div><b>${r.bestHeight}m</b></div>`
    ).join("") || "<p class='lede'>Ninguém subiu ainda.</p>";
  }

  // FUNÇÃO PARA ATUALIZAR O SALDO REAL NO SUPABASE
  async function atualizarSaldoReal(ganhoCentavos) {
    if (ganhoCentavos <= 0) return;
    
    try {
      // Pega o usuário do Fortune Panda
      const userData = JSON.parse(localStorage.getItem('fortune_panda_user') || '{}');
      const userId = userData?.id;
      
      if (!userId) {
        console.warn('Usuário do Fortune Panda não encontrado');
        return;
      }

      // Calcula o novo saldo
      const saldoAtual = parseFloat(localStorage.getItem('fortune_panda_saldo')) || 0;
      const ganhoReais = ganhoCentavos / 100;
      const novoSaldo = saldoAtual + ganhoReais;

      // Atualiza no localStorage
      localStorage.setItem('fortune_panda_saldo', String(novoSaldo));

      // Se tiver Supabase configurado, atualiza lá também
      if (SUPABASE_URL && SUPABASE_KEY) {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${userId}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ saldo: novoSaldo })
        });

        if (!response.ok) {
          console.error('Erro ao atualizar saldo no Supabase:', await response.text());
        } else {
          console.log('✅ Saldo atualizado no Supabase:', novoSaldo);
        }
      }

      return novoSaldo;
    } catch (err) {
      console.error('Erro ao atualizar saldo real:', err);
    }
  }

  async function pickSkin(s) {
    AudioKit.ui();
    Game.setSkin(s.id);
    document.getElementById("poster-cap").textContent = s.name;
    document.getElementById("poster-cap").classList.add("flash");
    setTimeout(() => document.getElementById("poster-cap")?.classList.remove("flash"), 400);
    AudioKit.sting(s.role === "capa" ? "capa" : s.id === "web-suit" ? "teia" : "mask");
    try {
      const { player } = await api("/api/equip", { id: state.player.id, skinId: s.id });
      state.player = player;
      AudioKit.equip();
      paintHud();
      renderSkins();
    } catch {
      state.player.equipped = s.id;
      paintHud();
      renderSkins();
    }
  }

  function closeSheets() {
    document.querySelectorAll(".sheet").forEach((s) => {
      s.classList.add("hidden");
      s.hidden = true;
    });
    document.getElementById("hub-home").style.display = "";
    spinPoster(false);
  }

  function openSheet(id) {
    AudioKit.whoosh();
    closeSheets();
    document.getElementById("hub-home").style.display = "none";
    const el = document.getElementById("sheet-" + id);
    el.classList.remove("hidden");
    el.hidden = false;
    if (id === "fases") renderPhases();
    if (id === "ranks") renderRanks();
    if (id === "skins") { renderSkins(); spinPoster(true); }
  }

  function showResult(run) {
    const title = document.getElementById("hub-title");
    const hook = document.getElementById("hook-copy");
    title.textContent = run?.pb ? "Novo recorde" : "Você caiu";
    if (hook) hook.textContent = run?.hook || "Uma a mais.";
    document.getElementById("hub-results").classList.remove("hidden");
    document.getElementById("start-btn").textContent = "MAIS UMA";
    closeSheets();
  }

  let posterRaf = 0;
  let posterOn = false;
  function paintPoster(t) {
    const c = document.getElementById("poster-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    ctx.fillStyle = "#0a0812";
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h * 0.5, h * 0.7);
    g.addColorStop(0, "#2a1d12");
    g.addColorStop(1, "#07060d");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h * 0.62);
    ctx.scale(2.4, 2.4);
    ctx.rotate(Math.sin((t || 0) / 900) * 0.08);
    SkinArt.draw(ctx, state.player?.equipped || "panda", (t || 0) / 400);
    ctx.restore();
  }
  function spinPoster(on) {
    posterOn = on;
    if (!on) { if (posterRaf) cancelAnimationFrame(posterRaf); posterRaf = 0; paintPoster(0); return; }
    const tick = (t) => {
      if (!posterOn) return;
      paintPoster(t);
      posterRaf = requestAnimationFrame(tick);
    };
    posterRaf = requestAnimationFrame(tick);
  }

  async function boot() {
    const name = localStorage.getItem("sky-name") || "Saltador";
    
    // PEGA O SALDO REAL DO FORTUNE PANDA
    const saldoReal = parseFloat(localStorage.getItem('fortune_panda_saldo')) || 0;
    
    try {
      const cat = await api("/api/catalog");
      state.skins = cat.skins;
      state.biomes = cat.biomes;
    } catch {
      state.skins = SkinArt.CATALOG;
      state.biomes = PHASES.map((p, i) => ({ id: i, name: p.name, copy: "Bioma " + p.name }));
    }
    renderWorld();
    try {
      const id = localStorage.getItem("sky-id");
      const { player } = await api("/api/session", { id, name });
      state.player = player;
      // SOBRESCREVE O SALDO COM O SALDO REAL
      state.player.coins = Math.round(saldoReal * 100);
      localStorage.setItem("sky-id", player.id);
    } catch {
      state.player = localPlayer(name);
      // SOBRESCREVE O SALDO COM O SALDO REAL
      state.player.coins = Math.round(saldoReal * 100);
      localStorage.setItem("sky-id", state.player.id);
    }
    paintHud();
    renderSkins();
    spinPoster();
    const title = document.getElementById("hub-title");
    if (title && title.textContent === "Servidor off") title.textContent = "Sky Climb";
    
    Game.onRunEnd(async (run) => {
      showResult(run);
      
      // ATUALIZA O SALDO REAL
      const ganhoCentavos = run.coins || 0;
      await atualizarSaldoReal(ganhoCentavos);
      
      try {
        const { player: p } = await api("/api/run", { id: state.player.id, ...run });
        state.player = p;
        // Atualiza o saldo do player com o saldo real (já atualizado)
        const saldoAtualizado = parseFloat(localStorage.getItem('fortune_panda_saldo')) || 0;
        state.player.coins = Math.round(saldoAtualizado * 100);
      } catch {
        state.player.coins += run.coins || 0;
        state.player.points += run.pointsGained || 0;
        if (run.height > state.player.bestHeight) state.player.bestHeight = run.height;
        localStorage.setItem("sky-best", String(state.player.bestHeight));
      }
      paintHud();
    });
  }

  function bindUI() {
    document.getElementById("player-name").onchange = async (e) => {
      const name = e.target.value.trim().slice(0, 18) || "Saltador";
      localStorage.setItem("sky-name", name);
      if (!state.player) return;
      try {
        const { player } = await api("/api/session", { id: state.player.id, name });
        state.player = player;
      } catch { state.player.name = name; }
    };
    document.querySelectorAll("[data-sheet]").forEach((b) => {
      b.onclick = () => openSheet(b.dataset.sheet);
    });
    document.querySelectorAll("[data-back]").forEach((b) => {
      b.onclick = () => { AudioKit.ui(); closeSheets(); };
    });
    document.getElementById("sound-toggle").onclick = () => {
      AudioKit.setMuted(!AudioKit.isMuted());
      const muted = AudioKit.isMuted();
      document.getElementById("sound-toggle").classList.toggle("is-muted", muted);
      document.getElementById("sound-label").textContent = muted ? "Mudo" : "Som";
    };
    document.getElementById("start-btn").onclick = () => {
      window.Sky.play();
    };
  }

  bindUI();
  state.player = localPlayer(localStorage.getItem("sky-name") || "Saltador");
  state.skins = SkinArt.CATALOG;
  state.biomes = PHASES.map((p, i) => ({ id: i, name: p.name, copy: p.name }));

  window.Sky = {
    play() {
      try { AudioKit.ready(); } catch {}
      spinPoster(false);
      if (!state.player) state.player = localPlayer("Saltador");
      Game.setPhase(state.phase);
      Game.play();
    },
    open(id) { openSheet(id); },
    back() { closeSheets(); }
  };

  boot().catch((err) => {
    console.error(err);
    try { renderWorld(); paintHud(); renderSkins(); } catch {}
    const t = document.getElementById("hub-title");
    if (t) t.textContent = "Sky Climb";
  });

  return { showResult, openSheet };
})();