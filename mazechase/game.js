// Game constants
const TILE_SIZE = 40;
const MAZE_WIDTH = 20;
const MAZE_HEIGHT = 15;
const PLAYER_SIZE = 20;
const MOVE_DELAY = 100; // milliseconds between moves (0-200 recommended)
const ENEMY_MOVE_DELAY = 300; // Enemy moves slower
const MAX_LIVES = 5;

// Sound effects using Web Audio API
function playSound(frequency, duration, type = 'sine') {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        // Silently ignore audio errors
    }
}

// Sound effect for collecting a letter
function playSoundCollectLetter() {
    playSound(800, 0.1);
    setTimeout(() => playSound(1000, 0.1), 100);
}

// Sound effect for losing a life
function playSoundLoseLive() {
    playSound(400, 0.2);
    setTimeout(() => playSound(300, 0.2), 200);
}

// Sound effect for winning the game
function playSoundWin() {
    playSound(800, 0.1);
    setTimeout(() => playSound(1000, 0.1), 100);
    setTimeout(() => playSound(1200, 0.2), 200);
}

// Sound effect for game over
function playSoundGameOver() {
    playSound(500, 0.2);
    setTimeout(() => playSound(400, 0.2), 200);
    setTimeout(() => playSound(300, 0.3), 400);
}

// Initialize canvas references
let canvas;
let ctx;

// Game state
let gameState = {
    targetWord: 'HELLO',
    collectedLetters: '',
    score: 0,
    gameWon: false,
    gameLost: false,
    lives: MAX_LIVES,
    playerX: 1,
    playerY: 1,
    enemy: {
        x: 1,
        y: 1,
        lastMoveTime: 0,
        direction: 'right' // idle, left, right, up, down
    },
    maze: [],
    letterPositions: [],
    collectedPositions: new Set(),
    gameRunning: false,
    lastMoveTime: 0,
    nextLetterIndex: 0
};

// Player movement
const keys = {};
const gameKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'W', 'A', 'S', 'D'];

window.addEventListener('keydown', (e) => {
    // Don't capture keys when typing in input field
    if (document.activeElement.tagName === 'INPUT') {
        return;
    }
    
    const key = e.key.toUpperCase();
    keys[key] = true;
    // Only prevent default for game control keys
    if (gameKeys.includes(key)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    // Don't capture keys when typing in input field
    if (document.activeElement.tagName === 'INPUT') {
        return;
    }
    
    keys[e.key.toUpperCase()] = false;
});

// Touch support for mobile devices
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30; // minimum distance for swipe

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!gameState.gameRunning) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Only process if there's meaningful movement (not just a tap)
    if (distance > SWIPE_THRESHOLD) {
        // Detect swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > SWIPE_THRESHOLD) {
                triggerMove('ARROWRIGHT', 'D');
            } else if (deltaX < -SWIPE_THRESHOLD) {
                triggerMove('ARROWLEFT', 'A');
            }
        } else {
            // Vertical swipe
            if (deltaY > SWIPE_THRESHOLD) {
                triggerMove('ARROWDOWN', 'S');
            } else if (deltaY < -SWIPE_THRESHOLD) {
                triggerMove('ARROWUP', 'W');
            }
        }
    }
}, { passive: true });

// Helper function to trigger movement
function triggerMove(keyCode, charKey) {
    keys[keyCode] = true;
    keys[charKey] = true;
    setTimeout(() => {
        keys[keyCode] = false;
        keys[charKey] = false;
    }, 100);
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Show/hide touch controls on mobile
function setupTouchControls() {
    const touchControls = document.getElementById('touchControls');
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    // Always show buttons (both on mobile and desktop for consistency)
    if (touchControls) {
        // Show controls on all devices for better accessibility
        touchControls.style.display = 'flex';
        
        // Setup arrow button event listeners
        setupButtonEvents(upBtn, 'ARROWUP', 'W');
        setupButtonEvents(downBtn, 'ARROWDOWN', 'S');
        setupButtonEvents(leftBtn, 'ARROWLEFT', 'A');
        setupButtonEvents(rightBtn, 'ARROWRIGHT', 'D');
    }
    
    // Update instructions based on device
    const controlsText = document.getElementById('controlsText');
    if (controlsText) {
        if (isMobileDevice()) {
            controlsText.textContent = '📱 Use arrow buttons, swipe, or tap the maze to move';
        } else {
            controlsText.textContent = '⌨️ Use WASD/Arrow Keys or click arrow buttons';
        }
    }
}

// Setup event listeners for direction buttons (works with both mouse and touch)
function setupButtonEvents(button, keyUp, keyDown) {
    if (!button) return;
    
    // Mouse events
    button.addEventListener('mousedown', () => {
        keys[keyUp] = true;
        keys[keyDown] = true;
        button.style.opacity = '0.7';
    });
    
    button.addEventListener('mouseup', () => {
        keys[keyUp] = false;
        keys[keyDown] = false;
        button.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', () => {
        keys[keyUp] = false;
        keys[keyDown] = false;
        button.style.opacity = '1';
    });
    
    // Touch events
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys[keyUp] = true;
        keys[keyDown] = true;
        button.style.opacity = '0.7';
    }, { passive: false });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys[keyUp] = false;
        keys[keyDown] = false;
        button.style.opacity = '1';
    }, { passive: false });
}

