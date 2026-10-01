// Configuração inicial do Canvas e Contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste o tamanho do canvas conforme o seu layout
canvas.width = 400;
canvas.height = 600;

// Variáveis globais do jogo
let globalTime = 0;
let cameraY = 0;
let equippedSkin = "default"; // Nome da skin atual

// Objeto do Jogador
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vy: 0,
    radius: 20,
    squashPulse: 0,
    tilt: 0,
    magnet: 0,
    umbrella: false
};

// Função principal de desenho do jogador
function drawPlayer() {
    const sy = player.y - cameraY;
    ctx.save();
    ctx.translate(player.x, sy);

    const velFactor = Math.max(-1, Math.min(1, player.vy / 900));
    let bodySx = 1 - velFactor * 0.12, bodySy = 1 + velFactor * 0.12;
    if (player.squashPulse > 0) { 
        const s = Math.min(1, player.squashPulse); 
        bodySx = 1 + s * 0.32; 
        bodySy = 1 - s * 0.32; 
    }
    ctx.rotate(player.tilt); 
    ctx.scale(bodySx, bodySy);

    // Efeito de Ímã (se ativo)
    if (player.magnet > 0) {
        ctx.strokeStyle = `rgba(122,208,255,${0.25 + Math.sin(globalTime * 8) * 0.15})`;
        ctx.lineWidth = 2; 
        ctx.beginPath(); 
        ctx.arc(0, 0, 28 + Math.sin(globalTime * 6) * 3, 0, Math.PI * 2); 
        ctx.stroke();
    }

    // Guarda-chuva (se ativo)
    if (player.umbrella) { 
        ctx.save(); 
        ctx.translate(0, -46); 
        ctx.scale(0.9, 0.9); 
        ctx.fillStyle = "#ff5555";
        ctx.beginPath();
        ctx.arc(0, 0, 20, Math.PI, 0, false);
        ctx.fill();
        ctx.restore(); 
    }

    // RENDERIZAÇÃO DA SKIN COM FALLBACK DE SEGURANÇA
    // Se o seu 'skins.js' carregar corretamente, ele usa o SkinArt.
    // Se falhar ou demorar, ele desenha o bixinho padrão para não sumir nunca!
    if (window.SkinArt && typeof window.SkinArt.draw === "function") {
        window.SkinArt.draw(ctx, equippedSkin, globalTime);
    } else {
        // Fallback: Desenho padrão de um bixinho fofo/rosa
        ctx.fillStyle = "#ff7299";
        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        ctx.fill();

        // Olhos
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-6, -4, 5, 0, Math.PI * 2);
        ctx.arc(6, -4, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pupilas
        ctx.fillStyle = "#222222";
        ctx.beginPath();
        ctx.arc(-5, -4, 2.5, 0, Math.PI * 2);
        ctx.arc(7, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Atualização de lógica por frame
function update() {
    globalTime += 0.016; // Incrementa o tempo do jogo (~60fps)
    
    // Pequeno movimento lateral de teste para o player não ficar estático
    player.x = (canvas.width / 2) + Math.sin(globalTime * 2) * 50;
}

// Renderização geral da tela
function draw() {
    // Limpa a tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o jogador na posição correta
    drawPlayer();
}

// Loop principal do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();
