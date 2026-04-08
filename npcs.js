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

function drawCampScout(ox, oy) {
    const sx = Math.round(campScout.x - ox), sy = Math.round(campScout.y - oy);
    const cx = sx + campScout.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + campScout.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Leather body
    ctx.fillStyle = '#5a4020'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    ctx.fillStyle = '#6a5030'; ctx.fillRect(sx + 4, sy + 9, 8, 8);
    // Belt
    ctx.fillStyle = '#3a2a10'; ctx.fillRect(sx + 2, sy + 14, 12, 2);
    // Head
    ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(cx, sy + 6, 5, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);
    // Hood
    ctx.fillStyle = '#3a5a2a'; ctx.fillRect(sx + 2, sy - 2, 12, 6);
    ctx.fillRect(sx + 4, sy - 4, 8, 3);
    // Cloak sides
    ctx.fillStyle = '#3a5a2a'; ctx.fillRect(sx, sy + 8, 3, 10); ctx.fillRect(sx + 13, sy + 8, 3, 10);
    // Quiver on back
    ctx.fillStyle = '#4a3010'; ctx.fillRect(sx + 14, sy + 2, 3, 12);
    ctx.fillStyle = '#aaa'; ctx.fillRect(sx + 14, sy, 1, 4); ctx.fillRect(sx + 16, sy + 1, 1, 3);
    // Feet
    ctx.fillStyle = '#3a2a10'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
}

function drawCampBlacksmith(ox, oy) {
    const sx = Math.round(campBlacksmith.x - ox), sy = Math.round(campBlacksmith.y - oy);
    const cx = sx + campBlacksmith.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + campBlacksmith.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Thick body (muscular)
    ctx.fillStyle = '#444'; ctx.fillRect(sx + 1, sy + 7, 14, 11);
    ctx.fillStyle = '#555'; ctx.fillRect(sx + 3, sy + 8, 10, 9);
    // Apron
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(sx + 4, sy + 10, 8, 8);
    // Head (bald)
    ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
    // Thick eyebrows
    ctx.fillStyle = '#222'; ctx.fillRect(cx - 4, sy + 2, 3, 1); ctx.fillRect(cx + 1, sy + 2, 3, 1);
    // Beard
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(cx - 3, sy + 7, 6, 3);
    // Arms (thick)
    ctx.fillStyle = '#c8a070'; ctx.fillRect(sx - 1, sy + 8, 4, 7); ctx.fillRect(sx + 13, sy + 8, 4, 7);
    // Hammer in hand
    ctx.fillStyle = '#8a7a6a'; ctx.fillRect(sx + 15, sy + 4, 2, 10);
    ctx.fillStyle = '#888'; ctx.fillRect(sx + 13, sy + 2, 6, 4);
    // Feet
    ctx.fillStyle = '#333'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
}

function drawCampHealer(ox, oy) {
    const sx = Math.round(campHealer.x - ox), sy = Math.round(campHealer.y - oy);
    const cx = sx + campHealer.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + campHealer.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Robe body
    ctx.fillStyle = '#eee'; ctx.fillRect(sx + 2, sy + 7, 12, 11);
    ctx.fillStyle = '#ddd'; ctx.fillRect(sx + 4, sy + 8, 8, 9);
    // Red cross on robe
    ctx.fillStyle = '#cc3333'; ctx.fillRect(cx - 1, sy + 10, 3, 6);
    ctx.fillRect(cx - 3, sy + 12, 7, 2);
    // Head
    ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    // Eyes (gentle)
    ctx.fillStyle = '#336'; ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
    // Hair
    ctx.fillStyle = '#aaa'; ctx.fillRect(sx + 3, sy - 1, 10, 4);
    ctx.fillRect(sx + 2, sy + 1, 2, 4); ctx.fillRect(sx + 12, sy + 1, 2, 4);
    // Arms (in robe sleeves)
    ctx.fillStyle = '#eee'; ctx.fillRect(sx, sy + 8, 3, 7); ctx.fillRect(sx + 13, sy + 8, 3, 7);
    // Herb pouch
    ctx.fillStyle = '#5a8a3a'; ctx.fillRect(sx - 1, sy + 14, 4, 3);
    // Feet
    ctx.fillStyle = '#8a7a6a'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
}

