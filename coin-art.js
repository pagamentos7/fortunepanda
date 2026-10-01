(function () {
  'use strict';
  var TAU = Math.PI * 2;

  var PAL = {
    gold:   { base: '#c9a24a', hi: '#ecd38c', lo: '#6f531a' },
    gold2:  { base: '#b58f3c', hi: '#dcbc6a', lo: '#65491a' },
    bronze: { base: '#bd8c45', hi: '#e6c07a', lo: '#6e4e1b' },
    copper: { base: '#b8744c', hi: '#e6a577', lo: '#6a3a22' },
    silver: { base: '#bcc2c8', hi: '#f1f4f6', lo: '#656c74' }
  };

  /* ---------- Dados das moedas ---------- */
  var COUNTRIES = [
    {
      id: 'br', name: 'Brasil',
      coins: [
        { fam: '2ª família', v: '10', unit: 'CENTAVOS', d: 20, t: 2.23, w: '4,80 g', mat: 'Aço revestido de bronze', ring: 'bronze',
          edge: 'reeded', edgeLabel: 'Serrilhado', ap: [],
          obv: 'brObv', head: { k: 'M', x: 0.2, y: 0.02, s: 0.5, flip: true, opt: 'sideburn' }, rev: 'brRevDiag',
          dA: 'Efígie de D. Pedro I e a palavra BRASIL (a cena da Independência foi omitida)',
          dB: 'Valor com linhas diagonais ao fundo e CENTAVOS' },
        { fam: '2ª família', v: '25', unit: 'CENTAVOS', d: 25, t: 2.25, w: '7,55 g', mat: 'Aço revestido de bronze', ring: 'bronze',
          edge: 'reeded', edgeLabel: 'Serrilhado', ap: [],
          obv: 'brObv', head: { k: 'M', x: 0.2, y: 0.02, s: 0.5, flip: true, opt: 'mustache' }, rev: 'brRevDiag',
          dA: 'Efígie de Deodoro da Fonseca e BRASIL (as Armas Nacionais foram omitidas)',
          dB: 'Valor com linhas diagonais ao fundo e CENTAVOS' },
        { fam: '2ª família', v: '50', unit: 'CENTAVOS', d: 23, t: 2.85, w: '7,81 g', mat: 'Aço inoxidável', ring: 'silver',
          edge: 'text', edgeText: '* ORDEM E PROGRESSO * BRASIL ', edgeLabel: 'Legenda "ORDEM E PROGRESSO • BRASIL"', ap: [],
          obv: 'brObvRB', head: { k: 'M', x: 0.3, y: 0.1, s: 0.56, flip: true, opt: 'mustache' }, rev: 'brRev50',
          dA: 'Busto do Barão do Rio Branco, BRASIL, mapa em relevo e linhas diagonais',
          dB: 'Valor 50 com linhas ao fundo, esfera com faixa e estrelas, CENTAVOS, fita e ano 2002' },
        { fam: '2ª família', v: '1', unit: 'REAL', d: 27, t: 1.95, w: '7,00 g', mat: 'Núcleo de aço inoxidável e anel de aço revestido de bronze', ring: 'bronze', core: 'silver', coreRatio: 0.63,
          edge: 'interrupted', edgeLabel: 'Serrilha intermitente', ap: ['t'],
          obv: 'brObv', head: { k: 'F', x: 0.3, y: 0.0, s: 0.5, flip: true }, marajoara: true, rev: 'brRev1',
          dA: 'Efígie da República à direita do núcleo, avançando sobre o anel dourado, com grafismo marajoara e BRASIL',
          dB: '1 grande com linhas, esfera com faixa e estrelas, REAL, ano 2027 e grafismo marajoara no anel' }
      ]
    },
    {
      id: 'co', name: 'Colômbia',
      coins: [
        { v: '100', unit: 'PESOS', d: 20.3, t: 1.5, w: '3,34 g', mat: 'Metal dourado', ring: 'gold',
          edge: 'plain', edgeLabel: 'Liso', ap: ['mat', 'color'],
          obv: 'coObv', animal: 'frailejon', name: 'FRAILEJÓN', rev: 'coRev',
          dA: 'Frailejón (planta andina) com linhas finas ao fundo',
          dB: 'REPÚBLICA DE COLOMBIA, valor e PESOS' },
        { v: '200', unit: 'PESOS', d: 22.4, t: 1.6, w: '4,61 g', mat: 'Alpaca (cobre, zinco e níquel)', ring: 'silver',
          edge: 'text', edgeText: '200 PESOS * ', edgeReps: 2, edgeLabel: 'Legenda "200 PESOS" duas vezes, separada por estrelas', ap: [],
          obv: 'coObv', animal: 'guacamaya', name: 'GUACAMAYA BANDERA', rev: 'coRev',
          dA: 'Guacamaia-vermelha sobre um galho',
          dB: 'REPÚBLICA DE COLOMBIA, valor e PESOS' },
        { v: '500', unit: 'PESOS', d: 23.7, t: 2.2, w: '7,14 g', mat: 'Bimetálica: anel de alpaca, núcleo de cobre-alumínio-níquel', ring: 'silver', core: 'gold', coreRatio: 0.717,
          edge: 'interrupted', edgeLabel: 'Estriado descontínuo (8 setores lisos e 8 estriados)', ap: [],
          obv: 'coObv', animal: 'rana', name: 'RANA DE CRISTAL', rev: 'coRev',
          dA: 'Rã-de-vidro à esquerda, passando do núcleo para o anel, com ondas de água',
          dB: 'REPÚBLICA DE COLOMBIA, valor e PESOS' },
        { v: '1000', unit: 'PESOS', d: 26.7, t: 2.2, w: '9,95 g', mat: 'Bimetálica: núcleo de alpaca branca, anel de alpaca amarela', ring: 'gold', core: 'silver', coreRatio: 0.655,
          edge: 'canalreeded', edgeLabel: 'Com canal central e estrias nas bordas', ap: [],
          obv: 'coObv', animal: 'tortuga', name: 'TORTUGA CAGUAMA', rev: 'coRev',
          dA: 'Tartaruga-cabeçuda à esquerda, passando do núcleo para o anel, com ondas',
          dB: 'REPÚBLICA DE COLOMBIA, valor e PESOS' }
      ]
    },
    {
      id: 'pe', name: 'Peru',
      coins: [
        { v: '20', unit: 'CÉNTIMOS', d: 23, t: 1.32, w: '4,43 g', mat: 'Latão', ring: 'gold',
          edge: 'plain', edgeLabel: 'Liso', ap: [],
          obv: 'peObv', rev: 'peRev',
          dA: 'Escudo de Armas do Peru e BANCO CENTRAL DE RESERVA DEL PERÚ',
          dB: 'Valor entre ramos de louro e carvalho, com linhas verticais ao fundo' },
        { v: '50', unit: 'CÉNTIMOS', d: 22, t: 1.88, w: '5,45 g', mat: 'Alpaca (cobre, níquel e zinco)', ring: 'silver',
          edge: 'reeded', edgeLabel: 'Estriado', ap: [],
          obv: 'peObv', rev: 'peRev',
          dA: 'Escudo de Armas do Peru e BANCO CENTRAL DE RESERVA DEL PERÚ',
          dB: 'Valor entre ramos de louro e carvalho, com linhas verticais ao fundo' },
        { v: '1', unit: 'SOL', d: 25.5, t: 2.0, w: '7,32 g', mat: 'Alpaca (cobre, níquel e zinco)', ring: 'silver',
          edge: 'reeded', edgeLabel: 'Estriado contínuo', ap: ['t'],
          obv: 'peObv', oct: true, rev: 'peRev', oct2: true,
          dA: 'Escudo de Armas do Peru com filete em polígono de 8 lados',
          dB: 'Valor 1 e SOL entre ramos de louro e carvalho' },
        { v: '2', unit: 'SOLES', d: 22.38, t: 1.9, w: '5,62 g', mat: 'Bimetálica: anel de aço inox, núcleo de cobre-alumínio-níquel', ring: 'silver', core: 'gold', coreRatio: 0.62,
          edge: 'interrupted', edgeLabel: 'Estriado descontínuo', ap: ['t', 'coreRatio'],
          obv: 'peObv', rev: 'peRevColibri',
          dA: 'Escudo de Armas do Peru ocupando quase todo o núcleo',
          dB: 'Colibri das Linhas de Nazca e o valor' }
      ]
    },
    {
      id: 'mx', name: 'México',
      coins: [
        { v: '50', unit: 'CENTAVOS', d: 22, t: 1.8, w: '4,39 g', mat: 'Bronze-alumínio', ring: 'gold', sides: 12,
          edge: 'plain', edgeLabel: 'Liso', ap: ['t', 'edge'],
          obv: 'mxObv', rev: 'mxRevRing', ringStyle: 'notch',
          dA: 'Escudo Nacional (águia sobre o nopal) e ESTADOS UNIDOS MEXICANOS',
          dB: 'Valor com estilização do anel da Pedra do Sol' },
        { v: '1', unit: 'PESO', d: 21, t: 1.5, w: null, mat: 'Bimetálica', ring: 'silver', core: 'gold', coreRatio: 0.62,
          edge: 'plain', edgeLabel: 'Liso', ap: ['t', 'w', 'mat', 'edge', 'color', 'coreRatio'],
          obv: 'mxObv', rev: 'mxRevRing', ringStyle: 'rays',
          dA: 'Escudo Nacional (águia sobre o nopal) e ESTADOS UNIDOS MEXICANOS',
          dB: 'Valor com o anel do resplandor da Pedra do Sol' },
        { v: '5', unit: 'PESOS', d: 25.5, t: 2.0, w: '7,07 g', mat: 'Bimetálica: anel de bronze-alumínio, centro de aço inox', ring: 'gold', core: 'silver', coreRatio: 0.64,
          edge: 'plain', edgeLabel: 'Liso', ap: ['t', 'color', 'coreRatio'],
          obv: 'mxObv', rev: 'mxRevRing', ringStyle: 'serp',
          dA: 'Escudo Nacional (águia sobre o nopal) e ESTADOS UNIDOS MEXICANOS',
          dB: 'Valor com o anel das serpentes da Pedra do Sol' },
        { v: '10', unit: 'PESOS', d: 28, t: 2.1, w: '10,32 g', mat: 'Bimetálica: anel de bronze-alumínio, centro de alpaca prateada', ring: 'gold', core: 'silver', coreRatio: 0.64,
          edge: 'interrupted', edgeLabel: 'Estriado descontínuo', ap: ['d', 't', 'coreRatio'],
          obv: 'mxObv', rev: 'mxRevSun',
          dA: 'Escudo Nacional (águia sobre o nopal) e ESTADOS UNIDOS MEXICANOS',
          dB: 'Pedra do Sol com o deus Tonatiuh no centro' }
      ]
    },
    {
      id: 'ar', name: 'Argentina',
      coins: [
        { v: '1', unit: 'PESO', d: 20, t: 1.7, w: '4,30 g', mat: 'Aço eletrodepositado com cobre', ring: 'copper',
          edge: 'plain', edgeLabel: 'Liso', ap: [],
          obv: 'arObv', tree: 'jacaranda', name: 'JACARANDÁ', rev: 'arRev', year: '2017',
          dA: 'Jacarandá estilizado, REPÚBLICA ARGENTINA e JACARANDÁ',
          dB: 'Valor 1 PESO, flor do jacarandá, ano e EN UNIÓN Y LIBERTAD' },
        { v: '2', unit: 'PESOS', d: 21.5, t: 1.7, w: '5,00 g', mat: 'Aço eletrodepositado com latão', ring: 'gold',
          edge: 'plain', edgeLabel: 'Liso', ap: ['t', 'edge'],
          obv: 'arObv', tree: 'palo', name: 'PALO BORRACHO', rev: 'arRev', year: '2018',
          dA: 'Palo borracho, REPÚBLICA ARGENTINA e PALO BORRACHO',
          dB: 'Valor 2 PESOS, flor do palo borracho, ano e EN UNIÓN Y LIBERTAD' },
        { v: '5', unit: 'PESOS', d: 23, t: 2.2, w: '7,30 g', mat: 'Aço eletrodepositado com níquel', ring: 'silver',
          edge: 'plain', edgeLabel: 'Liso', ap: ['edge'],
          obv: 'arObv', tree: 'arrayan', name: 'ARRAYÁN', rev: 'arRev', year: '2017',
          dA: 'Arrayán estilizado, REPÚBLICA ARGENTINA e ARRAYÁN',
          dB: 'Valor 5 PESOS, flor do arrayán, ano e EN UNIÓN Y LIBERTAD' },
        { v: '10', unit: 'PESOS', d: 24.5, t: 2.6, w: '9,00 g', mat: 'Alpaca homogênea', ring: 'gold2',
          edge: 'reeded', edgeLabel: 'Estriado', ap: [],
          obv: 'arObv', tree: 'calden', name: 'CALDÉN', rev: 'arRev', year: '2018',
          dA: 'Caldén (copa larga e arredondada), REPÚBLICA ARGENTINA e CALDÉN',
          dB: 'Valor 10 PESOS, flor e folhas do caldén, ano e EN UNIÓN Y LIBERTAD' }
      ]
    }
  ];

  /* ---------- Utilidades de desenho ---------- */
  function arcText(g, s, cx, cy, r, center, size, color, bottom, maxAng) {
    var sz = size, chars = Array.from(s), w, total;
    function measure() {
      g.font = '700 ' + sz + 'px Georgia, "Times New Roman", serif';
      w = chars.map(function (ch) { return g.measureText(ch).width + sz * 0.14; });
      total = w.reduce(function (a, b) { return a + b; }, 0);
    }
    measure();
    while (total / r > maxAng && sz > 10) { sz -= 2; measure(); }
    g.fillStyle = color;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    var a = bottom ? center + total / (2 * r) : center - total / (2 * r);
    chars.forEach(function (ch, i) {
      var half = w[i] / 2 / r;
      var ang = bottom ? a - half : a + half;
      g.save();
      g.translate(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
      g.rotate(bottom ? ang - Math.PI / 2 : ang + Math.PI / 2);
      g.fillText(ch, 0, 0);
      g.restore();
      a = bottom ? a - w[i] / r : a + w[i] / r;
    });
  }

  function leaf(g, x, y, len, wid, rot) {
    g.beginPath();
    g.ellipse(x, y, len, wid, rot, 0, TAU);
    g.fill();
  }
  function leavesArc(g, cx, cy, r, a0, a1, n, len, wid, flipSide) {
    for (var i = 0; i < n; i++) {
      var a = (a0 + (a1 - a0) * i / Math.max(1, n - 1)) * Math.PI / 180;
      var side = (i % 2 ? 1 : -1) * (flipSide ? -1 : 1);
      leaf(g, cx + r * Math.cos(a) + Math.cos(a) * side * len * 0.35, cy + r * Math.sin(a) + Math.sin(a) * side * len * 0.35, len, wid, a + Math.PI / 2 + side * 0.55);
    }
  }
  function wave(g, x0, x1, y, amp, wl, lw) {
    g.lineWidth = lw;
    g.beginPath();
    for (var x = x0; x <= x1; x += 6) {
      var yy = y + Math.sin((x - x0) / wl * TAU) * amp;
      if (x === x0) g.moveTo(x, yy); else g.lineTo(x, yy);
    }
    g.stroke();
  }
  function star(g, x, y, sr) {
    g.beginPath();
    for (var j = 0; j < 10; j++) {
      var aa = j * Math.PI / 5 - Math.PI / 2;
      var rad = j % 2 ? sr * 0.42 : sr;
      if (j) g.lineTo(x + rad * Math.cos(aa), y + rad * Math.sin(aa));
      else g.moveTo(x + rad * Math.cos(aa), y + rad * Math.sin(aa));
    }
    g.closePath();
    g.fill();
  }
  function smoothClosed(g, pts, ox, oy, s, flip) {
    var n = pts.length;
    var P = pts.map(function (p) { return [ox + (flip ? -p[0] : p[0]) * s, oy + p[1] * s]; });
    g.beginPath();
    g.moveTo(P[0][0], P[0][1]);
    for (var i = 0; i < n; i++) {
      var p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      g.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]);
    }
    g.closePath();
  }

  var HEAD_F = [[-0.10,-1.00],[0.25,-0.95],[0.45,-0.75],[0.52,-0.50],[0.54,-0.38],[0.51,-0.30],[0.70,-0.10],[0.54,-0.04],[0.57,0.02],[0.52,0.07],[0.56,0.12],[0.47,0.24],[0.40,0.33],[0.18,0.40],[0.14,0.70],[0.42,1.00],[-0.65,1.05],[-0.28,0.72],[-0.42,0.30],[-0.66,0.00],[-0.76,-0.35],[-0.62,-0.75],[-0.35,-0.98]];
  var HEAD_M = [[-0.15,-1.00],[0.22,-0.96],[0.42,-0.76],[0.49,-0.52],[0.52,-0.40],[0.49,-0.31],[0.68,-0.12],[0.53,-0.05],[0.55,0.03],[0.50,0.10],[0.53,0.18],[0.46,0.32],[0.38,0.40],[0.18,0.45],[0.16,0.70],[0.55,1.02],[-0.70,1.05],[-0.30,0.72],[-0.40,0.30],[-0.58,-0.05],[-0.62,-0.45],[-0.50,-0.82],[-0.28,-0.98]];

  function drawHead(g, h, ox, oy, s, col, deepc) {
    var flip = !!h.flip;
    function X(x) { return ox + (flip ? -x : x) * s; }
    function Y(y) { return oy + y * s; }
    g.fillStyle = col;
    smoothClosed(g, h.k === 'F' ? HEAD_F : HEAD_M, ox, oy, s, flip);
    g.fill();
    if (h.k === 'F') {
      g.beginPath(); g.arc(X(-0.58), Y(0.0), s * 0.3, 0, TAU); g.fill();
    }
    g.strokeStyle = deepc;
    g.fillStyle = deepc;
    g.lineWidth = s * 0.028;
    g.lineCap = 'round';
    // olho, sobrancelha, boca, orelha
    g.beginPath(); g.arc(X(0.35), Y(-0.26), s * 0.035, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(X(0.22), Y(-0.36)); g.quadraticCurveTo(X(0.34), Y(-0.41), X(0.46), Y(-0.34)); g.stroke();
    g.beginPath(); g.moveTo(X(0.53), Y(0.075)); g.lineTo(X(0.40), Y(0.095)); g.stroke();
    g.beginPath(); g.ellipse(X(0.0), Y(-0.1), s * 0.07, s * 0.13, 0, 0, TAU); g.stroke();
    // mechas de cabelo
    for (var i = 0; i < 5; i++) {
      g.beginPath();
      g.moveTo(X(0.30 - i * 0.12), Y(-0.9 + i * 0.05));
      g.quadraticCurveTo(X(0.05 - i * 0.14), Y(-0.75 + i * 0.06), X(-0.1 - i * 0.12), Y(-0.35 + i * 0.1));
      g.stroke();
    }
    if (h.k === 'F') {
      // fita e folhas de louro na cabeça
      for (var j = 0; j < 7; j++) {
        var a = (-100 - j * 20) * Math.PI / 180;
        var lx = -0.1 + 0.55 * Math.cos(a), ly = -0.15 + 0.88 * Math.sin(a);
        g.beginPath();
        g.ellipse(X(lx), Y(ly), s * 0.1, s * 0.04, (flip ? -1 : 1) * (a + Math.PI / 2), 0, TAU);
        g.stroke();
      }
    }
    if (h.opt === 'mustache') {
      g.beginPath();
      g.ellipse(X(0.46), Y(0.03), s * 0.1, s * 0.04, 0, 0, TAU);
      g.fill();
    }
    if (h.opt === 'sideburn') {
      g.lineWidth = s * 0.05;
      g.beginPath(); g.moveTo(X(0.05), Y(-0.2)); g.lineTo(X(0.08), Y(0.22)); g.stroke();
    }
    // colarinho / busto
    g.lineWidth = s * 0.025;
    g.beginPath(); g.moveTo(X(0.16), Y(0.72)); g.quadraticCurveTo(X(0.0), Y(0.85), X(-0.25), Y(0.8)); g.stroke();
  }

  /* ---------- Animais, escudos, árvores ---------- */
  function animalFrailejon(g, x, y, s, col, deepc) {
    g.fillStyle = col;
    g.fillRect(x - 0.13 * s, y + 0.05 * s, 0.26 * s, 0.95 * s);
    g.strokeStyle = deepc; g.lineWidth = s * 0.018;
    for (var k = 0; k < 7; k++) {
      g.beginPath(); g.moveTo(x - 0.13 * s, y + (0.18 + k * 0.11) * s); g.lineTo(x + 0.13 * s, y + (0.2 + k * 0.11) * s); g.stroke();
    }
    g.fillStyle = col;
    for (var i = 0; i < 14; i++) {
      var a = i * TAU / 14;
      var cx0 = x + Math.cos(a) * 0.3 * s, cy0 = y - 0.12 * s + Math.sin(a) * 0.3 * s;
      leaf(g, cx0, cy0, 0.3 * s, 0.07 * s, a);
    }
    g.beginPath(); g.arc(x, y - 0.12 * s, 0.12 * s, 0, TAU); g.fill();
  }
  function animalGuacamaya(g, x, y, s, col, deepc) {
    g.strokeStyle = col; g.lineCap = 'round';
    g.lineWidth = s * 0.07;
    g.beginPath(); g.moveTo(x - 0.9 * s, y + 0.62 * s); g.quadraticCurveTo(x, y + 0.5 * s, x + 0.9 * s, y + 0.55 * s); g.stroke();
    g.fillStyle = col;
    g.beginPath(); g.ellipse(x - 0.05 * s, y + 0.05 * s, 0.32 * s, 0.55 * s, 0.25, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x - 0.38 * s, y + 0.62 * s, 0.1 * s, 0.6 * s, 0.55, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x - 0.2 * s, y + 0.65 * s, 0.09 * s, 0.55 * s, 0.35, 0, TAU); g.fill();
    g.beginPath(); g.arc(x + 0.12 * s, y - 0.55 * s, 0.24 * s, 0, TAU); g.fill();
    g.beginPath();
    g.moveTo(x + 0.3 * s, y - 0.66 * s);
    g.quadraticCurveTo(x + 0.62 * s, y - 0.62 * s, x + 0.5 * s, y - 0.3 * s);
    g.quadraticCurveTo(x + 0.46 * s, y - 0.46 * s, x + 0.3 * s, y - 0.42 * s);
    g.closePath(); g.fill();
    g.strokeStyle = deepc; g.lineWidth = s * 0.02;
    g.beginPath(); g.arc(x + 0.16 * s, y - 0.6 * s, 0.045 * s, 0, TAU); g.stroke();
    for (var i = 0; i < 5; i++) {
      g.beginPath(); g.moveTo(x - 0.25 * s + i * 0.05 * s, y - 0.25 * s); g.quadraticCurveTo(x - 0.1 * s, y + 0.1 * s, x - 0.3 * s + i * 0.07 * s, y + 0.45 * s); g.stroke();
    }
  }
  function animalRana(g, x, y, s, col, deepc) {
    g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.ellipse(x, y + 0.1 * s, 0.55 * s, 0.36 * s, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x + 0.4 * s, y - 0.08 * s, 0.3 * s, 0.22 * s, 0, 0, TAU); g.fill();
    g.beginPath(); g.arc(x + 0.45 * s, y - 0.3 * s, 0.1 * s, 0, TAU); g.fill();
    g.beginPath(); g.arc(x + 0.28 * s, y - 0.28 * s, 0.1 * s, 0, TAU); g.fill();
    g.lineWidth = s * 0.14;
    g.beginPath(); g.moveTo(x - 0.35 * s, y + 0.2 * s); g.lineTo(x - 0.7 * s, y + 0.5 * s); g.lineTo(x - 0.2 * s, y + 0.72 * s); g.stroke();
    g.lineWidth = s * 0.1;
    g.beginPath(); g.moveTo(x + 0.3 * s, y + 0.25 * s); g.lineTo(x + 0.55 * s, y + 0.55 * s); g.lineTo(x + 0.8 * s, y + 0.5 * s); g.stroke();
    g.strokeStyle = deepc; g.lineWidth = s * 0.02;
    g.beginPath(); g.arc(x + 0.45 * s, y - 0.3 * s, 0.04 * s, 0, TAU); g.stroke();
    g.beginPath(); g.arc(x + 0.28 * s, y - 0.28 * s, 0.04 * s, 0, TAU); g.stroke();
  }
  function animalTortuga(g, x, y, s, col, deepc) {
    g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
    g.beginPath(); g.ellipse(x + 0.28 * s, y - 0.5 * s, 0.4 * s, 0.13 * s, -0.6, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x + 0.28 * s, y + 0.5 * s, 0.38 * s, 0.12 * s, 0.6, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x - 0.55 * s, y + 0.38 * s, 0.22 * s, 0.1 * s, -0.5, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x, y, 0.62 * s, 0.46 * s, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x + 0.72 * s, y - 0.05 * s, 0.2 * s, 0.14 * s, 0, 0, TAU); g.fill();
    g.strokeStyle = deepc; g.lineWidth = s * 0.02;
    g.beginPath(); g.ellipse(x, y, 0.62 * s, 0.46 * s, 0, 0, TAU); g.stroke();
    g.beginPath(); g.ellipse(x, y, 0.3 * s, 0.22 * s, 0, 0, TAU); g.stroke();
    for (var i = 0; i < 6; i++) {
      var a = i * TAU / 6 + 0.3;
      g.beginPath(); g.moveTo(x + Math.cos(a) * 0.3 * s, y + Math.sin(a) * 0.22 * s); g.lineTo(x + Math.cos(a) * 0.62 * s, y + Math.sin(a) * 0.46 * s); g.stroke();
    }
    g.fillStyle = deepc;
    g.beginPath(); g.arc(x + 0.78 * s, y - 0.09 * s, 0.025 * s, 0, TAU); g.fill();
  }

  function drawEscudoPeru(g, cx, cy, r, col, deepc) {
    g.fillStyle = col; g.strokeStyle = col; g.lineJoin = 'round'; g.lineCap = 'round';
    // coroa de carvalho no topo
    leavesArc(g, cx, cy - r * 0.62, r * 0.46, 200, 340, 9, r * 0.11, r * 0.05, false);
    // ramos de louro laterais
    leavesArc(g, cx, cy + r * 0.05, r * 0.82, 100, 170, 7, r * 0.13, r * 0.05, false);
    leavesArc(g, cx, cy + r * 0.05, r * 0.82, 10, 80, 7, r * 0.13, r * 0.05, true);
    // escudo
    g.lineWidth = r * 0.07;
    g.beginPath();
    g.moveTo(cx - r * 0.5, cy - r * 0.55);
    g.lineTo(cx + r * 0.5, cy - r * 0.55);
    g.lineTo(cx + r * 0.5, cy + r * 0.05);
    g.quadraticCurveTo(cx + r * 0.5, cy + r * 0.55, cx, cy + r * 0.72);
    g.quadraticCurveTo(cx - r * 0.5, cy + r * 0.55, cx - r * 0.5, cy + r * 0.05);
    g.closePath();
    g.stroke();
    g.lineWidth = r * 0.05;
    g.beginPath();
    g.moveTo(cx, cy - r * 0.55); g.lineTo(cx, cy - r * 0.02);
    g.moveTo(cx - r * 0.5, cy - r * 0.02); g.lineTo(cx + r * 0.5, cy - r * 0.02);
    g.stroke();
    // vicunha (esq. superior)
    g.beginPath(); g.ellipse(cx - r * 0.28, cy - r * 0.22, r * 0.12, r * 0.07, 0, 0, TAU); g.fill();
    g.lineWidth = r * 0.035;
    g.beginPath(); g.moveTo(cx - r * 0.2, cy - r * 0.26); g.lineTo(cx - r * 0.16, cy - r * 0.42); g.stroke();
    g.beginPath(); g.arc(cx - r * 0.15, cy - r * 0.44, r * 0.035, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(cx - r * 0.34, cy - r * 0.17); g.lineTo(cx - r * 0.34, cy - r * 0.05); g.moveTo(cx - r * 0.22, cy - r * 0.17); g.lineTo(cx - r * 0.22, cy - r * 0.05); g.stroke();
    // árvore de quina (dir. superior)
    g.beginPath(); g.moveTo(cx + r * 0.26, cy - r * 0.08); g.lineTo(cx + r * 0.26, cy - r * 0.28); g.stroke();
    g.beginPath(); g.arc(cx + r * 0.26, cy - r * 0.35, r * 0.15, 0, TAU); g.fill();
    // cornucópia (inferior)
    g.lineWidth = r * 0.07;
    g.beginPath(); g.moveTo(cx - r * 0.3, cy + r * 0.2); g.quadraticCurveTo(cx, cy + r * 0.55, cx + r * 0.28, cy + r * 0.22); g.stroke();
    g.fillStyle = deepc;
    [[-0.1, 0.34], [0.02, 0.38], [0.14, 0.34]].forEach(function (p) {
      g.beginPath(); g.arc(cx + r * p[0], cy + r * p[1], r * 0.03, 0, TAU); g.fill();
    });
  }

  function drawEagle(g, cx, cy, r, col, deepc) {
    g.fillStyle = col; g.strokeStyle = col; g.lineJoin = 'round'; g.lineCap = 'round';
    // nopal
    [[0.0, 0.55, 0.28, 0.14], [-0.22, 0.38, 0.14, 0.2], [0.24, 0.42, 0.13, 0.18]].forEach(function (p) {
      g.beginPath(); g.ellipse(cx + r * p[0], cy + r * p[1], r * p[2], r * p[3], 0, 0, TAU); g.fill();
    });
    // asa
    g.beginPath();
    g.moveTo(cx + r * 0.05, cy - r * 0.22);
    g.quadraticCurveTo(cx + r * 0.35, cy - r * 0.95, cx + r * 0.85, cy - r * 0.55);
    g.lineTo(cx + r * 0.72, cy - r * 0.5);
    g.lineTo(cx + r * 0.84, cy - r * 0.32);
    g.lineTo(cx + r * 0.68, cy - r * 0.3);
    g.lineTo(cx + r * 0.78, cy - r * 0.08);
    g.quadraticCurveTo(cx + r * 0.4, cy + r * 0.1, cx + r * 0.1, cy + r * 0.05);
    g.closePath(); g.fill();
    // corpo e cabeça
    g.beginPath(); g.ellipse(cx - r * 0.02, cy + r * 0.0, r * 0.3, r * 0.42, 0.2, 0, TAU); g.fill();
    g.beginPath(); g.arc(cx - r * 0.24, cy - r * 0.42, r * 0.14, 0, TAU); g.fill();
    g.beginPath();
    g.moveTo(cx - r * 0.34, cy - r * 0.48);
    g.lineTo(cx - r * 0.55, cy - r * 0.38);
    g.lineTo(cx - r * 0.48, cy - r * 0.28);
    g.lineTo(cx - r * 0.36, cy - r * 0.36);
    g.closePath(); g.fill();
    // cauda
    for (var i = 0; i < 4; i++) {
      g.beginPath(); g.ellipse(cx + r * (0.12 + i * 0.1), cy + r * 0.36, r * 0.05, r * 0.2, 0.5 - i * 0.2, 0, TAU); g.fill();
    }
    // serpente
    g.strokeStyle = col; g.lineWidth = r * 0.05;
    g.beginPath();
    g.moveTo(cx - r * 0.52, cy - r * 0.32);
    g.bezierCurveTo(cx - r * 0.7, cy - r * 0.1, cx - r * 0.42, cy + r * 0.05, cx - r * 0.58, cy + r * 0.3);
    g.stroke();
    // garras
    g.beginPath(); g.moveTo(cx - r * 0.1, cy + r * 0.38); g.lineTo(cx - r * 0.14, cy + r * 0.48); g.moveTo(cx + r * 0.05, cy + r * 0.38); g.lineTo(cx + r * 0.08, cy + r * 0.48); g.stroke();
    // detalhes
    g.strokeStyle = deepc; g.fillStyle = deepc; g.lineWidth = r * 0.02;
    g.beginPath(); g.arc(cx - r * 0.27, cy - r * 0.44, r * 0.02, 0, TAU); g.fill();
    for (var k = 0; k < 4; k++) {
      g.beginPath(); g.moveTo(cx + r * (0.18 + k * 0.1), cy - r * 0.2 - k * r * 0.07); g.lineTo(cx + r * (0.3 + k * 0.12), cy - r * 0.05 - k * r * 0.03); g.stroke();
    }
    g.fillStyle = col;
    // ramos de louro e carvalho
    leavesArc(g, cx, cy + r * 0.05, r * 0.88, 105, 165, 7, r * 0.11, r * 0.045, false);
    leavesArc(g, cx, cy + r * 0.05, r * 0.88, 15, 75, 7, r * 0.11, r * 0.045, true);
  }

  function drawTree(g, kind, cx, cy, r, col, deepc) {
    g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    var i;
    if (kind === 'jacaranda') {
      g.lineWidth = r * 0.12;
      g.beginPath(); g.moveTo(cx, cy + r * 0.85); g.quadraticCurveTo(cx + r * 0.08, cy + r * 0.35, cx - r * 0.04, cy - r * 0.05); g.stroke();
      [[0, -0.3, 0.42], [-0.45, -0.1, 0.3], [0.45, -0.1, 0.3], [-0.25, -0.55, 0.28], [0.25, -0.55, 0.28], [0, -0.7, 0.2]].forEach(function (c) {
        g.beginPath(); g.arc(cx + r * c[0], cy + r * c[1], r * c[2], 0, TAU); g.fill();
      });
      g.fillStyle = deepc;
      for (i = 0; i < 14; i++) { g.beginPath(); g.arc(cx + r * (-0.6 + (i * 0.37) % 1.2), cy + r * (-0.75 + (i * 0.23) % 0.8), r * 0.025, 0, TAU); g.fill(); }
    } else if (kind === 'palo') {
      g.beginPath();
      g.moveTo(cx - r * 0.1, cy - r * 0.2);
      g.bezierCurveTo(cx - r * 0.5, cy + r * 0.1, cx - r * 0.4, cy + r * 0.6, cx - r * 0.18, cy + r * 0.85);
      g.lineTo(cx + r * 0.18, cy + r * 0.85);
      g.bezierCurveTo(cx + r * 0.4, cy + r * 0.6, cx + r * 0.5, cy + r * 0.1, cx + r * 0.1, cy - r * 0.2);
      g.closePath(); g.fill();
      g.lineWidth = r * 0.08;
      g.beginPath(); g.moveTo(cx, cy - r * 0.2); g.lineTo(cx - r * 0.5, cy - r * 0.55); g.moveTo(cx, cy - r * 0.2); g.lineTo(cx + r * 0.5, cy - r * 0.55); g.moveTo(cx, cy - r * 0.2); g.lineTo(cx, cy - r * 0.7); g.stroke();
      [[-0.55, -0.62, 0.2], [0.55, -0.62, 0.2], [0, -0.8, 0.22], [-0.3, -0.5, 0.15], [0.3, -0.5, 0.15]].forEach(function (c) {
        g.beginPath(); g.arc(cx + r * c[0], cy + r * c[1], r * c[2], 0, TAU); g.fill();
      });
      g.fillStyle = deepc;
      for (i = 0; i < 10; i++) { g.beginPath(); g.arc(cx + r * (-0.2 + (i * 0.13) % 0.4), cy + r * (0.0 + (i * 0.17) % 0.7), r * 0.02, 0, TAU); g.fill(); }
    } else if (kind === 'arrayan') {
      g.lineWidth = r * 0.16;
      g.beginPath(); g.moveTo(cx - r * 0.05, cy + r * 0.88); g.bezierCurveTo(cx + r * 0.25, cy + r * 0.5, cx - r * 0.3, cy + r * 0.3, cx + r * 0.05, cy - r * 0.1); g.stroke();
      [[0, -0.35, 0.45], [-0.38, -0.2, 0.3], [0.4, -0.2, 0.3], [0, -0.7, 0.26]].forEach(function (c) {
        g.beginPath(); g.arc(cx + r * c[0], cy + r * c[1], r * c[2], 0, TAU); g.fill();
      });
      g.strokeStyle = deepc; g.lineWidth = r * 0.02;
      for (i = 0; i < 6; i++) { g.beginPath(); g.arc(cx + r * (-0.3 + i * 0.12), cy + r * (-0.3 + (i % 2) * 0.2), r * 0.08, 0, TAU); g.stroke(); }
    } else {
      g.lineWidth = r * 0.2;
      g.beginPath(); g.moveTo(cx, cy + r * 0.88); g.lineTo(cx, cy + r * 0.05); g.stroke();
      g.beginPath(); g.ellipse(cx, cy - r * 0.25, r * 0.85, r * 0.42, 0, 0, TAU); g.fill();
      g.strokeStyle = deepc; g.lineWidth = r * 0.025;
      for (i = 0; i < 5; i++) { g.beginPath(); g.arc(cx + r * (-0.5 + i * 0.25), cy - r * 0.25, r * 0.16, Math.PI, 0); g.stroke(); }
    }
  }

  function drawFlower(g, kind, cx, cy, r, col, deepc) {
    g.fillStyle = col; g.strokeStyle = deepc; g.lineWidth = r * 0.03;
    var i, n = kind === 'palo' ? 5 : kind === 'arrayan' ? 4 : kind === 'calden' ? 8 : 6;
    if (kind === 'calden') {
      leavesArc(g, cx, cy, r * 0.5, 0, 360, 10, r * 0.25, r * 0.07, false);
    }
    for (i = 0; i < n; i++) {
      var a = i * TAU / n;
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * r * 0.42, cy + Math.sin(a) * r * 0.42, r * 0.4, r * 0.2, a, 0, TAU);
      g.fill(); g.stroke();
    }
    g.beginPath(); g.arc(cx, cy, r * 0.14, 0, TAU); g.fillStyle = deepc; g.fill();
  }

  /* ---------- Faces ---------- */
  function sizeFor(v) { var n = v.length; return n <= 1 ? 1.0 : n === 2 ? 0.95 : n === 3 ? 0.7 : 0.56; }

  var FACES = {};

  function zoned(D, fn) {
    var g = D.g, spec = D.spec;
    if (!spec.core || D.bump) { fn(D.raised('ring'), D.deep('ring')); return; }
    g.save(); g.beginPath(); g.arc(D.cx, D.cy, D.coreR, 0, TAU); g.clip();
    fn(D.raised('core'), D.deep('core')); g.restore();
    g.save(); g.beginPath(); g.rect(0, 0, D.S, D.S); g.moveTo(D.cx + D.coreR, D.cy); g.arc(D.cx, D.cy, D.coreR, 0, TAU, true); g.clip('evenodd');
    fn(D.raised('ring'), D.deep('ring')); g.restore();
  }
  function textAt(D, s, x, y, size, color, align) {
    var g = D.g;
    g.font = '700 ' + size + 'px Georgia, "Times New Roman", serif';
    g.textAlign = align || 'center';
    g.textBaseline = 'middle';
    g.fillStyle = color;
    g.fillText(s, x, y);
  }
  function zoneColor(D, x, y) {
    return (D.spec.core && Math.hypot(x - D.cx, y - D.cy) < D.coreR) ? D.raised('core') : D.raised('ring');
  }
  function bigValue(D, x, y, zoneR, unitText, unitDy) {
    var spec = D.spec, size = zoneR * sizeFor(spec.v);
    textAt(D, spec.v, x, y, size, zoneColor(D, x, y));
    if (unitText) textAt(D, unitText, x, y + (unitDy || zoneR * 0.62), zoneR * 0.19, zoneColor(D, x, y + (unitDy || zoneR * 0.62)));
  }
  function zoneR(D) { return D.spec.core ? D.coreR : D.R * 0.78; }
  function ringTextR(D) { return D.spec.core ? (D.coreR + D.R * 0.92) / 2 : D.R * 0.8; }

  function marajoara(D, rad, skipTop) {
    var g = D.g, R = D.R;
    g.fillStyle = D.raised('ring');
    for (var i = 0; i < 30; i++) {
      var a = i * TAU / 30;
      var deg = (a * 180 / Math.PI + 360) % 360;
      if (skipTop && deg > 235 && deg < 305) continue;
      g.save();
      g.translate(D.cx + rad * Math.cos(a), D.cy + rad * Math.sin(a));
      g.rotate(a + Math.PI / 2);
      g.beginPath();
      g.moveTo(0, -R * 0.05); g.lineTo(R * 0.028, 0); g.lineTo(0, R * 0.05); g.lineTo(-R * 0.028, 0);
      g.closePath(); g.fill();
      g.restore();
    }
  }

  FACES.brObv = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy, h = spec.head;
    var inkRing = D.raised('ring');
    arcText(g, 'BRASIL', cx, cy, ringTextR(D), spec.core ? -Math.PI / 2 : Math.PI / 2, R * 0.085, inkRing, !spec.core, 1.6);
    if (spec.marajoara) marajoara(D, ringTextR(D), true);
    if (spec.laurel) {
      g.fillStyle = D.raised('ring');
      leavesArc(g, cx, cy, R * 0.62, 125, 235, 9, R * 0.075, R * 0.03, false);
    }
    zoned(D, function (col, deepc) {
      drawHead(g, h, cx + R * h.x, cy + R * h.y, R * h.s, col, deepc);
    });
  };
  FACES.brRevDiag = function (D) {
    var g = D.g, R = D.R, cx = D.cx, cy = D.cy, S = D.S;
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.86, 0, TAU); g.clip();
    g.beginPath(); g.rect(0, 0, cx + R * 0.05, S); g.clip();
    g.strokeStyle = D.raised('ring'); g.lineWidth = R * 0.016;
    for (var dx = -S; dx < S; dx += R * 0.09) { g.beginPath(); g.moveTo(dx, S); g.lineTo(dx + S, 0); g.stroke(); }
    g.restore();
    var zr = zoneR(D);
    textAt(D, D.spec.v, cx - R * 0.12, cy - zr * 0.06, zr * sizeFor(D.spec.v) * 0.95, D.raised('ring'));
    textAt(D, 'CENTAVOS', cx - R * 0.02, cy + zr * 0.55, R * 0.1, D.raised('ring'));
    textAt(D, '2002', cx - R * 0.02, cy + zr * 0.78, R * 0.07, D.raised('ring'));
  };
  FACES.brRevLaurel = function (D) {
    var g = D.g, R = D.R, cx = D.cx, cy = D.cy;
    g.fillStyle = D.raised('ring');
    leavesArc(g, cx, cy, R * 0.7, 100, 170, 8, R * 0.09, R * 0.035, false);
    leavesArc(g, cx, cy, R * 0.7, 10, 80, 8, R * 0.09, R * 0.035, true);
    var zr = zoneR(D);
    textAt(D, D.spec.v, cx, cy - zr * 0.12, zr * sizeFor(D.spec.v) * 0.8, D.raised('ring'));
    textAt(D, 'CENTAVOS', cx, cy + zr * 0.4, R * 0.09, D.raised('ring'));
  };
  FACES.brRevWavy = function (D) {
    var g = D.g, R = D.R, cx = D.cx, cy = D.cy;
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.86, 0, TAU); g.clip();
    g.strokeStyle = D.raised('ring');
    for (var y = cy - R * 0.8; y < cy + R * 0.8; y += R * 0.1) wave(g, cx - R, cx + R, y, R * 0.03, R * 0.3, R * 0.014);
    g.restore();
    var zr = zoneR(D);
    textAt(D, D.spec.v, cx, cy - zr * 0.08, zr * sizeFor(D.spec.v) * 0.9, D.raised('ring'));
    textAt(D, 'CENTAVOS', cx, cy + zr * 0.55, R * 0.1, D.raised('ring'));
  };
  /* esfera com faixas + estrelas + fita (usado no 1 real e no 50 centavos) */
  function brSphere(g, x, y, u, col, deepc) {
    g.save();
    g.strokeStyle = col; g.lineWidth = u * 0.03; g.lineJoin = 'round';
    g.beginPath(); g.ellipse(x + u * 0.22, y + u * 0.02, u * 0.74, u * 0.66, 0.1, -1.9, 1.75); g.stroke();
    g.fillStyle = deepc;
    g.beginPath();
    g.moveTo(x - u * 0.08, y - u * 0.16);
    g.quadraticCurveTo(x + u * 0.55, y - u * 0.02, x + u * 0.86, y + u * 0.34);
    g.lineTo(x + u * 0.78, y + u * 0.46);
    g.quadraticCurveTo(x + u * 0.48, y + u * 0.12, x - u * 0.08, y + u * 0.0);
    g.closePath(); g.fill();
    g.beginPath();
    g.moveTo(x - u * 0.08, y + u * 0.16);
    g.quadraticCurveTo(x + u * 0.5, y + u * 0.22, x + u * 0.72, y + u * 0.62);
    g.lineTo(x + u * 0.6, y + u * 0.7);
    g.quadraticCurveTo(x + u * 0.4, y + u * 0.38, x - u * 0.08, y + u * 0.3);
    g.closePath(); g.fill();
    g.strokeStyle = col; g.lineWidth = u * 0.02;
    g.beginPath(); g.moveTo(x - u * 0.08, y - u * 0.16); g.quadraticCurveTo(x + u * 0.55, y - u * 0.02, x + u * 0.86, y + u * 0.34); g.stroke();
    g.beginPath(); g.moveTo(x - u * 0.08, y + u * 0.16); g.quadraticCurveTo(x + u * 0.5, y + u * 0.22, x + u * 0.72, y + u * 0.62); g.stroke();
    g.fillStyle = col;
    star(g, x + u * 0.61, y - u * 0.42, u * 0.07);
    star(g, x + u * 0.39, y - u * 0.27, u * 0.065);
    star(g, x + u * 0.78, y - u * 0.15, u * 0.065);
    star(g, x + u * 0.56, y - u * 0.08, u * 0.06);
    star(g, x + u * 0.46, y + u * 0.2, u * 0.065);
    g.restore();
  }
  function brRibbon(g, x, y, w, col) {
    g.save(); g.strokeStyle = col; g.lineWidth = w * 0.03; g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(x - w / 2, y - w * 0.07);
    g.bezierCurveTo(x - w * 0.2, y + w * 0.08, x - w * 0.1, y - w * 0.12, x + w * 0.1, y - w * 0.02);
    g.bezierCurveTo(x + w * 0.3, y + w * 0.08, x + w * 0.35, y - w * 0.08, x + w / 2, y - w * 0.07);
    g.lineTo(x + w / 2, y + w * 0.05);
    g.bezierCurveTo(x + w * 0.35, y + w * 0.04, x + w * 0.3, y + w * 0.2, x + w * 0.1, y + w * 0.1);
    g.bezierCurveTo(x - w * 0.1, y, x - w * 0.2, y + w * 0.2, x - w / 2, y + w * 0.05);
    g.closePath(); g.stroke();
    g.restore();
  }
  FACES.brRev1 = function (D) {
    var g = D.g, cx = D.cx, cy = D.cy, cr = D.coreR;
    marajoara(D, ringTextR(D), false);
    g.save();
    g.beginPath(); g.arc(cx, cy, cr, 0, TAU); g.clip();
    var col = D.raised('core'), deepc = D.deep('core');
    function P(x, y) { return [cx + cr * x, cy + cr * y]; }
    // esfera, faixas e estrelas (atrás do 1)
    brSphere(g, cx + cr * 0.0, cy - cr * 0.02, cr, col, deepc);
    // numeral "1" listrado
    var pts = [[-0.70,-0.28],[-0.36,-0.60],[-0.10,-0.60],[-0.10,0.22],[0.10,0.22],[0.10,0.34],[-0.72,0.34],[-0.72,0.22],[-0.40,0.22],[-0.40,-0.28]];
    g.beginPath();
    pts.forEach(function (p, i) { var q = P(p[0], p[1]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
    g.closePath();
    g.fillStyle = D.field('core'); g.fill();
    g.save(); g.clip();
    g.strokeStyle = col; g.lineWidth = cr * 0.018;
    for (var xx = -0.8; xx < 0.2; xx += 0.055) { g.beginPath(); g.moveTo(cx + cr * xx, cy - cr * 0.62); g.lineTo(cx + cr * xx, cy + cr * 0.36); g.stroke(); }
    g.restore();
    g.strokeStyle = col; g.lineWidth = cr * 0.035; g.lineJoin = 'round';
    g.beginPath();
    pts.forEach(function (p, i) { var q = P(p[0], p[1]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
    g.closePath(); g.stroke();
    // REAL, ano e fita
    textAt(D, 'REAL', cx - cr * 0.02, cy + cr * 0.62, cr * 0.34, col);
    textAt(D, '2027', cx - cr * 0.02, cy + cr * 0.86, cr * 0.15, col);
    g.restore();
  };
  FACES.brRev50 = function (D) {
    var g = D.g, R = D.R, cx = D.cx, cy = D.cy, S = D.S, col = D.raised('ring'), deepc = D.deep('ring');
    // linhas diagonais atrás do 5
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.86, 0, TAU); g.clip();
    g.beginPath(); g.rect(0, 0, cx + R * 0.0, cy + R * 0.3); g.clip();
    g.strokeStyle = col; g.lineWidth = R * 0.014;
    for (var dx = -S; dx < S; dx += R * 0.07) { g.beginPath(); g.moveTo(dx, S); g.lineTo(dx + S * 0.55, 0); g.stroke(); }
    g.restore();
    // esfera, faixas e estrelas
    brSphere(g, cx + R * 0.05, cy - R * 0.06, R * 0.88, col, deepc);
    // 50 grande (com contorno para destacar das linhas)
    g.font = '700 ' + (R * 1.0) + 'px Georgia, "Times New Roman", serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.lineWidth = R * 0.05; g.strokeStyle = D.field('ring');
    g.strokeText('50', cx - R * 0.08, cy - R * 0.14);
    g.fillStyle = col; g.fillText('50', cx - R * 0.08, cy - R * 0.14);
    textAt(D, 'CENTAVOS', cx - R * 0.02, cy + R * 0.46, R * 0.15, col);
    textAt(D, '2002', cx - R * 0.02, cy + R * 0.62, R * 0.085, col);
    brRibbon(g, cx - R * 0.02, cy + R * 0.76, R * 0.45, col);
  };
  FACES.brObvRB = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy, S = D.S, h = spec.head, col = D.raised('ring'), deepc = D.deep('ring');
    // linhas diagonais no canto superior direito
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.86, 0, TAU); g.clip();
    g.beginPath(); g.moveTo(cx + R * 0.12, cy - R); g.lineTo(cx + R, cy - R); g.lineTo(cx + R, cy + R * 0.5); g.lineTo(cx + R * 0.55, cy + R * 0.5); g.closePath(); g.clip();
    g.strokeStyle = col; g.lineWidth = R * 0.016;
    for (var dx = -S; dx < S * 2; dx += R * 0.07) { g.beginPath(); g.moveTo(dx, cy + R * 0.9); g.lineTo(dx + S * 0.55, cy - R); g.stroke(); }
    g.restore();
    // BRASIL no alto, à esquerda
    arcText(g, 'BRASIL', cx, cy, R * 0.78, -Math.PI * 0.72, R * 0.14, col, false, 1.0);
    // mapa do Brasil em relevo (curvas de nível)
    var mp = [[-0.10,-0.50],[0.10,-0.45],[0.30,-0.30],[0.50,-0.20],[0.45,0.00],[0.30,0.15],[0.15,0.35],[0.00,0.50],[-0.10,0.40],[-0.25,0.20],[-0.40,0.05],[-0.45,-0.20],[-0.30,-0.40]];
    g.strokeStyle = col; g.lineWidth = R * 0.014; g.lineJoin = 'round';
    for (var k = 1.0; k > 0.2; k -= 0.17) {
      smoothClosed(g, mp, cx - R * 0.42, cy + R * 0.12, R * 0.5 * k, false);
      g.stroke();
    }
    // busto
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.9, 0, TAU); g.clip();
    drawHead(g, h, cx + R * h.x, cy + R * h.y, R * h.s, col, deepc);
    g.restore();
    // RIO BRANCO (pequeno, na vertical, à direita)
    g.save();
    g.translate(cx + R * 0.8, cy + R * 0.12); g.rotate(-1.25);
    textAt(D, 'RIO BRANCO', 0, 0, R * 0.045, col);
    g.restore();
  };

  FACES.coObv = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy;
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.86, 0, TAU); g.clip();
    g.strokeStyle = D.raised('ring'); g.lineWidth = R * 0.008;
    for (var y = cy - R * 0.1; y < cy + R * 0.9; y += R * 0.045) { g.beginPath(); g.moveTo(cx - R, y); g.lineTo(cx + R, y); g.stroke(); }
    g.restore();
    var fn = { frailejon: animalFrailejon, guacamaya: animalGuacamaya, rana: animalRana, tortuga: animalTortuga }[spec.animal];
    var ax = spec.core ? cx - R * 0.12 : cx, ay = spec.core ? cy + R * 0.02 : cy + R * 0.05, as = R * (spec.core ? 0.6 : 0.52);
    if (spec.animal === 'frailejon') { ay -= R * 0.3; as = R * 0.55; }
    if (spec.animal === 'guacamaya') { ay -= R * 0.05; as = R * 0.5; }
    zoned(D, function (col, deepc) { fn(g, ax, ay, as, col, deepc); });
    arcText(g, spec.name, cx, cy, ringTextR(D), Math.PI / 2, R * 0.065, D.raised('ring'), true, 1.9);
  };
  FACES.coRev = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy, zr = zoneR(D);
    arcText(g, 'REPÚBLICA DE COLOMBIA', cx, cy, ringTextR(D), -Math.PI / 2, R * 0.07, D.raised('ring'), false, 2.5);
    g.fillStyle = D.raised('ring');
    for (var i = 0; i < 72; i++) {
      var a = i * TAU / 72;
      g.beginPath(); g.arc(cx + R * 0.875 * Math.cos(a), cy + R * 0.875 * Math.sin(a), R * 0.008, 0, TAU); g.fill();
    }
    if (spec.core) {
      textAt(D, spec.v, cx, cy - zr * 0.12, zr * sizeFor(spec.v) * 0.85, D.raised('core'));
      textAt(D, 'PESOS', cx, cy + zr * 0.38, zr * 0.2, D.raised('core'));
      g.save(); g.beginPath(); g.arc(cx, cy, D.coreR * 0.95, 0, TAU); g.clip();
      g.strokeStyle = D.raised('core');
      for (var k = 0; k < 3; k++) wave(g, cx - zr, cx + zr, cy + zr * (0.6 + k * 0.12), zr * 0.04, zr * 0.5, zr * 0.025);
      g.restore();
    } else {
      bigValue(D, cx, cy - zr * 0.05, zr * 0.95, 'PESOS', zr * 0.62);
    }
  };

  FACES.peObv = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy, zr = zoneR(D);
    arcText(g, 'BANCO CENTRAL DE RESERVA DEL PERÚ', cx, cy, ringTextR(D), -Math.PI / 2, R * 0.065, D.raised('ring'), false, 3.7);
    if (spec.oct) {
      g.strokeStyle = D.raised('ring'); g.lineWidth = R * 0.016;
      g.beginPath();
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4 + Math.PI / 8;
        var px = cx + R * 0.84 * Math.cos(a), py = cy + R * 0.84 * Math.sin(a);
        if (i) g.lineTo(px, py); else g.moveTo(px, py);
      }
      g.closePath(); g.stroke();
    }
    zoned(D, function (col, deepc) { drawEscudoPeru(g, cx, cy + R * 0.02, zr * (spec.core ? 1.0 : 0.82), col, deepc); });
  };
  FACES.peRev = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy, S = D.S;
    g.save();
    g.beginPath(); g.arc(cx, cy, R * 0.86, 0, TAU); g.clip();
    g.beginPath(); g.rect(cx + R * 0.35, 0, S, S); g.clip();
    g.strokeStyle = D.raised('ring'); g.lineWidth = R * 0.01;
    for (var x = cx + R * 0.35; x < cx + R; x += R * 0.05) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, S); g.stroke(); }
    g.restore();
    g.fillStyle = D.raised('ring');
    leavesArc(g, cx, cy, R * 0.68, 95, 170, 8, R * 0.1, R * 0.035, false);
    leavesArc(g, cx, cy, R * 0.68, 10, 85, 8, R * 0.08, R * 0.05, true);
    var zr = zoneR(D);
    textAt(D, spec.v, cx - R * 0.05, cy - zr * 0.12, zr * sizeFor(spec.v) * 0.95, D.raised('ring'));
    textAt(D, spec.unit, cx - R * 0.05, cy + zr * 0.5, R * (spec.unit.length > 5 ? 0.095 : 0.12), D.raised('ring'));
  };
  FACES.peRevColibri = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy;
    arcText(g, 'SOLES', cx, cy, ringTextR(D), Math.PI / 2, R * 0.08, D.raised('ring'), true, 1.4);
    zoned(D, function (col, deepc) {
      g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
      g.lineWidth = R * 0.035;
      // bico longo
      g.beginPath(); g.moveTo(cx - R * 0.6, cy - R * 0.45); g.lineTo(cx - R * 0.2, cy - R * 0.2); g.stroke();
      // corpo
      g.beginPath(); g.ellipse(cx, cy - R * 0.05, R * 0.22, R * 0.09, 0.6, 0, TAU); g.fill();
      g.beginPath(); g.arc(cx - R * 0.2, cy - R * 0.2, R * 0.07, 0, TAU); g.fill();
      // asas
      g.beginPath(); g.moveTo(cx + R * 0.05, cy - R * 0.1); g.quadraticCurveTo(cx + R * 0.2, cy - R * 0.7, cx + R * 0.7, cy - R * 0.62); g.quadraticCurveTo(cx + R * 0.35, cy - R * 0.4, cx + R * 0.1, cy - R * 0.05); g.fill();
      g.beginPath(); g.moveTo(cx - R * 0.02, cy - R * 0.02); g.quadraticCurveTo(cx - R * 0.3, cy + R * 0.3, cx - R * 0.55, cy + R * 0.2); g.quadraticCurveTo(cx - R * 0.3, cy + R * 0.05, cx - R * 0.0, cy - R * 0.05); g.fill();
      // cauda
      g.beginPath(); g.moveTo(cx + R * 0.15, cy + R * 0.05); g.lineTo(cx + R * 0.45, cy + R * 0.45); g.moveTo(cx + R * 0.12, cy + R * 0.08); g.lineTo(cx + R * 0.25, cy + R * 0.55); g.stroke();
    });
    textAt(D, spec.v, cx - R * 0.3, cy + R * 0.38, R * 0.3, D.raised('core'));
  };

  FACES.mxObv = function (D) {
    var g = D.g, R = D.R, cx = D.cx, cy = D.cy, zr = zoneR(D);
    arcText(g, 'ESTADOS UNIDOS MEXICANOS', cx, cy, ringTextR(D), -Math.PI / 2, R * 0.065, D.raised('ring'), false, 3.3);
    zoned(D, function (col, deepc) { drawEagle(g, cx, cy + R * 0.02, zr * (D.spec.core ? 1.0 : 0.88), col, deepc); });
  };
  FACES.mxRevRing = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy, i, a;
    var rr = spec.core ? (D.coreR + R * 0.92) / 2 : R * 0.76;
    g.fillStyle = D.raised('ring'); g.strokeStyle = D.raised('ring');
    if (spec.ringStyle === 'notch') {
      for (i = 0; i < 28; i++) { a = i * TAU / 28; g.save(); g.translate(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); g.rotate(a); g.fillRect(-R * 0.04, -R * 0.018, R * 0.08, R * 0.036); g.restore(); }
    } else if (spec.ringStyle === 'rays') {
      g.lineWidth = R * 0.016;
      for (i = 0; i < 36; i++) { a = i * TAU / 36; g.beginPath(); g.moveTo(cx + (rr - R * 0.05) * Math.cos(a), cy + (rr - R * 0.05) * Math.sin(a)); g.lineTo(cx + (rr + R * 0.05) * Math.cos(a), cy + (rr + R * 0.05) * Math.sin(a)); g.stroke(); }
    } else {
      g.lineWidth = R * 0.02;
      g.beginPath();
      for (i = 0; i <= 240; i++) { a = i * TAU / 240; var rad = rr + Math.sin(a * 16) * R * 0.03; var x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a); if (i) g.lineTo(x, y); else g.moveTo(x, y); }
      g.stroke();
    }
    var zr = zoneR(D);
    textAt(D, '$' + spec.v, cx, cy - zr * 0.05, zr * sizeFor('$' + spec.v) * 0.85, zoneColor(D, cx, cy));
    textAt(D, spec.unit, cx, cy + zr * 0.55, zr * 0.17, zoneColor(D, cx, cy + zr * 0.55));
  };
  FACES.mxRevSun = function (D) {
    var g = D.g, R = D.R, cx = D.cx, cy = D.cy, cr = D.coreR, i, a;
    // anéis externos (anel dourado)
    g.fillStyle = D.raised('ring'); g.strokeStyle = D.raised('ring');
    for (i = 0; i < 24; i++) {
      a = i * TAU / 24;
      g.beginPath();
      g.moveTo(cx + R * 0.7 * Math.cos(a - 0.1), cy + R * 0.7 * Math.sin(a - 0.1));
      g.lineTo(cx + R * 0.88 * Math.cos(a), cy + R * 0.88 * Math.sin(a));
      g.lineTo(cx + R * 0.7 * Math.cos(a + 0.1), cy + R * 0.7 * Math.sin(a + 0.1));
      g.closePath(); g.fill();
    }
    // núcleo: Tonatiuh
    var col = D.raised('core'), deepc = D.deep('core');
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = cr * 0.07;
    g.beginPath(); g.arc(cx, cy, cr * 0.88, 0, TAU); g.stroke();
    g.beginPath(); g.arc(cx, cy, cr * 0.62, 0, TAU); g.stroke();
    for (i = 0; i < 16; i++) {
      a = i * TAU / 16;
      g.beginPath(); g.moveTo(cx + cr * 0.66 * Math.cos(a), cy + cr * 0.66 * Math.sin(a)); g.lineTo(cx + cr * 0.86 * Math.cos(a), cy + cr * 0.86 * Math.sin(a)); g.stroke();
    }
    g.beginPath(); g.arc(cx, cy, cr * 0.34, 0, TAU); g.fill();
    g.fillStyle = deepc; g.strokeStyle = deepc; g.lineWidth = cr * 0.03;
    g.beginPath(); g.arc(cx - cr * 0.12, cy - cr * 0.08, cr * 0.04, 0, TAU); g.fill();
    g.beginPath(); g.arc(cx + cr * 0.12, cy - cr * 0.08, cr * 0.04, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(cx - cr * 0.14, cy + cr * 0.08); g.lineTo(cx + cr * 0.14, cy + cr * 0.08); g.stroke();
    g.beginPath(); g.moveTo(cx - cr * 0.05, cy + cr * 0.08); g.lineTo(cx, cy + cr * 0.24); g.lineTo(cx + cr * 0.05, cy + cr * 0.08); g.closePath(); g.fill();
  };

  FACES.arObv = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy;
    arcText(g, 'REPÚBLICA ARGENTINA', cx, cy, R * 0.8, -Math.PI / 2, R * 0.075, D.raised('ring'), false, 2.6);
    arcText(g, spec.name, cx, cy, R * 0.8, Math.PI / 2, R * 0.075, D.raised('ring'), true, 2.0);
    drawTree(g, spec.tree, cx, cy + R * 0.02, R * 0.52, D.raised('ring'), D.deep('ring'));
  };
  FACES.arRev = function (D) {
    var g = D.g, spec = D.spec, R = D.R, cx = D.cx, cy = D.cy;
    arcText(g, spec.year, cx, cy, R * 0.8, -Math.PI / 2, R * 0.075, D.raised('ring'), false, 1.4);
    arcText(g, 'EN UNIÓN Y LIBERTAD', cx, cy, R * 0.8, Math.PI / 2, R * 0.07, D.raised('ring'), true, 2.4);
    drawFlower(g, spec.tree, cx + R * 0.32, cy + R * 0.12, R * 0.36, D.raised('ring'), D.deep('ring'));
    textAt(D, spec.v, cx - R * 0.28, cy - R * 0.18, R * 0.5 * sizeFor(spec.v) * 0.9, D.raised('ring'));
    textAt(D, spec.unit, cx - R * 0.28, cy + R * 0.24, R * 0.12, D.raised('ring'));
  };

  /* ---------- Texturas ---------- */
  function faceCanvas(spec, side, mode) {
    var S = 1024, R = S / 2, cx = R, cy = R;
    var c = document.createElement('canvas');
    c.width = c.height = S;
    var g = c.getContext('2d');
    var bump = mode === 'bump';
    var rp = PAL[spec.ring], cp = spec.core ? PAL[spec.core] : rp;
    function P(z) { return z === 'core' ? cp : rp; }
    var D = {
      g: g, S: S, R: R, cx: cx, cy: cy, spec: spec, bump: bump,
      coreR: spec.core ? R * (spec.coreRatio || 0.62) : 0,
      raised: function (z) { return bump ? '#ffffff' : P(z).hi; },
      deep: function (z) { return bump ? '#000000' : P(z).lo; },
      field: function (z) { return bump ? '#7a7a7a' : P(z).base; }
    };
    function path(r) {
      g.beginPath();
      if (spec.sides) {
        for (var i = 0; i < spec.sides; i++) {
          var a = i * 2 * Math.PI / spec.sides;
          var x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          if (i) g.lineTo(x, y); else g.moveTo(x, y);
        }
        g.closePath();
      } else {
        g.arc(cx, cy, r, 0, TAU);
      }
    }
    g.lineJoin = 'round';
    g.fillStyle = D.field('ring');
    g.fillRect(0, 0, S, S);
    if (spec.core) {
      g.beginPath(); g.arc(cx, cy, D.coreR, 0, TAU); g.fillStyle = D.field('core'); g.fill();
      g.beginPath(); g.arc(cx, cy, D.coreR, 0, TAU); g.lineWidth = R * 0.014; g.strokeStyle = D.deep('ring'); g.stroke();
    }
    path(R * 0.95); g.lineWidth = R * 0.07; g.strokeStyle = D.raised('ring'); g.stroke();
    path(R * 0.9); g.lineWidth = R * 0.012; g.strokeStyle = D.deep('ring'); g.stroke();
    var key = side === 'obv' ? spec.obv : spec.rev;
    FACES[key](D);
    return c;
  }

  function edgeCanvas(spec, mode) {
    var W = 2048, H = 64;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');
    var bump = mode === 'bump';
    var rp = PAL[spec.ring];
    g.fillStyle = bump ? '#808080' : rp.base;
    g.fillRect(0, 0, W, H);
    var pitch = W / 150;
    function lines(from, to, y0, h) {
      for (var x = from; x < to; x += pitch) {
        g.fillStyle = bump ? '#000' : rp.lo;
        g.fillRect(x, y0, pitch * 0.4, h);
        g.fillStyle = bump ? '#fff' : rp.hi;
        g.fillRect(x + pitch * 0.5, y0, pitch * 0.3, h);
      }
    }
    if (spec.edge === 'reeded') lines(0, W, 0, H);
    else if (spec.edge === 'interrupted') {
      for (var k = 0; k < 8; k++) lines(k * W / 8, k * W / 8 + W / 8 * 0.5, 0, H);
    } else if (spec.edge === 'canalreeded') {
      lines(0, W, 0, H * 0.28);
      lines(0, W, H * 0.72, H * 0.28);
      g.fillStyle = bump ? '#000' : rp.lo;
      g.fillRect(0, H * 0.36, W, H * 0.28);
    } else if (spec.edge === 'text') {
      var label = spec.edgeText;
      g.font = '700 ' + (H * 0.62) + 'px Georgia, serif';
      var tw = g.measureText(label).width;
      var reps = spec.edgeReps || Math.max(1, Math.floor(W / tw));
      g.save();
      g.scale((W / reps) / tw, 1);
      g.textBaseline = 'middle';
      g.textAlign = 'left';
      g.fillStyle = bump ? '#fff' : rp.hi;
      for (var q = 0; q < reps; q++) g.fillText(label, q * tw, H / 2);
      g.restore();
    }
    return c;
  }

  window.CoinArt = { PAL: PAL, COUNTRIES: COUNTRIES, faceCanvas: faceCanvas, edgeCanvas: edgeCanvas };
})();
