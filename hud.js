// ── HUD ─────────────────────────────────────────────────────

function drawPrompt(text) {
    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    const touchOff = (typeof isTouchDevice !== 'undefined' && isTouchDevice) ? 160 : 0;
    const px = canvas.width/2, py = canvas.height - 40 - touchOff;
    const w = ctx.measureText(text).width + 24;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(px-w/2, py-18, w, 24);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(px-w/2, py-18, w, 24);
    ctx.fillStyle = '#fff'; ctx.fillText(text, px, py+2);
}

function drawActionMessage() {
    if (!activeAction) return;
    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    const touchOff = (typeof isTouchDevice !== 'undefined' && isTouchDevice) ? 160 : 0;
    const px = canvas.width/2, py = canvas.height - 40 - touchOff;
    const text = activeAction.message;
    const w = ctx.measureText(text).width + 24;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(px-w/2, py-18, w, 24);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(px-w/2, py-18, w, 24);
    ctx.fillStyle = '#FFD700'; ctx.fillText(text, px, py+2);
}

function drawBar(label, value, max, bx, by, color, critThreshold) {
    const barW = 160, barH = 18;
    ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#fff'; ctx.fillText(label, bx, by - 4);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(bx, by, barW, barH);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, barW, barH);
    const ratio = value / max;
    if (critThreshold !== undefined && value < critThreshold) {
        const pulse = 0.7 + 0.3 * Math.sin(performance.now() / 200);
        ctx.fillStyle = `rgba(244,67,54,${pulse})`;
    } else {
        ctx.fillStyle = color;
    }
    ctx.fillRect(bx+2, by+2, (barW-4)*ratio, barH-4);
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    // Compact format for huge numbers
    function fmtNum(n) {
        if (n >= 1e9) return (n / 1e9).toFixed(0) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(0) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
        return n.toFixed(1);
    }
    ctx.fillText(`${fmtNum(value)} / ${fmtNum(max)}`, bx+barW/2, by+barH/2);
}

