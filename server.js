const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const SKINS = [
  { id: "panda", name: "Panda Clássico", price: 0, rarity: "origem", role: "origem", blurb: "O saltador original. Sem capa, sem máscara — só coragem." },
  { id: "night-cape", name: "Capa da Meia-Noite", price: 0, rarity: "epico", role: "capa", blurb: "Capa pesada, orelhas de silhueta e olhos brancos no escuro." },
  { id: "web-suit", name: "Traje da Teia", price: 0, rarity: "lendario", role: "traje", blurb: "Lentes brancas, linhas de teia e um vermelho que corta o céu." },
  { id: "gold-mask", name: "Máscara Dourada", price: 0, rarity: "raro", role: "mascara", blurb: "Meia-máscara de palco, como um herói de capa de HQ." },
  { id: "crimson-mask", name: "Máscara Carmesim", price: 0, rarity: "raro", role: "mascara", blurb: "Rosto coberto, capa curta, mistério de revista antiga." },
  { id: "iron-visor", name: "Visor de Aço", price: 0, rarity: "lendario", role: "armadura", blurb: "Placas, luminescência e um capacete que parece motor." },
  { id: "moon-ninja", name: "Ninja Lunar", price: 0, rarity: "raro", role: "mascara", blurb: "Faixa nos olhos, capuz e silêncio entre as plataformas." },
  { id: "sky-knight", name: "Cavaleiro do Céu", price: 0, rarity: "mito", role: "capa", blurb: "Elmo alado, capa longa e o brilho de um emblema no peito." },
  { id: "venom-veil", name: "Véu Sombrio", price: 0, rarity: "epico", role: "traje", blurb: "Simbiose verde-negra, língua de sombra e olhos brancos." },
  { id: "star-panda", name: "Panda Estelar", price: 0, rarity: "epico", role: "traje", blurb: "Traje de órbita, viseira e uma bandeira minúscula nas costas." }
];
const ALL_SKIN_IDS = SKINS.map((s) => s.id);

function grantAllSkins(p) {
  p.ownedSkins = [...ALL_SKIN_IDS];
  return p;
}

function emptyDb() {
  return { players: {}, runs: [] };
}

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return emptyDb();
  }
}

function saveDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function publicPlayer(p) {
  return {
    id: p.id,
    name: p.name,
    points: p.points,
    coins: p.coins,
    ownedSkins: p.ownedSkins,
    equipped: p.equipped,
    bestHeight: p.bestHeight,
    runs: p.runs
  };
}

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "120kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/catalog", (_req, res) => {
  res.json({ skins: SKINS, biomes: require("./world.json") });
});

app.post("/api/session", (req, res) => {
  const db = loadDb();
  const incomingId = String(req.body?.id || "").slice(0, 64);
  let name = String(req.body?.name || "Saltador").trim().slice(0, 18) || "Saltador";
  let player = incomingId ? db.players[incomingId] : null;
  if (!player) {
    const id = crypto.randomUUID();
    player = {
      id,
      name,
      points: 1240,
      coins: 2500,
      ownedSkins: [...ALL_SKIN_IDS],
      equipped: "panda",
      bestHeight: 0,
      runs: 0,
      createdAt: Date.now()
    };
    db.players[id] = player;
  } else if (req.body?.name) {
    player.name = name;
  }
  grantAllSkins(player);
  saveDb(db);
  res.json({ player: publicPlayer(player), skins: SKINS });
});

app.get("/api/player/:id", (req, res) => {
  const db = loadDb();
  const player = db.players[req.params.id];
  if (!player) return res.status(404).json({ error: "not_found" });
  res.json({ player: publicPlayer(player) });
});

app.post("/api/equip", (req, res) => {
  const db = loadDb();
  const player = db.players[req.body?.id];
  const skinId = String(req.body?.skinId || "");
  if (!player) return res.status(404).json({ error: "not_found" });
  grantAllSkins(player);
  if (!player.ownedSkins.includes(skinId) && !ALL_SKIN_IDS.includes(skinId)) return res.status(400).json({ error: "locked" });
  player.equipped = skinId;
  saveDb(db);
  res.json({ player: publicPlayer(player) });
});

app.post("/api/buy", (req, res) => {
  const db = loadDb();
  const player = db.players[req.body?.id];
  const skin = SKINS.find((s) => s.id === req.body?.skinId);
  if (!player || !skin) return res.status(404).json({ error: "not_found" });
  grantAllSkins(player);
  player.equipped = skin.id;
  saveDb(db);
  res.json({ player: publicPlayer(player) });
});

app.post("/api/run", (req, res) => {
  const db = loadDb();
  const player = db.players[req.body?.id];
  if (!player) return res.status(404).json({ error: "not_found" });
  const height = Math.max(0, Math.floor(Number(req.body?.height) || 0));
  const coins = Math.max(0, Math.floor(Number(req.body?.coins) || 0));
  const pointsGained = Math.max(0, Math.floor(Number(req.body?.pointsGained) || 0));
  const skin = String(req.body?.skin || player.equipped);
  player.coins += coins;
  player.points += pointsGained;
  player.runs += 1;
  if (height > player.bestHeight) player.bestHeight = height;
  db.runs.push({
    id: crypto.randomUUID(),
    playerId: player.id,
    name: player.name,
    height,
    coins,
    pointsGained,
    skin,
    at: Date.now()
  });
  if (db.runs.length > 400) db.runs = db.runs.slice(-400);
  saveDb(db);
  res.json({ player: publicPlayer(player) });
});

app.get("/api/leaderboard", (_req, res) => {
  const db = loadDb();
  const board = Object.values(db.players)
    .sort((a, b) => b.bestHeight - a.bestHeight || b.points - a.points)
    .slice(0, 12)
    .map((p, i) => ({
      rank: i + 1,
      name: p.name,
      bestHeight: p.bestHeight,
      points: p.points,
      equipped: p.equipped
    }));
  res.json({ board });
});

app.listen(PORT, "0.0.0.0", () => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) saveDb(emptyDb());
  console.log(`Sky Climb no ar → http://localhost:${PORT}`);
});
