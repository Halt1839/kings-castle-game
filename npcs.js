// ── NPC Drawing ─────────────────────────────────────────────

function drawWizard(ox, oy) {
    const sx = Math.round(wizard.x - ox), sy = Math.round(wizard.y - oy);
    const cx = sx + wizard.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + wizard.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Robe
    ctx.fillStyle = '#2a1a5e'; ctx.fillRect(sx + 1, sy + 7, 14, 12);
    ctx.fillStyle = '#3a2a7e'; ctx.fillRect(sx + 3, sy + 8, 10, 10);
    // Belt/sash
    ctx.fillStyle = '#DAA520'; ctx.fillRect(sx + 2, sy + 13, 12, 2);
    // Head
    ctx.fillStyle = '#e8c4a0'; ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
    // Beard
    ctx.fillStyle = '#ccc'; ctx.fillRect(cx - 3, sy + 7, 6, 5);
    ctx.fillRect(cx - 2, sy + 12, 4, 3);
    // Pointy hat
    ctx.fillStyle = '#2a1a5e';
    ctx.beginPath(); ctx.moveTo(cx, sy - 14); ctx.lineTo(sx + 2, sy + 2); ctx.lineTo(sx + 14, sy + 2); ctx.closePath(); ctx.fill();
    // Hat star
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(cx, sy - 4, 2, 0, Math.PI * 2); ctx.fill();
    // Staff
    ctx.fillStyle = '#654321'; ctx.fillRect(sx + 15, sy - 8, 2, 26);
    // Staff orb
    ctx.fillStyle = '#8A2BE2';
    ctx.beginPath(); ctx.arc(sx + 16, sy - 10, 4, 0, Math.PI * 2); ctx.fill();
    const glow = 0.3 + 0.2 * Math.sin(performance.now() / 400);
    ctx.fillStyle = `rgba(138,43,226,${glow})`;
    ctx.beginPath(); ctx.arc(sx + 16, sy - 10, 7, 0, Math.PI * 2); ctx.fill();
    // Feet
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(sx + 3, sy + 18, 4, 2); ctx.fillRect(sx + 9, sy + 18, 4, 2);
}