function drawHUD() {
    // Offset bottom HUD elements above touch controls on touch devices
    const touchOffsetL = (typeof isTouchDevice !== 'undefined' && isTouchDevice) ? 140 : 0;
    const touchOffsetR = (typeof isTouchDevice !== 'undefined' && isTouchDevice) ? 190 : 0;

    // Health bar
    const hpColor = health.value > 5 ? '#e53935' : '#b71c1c';
    drawBar('Health', health.value, health.max, 16, canvas.height - 80 - touchOffsetL, hpColor, 3);
    // Hunger bar
    const hungerColor = hunger.value > 5 ? '#4CAF50' : (hunger.value > 2.5 ? '#FF9800' : '#F44336');
    drawBar('Hunger', hunger.value, hunger.max, 16, canvas.height - 40 - touchOffsetL, hungerColor, 5);

    // Bathroom need indicator
    if (bathroom.needsToGo) {
        const elapsed = gameTime - bathroom.needStartTime;
        const urgency = Math.min(elapsed / bathroom.accidentTime, 1);
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / (300 - urgency * 200));
        ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = `rgba(200,150,50,${pulse})`;
        ctx.fillText('! Needs bathroom !', 16, canvas.height - 90 - touchOffsetL);
    }

    // Poop stain indicator
    if (bathroom.pooped) {
        ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#8B4513';
        ctx.fillText('(soiled)', 16, canvas.height - 90 - touchOffsetL);
    }

    // Orc siege indicator
    if (typeof orcSiege !== 'undefined' && orcSiege.active) {
        const alive = orcs.filter(o => o.alive).length;
        ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(canvas.width / 2 - 80, 50, 160, 28);
        ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 1; ctx.strokeRect(canvas.width / 2 - 80, 50, 160, 28);
        ctx.fillStyle = '#FF6666';
        ctx.fillText(`Orcs remaining: ${alive}`, canvas.width / 2, 54);
    }

    // Shield indicator
    if (typeof shieldUnlocked !== 'undefined' && shieldUnlocked) {
        const shieldCdLeft = Math.max(0, SHIELD_COOLDOWN - (gameTime - lastShieldTime));
        ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        if (shieldActive) {
            const remaining = Math.max(0, SHIELD_DURATION - (gameTime - shieldStartTime));
            ctx.fillStyle = '#4488FF';
            ctx.fillText(`[${kl('B')}] Shield Active ${(remaining / 1000).toFixed(1)}s`, 16, canvas.height - 110 - touchOffsetL);
        } else if (shieldCdLeft <= 0) {
            ctx.fillStyle = '#4488FF';
            ctx.fillText(`[${kl('B')}] Shield Ready`, 16, canvas.height - 110 - touchOffsetL);
        } else {
            const secs = Math.ceil(shieldCdLeft / 1000);
            ctx.fillStyle = '#666';
            ctx.fillText(`[${kl('B')}] Shield ${secs}s`, 16, canvas.height - 110 - touchOffsetL);
        }
    }

    // Heal power indicator
    if (healPowerUnlocked) {
        const cooldownLeft = Math.max(0, HEAL_COOLDOWN - (gameTime - lastHealTime));
        ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        if (cooldownLeft <= 0) {
            ctx.fillStyle = '#8A2BE2';
            ctx.fillText(`[${kl('F')}] Heal Ready`, 16, canvas.height - 100 - touchOffsetL);
        } else {
            const secs = Math.ceil(cooldownLeft / 1000);
            const mins = Math.floor(secs / 60), s = secs % 60;
            ctx.fillStyle = '#666';
            ctx.fillText(`[${kl('F')}] Heal ${mins}:${s.toString().padStart(2, '0')}`, 16, canvas.height - 100 - touchOffsetL);
        }
    }

    // Dragon respawn timer
    if (typeof dragonRespawnTime !== 'undefined' && dragonRespawnTime > 0 && !dragon.alive) {
        const remaining = Math.max(0, Math.ceil((dragonRespawnTime - gameTime) / 1000));
        const mins = Math.floor(remaining / 60), secs = remaining % 60;
        ctx.font = 'bold 12px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#FF6666';
        ctx.fillText(`Dragon returns: ${mins}:${secs.toString().padStart(2, '0')}`, canvas.width - 16, canvas.height - 60 - touchOffsetR);
    }

    // Dragon boss health bar
    if (typeof dragon !== 'undefined' && dragon.alive) {
        const py = player.y / T;
        if (py >= 165 && py <= 195) {
            const barW = 400, barH = 24;
            const bx = canvas.width / 2 - barW / 2, by = 16;
            // Label
            ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#FF4444';
            ctx.fillText('DRAGON', canvas.width / 2, by - 4);
            // Background
            ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(bx, by, barW, barH);
            ctx.strokeStyle = '#8B0000'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, barW, barH);
            // Fill
            const ratio = dragon.hp / dragon.maxHp;
            const pulse = dragon.hp <= dragon.maxHp * 0.25 ? 0.7 + 0.3 * Math.sin(performance.now() / 200) : 1;
            ctx.fillStyle = ratio > 0.5 ? `rgba(200,30,30,${pulse})` : ratio > 0.25 ? `rgba(220,120,0,${pulse})` : `rgba(200,0,0,${pulse})`;
            ctx.fillRect(bx + 2, by + 2, (barW - 4) * ratio, barH - 4);
            // HP text
            ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(`${dragon.hp} / ${dragon.maxHp}`, canvas.width / 2, by + barH / 2);
        }
    }

    // Dragon fire windup warning
    if (typeof dragon !== 'undefined' && dragon.alive && dragon.windingUp) {
        const progress = Math.min((gameTime - dragon.windupStart) / dragon.windupDuration, 1);
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / (200 - progress * 150));
        ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = `rgba(255,${Math.floor(100 + (1 - progress) * 100)},0,${pulse})`;
        ctx.fillText('! DRAGON FIRE INCOMING !', canvas.width / 2, 80);
    }

    // Gold counter (bottom right)
    ctx.font = 'bold 12px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Gold: ${goldCount}`, canvas.width - 16, canvas.height - 46 - touchOffsetR);

    // Sword indicator (bottom right)
    if (swordPickedUp) {
        ctx.fillStyle = currentSword === 'admin' ? '#FF4444' : currentSword === 'dragon' ? '#FF6633' : currentSword === 'kings' ? '#FFD700' : '#C0C0C0';
        const swordName = currentSword === 'admin' ? 'Admin Sword' : currentSword === 'dragon' ? 'Dragon Sword' : currentSword === 'kings' ? "King's Sword" : 'Legendary Sword';
        ctx.fillText(`${swordName} (${swordDamage} dmg)`, canvas.width - 16, canvas.height - 30 - touchOffsetR);
    }

    // Death counter (bottom right)
    ctx.font = 'bold 12px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#888';
    ctx.fillText(`Deaths: ${deathCount}`, canvas.width - 16, canvas.height - 16 - touchOffsetR);
}