// Initialize canvas size
function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.floor(rect.width / TILE_SIZE) * TILE_SIZE;
    canvas.height = MAZE_HEIGHT * TILE_SIZE;
}

// Generate maze with letters
function generateMaze(width, height) {
    const maze = [];
    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            // Create walls and paths
            if ((x === 0 || x === width - 1 || y === 0 || y === height - 1) ||
                (x % 3 === 0 && y % 3 === 0)) {
                maze[y][x] = 1; // Wall
            } else {
                maze[y][x] = 0; // Path
            }
        }
    }

    // Ensure starting position is clear
    maze[1][1] = 0;
    maze[height - 2][width - 2] = 0;

    // Generate letter positions - pass the maze as parameter
    generateLetterPositions(maze, width, height);

    return maze;
}

// Generate letter positions based on target word
function generateLetterPositions(maze, width, height) {
    gameState.letterPositions = [];
    gameState.collectedPositions.clear();
    const word = gameState.targetWord;
    const usedPositions = new Set();

    for (let i = 0; i < word.length; i++) {
        let x, y, pos;
        do {
            x = Math.floor(Math.random() * (width - 2)) + 1;
            y = Math.floor(Math.random() * (height - 2)) + 1;
            pos = `${x},${y}`;
        } while (usedPositions.has(pos) || maze[y][x] === 1);

        usedPositions.add(pos);
        gameState.letterPositions.push({
            x,
            y,
            letter: word[i],
            index: i
        });
    }
}

// Move player
function movePlayer() {
    const now = Date.now();
    
    // Only move if enough time has passed since last move
    if (now - gameState.lastMoveTime < MOVE_DELAY) {
        return;
    }
    
    let newX = gameState.playerX;
    let newY = gameState.playerY;
    let moved = false;

    if (keys['ARROWUP'] || keys['W']) {
        newY--;
        moved = true;
    }
    if (keys['ARROWDOWN'] || keys['S']) {
        newY++;
        moved = true;
    }
    if (keys['ARROWLEFT'] || keys['A']) {
        newX--;
        moved = true;
    }
    if (keys['ARROWRIGHT'] || keys['D']) {
        newX++;
        moved = true;
    }

    // Only update timer if attempting to move
    if (moved) {
        // Check collision with maze
        if (newX > 0 && newX < canvas.width / TILE_SIZE - 1 &&
            newY > 0 && newY < MAZE_HEIGHT - 1 &&
            gameState.maze[newY][newX] === 0) {
            gameState.playerX = newX;
            gameState.playerY = newY;
            gameState.lastMoveTime = now;
        }
    }

    // Check letter collision
    checkLetterCollision();
    
    // Check enemy collision
    checkEnemyCollision();
}

// Check if player collects a letter
function checkLetterCollision() {
    // Check if we're at the exact position of the next required letter
    if (gameState.nextLetterIndex < gameState.letterPositions.length) {
        const nextLetterObj = gameState.letterPositions[gameState.nextLetterIndex];
        
        // Collect only when player is exactly on the same tile as the letter
        if (gameState.playerX === nextLetterObj.x && 
            gameState.playerY === nextLetterObj.y && 
            !gameState.collectedPositions.has(nextLetterObj.index)) {
            gameState.collectedPositions.add(nextLetterObj.index);
            gameState.collectedLetters += nextLetterObj.letter;
            gameState.score += 10;
            gameState.nextLetterIndex++;
            playSoundCollectLetter();
            updateDisplay();

            // Check win condition
            if (gameState.collectedLetters === gameState.targetWord) {
                winGame();
            }
        }
    }
}

