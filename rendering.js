// ── Design Theme Colors ─────────────────────────────────────

const DESIGN_COLORS = {
    default: { wall1: '#6b6b7b', wall2: '#5b5b6b', wallStroke: '#4a4a5a',
               floor1: '#c8b078', floorStroke: '#b8a068',
               door1: '#8B6914', door2: '#a07818',
               carpet1: '#8B0000', carpet2: '#DAA520', carpet3: '#8B0000',
               throne1: '#8B0000', throne2: '#DAA520', throne3: '#FFD700' },
    gold:    { wall1: '#8a7a3a', wall2: '#7a6a2a', wallStroke: '#6a5a1a',
               floor1: '#e8d088', floorStroke: '#d8c068',
               door1: '#DAA520', door2: '#FFD700',
               carpet1: '#FFD700', carpet2: '#FFF8DC', carpet3: '#FFD700',
               throne1: '#DAA520', throne2: '#FFD700', throne3: '#FFF8DC' },
    void:    { wall1: '#3a2a5e', wall2: '#2a1a4e', wallStroke: '#1a0a3e',
               floor1: '#5a4a7a', floorStroke: '#4a3a6a',
               door1: '#4a2a6e', door2: '#6a4a8e',
               carpet1: '#2a0a4e', carpet2: '#8a5abf', carpet3: '#2a0a4e',
               throne1: '#4a1a7e', throne2: '#C88FFF', throne3: '#E0C0FF' },
};

function dc() {
    const d = (typeof currentDesign !== 'undefined') ? currentDesign : 'default';
    return DESIGN_COLORS[d] || DESIGN_COLORS.default;
}

// ── Tile Drawing ────────────────────────────────────────────

