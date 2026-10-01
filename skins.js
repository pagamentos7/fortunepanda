const SkinArt = (() => {
  const CATALOG = [
    { id: "panda", name: "Panda Clássico", price: 0, rarity: "origem", role: "origem", blurb: "O saltador original." },
    { id: "night-cape", name: "Capa da Meia-Noite", price: 0, rarity: "épico", role: "capa", blurb: "Capa pesada e olhos no escuro." },
    { id: "web-suit", name: "Traje da Teia", price: 0, rarity: "lendário", role: "traje", blurb: "Lentes brancas e linhas de teia." },
    { id: "gold-mask", name: "Máscara Dourada", price: 0, rarity: "raro", role: "máscara", blurb: "Meia-máscara de capa de HQ." },
    { id: "crimson-mask", name: "Máscara Carmesim", price: 0, rarity: "raro", role: "máscara", blurb: "Rosto coberto, mistério antigo." },
    { id: "iron-visor", name: "Visor de Aço", price: 0, rarity: "lendário", role: "armadura", blurb: "Capacete luminoso de placas." },
    { id: "moon-ninja", name: "Ninja Lunar", price: 0, rarity: "raro", role: "máscara", blurb: "Faixa e capuz no vento." },
    { id: "sky-knight", name: "Cavaleiro do Céu", price: 0, rarity: "mito", role: "capa", blurb: "Elmo alado e emblema no peito." },
    { id: "venom-veil", name: "Véu Sombrio", price: 0, rarity: "épico", role: "traje", blurb: "Simbiose verde-negra." },
    { id: "star-panda", name: "Panda Estelar", price: 0, rarity: "épico", role: "traje", blurb: "Viseira de órbita." },
    // Novas Skins Adicionadas
    { id: "cyber-samurai", name: "Samurai Cibernético", price: 0, rarity: "mito", role: "armadura", blurb: "Capacete néon com chifres de luz." },
    { id: "dragon-god", name: "Deus Dragão", price: 0, rarity: "mito", role: "traje", blurb: "Escamas e chifres dourados lendários." },
    { id: "frog-king", name: "Rei Sapo", price: 0, rarity: "raro", role: "traje", blurb: "Capuz anfíbio com coroa real." },
    { id: "astro-bear", name: "Urso Astronauta", price: 0, rarity: "lendário", role: "traje", blurb: "Cúpula espacial e brilho estelar." },
    { id: "fire-demon", name: "Demónio de Fogo", price: 0, rarity: "épico", role: "traje", blurb: "Chamas vivas e olhos em brasa." },
    { id: "ghost-spirit", name: "Espírito Fantasma", price: 0, rarity: "épico", role: "capa", blurb: "Manto roxo translúcido místico." },
    { id: "golden-legend", name: "Lenda de Ouro", price: 0, rarity: "mito", role: "traje", blurb: "Folheado a ouro puro reluzente." }
  ];

  function cape(ctx, t, color, length) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.quadraticCurveTo(-28, 8 + Math.sin(t * 4) * 4, -22, length);
    ctx.quadraticCurveTo(0, length + 8 + Math.sin(t * 3) * 3, 22, length);
    ctx.quadraticCurveTo(28, 8 - Math.sin(t * 4) * 4, 8, -6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function pandaFace(ctx, ear = "#111820", body = "#ffffff") {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ear;
    ctx.beginPath();
    ctx.arc(-13, -16, 7, 0, Math.PI * 2);
    ctx.arc(13, -16, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-8, -3, 5, 7, -0.2, 0, Math.PI * 2);
    ctx.ellipse(8, -3, 5, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-7, -5, 2, 0, Math.PI * 2);
    ctx.arc(8, -5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ear;
    ctx.beginPath();
    ctx.ellipse(0, 7, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(ctx, id, t) {
    if (id === "night-cape") {
      cape(ctx, t, "#0b0d14", 38);
      pandaFace(ctx, "#0b0d14", "#1a1d28");
      ctx.fillStyle = "#e8d36a";
      ctx.fillRect(-7, 4, 14, 3);
      ctx.fillStyle = "#f4f7ff";
      ctx.beginPath();
      ctx.ellipse(-7, -4, 4.2, 2.4, -0.2, 0, Math.PI * 2);
      ctx.ellipse(7, -4, 4.2, 2.4, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0b0d14";
      ctx.beginPath();
      ctx.moveTo(-16, -22); ctx.lineTo(-10, -32); ctx.lineTo(-6, -20);
      ctx.moveTo(16, -22); ctx.lineTo(10, -32); ctx.lineTo(6, -20);
      ctx.fill();
    } else if (id === "web-suit") {
      ctx.fillStyle = "#1a2a8a";
      ctx.beginPath();
      ctx.ellipse(0, 6, 16, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c81e1e";
      ctx.beginPath();
      ctx.ellipse(0, -4, 18, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(10,8,16,.55)";
      ctx.lineWidth = 1.1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.quadraticCurveTo(i * 10, 0, i * 7, 16);
        ctx.stroke();
      }
      ctx.fillStyle = "#f5f8ff";
      ctx.beginPath();
      ctx.ellipse(-7, -5, 5.5, 3.4, -0.15, 0, Math.PI * 2);
      ctx.ellipse(7, -5, 5.5, 3.4, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0b1020";
      ctx.beginPath();
      ctx.ellipse(-7, -5, 2.2, 2.6, 0, 0, Math.PI * 2);
      ctx.ellipse(7, -5, 2.2, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === "gold-mask") {
      pandaFace(ctx);
      ctx.fillStyle = "#d7b056";
      ctx.beginPath();
      ctx.moveTo(-16, -2);
      ctx.quadraticCurveTo(0, -16, 16, -2);
      ctx.quadraticCurveTo(12, 6, 0, 4);
      ctx.quadraticCurveTo(-12, 6, -16, -2);
      ctx.fill();
      ctx.fillStyle = "#1a1208";
      ctx.beginPath();
      ctx.ellipse(-6, -2, 3.2, 2, 0, 0, Math.PI * 2);
      ctx.ellipse(6, -2, 3.2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === "crimson-mask") {
      cape(ctx, t, "#7a1824", 28);
      pandaFace(ctx, "#3a0d14", "#f0e6dc");
      ctx.fillStyle = "#9b1c2a";
      ctx.beginPath();
      ctx.ellipse(0, -2, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a080c";
      ctx.beginPath();
      ctx.ellipse(-6, -3, 3.4, 2.2, 0, 0, Math.PI * 2);
      ctx.ellipse(6, -3, 3.4, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === "iron-visor") {
      ctx.fillStyle = "#8a93a3";
      ctx.beginPath();
      ctx.ellipse(0, 2, 18, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c9d2de";
      ctx.beginPath();
      ctx.ellipse(0, -6, 16, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3ec7ff";
      ctx.fillRect(-12, -6, 24, 5);
      ctx.fillStyle = "#d4a24a";
      ctx.fillRect(-3, 6, 6, 8);
    } else if (id === "moon-ninja") {
      pandaFace(ctx, "#111018", "#2a2833");
      ctx.fillStyle = "#16141c";
      ctx.fillRect(-16, -8, 32, 8);
      ctx.fillStyle = "#e8e4da";
      ctx.fillRect(-14, -6, 10, 4);
      ctx.fillRect(4, -6, 10, 4);
    } else if (id === "sky-knight") {
      cape(ctx, t, "#2a1a4a", 40);
      pandaFace(ctx, "#241834", "#efe7d6");
      ctx.fillStyle = "#c9b37a";
      ctx.beginPath();
      ctx.moveTo(-14, -18); ctx.lineTo(-22, -30); ctx.lineTo(-6, -20);
      ctx.moveTo(14, -18); ctx.lineTo(22, -30); ctx.lineTo(6, -20);
      ctx.fill();
      ctx.fillStyle = "#6e4ad1";
      ctx.beginPath();
      ctx.moveTo(0, 2); ctx.lineTo(5, 10); ctx.lineTo(0, 8); ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.fill();
    } else if (id === "venom-veil") {
      ctx.fillStyle = "#101410";
      ctx.beginPath();
      ctx.ellipse(0, 2, 20, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3dba4a";
      ctx.beginPath();
      ctx.moveTo(-4, 8); ctx.quadraticCurveTo(0, 26, 6, 10); ctx.lineTo(-4, 8);
      ctx.fill();
      ctx.fillStyle = "#f4f7ff";
      ctx.beginPath();
      ctx.ellipse(-7, -4, 5, 3.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(7, -4, 5, 3.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === "star-panda") {
      ctx.fillStyle = "#cfd8e6";
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      pandaFace(ctx);
      ctx.strokeStyle = "#7aa0d4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -2, 14, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.fillStyle = "#3d7ad6";
      ctx.fillRect(12, 2, 6, 10);
    } else if (id === "cyber-samurai") {
      pandaFace(ctx, "#0d1b2a", "#1b263b");
      ctx.fillStyle = "#e0e1dd";
      ctx.fillRect(-14, -12, 28, 6);
      ctx.fillStyle = "#00f5d4";
      ctx.fillRect(-10, -10, 20, 2);
      ctx.fillStyle = "#7b2cbf";
      ctx.beginPath();
      ctx.moveTo(-12, -12); ctx.lineTo(-18, -26); ctx.lineTo(-8, -14);
      ctx.moveTo(12, -12); ctx.lineTo(18, -26); ctx.lineTo(8, -14);
      ctx.fill();
    } else if (id === "dragon-god") {
      pandaFace(ctx, "#3a0007", "#ffb703");
      ctx.fillStyle = "#d00000";
      ctx.beginPath();
      ctx.ellipse(0, -2, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffb703";
      ctx.beginPath();
      ctx.moveTo(-10, -14); ctx.lineTo(-20, -32); ctx.lineTo(-4, -18);
      ctx.moveTo(10, -14); ctx.lineTo(20, -32); ctx.lineTo(4, -18);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillRect(-6, -4, 3, 3);
      ctx.fillRect(3, -4, 3, 3);
    } else if (id === "frog-king") {
      pandaFace(ctx, "#1b4332", "#52b788");
      ctx.fillStyle = "#d4af37";
      ctx.beginPath();
      ctx.moveTo(-10, -18); ctx.lineTo(-12, -28); ctx.lineTo(-5, -20);
      ctx.lineTo(0, -29); ctx.lineTo(5, -20); ctx.lineTo(12, -28); ctx.lineTo(10, -18);
      ctx.closePath();
      ctx.fill();
    } else if (id === "astro-bear") {
      pandaFace(ctx, "#1d3557", "#f1faee");
      ctx.strokeStyle = "rgba(69, 123, 157, 0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.ellipse(-6, -8, 8, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === "fire-demon") {
      pandaFace(ctx, "#370617", "#dc2f02");
      ctx.fillStyle = "#ffba08";
      ctx.beginPath();
      ctx.arc(-7, -4, 3, 0, Math.PI * 2);
      ctx.arc(7, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      const fireY = Math.sin(t * 8) * 3;
      ctx.fillStyle = "#f48c06";
      ctx.beginPath();
      ctx.moveTo(-12, -16); ctx.lineTo(-16, -30 + fireY); ctx.lineTo(-6, -20);
      ctx.moveTo(12, -16); ctx.lineTo(16, -30 - fireY); ctx.lineTo(6, -20);
      ctx.fill();
    } else if (id === "ghost-spirit") {
      ctx.save();
      ctx.globalAlpha = 0.85;
      cape(ctx, t, "#3c096c", 36);
      pandaFace(ctx, "#10002b", "#e0aaff");
      ctx.fillStyle = "#7b2cbf";
      ctx.beginPath();
      ctx.arc(-7, -4, 4, 0, Math.PI * 2);
      ctx.arc(7, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (id === "golden-legend") {
      pandaFace(ctx, "#785109", "#ffd700");
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.ellipse(-5, -6, 6, 3, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      pandaFace(ctx);
    }
  }

  function paintThumb(canvas, id) {
    const c = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    c.clearRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1c1730");
    g.addColorStop(1, "#0a0814");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.save();
    c.translate(w / 2, h * 0.58);
    c.scale(w / 56, w / 56);
    draw(c, id, performance.now() / 400);
    c.restore();
  }

  return { CATALOG, draw, paintThumb };
})();