// Check if enemy touches player
function checkEnemyCollision() {
    if (gameState.enemy.x === gameState.playerX && 
        gameState.enemy.y === gameState.playerY) {
        // Enemy caught the player!
        gameState.lives--;
        playSoundLoseLive();
        updateDisplay();
        
        if (gameState.lives <= 0) {
            loseGame();
        } else {
            // Reset player position
            gameState.playerX = 1;
            gameState.playerY = 1;
            gameState.enemy.x = Math.floor(gameState.maze[0].length / 2);
            gameState.enemy.y = Math.floor(gameState.maze.length / 2);
        }
    }
}

// Move enemy slowly around the maze
function moveEnemy() {
    const now = Date.now();
    
    // Only move if enough time has passed (slower than player)
    if (now - gameState.enemy.lastMoveTime < ENEMY_MOVE_DELAY) {
        return;
    }
    
    gameState.enemy.lastMoveTime = now;
    
    let newX = gameState.enemy.x;
    let newY = gameState.enemy.y;
    
    // Random wandering AI - pick a random direction each move
    const directions = [];
    const maxX = Math.floor(canvas.width / TILE_SIZE);
    
    // Check all possible moves
    if (newY - 1 >= 0 && newY - 1 < MAZE_HEIGHT && gameState.maze[newY - 1][newX] === 0) {
        directions.push({x: newX, y: newY - 1, dir: 'up'});
    }
    if (newY + 1 >= 0 && newY + 1 < MAZE_HEIGHT && gameState.maze[newY + 1][newX] === 0) {
        directions.push({x: newX, y: newY + 1, dir: 'down'});
    }
    if (newX - 1 >= 0 && newX - 1 < maxX && gameState.maze[newY][newX - 1] === 0) {
        directions.push({x: newX - 1, y: newY, dir: 'left'});
    }
    if (newX + 1 >= 0 && newX + 1 < maxX && gameState.maze[newY][newX + 1] === 0) {
        directions.push({x: newX + 1, y: newY, dir: 'right'});
    }
    
    // If there are possible moves, pick a random one
    if (directions.length > 0) {
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        gameState.enemy.x = randomDir.x;
        gameState.enemy.y = randomDir.y;
        gameState.enemy.direction = randomDir.dir;
    }
}

