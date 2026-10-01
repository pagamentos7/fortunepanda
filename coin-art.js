// ==========================================
// SISTEMA DE MOEDAS CARTOON (TAMANHO DUPLO)
// ==========================================

// --- CONFIGURAÇÃO DAS MOEDAS POR PAÍS (RAIOS DOBRADOS) ---
const COUNTRY_COINS = {
  br: {
    real1: { r: 40, label: '1', value: 100, bimetal: true, burst: ['#eec969', '#fff6d8', '#c99a3a'] },
    c50:   { r: 28, label: '50', value: 50, tone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    c25:   { r: 26, label: '25', value: 25, tone: 'gold', burst: ['#eec969', '#fff2c9', '#b8903a'] },
    c10:   { r: 20, label: '10', value: 10, tone: 'gold', burst: ['#eec969', '#fff2c9', '#b8903a'] }
  },
  co: {
    cop1000: { r: 40, label: '1000', value: 100000, bimetal: true, innerTone: 'silver', outerTone: 'gold', burst: ['#eec969', '#fff6d8', '#c99a3a'] },
    cop500:  { r: 32, label: '500', value: 50000, bimetal: true, innerTone: 'gold', outerTone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    cop200:  { r: 26, label: '200', value: 20000, tone: 'silver', shape: 'dodecagon', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    cop100:  { r: 22, label: '100', value: 10000, tone: 'copper', burst: ['#e8a87c', '#f2c4a5', '#b86d43'] }
  },
  pe: {
    sol5:   { r: 40, label: '5', value: 500, bimetal: true, burst: ['#eec969', '#fff6d8', '#c99a3a'] },
    sol2:   { r: 34, label: '2', value: 200, bimetal: true, burst: ['#eec969', '#fff6d8', '#c99a3a'] },
    sol1:   { r: 28, label: '1', value: 100, tone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    sol50c: { r: 22, label: '50', value: 50, tone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] }
  },
  mx: {
    mxn10: { r: 40, label: '10', value: 1000, bimetal: true, burst: ['#eec969', '#fff6d8', '#c99a3a'] },
    mxn5:  { r: 32, label: '5', value: 500, bimetal: true, innerTone: 'gold', outerTone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    mxn2:  { r: 26, label: '2', value: 200, bimetal: true, innerTone: 'gold', outerTone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    mxn1:  { r: 22, label: '1', value: 100, bimetal: true, innerTone: 'gold', outerTone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] }
  },
  ar: {
    ars10: { r: 38, label: '10', value: 1000, tone: 'gold', burst: ['#eec969', '#fff2c9', '#b8903a'] },
    ars5:  { r: 32, label: '5', value: 500, tone: 'silver', burst: ['#e6ebef', '#ffffff', '#aab4bd'] },
    ars2:  { r: 26, label: '2', value: 200, tone: 'gold', burst: ['#eec969', '#fff2c9', '#b8903a'] },
    ars1:  { r: 22, label: '1', value: 100, tone: 'copper', burst: ['#e8a87c', '#f2c4a5', '#b86d43'] }
  }
};

// --- GRADIENTES METÁLICOS CARTOON ---
function goldGrad(ctx, r) {
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, '#fff6d8');
  g.addColorStop(0.4, '#eec969');
  g.addColorStop(0.75, '#c99a3a');
  g.addColorStop(1, '#8f6a22');
  return g;
}

function silverGrad(ctx, r) {
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.45, '#e6ebef');
  g.addColorStop(0.8, '#bcc5cd');
  g.addColorStop(1, '#8a94a0');
  return g;
}

function copperGrad(ctx, r) {
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, '#f8cca8');
  g.addColorStop(0.45, '#e8a87c');
  g.addColorStop(0.8, '#c4794d');
  g.addColorStop(1, '#8c4a25');
  return g;
}

function getGradByTone(ctx, tone, r) {
  if (tone === 'silver') return silverGrad(ctx, r);
  if (tone === 'copper') return copperGrad(ctx, r);
  return goldGrad(ctx, r);
}

// --- DESENHO DE FORMAS ESPECIAIS (EX: MOEDAS POLIGONAIS) ---
function pathPoly(ctx, r, sides) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// --- SORTEIO DA MOEDA COM BASE NO PAÍS SELECIONADO ---
function pickCoinType(country = 'br') {
  const coins = COUNTRY_COINS[country] || COUNTRY_COINS.br;
  const keys = Object.keys(coins);
  const r = Math.random();

  if (r < 0.08) return keys[0]; // moeda mais valiosa
  if (r < 0.28) return keys[1];
  if (r < 0.58) return keys[2];
  return keys[3] || keys[keys.length - 1];
}

// --- DESENHO DA MOEDA (COM GIRO 3D E NÍVEL DE DETALHE CARTOON) ---
function drawCoin(ctx, x, y, type, country = 'br', globalTime = Date.now() / 1000) {
  const countryData = COUNTRY_COINS[country] || COUNTRY_COINS.br;
  const cfg = countryData[type] || countryData[Object.keys(countryData)[0]];

  const r = cfg.r;
  const t = globalTime * 3;
  const scaleX = Math.abs(Math.cos(t)) * 0.7 + 0.3;
  const pulse = 1 + Math.sin(globalTime * 6) * 0.1;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleX, 1 * pulse);

  // Sombra cartoon
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.arc(2, 5, r, 0, Math.PI * 2);
  ctx.fill();

  if (cfg.bimetal) {
    const outerTone = cfg.outerTone || 'gold';
    const innerTone = cfg.innerTone || 'silver';

    // Anel externo
    ctx.fillStyle = getGradByTone(ctx, outerTone, r);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo interno
    const coreR = r * 0.62;
    ctx.fillStyle = getGradByTone(ctx, innerTone, coreR);
    ctx.beginPath();
    ctx.arc(0, 0, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Bordas de relevo
    ctx.strokeStyle = 'rgba(0,0,0,.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, coreR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,0,0,.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r - 1.5, 0, Math.PI * 2);
    ctx.stroke();

    if (scaleX > 0.55) {
      ctx.fillStyle = innerTone === 'gold' ? '#7a5c22' : '#515861';
      ctx.font = `bold ${Math.round(coreR * 1.1)}px Space Grotesk, Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cfg.label, 0, 1);
    }
  } else {
    // Moeda simples ou poligonal
    ctx.fillStyle = getGradByTone(ctx, cfg.tone || 'gold', r);
    if (cfg.shape === 'dodecagon') {
      pathPoly(ctx, r, 12);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,.22)';
    ctx.lineWidth = 1;
    if (cfg.shape === 'dodecagon') pathPoly(ctx, r - 1.5, 12);
    else { ctx.beginPath(); ctx.arc(0, 0, r - 1.5, 0, Math.PI * 2); }
    ctx.stroke();

    if (scaleX > 0.55) {
      const isGold = cfg.tone === 'gold';
      const isCopper = cfg.tone === 'copper';
      ctx.fillStyle = isGold ? '#7a5c22' : (isCopper ? '#5c2d12' : '#515861');
      ctx.font = `bold ${Math.round(r * 0.8)}px Space Grotesk, Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cfg.label, 0, 1);
    }
  }

  // Brilho superior em arco
  ctx.fillStyle = 'rgba(255,255,255,.65)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.28, r * 0.16, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Halo luminoso em volta da moeda
  const glowColor = (cfg.tone === 'silver' || cfg.innerTone === 'silver') 
    ? `rgba(200,215,225,${0.22 + 0.1 * Math.sin(globalTime * 4)})` 
    : `rgba(230,190,90,${0.2 + 0.1 * Math.sin(globalTime * 4)})`;

  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
}

// --- FORMATAÇÃO MONETÁRIA POR PAÍS ---
function formatMoney(cents, country = 'br') {
  const val = cents / 100;
  switch (country) {
    case 'co':
      return '$ ' + Math.round(val).toLocaleString('pt-BR');
    case 'pe':
      return 'S/ ' + val.toFixed(2).replace('.', ',');
    case 'mx':
      return '$ ' + val.toFixed(2).replace('.', ',');
    case 'ar':
      return '$ ' + val.toFixed(2).replace('.', ',');
    case 'br':
    default:
      return 'R$ ' + val.toFixed(2).replace('.', ',');
  }
}
