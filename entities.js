// ── NPCs ────────────────────────────────────────────────────

const cook = { x: 23 * T + 8, y: 12 * T + 8, width: 16, height: 16 };
const guard1 = { x: 8 * T + 8, y: 8 * T + 8, width: 16, height: 16 };
const guard2 = { x: 21 * T + 8, y: 8 * T + 8, width: 16, height: 16 };
const butler = { x: 8 * T + 8, y: 15 * T + 8, width: 16, height: 16 };
const allNPCs = [cook, guard1, guard2, butler];

function isNPCSolid(px, py, pw, ph) {
    for (const npc of allNPCs) {
        if (px < npc.x + npc.width && px + pw > npc.x &&
            py < npc.y + npc.height && py + ph > npc.y) return true;
    }
    // Wizard collision
    if (px < wizard.x + wizard.width && px + pw > wizard.x &&
        py < wizard.y + wizard.height && py + ph > wizard.y) return true;
    // Camp leader collision
    if (px < campLeader.x + campLeader.width && px + pw > campLeader.x &&
        py < campLeader.y + campLeader.height && py + ph > campLeader.y) return true;
    // Camp member collisions
    for (const cm of campMembers) {
        if (px < cm.x + cm.width && px + pw > cm.x &&
            py < cm.y + cm.height && py + ph > cm.y) return true;
    }
    // Guest room NPC collisions
    if (typeof guestRoomBuilt !== 'undefined' && guestRoomBuilt) {
        if (px < guestWizard.x + guestWizard.width && px + pw > guestWizard.x &&
            py < guestWizard.y + guestWizard.height && py + ph > guestWizard.y) return true;
        if (px < guestCampLeader.x + guestCampLeader.width && px + pw > guestCampLeader.x &&
            py < guestCampLeader.y + guestCampLeader.height && py + ph > guestCampLeader.y) return true;
    }
    return false;
}

// ── Wizard ──────────────────────────────────────────────────

const wizard = { x: 15 * T + 8, y: 82 * T + 8, width: 16, height: 16 };

// ── Camp Leader ─────────────────────────────────────────────

const campLeader = { x: 17 * T + 8, y: 115 * T + 8, width: 16, height: 16 };

// ── Guest Room NPCs (same characters, guest room positions) ──

const guestWizard = { x: 25 * T + 8, y: 7 * T + 8, width: 16, height: 16 };
const guestCampLeader = { x: 27 * T + 8, y: 8 * T + 8, width: 16, height: 16 };

// ── Camp Members ────────────────────────────────────────────

const campScout = { x: 7 * T + 8, y: 114 * T + 8, width: 16, height: 16 };
const campBlacksmith = { x: 22 * T + 8, y: 114 * T + 8, width: 16, height: 16 };
const campHealer = { x: 7 * T + 8, y: 117 * T + 8, width: 16, height: 16 };
const campMembers = [campScout, campBlacksmith, campHealer];

function isNearCampScout() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (campScout.x + 8), pcy - (campScout.y + 8)) < T * 1.8;
}
function isNearCampBlacksmith() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (campBlacksmith.x + 8), pcy - (campBlacksmith.y + 8)) < T * 1.8;
}
function isNearCampHealer() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (campHealer.x + 8), pcy - (campHealer.y + 8)) < T * 1.8;
}

// ── Ice Traveler ────────────────────────────────────────────
const iceTraveler = { x: 22 * T, y: 117 * T, width: 16, height: 20 };
function isNearIceTraveler() {
    if (!isIceTravelerPresent()) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (iceTraveler.x + 8), pcy - (iceTraveler.y + 8)) < T * 1.8;
}

// ── Jack Frost (ice quest NPC) ──────────────────────────────
const jackFrost = { x: 14 * T, y: 4 * T, width: 16, height: 20 };
function isNearJackFrost() {
    if (!isSnowing()) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (jackFrost.x + 8), pcy - (jackFrost.y + 10)) < T * 1.8;
}

