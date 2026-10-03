/**
 * Chrome Dino Game - Pure Vanilla JavaScript Implementation
 * Level 2 Assignment: No external libraries, pure HTML/CSS/JS.
 */

// Game Constants & Configuration
const CONFIG = {
  GRAVITY: 0.65,
  JUMP_VELOCITY: -11.5,
  DUCK_GRAVITY: 1.2,
  INITIAL_SPEED: 6.2,
  MAX_SPEED: 13.5,
  ACCELERATION: 0.0012,
  GROUND_Y: 26, // Distance from bottom of viewport in pixels
  DINO_X: 48,
  OBSTACLE_SPAWN_MIN_GAP: 380,
  OBSTACLE_SPAWN_MAX_GAP: 700,
  SCORE_INCREMENT_RATE: 0.15, // Score points per frame
};

// SVG Sprite Definitions (Authentic Pixel-Art T-Rex Dino)
const SPRITES = {
  // Dinosaur Standing / Idle
  dinoStand: `
    <svg viewBox="0 0 88 94" class="dino-sprite">
      <path fill="currentColor" d="M48 0h36v8H48zM44 8h44v8H44zM44 16h44v8H44zM44 24h44v8H44zM44 32h24v8H44zM44 40h40v8H44zM24 32h16v40H24zM16 40h24v32H16zM8 48h32v24H8zM4 56h36v16H4zM0 60h12v8H0zM0 52h8v8H0zM44 44h8v4h-8zM48 48h4v4h-4z"/>
      <rect x="52" y="12" width="8" height="8" fill="var(--bg-color)"/>
      <path fill="currentColor" d="M16 72h12v22H16zM32 72h12v22H32z"/>
    </svg>`,

  // Running Frame 1 (Left leg down, right leg up)
  dinoRun1: `
    <svg viewBox="0 0 88 94" class="dino-sprite">
      <path fill="currentColor" d="M48 0h36v8H48zM44 8h44v8H44zM44 16h44v8H44zM44 24h44v8H44zM44 32h24v8H44zM44 40h40v8H44zM24 32h16v40H24zM16 40h24v32H16zM8 48h32v24H8zM4 56h36v16H4zM0 60h12v8H0zM0 52h8v8H0zM44 44h8v4h-8zM48 48h4v4h-4z"/>
      <rect x="52" y="12" width="8" height="8" fill="var(--bg-color)"/>
      <!-- Legs: Left down, Right lifted -->
      <path fill="currentColor" d="M16 72h12v22H16zM32 72h20v8H40v14h-8z"/>
    </svg>`,

  // Running Frame 2 (Right leg down, left leg up)
  dinoRun2: `
    <svg viewBox="0 0 88 94" class="dino-sprite">
      <path fill="currentColor" d="M48 0h36v8H48zM44 8h44v8H44zM44 16h44v8H44zM44 24h44v8H44zM44 32h24v8H44zM44 40h40v8H44zM24 32h16v40H24zM16 40h24v32H16zM8 48h32v24H8zM4 56h36v16H4zM0 60h12v8H0zM0 52h8v8H0zM44 44h8v4h-8zM48 48h4v4h-4z"/>
      <rect x="52" y="12" width="8" height="8" fill="var(--bg-color)"/>
      <!-- Legs: Left lifted, Right down -->
      <path fill="currentColor" d="M16 72h12v12h12v8H16zM32 72h12v22H32z"/>
    </svg>`,

  // Crashed / Dead Dino with X eye
  dinoDead: `
    <svg viewBox="0 0 88 94" class="dino-sprite">
      <path fill="currentColor" d="M48 0h36v8H48zM44 8h44v8H44zM44 16h44v8H44zM44 24h44v8H44zM44 32h24v8H44zM44 40h40v8H44zM24 32h16v40H24zM16 40h24v32H16zM8 48h32v24H8zM4 56h36v16H4zM0 60h12v8H0zM0 52h8v8H0zM44 44h8v4h-8zM48 48h4v4h-4z"/>
      <!-- X Eye -->
      <polygon points="50,10 54,14 58,10 62,14 58,18 62,22 58,26 54,22 50,26 46,22 50,18 46,14" fill="var(--bg-color)"/>
      <path fill="currentColor" d="M16 72h12v22H16zM32 72h12v22H32z"/>
    </svg>`,

  // Ducking Frame 1
  dinoDuck1: `
    <svg viewBox="0 0 118 60" class="dino-sprite">
      <path fill="currentColor" d="M0 20h12v8H0zM0 12h8v8H0zM4 24h36v16H4zM8 16h32v24H8zM16 8h48v32H16zM24 0h94v12H24zM70 12h48v8H70zM70 20h20v8H70z"/>
      <rect x="100" y="4" width="8" height="8" fill="var(--bg-color)"/>
      <path fill="currentColor" d="M24 40h12v20H24zM56 40h20v8H68v12h-12z"/>
    </svg>`,

  // Ducking Frame 2
  dinoDuck2: `
    <svg viewBox="0 0 118 60" class="dino-sprite">
      <path fill="currentColor" d="M0 20h12v8H0zM0 12h8v8H0zM4 24h36v16H4zM8 16h32v24H8zM16 8h48v32H16zM24 0h94v12H24zM70 12h48v8H70zM70 20h20v8H70z"/>
      <rect x="100" y="4" width="8" height="8" fill="var(--bg-color)"/>
      <path fill="currentColor" d="M24 40h12v10h12v10H24zM56 40h12v20H56z"/>
    </svg>`,

  // Single Small Cactus
  cactusSmall: `
    <svg viewBox="0 0 34 70">
      <path fill="currentColor" d="M12 0h10v70H12zM0 16h6v26h6v8H6V32H0zM22 22h6v8h6v-8h-6V12h-6z"/>
    </svg>`,

  // Double Small Cactus
  cactusDouble: `
    <svg viewBox="0 0 68 70">
      <path fill="currentColor" d="M10 0h10v70H10zM0 16h5v26h5v8H5V32H0zM20 22h5v8h5v-8h-5V12h-5z"/>
      <path fill="currentColor" d="M44 4h10v66H44zM34 20h5v24h5v8H39V34H34zM54 24h5v8h5v-8h-5V16h-5z"/>
    </svg>`,

  // Tall Large Cactus
  cactusTall: `
    <svg viewBox="0 0 50 100">
      <path fill="currentColor" d="M18 0h14v100H18zM0 24h10v36h8v10H10V42H0zM32 30h8v12h10v-12h-10V18h-8z"/>
    </svg>`,

  // Triple Cactus Cluster
  cactusCluster: `
    <svg viewBox="0 0 100 70">
      <path fill="currentColor" d="M12 4h8v66h-8zM2 18h4v20h6v6H6V28H2zM20 22h4v8h4v-8h-4V14h-4z"/>
      <path fill="currentColor" d="M44 0h10v70H44zM34 16h5v26h5v8H39V32H34zM54 22h5v8h5v-8h-5V12h-5z"/>
      <path fill="currentColor" d="M78 8h8v62h-8zM68 22h4v18h6v6h-6v-16h-4zM86 24h4v6h4v-6h-4V16h-4z"/>
    </svg>`,

  // Pterodactyl Wings Up
  pteroUp: `
    <svg viewBox="0 0 92 68">
      <path fill="currentColor" d="M0 24h16v8h12v8h16v-8h12v-8h8V8h8v8h8v8h12v8H72v8H56v8H44v8H32v-8H16v-8H0v-8z"/>
      <rect x="68" y="24" width="4" height="4" fill="var(--bg-color)"/>
      <path fill="currentColor" d="M44 0h8v16h-8zM52 4h8v12h-8zM60 8h8v8h-8z"/>
    </svg>`,

  // Pterodactyl Wings Down
  pteroDown: `
    <svg viewBox="0 0 92 68">
      <path fill="currentColor" d="M0 24h16v8h12v8h16v-8h12v-8h8V8h8v8h8v8h12v8H72v8H56v8H44v8H32v-8H16v-8H0v-8z"/>
      <rect x="68" y="24" width="4" height="4" fill="var(--bg-color)"/>
      <path fill="currentColor" d="M44 48h8v16h-8zM52 44h8v12h-8zM60 40h8v8h-8z"/>
    </svg>`
};

