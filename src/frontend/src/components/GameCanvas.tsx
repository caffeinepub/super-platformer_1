import { ArrowLeft, Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSubmitScore } from "../hooks/useQueries";

// ─── Constants ────────────────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 600;
const LEVEL_W = 3200;
const GRAVITY = 1600;
const PLAYER_SPEED = 230;
const JUMP_VEL = -580;
const PLAYER_W = 32;
const PLAYER_H = 40;
const ENEMY_W = 32;
const ENEMY_H = 28;
const COIN_R = 9;
const GOAL_X = 3050;

type GameState = "TITLE" | "PLAYING" | "DEAD" | "GAME_OVER" | "WIN";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  lives: number;
  score: number;
  coins: number;
  facingRight: boolean;
  deathTimer: number;
  isDying: boolean;
  blinkTimer: number;
  invincible: number;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
  animOffset: number;
}

interface Enemy {
  x: number;
  y: number;
  vx: number;
  defeated: boolean;
  defeatTimer: number;
  patrolLeft: number;
  patrolRight: number;
  walkAnim: number;
}

interface Cloud {
  x: number;
  y: number;
  w: number;
  speed: number;
}

// ─── Level data ───────────────────────────────────────────────────────────────
const GROUND: Platform = { x: 0, y: 540, w: LEVEL_W, h: 60 };

const PLATFORMS: Platform[] = [
  GROUND,
  // World 1 – intro area
  { x: 120, y: 450, w: 110, h: 20 },
  { x: 280, y: 390, w: 100, h: 20 },
  { x: 430, y: 460, w: 120, h: 20 },
  { x: 600, y: 400, w: 130, h: 20 },
  { x: 760, y: 340, w: 110, h: 20 },
  { x: 920, y: 450, w: 100, h: 20 },
  { x: 1060, y: 380, w: 130, h: 20 },
  { x: 1220, y: 310, w: 140, h: 20 },
  // World 2 – mid section
  { x: 1400, y: 460, w: 90, h: 20 },
  { x: 1550, y: 390, w: 120, h: 20 },
  { x: 1700, y: 460, w: 110, h: 20 },
  { x: 1850, y: 330, w: 150, h: 20 },
  { x: 2020, y: 450, w: 100, h: 20 },
  { x: 2170, y: 380, w: 120, h: 20 },
  { x: 2320, y: 300, w: 130, h: 20 },
  { x: 2480, y: 420, w: 110, h: 20 },
  // World 3 – endgame
  { x: 2640, y: 350, w: 140, h: 20 },
  { x: 2810, y: 270, w: 160, h: 20 },
  { x: 2990, y: 400, w: 200, h: 20 }, // goal platform
];

const INIT_COINS: Omit<Coin, "collected" | "animOffset">[] = [
  // On ground
  { x: 200, y: 510 },
  { x: 240, y: 510 },
  { x: 280, y: 510 },
  { x: 500, y: 510 },
  { x: 540, y: 510 },
  { x: 800, y: 510 },
  { x: 840, y: 510 },
  // On platforms
  { x: 155, y: 420 },
  { x: 185, y: 420 },
  { x: 310, y: 360 },
  { x: 340, y: 360 },
  { x: 460, y: 430 },
  { x: 495, y: 430 },
  { x: 630, y: 370 },
  { x: 665, y: 370 },
  { x: 800, y: 310 },
  { x: 830, y: 310 },
  { x: 950, y: 420 },
  { x: 1090, y: 350 },
  { x: 1130, y: 350 },
  { x: 1260, y: 280 },
  { x: 1300, y: 280 },
  // Mid section
  { x: 1580, y: 360 },
  { x: 1615, y: 360 },
  { x: 1880, y: 300 },
  { x: 1920, y: 300 },
  { x: 1960, y: 300 },
  { x: 2200, y: 350 },
  { x: 2235, y: 350 },
  { x: 2355, y: 270 },
  { x: 2390, y: 270 },
  // Endgame
  { x: 2670, y: 320 },
  { x: 2710, y: 320 },
  { x: 2845, y: 240 },
  { x: 2880, y: 240 },
  { x: 2915, y: 240 },
  { x: 3020, y: 370 },
  { x: 3060, y: 370 },
  { x: 3100, y: 370 },
];