// ── Noli (arena boss) ───────────────────────────────────────

const voidSentinel = {
    x: 14 * T, y: 220 * T,
    width: 16, height: 16,
    hp: 2500, maxHp: 2500,
    alive: true,
    aggro: false, // idle until attacked
    lastAttack: 0,
    attackCooldown: 1500,
    damage: 2,
    speed: 80,
    stunned: false,
    stunUntil: 0,
    // Dash ability
    dashState: 'idle', // 'idle', 'windup1', 'dashing1', 'windup2', 'dashing2'
    dashCooldown: 20000,
    lastDashTime: -Infinity,
    dashWindupStart: 0,
    dashTargetX: 0,
    dashTargetY: 0,
    dashSpeed: 500,
    dashHit: false,
};
let voidSentinelDeathTime = -Infinity;

// ── Player (King) ───────────────────────────────────────────

const player = { x: 14.5 * T, y: 6 * T, width: 16, height: 16, speed: 120 };

let swordPickedUp = false;

const SOLID = new Set([WALL, THRONE, BED_HEAD, BED_FOOT, PILLOW, TABLE, STOVE, BARREL, SHELF, WINDOW_TILE, NIGHTSTAND, TOILET, BATHTUB, SINK, WATER, GRASS, TREE, HUT_WALL, TENT, MOUNTAIN, CAVE_WALL, WEAPON_RACK, DESIGN_RACK, ATM_TILE]);

function isNearATM() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && map[r][c] === ATM_TILE) return true;
        }
    return false;
}

// Secret passage tiles (cols 17-28, rows 42-43) — walkable grass leading to arena entrance
function isSecretPassageTile(row, col) {
    return (row === 42 || row === 43) && col >= 17 && col <= 28;
}

// Collision check for NPC movement (orcs/guards) — same as SOLID but allows GRASS
const NPC_SOLID = new Set(SOLID);
NPC_SOLID.delete(GRASS);

function isNPCBlocked(px, py, pw, ph) {
    const corners = [[px,py],[px+pw-1,py],[px,py+ph-1],[px+pw-1,py+ph-1]];
    for (const [cx, cy] of corners) {
        const col = Math.floor(cx / T), row = Math.floor(cy / T);
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
        const tile = map[row][col];
        if (tile === VOID) return true;
        if (NPC_SOLID.has(tile)) return true;
    }
    return false;
}

function isSolid(px, py, pw, ph) {
    if (adminGhostMode) return false;
    const corners = [[px,py],[px+pw-1,py],[px,py+ph-1],[px+pw-1,py+ph-1]];
    for (const [cx, cy] of corners) {
        const col = Math.floor(cx / T), row = Math.floor(cy / T);
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
        const tile = map[row][col];
        if (tile === VOID) return true;
        if (inBoat && tile === WATER) continue;
        if (inBoat && tile === DOCK) continue;
        if (inBoat && tile === SAND && (col === 14 || col === 15)) continue;
        if (inBoat && tile === SAND) return true;
        // Secret passage: grass at col 28, rows 42-43 is walkable
        if (tile === GRASS && isSecretPassageTile(row, col)) continue;
        // Secret teleport: tree at row 44, col 28 is walkable (triggers teleport)
        if (tile === TREE && row === 44 && col === 28) continue;
        if (SOLID.has(tile)) return true;
        // Progression gates (disabled after first dragon kill)
        if (typeof dragonKills === 'undefined' || dragonKills === 0) {
            // Block south of hut until spider defeated
            if (row >= 85 && row <= 89 && col >= 14 && col <= 15
                && !questTasks.spiderDefeated) return true;
            // Block far beach until sea snake defeated (allow dock tiles so player can exit boat)
            if (row >= 109 && row <= 110
                && tile !== DOCK && !questTasks.seaSnakeDefeated) return true;
            // Block path south of camp until orc siege complete
            if (row >= 119 && col >= 14 && col <= 15
                && (typeof orcSiege !== 'undefined' && !orcSiege.complete)) return true;
        }
    }
    return isNPCSolid(px, py, pw, ph);
}

