const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const moose = { x: 50, y: 350, width: 50, height: 50, velocityY: 0, speed: 1 }; // Very slow
let points = 0;
let acorns = [];
let keys = [];
let glmrs = []; // GLMR included
let gameStarted = false;

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
    gameStarted = true;
    startBtn.style.display = "none";
    gameLoop();
});

document.addEventListener("keydown", (e) => {
    if (gameStarted && e.code === "Space" && moose.y >= 350) moose.velocityY = -15;
});

function updateMoose() {
    moose.velocityY += 1;
    moose.y += moose.velocityY;
    if (moose.y > 350) moose.y = 350;
    moose.x += moose.speed;
    if (moose.x > 800) moose.x = -moose.width; // Infinite loop
}

function drawMoose() {
    ctx.save();
    ctx.translate(moose.x + moose.width / 2, moose.y + moose.height / 2);
    ctx.font = "40px Arial";
    ctx.fillText("🦌", -moose.width / 2, -moose.height / 2 + 10); // Moose emoji
    ctx.restore();
}

function spawnAcorn() {
    if (gameStarted && acorns.length < 5) acorns.push({ x: 800, y: 300, width: 30, height: 30 });
}

function spawnKey() {
    if (gameStarted && keys.length < 1 && Math.floor(Date.now() / 60000) % 1 === 0) {
        keys.push({ x: 800, y: 300, width: 30, height: 30 }); // 1 key per minute
    }
}

function spawnGLMR() {
    if (gameStarted && glmrs.length < 1 && Math.floor(Date.now() / 120000) % 1 === 0) { // 2 min per GLMR
        glmrs.push({ x: 800, y: 300, width: 30, height: 30 });
    }
}

function updateItems(items, value) {
    for (let i = 0; i < items.length; i++) {
        items[i].x -= 2;
        if (moose.x < items[i].x + items[i].width && moose.x + moose.width > items[i].x &&
            moose.y < items[i].y + items[i].height && moose.y + moose.height > items[i].y) {
            points += value;
            items.splice(i, 1);
        }
        if (items[i] && items[i].x < 0) items.splice(i, 1);
    }
}

function drawItems(items, emoji) {
    ctx.font = "30px Arial";
    for (let item of items) ctx.fillText(emoji, item.x, item.y);
}

function drawBackground() {
    ctx.fillStyle = "#800080"; // Purple mix of red and blue
    ctx.fillRect(0, 0, 800, 400); // Full canvas background
    ctx.fillStyle = "#666"; // Road color
    ctx.fillRect(0, 350, 800, 50); // Infinite road
    ctx.fillStyle = "#228B22"; // Trees color
    for (let x = 0; x < 800; x += 50) ctx.fillText("🌲", x, 300); // Trees on road
    ctx.fillStyle = "#FFD700"; // Sun color (gold)
    ctx.font = "60px Arial";
    ctx.fillText("☀", 700, 50); // Sun at top-right
}

function updateHUD() {
    document.getElementById("glmrCount").textContent = glmrs.length; // GLMR count
    document.getElementById("acornCount").textContent = acorns.length; // Acorn count
    document.getElementById("keyCount").textContent = keys.length; // Key count
    document.getElementById("points").textContent = points; // Total score
}

function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, 800, 400);
    drawBackground();
    updateMoose();
    drawMoose();
    if (Math.floor(Date.now() / 3000) % 3 === 0) spawnAcorn(); // 3 seconds per acorn
    spawnKey(); // 1 minute per key
    spawnGLMR(); // 2 minutes per GLMR
    updateItems(acorns, 5);  // 5 points for acorn
    updateItems(keys, 20);   // 20 points for key
    updateItems(glmrs, 50);  // 50 points for GLMR
    drawItems(acorns, "🌰");
    drawItems(keys, "🗝️");
    drawItems(glmrs, "💎");
    updateHUD();
    requestAnimationFrame(gameLoop);
}