const INIT_ENEMIES: Omit<Enemy, "defeated" | "defeatTimer" | "walkAnim">[] = [
  { x: 350, y: 508, vx: -80, patrolLeft: 250, patrolRight: 520 },
  { x: 700, y: 508, vx: 80, patrolLeft: 600, patrolRight: 900 },
  { x: 480, y: 428, vx: -60, patrolLeft: 430, patrolRight: 550 },
  { x: 1100, y: 508, vx: -90, patrolLeft: 980, patrolRight: 1200 },
  { x: 1260, y: 278, vx: 70, patrolLeft: 1220, patrolRight: 1360 },
  { x: 1500, y: 508, vx: -80, patrolLeft: 1380, patrolRight: 1600 },
  { x: 1730, y: 428, vx: 60, patrolLeft: 1700, patrolRight: 1810 },
  { x: 1900, y: 298, vx: -70, patrolLeft: 1850, patrolRight: 2000 },
  { x: 2200, y: 508, vx: 90, patrolLeft: 2100, patrolRight: 2350 },
  { x: 2360, y: 268, vx: -65, patrolLeft: 2320, patrolRight: 2450 },
  { x: 2700, y: 318, vx: 75, patrolLeft: 2640, patrolRight: 2780 },
  { x: 2850, y: 238, vx: -80, patrolLeft: 2810, patrolRight: 2970 },
];