// Web Audio API Synthesizer (Zero external dependencies)
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('dino_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('dino_sound_muted', this.muted);
    return this.muted;
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback silent fail
    }
  }

  playMilestone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.28);
    } catch (e) {
      // Silent catch
    }
  }

  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {
      // Silent catch
    }
  }
}

// Game Controller Class
class DinoGame {
  constructor() {
    // DOM Element References
    this.viewport = document.getElementById('gameViewport');
    this.dinoEl = document.getElementById('dinoCharacter');
    this.groundLine = document.getElementById('groundLine');
    this.obstaclesContainer = document.getElementById('obstaclesLayer');
    this.scoreCurrentEl = document.getElementById('scoreCurrent');
    this.scoreHiEl = document.getElementById('scoreHi');
    this.gameOverModal = document.getElementById('gameOverModal');
    this.finalScoreEl = document.getElementById('finalScore');
    this.finalHiScoreEl = document.getElementById('finalHiScore');
    this.resetBtn = document.getElementById('resetButton');
    this.startPrompt = document.getElementById('startPrompt');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.jumpTouchBtn = document.getElementById('jumpTouchBtn');
    this.duckTouchBtn = document.getElementById('duckTouchBtn');

    // Audio System
    this.sound = new SoundSystem();
    this.updateSoundButtonUI();

    // Game State
    this.state = 'IDLE'; // 'IDLE', 'PLAYING', 'GAMEOVER'
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('dino_hi_score') || '0', 10);
    this.gameSpeed = CONFIG.INITIAL_SPEED;
    this.distance = 0;
    this.nextObstacleDistance = 300;
    this.lastMilestone = 0;