// Proximity checks
function isNearCook() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (cook.x + 8), pcy - (cook.y + 8)) < T * 1.8;
}

function isNearButler() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    return Math.hypot(pcx - (butler.x + 8), pcy - (butler.y + 8)) < T * 1.8;
}

function isNearWizard() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    if (Math.hypot(pcx - (wizard.x + 8), pcy - (wizard.y + 8)) < T * 2) return true;
    if (typeof guestRoomBuilt !== 'undefined' && guestRoomBuilt &&
        Math.hypot(pcx - (guestWizard.x + 8), pcy - (guestWizard.y + 8)) < T * 2) return true;
    return false;
}

function isNearBoat() {
    if (inBoat) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && map[r][c] === DOCK) return true;
        }
    return false;
}

function isNearCampLeader() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    if (Math.hypot(pcx - (campLeader.x + 8), pcy - (campLeader.y + 8)) < T * 2) return true;
    if (typeof guestRoomBuilt !== 'undefined' && guestRoomBuilt &&
        Math.hypot(pcx - (guestCampLeader.x + 8), pcy - (guestCampLeader.y + 8)) < T * 2) return true;
    return false;
}

// Returns 'camp' or 'castle' depending on which camp leader the player is near
function nearWhichCampLeader() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    if (Math.hypot(pcx - (campLeader.x + 8), pcy - (campLeader.y + 8)) < T * 2) return 'camp';
    if (typeof guestRoomBuilt !== 'undefined' && guestRoomBuilt &&
        Math.hypot(pcx - (guestCampLeader.x + 8), pcy - (guestCampLeader.y + 8)) < T * 2) return 'castle';
    return null;
}

function isNearAnyOrc() {
    if (typeof orcs === 'undefined') return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    for (const orc of orcs) {
        if (!orc.alive) continue;
        if (Math.hypot(pcx - (orc.x + orc.width / 2), pcy - (orc.y + orc.height / 2)) < T * 1.5) return true;
    }
    return false;
}

function isNearSeaSnake() {
    if (typeof seaSnake === 'undefined' || !seaSnake.alive || !seaSnake.active) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const scx = seaSnake.x + seaSnake.width / 2, scy = seaSnake.y + seaSnake.height / 2;
    return Math.hypot(pcx - scx, pcy - scy) < T * 1.5;
}

function isNearTroll() {
    if (typeof troll === 'undefined' || !troll.alive) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const tcx = troll.x + troll.width / 2, tcy = troll.y + troll.height / 2;
    return Math.hypot(pcx - tcx, pcy - tcy) < T * 1.5;
}

function isNearVoidSentinel() {
    if (!voidSentinel.alive) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const vcx = voidSentinel.x + voidSentinel.width / 2, vcy = voidSentinel.y + voidSentinel.height / 2;
    return Math.hypot(pcx - vcx, pcy - vcy) < T * 1.8;
}

// ── Lava Monster ───────────────────────────────────────────

const lavaMonster = {
    x: 14 * T, y: 270 * T,
    width: 20, height: 20,
    hp: 1000, maxHp: 1000,
    alive: true,
    aggro: false,
    lastAttack: 0,
    attackCooldown: 1200,
    damage: 2,
    speed: 70,
    // Fire trail
    trail: [], // [{x, y, time}]
    trailInterval: 200,
    lastTrailDrop: 0,
    // Special attack: mace spin
    spinning: false,
    spinStart: 0,
    spinCooldown: 15000,
    lastSpinTime: -Infinity,
    spinDmg: 15,
    spinHit: false,
};
let lavaMonsterDeathTime = -Infinity;

function isNearLavaMonster() {
    if (!lavaMonster.alive) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const lcx = lavaMonster.x + lavaMonster.width / 2, lcy = lavaMonster.y + lavaMonster.height / 2;
    return Math.hypot(pcx - lcx, pcy - lcy) < T * 1.8;
}
