const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const moose = { x: 750, y: 350, width: 50, height: 50, velocityY: 0, speed: -1 }; // Start from right, move left
let points = 0;
let acorns = [];
let keys = [];
let glmrs = []; // GLMR included
let gameStarted = false;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

const startBtn = document.getElementById("startBtn");
const jumpBtn = document.getElementById("jumpBtn"); // Jump button

startBtn.addEventListener("click", () => {
    gameStarted = true;
    startBtn.style.display = "none";
    gameLoop();
});

// Jump button event
jumpBtn.addEventListener("click", () => {
    if (gameStarted && moose.y >= 350) moose.velocityY = -15;
});

// Add touch event for mobile
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (gameStarted && moose.y >= 350) moose.velocityY = -15;
});

document.addEventListener("keydown", (e) => {
    if (gameStarted && e.code === "Space" && moose.y >= 350) moose.velocityY = -15;
});

function updateMoose() {
    moose.velocityY += 1;
    moose.y += moose.velocityY;
    if (moose.y > 350) moose.y = 350;
    moose.x += moose.speed; // Negative speed for left movement
    if (moose.x < 0) moose.x = 750; // Loop back to right when reaching left edge
}

function drawMoose() {
    ctx.save();
    ctx.translate(moose.x + moose.width / 2, moose.y + moose.height / 2);
    ctx.font = "40px Arial";
    ctx.fillText("🦌", -moose.width / 2, -moose.height / 2 + 10); // Moose emoji
    ctx.restore();
}

function spawnAcorn() {
    if (gameStarted && acorns.length === 0) { // Only spawn 1 acorn at a time
        if (Math.floor(Date.now() / 3000) % 3 === 0) { // 3 seconds per acorn
            acorns.push({ x: 0, y: 300, width: 30, height: 30 }); // Left to right
        }
    }
}

function spawnKey() {
    if (gameStarted && keys.length < 1) {
        if (Math.floor(Date.now() / 60000) % 1 === 0) { // 1 minute per key
            keys.push({ x: 0, y: 300, width: 30, height: 30 }); // Left to right
        }
    }
}

function spawnGLMR() {
    if (gameStarted && glmrs.length < 1) {
        if (Math.floor(Date.now() / 120000) % 1 === 0) { // 2 minutes per GLMR
            glmrs.push({ x: 0, y: 300, width: 30, height: 30 }); // Left to right
        }
    }
}

function updateItems(items, value) {
    for (let i = 0; i < items.length; i++) {
        items[i].x += 6; // Right to left movement (corrected)
        if (moose.x < items[i].x + items[i].width && moose.x + moose.width > items[i].x &&
            moose.y < items[i].y + items[i].height && moose.y + moose.height > items[i].y) {
            points += value;
            items.splice(i, 1);
        }
        if (items[i] && items[i].x > 800) items.splice(i, 1); // Remove when off screen
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
    ctx.fillStyle = "#228B22"; // Grass color
    for (let x = 0; x < 800; x += 50) ctx.fillText("🌲", x, 350); // Grass along the road
    ctx.fillStyle = "#FFD700"; // Sun color (gold)
    ctx.font = "60px Arial";
    ctx.fillText("☀️", 700, 50); // Sun at top-right
}

function updateHUD() {
    if (points > highScore) {
        highScore = points;
        localStorage.setItem("highScore", highScore); // Save high score
    }
    document.getElementById("glmrCount").textContent = glmrs.length; // GLMR count
    document.getElementById("acornCount").textContent = acorns.length; // Acorn count
    document.getElementById("keyCount").textContent = keys.length; // Key count
    document.getElementById("points").textContent = points; // Total score
    document.getElementById("highScore").textContent = highScore; // High score
}

function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, 800, 400);
    drawBackground();
    updateMoose();
    drawMoose();
    spawnAcorn(); // 3 seconds per acorn, single at a time
    spawnKey();   // 1 minute per key
    spawnGLMR();  // 2 minutes per GLMR
    updateItems(acorns, 5);  // 5 points for acorn
    updateItems(keys, 20);   // 20 points for key
    updateItems(glmrs, 50);  // 50 points for GLMR
    drawItems(acorns, "🌰");
    drawItems(keys, "🗝");
    updateHUD();
    requestAnimationFrame(gameLoop);
}