    // Dino Physics & Animation
    this.dinoY = 0; // Height above ground
    this.dinoVelocityY = 0;
    this.isJumping = false;
    this.isDucking = false;
    this.runFrame = 0;
    this.animTick = 0;
    this.groundOffset = 0;

    // Entities
    this.obstacles = [];
    this.clouds = [];
    this.dustParticles = [];

    // Timing
    this.lastTime = null;
    this.rafId = null;

    // Initialize Viewport and Listeners
    this.init();
  }

  init() {
    this.updateHighScoreDisplay();
    this.setDinoSprite('dinoStand');
    this.setupEventListeners();
    this.createInitialClouds();
  }

  setupEventListeners() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.handleJumpPress();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.handleDuckPress(true);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.handleDuckPress(false);
      }
    });

    // Viewport click/tap to jump or start
    this.viewport.addEventListener('pointerdown', (e) => {
      if (this.state === 'GAMEOVER') return;
      this.handleJumpPress();
    });

    // Reset button
    this.resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.restartGame();
    });

    // Mobile touch buttons
    if (this.jumpTouchBtn) {
      this.jumpTouchBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handleJumpPress();
      });
    }

    if (this.duckTouchBtn) {
      this.duckTouchBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handleDuckPress(true);
      });
      this.duckTouchBtn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        this.handleDuckPress(false);
      });
      this.duckTouchBtn.addEventListener('pointerleave', (e) => {
        this.handleDuckPress(false);
      });
    }

    // Header Sound & Theme Buttons
    this.soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.init();
      const isMuted = this.sound.toggleMute();
      this.updateSoundButtonUI();
    });

    this.themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('night-mode');
    });

    // Prevent spacebar scrolling page
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
      }
    });
  }

  updateSoundButtonUI() {
    this.soundToggleBtn.textContent = this.sound.muted ? '🔇 Sound Off' : '🔊 Sound On';
  }

  handleJumpPress() {
    this.sound.init();

    if (this.state === 'IDLE') {
      this.startGame();
      this.triggerJump();
    } else if (this.state === 'PLAYING') {
      if (!this.isJumping) {
        this.triggerJump();
      }
    } else if (this.state === 'GAMEOVER') {
      this.restartGame();
    }
  }

  triggerJump() {
    this.isJumping = true;
    this.isDucking = false;
    this.dinoVelocityY = CONFIG.JUMP_VELOCITY;
    this.sound.playJump();
    this.spawnDust(CONFIG.DINO_X + 16, CONFIG.GROUND_Y);
  }

  handleDuckPress(isDucking) {
    if (this.state !== 'PLAYING') return;

    if (isDucking) {
      this.isDucking = true;
      if (this.isJumping) {
        this.dinoVelocityY += CONFIG.DUCK_GRAVITY * 4;
      }
    } else {
      this.isDucking = false;
    }
  }

  startGame() {
    this.state = 'PLAYING';
    this.startPrompt.style.display = 'none';
    this.gameOverModal.classList.remove('active');
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  restartGame() {
    this.obstacles.forEach(obs => obs.el.remove());
    this.obstacles = [];

    this.score = 0;
    this.gameSpeed = CONFIG.INITIAL_SPEED;
    this.distance = 0;
    this.nextObstacleDistance = 350;
    this.dinoY = 0;
    this.dinoVelocityY = 0;
    this.isJumping = false;
    this.isDucking = false;
    this.lastMilestone = 0;
    this.updateScoreDisplay();

    this.updateDinoPosition();
    this.setDinoSprite('dinoRun1');

    this.gameOverModal.classList.remove('active');
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  gameOver() {
    this.state = 'GAMEOVER';
    cancelAnimationFrame(this.rafId);

    this.setDinoSprite('dinoDead');
    this.sound.playHit();

    const finalScore = Math.floor(this.score);
    if (finalScore > this.highScore) {
      this.highScore = finalScore;
      localStorage.setItem('dino_hi_score', this.highScore);
      this.updateHighScoreDisplay();
    }

    this.finalScoreEl.textContent = this.padScore(finalScore);
    this.finalHiScoreEl.textContent = this.padScore(this.highScore);
    this.gameOverModal.classList.add('active');

    this.resetBtn.focus();
  }

  gameLoop(currentTime) {
    if (this.state !== 'PLAYING') return;

    const delta = Math.min((currentTime - this.lastTime) / 16.666, 2.5);
    this.lastTime = currentTime;

    this.gameSpeed = Math.min(CONFIG.MAX_SPEED, this.gameSpeed + (CONFIG.ACCELERATION * delta));
    this.distance += this.gameSpeed * delta;
    this.score += CONFIG.SCORE_INCREMENT_RATE * delta * (this.gameSpeed / CONFIG.INITIAL_SPEED);
    this.updateScoreDisplay();

    const currentMilestone = Math.floor(this.score / 100);
    if (currentMilestone > this.lastMilestone) {
      this.lastMilestone = currentMilestone;
      this.triggerMilestone();
    }

    this.updateDinoPhysics(delta);
    this.updateGround(delta);
    this.updateClouds(delta);
    this.updateObstacles(delta);
    this.updateDust(delta);

    if (this.checkCollisions()) {
      this.gameOver();
      return;
    }

    this.rafId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  updateDinoPhysics(delta) {
    if (this.isJumping) {
      const gravity = this.isDucking ? CONFIG.DUCK_GRAVITY : CONFIG.GRAVITY;
      this.dinoVelocityY += gravity * delta;
      this.dinoY -= this.dinoVelocityY * delta;

      if (this.dinoY <= 0) {
        this.dinoY = 0;
        this.dinoVelocityY = 0;
        this.isJumping = false;
        this.spawnDust(CONFIG.DINO_X + 16, CONFIG.GROUND_Y);
      }
    }

    this.animTick += delta;
    if (this.animTick >= 5) {
      this.animTick = 0;
      this.runFrame = this.runFrame === 1 ? 2 : 1;
    }

    if (this.isJumping) {
      this.setDinoSprite('dinoStand');
    } else if (this.isDucking) {
      this.setDinoSprite(this.runFrame === 1 ? 'dinoDuck1' : 'dinoDuck2');
    } else {
      this.setDinoSprite(this.runFrame === 1 ? 'dinoRun1' : 'dinoRun2');
    }

    this.updateDinoPosition();
  }

  updateDinoPosition() {
    this.dinoEl.style.bottom = `${CONFIG.GROUND_Y + this.dinoY}px`;
    if (this.isDucking && !this.isJumping) {
      this.dinoEl.style.width = '59px';
      this.dinoEl.style.height = '30px';
    } else {
      this.dinoEl.style.width = '44px';
      this.dinoEl.style.height = '48px';
    }
  }

  setDinoSprite(spriteKey) {
    if (this.currentDinoSprite !== spriteKey) {
      this.currentDinoSprite = spriteKey;
      this.dinoEl.innerHTML = SPRITES[spriteKey];
    }
  }

  updateGround(delta) {
    this.groundOffset = (this.groundOffset + (this.gameSpeed * delta)) % 2400;
    this.groundLine.style.transform = `translateX(-${this.groundOffset % 600}px)`;
  }

  createInitialClouds() {
    for (let i = 0; i < 3; i++) {
      this.spawnCloud(200 + i * 280);
    }
  }

  spawnCloud(initialX = null) {
    const cloudEl = document.createElement('div');
    cloudEl.className = 'cloud';
    cloudEl.innerHTML = `
      <svg width="46" height="14" viewBox="0 0 92 28">
        <path fill="currentColor" d="M18 10h12v-6h12v-4h20v4h12v6h18v18H0V16h18v-6z"/>
      </svg>
    `;
    const viewportWidth = this.viewport.offsetWidth || 800;
    const x = initialX !== null ? initialX : viewportWidth + Math.random() * 200;
    const y = 30 + Math.random() * 70;
    const speed = 0.8 + Math.random() * 0.6;

    cloudEl.style.left = `${x}px`;
    cloudEl.style.top = `${y}px`;
    this.viewport.appendChild(cloudEl);

    this.clouds.push({ el: cloudEl, x, y, speed });
  }

  updateClouds(delta) {
    const viewportWidth = this.viewport.offsetWidth || 800;
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      const c = this.clouds[i];
      c.x -= c.speed * delta;
      c.el.style.left = `${c.x}px`;

      if (c.x < -100) {
        c.el.remove();
        this.clouds.splice(i, 1);
        this.spawnCloud(viewportWidth + 50);
      }
    }
  }

  updateObstacles(delta) {
    const viewportWidth = this.viewport.offsetWidth || 800;

    if (this.distance >= this.nextObstacleDistance) {
      this.spawnObstacle(viewportWidth + 20);
      const gapVariance = Math.random() * (CONFIG.OBSTACLE_SPAWN_MAX_GAP - CONFIG.OBSTACLE_SPAWN_MIN_GAP);
      this.nextObstacleDistance = this.distance + CONFIG.OBSTACLE_SPAWN_MIN_GAP + gapVariance;
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.gameSpeed * delta;
      obs.el.style.left = `${obs.x}px`;

      if (obs.type === 'ptero') {
        obs.flapTick = (obs.flapTick || 0) + delta;
        if (obs.flapTick >= 8) {
          obs.flapTick = 0;
          obs.frame = obs.frame === 'pteroUp' ? 'pteroDown' : 'pteroUp';
          obs.el.innerHTML = SPRITES[obs.frame];
        }
      }

      if (obs.x < -120) {
        obs.el.remove();
        this.obstacles.splice(i, 1);
      }
    }
  }

  spawnObstacle(x) {
    const canSpawnPtero = this.score > 250;
    const roll = Math.random();

    let type = 'cactusSmall';
    let width = 17;
    let height = 35;
    let bottom = CONFIG.GROUND_Y;

    if (canSpawnPtero && roll > 0.72) {
      type = 'ptero';
      width = 46;
      height = 34;
      const heights = [CONFIG.GROUND_Y + 12, CONFIG.GROUND_Y + 48, CONFIG.GROUND_Y + 85];
      bottom = heights[Math.floor(Math.random() * heights.length)];
    } else if (roll > 0.55) {
      type = 'cactusCluster';
      width = 50;
      height = 35;
    } else if (roll > 0.35) {
      type = 'cactusDouble';
      width = 34;
      height = 35;
    } else if (roll > 0.20) {
      type = 'cactusTall';
      width = 25;
      height = 50;
    }

    const obsEl = document.createElement('div');
    obsEl.className = `obstacle ${type === 'ptero' ? 'pterodactyl' : ''}`;
    obsEl.style.width = `${width}px`;
    obsEl.style.height = `${height}px`;
    obsEl.style.left = `${x}px`;
    obsEl.style.bottom = `${bottom}px`;
    obsEl.innerHTML = SPRITES[type === 'ptero' ? 'pteroUp' : type];

    this.obstaclesContainer.appendChild(obsEl);

    this.obstacles.push({
      el: obsEl,
      type,
      x,
      bottom,
      width,
      height,
      frame: 'pteroUp',
      flapTick: 0
    });
  }

  spawnDust(x, y) {
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('div');
      p.className = 'dust-particle';
      const size = 2 + Math.floor(Math.random() * 3);
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      const px = x + (Math.random() * 14 - 7);
      const py = y + (Math.random() * 6);
      p.style.left = `${px}px`;
      p.style.bottom = `${py}px`;
      this.viewport.appendChild(p);

      this.dustParticles.push({
        el: p,
        x: px,
        y: py,
        vx: -(this.gameSpeed * 0.4 + Math.random() * 2),
        vy: 1 + Math.random() * 2,
        life: 1.0
      });
    }
  }

  updateDust(delta) {
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.life -= 0.08 * delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;

      p.el.style.left = `${p.x}px`;
      p.el.style.bottom = `${p.y}px`;
      p.el.style.opacity = Math.max(0, p.life);

      if (p.life <= 0) {
        p.el.remove();
        this.dustParticles.splice(i, 1);
      }
    }
  }

  checkCollisions() {
    const dinoIsDucking = this.isDucking && !this.isJumping;
    const dinoWidth = dinoIsDucking ? 56 : 42;
    const dinoHeight = dinoIsDucking ? 28 : 46;

    const dinoLeft = CONFIG.DINO_X + 6;
    const dinoRight = CONFIG.DINO_X + dinoWidth - 6;
    const dinoBottom = CONFIG.GROUND_Y + this.dinoY;
    const dinoTop = dinoBottom + dinoHeight - 4;

    for (const obs of this.obstacles) {
      const obsPaddingX = 4;
      const obsPaddingY = 3;
      const obsLeft = obs.x + obsPaddingX;
      const obsRight = obs.x + obs.width - obsPaddingX;
      const obsBottom = obs.bottom + obsPaddingY;
      const obsTop = obs.bottom + obs.height - obsPaddingY;

      const intersects = (
        dinoLeft < obsRight &&
        dinoRight > obsLeft &&
        dinoBottom < obsTop &&
        dinoTop > obsBottom
      );

      if (intersects) {
        return true;
      }
    }

    return false;
  }

  triggerMilestone() {
    this.sound.playMilestone();
    this.scoreCurrentEl.classList.add('milestone');
    setTimeout(() => {
      this.scoreCurrentEl.classList.remove('milestone');
    }, 1800);

    if (this.lastMilestone % 7 === 0) {
      document.body.classList.toggle('night-mode');
    }
  }

  padScore(val) {
    return String(Math.floor(val)).padStart(5, '0');
  }

  updateScoreDisplay() {
    this.scoreCurrentEl.textContent = this.padScore(this.score);
  }

  updateHighScoreDisplay() {
    this.scoreHiEl.textContent = `HI ${this.padScore(this.highScore)}`;
  }
}

// Instantiate game on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.dinoGameInstance = new DinoGame();
});