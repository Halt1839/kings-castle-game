// ── Tile Drawing ────────────────────────────────────────────

function drawTile(col, row, ox, oy) {
    const x = col * T - ox, y = row * T - oy;
    const tile = map[row][col];
    switch (tile) {
        case VOID: ctx.fillStyle = '#1a1a2e'; ctx.fillRect(x, y, T, T); break;
        case FLOOR:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#b8a068'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T); break;
        case BATH_FLOOR:
            ctx.fillStyle = '#b0c4d8'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#98b0c0'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T); break;
        case WALL:
            ctx.fillStyle = '#6b6b7b'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#5b5b6b'; ctx.fillRect(x + 1, y + 1, T/2-2, T/2-2); ctx.fillRect(x+T/2, y+T/2, T/2-1, T/2-1);
            ctx.strokeStyle = '#4a4a5a'; ctx.lineWidth = 1; ctx.strokeRect(x, y, T, T); break;
        case DOOR:
            ctx.fillStyle = '#8B6914'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#a07818'; ctx.fillRect(x+4, y+2, T-8, T-4); break;
        case THRONE:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x+4, y+2, T-8, T-4);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(x+6, y, T-12, 6);
            ctx.fillStyle = '#FFD700'; ctx.fillRect(x+T/2-2, y+1, 4, 4); break;
        case BED_HEAD:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#3d2010'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.fillStyle = '#5a3520'; ctx.fillRect(x+3, y+3, T-6, T-6);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(x+T/2-3, y+4, 6, 3); break;
        case PILLOW:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.fillStyle = '#F5F5DC'; ctx.fillRect(x+4, y+6, T-8, T-12);
            ctx.fillStyle = '#EDEDD5'; ctx.fillRect(x+6, y+8, T-12, T-16); break;
        case BED_FOOT:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x+1, y+1, T-2, T-4);
            ctx.fillStyle = '#6B0000'; ctx.fillRect(x+3, y+2, T-6, 4);
            ctx.fillStyle = '#3d2010'; ctx.fillRect(x+1, y+T-4, T-2, 3); break;
        case NIGHTSTAND:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#5a3520'; ctx.fillRect(x+4, y+4, T-8, T-8);
            ctx.fillStyle = '#3d2010'; ctx.fillRect(x+4, y+T/2-1, T-8, 2);
            ctx.fillStyle = '#F5F5DC'; ctx.fillRect(x+T/2-2, y+1, 4, 6);
            ctx.fillStyle = '#FF8C00'; ctx.fillRect(x+T/2-1, y-1, 2, 3); break;
        case TABLE:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B5E3C'; ctx.fillRect(x+2, y+2, T-4, T-4); break;
        case STOVE:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#444'; ctx.fillRect(x+2, y+2, T-4, T-4);
            ctx.fillStyle = '#FF4500'; ctx.fillRect(x+8, y+8, T-16, T-16); break;
        case CARPET:
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#DAA520'; ctx.fillRect(x+2, y, T-4, T);
            ctx.fillStyle = '#8B0000'; ctx.fillRect(x+5, y, T-10, T); break;
        case RUG:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#4a2560'; ctx.fillRect(x+1, y+1, T-2, T-2);
            ctx.fillStyle = '#6a3580'; ctx.fillRect(x+4, y+4, T-8, T-8); break;
        case BARREL:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#8B5E3C'; ctx.beginPath(); ctx.arc(x+T/2, y+T/2, T/2-4, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x+T/2, y+T/2, T/2-4, 0, Math.PI*2); ctx.stroke(); break;
        case SHELF:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#654321'; ctx.fillRect(x+2, y+6, T-4, 4); ctx.fillRect(x+2, y+18, T-4, 4);
            ctx.fillStyle = '#a03030'; ctx.fillRect(x+4, y+2, 5, 4);
            ctx.fillStyle = '#3050a0'; ctx.fillRect(x+11, y+2, 5, 4);
            ctx.fillStyle = '#40a040'; ctx.fillRect(x+6, y+14, 6, 4); break;
        case WINDOW_TILE:
            ctx.fillStyle = '#6b6b7b'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#87CEEB'; ctx.fillRect(x+6, y+4, T-12, T-8);
            ctx.strokeStyle = '#654321'; ctx.lineWidth = 2; ctx.strokeRect(x+6, y+4, T-12, T-8);
            ctx.beginPath(); ctx.moveTo(x+T/2, y+4); ctx.lineTo(x+T/2, y+T-4); ctx.stroke(); break;
        case TORCH:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
            ctx.strokeStyle = '#b8a068'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);
            ctx.fillStyle = '#555'; ctx.fillRect(x+13, y+12, 6, 4);
            ctx.fillStyle = '#FF8C00'; ctx.beginPath(); ctx.arc(x+T/2, y+10, 5, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(x+T/2, y+10, 3, 0, Math.PI*2); ctx.fill(); break;
        case CHAIR:
            ctx.fillStyle = '#c8b078'; ctx.fillRect(x, y, T, T);
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
        case GRASS:
            ctx.fillStyle = '#4a8c3f'; ctx.fillRect(x, y, T, T);
            // Grass blades
            ctx.fillStyle = '#3d7a34';
            ctx.fillRect(x+4, y+8, 2, 6); ctx.fillRect(x+12, y+4, 2, 5);
            ctx.fillRect(x+22, y+10, 2, 7); ctx.fillRect(x+8, y+20, 2, 5);
            ctx.fillRect(x+18, y+16, 2, 6); ctx.fillRect(x+26, y+22, 2, 5);
            break;
        case PATH:
            ctx.fillStyle = '#b09860'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#a08850'; ctx.fillRect(x+3, y+5, 4, 3); ctx.fillRect(x+14, y+18, 5, 3);
            ctx.fillRect(x+22, y+8, 3, 3);
            break;
        case WATER:
            ctx.fillStyle = '#2874a6'; ctx.fillRect(x, y, T, T);
            ctx.fillStyle = '#3498db';
            const wt = performance.now() / 800 + x * 0.1;
            for (let i = 0; i < 3; i++) {
                const wy = y + 6 + i * 10 + Math.sin(wt + i) * 2;
                ctx.beginPath(); ctx.moveTo(x, wy); ctx.quadraticCurveTo(x+T/2, wy - 4, x+T, wy); ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(100,180,255,0.4)'; ctx.stroke();
            }
            break;
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
    }
}

