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
    return false;
}

// ── Wizard ──────────────────────────────────────────────────

const wizard = { x: 15 * T + 8, y: 82 * T + 8, width: 16, height: 16 };

// ── Camp Leader ─────────────────────────────────────────────

const campLeader = { x: 17 * T + 8, y: 115 * T + 8, width: 16, height: 16 };

// ── Player (King) ───────────────────────────────────────────

const player = { x: 14.5 * T, y: 6 * T, width: 16, height: 16, speed: 120 };

let swordPickedUp = false;

const SOLID = new Set([WALL, THRONE, BED_HEAD, BED_FOOT, PILLOW, TABLE, STOVE, BARREL, SHELF, WINDOW_TILE, NIGHTSTAND, TOILET, BATHTUB, SINK, WATER, GRASS, TREE, HUT_WALL, TENT, MOUNTAIN, CAVE_WALL, WEAPON_RACK]);

function isSolid(px, py, pw, ph) {
    const corners = [[px,py],[px+pw-1,py],[px,py+ph-1],[px+pw-1,py+ph-1]];
    for (const [cx, cy] of corners) {
        const col = Math.floor(cx / T), row = Math.floor(cy / T);
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
        const tile = map[row][col];
        if (tile === VOID) return true;
        if (inBoat && tile === WATER) continue;
        if (SOLID.has(tile)) return true;
        // Progression gates (disabled after first dragon kill)
        if (typeof dragonKills === 'undefined' || dragonKills === 0) {
            // Block south of hut until spider defeated
            if (row >= 85 && row <= 89 && col >= 14 && col <= 15
                && (typeof spider !== 'undefined' && spider.alive)) return true;
            // Block far beach/dock until sea snake defeated
            if (row >= 109 && row <= 110
                && (typeof seaSnake !== 'undefined' && seaSnake.alive)) return true;
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
    return Math.hypot(pcx - (wizard.x + 8), pcy - (wizard.y + 8)) < T * 2;
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
    return Math.hypot(pcx - (campLeader.x + 8), pcy - (campLeader.y + 8)) < T * 2;
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