function drawTile(col, row, ox, oy) {
    const x = col * T - ox, y = row * T - oy;
    const tile = map[row][col];
    // Apply design theme only inside castle (rows 1-28)
    const inCastle = row >= 1 && row <= 28;
    switch (tile) {
        case VOID: ctx.fillStyle = '#1a1a2e'; ctx.fillRect(x, y, T, T); break;
        case FLOOR:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = inCastle ? dc().floorStroke : '#b8a068'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T); break;
        case BATH_FLOOR:
            ctx.fillStyle = '#b0c4d8'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#98b0c0'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T); break;
        case WALL:
            ctx.fillStyle = inCastle ? dc().wall1 : '#6b6b7b'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = inCastle ? dc().wall2 : '#5b5b6b'; ctx.fillRect(x + 1, y + 1, T/2-2, T/2-2); ctx.fillRect(x+T/2, y+T/2, T/2-1, T/2-1);
            ctx.strokeStyle = inCastle ? dc().wallStroke : '#4a4a5a'; ctx.lineWidth = 1; ctx.strokeRect(x, y, T, T); break;
        case DOOR:
            ctx.fillStyle = inCastle ? dc().door1 : '#8B6914'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = inCastle ? dc().door2 : '#a07818'; ctx.fillRect(x+4, y+2, T-8, T-4); break;
        case THRONE:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = inCastle ? dc().throne1 : '#8B0000'; ctx.fillRect(x+4, y+2, T-8, T-4);
            ctx.fillStyle = inCastle ? dc().throne2 : '#DAA520'; ctx.fillRect(x+6, y, T-12, 6);
            ctx.fillStyle = inCastle ? dc().throne3 : '#FFD700'; ctx.fillRect(x+T/2-2, y+1, 4, 4); break;
        case BED_HEAD:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#3d2010'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.fillStyle = '#5a3520'; ctx.fillRect(x+3, y+3, T-6, T-6);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(x+T/2-3, y+4, 6, 3); break;
        case PILLOW:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.fillStyle = '#F5F5DC'; ctx.fillRect(x+4, y+6, T-8, T-12);
            ctx.fillStyle = '#EDEDD5'; ctx.fillRect(x+6, y+8, T-12, T-16); break;
        case BED_FOOT:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x+1, y+1, T-2, T-4);
            ctx.fillStyle = '#6B0000'; ctx.fillRect(x+3, y+2, T-6, 4);
            ctx.fillStyle = '#3d2010'; ctx.fillRect(x+1, y+T-4, T-2, 3); break;
        case NIGHTSTAND:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#5a3520'; ctx.fillRect(x+4, y+4, T-8, T-8);
            ctx.fillStyle = '#3d2010'; ctx.fillRect(x+4, y+T/2-1, T-8, 2);
            ctx.fillStyle = '#F5F5DC'; ctx.fillRect(x+T/2-2, y+1, 4, 6);
            ctx.fillStyle = '#FF8C00'; ctx.fillRect(x+T/2-1, y-1, 2, 3); break;
        case TABLE:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(x+2, y+2, T-4, T-4); break;
        case STOVE:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#444'; ctx.fillRect(x+2, y+2, T-4, T-4);
            ctx.fillStyle = '#FF4500'; ctx.fillRect(x+8, y+8, T-16, T-16); break;
        case CARPET:
            ctx.fillStyle = inCastle ? dc().carpet1 : '#8B0000'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = inCastle ? dc().carpet2 : '#DAA520'; ctx.fillRect(x+2, y, T-4, T);
            ctx.fillStyle = inCastle ? dc().carpet3 : '#8B0000'; ctx.fillRect(x+5, y, T-10, T); break;
        case RUG:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#4a2560'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.fillStyle = '#6a3580'; ctx.fillRect(x+4, y+4, T-8, T-8); break;
        case BARREL:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B5E3C'; ctx.beginPath(); ctx.arc(x+T/2, y+T/2, T/2-4, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x+T/2, y+T/2, T/2-4, 0, Math.PI*2); ctx.stroke(); break;
        case SHELF:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#654321'; ctx.fillRect(x+2, y+6, T-4, 4); ctx.fillRect(x+2, y+18, T-4, 4);
            ctx.fillStyle = '#a03030'; ctx.fillRect(x+4, y+2, 5, 4);
            ctx.fillStyle = '#3050a0'; ctx.fillRect(x+11, y+2, 5, 4);
            ctx.fillStyle = '#40a040'; ctx.fillRect(x+6, y+14, 6, 4); break;
        case WINDOW_TILE:
            ctx.fillStyle = inCastle ? dc().wall1 : '#6b6b7b'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#87CEEB'; ctx.fillRect(x+6, y+4, T-12, T-8);
            ctx.strokeStyle = '#654321'; ctx.lineWidth = 2; ctx.strokeRect(x+6, y+4, T-12, T-8);
            ctx.beginPath(); ctx.moveTo(x+T/2, y+4); ctx.lineTo(x+T/2, y+T-4); ctx.stroke(); break;
        case TORCH:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = inCastle ? dc().floorStroke : '#b8a068'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            ctx.fillStyle = '#555'; ctx.fillRect(x+13, y+12, 6, 4);
            ctx.fillStyle = '#FF8C00'; ctx.beginPath(); ctx.arc(x+T/2, y+10, 5, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(x+T/2, y+10, 3, 0, Math.PI*2); ctx.fill(); break;
        case CHAIR:
            ctx.fillStyle = inCastle ? dc().floor1 : '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#654321'; ctx.fillRect(x+8, y+8, T-16, T-16); ctx.fillRect(x+6, y+4, T-12, 6); break;
        case TOILET:
            ctx.fillStyle = '#b0c4d8'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#98b0c0'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            // Bowl
            ctx.fillStyle = '#F5F5F5'; ctx.beginPath(); ctx.ellipse(x+T/2, y+T/2+4, 10, 8, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#e0e8f0'; ctx.beginPath(); ctx.ellipse(x+T/2, y+T/2+4, 7, 5, 0, 0, Math.PI*2); ctx.fill();
            // Tank
            ctx.fillStyle = '#ddd'; ctx.fillRect(x+6, y+2, T-12, 8);
            ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; ctx.strokeRect(x+6, y+2, T-12, 8);
            // Handle
            ctx.fillStyle = '#C0C0C0'; ctx.fillRect(x+T/2+4, y+4, 4, 3); break;
        case BATHTUB:
            ctx.fillStyle = '#b0c4d8'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#98b0c0'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            ctx.fillStyle = '#F5F5F5'; ctx.fillRect(x+2, y+2, T-4, T-4);
            ctx.fillStyle = '#d0e0f0'; ctx.fillRect(x+4, y+4, T-8, T-8);
            ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; ctx.strokeRect(x+2, y+2, T-4, T-4); break;
        case SINK:
            ctx.fillStyle = '#b0c4d8'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#98b0c0'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            ctx.fillStyle = '#F5F5F5'; ctx.beginPath(); ctx.ellipse(x+T/2, y+T/2, 8, 6, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#d0e0f0'; ctx.beginPath(); ctx.ellipse(x+T/2, y+T/2, 5, 3, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#C0C0C0'; ctx.fillRect(x+T/2-1, y+4, 2, 8); break;
        case GRASS: {
            let gBase = '#4a8c3f', gBlade = '#3d7a34';
            const isLawn = row >= 29 && row <= 38;
            if (isLawn) {
                const dd = (typeof currentDesign !== 'undefined') ? currentDesign : 'default';
                if (dd === 'void') {
                    if (col <= 12) { gBase = '#6a3d8f'; gBlade = '#5a2d7f'; }
                    else { gBase = '#b088d0'; gBlade = '#9a78c0'; }
                } else if (dd === 'gold') {
                    if (col <= 12) { gBase = '#8a7a3a'; gBlade = '#7a6a2a'; }
                    else { gBase = '#b8a858'; gBlade = '#a89848'; }
                }
            }
            ctx.fillStyle = gBase; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = gBlade;
            ctx.fillRect(x+4, y+8, 2, 6); ctx.fillRect(x+12, y+4, 2, 5);
            ctx.fillRect(x+22, y+10, 2, 7); ctx.fillRect(x+8, y+20, 2, 5);
            ctx.fillRect(x+18, y+16, 2, 6); ctx.fillRect(x+26, y+22, 2, 5);
            break;
        }
        case PATH: {
            let pBase = '#b09860', pDetail = '#a08850';
            if (row >= 29 && row <= 38) {
                const dd = (typeof currentDesign !== 'undefined') ? currentDesign : 'default';
                if (dd === 'void') { pBase = '#4a2a6e'; pDetail = '#3a1a5e'; }
                else if (dd === 'gold') { pBase = '#c8a838'; pDetail = '#b89828'; }
            }
            ctx.fillStyle = pBase; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = pDetail; ctx.fillRect(x+3, y+5, 4, 3); ctx.fillRect(x+14, y+18, 5, 3);
            ctx.fillRect(x+22, y+8, 3, 3);
            break;
        }
        case WATER: {
            let wBase = '#2874a6', wWave = 'rgba(100,180,255,0.4)';
            const isRiver = row >= 39 && row <= 40;
            if (isRiver) {
                const dd = (typeof currentDesign !== 'undefined') ? currentDesign : 'default';
                if (dd === 'void') { wBase = '#2a1040'; wWave = 'rgba(150,100,220,0.4)'; }
                else if (dd === 'gold') { wBase = '#8a6a1a'; wWave = 'rgba(218,165,32,0.4)'; }
            }
            ctx.fillStyle = wBase; ctx.fillRect(x, y, T, T);
            const wt = performance.now() / 800 + x * 0.1;
            for (let i = 0; i < 3; i++) {
                const wy = y + 6 + i * 10 + Math.sin(wt + i) * 2;
                ctx.beginPath(); ctx.moveTo(x, wy); ctx.quadraticCurveTo(x+T/2, wy - 4, x+T, wy); ctx.lineWidth = 2;
                ctx.strokeStyle = wWave; ctx.stroke();
            }
            break;
        }
        case BRIDGE:
            ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#7a5c10'; ctx.fillRect(x, y, T, 3); ctx.fillRect(x, y+T-3, T, 3);
            // Planks
            ctx.strokeStyle = '#6a4c08'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x+8, y); ctx.lineTo(x+8, y+T); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x+16, y); ctx.lineTo(x+16, y+T); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x+24, y); ctx.lineTo(x+24, y+T); ctx.stroke();
            break;
        case SWORD_TILE:
            // Bridge with sword stuck in it
            ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#7a5c10'; ctx.fillRect(x, y, T, 3); ctx.fillRect(x, y+T-3, T, 3);
            ctx.strokeStyle = '#6a4c08'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x+8, y); ctx.lineTo(x+8, y+T); ctx.stroke();
            if (!swordPickedUp) {
                // Crack
                ctx.strokeStyle = '#3a2c04'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(x+T/2, y+T-2); ctx.lineTo(x+T/2+1, y+T/2+4); ctx.stroke();
                // Sword blade
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(x+T/2-1, y+2, 3, T/2+2);
                // Sword guard
                ctx.fillStyle = '#DAA520';
                ctx.fillRect(x+T/2-4, y+T/2+2, 9, 3);
                // Sword handle
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x+T/2-1, y+T/2+5, 3, 6);
                // Pommel
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(x+T/2-1, y+T/2+10, 3, 3);
                // Glow
                const ga = 0.3 + 0.2 * Math.sin(performance.now() / 500);
                ctx.fillStyle = `rgba(255,215,0,${ga})`;
                ctx.beginPath(); ctx.arc(x+T/2, y+T/4, 8, 0, Math.PI*2); ctx.fill();
            }
            break;
        case TREE:
            ctx.fillStyle = '#1a4a14'; ctx.fillRect(x, y, T, T);
            break;
        case HUT_WALL:
            // Wooden hut wall
            ctx.fillStyle = '#6b4226'; ctx.fillRect(x, y, T, T);
            // Log texture
            ctx.fillStyle = '#7a4c2a'; ctx.fillRect(x, y+2, T, 6); ctx.fillRect(x, y+12, T, 6); ctx.fillRect(x, y+22, T, 6);
            ctx.strokeStyle = '#4a2a10'; ctx.lineWidth = 1; ctx.strokeRect(x, y, T, T);
            break;
        case HUT_FLOOR:
            // Wooden plank floor
            ctx.fillStyle = '#a07840'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#8a6830'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(x+8, y); ctx.lineTo(x+8, y+T); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x+16, y); ctx.lineTo(x+16, y+T); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x+24, y); ctx.lineTo(x+24, y+T); ctx.stroke();
            break;
        case SAND:
            ctx.fillStyle = '#e8d68a'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#d4c278';
            ctx.fillRect(x+5, y+10, 3, 2); ctx.fillRect(x+18, y+5, 2, 2);
            ctx.fillRect(x+12, y+22, 3, 2); ctx.fillRect(x+25, y+15, 2, 2);
            break;
        case DOCK:
            ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#7a5c10'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.strokeStyle = '#6a4c08'; ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath(); ctx.moveTo(x + i * 8 + 4, y); ctx.lineTo(x + i * 8 + 4, y + T); ctx.stroke();
            }
            // Rope coil
            ctx.strokeStyle = '#8B7355'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x + T - 8, y + 8, 4, 0, Math.PI * 2); ctx.stroke();
            break;
        case TENT:
            // Ground
            ctx.fillStyle = '#b09860'; ctx.fillRect(x, y, T, T);
            // Tent body
            ctx.fillStyle = '#8B6914';
            ctx.beginPath(); ctx.moveTo(x + T/2, y + 2); ctx.lineTo(x + 2, y + T - 2);
            ctx.lineTo(x + T - 2, y + T - 2); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#a07818';
            ctx.beginPath(); ctx.moveTo(x + T/2, y + 4); ctx.lineTo(x + 6, y + T - 4);
            ctx.lineTo(x + T - 6, y + T - 4); ctx.closePath(); ctx.fill();
            // Tent opening
            ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x + T/2 - 3, y + T - 10, 6, 8);
            // Pole
            ctx.fillStyle = '#654321'; ctx.fillRect(x + T/2 - 1, y, 2, T);
            break;
        case CAMPFIRE:
            // Ground
            ctx.fillStyle = '#b09860'; ctx.fillRect(x, y, T, T);
            // Stone ring
            ctx.fillStyle = '#777'; ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(x + T/2, y + T/2 + 4, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            // Logs
            ctx.fillStyle = '#5a3a1a';
            ctx.fillRect(x + 8, y + T/2 + 2, 16, 4);
            ctx.fillRect(x + T/2 - 2, y + T/2 - 2, 4, 12);
            // Fire (animated)
            const ft = performance.now() / 150;
            ctx.fillStyle = '#FF4500';
            ctx.beginPath(); ctx.moveTo(x + T/2, y + 4 + Math.sin(ft) * 2);
            ctx.lineTo(x + T/2 - 6, y + T/2 + 2); ctx.lineTo(x + T/2 + 6, y + T/2 + 2);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath(); ctx.moveTo(x + T/2 - 1, y + 8 + Math.sin(ft + 1) * 2);
            ctx.lineTo(x + T/2 - 4, y + T/2 + 1); ctx.lineTo(x + T/2 + 3, y + T/2 + 1);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#FFD700';
            ctx.beginPath(); ctx.moveTo(x + T/2, y + 12 + Math.sin(ft + 2));
            ctx.lineTo(x + T/2 - 2, y + T/2); ctx.lineTo(x + T/2 + 2, y + T/2);
            ctx.closePath(); ctx.fill();
            break;
        case MOUNTAIN:
            ctx.fillStyle = '#6a6a6a'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#5a5a5a'; ctx.fillRect(x + 2, y + 4, 8, 6); ctx.fillRect(x + 16, y + 14, 10, 8);
            ctx.fillStyle = '#7a7a7a'; ctx.fillRect(x + 10, y + 20, 6, 4);
            ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            break;
        case MOUNTAIN_PATH:
            ctx.fillStyle = '#8a7a6a'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#7a6a5a'; ctx.fillRect(x + 4, y + 6, 5, 3); ctx.fillRect(x + 16, y + 20, 4, 3);
            ctx.fillRect(x + 22, y + 10, 3, 3);
            break;
        case CAVE_WALL:
            ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#2a2a2a'; ctx.fillRect(x + 1, y + 2, T/2 - 2, T/2 - 2);
            ctx.fillRect(x + T/2, y + T/2, T/2 - 1, T/2 - 1);
            ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1; ctx.strokeRect(x, y, T, T);
            break;
        case CAVE_FLOOR:
            ctx.fillStyle = '#4a4a42'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#3a3a35'; ctx.fillRect(x + 5, y + 8, 4, 3); ctx.fillRect(x + 18, y + 20, 3, 2);
            ctx.strokeStyle = '#3a3a38'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            break;
        case CAVE_DOOR:
            ctx.fillStyle = '#4a4a42'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x + 4, y, T - 8, T);
            ctx.fillStyle = '#6a5a4a'; ctx.fillRect(x + 6, y + 2, T - 12, T - 4);
            ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(x + T/2, y, T/2 - 4, Math.PI, 0); ctx.stroke();
            break;
        case WEAPON_RACK:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#b8a068'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            // Rack frame
            ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x + 4, y + 2, T - 8, T - 4);
            ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x + 6, y + 4, T - 12, T - 8);
            // Swords on rack
            ctx.fillStyle = '#C0C0C0'; ctx.fillRect(x + 8, y + 6, 2, 16);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(x + 6, y + 14, 6, 2);
            ctx.fillStyle = '#C0C0C0'; ctx.fillRect(x + 18, y + 6, 2, 16);
            ctx.fillStyle = '#FFD700'; ctx.fillRect(x + 16, y + 14, 6, 2);
            break;
        case PEAK_FLOOR:
            ctx.fillStyle = '#8a8a7a'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#7a7a6a'; ctx.fillRect(x + 6, y + 4, 5, 4); ctx.fillRect(x + 18, y + 20, 6, 3);
            ctx.strokeStyle = '#6a6a5a'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            break;
        case GOLD_BLOCK:
            // Path background with gold block on top
            ctx.fillStyle = '#b09860'; ctx.fillRect(x, y, T, T);
            // Gold block
            ctx.fillStyle = '#FFD700'; ctx.fillRect(x+6, y+6, T-12, T-12);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(x+6, y+6, T-12, 4);
            ctx.fillStyle = '#FFC800'; ctx.fillRect(x+8, y+10, T-16, T-18);
            // Sparkle
            const gs = 0.5 + 0.5 * Math.sin(performance.now() / 300);
            ctx.fillStyle = `rgba(255,255,200,${gs})`;
            ctx.beginPath(); ctx.arc(x+T/2, y+T/2, 2, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#B8860B'; ctx.lineWidth = 1; ctx.strokeRect(x+6, y+6, T-12, T-12);
            break;
        case DESIGN_RACK:
            ctx.fillStyle = dc().floor1; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = dc().floorStroke; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            // Rack frame
            ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x + 4, y + 2, T - 8, T - 4);
            ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x + 6, y + 4, T - 12, T - 8);
            // Color swatches
            ctx.fillStyle = '#FFD700'; ctx.fillRect(x + 8, y + 6, 6, 8);
            ctx.fillStyle = '#6a3abf'; ctx.fillRect(x + 18, y + 6, 6, 8);
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x + 13, y + 18, 6, 6);
            break;
        case ARENA_FLOOR:
            ctx.fillStyle = '#4a4a5a'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#3a3a4a'; ctx.fillRect(x + 8, y + 8, 4, 4); ctx.fillRect(x + 20, y + 20, 4, 4);
            ctx.strokeStyle = '#5a5a6a'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            break;
    }
}