// ── King Drawing ────────────────────────────────────────────

function drawKing(ox, oy) {
    if (activeAction) return;
    const sx = Math.round(player.x - ox), sy = Math.round(player.y - oy);
    const cx = sx + player.width / 2;

    // Walk bob
    const walkBob = playerWalking ? Math.sin(playerWalkPhase * Math.PI) * 2 : 0;
    const legSwing = playerWalking ? Math.sin(playerWalkPhase * Math.PI) * 4 : 0;
    const bodyY = sy + walkBob;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(cx, sy+player.height+2, 8, 3, 0, 0, Math.PI*2); ctx.fill();
    // Body
    ctx.fillStyle = '#8B0000'; ctx.fillRect(sx+2, bodyY+8, 12, 10);
    ctx.fillStyle = '#DAA520'; ctx.fillRect(sx+2, bodyY+8, 12, 2);
    // Head
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx, bodyY+6, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(cx-3, bodyY+5, 2, 2); ctx.fillRect(cx+1, bodyY+5, 2, 2);
    // Crown
    ctx.fillStyle = (typeof voidStarActive !== 'undefined' && voidStarActive) ? '#4B0082' : '#FFD700';
    ctx.fillRect(sx+3, bodyY-1, 10, 4);
    ctx.fillRect(sx+3, bodyY-4, 2, 3); ctx.fillRect(sx+7, bodyY-5, 2, 4); ctx.fillRect(sx+11, bodyY-4, 2, 3);
    ctx.fillStyle = (typeof voidStarActive !== 'undefined' && voidStarActive) ? '#C88FFF' : '#FF0000';
    ctx.fillRect(sx+7, bodyY-1, 2, 2);
    // Arms
    ctx.fillStyle = '#f5c6a0'; ctx.fillRect(sx, bodyY+9, 3, 6); ctx.fillRect(sx+13, bodyY+9, 3, 6);
    // Legs (animated when walking)
    ctx.fillStyle = '#4a2800';
    ctx.fillRect(sx+3, sy+17 + legSwing, 4, 3);
    ctx.fillRect(sx+9, sy+17 - legSwing, 4, 3);

    // Sword (if picked up)
    if (swordPickedUp) {
        const swingElapsed = performance.now() - swordSwingTime;
        const swinging = swingElapsed < SWORD_SWING_DURATION;
        ctx.save();
        ctx.translate(sx + 16, bodyY + 10);
        if (swinging) {
            // Swing arc: rotate from -60 to +60 degrees
            const swingProgress = swingElapsed / SWORD_SWING_DURATION;
            const angle = (-1 + swingProgress * 2) * Math.PI / 3;
            ctx.rotate(angle);
        } else {
            ctx.rotate(-0.3); // idle angle
        }
        // Sword blade
        const swordColor = currentSword === 'dragon' ? '#FF6633' : currentSword === 'kings' ? '#FFD700' : '#C0C0C0';
        ctx.fillStyle = swordColor; ctx.fillRect(-1, -14, 3, 12);
        // Guard
        ctx.fillStyle = '#DAA520'; ctx.fillRect(-3, -2, 7, 2);
        // Handle
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, 0, 3, 4);
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
        const swordColor = currentSword === 'dragon' ? '#FF6633' : currentSword === 'kings' ? '#FFD700' : '#C0C0C0';
        ctx.fillStyle = swordColor; ctx.fillRect(-1, -14, 3, 12);
        ctx.fillStyle = '#DAA520'; ctx.fillRect(-3, -2, 7, 2);
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-1, 0, 3, 4);
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