const INIT_CLOUDS: Cloud[] = [
  { x: 50, y: 50, w: 120, speed: 15 },
  { x: 300, y: 90, w: 90, speed: 12 },
  { x: 600, y: 40, w: 140, speed: 18 },
  { x: 900, y: 70, w: 100, speed: 14 },
  { x: 1200, y: 55, w: 130, speed: 16 },
  { x: 1500, y: 80, w: 110, speed: 13 },
  { x: 1800, y: 45, w: 150, speed: 17 },
  { x: 2100, y: 65, w: 95, speed: 11 },
  { x: 2400, y: 85, w: 120, speed: 15 },
  { x: 2700, y: 50, w: 140, speed: 19 },
  { x: 3000, y: 70, w: 100, speed: 14 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function createPlayer(): Player {
  return {
    x: 80,
    y: GROUND.y - PLAYER_H,
    vx: 0,
    vy: 0,
    onGround: false,
    lives: 3,
    score: 0,
    coins: 0,
    facingRight: true,
    deathTimer: 0,
    isDying: false,
    blinkTimer: 0,
    invincible: 0,
  };
}

function createCoins(): Coin[] {
  return INIT_COINS.map((c) => ({
    ...c,
    collected: false,
    animOffset: Math.random() * Math.PI * 2,
  }));
}

function createEnemies(): Enemy[] {
  return INIT_ENEMIES.map((e) => ({
    ...e,
    defeated: false,
    defeatTimer: 0,
    walkAnim: 0,
  }));
}

// ─── Drawing ──────────────────────────────────────────────────────────────────

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  isGround: boolean,
) {
  if (isGround) {
    // Grass top
    ctx.fillStyle = "#4AAE4F";
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.w, 12);
    // Dark outline on grass
    ctx.fillStyle = "#2d8a32";
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.w, 3);
    // Dirt
    ctx.fillStyle = "#B86A2B";
    ctx.fillRect(Math.round(p.x), Math.round(p.y + 12), p.w, p.h - 12);
    // Grid lines on dirt
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    for (let xi = 0; xi < p.w; xi += 32) {
      ctx.fillRect(Math.round(p.x + xi), Math.round(p.y + 12), 1, p.h - 12);
    }
    for (let yi = 12; yi < p.h; yi += 16) {
      ctx.fillRect(Math.round(p.x), Math.round(p.y + yi), p.w, 1);
    }
  } else {
    // Floating platform: green top, brown body
    ctx.fillStyle = "#4AAE4F";
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.w, 7);
    ctx.fillStyle = "#2d8a32";
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.w, 2);
    ctx.fillStyle = "#B86A2B";
    ctx.fillRect(Math.round(p.x), Math.round(p.y + 7), p.w, p.h - 7);
    // Border
    ctx.strokeStyle = "#2B1A10";
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(p.x) + 1, Math.round(p.y) + 1, p.w - 2, p.h - 2);
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, blink: boolean) {
  if (blink) return;
  const px = Math.round(p.x);
  const py = Math.round(p.y);
  ctx.save();
  if (!p.facingRight) {
    ctx.translate(px + PLAYER_W, py);
    ctx.scale(-1, 1);
    ctx.translate(-PLAYER_W, 0);
  } else {
    ctx.translate(px, py);
  }

  // Hat
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(4, 0, PLAYER_W - 8, 10);
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(0, 7, PLAYER_W, 5);
  // Hair (dark)
  ctx.fillStyle = "#2B1A10";
  ctx.fillRect(5, 12, 5, 4);
  // Face
  ctx.fillStyle = "#F4C08A";
  ctx.fillRect(0, 12, PLAYER_W, 12);
  // Eye
  ctx.fillStyle = "#2B1A10";
  ctx.fillRect(PLAYER_W - 10, 14, 5, 5);
  // Mustache
  ctx.fillStyle = "#2B1A10";
  ctx.fillRect(8, 21, 18, 3);
  // Body (overalls blue)
  ctx.fillStyle = "#1a5fa8";
  ctx.fillRect(0, 24, PLAYER_W, 14);
  // Buttons
  ctx.fillStyle = "#F6C64A";
  ctx.fillRect(8, 25, 4, 4);
  ctx.fillRect(20, 25, 4, 4);
  // Legs
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(0, 38, 12, 6);
  ctx.fillRect(PLAYER_W - 12, 38, 12, 6);
  // Shoes
  ctx.fillStyle = "#2B1A10";
  ctx.fillRect(-2, 42, 14, 5);
  ctx.fillRect(PLAYER_W - 12, 42, 14, 5);
  // Outline
  ctx.strokeStyle = "#2B1A10";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(0.75, 0.75, PLAYER_W - 1.5, PLAYER_H - 1.5);

  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, t: number) {
  const ex = Math.round(e.x);
  const ey = Math.round(e.y);
  if (e.defeated) {
    // Flat squished
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(ex, ey + ENEMY_H - 8, ENEMY_W, 8);
    ctx.strokeStyle = "#2B1A10";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ex + 0.75, ey + ENEMY_H - 7.25, ENEMY_W - 1.5, 6.5);
    return;
  }
  // Walk animation: legs
  const legAnim = Math.sin(t * 8) > 0;
  // Body
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(ex, ey, ENEMY_W, ENEMY_H);
  // Darker head top
  ctx.fillStyle = "#6B3010";
  ctx.fillRect(ex, ey, ENEMY_W, 10);
  // Eyes white
  ctx.fillStyle = "white";
  ctx.fillRect(ex + 4, ey + 4, 8, 8);
  ctx.fillRect(ex + ENEMY_W - 12, ey + 4, 8, 8);
  // Pupils (angry - angled)
  ctx.fillStyle = "#2B1A10";
  ctx.fillRect(ex + 5, ey + 7, 5, 5);
  ctx.fillRect(ex + ENEMY_W - 10, ey + 7, 5, 5);
  // Feet
  ctx.fillStyle = "#5a2a08";
  if (legAnim) {
    ctx.fillRect(ex - 2, ey + ENEMY_H - 6, 12, 6);
    ctx.fillRect(ex + ENEMY_W - 10, ey + ENEMY_H - 2, 12, 6);
  } else {
    ctx.fillRect(ex - 2, ey + ENEMY_H - 2, 12, 6);
    ctx.fillRect(ex + ENEMY_W - 10, ey + ENEMY_H - 6, 12, 6);
  }
  // Outline
  ctx.strokeStyle = "#2B1A10";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ex + 0.75, ey + 0.75, ENEMY_W - 1.5, ENEMY_H - 1.5);
}

function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, t: number) {
  if (c.collected) return;
  const bob = Math.sin(t * 3 + c.animOffset) * 3;
  const cx = Math.round(c.x);
  const cy = Math.round(c.y + bob);
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + COIN_R + 4, COIN_R * 0.8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Coin body
  ctx.fillStyle = "#F6C64A";
  ctx.beginPath();
  ctx.arc(cx, cy, COIN_R, 0, Math.PI * 2);
  ctx.fill();
  // Shine
  ctx.fillStyle = "#ffe080";
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 3, COIN_R * 0.45, 0, Math.PI * 2);
  ctx.fill();
  // Outline
  ctx.strokeStyle = "#2B1A10";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, COIN_R, 0, Math.PI * 2);
  ctx.stroke();
  // Dollar sign
  ctx.fillStyle = "#2B1A10";
  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", cx, cy + 1);
}