function drawJackFrost(ox, oy) {
    if (!isSnowing()) return;
    const sx = Math.round(jackFrost.x - ox), sy = Math.round(jackFrost.y - oy);
    const cx = sx + jackFrost.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + jackFrost.height + 1, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Frost aura
    const aura = 0.08 + 0.06 * Math.sin(performance.now() / 600);
    ctx.fillStyle = `rgba(150,210,255,${aura})`;
    ctx.beginPath(); ctx.arc(cx, sy + 10, 18, 0, Math.PI * 2); ctx.fill();
    // Body — icy white robe
    ctx.fillStyle = '#d0e8f8'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    ctx.fillStyle = '#e8f4ff'; ctx.fillRect(sx + 4, sy + 9, 8, 8);
    // Frost trim at bottom
    ctx.fillStyle = '#88ccff';
    for (let i = 0; i < 4; i++) ctx.fillRect(sx + 2 + i * 3, sy + 17, 2, 2);
    // Head — pale blue skin
    ctx.fillStyle = '#c0d8ee';
    ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
    // Spiky ice hair
    ctx.fillStyle = '#88ccff';
    ctx.beginPath(); ctx.moveTo(cx - 4, sy + 1); ctx.lineTo(cx - 6, sy - 5); ctx.lineTo(cx - 2, sy); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, sy); ctx.lineTo(cx, sy - 7); ctx.lineTo(cx + 2, sy); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 2, sy + 1); ctx.lineTo(cx + 6, sy - 4); ctx.lineTo(cx + 4, sy); ctx.fill();
    // Eyes — bright cyan
    ctx.fillStyle = '#00ddff';
    ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
    // Smile
    ctx.strokeStyle = '#8ab8d8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, sy + 7, 2, 0, Math.PI); ctx.stroke();
    // Arms
    ctx.fillStyle = '#c0d8ee'; ctx.fillRect(sx, sy + 9, 3, 5); ctx.fillRect(sx + 13, sy + 9, 3, 5);
    // Ice staff (left hand)
    ctx.fillStyle = '#aaddff'; ctx.fillRect(sx - 2, sy - 2, 2, 18);
    // Snowflake crystal on staff tip
    const sparkle = 0.6 + 0.4 * Math.sin(performance.now() / 300);
    ctx.fillStyle = `rgba(200,240,255,${sparkle})`;
    ctx.beginPath(); ctx.arc(sx - 1, sy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('*', sx - 1, sy - 4);
    // Boots
    ctx.fillStyle = '#7aaace'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);
    // Floating snowflakes around
    const t = performance.now() / 1500;
    for (let i = 0; i < 3; i++) {
        const angle = t + i * (Math.PI * 2 / 3);
        const fx = cx + Math.cos(angle) * 14;
        const fy = sy + 8 + Math.sin(angle) * 8;
        ctx.fillStyle = `rgba(200,230,255,${0.4 + 0.3 * Math.sin(t * 3 + i)})`;
        ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
}

function drawIceTraveler(ox, oy) {
    if (!isIceTravelerPresent()) return;
    const sx = Math.round(iceTraveler.x - ox), sy = Math.round(iceTraveler.y - oy);
    const cx = sx + iceTraveler.width / 2;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + iceTraveler.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Icy glow
    const pulse = 0.1 + 0.05 * Math.sin(performance.now() / 500);
    ctx.fillStyle = `rgba(150,200,255,${pulse})`;
    ctx.beginPath(); ctx.arc(cx, sy + 10, 14, 0, Math.PI * 2); ctx.fill();
    // Heavy cloak (icy blue)
    ctx.fillStyle = '#4a6a8a'; ctx.fillRect(sx + 1, sy + 6, 14, 13);
    ctx.fillStyle = '#5a7a9a'; ctx.fillRect(sx + 3, sy + 7, 10, 11);
    // Fur trim on cloak
    ctx.fillStyle = '#c8d8e8'; ctx.fillRect(sx + 1, sy + 6, 14, 2);
    ctx.fillRect(sx + 1, sy + 6, 2, 13); ctx.fillRect(sx + 13, sy + 6, 2, 13);
    // Hood
    ctx.fillStyle = '#3a5a7a'; ctx.fillRect(sx + 2, sy - 2, 12, 8);
    ctx.fillStyle = '#4a6a8a'; ctx.fillRect(sx + 4, sy - 1, 8, 6);
    // Face in hood
    ctx.fillStyle = '#d4a574'; ctx.fillRect(sx + 5, sy + 2, 6, 4);
    // Eyes (bright blue)
    ctx.fillStyle = '#66ccff'; ctx.fillRect(cx - 2, sy + 3, 2, 1); ctx.fillRect(cx + 1, sy + 3, 2, 1);
    // Ice staff (held to the side)
    ctx.fillStyle = '#88aacc'; ctx.fillRect(sx + 15, sy - 3, 2, 20);
    // Crystal on staff
    ctx.fillStyle = '#aaddff';
    ctx.beginPath(); ctx.moveTo(sx + 16, sy - 6); ctx.lineTo(sx + 14, sy - 3); ctx.lineTo(sx + 18, sy - 3); ctx.fill();
    // Snowflake sparkle on crystal
    const sp = 0.5 + 0.5 * Math.sin(performance.now() / 300);
    ctx.fillStyle = `rgba(200,230,255,${sp})`;
    ctx.beginPath(); ctx.arc(sx + 16, sy - 5, 2, 0, Math.PI * 2); ctx.fill();
    // Boots
    ctx.fillStyle = '#5a4a3a'; ctx.fillRect(sx + 3, sy + 18, 4, 3); ctx.fillRect(sx + 9, sy + 18, 4, 3);
}