// ── Void Rush Visual Effects ────────────────────────────────

function drawVoidRush(ox, oy) {
    if (voidRush.state === 'idle') return;
    const pcx = player.x + player.width / 2 - ox, pcy = player.y + player.height / 2 - oy;
    const tx = voidRush.targetX - ox, ty = voidRush.targetY - oy;

    if (voidRush.state === 'windup1' || voidRush.state === 'windup2') {
        const isSecond = voidRush.state === 'windup2';
        const windupDur = isSecond ? 2000 : 1000;
        const progress = Math.min(1, (gameTime - voidRush.windupStart) / windupDur);
        const pulse = 0.4 + 0.4 * Math.sin(performance.now() / 100);
        // Target ring
        ctx.strokeStyle = `rgba(180,100,255,${pulse})`;
        ctx.lineWidth = isSecond ? 3 : 2;
        ctx.beginPath(); ctx.arc(tx, ty, 12 + (1 - progress) * 20, 0, Math.PI * 2); ctx.stroke();
        // Crosshair
        ctx.strokeStyle = `rgba(200,140,255,${0.6 + 0.3 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tx - 6, ty); ctx.lineTo(tx + 6, ty); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx, ty - 6); ctx.lineTo(tx, ty + 6); ctx.stroke();
        // Line from player to target
        ctx.strokeStyle = `rgba(180,100,255,${pulse * 0.4})`;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(pcx, pcy); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.setLineDash([]);
    }

    if (voidRush.state === 'dashing1' || voidRush.state === 'dashing2') {
        // Trail behind player
        ctx.fillStyle = 'rgba(140,60,220,0.3)';
        ctx.beginPath(); ctx.arc(pcx, pcy, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(200,140,255,0.15)';
        ctx.beginPath(); ctx.arc(pcx, pcy, 18, 0, Math.PI * 2); ctx.fill();
    }
}

// ── King Drawing ────────────────────────────────────────────

// ── Mastery Skin Colors ─────────────────────────────────────

const SKIN_COLORS = {
    default: { body: '#8B0000', trim: '#DAA520', crown: '#FFD700', gem: '#FF0000', legs: '#4a2800', arms: '#f5c6a0' },
    bronze:  { body: '#8B5A2B', trim: '#cd7f32', crown: '#cd7f32', gem: '#FF6600', legs: '#5a3a1a', arms: '#d4a574', pauldron: '#a0692a' },
    silver:  { body: '#5a6a7a', trim: '#C0C0C0', crown: '#C0C0C0', gem: '#4488FF', legs: '#4a4a5a', arms: '#8a9aaa', cape: 'rgba(100,120,160,0.6)' },
    gold:    { body: '#8a6a10', trim: '#FFD700', crown: '#FFD700', gem: '#FF0000', legs: '#6a5a10', arms: '#DAA520', glow: 'rgba(255,215,0,0.25)' },
    diamond: { body: '#4a6a8a', trim: '#b9f2ff', crown: '#b9f2ff', gem: '#ffffff', legs: '#3a5a7a', arms: '#7aaabb', glow: 'rgba(185,242,255,0.3)', aura: true },
    // Dagger mastery skins
    shadow:     { body: '#2a2a3a', trim: '#555577', crown: '#444466', gem: '#8844aa', legs: '#1a1a2a', arms: '#4a4a5a', cape: 'rgba(30,30,50,0.6)' },
    crimson:    { body: '#6a1010', trim: '#cc3333', crown: '#aa2222', gem: '#ff4444', legs: '#4a0808', arms: '#8a3030', glow: 'rgba(255,50,50,0.2)' },
    phantom:    { body: '#3a4a5a', trim: '#8899aa', crown: '#7788aa', gem: '#aaccff', legs: '#2a3a4a', arms: '#6a7a8a', cape: 'rgba(100,130,180,0.4)', glow: 'rgba(150,180,220,0.2)' },
    nightblade: { body: '#1a1a2e', trim: '#6633cc', crown: '#5522aa', gem: '#cc88ff', legs: '#0a0a1e', arms: '#3a3a5e', glow: 'rgba(100,50,200,0.3)' },
    // Ice Spear mastery skins
    frost:    { body: '#4a6a8a', trim: '#88bbdd', crown: '#77aacc', gem: '#aaddff', legs: '#3a5a7a', arms: '#6a8aaa', glow: 'rgba(150,200,255,0.15)' },
    blizzard: { body: '#e8e8f0', trim: '#ffffff', crown: '#f0f0ff', gem: '#88ccff', legs: '#c0c0d0', arms: '#d0d0e0', cape: 'rgba(200,220,255,0.5)' },
    glacier:  { body: '#1a3a5a', trim: '#3388cc', crown: '#2277bb', gem: '#44aaff', legs: '#0a2a4a', arms: '#2a5a8a', glow: 'rgba(50,130,220,0.25)', cape: 'rgba(30,80,150,0.5)' },
    aurora:   { body: '#2a3a4a', trim: '#44ddaa', crown: '#33ccbb', gem: '#88ffdd', legs: '#1a2a3a', arms: '#4a6a7a', glow: 'rgba(100,255,200,0.2)' },
};

const DAGGER_BLADE_COLORS = {
    default:    { blade: '#D0D0D0', tip: '#D0D0D0', guard: '#DAA520', handle: '#654321', pommel: '#B8860B' },
    shadow:     { blade: '#4a4a6a', tip: '#4a4a6a', guard: '#333355', handle: '#1a1a2a', pommel: '#555577' },
    crimson:    { blade: '#cc4444', tip: '#ff6666', guard: '#882222', handle: '#441111', pommel: '#aa3333' },
    phantom:    { blade: '#8899bb', tip: '#aabbdd', guard: '#667799', handle: '#334466', pommel: '#7788aa' },
    nightblade: { blade: '#7744cc', tip: '#aa77ff', guard: '#5522aa', handle: '#220066', pommel: '#6633bb' },
};

const SPEAR_BLADE_COLORS = {
    default:  { shaft: '#8B7355', tip: '#b0c4de', glow: null },
    frost:    { shaft: '#6a8aaa', tip: '#aaddff', glow: 'rgba(150,200,255,0.3)' },
    blizzard: { shaft: '#c0c0d0', tip: '#ffffff', glow: 'rgba(220,240,255,0.3)' },
    glacier:  { shaft: '#2a5a8a', tip: '#44aaff', glow: 'rgba(50,130,220,0.4)' },
    aurora:   { shaft: '#3a5a5a', tip: '#88ffdd', glow: 'rgba(100,255,200,0.35)' },
};

// ── Dagger Mastery Particles ────────────────────────────────
const DAGGER_PARTICLES = {
    shadow: { count: 4, radius: 14, size: 2, speed: 1.5, color: [80, 70, 120], trail: false },
    crimson: { count: 5, radius: 16, size: 2.5, speed: 2, color: [220, 50, 50], trail: true },
    phantom: { count: 6, radius: 18, size: 2, speed: 1.2, color: [140, 170, 220], trail: true },
    nightblade: { count: 8, radius: 20, size: 3, speed: 2.5, color: [140, 80, 255], trail: true },
};

function drawDaggerParticles(cx, cy) {
    const skinKey = (typeof daggerMasterySkin !== 'undefined') ? daggerMasterySkin : 'default';
    const cfg = DAGGER_PARTICLES[skinKey];
    if (!cfg) return;
    const t = performance.now() / 1000;
    ctx.save();
    for (let i = 0; i < cfg.count; i++) {
        const angle = (i / cfg.count) * Math.PI * 2 + t * cfg.speed;
        const wobble = Math.sin(t * 3 + i * 1.7) * 3;
        const r = cfg.radius + wobble;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r * 0.6; // squash vertically
        // Trail
        if (cfg.trail) {
            for (let j = 1; j <= 3; j++) {
                const ta = angle - j * 0.15;
                const tr = cfg.radius + Math.sin(t * 3 + i * 1.7 - j * 0.1) * 3;
                const tx = cx + Math.cos(ta) * tr;
                const ty = cy + Math.sin(ta) * tr * 0.6;
                ctx.globalAlpha = 0.15 - j * 0.04;
                ctx.fillStyle = `rgb(${cfg.color[0]},${cfg.color[1]},${cfg.color[2]})`;
                ctx.beginPath(); ctx.arc(tx, ty, cfg.size * (1 - j * 0.2), 0, Math.PI * 2); ctx.fill();
            }
        }
        // Main particle
        const pulse = 0.6 + 0.4 * Math.sin(t * 5 + i * 2);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = `rgb(${cfg.color[0]},${cfg.color[1]},${cfg.color[2]})`;
        ctx.beginPath(); ctx.arc(px, py, cfg.size, 0, Math.PI * 2); ctx.fill();
        // Bright core
        ctx.globalAlpha = pulse * 0.8;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(px, py, cfg.size * 0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
}

function drawKing(ox, oy) {
    if (activeAction) return;
    const sx = Math.round(player.x - ox), sy = Math.round(player.y - oy);
    const cx = sx + player.width / 2;
    const activeSkin = (typeof getActiveMasterySkin === 'function') ? getActiveMasterySkin() : 'default';
    const skin = SKIN_COLORS[activeSkin] || SKIN_COLORS.default;
    const isVoid = typeof voidStarActive !== 'undefined' && voidStarActive;

    // Walk bob
    const walkBob = playerWalking ? Math.sin(playerWalkPhase * Math.PI) * 2 : 0;
    const legSwing = playerWalking ? Math.sin(playerWalkPhase * Math.PI) * 4 : 0;
    const bodyY = sy + walkBob;

    // Dagger mastery particles (behind player)
    if (currentSword === 'dagger' && DAGGER_PARTICLES[daggerMasterySkin]) {
        drawDaggerParticles(cx, bodyY + 8);
    }

    // Aura (diamond skin)
    if (skin.aura) {
        const pulse = 0.15 + 0.1 * Math.sin(performance.now() / 400);
        ctx.fillStyle = `rgba(185,242,255,${pulse})`;
        ctx.beginPath(); ctx.arc(cx, bodyY + 8, 16, 0, Math.PI * 2); ctx.fill();
    }
    // Glow (gold/diamond skins)
    if (skin.glow) {
        ctx.fillStyle = skin.glow;
        ctx.beginPath(); ctx.arc(cx, bodyY + 8, 13, 0, Math.PI * 2); ctx.fill();
    }

    // Stab lean offset
    let stabLean = 0;
    const stabbing = currentSword === 'dagger' && daggerStab.active;
    let stabFacingRight = true;
    if (stabbing) {
        const stabElapsed = gameTime - daggerStab.startTime;
        const stabT = Math.min(1, stabElapsed / DAGGER_STAB_DURATION);
        const mob = daggerStab.targetMob;
        const mobCX = mob ? mob.x + mob.width / 2 : player.x + 32;
        stabFacingRight = mobCX > (player.x + player.width / 2);
        if (stabT < 0.3) {
            // Pull back
            stabLean = stabFacingRight ? -(stabT / 0.3) * 3 : (stabT / 0.3) * 3;
        } else {
            // Thrust forward, hold extended
            const thrustT = (stabT - 0.3) / 0.7;
            const eased = thrustT < 0.2 ? thrustT / 0.2 : thrustT < 0.85 ? 1 : 1 - (thrustT - 0.85) / 0.15 * 0.15;
            stabLean = stabFacingRight ? eased * 5 : -eased * 5;
        }
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(cx + stabLean, sy+player.height+2, 8, 3, 0, 0, Math.PI*2); ctx.fill();

    // Cape (silver+ skins)
    if (skin.cape) {
        ctx.fillStyle = skin.cape;
        const capeSwing = playerWalking ? Math.sin(playerWalkPhase * Math.PI * 0.5) * 2 : 0;
        ctx.fillRect(sx + 3 + stabLean, bodyY + 10, 10, 9 + capeSwing);
    }

    // Body
    ctx.fillStyle = skin.body; ctx.fillRect(sx+2+stabLean, bodyY+8, 12, 10);
    ctx.fillStyle = skin.trim; ctx.fillRect(sx+2+stabLean, bodyY+8, 12, 2);

    // Pauldrons (bronze+ skins)
    if (skin.pauldron) {
        ctx.fillStyle = skin.pauldron;
        ctx.fillRect(sx+stabLean, bodyY + 7, 4, 4); ctx.fillRect(sx + 12+stabLean, bodyY + 7, 4, 4);
    }

    // Head
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx+stabLean, bodyY+6, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(cx-3+stabLean, bodyY+5, 2, 2); ctx.fillRect(cx+1+stabLean, bodyY+5, 2, 2);
    // Crown
    ctx.fillStyle = isVoid ? '#4B0082' : skin.crown;
    ctx.fillRect(sx+3+stabLean, bodyY-1, 10, 4);
    ctx.fillRect(sx+3+stabLean, bodyY-4, 2, 3); ctx.fillRect(sx+7+stabLean, bodyY-5, 2, 4); ctx.fillRect(sx+11+stabLean, bodyY-4, 2, 3);
    ctx.fillStyle = isVoid ? '#C88FFF' : skin.gem;
    ctx.fillRect(sx+7+stabLean, bodyY-1, 2, 2);
    // Arms
    ctx.fillStyle = skin.arms;
    if (stabbing) {
        // Stabbing arm extends, other arm stays
        if (stabFacingRight) {
            ctx.fillRect(sx+stabLean, bodyY+9, 3, 6);
            ctx.fillRect(sx+13+stabLean, bodyY+8, 3, 7);
        } else {
            ctx.fillRect(sx+stabLean, bodyY+8, 3, 7);
            ctx.fillRect(sx+13+stabLean, bodyY+9, 3, 6);
        }
    } else {
        ctx.fillRect(sx, bodyY+9, 3, 6); ctx.fillRect(sx+13, bodyY+9, 3, 6);
    }
    // Legs (animated when walking)
    ctx.fillStyle = skin.legs;
    ctx.fillRect(sx+3+stabLean, sy+17 + legSwing, 4, 3);
    ctx.fillRect(sx+9+stabLean, sy+17 - legSwing, 4, 3);

    // Sword (if picked up)
    if (swordPickedUp) {
        const swingElapsed = performance.now() - swordSwingTime;
        const swinging = swingElapsed < SWORD_SWING_DURATION;
        ctx.save();

        if (stabbing) {
            // Stab animation: stance → thrust
            const stabElapsed = gameTime - daggerStab.startTime;
            const stabT = Math.min(1, stabElapsed / DAGGER_STAB_DURATION);
            const armX = stabFacingRight ? sx + 14 + stabLean : sx + 2 + stabLean;

            ctx.translate(armX, bodyY + 10);
            if (stabT < 0.3) {
                // Stance: pull dagger back
                const windT = stabT / 0.3;
                const pullAngle = stabFacingRight ? (-0.3 - windT * 1.2) : (0.3 + windT * 1.2);
                ctx.rotate(pullAngle);
            } else {
                // Thrust: stab forward, hold extended
                const thrustT = (stabT - 0.3) / 0.7;
                const eased = thrustT < 0.2 ? thrustT / 0.2 : thrustT < 0.85 ? 1 : 1 - (thrustT - 0.85) / 0.15 * 0.15;
                const thrustAngle = stabFacingRight ? (-1.5 + eased * 2.1) : (1.5 - eased * 2.1);
                ctx.rotate(thrustAngle);
            }
        } else {
            ctx.translate(sx + 16, bodyY + 10);
            if (swinging) {
                // Swing arc: rotate from -60 to +60 degrees
                const swingProgress = swingElapsed / SWORD_SWING_DURATION;
                const angle = (-1 + swingProgress * 2) * Math.PI / 3;
                ctx.rotate(angle);
            } else {
                ctx.rotate(-0.3); // idle angle
            }
        }
        if (currentSword === 'voidstar') {
            // Void Star weapon — star shape on a handle
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, -2, 3, 6);
            // Star
            const sp = 0.7 + 0.3 * Math.sin(performance.now() / 300);
            ctx.fillStyle = `rgba(200,140,255,${sp})`;
            ctx.beginPath();
            ctx.moveTo(0.5, -12); ctx.lineTo(2, -8); ctx.lineTo(6, -7);
            ctx.lineTo(3, -4); ctx.lineTo(4, 0); ctx.lineTo(0.5, -2);
            ctx.lineTo(-3, 0); ctx.lineTo(-2, -4); ctx.lineTo(-5, -7);
            ctx.lineTo(-1, -8); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(0.5, -6, 1.5, 0, Math.PI * 2); ctx.fill();
        } else if (currentSword === 'dagger') {
            // Dagger — short blade with crossguard, skinned
            const ds = DAGGER_BLADE_COLORS[daggerMasterySkin] || DAGGER_BLADE_COLORS.default;
            ctx.fillStyle = ds.blade; ctx.fillRect(-1, -8, 3, 6);
            // Tip
            ctx.fillStyle = ds.tip;
            ctx.beginPath(); ctx.moveTo(-1, -8); ctx.lineTo(0.5, -11); ctx.lineTo(2, -8); ctx.fill();
            // Guard
            ctx.fillStyle = ds.guard; ctx.fillRect(-3, -2, 7, 2);
            // Handle
            ctx.fillStyle = ds.handle; ctx.fillRect(-1, 0, 3, 3);
            // Pommel
            ctx.fillStyle = ds.pommel; ctx.fillRect(0, 3, 1, 1);
            // Nightblade glow
            if (daggerMasterySkin === 'nightblade') {
                const gp = 0.3 + 0.2 * Math.sin(performance.now() / 250);
                ctx.fillStyle = `rgba(120,60,220,${gp})`;
                ctx.beginPath(); ctx.arc(0.5, -5, 5, 0, Math.PI * 2); ctx.fill();
            }
        } else if (currentSword === 'icespear') {
            // Ice Spear — long shaft with icy tip
            const ss = SPEAR_BLADE_COLORS[spearMasterySkin] || SPEAR_BLADE_COLORS.default;
            // Shaft
            ctx.fillStyle = ss.shaft; ctx.fillRect(-1, -16, 2, 16);
            // Spearhead (diamond shape)
            ctx.fillStyle = ss.tip;
            ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(-2, -16); ctx.lineTo(0, -15); ctx.lineTo(2, -16); ctx.closePath(); ctx.fill();
            // Icy glow on tip
            if (ss.glow) {
                const gp = 0.5 + 0.3 * Math.sin(performance.now() / 350);
                ctx.fillStyle = ss.glow.replace(/[\d.]+\)$/, gp + ')');
                ctx.beginPath(); ctx.arc(0, -18, 4, 0, Math.PI * 2); ctx.fill();
            }
        } else {
            // Sword blade
            const swordColor = currentSword === 'dragon' ? '#FF6633' : currentSword === 'kings' ? '#FFD700' : '#C0C0C0';
            ctx.fillStyle = swordColor; ctx.fillRect(-1, -14, 3, 12);
            // Guard
            ctx.fillStyle = '#DAA520'; ctx.fillRect(-3, -2, 7, 2);
            // Handle
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, 0, 3, 4);
        }
        ctx.restore();
    }
}

function drawKingSitting(ox, oy) {
    const tx = 14*T-ox, ty = 2*T-oy, cx = tx+T, sy = ty+4;
    ctx.fillStyle = '#8B0000'; ctx.fillRect(cx-6, sy+8, 12, 8);
    ctx.fillStyle = '#DAA520'; ctx.fillRect(cx-6, sy+8, 12, 2);
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx, sy+6, 5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx-3, sy+6); ctx.lineTo(cx-1, sy+6); ctx.moveTo(cx+1, sy+6); ctx.lineTo(cx+3, sy+6); ctx.stroke();
    ctx.fillStyle = '#FFD700'; ctx.fillRect(cx-5, sy-1, 10, 4);
    ctx.fillRect(cx-5, sy-4, 2, 3); ctx.fillRect(cx-1, sy-5, 2, 4); ctx.fillRect(cx+3, sy-4, 2, 3);
    ctx.fillStyle = '#FF0000'; ctx.fillRect(cx-1, sy-1, 2, 2);
    ctx.fillStyle = '#f5c6a0'; ctx.fillRect(cx-10, sy+10, 4, 4); ctx.fillRect(cx+6, sy+10, 4, 4);
}

function drawKingSleeping(ox, oy) {
    const bx = 2*T-ox, by = 12*T-oy;
    ctx.fillStyle = '#6B0000'; ctx.fillRect(bx+2, by+T+2, T*2-4, T-6);
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(bx+T, by+T/2, 5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bx+T-3, by+T/2); ctx.lineTo(bx+T-1, by+T/2); ctx.moveTo(bx+T+1, by+T/2); ctx.lineTo(bx+T+3, by+T/2); ctx.stroke();
    ctx.fillStyle = '#FFD700'; ctx.save(); ctx.translate(bx+T, by+T/2-6); ctx.rotate(-0.2);
    ctx.fillRect(-5,-1,10,3); ctx.fillRect(-5,-3,2,2); ctx.fillRect(-1,-4,2,3); ctx.fillRect(3,-3,2,2); ctx.restore();
    const t = performance.now()/600, za = 0.5+0.5*Math.sin(t);
    ctx.font = 'bold 12px monospace'; ctx.fillStyle = `rgba(255,255,255,${za})`; ctx.fillText('Z', bx+T+12, by+T/2-8);
    ctx.font = 'bold 9px monospace'; ctx.fillStyle = `rgba(255,255,255,${1-za})`; ctx.fillText('z', bx+T+20, by+T/2-14);
    ctx.font = 'bold 7px monospace'; ctx.fillText('z', bx+T+25, by+T/2-20);
}

function drawKingOnToilet(ox, oy) {
    const tx = 2*T-ox, ty = 22*T-oy;
    const cx = tx+T/2, sy = ty-2;
    ctx.fillStyle = '#8B0000'; ctx.fillRect(cx-6, sy+8, 12, 8);
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx, sy+6, 5, 0, Math.PI*2); ctx.fill();
    // Strained expression
    ctx.fillStyle = '#333'; ctx.fillRect(cx-3, sy+5, 2, 2); ctx.fillRect(cx+1, sy+5, 2, 2);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, sy+9, 2, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = '#FFD700'; ctx.fillRect(cx-5, sy-1, 10, 4);
    ctx.fillRect(cx-5, sy-4, 2, 3); ctx.fillRect(cx-1, sy-5, 2, 4); ctx.fillRect(cx+3, sy-4, 2, 3);
    ctx.fillStyle = '#FF0000'; ctx.fillRect(cx-1, sy-1, 2, 2);
}

function drawKingInBoat(ox, oy) {
    const sx = Math.round(player.x - ox), sy = Math.round(player.y - oy);
    const cx = sx + player.width / 2;
    // Boat hull
    ctx.fillStyle = '#8B5E3C';
    ctx.beginPath();
    ctx.moveTo(cx - 16, sy + 10); ctx.lineTo(cx - 12, sy + 22);
    ctx.lineTo(cx + 12, sy + 22); ctx.lineTo(cx + 16, sy + 10);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 1; ctx.stroke();
    // Boat rim
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 16, sy + 10); ctx.lineTo(cx + 16, sy + 10); ctx.stroke();
    // Water ripples
    ctx.strokeStyle = 'rgba(100,180,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, sy + 24, 18, 4, 0, 0, Math.PI * 2); ctx.stroke();
    // King on boat
    ctx.fillStyle = '#8B0000'; ctx.fillRect(sx + 2, sy + 2, 12, 10);
    ctx.fillStyle = '#DAA520'; ctx.fillRect(sx + 2, sy + 2, 12, 2);
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx, sy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy - 1, 2, 2); ctx.fillRect(cx + 1, sy - 1, 2, 2);
    ctx.fillStyle = '#FFD700'; ctx.fillRect(sx + 3, sy - 7, 10, 4);
    ctx.fillRect(sx + 3, sy - 10, 2, 3); ctx.fillRect(sx + 7, sy - 11, 2, 4); ctx.fillRect(sx + 11, sy - 10, 2, 3);
    ctx.fillStyle = '#FF0000'; ctx.fillRect(sx + 7, sy - 7, 2, 2);
    // Sword in boat
    if (swordPickedUp) {
        const swingElapsed = performance.now() - swordSwingTime;
        const swinging = swingElapsed < SWORD_SWING_DURATION;
        ctx.save();
        ctx.translate(sx + 16, sy + 4);
        if (swinging) {
            const swingProgress = swingElapsed / SWORD_SWING_DURATION;
            ctx.rotate((-1 + swingProgress * 2) * Math.PI / 3);
        } else { ctx.rotate(-0.3); }
        if (currentSword === 'voidstar') {
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, -2, 3, 6);
            const sp = 0.7 + 0.3 * Math.sin(performance.now() / 300);
            ctx.fillStyle = `rgba(200,140,255,${sp})`;
            ctx.beginPath();
            ctx.moveTo(0.5, -12); ctx.lineTo(2, -8); ctx.lineTo(6, -7);
            ctx.lineTo(3, -4); ctx.lineTo(4, 0); ctx.lineTo(0.5, -2);
            ctx.lineTo(-3, 0); ctx.lineTo(-2, -4); ctx.lineTo(-5, -7);
            ctx.lineTo(-1, -8); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(0.5, -6, 1.5, 0, Math.PI * 2); ctx.fill();
        } else if (currentSword === 'icespear') {
            const ss = SPEAR_BLADE_COLORS[spearMasterySkin] || SPEAR_BLADE_COLORS.default;
            ctx.fillStyle = ss.shaft; ctx.fillRect(-1, -16, 2, 16);
            ctx.fillStyle = ss.tip;
            ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(-2, -16); ctx.lineTo(0, -15); ctx.lineTo(2, -16); ctx.closePath(); ctx.fill();
            if (ss.glow) {
                const gp = 0.5 + 0.3 * Math.sin(performance.now() / 350);
                ctx.fillStyle = ss.glow.replace(/[\d.]+\)$/, gp + ')');
                ctx.beginPath(); ctx.arc(0, -18, 4, 0, Math.PI * 2); ctx.fill();
            }
        } else if (currentSword === 'dagger') {
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, 0, 3, 4);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(-2, -1, 5, 2);
            ctx.fillStyle = '#C0C0C0'; ctx.fillRect(-1, -8, 3, 7);
        } else {
            const swordColor = currentSword === 'dragon' ? '#FF6633' : currentSword === 'kings' ? '#FFD700' : '#C0C0C0';
            ctx.fillStyle = swordColor; ctx.fillRect(-1, -14, 3, 12);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(-3, -2, 7, 2);
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, 0, 3, 4);
        }
        ctx.restore();
    }
}

function drawBoatAtDock(ox, oy) {
    if (inBoat) return;
    const bx = Math.round(14 * T - ox), by = Math.round(91 * T - oy);
    const cx = bx + T;
    ctx.fillStyle = '#8B5E3C';
    ctx.beginPath();
    ctx.moveTo(cx - 16, by + 10); ctx.lineTo(cx - 12, by + 22);
    ctx.lineTo(cx + 12, by + 22); ctx.lineTo(cx + 16, by + 10);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 16, by + 10); ctx.lineTo(cx + 16, by + 10); ctx.stroke();
}

function drawShieldEffect(ox, oy) {
    if (!shieldActive) return;
    const sx = Math.round(player.x - ox) + player.width / 2;
    const sy = Math.round(player.y - oy) + player.height / 2;
    const pulse = 0.4 + 0.2 * Math.sin(performance.now() / 150);
    ctx.strokeStyle = `rgba(100,150,255,${pulse + 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(sx, sy, 18, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = `rgba(100,150,255,${pulse * 0.3})`;
    ctx.beginPath(); ctx.arc(sx, sy, 18, 0, Math.PI * 2); ctx.fill();
}

function drawSleepOverlay() {
    if (!activeAction || activeAction.name !== 'bed') return;
    const elapsed = performance.now() - activeAction.realStart;
    const darkness = Math.min(elapsed / 1000, 1) * 0.6;
    ctx.fillStyle = `rgba(0,0,20,${darkness})`; ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ── Snow Weather Rendering ───────────────────────────────────
function drawSnowOverlay(camX, camY, startCol, endCol, startRow, endRow) {
    if (!isSnowing()) return;
    ctx.save();
    const snowStartRow = Math.max(startRow, SNOW_CASTLE_ROW + 1);
    if (snowStartRow <= endRow) {
        for (let row = snowStartRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const tile = map[row][col];
                const tx = col * T - camX;
                const ty = row * T - camY;
                // Outdoor ground tiles get snow accumulation
                if (tile === GRASS || tile === PATH || tile === SAND || tile === BRIDGE ||
                    tile === MOUNTAIN || tile === MOUNTAIN_PATH || tile === TENT ||
                    tile === CAMPFIRE || tile === DOCK || tile === PEAK_FLOOR ||
                    tile === HUT_FLOOR || tile === HUT_WALL) {
                    ctx.fillStyle = 'rgba(230,240,255,0.3)';
                    ctx.fillRect(tx, ty, T, T);
                    // Snow drift line at top of tile
                    ctx.fillStyle = 'rgba(255,255,255,0.45)';
                    ctx.fillRect(tx, ty, T, 3);
                } else if (tile === TREE) {
                    // Snow on treetops
                    ctx.fillStyle = 'rgba(240,245,255,0.35)';
                    ctx.fillRect(tx, ty, T, T);
                    ctx.fillStyle = 'rgba(255,255,255,0.5)';
                    ctx.fillRect(tx + 4, ty + 2, T - 8, 4);
                } else if (tile === WATER) {
                    // Light frost on water
                    ctx.fillStyle = 'rgba(200,220,245,0.12)';
                    ctx.fillRect(tx, ty, T, T);
                }
            }
        }
    }
    ctx.restore();
}

function drawSnowParticles() {
    if (!isSnowing() || snowParticles.length === 0) return;
    // Only show falling snow when player is outside the castle
    const playerRow = Math.floor(player.y / T);
    if (playerRow <= SNOW_CASTLE_ROW) return;
    ctx.save();
    for (let i = 0; i < snowParticles.length; i++) {
        const p = snowParticles[i];
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// ── Ice Trap Rendering ───────────────────────────────────────
function drawIceTrap(ox, oy) {
    if (!iceTrap.active) return;
    const sx = Math.round(player.x - ox);
    const sy = Math.round(player.y - oy);
    const cx = sx + player.width / 2;
    const cy = sy + player.height / 2;
    const elapsed = gameTime - iceTrap.startTime;
    const timeRatio = Math.min(elapsed / iceTrap.duration, 1);

    ctx.save();
    // Ice block around player
    const bw = player.width + 16, bh = player.height + 16;
    const bx = cx - bw / 2, by = cy - bh / 2;

    // Outer ice block
    const pulse = 0.6 + 0.15 * Math.sin(performance.now() / 300);
    ctx.fillStyle = `rgba(140,200,240,${pulse * 0.4})`;
    ctx.fillRect(bx, by, bw, bh);

    // Ice edges (thicker, brighter)
    ctx.strokeStyle = `rgba(180,220,255,${pulse * 0.8})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);

    // Inner highlight (shiny ice look)
    ctx.strokeStyle = `rgba(220,240,255,${pulse * 0.5})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

    // Frost cracks (decorative lines inside)
    ctx.strokeStyle = `rgba(200,230,255,${0.3 + 0.1 * Math.sin(performance.now() / 400)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx + 4, by + 4); ctx.lineTo(cx - 2, cy - 4);
    ctx.moveTo(bx + bw - 4, by + 4); ctx.lineTo(cx + 2, cy - 2);
    ctx.moveTo(bx + 4, by + bh - 4); ctx.lineTo(cx - 3, cy + 3);
    ctx.stroke();

    // Cracks appear as player hits more
    const crackProgress = iceTrap.hits / iceTrap.hitsNeeded;
    if (crackProgress > 0.2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, by); ctx.lineTo(cx + 3, cy - 5); ctx.lineTo(cx - 2, cy); ctx.stroke();
    }
    if (crackProgress > 0.5) {
        ctx.beginPath(); ctx.moveTo(bx, cy); ctx.lineTo(cx - 5, cy + 2); ctx.lineTo(cx - 3, cy + 6); ctx.stroke();
    }
    if (crackProgress > 0.8) {
        ctx.beginPath(); ctx.moveTo(cx + 4, by + 2); ctx.lineTo(bx + bw - 2, cy - 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, by + bh); ctx.lineTo(cx + 2, cy + 4); ctx.stroke();
    }

    // Snowflake icon on the ice block
    ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(220,240,255,${0.5 + 0.3 * Math.sin(performance.now() / 250)})`;
    ctx.fillText('*', bx + 6, by + 6);
    ctx.fillText('*', bx + bw - 6, by + bh - 6);

    // Timer bar at top (red as time runs out)
    const barW = bw, barH = 4;
    const barX = bx, barY = by - 8;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(barX, barY, barW, barH);
    const remaining = 1 - timeRatio;
    const r = Math.floor(255 * timeRatio), g = Math.floor(150 * remaining);
    ctx.fillStyle = `rgb(${r},${g},255)`;
    ctx.fillRect(barX + 1, barY + 1, (barW - 2) * remaining, barH - 2);

    // Hit counter
    ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${iceTrap.hits}/${iceTrap.hitsNeeded}`, cx, by - 10);

    ctx.restore();
}