function drawGoalFlag(ctx: CanvasRenderingContext2D, t: number) {
  const gx = GOAL_X;
  const groundY = GROUND.y;
  // Pole
  ctx.fillStyle = "#888";
  ctx.fillRect(gx - 2, groundY - 200, 6, 200);
  ctx.strokeStyle = "#2B1A10";
  ctx.lineWidth = 1;
  ctx.strokeRect(gx - 2, groundY - 200, 6, 200);
  // Flag wave
  const wave = Math.sin(t * 3) * 5;
  ctx.fillStyle = "#e53e3e";
  ctx.beginPath();
  ctx.moveTo(gx + 4, groundY - 198);
  ctx.lineTo(gx + 54, groundY - 178 + wave);
  ctx.lineTo(gx + 4, groundY - 158);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2B1A10";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Castle
  const castleX = gx + 20;
  const castleY = groundY - 100;
  ctx.fillStyle = "#aaa";
  ctx.fillRect(castleX, castleY, 80, 100);
  // Battlements
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(castleX + i * 18, castleY - 20, 10, 20);
  }
  // Door
  ctx.fillStyle = "#2B1A10";
  ctx.fillRect(castleX + 30, castleY + 55, 20, 45);
  // Windows
  ctx.fillRect(castleX + 8, castleY + 30, 15, 15);
  ctx.fillRect(castleX + 57, castleY + 30, 15, 15);
  ctx.strokeStyle = "#2B1A10";
  ctx.lineWidth = 2;
  ctx.strokeRect(castleX + 0.5, castleY + 0.5, 79, 99);
}

function drawCloud(ctx: CanvasRenderingContext2D, c: Cloud) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const h = 30;
  ctx.fillRect(Math.round(c.x), Math.round(c.y + h * 0.3), c.w, h * 0.7);
  ctx.beginPath();
  ctx.arc(
    Math.round(c.x + c.w * 0.25),
    Math.round(c.y + h * 0.3),
    h * 0.5,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    Math.round(c.x + c.w * 0.55),
    Math.round(c.y),
    h * 0.65,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    Math.round(c.x + c.w * 0.8),
    Math.round(c.y + h * 0.2),
    h * 0.45,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  t: number,
  clouds: Cloud[],
) {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, "#1a78c2");
  grad.addColorStop(0.5, "#3EA7E8");
  grad.addColorStop(0.8, "#7dd4f8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  // Clouds (parallax 0.3x)
  ctx.save();
  ctx.translate(-cameraX * 0.3, 0);
  for (const c of clouds) {
    drawCloud(ctx, c);
  }
  ctx.restore();
  // Far hills (parallax 0.5x)
  ctx.save();
  ctx.translate(-cameraX * 0.5, 0);
  const hillPositions = [
    0, 200, 500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900, 3200, 3500,
  ];
  for (const hx of hillPositions) {
    const hw = 250 + ((hx * 37) % 150);
    ctx.fillStyle = "rgba(45,140,48,0.6)";
    ctx.beginPath();
    ctx.arc(hx + hw / 2, GROUND.y - 10, hw / 2, Math.PI, 0);
    ctx.fill();
  }
  ctx.restore();

  void t;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  onBackToMenu: () => void;
}