function drawOrc(orc, ox, oy) {
    if (!orc.alive) return;
    const sx = Math.round(orc.x - ox), sy = Math.round(orc.y - oy);
    const cx = sx + orc.width / 2, cy = sy + orc.height / 2;
    const snow = isSnowing();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + orc.height + 1, 7, 2, 0, 0, Math.PI * 2); ctx.fill();
    if (snow) {
        // Caveman look — fur clothing, messy hair, bone club
        // Body (fur tunic)
        ctx.fillStyle = '#8a6a3a'; ctx.fillRect(sx + 3, sy + 7, 14, 9);
        ctx.fillStyle = '#a08050'; ctx.fillRect(sx + 5, sy + 8, 10, 7);
        // Fur trim (jagged bottom)
        ctx.fillStyle = '#6a4a2a';
        for (let i = 0; i < 4; i++) ctx.fillRect(sx + 4 + i * 3, sy + 15, 2, 2);
        // Head (tan skin)
        ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(cx, sy + 5, 5, 0, Math.PI * 2); ctx.fill();
        // Messy hair
        ctx.fillStyle = '#4a3020';
        ctx.fillRect(cx - 5, sy, 10, 3);
        ctx.fillRect(cx - 6, sy + 1, 3, 3); ctx.fillRect(cx + 4, sy + 1, 3, 3);
        // Eyes (dark)
        ctx.fillStyle = '#222'; ctx.fillRect(cx - 3, sy + 4, 2, 2); ctx.fillRect(cx + 1, sy + 4, 2, 2);
        // Beard
        ctx.fillStyle = '#5a4030'; ctx.fillRect(cx - 3, sy + 8, 6, 3);
        // Arm with bone club
        ctx.fillStyle = '#c8a070'; ctx.fillRect(sx + 1, sy + 8, 3, 5);
        ctx.fillStyle = '#e8dcc0'; ctx.fillRect(sx - 1, sy + 4, 2, 9); // bone shaft
        ctx.fillStyle = '#d0c4a8'; ctx.fillRect(sx - 3, sy + 2, 5, 4); // bone knob
        // Other arm
        ctx.fillStyle = '#c8a070'; ctx.fillRect(sx + 16, sy + 8, 3, 5);
        // Bare feet
        ctx.fillStyle = '#b08860'; ctx.fillRect(sx + 4, sy + 15, 4, 3); ctx.fillRect(sx + 12, sy + 15, 4, 3);
    } else {
        // Normal orc
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
    }
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
    const snow = isSnowing();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, sy + dragon.height + 4, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Colors based on mode
    const wingDark = snow ? '#1a4a6a' : '#6a1a1a';
    const wingLight = snow ? '#2a6a8a' : '#8a2a2a';
    const bodyMain = snow ? '#2a5a7a' : '#8B0000';
    const bodyLight = snow ? '#3a7a9a' : '#aa2020';
    const belly = snow ? '#6abadd' : '#cc6600';
    const legColor = snow ? '#1a4a6a' : '#7a1010';
    const tailTip = snow ? '#1a4a6a' : '#6a1a1a';

    // Wings
    const wingFlap = Math.sin(performance.now() / 400) * 8;
    ctx.fillStyle = wingDark;
    ctx.beginPath(); ctx.moveTo(cx - 8, cy - 4);
    ctx.lineTo(cx - 32, cy - 20 + wingFlap); ctx.lineTo(cx - 24, cy + 4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = wingLight;
    ctx.beginPath(); ctx.moveTo(cx - 8, cy - 2);
    ctx.lineTo(cx - 28, cy - 16 + wingFlap); ctx.lineTo(cx - 20, cy + 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = wingDark;
    ctx.beginPath(); ctx.moveTo(cx + 8, cy - 4);
    ctx.lineTo(cx + 32, cy - 20 + wingFlap); ctx.lineTo(cx + 24, cy + 4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = wingLight;
    ctx.beginPath(); ctx.moveTo(cx + 8, cy - 2);
    ctx.lineTo(cx + 28, cy - 16 + wingFlap); ctx.lineTo(cx + 20, cy + 2);
    ctx.closePath(); ctx.fill();

    // Body
    ctx.fillStyle = bodyMain;
    ctx.beginPath(); ctx.ellipse(cx, cy + 2, 14, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = bodyLight;
    ctx.beginPath(); ctx.ellipse(cx, cy + 2, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Belly scales
    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.ellipse(cx, cy + 6, 6, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Ice dragon frost shimmer
    if (snow) {
        const shimmer = 0.1 + 0.08 * Math.sin(performance.now() / 500);
        ctx.fillStyle = `rgba(180,220,255,${shimmer})`;
        ctx.beginPath(); ctx.ellipse(cx, cy + 2, 16, 14, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Neck
    ctx.fillStyle = bodyMain; ctx.fillRect(cx - 4, cy - 14, 8, 12);
    // Head
    ctx.fillStyle = bodyMain;
    ctx.beginPath(); ctx.ellipse(cx, cy - 16, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = bodyLight;
    ctx.beginPath(); ctx.ellipse(cx, cy - 16, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Horns (icy blue when snow)
    ctx.fillStyle = snow ? '#88ccee' : '#444';
    ctx.beginPath(); ctx.moveTo(cx - 6, cy - 22); ctx.lineTo(cx - 10, cy - 30); ctx.lineTo(cx - 4, cy - 20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 6, cy - 22); ctx.lineTo(cx + 10, cy - 30); ctx.lineTo(cx + 4, cy - 20); ctx.fill();
    // Eyes
    ctx.fillStyle = snow ? '#66ccff' : '#FFD700';
    ctx.beginPath(); ctx.arc(cx - 4, cy - 18, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy - 18, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - 4.5, cy - 19, 1.5, 3); ctx.fillRect(cx + 3.5, cy - 19, 1.5, 3);
    // Nostrils (glow when winding up)
    if (dragon.windingUp) {
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 100);
        if (snow) {
            ctx.fillStyle = `rgba(100,180,255,${pulse})`;
        } else {
            ctx.fillStyle = `rgba(255,${Math.floor(100 + pulse * 100)},0,${pulse})`;
        }
        ctx.beginPath(); ctx.arc(cx - 3, cy - 12, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 3, cy - 12, 3, 0, Math.PI * 2); ctx.fill();
    } else {
        ctx.fillStyle = snow ? '#1a3a5a' : '#550000';
        ctx.beginPath(); ctx.arc(cx - 3, cy - 12, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 3, cy - 12, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // Tail
    ctx.strokeStyle = bodyMain; ctx.lineWidth = 4;
    const tailWag = Math.sin(performance.now() / 300) * 6;
    ctx.beginPath(); ctx.moveTo(cx, cy + 12);
    ctx.quadraticCurveTo(cx + 10 + tailWag, cy + 20, cx + 6 + tailWag, cy + 28);
    ctx.stroke();
    ctx.fillStyle = tailTip;
    ctx.beginPath(); ctx.moveTo(cx + 6 + tailWag, cy + 28);
    ctx.lineTo(cx + 2 + tailWag, cy + 32); ctx.lineTo(cx + 10 + tailWag, cy + 32);
    ctx.closePath(); ctx.fill();

    // Legs
    ctx.fillStyle = legColor;
    ctx.fillRect(sx + 4, sy + dragon.height - 4, 6, 8);
    ctx.fillRect(sx + dragon.width - 10, sy + dragon.height - 4, 6, 8);
    // Claws
    ctx.fillStyle = snow ? '#88ccee' : '#444';
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
    ctx.fillStyle = snow ? '#4488cc' : '#e53935';
    ctx.fillRect(hpBarX + 1, hpBarY + 1, (hpBarW - 2) * (dragon.hp / dragon.maxHp), hpBarH - 2);
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
    const snow = isSnowing();

    if (dragon.windingUp) {
        const progress = (gameTime - dragon.windupStart) / dragon.windupDuration;
        const pulse = 0.3 + 0.4 * Math.sin(performance.now() / 80);
        if (snow) {
            // Ice aiming line — blue dashed with snowflake trail
            ctx.strokeStyle = `rgba(100,${Math.floor(150 + 105 * progress)},255,${pulse})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
            ctx.setLineDash([]);
            // Snow windup particles along line
            const dx = tx - dcx, dy = ty - (dcy - 12);
            for (let i = 0; i < 4; i++) {
                const t = (performance.now() / 800 + i / 4) % 1;
                const px = dcx + dx * t * progress;
                const py = (dcy - 12) + dy * t * progress + (Math.random() - 0.5) * 8;
                ctx.fillStyle = `rgba(200,230,255,${0.3 + Math.random() * 0.4})`;
                ctx.beginPath(); ctx.arc(px, py, 1.5 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
            }
            // Target indicator (icy)
            ctx.strokeStyle = `rgba(100,180,255,${pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
        } else {
            ctx.strokeStyle = `rgba(255,${Math.floor(150 * progress)},0,${pulse})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = `rgba(255,100,0,${pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
        }
    }

    if (dragon.firing) {
        const dx = tx - dcx, dy = ty - (dcy - 12);
        const dist = Math.hypot(dx, dy);
        const fireAge = (gameTime - dragon.fireStart) / dragon.fireDuration;

        if (snow) {
            // Ice ball stream — blue/white gradient with snow trail
            ctx.lineWidth = 8 + Math.sin(performance.now() / 50) * 3;
            const grad = ctx.createLinearGradient(dcx, dcy - 12, tx, ty);
            grad.addColorStop(0, 'rgba(150,200,255,0.9)');
            grad.addColorStop(0.3, 'rgba(100,170,255,0.8)');
            grad.addColorStop(0.7, 'rgba(60,140,220,0.6)');
            grad.addColorStop(1, 'rgba(30,80,180,0.3)');
            ctx.strokeStyle = grad;
            ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
            // Inner bright icy core
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(220,240,255,0.8)';
            ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
            // Snow/ice particles along line
            for (let i = 0; i < 8; i++) {
                const t = i / 8;
                const px = dcx + dx * t + (Math.random() - 0.5) * 14;
                const py = (dcy - 12) + dy * t + (Math.random() - 0.5) * 14;
                ctx.fillStyle = `rgba(${180 + Math.floor(Math.random() * 75)},${220 + Math.floor(Math.random() * 35)},255,${0.4 + Math.random() * 0.4})`;
                ctx.beginPath(); ctx.arc(px, py, 1.5 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
            }
        } else {
            ctx.lineWidth = 8 + Math.sin(performance.now() / 50) * 3;
            const grad = ctx.createLinearGradient(dcx, dcy - 12, tx, ty);
            grad.addColorStop(0, 'rgba(255,200,0,0.9)');
            grad.addColorStop(0.3, 'rgba(255,100,0,0.8)');
            grad.addColorStop(0.7, 'rgba(255,50,0,0.6)');
            grad.addColorStop(1, 'rgba(200,0,0,0.3)');
            ctx.strokeStyle = grad;
            ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(255,255,150,0.7)';
            ctx.beginPath(); ctx.moveTo(dcx, dcy - 12); ctx.lineTo(tx, ty); ctx.stroke();
            for (let i = 0; i < 6; i++) {
                const t = i / 6;
                const px = dcx + dx * t + (Math.random() - 0.5) * 12;
                const py = (dcy - 12) + dy * t + (Math.random() - 0.5) * 12;
                ctx.fillStyle = `rgba(255,${Math.floor(100 + Math.random() * 155)},0,${0.5 + Math.random() * 0.3})`;
                ctx.beginPath(); ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
            }
        }
    }
}

// ── Lava Monster Drawing ────────────────────────────────────

function drawLavaMonster(ox, oy) {
    if (!lavaMonster.alive || !inLavaZone) return;
    const sx = Math.round(lavaMonster.x - ox), sy = Math.round(lavaMonster.y - oy);
    const cx = sx + lavaMonster.width / 2, cy = sy + lavaMonster.height / 2;
    const now = performance.now();

    // Fire trail
    for (const t of lavaMonster.trail) {
        const age = (gameTime - t.time) / LAVA_TRAIL_DURATION;
        const tx = Math.round(t.x - ox), ty = Math.round(t.y - oy);
        const alpha = 0.6 * (1 - age);
        const pulse = 0.8 + 0.2 * Math.sin(now / 200 + t.x);
        ctx.fillStyle = `rgba(255,${Math.floor(80 + 80 * age)},0,${alpha * pulse})`;
        ctx.beginPath(); ctx.arc(tx, ty, 6 * (1 - age * 0.3), 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,200,50,${alpha * 0.4})`;
        ctx.beginPath(); ctx.arc(tx, ty, 3 * (1 - age * 0.3), 0, Math.PI * 2); ctx.fill();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(cx, sy + lavaMonster.height + 2, 12, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Body glow
    const glow = 0.3 + 0.15 * Math.sin(now / 300);
    ctx.fillStyle = `rgba(255,60,0,${glow})`;
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill();

    // Body (magma rock)
    ctx.fillStyle = '#4a1a0a';
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    // Lava cracks
    ctx.strokeStyle = `rgba(255,100,20,${0.6 + 0.3 * Math.sin(now / 250)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - 5, cy - 3); ctx.lineTo(cx + 2, cy + 1); ctx.lineTo(cx + 6, cy - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 3, cy + 2); ctx.lineTo(cx + 1, cy + 6); ctx.stroke();
    // Inner glow
    ctx.fillStyle = `rgba(255,150,30,${0.3 + 0.2 * Math.sin(now / 200)})`;
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

    // Eyes (glowing orange)
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(cx - 5, cy - 4, 3, 3);
    ctx.fillRect(cx + 2, cy - 4, 3, 3);
    // Eye cores
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(cx - 4, cy - 3, 1, 1);
    ctx.fillRect(cx + 3, cy - 3, 1, 1);

    // Arms (rocky with lava glow)
    ctx.fillStyle = '#3a1005';
    ctx.fillRect(sx - 2, cy - 2, 4, 8);
    ctx.fillRect(sx + lavaMonster.width - 2, cy - 2, 4, 8);
    ctx.fillStyle = `rgba(255,80,0,${0.4 + 0.2 * Math.sin(now / 180)})`;
    ctx.fillRect(sx - 1, cy, 2, 4);
    ctx.fillRect(sx + lavaMonster.width - 1, cy, 2, 4);

    // Legs
    ctx.fillStyle = '#3a1005';
    ctx.fillRect(cx - 5, sy + lavaMonster.height - 4, 4, 5);
    ctx.fillRect(cx + 1, sy + lavaMonster.height - 4, 4, 5);

    // Spinning attack visual
    if (lavaMonster.spinning) {
        const elapsed = gameTime - lavaMonster.spinStart;
        const angle = (elapsed / LAVA_MONSTER_SPIN_DURATION) * Math.PI * 4;
        ctx.save();
        // Spinning fire ring
        ctx.strokeStyle = `rgba(255,80,0,0.6)`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, LAVA_MONSTER_SPIN_RANGE * 0.6, 0, Math.PI * 2); ctx.stroke();
        // 3 orbiting fireballs
        for (let i = 0; i < 3; i++) {
            const a = angle + (i * Math.PI * 2 / 3);
            const orbX = cx + Math.cos(a) * LAVA_MONSTER_SPIN_RANGE * 0.5;
            const orbY = cy + Math.sin(a) * LAVA_MONSTER_SPIN_RANGE * 0.5;
            ctx.fillStyle = `rgba(255,${60 + i * 40},0,0.8)`;
            ctx.beginPath(); ctx.arc(orbX, orbY, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,220,100,0.6)';
            ctx.beginPath(); ctx.arc(orbX, orbY, 3, 0, Math.PI * 2); ctx.fill();
        }
        // Mace in hand during spin
        const maceA = angle;
        const maceX = cx + Math.cos(maceA) * 14;
        const maceY = cy + Math.sin(maceA) * 14;
        ctx.fillStyle = '#555';
        ctx.fillRect(maceX - 1, maceY - 1, 3, 8);
        ctx.fillStyle = '#8a4400';
        ctx.beginPath(); ctx.arc(maceX + 1, maceY - 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,100,0,${0.6 + 0.3 * Math.sin(now / 100)})`;
        ctx.beginPath(); ctx.arc(maceX + 1, maceY - 2, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

}
