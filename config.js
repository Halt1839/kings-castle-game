const GAME_VERSION = 'v.24';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ── Game State Machine ──────────────────────────────────────
// 'menu', 'playing', 'paused', 'dead'
let gameState = 'menu';
let menuScreen = 'main'; // 'main', 'slots'
const SAVE_KEY = 'kingGame_saves';
const LAST_SLOT_KEY = 'kingGame_lastSlot';

// ── Castle Map ──────────────────────────────────────────────
const T = 32;
const MAP_COLS = 30;
const MAP_ROWS = 200;

// Tile types
const VOID = 0, FLOOR = 1, WALL = 2, DOOR = 3, THRONE = 4;
const BED_HEAD = 5, BED_FOOT = 6, TABLE = 7, STOVE = 8;
const CARPET = 9, RUG = 10, BARREL = 11, SHELF = 12;
const WINDOW_TILE = 13, TORCH = 14, CHAIR = 15;
const PILLOW = 16, NIGHTSTAND = 17;
const TOILET = 18, BATHTUB = 19, SINK = 20, MIRROR = 21;
const BATH_FLOOR = 22;
const GRASS = 23, WATER = 24, BRIDGE = 25, SWORD_TILE = 26;
const PATH = 27;
const TREE = 28, HUT_WALL = 29, HUT_FLOOR = 30, GOLD_BLOCK = 31;
const SAND = 32, DOCK = 33, TENT = 34, CAMPFIRE = 35;
const MOUNTAIN = 36, MOUNTAIN_PATH = 37, CAVE_WALL = 38, CAVE_FLOOR = 39, CAVE_DOOR = 40;
const PEAK_FLOOR = 41, WEAPON_RACK = 42;

// Game time (pausable) — declared early so notifications & systems can use it
let gameTime = 0;

// Boat state — declared early so entities.js can reference in isSolid
let inBoat = false;
let boatBoardTime = 0;
let boatSandWarnTime = 0;

// Death counter
let deathCount = 0;

// Player animation state
let playerWalking = false;
let playerWalkPhase = 0;
let swordSwingTime = 0;
const SWORD_SWING_DURATION = 300; // ms

// ── Key labels (adapts to touch vs keyboard) ────────────────
// isTouchDevice is defined in touch.js; may not exist yet at load time, so check dynamically
const KEY_LABELS = {
    E: { key: 'E', touch: 'ACT' },
    H: { key: 'H', touch: 'HIT' },
    B: { key: 'B', touch: 'BLK' },
    F: { key: 'F', touch: 'HEAL' },
    nav: { key: 'W/S', touch: 'Joystick' },
};
function kl(action) {
    const t = typeof isTouchDevice !== 'undefined' && isTouchDevice;
    const entry = KEY_LABELS[action];
    return entry ? (t ? entry.touch : entry.key) : action;
}

// ── Version display ─────────────────────────────────────────
function drawVersion() {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(GAME_VERSION, 4, 2);
    ctx.restore();
}

// Admin panel state
let adminOpen = false;
let adminSelection = 0;
let adminGodMode = false;
let adminGhostMode = false;
let adminSwordEquipped = false;
let adminUnlocked = (function() { try { const d = JSON.parse(localStorage.getItem('kingGame_admin')); return d && d.unlocked === true; } catch(e) { return false; } })();
const ADMIN_STORAGE_KEY = 'kingGame_admin';

function getAdminData() {
    try {
        const d = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY));
        if (!d) return { unlocked: false, attempts: 0, weekStart: 0 };
        // Reset attempts if a new week
        const now = Date.now();
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        if (now - d.weekStart >= weekMs) {
            d.attempts = 0;
            d.weekStart = now;
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(d));
        }
        return d;
    } catch(e) { return { unlocked: false, attempts: 0, weekStart: 0 }; }
}

function saveAdminData(d) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(d));
}

// Shield state — declared early so damage checks can reference it
let shieldActive = false;
let shieldStartTime = 0;
const SHIELD_DURATION = 2000;