export default function GameCanvas({ onBackToMenu }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>("TITLE");
  const playerRef = useRef<Player>(createPlayer());
  const coinsRef = useRef<Coin[]>(createCoins());
  const enemiesRef = useRef<Enemy[]>(createEnemies());
  const cloudsRef = useRef<Cloud[]>(INIT_CLOUDS.map((c) => ({ ...c })));
  const cameraXRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const titleAnimRef = useRef<number>(0);

  const [hudLives, setHudLives] = useState(3);
  const [hudScore, setHudScore] = useState(0);
  const [hudCoins, setHudCoins] = useState(0);
  const [gameState, setGameState] = useState<GameState>("TITLE");
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { mutate: submitScore, isPending: isSubmitting } = useSubmitScore();

  const respawnPlayer = useCallback(() => {
    const p = playerRef.current;
    p.x = 80;
    p.y = GROUND.y - PLAYER_H;
    p.vx = 0;
    p.vy = 0;
    p.onGround = false;
    p.isDying = false;
    p.deathTimer = 0;
    p.invincible = 2.0; // 2 seconds invincible
    cameraXRef.current = 0;
  }, []);

  const startGame = useCallback(() => {
    playerRef.current = createPlayer();
    coinsRef.current = createCoins();
    enemiesRef.current = createEnemies();
    cameraXRef.current = 0;
    setHudLives(3);
    setHudScore(0);
    setHudCoins(0);
    setSubmitted(false);
    setPlayerName("");
    gameStateRef.current = "PLAYING";
    setGameState("PLAYING");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
      if (
        gameStateRef.current === "TITLE" &&
        (e.key === " " || e.key === "Enter")
      ) {
        startGame();
      }
      if (
        (gameStateRef.current === "GAME_OVER" ||
          gameStateRef.current === "WIN") &&
        e.key === "r"
      ) {
        startGame();
      }
    };
    const offKey = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", offKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", offKey);
    };
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      timeRef.current += dt;
      const t = timeRef.current;

      if (gameStateRef.current === "TITLE") {
        titleAnimRef.current += dt;
        // Draw title screen
        drawBackground(ctx, 0, t, cloudsRef.current);
        for (const p of PLATFORMS) drawPlatform(ctx, p, p === GROUND);
        // Animated title text
        ctx.font = "bold 36px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#F6C64A";
        ctx.strokeStyle = "#2B1A10";
        ctx.lineWidth = 6;
        ctx.strokeText("SUPER PLATFORMER", CANVAS_W / 2, 200);
        ctx.fillText("SUPER PLATFORMER", CANVAS_W / 2, 200);
        ctx.font = "bold 16px 'Courier New', monospace";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#2B1A10";
        ctx.lineWidth = 3;
        ctx.strokeText("Arrow Keys / WASD to Move", CANVAS_W / 2, 280);
        ctx.fillText("Arrow Keys / WASD to Move", CANVAS_W / 2, 280);
        ctx.strokeText("Space / Up / W to Jump", CANVAS_W / 2, 310);
        ctx.fillText("Space / Up / W to Jump", CANVAS_W / 2, 310);
        ctx.strokeText("Stomp Enemies, Collect Coins!", CANVAS_W / 2, 340);
        ctx.fillText("Stomp Enemies, Collect Coins!", CANVAS_W / 2, 340);
        if (Math.sin(t * 4) > 0) {
          ctx.font = "bold 20px 'Courier New', monospace";
          ctx.fillStyle = "#F6C64A";
          ctx.strokeStyle = "#2B1A10";
          ctx.lineWidth = 4;
          ctx.strokeText("PRESS SPACE TO START", CANVAS_W / 2, 420);
          ctx.fillText("PRESS SPACE TO START", CANVAS_W / 2, 420);
        }
        // Draw sample player on platform
        const demoPlayer = createPlayer();
        demoPlayer.x = 380;
        demoPlayer.y = GROUND.y - PLAYER_H;
        drawPlayer(ctx, demoPlayer, false);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (
        gameStateRef.current !== "PLAYING" &&
        gameStateRef.current !== "DEAD"
      ) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const p = playerRef.current;
      const keys = keysRef.current;

      // Handle death
      if (p.isDying) {
        p.deathTimer -= dt;
        p.vy += GRAVITY * dt;
        p.y += p.vy * dt;
        if (p.deathTimer <= 0) {
          p.lives--;
          setHudLives(p.lives);
          if (p.lives <= 0) {
            setFinalScore(p.score);
            gameStateRef.current = "GAME_OVER";
            setGameState("GAME_OVER");
          } else {
            respawnPlayer();
            gameStateRef.current = "PLAYING";
            setGameState("PLAYING");
          }
        }
        // Still render during death
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        drawBackground(ctx, cameraXRef.current, t, cloudsRef.current);
        ctx.save();
        ctx.translate(-cameraXRef.current, 0);
        for (const plat of PLATFORMS) drawPlatform(ctx, plat, plat === GROUND);
        drawGoalFlag(ctx, t);
        for (const coin of coinsRef.current) drawCoin(ctx, coin, t);
        for (const enemy of enemiesRef.current) drawEnemy(ctx, enemy, t);
        drawPlayer(ctx, p, false);
        ctx.restore();
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Input ──────────────────────────────────────────────────────────────
      const moveLeft = keys.has("ArrowLeft") || keys.has("a") || keys.has("A");
      const moveRight =
        keys.has("ArrowRight") || keys.has("d") || keys.has("D");
      const wantJump =
        keys.has(" ") || keys.has("ArrowUp") || keys.has("w") || keys.has("W");

      if (moveLeft) {
        p.vx = -PLAYER_SPEED;
        p.facingRight = false;
      } else if (moveRight) {
        p.vx = PLAYER_SPEED;
        p.facingRight = true;
      } else p.vx = 0;

      if (wantJump && p.onGround) {
        p.vy = JUMP_VEL;
        p.onGround = false;
      }

      // ── Physics ────────────────────────────────────────────────────────────
      p.vy += GRAVITY * dt;
      p.vy = Math.min(p.vy, 900); // terminal velocity

      // Horizontal move + collision
      p.x += p.vx * dt;
      p.x = Math.max(0, Math.min(p.x, LEVEL_W - PLAYER_W));

      for (const plat of PLATFORMS) {
        if (
          rectsOverlap(
            p.x,
            p.y,
            PLAYER_W,
            PLAYER_H,
            plat.x,
            plat.y,
            plat.w,
            plat.h,
          )
        ) {
          if (p.vx > 0) p.x = plat.x - PLAYER_W;
          else if (p.vx < 0) p.x = plat.x + plat.w;
          p.vx = 0;
        }
      }

      // Vertical move + collision
      p.y += p.vy * dt;
      p.onGround = false;

      for (const plat of PLATFORMS) {
        if (
          rectsOverlap(
            p.x,
            p.y,
            PLAYER_W,
            PLAYER_H,
            plat.x,
            plat.y,
            plat.w,
            plat.h,
          )
        ) {
          if (p.vy >= 0) {
            // Landing
            p.y = plat.y - PLAYER_H;
            p.vy = 0;
            p.onGround = true;
          } else {
            // Bumping head
            p.y = plat.y + plat.h;
            p.vy = 0;
          }
        }
      }

      // Fall off screen
      if (p.y > CANVAS_H + 100) {
        p.isDying = true;
        p.deathTimer = 0.3;
        p.vy = JUMP_VEL * 0.5;
        gameStateRef.current = "DEAD";
        setGameState("DEAD");
      }

      // Invincibility timer
      if (p.invincible > 0) p.invincible -= dt;

      // ── Update enemies ─────────────────────────────────────────────────────
      for (const enemy of enemiesRef.current) {
        if (enemy.defeated) {
          enemy.defeatTimer -= dt;
          continue;
        }
        enemy.x += enemy.vx * dt;
        enemy.walkAnim += dt;
        // Patrol bounds
        if (enemy.x < enemy.patrolLeft) {
          enemy.x = enemy.patrolLeft;
          enemy.vx = Math.abs(enemy.vx);
        }
        if (enemy.x + ENEMY_W > enemy.patrolRight) {
          enemy.x = enemy.patrolRight - ENEMY_W;
          enemy.vx = -Math.abs(enemy.vx);
        }

        // Player-enemy collision
        if (
          p.invincible <= 0 &&
          rectsOverlap(
            p.x,
            p.y,
            PLAYER_W,
            PLAYER_H,
            enemy.x,
            enemy.y,
            ENEMY_W,
            ENEMY_H,
          )
        ) {
          const pCenterY = p.y + PLAYER_H;
          const eCenterY = enemy.y + ENEMY_H * 0.4;
          if (p.vy > 0 && pCenterY <= eCenterY + 10) {
            // Stomp!
            enemy.defeated = true;
            enemy.defeatTimer = 0.5;
            p.vy = -350;
            p.score += 100;
            setHudScore(p.score);
          } else {
            // Take damage
            p.isDying = true;
            p.deathTimer = 1.2;
            p.vy = JUMP_VEL * 0.7;
            gameStateRef.current = "DEAD";
            setGameState("DEAD");
          }
        }
      }

      // ── Coin collection ────────────────────────────────────────────────────
      for (const coin of coinsRef.current) {
        if (coin.collected) continue;
        const dx = p.x + PLAYER_W / 2 - coin.x;
        const dy = p.y + PLAYER_H / 2 - coin.y;
        if (Math.sqrt(dx * dx + dy * dy) < COIN_R + 14) {
          coin.collected = true;
          p.score += 10;
          p.coins++;
          setHudScore(p.score);
          setHudCoins(p.coins);
        }
      }

      // ── Win condition ──────────────────────────────────────────────────────
      if (p.x + PLAYER_W > GOAL_X - 10 && p.x < GOAL_X + 120) {
        setFinalScore(p.score);
        gameStateRef.current = "WIN";
        setGameState("WIN");
      }

      // ── Camera ─────────────────────────────────────────────────────────────
      const targetCam = p.x - CANVAS_W / 2 + PLAYER_W / 2;
      cameraXRef.current +=
        (targetCam - cameraXRef.current) * Math.min(dt * 10, 1);
      cameraXRef.current = Math.max(
        0,
        Math.min(cameraXRef.current, LEVEL_W - CANVAS_W),
      );

      // ── Update clouds ──────────────────────────────────────────────────────
      for (const c of cloudsRef.current) {
        c.x += c.speed * dt;
        if (c.x > LEVEL_W + 200) c.x = -200;
      }

      // ── Render ─────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawBackground(ctx, cameraXRef.current, t, cloudsRef.current);

      ctx.save();
      ctx.translate(-cameraXRef.current, 0);

      // Platforms
      for (const plat of PLATFORMS) drawPlatform(ctx, plat, plat === GROUND);
      // Goal flag
      drawGoalFlag(ctx, t);
      // Coins
      for (const coin of coinsRef.current) drawCoin(ctx, coin, t);
      // Enemies
      for (const enemy of enemiesRef.current) {
        if (!enemy.defeated || enemy.defeatTimer > 0) drawEnemy(ctx, enemy, t);
      }
      // Player (blink when invincible)
      const blink = p.invincible > 0 && Math.sin(t * 20) > 0;
      drawPlayer(ctx, p, blink);

      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [respawnPlayer]);

  const handleSubmitScore = () => {
    if (!playerName.trim()) return;
    submitScore(
      { playerName: playerName.trim(), score: BigInt(finalScore) },
      {
        onSuccess: () => setSubmitted(true),
      },
    );
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center py-4">
      {/* Back button */}
      <div className="w-full max-w-4xl px-4 mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-game-yellow font-pixel text-xs hover:text-white transition-colors"
          data-ocid="game.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          MENU
        </button>
        <span className="font-pixel text-game-yellow text-xs">
          SUPER PLATFORMER
        </span>
        <button
          type="button"
          onClick={startGame}
          className="font-pixel text-xs text-white hover:text-game-yellow transition-colors"
          data-ocid="game.restart_button"
        >
          RESTART
        </button>
      </div>

      {/* Game container */}
      <div className="relative" style={{ width: CANVAS_W, maxWidth: "100vw" }}>
        {/* HUD Overlay */}
        {(gameState === "PLAYING" || gameState === "DEAD") && (
          <div
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 pointer-events-none"
            data-ocid="game.panel"
          >
            {/* Lives */}
            <div className="flex items-center gap-1 bg-navy bg-opacity-70 px-3 py-1.5 border border-game-yellow">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={`heart-${i < hudLives ? "full" : "empty"}-${i}`}
                  className="w-5 h-5"
                  fill={i < hudLives ? "#e53e3e" : "#555"}
                  color={i < hudLives ? "#9b1c1c" : "#444"}
                />
              ))}
            </div>
            {/* Score */}
            <div className="bg-navy bg-opacity-70 px-3 py-1.5 border border-game-yellow">
              <span className="font-pixel text-white text-xs">
                SCORE{" "}
                <span className="text-game-yellow">
                  {String(hudScore).padStart(5, "0")}
                </span>
              </span>
            </div>
            {/* Coins */}
            <div className="flex items-center gap-1 bg-navy bg-opacity-70 px-3 py-1.5 border border-game-yellow">
              <div className="w-4 h-4 rounded-full bg-game-yellow border border-dark-border" />
              <span className="font-pixel text-white text-xs">
                ×
                <span className="text-game-yellow">
                  {String(hudCoins).padStart(2, "0")}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block border-4 border-dark-border"
          style={{ maxWidth: "100%", cursor: "crosshair" }}
          tabIndex={0}
          data-ocid="game.canvas_target"
        />

        {/* GAME OVER overlay */}
        {gameState === "GAME_OVER" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-20"
            data-ocid="gameover.modal"
          >
            <div className="bg-navy border-4 border-game-yellow p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
              <h2
                className="font-pixel text-red-400 text-2xl"
                style={{ textShadow: "3px 3px 0 #000" }}
              >
                GAME OVER
              </h2>
              <p className="font-pixel text-game-yellow text-sm">
                SCORE: {finalScore}
              </p>
              {!submitted ? (
                <>
                  <p className="font-pixel text-white text-xs text-center">
                    Enter your name for the leaderboard:
                  </p>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitScore()}
                    placeholder="YOUR NAME"
                    maxLength={20}
                    className="w-full bg-dark-border border-2 border-game-yellow text-game-yellow font-pixel text-xs px-3 py-2 outline-none text-center placeholder-gray-500"
                    data-ocid="gameover.input"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitScore}
                    disabled={isSubmitting || !playerName.trim()}
                    className="pixel-btn-yellow w-full py-3 text-xs disabled:opacity-50"
                    data-ocid="gameover.submit_button"
                  >
                    {isSubmitting ? "SAVING..." : "SUBMIT SCORE"}
                  </button>
                </>
              ) : (
                <p
                  className="font-pixel text-game-yellow text-xs text-center"
                  data-ocid="gameover.success_state"
                >
                  ✓ SCORE SAVED!
                </p>
              )}
              <button
                type="button"
                onClick={startGame}
                className="pixel-btn-orange w-full py-3 text-xs"
                data-ocid="gameover.restart_button"
              >
                PLAY AGAIN (R)
              </button>
              <button
                type="button"
                onClick={onBackToMenu}
                className="font-pixel text-gray-400 text-xs hover:text-white"
                data-ocid="gameover.menu_button"
              >
                BACK TO MENU
              </button>
            </div>
          </div>
        )}

        {/* WIN overlay */}
        {gameState === "WIN" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-20"
            data-ocid="win.modal"
          >
            <div className="bg-navy border-4 border-game-yellow p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
              <h2
                className="font-pixel text-game-yellow text-xl text-center animate-float"
                style={{ textShadow: "3px 3px 0 #000" }}
              >
                LEVEL COMPLETE!
              </h2>
              <p className="font-pixel text-white text-2xl">⭐⭐⭐</p>
              <p className="font-pixel text-game-yellow text-sm">
                FINAL SCORE: {finalScore}
              </p>
              {!submitted ? (
                <>
                  <p className="font-pixel text-white text-xs text-center">
                    Save your score:
                  </p>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitScore()}
                    placeholder="YOUR NAME"
                    maxLength={20}
                    className="w-full bg-dark-border border-2 border-game-yellow text-game-yellow font-pixel text-xs px-3 py-2 outline-none text-center placeholder-gray-500"
                    data-ocid="win.input"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitScore}
                    disabled={isSubmitting || !playerName.trim()}
                    className="pixel-btn-yellow w-full py-3 text-xs disabled:opacity-50"
                    data-ocid="win.submit_button"
                  >
                    {isSubmitting ? "SAVING..." : "SUBMIT SCORE"}
                  </button>
                </>
              ) : (
                <p
                  className="font-pixel text-game-yellow text-xs"
                  data-ocid="win.success_state"
                >
                  ✓ SCORE SAVED!
                </p>
              )}
              <button
                type="button"
                onClick={startGame}
                className="pixel-btn-orange w-full py-3 text-xs"
                data-ocid="win.restart_button"
              >
                PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={onBackToMenu}
                className="font-pixel text-gray-400 text-xs hover:text-white"
                data-ocid="win.menu_button"
              >
                BACK TO MENU
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls reminder */}
      <div className="mt-4 flex items-center gap-6 flex-wrap justify-center">
        {[
          { key: "← →", label: "MOVE" },
          { key: "↑ / SPACE", label: "JUMP" },
          { key: "STOMP", label: "DEFEAT ENEMY" },
        ].map((ctrl) => (
          <div key={ctrl.key} className="flex items-center gap-2">
            <span className="bg-dark-border border border-game-yellow text-game-yellow font-pixel text-xs px-2 py-1">
              {ctrl.key}
            </span>
            <span className="text-gray-400 text-xs font-pixel">
              {ctrl.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