// Draw game
function draw() {
    // Check if canvas is ready
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze only if it exists
    if (gameState.maze && gameState.maze.length > 0) {
        ctx.fillStyle = '#333333';
        for (let y = 0; y < MAZE_HEIGHT; y++) {
            for (let x = 0; x < canvas.width / TILE_SIZE; x++) {
                if (gameState.maze[y] && gameState.maze[y][x] === 1) {
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        // Draw letters only if they exist
        if (gameState.letterPositions && gameState.letterPositions.length > 0) {
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let letterObj of gameState.letterPositions) {
                const x = letterObj.x * TILE_SIZE + TILE_SIZE / 2;
                const y = letterObj.y * TILE_SIZE + TILE_SIZE / 2;

                if (gameState.collectedPositions.has(letterObj.index)) {
                    // Already collected - dim it out
                    ctx.fillStyle = '#cccccc';
                    ctx.globalAlpha = 0.3;
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();
                } else if (letterObj.index === gameState.nextLetterIndex) {
                    // Next letter to collect - highlight with glow
                    ctx.fillStyle = '#FFD700';
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.arc(x, y, 22, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#FFB500';
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'white';
                } else {
                    // Other uncollected letters - normal color
                    ctx.fillStyle = '#667eea';
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'white';
                }

                ctx.fillText(letterObj.letter, x, y);
                ctx.globalAlpha = 1;
            }
        }

        // Draw player
        drawPlayer();
        
        // Draw enemy
        drawEnemy();

        // Draw grid (optional, for reference)
        ctx.strokeStyle = '#eeeeee';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= canvas.width; x += TILE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += TILE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
}

// Draw player character
function drawPlayer() {
    const x = gameState.playerX * TILE_SIZE + TILE_SIZE / 2;
    const y = gameState.playerY * TILE_SIZE + TILE_SIZE / 2;

    // Player body
    ctx.fillStyle = '#764ba2';
    ctx.beginPath();
    ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Player eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 7, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 7, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Player pupils
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x - 7, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 7, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Draw enemy character
function drawEnemy() {
    const x = gameState.enemy.x * TILE_SIZE + TILE_SIZE / 2;
    const y = gameState.enemy.y * TILE_SIZE + TILE_SIZE / 2;

    // Enemy body (red)
    ctx.fillStyle = '#dc3545';
    ctx.beginPath();
    ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Enemy eyes (yellow for spooky effect)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x - 7, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 7, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Enemy pupils (black)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 7, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 7, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Update display
function updateDisplay() {
    document.getElementById('collectedDisplay').textContent = 
        gameState.collectedLetters || '-';
    document.getElementById('scoreDisplay').textContent = 
        gameState.score;
    document.getElementById('targetDisplay').textContent = 
        gameState.targetWord;
    
    // Update lives display with heart symbols
    const livesDisplay = document.getElementById('livesDisplay');
    if (livesDisplay) {
        livesDisplay.textContent = '❤️'.repeat(gameState.lives);
    }
}

// Win game
function winGame() {
    gameState.gameWon = true;
    gameState.gameRunning = false;
    playSoundWin();
    const status = document.getElementById('status');
    status.textContent = `🎉 You Won! Collected "${gameState.collectedLetters}" in ${gameState.score} points!`;
    status.className = 'status success';
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.textContent = 'Start New Game';
        startBtn.disabled = false;
    }
}

// Lose game (all lives lost)
function loseGame() {
    gameState.gameLost = true;
    gameState.gameRunning = false;
    playSoundGameOver();
    const status = document.getElementById('status');
    status.textContent = `💀 Game Over! You lost all your lives. Collected: "${gameState.collectedLetters}"`;
    status.className = 'status error';
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.textContent = 'Try Again';
        startBtn.disabled = false;
    }
}

// Set target word
function setTargetWord() {
    const input = document.getElementById('targetWordInput');
    const word = input.value.trim();

    if (word.length === 0) {
        alert('Please enter a word');
        return;
    }

    gameState.targetWord = word;
    resetGame();
}

// Reset game
function resetGame() {
    gameState.collectedLetters = '';
    gameState.score = 0;
    gameState.gameWon = false;
    gameState.gameLost = false;
    gameState.gameRunning = false;
    gameState.lives = MAX_LIVES;
    gameState.playerX = 1;
    gameState.playerY = 1;
    gameState.collectedPositions.clear();
    gameState.maze = []; // Clear maze - will regenerate when game starts
    gameState.nextLetterIndex = 0;
    gameState.lastMoveTime = 0;

    // Reset enemy position
    gameState.enemy.x = 1;
    gameState.enemy.y = 1;
    gameState.enemy.lastMoveTime = 0;

    document.getElementById('status').className = 'status';
    document.getElementById('status').textContent = '';
    document.getElementById('feedback').textContent = '';
    
    // Update button text
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.textContent = 'Start Game';
    }

    updateDisplay();
}

// Start the game
function startGame() {
    if (gameState.gameRunning) return; // Already running
    
    // Always generate a fresh maze when starting
    gameState.maze = generateMaze(Math.floor(canvas.width / TILE_SIZE), MAZE_HEIGHT);
    gameState.gameRunning = true;
    gameState.gameWon = false;
    gameState.gameLost = false;
    gameState.collectedLetters = '';
    gameState.score = 0;
    gameState.lives = MAX_LIVES;
    gameState.playerX = 1;
    gameState.playerY = 1;
    gameState.collectedPositions.clear();
    gameState.nextLetterIndex = 0;
    gameState.lastMoveTime = Date.now();
    
    // Initialize enemy position in center of maze
    gameState.enemy.x = Math.floor((Math.floor(canvas.width / TILE_SIZE)) / 2);
    gameState.enemy.y = Math.floor(MAZE_HEIGHT / 2);
    gameState.enemy.lastMoveTime = Date.now();
    gameState.enemy.direction = 'right';
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.textContent = 'Game Running...';
        startBtn.disabled = true;
    }
    
    document.getElementById('status').className = 'status';
    document.getElementById('status').textContent = '';
    updateDisplay();
}

// Game loop
function gameLoop() {
    if (gameState.gameRunning && !gameState.gameWon && !gameState.gameLost) {
        movePlayer();
        moveEnemy();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    // Setup touch controls for mobile devices
    setupTouchControls();
    
    // Get canvas and context
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    ctx = canvas.getContext('2d');
    
    // Set up resize event listener
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Setup initial game state (without starting)
    resizeCanvas();
    gameState.gameRunning = false;
    updateDisplay();
    
    // Generate maze lazily (only when needed)
    if (!gameState.maze || gameState.maze.length === 0) {
        gameState.maze = generateMaze(Math.floor(canvas.width / TILE_SIZE), MAZE_HEIGHT);
    }
    
    // Start the render loop (but game won't move until startGame is called)
    gameLoop();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