// ── Death Screen ────────────────────────────────────────────

let deathSelection = 0;

function drawDeathScreen() {
    ctx.fillStyle = 'rgba(80,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const bw = 300, bh = 220;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,5,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#8B0000'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 28px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FF4444'; ctx.fillText('YOU DIED', bx + bw / 2, by + 24);

    ctx.font = '14px monospace'; ctx.fillStyle = '#aaa';
    ctx.fillText(`Deaths: ${deathCount}`, bx + bw / 2, by + 64);

    const items = ['Revive', 'Quit to Menu'];
    ctx.font = 'bold 16px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 110 + i * 44;
        if (i === deathSelection) {
            ctx.fillStyle = 'rgba(139,0,0,0.3)'; ctx.fillRect(bx + 20, iy - 6, bw - 40, 32);
            ctx.fillStyle = '#FF6666'; ctx.fillText('> ' + items[i] + ' <', bx + bw / 2, iy);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(items[i], bx + bw / 2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw / 2, by + bh - 24);
}

// ── Shop Button & Menu ─────────────────────────────────────

const shopBtn = { x: 12, y: 12, w: 80, h: 32 };
let shopOpen = false;
let shopSelection = 0;
const shopCloseBtn = { x: 0, y: 0, w: 36, h: 36 };

function drawShopButton() {
    if (dragonKills <= 0) return; // only show after first dragon kill
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(shopBtn.x, shopBtn.y, shopBtn.w, shopBtn.h);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(shopBtn.x, shopBtn.y, shopBtn.w, shopBtn.h);
    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700'; ctx.fillText('Shop', shopBtn.x + shopBtn.w/2, shopBtn.y + shopBtn.h/2);
}

function getShopItems() {
    const items = [];
    if (!weaponryBuilt) items.push({ name: 'Weaponry', cost: 20, action: () => buildWeaponryRoom() });
    if (!guestRoomBuilt) items.push({ name: 'Guest Room', cost: 30, action: () => buildGuestRoom() });
    if (!dragonSwordUnlocked) items.push({ name: 'Dragon Sword (5 dmg)', cost: 1000, action: () => { goldCount -= 1000; dragonSwordUnlocked = true; currentSword = 'dragon'; swordDamage = 5; addNotification('Dragon Sword acquired! 5 damage per hit!', 5000, 'rgba(255,100,50,1)', 'rgba(60,10,0,0.9)'); } });
    return items;
}

function drawShopMenu() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const bw = 320, bh = 280;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700'; ctx.fillText('SHOP', bx + bw/2, by + 16);

    // Touch-only close button
    if (isTouchDevice) {
        shopCloseBtn.x = bx + bw - 40; shopCloseBtn.y = by + 4;
        ctx.fillStyle = 'rgba(180,40,40,0.8)'; ctx.fillRect(shopCloseBtn.x, shopCloseBtn.y, shopCloseBtn.w, shopCloseBtn.h);
        ctx.strokeStyle = '#FF6666'; ctx.lineWidth = 1; ctx.strokeRect(shopCloseBtn.x, shopCloseBtn.y, shopCloseBtn.w, shopCloseBtn.h);
        ctx.font = 'bold 20px monospace'; ctx.fillStyle = '#fff';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', shopCloseBtn.x + shopCloseBtn.w/2, shopCloseBtn.y + shopCloseBtn.h/2);
        ctx.textBaseline = 'top';
    }

    // Gold display
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#FFD700'; ctx.fillText(`Gold: ${goldCount}`, bx + bw/2, by + 48);

    const items = getShopItems();
    if (items.length === 0) {
        ctx.font = '14px monospace'; ctx.fillStyle = '#aaa';
        ctx.fillText('All items purchased!', bx + bw/2, by + 100);
    } else {
        ctx.font = 'bold 16px monospace';
        for (let i = 0; i < items.length; i++) {
            const iy = by + 90 + i * 50;
            const item = items[i];
            const canAfford = goldCount >= item.cost;
            if (i === shopSelection) {
                ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 20, iy - 6, bw - 40, 38);
                ctx.fillStyle = canAfford ? '#FFD700' : '#FF6666';
                ctx.fillText(`> ${item.name} <`, bx + bw/2, iy);
            } else {
                ctx.fillStyle = canAfford ? '#ccc' : '#666';
                ctx.fillText(item.name, bx + bw/2, iy);
            }
            ctx.font = '12px monospace';
            ctx.fillStyle = canAfford ? '#aaa' : '#664444';
            ctx.fillText(`${item.cost} gold`, bx + bw/2, iy + 22);
            ctx.font = 'bold 16px monospace';
        }
    }

    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to buy`, bx + bw/2, by + bh - 20);
}

// ── Teleport Button ─────────────────────────────────────────

const teleportBtn = { x: 100, y: 12, w: 80, h: 32 };

function drawTeleportButton() {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(teleportBtn.x, teleportBtn.y, teleportBtn.w, teleportBtn.h);
    ctx.strokeStyle = '#44AAFF'; ctx.lineWidth = 1; ctx.strokeRect(teleportBtn.x, teleportBtn.y, teleportBtn.w, teleportBtn.h);
    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#44AAFF'; ctx.fillText('Teleport', teleportBtn.x + teleportBtn.w/2, teleportBtn.y + teleportBtn.h/2);
}

function teleportToCastleGates() {
    if (activeAction || dialog.active || butlerDialog.active || messengerDialog.active || wizardDialog.active || campLeaderDialog.active || shopOpen || adminOpen) return;
    if (inBoat) inBoat = false;
    player.x = 14.5 * T;
    player.y = 29 * T;
    addNotification('Teleported to the castle gates!', 2000, 'rgba(68,170,255,1)', 'rgba(0,20,60,0.8)');
}

// ── Pause Button ────────────────────────────────────────────

const pauseBtn = { x: 0, y: 0, w: 80, h: 32 };

function drawPauseButton() {
    pauseBtn.x = canvas.width - 96;
    pauseBtn.y = 12;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(pauseBtn.x, pauseBtn.y, pauseBtn.w, pauseBtn.h);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(pauseBtn.x, pauseBtn.y, pauseBtn.w, pauseBtn.h);
    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700'; ctx.fillText('Pause', pauseBtn.x + pauseBtn.w/2, pauseBtn.y + pauseBtn.h/2);
}

// ── Pause Menu ──────────────────────────────────────────────

let pauseSelection = 0;

function drawPauseMenu() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const bw = 280, bh = 200;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700'; ctx.fillText('PAUSED', bx + bw/2, by + 20);

    const items = ['Resume', 'Quit to Menu'];
    ctx.font = 'bold 16px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 80 + i * 44;
        if (i === pauseSelection) {
            ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 20, iy - 6, bw - 40, 32);
            ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + items[i] + ' <', bx + bw/2, iy);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(items[i], bx + bw/2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw/2, by + bh - 24);
}

// ── Admin Panel ─────────────────────────────────────────────

const adminBtn = { x: 0, y: 0, w: 32, h: 32 };
const adminCloseBtn = { x: 0, y: 0, w: 36, h: 36 };

function drawAdminButton() {
    adminBtn.x = canvas.width - 140;
    adminBtn.y = 12;
    // Small gear icon button
    ctx.fillStyle = adminUnlocked ? 'rgba(100,0,0,0.6)' : 'rgba(0,0,0,0.3)';
    ctx.fillRect(adminBtn.x, adminBtn.y, adminBtn.w, adminBtn.h);
    ctx.strokeStyle = adminUnlocked ? '#FF4444' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1; ctx.strokeRect(adminBtn.x, adminBtn.y, adminBtn.w, adminBtn.h);
    ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = adminUnlocked ? '#FF4444' : 'rgba(255,255,255,0.2)';
    ctx.fillText('*', adminBtn.x + adminBtn.w/2, adminBtn.y + adminBtn.h/2);
}

function getAdminItems() {
    return [
        { name: adminGodMode ? 'God Mode: ON' : 'God Mode: OFF', action: () => {
            adminGodMode = !adminGodMode;
            if (adminGodMode) { health.max = 1e12; health.value = 1e12; }
            else { health.max = 10; health.value = 10; }
            addNotification(adminGodMode ? 'God mode: 1 trillion HP!' : 'God mode disabled', 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
        }},
        { name: 'Set Damage', action: () => {
            const val = prompt('Enter damage per hit:');
            if (val === null) return;
            const n = Number(val);
            if (isNaN(n) || n < 0) { addNotification('Invalid number', 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)'); return; }
            swordDamage = n;
            addNotification('Damage set to ' + n, 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
        }},
        { name: adminSwordEquipped ? 'Admin Sword: ON' : 'Admin Sword: OFF', action: () => {
            adminSwordEquipped = !adminSwordEquipped;
            if (adminSwordEquipped) { swordPickedUp = true; currentSword = 'admin'; swordDamage = 10; }
            else { currentSword = 'legendary'; swordDamage = 2; }
            addNotification(adminSwordEquipped ? 'Admin Sword equipped! (10 dmg)' : 'Admin Sword unequipped', 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
        }},
        { name: 'Set Speed', action: () => {
            const val = prompt('Enter speed (default 120):');
            if (val === null) return;
            const n = Number(val);
            if (isNaN(n) || n <= 0) { addNotification('Invalid number', 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)'); return; }
            player.speed = n;
            addNotification('Speed set to ' + n, 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
        }},
        { name: 'Set Gold', action: () => {
            const val = prompt('Enter gold amount:');
            if (val === null) return;
            const n = Number(val);
            if (isNaN(n) || n < 0) { addNotification('Invalid number', 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)'); return; }
            goldCount = Math.floor(n);
            addNotification('Gold set to ' + goldCount, 1500, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.8)');
        }},
        { name: adminGhostMode ? 'Ghost Mode: ON' : 'Ghost Mode: OFF', action: () => {
            adminGhostMode = !adminGhostMode;
            addNotification(adminGhostMode ? 'Ghost mode: walk through anything!' : 'Ghost mode disabled', 1500, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
        }},
        { name: 'Close', action: () => { adminOpen = false; } },
    ];
}

function drawAdminPanel() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const items = getAdminItems();
    const bw = 300, bh = 80 + items.length * 40 + 30;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(40,0,0,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FF4444'; ctx.fillText('ADMIN', bx + bw/2, by + 16);

    // Close button for touch
    if (isTouchDevice) {
        adminCloseBtn.x = bx + bw - 40; adminCloseBtn.y = by + 4;
        ctx.fillStyle = 'rgba(180,40,40,0.8)'; ctx.fillRect(adminCloseBtn.x, adminCloseBtn.y, adminCloseBtn.w, adminCloseBtn.h);
        ctx.strokeStyle = '#FF6666'; ctx.lineWidth = 1; ctx.strokeRect(adminCloseBtn.x, adminCloseBtn.y, adminCloseBtn.w, adminCloseBtn.h);
        ctx.font = 'bold 20px monospace'; ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
        ctx.fillText('X', adminCloseBtn.x + adminCloseBtn.w/2, adminCloseBtn.y + adminCloseBtn.h/2);
        ctx.textBaseline = 'top';
    }

    ctx.font = 'bold 14px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 60 + i * 40;
        if (i === adminSelection) {
            ctx.fillStyle = 'rgba(255,50,50,0.2)'; ctx.fillRect(bx + 16, iy - 4, bw - 32, 32);
            ctx.fillStyle = '#FF6666'; ctx.fillText('> ' + items[i].name + ' <', bx + bw/2, iy);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(items[i].name, bx + bw/2, iy);
        }
    }

    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select, Esc to close`, bx + bw/2, by + bh - 20);
}

function tryAdminLogin() {
    const data = getAdminData();
    if (data.unlocked) {
        adminUnlocked = true;
        adminOpen = true;
        adminSelection = 0;
        return;
    }
    if (data.attempts >= 2) {
        addNotification('Admin locked. Try again next week.', 3000, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
        return;
    }
    const pw = prompt('Enter admin password:');
    if (pw === null) return; // cancelled
    if (!data.weekStart) data.weekStart = Date.now();
    if (pw === 'RIVALSISMID') {
        data.unlocked = true;
        data.attempts = 0;
        saveAdminData(data);
        adminUnlocked = true;
        adminOpen = true;
        adminSelection = 0;
        addNotification('Admin access granted!', 2000, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
    } else {
        data.attempts++;
        saveAdminData(data);
        const left = 2 - data.attempts;
        addNotification(`Wrong password. ${left} attempt${left !== 1 ? 's' : ''} left this week.`, 3000, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
    }
}