function drawSpider(ox, oy) {
    if (!spider.alive || !spider.active) return;
    const sx = Math.round(spider.x - ox), sy = Math.round(spider.y - oy);
    const cx = sx + spider.width / 2, cy = sy + spider.height / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, sy + spider.height + 2, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
    // Legs (4 per side)
    ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        const legY = cy - 6 + i * 4;
        const bend = Math.sin(performance.now() / 200 + i) * 3;
        // Left legs
        ctx.beginPath(); ctx.moveTo(cx - 6, legY); ctx.lineTo(cx - 16 - bend, legY - 4 + i * 2); ctx.lineTo(cx - 20, legY + 4 + bend); ctx.stroke();
        // Right legs
        ctx.beginPath(); ctx.moveTo(cx + 6, legY); ctx.lineTo(cx + 16 + bend, legY - 4 + i * 2); ctx.lineTo(cx + 20, legY + 4 - bend); ctx.stroke();
    }
    // Body (abdomen)
    ctx.fillStyle = '#1a0a00';
    ctx.beginPath(); ctx.ellipse(cx, cy + 4, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Markings on abdomen
    ctx.fillStyle = '#8B0000';
    ctx.beginPath(); ctx.ellipse(cx, cy + 2, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - 1, cy - 2, 2, 8);
    // Head
    ctx.fillStyle = '#2a1200';
    ctx.beginPath(); ctx.ellipse(cx, cy - 6, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Eyes (multiple)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath(); ctx.arc(cx - 4, cy - 8, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy - 8, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FF4444';
    ctx.beginPath(); ctx.arc(cx - 2, cy - 6, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 2, cy - 6, 1.5, 0, Math.PI * 2); ctx.fill();
    // Fangs
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(cx - 3, cy - 2, 2, 4); ctx.fillRect(cx + 1, cy - 2, 2, 4);
    // Stun stars
    if (spider.stunned) {
        const st = performance.now() / 200;
        for (let i = 0; i < 3; i++) {
            const angle = st + i * (Math.PI * 2 / 3);
            const starX = cx + Math.cos(angle) * 12;
            const starY = sy - 6 + Math.sin(angle) * 5;
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('*', starX, starY);
        }
    }
    // HP bar above spider
    const barW = 40, barH = 6;
    const barX = cx - barW / 2, barY = sy - 16;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#e53935'; ctx.fillRect(barX + 1, barY + 1, (barW - 2) * (spider.hp / spider.maxHp), barH - 2);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
}

function drawCook(ox, oy) {
    const sx = Math.round(cook.x - ox), sy = Math.round(cook.y - oy);
    const cx = sx + cook.width / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + cook.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F5F5F5'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    ctx.fillStyle = '#ddd'; ctx.fillRect(sx + 6, sy + 10, 4, 8);
    ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(cx, sy + 6, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, sy + 7, 2, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(sx + 3, sy - 2, 10, 5); ctx.fillRect(sx + 4, sy - 7, 8, 6);
    ctx.beginPath(); ctx.arc(cx, sy - 7, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d4a574'; ctx.fillRect(sx, sy + 9, 3, 6); ctx.fillRect(sx + 13, sy + 9, 3, 6);
    ctx.fillStyle = '#333'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
    if (cookingState.active && !cookingState.done) {
        const t = performance.now() / 300;
        ctx.strokeStyle = 'rgba(200,200,200,0.6)'; ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const wave = Math.sin(t + i * 2) * 3;
            ctx.beginPath(); ctx.moveTo(cx - 4 + i * 4, sy - 12); ctx.lineTo(cx - 4 + i * 4 + wave, sy - 20); ctx.stroke();
        }
    }
}

function drawGuard(npc, ox, oy) {
    const sx = Math.round(npc.x - ox), sy = Math.round(npc.y - oy);
    const cx = sx + npc.width / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + npc.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#708090'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    ctx.fillStyle = '#5a6a7a'; ctx.fillRect(sx + 4, sy + 9, 8, 7);
    ctx.fillStyle = '#8B5E3C'; ctx.fillRect(sx + 2, sy + 14, 12, 2);
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx, sy + 6, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);
    ctx.fillStyle = '#708090'; ctx.fillRect(sx + 2, sy - 3, 12, 7);
    ctx.fillStyle = '#5a6a7a'; ctx.fillRect(sx + 4, sy - 1, 8, 3);
    ctx.fillStyle = '#8B0000'; ctx.fillRect(sx + 7, sy - 6, 2, 4);
    ctx.fillStyle = '#708090'; ctx.fillRect(sx, sy + 9, 3, 6); ctx.fillRect(sx + 13, sy + 9, 3, 6);
    ctx.fillStyle = '#8B5E3C'; ctx.fillRect(sx + 15, sy - 10, 2, 28);
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath(); ctx.moveTo(sx + 16, sy - 14); ctx.lineTo(sx + 14, sy - 8); ctx.lineTo(sx + 18, sy - 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#555'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
}

function drawButler(ox, oy) {
    const sx = Math.round(butler.x - ox), sy = Math.round(butler.y - oy);
    const cx = sx + butler.width / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + butler.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    ctx.fillStyle = '#F5F5F5'; ctx.fillRect(sx + 5, sy + 8, 6, 8);
    ctx.fillStyle = '#8B0000'; ctx.fillRect(sx + 6, sy + 8, 4, 2);
    ctx.fillStyle = '#e8c4a0'; ctx.beginPath(); ctx.arc(cx, sy + 6, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 3, sy + 8); ctx.lineTo(cx - 1, sy + 7); ctx.lineTo(cx + 1, sy + 7); ctx.lineTo(cx + 3, sy + 8); ctx.stroke();
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(sx + 3, sy - 1, 10, 4); ctx.fillRect(sx + 4, sy - 2, 8, 2);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(sx, sy + 9, 3, 4); ctx.fillRect(sx + 13, sy + 9, 3, 4);
    ctx.fillStyle = '#F5F5F5'; ctx.fillRect(sx, sy + 13, 3, 2); ctx.fillRect(sx + 13, sy + 13, 3, 2);
    ctx.fillStyle = '#111'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
    if (butlerState.fetching) {
        const bob = Math.sin(performance.now() / 200);
        ctx.fillStyle = '#C0C0C0'; ctx.fillRect(sx - 2, sy + 6 + bob, 6, 2);
        ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.arc(sx + 1, sy + 5 + bob, 3, Math.PI, 0); ctx.fill();
    }
    // Exclamation mark when farewell is ready
    if (butlerState.farewellReady && !butlerState.farewellTriggered) {
        const bounce = Math.sin(performance.now() / 300) * 3;
        ctx.fillStyle = 'rgba(138,43,226,0.9)';
        ctx.beginPath(); ctx.arc(cx, sy - 12 + bounce, 10, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('!', cx, sy - 4 + bounce);
    }
}

function drawSeaSnake(ox, oy) {
    if (typeof seaSnake === 'undefined' || !seaSnake.alive || !seaSnake.active) return;
    const sx = Math.round(seaSnake.x - ox), sy = Math.round(seaSnake.y - oy);
    const cx = sx + seaSnake.width / 2, cy = sy + seaSnake.height / 2;
    // Undulating body
    const t = performance.now() / 300;
    ctx.strokeStyle = '#2d6a3e'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    for (let i = 1; i <= 6; i++) {
        ctx.lineTo(cx - i * 8 + Math.sin(t + i * 0.8) * 6, cy + Math.cos(t + i * 0.8) * 4);
    }
    ctx.stroke();
    ctx.strokeStyle = '#3a9a5e'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    for (let i = 1; i <= 6; i++) {
        ctx.lineTo(cx - i * 8 + Math.sin(t + i * 0.8) * 6, cy + Math.cos(t + i * 0.8) * 4);
    }
    ctx.stroke();
    // Head
    ctx.fillStyle = '#1a6a3a';
    ctx.beginPath(); ctx.ellipse(cx, cy, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a8a4e';
    ctx.beginPath(); ctx.ellipse(cx, cy, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(cx - 4, cy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - 4.5, cy - 4, 1.5, 3); ctx.fillRect(cx + 3.5, cy - 4, 1.5, 3);
    // Tongue
    const tongueFlick = Math.sin(performance.now() / 150) * 4;
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy + 6); ctx.lineTo(cx + tongueFlick, cy + 12);
    ctx.moveTo(cx + tongueFlick, cy + 12); ctx.lineTo(cx + tongueFlick - 2, cy + 15);
    ctx.moveTo(cx + tongueFlick, cy + 12); ctx.lineTo(cx + tongueFlick + 2, cy + 15);
    ctx.stroke();
    // Stun stars
    if (seaSnake.stunned) {
        const st = performance.now() / 200;
        for (let i = 0; i < 3; i++) {
            const angle = st + i * (Math.PI * 2 / 3);
            const starX = cx + Math.cos(angle) * 14;
            const starY = sy - 6 + Math.sin(angle) * 5;
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('*', starX, starY);
        }
    }
    // HP bar
    const barW = 50, barH = 6;
    const barX = cx - barW / 2, barY = sy - 16;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#e53935'; ctx.fillRect(barX + 1, barY + 1, (barW - 2) * (seaSnake.hp / seaSnake.maxHp), barH - 2);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
}

function drawCampLeader(ox, oy) {
    const sx = Math.round(campLeader.x - ox), sy = Math.round(campLeader.y - oy);
    const cx = sx + campLeader.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + campLeader.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Chainmail body
    ctx.fillStyle = '#708090'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    ctx.fillStyle = '#8a9aaa'; ctx.fillRect(sx + 4, sy + 9, 8, 8);
    // Belt
    ctx.fillStyle = '#8B5E3C'; ctx.fillRect(sx + 2, sy + 14, 12, 2);
    // Head
    ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(cx, sy + 6, 5, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);
    // Stubble
    ctx.fillStyle = '#8a7a6a'; ctx.fillRect(cx - 3, sy + 8, 6, 2);
    // Helmet
    ctx.fillStyle = '#708090'; ctx.fillRect(sx + 3, sy - 1, 10, 5);
    ctx.fillStyle = '#5a6a7a'; ctx.fillRect(sx + 5, sy, 6, 3);
    // Helmet crest
    ctx.fillStyle = '#8B0000'; ctx.fillRect(sx + 7, sy - 4, 2, 4);
    // Shield on back
    ctx.fillStyle = '#4a6a9a'; ctx.beginPath(); ctx.arc(sx + 15, sy + 12, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a5a8a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(sx + 15, sy + 12, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(sx + 15, sy + 12, 2, 0, Math.PI * 2); ctx.fill();
    // Arms
    ctx.fillStyle = '#708090'; ctx.fillRect(sx, sy + 9, 3, 6); ctx.fillRect(sx + 13, sy + 9, 3, 6);
    // Feet
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
    // Exclamation mark when siege complete and shield not given
    if (orcSiege.complete && !orcSiege.shieldGiven) {
        const bounce = Math.sin(performance.now() / 300) * 3;
        ctx.fillStyle = 'rgba(100,150,255,0.9)';
        ctx.beginPath(); ctx.arc(cx, sy - 12 + bounce, 10, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('!', cx, sy - 4 + bounce);
    }
}

function drawOrc(orc, ox, oy) {
    if (!orc.alive) return;
    const sx = Math.round(orc.x - ox), sy = Math.round(orc.y - oy);
    const cx = sx + orc.width / 2, cy = sy + orc.height / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + orc.height + 1, 7, 2, 0, 0, Math.PI * 2); ctx.fill();
    // Body (dark leather)
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(sx + 3, sy + 7, 14, 9);
    ctx.fillStyle = '#4a3a2a'; ctx.fillRect(sx + 5, sy + 8, 10, 7);
    // Head (green)
    ctx.fillStyle = '#4a8a3a'; ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    // Darker green patches
    ctx.fillStyle = '#3a6a2a'; ctx.fillRect(cx - 4, sy + 3, 3, 3);
    // Eyes (red)
    ctx.fillStyle = '#FF3333'; ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
    // Jaw/tusks
    ctx.fillStyle = '#F5F5DC'; ctx.fillRect(cx - 2, sy + 8, 2, 2); ctx.fillRect(cx + 1, sy + 8, 2, 2);
    // Arm with weapon
    ctx.fillStyle = '#4a8a3a'; ctx.fillRect(sx + 1, sy + 8, 3, 5);
    ctx.fillStyle = '#654321'; ctx.fillRect(sx - 1, sy + 5, 2, 8); // club handle
    ctx.fillStyle = '#555'; ctx.fillRect(sx - 2, sy + 3, 4, 4); // club head
    // Other arm
    ctx.fillStyle = '#4a8a3a'; ctx.fillRect(sx + 16, sy + 8, 3, 5);
    // Feet
    ctx.fillStyle = '#2a1a0a'; ctx.fillRect(sx + 4, sy + 15, 4, 3); ctx.fillRect(sx + 12, sy + 15, 4, 3);
    // Stun stars
    if (orc.stunned) {
        const st = performance.now() / 200;
        for (let i = 0; i < 3; i++) {
            const angle = st + i * (Math.PI * 2 / 3);
            const starX = cx + Math.cos(angle) * 10;
            const starY = sy - 4 + Math.sin(angle) * 4;
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('*', starX, starY);
        }
    }
    // HP bar
    const barW = 24, barH = 4;
    const barX = cx - barW / 2, barY = sy - 8;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#e53935'; ctx.fillRect(barX + 1, barY + 1, (barW - 2) * (orc.hp / orc.maxHp), barH - 2);
}

function drawAllOrcs(ox, oy) {
    if (typeof orcs === 'undefined') return;
    for (const orc of orcs) drawOrc(orc, ox, oy);
}

function drawTroll(ox, oy) {
    if (typeof troll === 'undefined' || !troll.alive) return;
    const sx = Math.round(troll.x - ox), sy = Math.round(troll.y - oy);
    const cx = sx + troll.width / 2, cy = sy + troll.height / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, sy + troll.height + 2, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Body (large, muscular)
    ctx.fillStyle = '#5a6a3a'; ctx.fillRect(sx - 2, sy + 4, 32, 20);
    ctx.fillStyle = '#4a5a2a'; ctx.fillRect(sx + 2, sy + 6, 24, 16);
    // Belt
    ctx.fillStyle = '#654321'; ctx.fillRect(sx - 1, sy + 18, 30, 3);
    ctx.fillStyle = '#DAA520'; ctx.fillRect(cx - 3, sy + 18, 6, 3);
    // Head
    ctx.fillStyle = '#6a7a4a';
    ctx.beginPath(); ctx.arc(cx, sy + 2, 8, 0, Math.PI * 2); ctx.fill();
    // Brow ridge
    ctx.fillStyle = '#5a6a3a'; ctx.fillRect(sx + 2, sy - 2, 24, 4);
    // Eyes (yellow, angry)
    ctx.fillStyle = '#FFD700'; ctx.fillRect(cx - 5, sy, 3, 3); ctx.fillRect(cx + 2, sy, 3, 3);
    ctx.fillStyle = '#000'; ctx.fillRect(cx - 4, sy + 1, 1.5, 1.5); ctx.fillRect(cx + 3, sy + 1, 1.5, 1.5);
    // Mouth/teeth
    ctx.fillStyle = '#3a2a0a'; ctx.fillRect(cx - 3, sy + 5, 6, 3);
    ctx.fillStyle = '#F5F5DC'; ctx.fillRect(cx - 2, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);
    // Arms (thick)
    ctx.fillStyle = '#5a6a3a';
    ctx.fillRect(sx - 6, sy + 6, 6, 14);
    ctx.fillRect(sx + troll.width, sy + 6, 6, 14);
    // Club in right hand
    ctx.fillStyle = '#4a3a1a'; ctx.fillRect(sx + troll.width + 2, sy - 4, 4, 18);
    ctx.fillStyle = '#555'; ctx.fillRect(sx + troll.width, sy - 8, 8, 6);
    ctx.fillStyle = '#666'; ctx.fillRect(sx + troll.width + 1, sy - 7, 6, 4);
    // Feet
    ctx.fillStyle = '#4a5a2a'; ctx.fillRect(sx, sy + 23, 8, 5); ctx.fillRect(sx + 18, sy + 23, 8, 5);
    // Stun effect (stars spinning around head)
    if (troll.stunned) {
        const st = performance.now() / 200;
        for (let i = 0; i < 3; i++) {
            const angle = st + i * (Math.PI * 2 / 3);
            const starX = cx + Math.cos(angle) * 14;
            const starY = sy - 6 + Math.sin(angle) * 6;
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('*', starX, starY);
        }
    }
    // HP bar
    const barW = 50, barH = 6;
    const barX = cx - barW / 2, barY = sy - 16;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#e53935'; ctx.fillRect(barX + 1, barY + 1, (barW - 2) * (troll.hp / troll.maxHp), barH - 2);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
}

function drawDragon(ox, oy) {
    if (typeof dragon === 'undefined' || !dragon.alive) return;
    const sx = Math.round(dragon.x - ox), sy = Math.round(dragon.y - oy);
    const cx = sx + dragon.width / 2, cy = sy + dragon.height / 2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, sy + dragon.height + 4, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Wings
    const wingFlap = Math.sin(performance.now() / 400) * 8;
    ctx.fillStyle = '#6a1a1a';
    // Left wing
    ctx.beginPath(); ctx.moveTo(cx - 8, cy - 4);
    ctx.lineTo(cx - 32, cy - 20 + wingFlap); ctx.lineTo(cx - 24, cy + 4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8a2a2a';
    ctx.beginPath(); ctx.moveTo(cx - 8, cy - 2);
    ctx.lineTo(cx - 28, cy - 16 + wingFlap); ctx.lineTo(cx - 20, cy + 2);
    ctx.closePath(); ctx.fill();
    // Right wing
    ctx.fillStyle = '#6a1a1a';
    ctx.beginPath(); ctx.moveTo(cx + 8, cy - 4);
    ctx.lineTo(cx + 32, cy - 20 + wingFlap); ctx.lineTo(cx + 24, cy + 4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8a2a2a';
    ctx.beginPath(); ctx.moveTo(cx + 8, cy - 2);
    ctx.lineTo(cx + 28, cy - 16 + wingFlap); ctx.lineTo(cx + 20, cy + 2);
    ctx.closePath(); ctx.fill();

    // Body
    ctx.fillStyle = '#8B0000';
    ctx.beginPath(); ctx.ellipse(cx, cy + 2, 14, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aa2020';
    ctx.beginPath(); ctx.ellipse(cx, cy + 2, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Belly scales
    ctx.fillStyle = '#cc6600';
    ctx.beginPath(); ctx.ellipse(cx, cy + 6, 6, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Neck
    ctx.fillStyle = '#8B0000'; ctx.fillRect(cx - 4, cy - 14, 8, 12);
    // Head
    ctx.fillStyle = '#8B0000';
    ctx.beginPath(); ctx.ellipse(cx, cy - 16, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aa2020';
    ctx.beginPath(); ctx.ellipse(cx, cy - 16, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Horns
    ctx.fillStyle = '#444';
    ctx.beginPath(); ctx.moveTo(cx - 6, cy - 22); ctx.lineTo(cx - 10, cy - 30); ctx.lineTo(cx - 4, cy - 20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 6, cy - 22); ctx.lineTo(cx + 10, cy - 30); ctx.lineTo(cx + 4, cy - 20); ctx.fill();
    // Eyes
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(cx - 4, cy - 18, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy - 18, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - 4.5, cy - 19, 1.5, 3); ctx.fillRect(cx + 3.5, cy - 19, 1.5, 3);
    // Nostrils (glow when winding up)
    if (dragon.windingUp) {
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 100);
        ctx.fillStyle = `rgba(255,${Math.floor(100 + pulse * 100)},0,${pulse})`;
        ctx.beginPath(); ctx.arc(cx - 3, cy - 12, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 3, cy - 12, 3, 0, Math.PI * 2); ctx.fill();
    } else {
        ctx.fillStyle = '#550000';
        ctx.beginPath(); ctx.arc(cx - 3, cy - 12, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 3, cy - 12, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // Tail
    ctx.strokeStyle = '#8B0000'; ctx.lineWidth = 4;
    const tailWag = Math.sin(performance.now() / 300) * 6;
    ctx.beginPath(); ctx.moveTo(cx, cy + 12);
    ctx.quadraticCurveTo(cx + 10 + tailWag, cy + 20, cx + 6 + tailWag, cy + 28);
    ctx.stroke();
    ctx.fillStyle = '#6a1a1a';
    ctx.beginPath(); ctx.moveTo(cx + 6 + tailWag, cy + 28);
    ctx.lineTo(cx + 2 + tailWag, cy + 32); ctx.lineTo(cx + 10 + tailWag, cy + 32);
    ctx.closePath(); ctx.fill();

    // Legs
    ctx.fillStyle = '#7a1010';
    ctx.fillRect(sx + 4, sy + dragon.height - 4, 6, 8);
    ctx.fillRect(sx + dragon.width - 10, sy + dragon.height - 4, 6, 8);
    // Claws
    ctx.fillStyle = '#444';
    ctx.fillRect(sx + 2, sy + dragon.height + 3, 3, 2);
    ctx.fillRect(sx + 8, sy + dragon.height + 3, 3, 2);
    ctx.fillRect(sx + dragon.width - 12, sy + dragon.height + 3, 3, 2);
    ctx.fillRect(sx + dragon.width - 6, sy + dragon.height + 3, 3, 2);

    // Stun effect
    if (dragon.stunned) {
        const st = performance.now() / 200;
        for (let i = 0; i < 4; i++) {
            const angle = st + i * (Math.PI * 2 / 4);
            const starX = cx + Math.cos(angle) * 18;
            const starY = cy - 20 + Math.sin(angle) * 8;
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('*', starX, starY);
        }
    }

    // HP bar
    const hpBarW = 60, hpBarH = 6;
    const hpBarX = cx - hpBarW / 2, hpBarY = sy - 36;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);
    ctx.fillStyle = '#e53935'; ctx.fillRect(hpBarX + 1, hpBarY + 1, (hpBarW - 2) * (dragon.hp / dragon.maxHp), hpBarH - 2);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(hpBarX, hpBarY, hpBarW, hpBarH);
}

function drawGuestRoomNPCs(ox, oy) {
    if (typeof guestRoomBuilt === 'undefined' || !guestRoomBuilt) return;
    // Draw wizard friend in guest room
    const wzx = 25 * T + 8, wzy = 7 * T + 8;
    const wsx = Math.round(wzx - ox), wsy = Math.round(wzy - oy);
    const wcx = wsx + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(wcx, wsy + 18, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a5e'; ctx.fillRect(wsx + 1, wsy + 7, 14, 12);
    ctx.fillStyle = '#DAA520'; ctx.fillRect(wsx + 2, wsy + 13, 12, 2);
    ctx.fillStyle = '#e8c4a0'; ctx.beginPath(); ctx.arc(wcx, wsy + 5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ccc'; ctx.fillRect(wcx - 3, wsy + 7, 6, 5);
    ctx.fillStyle = '#2a1a5e';
    ctx.beginPath(); ctx.moveTo(wcx, wsy - 14); ctx.lineTo(wsx + 2, wsy + 2); ctx.lineTo(wsx + 14, wsy + 2); ctx.closePath(); ctx.fill();

    // Draw camp leader friend
    const clx = 27 * T + 8, cly = 8 * T + 8;
    const csx = Math.round(clx - ox), csy = Math.round(cly - oy);
    const ccx = csx + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(ccx, csy + 18, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#708090'; ctx.fillRect(csx + 2, csy + 8, 12, 10);
    ctx.fillStyle = '#8B5E3C'; ctx.fillRect(csx + 2, csy + 14, 12, 2);
    ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(ccx, csy + 6, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillRect(ccx - 3, csy + 5, 2, 2); ctx.fillRect(ccx + 1, csy + 5, 2, 2);
    ctx.fillStyle = '#708090'; ctx.fillRect(csx + 3, csy - 1, 10, 5);
    ctx.fillStyle = '#8B0000'; ctx.fillRect(csx + 7, csy - 4, 2, 4);
}

function drawVoidSentinel(ox, oy) {
    if (!voidSentinel.alive) return;

    // Dash windup indicator — purple outline at target position
    if (voidSentinel.dashState === 'windup1' || voidSentinel.dashState === 'windup2') {
        const tx = voidSentinel.dashTargetX - ox, ty = voidSentinel.dashTargetY - oy;
        const isSecond = voidSentinel.dashState === 'windup2';
        const windupDur = isSecond ? 2000 : 1000;
        const progress = Math.min(1, (gameTime - voidSentinel.dashWindupStart) / windupDur);
        const pulse = 0.4 + 0.4 * Math.sin(performance.now() / 100);
        // Outer ring (grows with progress)
        ctx.strokeStyle = `rgba(180,100,255,${pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tx, ty, 12 + (1 - progress) * 20, 0, Math.PI * 2); ctx.stroke();
        // Inner target
        ctx.strokeStyle = `rgba(200,140,255,${0.6 + 0.3 * pulse})`;
        ctx.lineWidth = isSecond ? 3 : 2;
        ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
        // Crosshair
        ctx.beginPath(); ctx.moveTo(tx - 6, ty); ctx.lineTo(tx + 6, ty); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx, ty - 6); ctx.lineTo(tx, ty + 6); ctx.stroke();
        // "!" warning above sentinel
        const vsx = Math.round(voidSentinel.x - ox) + 8;
        const vsy = Math.round(voidSentinel.y - oy);
        ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = `rgba(200,140,255,${pulse})`;
        ctx.fillText(isSecond ? '!!' : '!', vsx, vsy - 10);
    }

    // Dash trail effect while dashing
    if (voidSentinel.dashState === 'dashing1' || voidSentinel.dashState === 'dashing2') {
        const vsx = Math.round(voidSentinel.x - ox) + 8;
        const vsy = Math.round(voidSentinel.y - oy) + 8;
        ctx.fillStyle = 'rgba(140,60,220,0.3)';
        ctx.beginPath(); ctx.arc(vsx, vsy, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(180,100,255,0.15)';
        ctx.beginPath(); ctx.arc(vsx, vsy, 16, 0, Math.PI * 2); ctx.fill();
    }

    const sx = Math.round(voidSentinel.x - ox), sy = Math.round(voidSentinel.y - oy);
    const cx = sx + 8;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + 18, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Aggro aura
    if (voidSentinel.aggro) {
        const pulse = 0.15 + 0.1 * Math.sin(performance.now() / 200);
        ctx.fillStyle = `rgba(140,60,220,${pulse})`;
        ctx.beginPath(); ctx.ellipse(cx, sy + 10, 14, 14, 0, 0, Math.PI * 2); ctx.fill();
    }
    // Body — left dark purple, right light purple
    ctx.fillStyle = '#3a1a5e'; ctx.fillRect(sx + 1, sy + 7, 7, 11);
    ctx.fillStyle = '#9a6abf'; ctx.fillRect(sx + 8, sy + 7, 7, 11);
    // Inner tunic
    ctx.fillStyle = '#4a2a6e'; ctx.fillRect(sx + 3, sy + 8, 5, 9);
    ctx.fillStyle = '#8a5aaf'; ctx.fillRect(sx + 8, sy + 8, 5, 9);
    // Belt
    ctx.fillStyle = '#1a0a2e'; ctx.fillRect(sx + 1, sy + 14, 14, 2);
    // Head — split dark/light
    ctx.save();
    ctx.beginPath(); ctx.rect(sx, sy - 6, 8, 16); ctx.clip();
    ctx.fillStyle = '#3a1a5e';
    ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(sx + 8, sy - 6, 8, 16); ctx.clip();
    ctx.fillStyle = '#9a6abf';
    ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Eyes
    ctx.fillStyle = voidSentinel.aggro ? '#fff' : '#aaa';
    ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
    if (voidSentinel.aggro) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.arc(cx - 2, sy + 5, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 2, sy + 5, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    // Void Star on head — 4-pointed star
    const starYPos = sy - 5;
    const starPulse = 0.7 + 0.3 * Math.sin(performance.now() / 300);
    ctx.fillStyle = `rgba(180,100,255,${starPulse * 0.4})`;
    ctx.beginPath(); ctx.arc(cx, starYPos, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(200,140,255,${starPulse})`;
    ctx.beginPath();
    ctx.moveTo(cx, starYPos - 5);
    ctx.lineTo(cx + 1.5, starYPos - 1.5);
    ctx.lineTo(cx + 5, starYPos);
    ctx.lineTo(cx + 1.5, starYPos + 1.5);
    ctx.lineTo(cx, starYPos + 5);
    ctx.lineTo(cx - 1.5, starYPos + 1.5);
    ctx.lineTo(cx - 5, starYPos);
    ctx.lineTo(cx - 1.5, starYPos - 1.5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx, starYPos, 1.5, 0, Math.PI * 2); ctx.fill();
    // Arms
    ctx.fillStyle = '#3a1a5e'; ctx.fillRect(sx - 1, sy + 8, 3, 6);
    ctx.fillStyle = '#9a6abf'; ctx.fillRect(sx + 14, sy + 8, 3, 6);
    // Feet
    ctx.fillStyle = '#1a0a2e';
    ctx.fillRect(sx + 3, sy + 17, 4, 2); ctx.fillRect(sx + 9, sy + 17, 4, 2);
    // Stun stars
    if (voidSentinel.stunned) {
        const st = performance.now() / 200;
        for (let i = 0; i < 3; i++) {
            const angle = st + i * (Math.PI * 2 / 3);
            const sx2 = cx + Math.cos(angle) * 12;
            const sy2 = sy - 2 + Math.sin(angle) * 5;
            ctx.fillStyle = '#C88FFF'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('*', sx2, sy2);
        }
    }
}

function drawFireBreath(ox, oy) {
    if (typeof dragon === 'undefined' || !dragon.alive) return;
    const dcx = dragon.x + dragon.width / 2 - ox;
    const dcy = dragon.y + dragon.height / 2 - oy;
    const tx = dragon.fireTargetX - ox, ty = dragon.fireTargetY - oy;

    if (dragon.windingUp) {
        // Aiming line (dashed, flickering)
        const progress = (gameTime - dragon.windupStart) / dragon.windupDuration;
        const pulse = 0.3 + 0.4 * Math.sin(performance.now() / 80);
        ctx.strokeStyle = `rgba(255,${Math.floor(150 * progress)},0,${pulse})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.setLineDash([]);
        // Target indicator
        ctx.strokeStyle = `rgba(255,100,0,${pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
    }

    if (dragon.firing) {
        // Fire stream
        const dx = tx - dcx, dy = ty - (dcy - 12);
        const dist = Math.hypot(dx, dy);
        const nx = dx / dist, ny = dy / dist;
        // Multiple fire particles along the line
        const fireAge = (gameTime - dragon.fireStart) / dragon.fireDuration;
        ctx.lineWidth = 8 + Math.sin(performance.now() / 50) * 3;
        const grad = ctx.createLinearGradient(dcx, dcy - 12, tx, ty);
        grad.addColorStop(0, 'rgba(255,200,0,0.9)');
        grad.addColorStop(0.3, 'rgba(255,100,0,0.8)');
        grad.addColorStop(0.7, 'rgba(255,50,0,0.6)');
        grad.addColorStop(1, 'rgba(200,0,0,0.3)');
        ctx.strokeStyle = grad;
        ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
        // Inner bright core
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,150,0.7)';
        ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
        // Fire particles along line
        for (let i = 0; i < 6; i++) {
            const t = i / 6;
            const px = dcx + dx * t + (Math.random() - 0.5) * 12;
            const py = (dcy - 12) + dy * t + (Math.random() - 0.5) * 12;
            ctx.fillStyle = `rgba(255,${Math.floor(100 + Math.random() * 155)},0,${0.5 + Math.random() * 0.3})`;
            ctx.beginPath(); ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
        }
    }
}
