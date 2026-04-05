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

    // Void Rush indicator (shown when voidstar sword equipped)
    if (currentSword === 'voidstar' && voidStarSwordUnlocked) {
        const rushCdLeft = Math.max(0, voidRush.cooldown - (gameTime - voidRush.lastUseTime));
        ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        if (voidRush.state !== 'idle') {
            const pulse = 0.7 + 0.3 * Math.sin(performance.now() / 150);
            ctx.fillStyle = `rgba(200,140,255,${pulse})`;
            ctx.fillText('[R] Void Rush Active', 16, canvas.height - 140 - touchOffsetL);
        } else if (rushCdLeft <= 0) {
            ctx.fillStyle = '#C88FFF';
            ctx.fillText('[R] Void Rush Ready', 16, canvas.height - 140 - touchOffsetL);
        } else {
            const secs = Math.ceil(rushCdLeft / 1000);
            ctx.fillStyle = '#666';
            ctx.fillText(`[R] Void Rush ${secs}s`, 16, canvas.height - 140 - touchOffsetL);
        }
    }
    // Void Star buff indicator
    if (voidStarUnlocked) {
        const voidCdLeft = Math.max(0, VOID_STAR_COOLDOWN - (gameTime - lastVoidStarTime));
        ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        if (voidStarActive) {
            const remaining = Math.max(0, VOID_STAR_DURATION - (gameTime - voidStarStartTime));
            const pulse = 0.7 + 0.3 * Math.sin(performance.now() / 200);
            ctx.fillStyle = `rgba(180,100,255,${pulse})`;
            ctx.fillText(`[V] Void Star ${(remaining / 1000).toFixed(1)}s`, 16, canvas.height - 120 - touchOffsetL);
        } else if (voidCdLeft <= 0) {
            ctx.fillStyle = '#B464FF';
            ctx.fillText('[V] Void Star Ready', 16, canvas.height - 120 - touchOffsetL);
        } else {
            const secs = Math.ceil(voidCdLeft / 1000);
            const mins = Math.floor(secs / 60), s = secs % 60;
            ctx.fillStyle = '#666';
            ctx.fillText(`[V] Void Star ${mins}:${s.toString().padStart(2, '0')}`, 16, canvas.height - 120 - touchOffsetL);
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
            const snow = isSnowing();
            const barW = 400, barH = 24;
            const bx = canvas.width / 2 - barW / 2, by = 16;
            // Label
            ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillStyle = snow ? '#66bbff' : '#FF4444';
            ctx.fillText(snow ? 'ICE DRAGON' : 'DRAGON', canvas.width / 2, by - 4);
            // Background
            ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(bx, by, barW, barH);
            ctx.strokeStyle = snow ? '#2a5a8a' : '#8B0000'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, barW, barH);
            // Fill
            const ratio = dragon.hp / dragon.maxHp;
            const pulse = dragon.hp <= dragon.maxHp * 0.25 ? 0.7 + 0.3 * Math.sin(performance.now() / 200) : 1;
            if (snow) {
                ctx.fillStyle = ratio > 0.5 ? `rgba(40,100,200,${pulse})` : ratio > 0.25 ? `rgba(60,140,220,${pulse})` : `rgba(30,80,180,${pulse})`;
            } else {
                ctx.fillStyle = ratio > 0.5 ? `rgba(200,30,30,${pulse})` : ratio > 0.25 ? `rgba(220,120,0,${pulse})` : `rgba(200,0,0,${pulse})`;
            }
            ctx.fillRect(bx + 2, by + 2, (barW - 4) * ratio, barH - 4);
            // HP text
            ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(`${dragon.hp} / ${dragon.maxHp}`, canvas.width / 2, by + barH / 2);
        }
    }

    // Dragon fire/ice windup warning
    if (typeof dragon !== 'undefined' && dragon.alive && dragon.windingUp) {
        const snow = isSnowing();
        const progress = Math.min((gameTime - dragon.windupStart) / dragon.windupDuration, 1);
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / (200 - progress * 150));
        ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        if (snow) {
            ctx.fillStyle = `rgba(100,${Math.floor(150 + (1 - progress) * 105)},255,${pulse})`;
            ctx.fillText('! ICE BALL INCOMING !', canvas.width / 2, 80);
        } else {
            ctx.fillStyle = `rgba(255,${Math.floor(100 + (1 - progress) * 100)},0,${pulse})`;
            ctx.fillText('! DRAGON FIRE INCOMING !', canvas.width / 2, 80);
        }
    }

    // Gold counter (bottom right)
    ctx.font = 'bold 12px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Gold: ${goldCount}`, canvas.width - 16, canvas.height - 46 - touchOffsetR);
    // Snowflake counter
    ctx.fillStyle = '#aaddff';
    ctx.fillText(`Snowflakes: ${snowflakeCount}`, canvas.width - 16, canvas.height - 62 - touchOffsetR);

    // Sword indicator (bottom right)
    if (swordPickedUp) {
        ctx.fillStyle = currentSword === 'admin' ? '#FF4444' : currentSword === 'voidstar' ? '#C88FFF' : currentSword === 'dragon' ? '#FF6633' : currentSword === 'icespear' ? '#88ccff' : currentSword === 'dagger' ? '#AAAACC' : currentSword === 'kings' ? '#FFD700' : '#C0C0C0';
        const swordName = currentSword === 'admin' ? 'Admin Sword' : currentSword === 'voidstar' ? 'Void Star' : currentSword === 'dragon' ? 'Dragon Sword' : currentSword === 'icespear' ? 'Ice Spear' : currentSword === 'dagger' ? 'Dagger' : currentSword === 'kings' ? "King's Sword" : 'Legendary Sword';
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
    if (!designRoomBuilt) items.push({ name: 'Design Room', cost: 100, action: () => buildDesignRoom() });
    if (!daggerUnlocked) items.push({ name: 'Dagger (3 dmg + Stab)', cost: 300, action: () => { goldCount -= 300; daggerUnlocked = true; currentSword = 'dagger'; swordDamage = 3; addNotification('Dagger acquired! Press ' + kl('Y') + ' to stab!', 5000, 'rgba(255,180,50,1)', 'rgba(60,30,0,0.9)'); } });
    if (!dragonSwordUnlocked) items.push({ name: 'Dragon Sword (5 dmg)', cost: 1000, action: () => { goldCount -= 1000; dragonSwordUnlocked = true; currentSword = 'dragon'; swordDamage = 5; addNotification('Dragon Sword acquired! 5 damage per hit!', 5000, 'rgba(255,100,50,1)', 'rgba(60,10,0,0.9)'); } });
    if (!voidStarUnlocked) items.push({ name: 'Void Star (4x buff)', cost: 2500, action: () => { goldCount -= 2500; voidStarUnlocked = true; addNotification('Void Star unlocked! Press V to activate!', 5000, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.9)'); } });
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

// ── Noli Boss Bar ───────────────────────────────────────────

function drawVoidSentinelBossBar() {
    if (!inArena || !voidSentinel.alive || !voidSentinel.aggro) return;
    const barW = Math.min(500, canvas.width - 80);
    const barH = 20;
    const barX = (canvas.width - barW) / 2;
    const barY = 20;
    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(barX - 4, barY - 18, barW + 8, barH + 24);
    ctx.strokeStyle = '#8a4abf'; ctx.lineWidth = 2;
    ctx.strokeRect(barX - 4, barY - 18, barW + 8, barH + 24);
    // Label
    ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#C88FFF';
    ctx.fillText('Noli', canvas.width / 2, barY - 2);
    // Bar background
    ctx.fillStyle = 'rgba(40,0,60,0.8)'; ctx.fillRect(barX, barY, barW, barH);
    // HP fill
    const ratio = voidSentinel.hp / voidSentinel.maxHp;
    const grad = ctx.createLinearGradient(barX, barY, barX + barW * ratio, barY);
    grad.addColorStop(0, '#7a2abf');
    grad.addColorStop(1, '#C88FFF');
    ctx.fillStyle = grad;
    ctx.fillRect(barX + 2, barY + 2, (barW - 4) * ratio, barH - 4);
    // Border
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
    // HP text
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${Math.ceil(voidSentinel.hp)} / ${voidSentinel.maxHp}`, canvas.width / 2, barY + barH / 2);
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
let pauseScreen = 'main'; // 'main', 'quests', 'mastery', 'mastery_sword', 'mastery_dagger', 'mastery_spear', 'settings'
let questSelection = 0;
let masterySelection = 0;
let settingsSelection = 0;
const PAUSE_ITEMS = ['Resume', 'Quests', 'Mastery', 'Settings', 'Quit to Menu'];

function drawPauseMenu() {
    if (pauseScreen === 'quests') { drawQuestSelectMenu(); return; }
    if (pauseScreen === 'mastery') { drawMasteryPickerScreen(); return; }
    if (pauseScreen === 'mastery_sword') { drawSwordMasteryScreen(); return; }
    if (pauseScreen === 'mastery_dagger') { drawDaggerMasteryScreen(); return; }
    if (pauseScreen === 'mastery_spear') { drawSpearMasteryScreen(); return; }
    if (pauseScreen === 'mastery_mace') { drawMaceMasteryScreen(); return; }
    if (pauseScreen === 'settings') { drawSettingsScreen(); return; }
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const bw = 280, bh = 280;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700'; ctx.fillText('PAUSED', bx + bw/2, by + 20);

    ctx.font = 'bold 16px monospace';
    for (let i = 0; i < PAUSE_ITEMS.length; i++) {
        const iy = by + 65 + i * 40;
        if (i === pauseSelection) {
            ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 20, iy - 6, bw - 40, 32);
            ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + PAUSE_ITEMS[i] + ' <', bx + bw/2, iy);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(PAUSE_ITEMS[i], bx + bw/2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw/2, by + bh - 24);
}

function getSettingsItems() {
    return [
        { label: 'Extra Levels: ' + (extraLevels ? 'ON' : 'OFF'), key: 'extraLevels' },
        { label: 'Back', key: 'back' },
    ];
}

function drawSettingsScreen() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const items = getSettingsItems();
    const bw = 300, bh = 80 + items.length * 44 + 30;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);
    ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700'; ctx.fillText('SETTINGS', bx + bw/2, by + 16);
    ctx.font = 'bold 15px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 60 + i * 44;
        if (i === settingsSelection) {
            ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 20, iy - 6, bw - 40, 32);
            ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + items[i].label + ' <', bx + bw/2, iy);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(items[i].label, bx + bw/2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to toggle`, bx + bw/2, by + bh - 24);
}

function getMasteryPickerItems() {
    const items = [{ label: 'Sword Mastery (Lv ' + swordMastery.level + ')', key: 'sword' }];
    if (daggerUnlocked) items.push({ label: 'Dagger Mastery (Lv ' + daggerMastery.level + ')', key: 'dagger' });
    if (iceSpearUnlocked) items.push({ label: 'Spear Mastery (Lv ' + spearMastery.level + ')', key: 'spear' });
    if (firemaceUnlocked) items.push({ label: 'Mace Mastery (Lv ' + maceMastery.level + ')', key: 'mace' });
    items.push({ label: 'Back', key: 'back' });
    return items;
}

function drawMasteryPickerScreen() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const items = getMasteryPickerItems();
    const bw = 300, bh = 80 + items.length * 44 + 30;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);
    ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700'; ctx.fillText('MASTERY', bx + bw/2, by + 16);
    ctx.font = 'bold 15px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 60 + i * 44;
        if (i === masterySelection) {
            ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 16, iy - 6, bw - 32, 32);
            ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + items[i].label + ' <', bx + bw/2, iy);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(items[i].label, bx + bw/2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw/2, by + bh - 24);
}

function getSwordMasteryItems() {
    const skins = getMasteryUnlockedSkins();
    const items = skins.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1) + ' Skin', key: s }));
    items.push({ label: 'Back', key: 'back' });
    return items;
}

function getDaggerMasteryItems() {
    const skins = getDaggerMasteryUnlockedSkins();
    const items = skins.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1) + ' Skin', key: s }));
    items.push({ label: 'Back', key: 'back' });
    return items;
}

function drawWeaponMasteryDetail(title, mastery, milestones, mNames, mColors, items, equippedSkin, accentColor1, accentColor2) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const bw = 340, bh = 260 + items.length * 30;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = accentColor1; ctx.fillText(title, bx + bw/2, by + 14);

    ctx.font = 'bold 16px monospace'; ctx.fillStyle = '#fff';
    ctx.fillText(extraLevels ? `Level ${mastery.level}` : `Level ${mastery.level} / 100`, bx + bw/2, by + 44);

    // XP bar
    const barX = bx + 20, barY = by + 70, barW = bw - 40, barH = 16;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
    if (mastery.level < 100 || extraLevels) {
        const needed = xpForLevel(mastery.level + 1);
        const ratio = Math.min(1, mastery.xp / needed);
        const grad = ctx.createLinearGradient(barX, barY, barX + barW * ratio, barY);
        grad.addColorStop(0, accentColor2); grad.addColorStop(1, accentColor1);
        ctx.fillStyle = grad;
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * ratio, barH - 4);
        ctx.font = '10px monospace'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
        ctx.fillText(`${mastery.xp} / ${needed} XP`, bx + bw/2, barY + 2);
    } else {
        ctx.fillStyle = accentColor1; ctx.fillRect(barX + 2, barY + 2, barW - 4, barH - 4);
        ctx.font = '10px monospace'; ctx.fillStyle = '#333'; ctx.textAlign = 'center';
        ctx.fillText('MAX LEVEL', bx + bw/2, barY + 2);
    }

    // Milestone markers
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    const mY = by + 96;
    for (let i = 0; i < milestones.length; i++) {
        const mx = bx + 30 + i * ((bw - 60) / 3);
        const unlocked = mastery.level >= milestones[i];
        ctx.fillStyle = unlocked ? mColors[i] : '#555';
        ctx.fillText(`Lv${milestones[i]}`, mx, mY);
        ctx.font = '10px monospace';
        ctx.fillText(unlocked ? mNames[i] : '???', mx, mY + 14);
        ctx.font = 'bold 11px monospace';
    }

    // Skin selection
    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = '#DAA520'; ctx.fillText('Skins:', bx + 16, by + 136);

    ctx.font = '13px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 160 + i * 30;
        const isEquipped = items[i].key === equippedSkin;
        if (i === masterySelection) {
            ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 12, iy - 4, bw - 24, 24);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + items[i].label + (isEquipped ? ' [equipped]' : '') + ' <', bx + bw/2, iy);
        } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = isEquipped ? '#FFD700' : '#ccc';
            ctx.fillText(items[i].label + (isEquipped ? ' [equipped]' : ''), bx + bw/2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw/2, by + bh - 20);
}

function drawSwordMasteryScreen() {
    const items = getSwordMasteryItems();
    drawWeaponMasteryDetail('SWORD MASTERY', swordMastery,
        [25, 50, 75, 100], ['Bronze', 'Silver', 'Gold', 'Diamond'],
        ['#cd7f32', '#C0C0C0', '#FFD700', '#b9f2ff'],
        items, masterySkin, '#FFD700', '#4488ff');
}

function drawDaggerMasteryScreen() {
    const items = getDaggerMasteryItems();
    drawWeaponMasteryDetail('DAGGER MASTERY', daggerMastery,
        [25, 50, 75, 100], ['Shadow', 'Crimson', 'Phantom', 'Nightblade'],
        ['#555577', '#cc3333', '#8899aa', '#7744cc'],
        items, daggerMasterySkin, '#FF9933', '#cc6600');
}

function getSpearMasteryItems() {
    const skins = getSpearMasteryUnlockedSkins();
    const items = skins.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1) + ' Skin', key: s }));
    items.push({ label: 'Back', key: 'back' });
    return items;
}

function drawSpearMasteryScreen() {
    const items = getSpearMasteryItems();
    drawWeaponMasteryDetail('SPEAR MASTERY', spearMastery,
        [25, 50, 75, 100], ['Frost', 'Blizzard', 'Glacier', 'Aurora'],
        ['#88bbdd', '#ffffff', '#3388cc', '#44ddaa'],
        items, spearMasterySkin, '#88ccff', '#4488cc');
}

function getMaceMasteryItems() {
    const skins = getMaceMasteryUnlockedSkins();
    const items = skins.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1) + ' Skin', key: s }));
    items.push({ label: 'Back', key: 'back' });
    return items;
}

function drawMaceMasteryScreen() {
    const items = getMaceMasteryItems();
    drawWeaponMasteryDetail('MACE MASTERY', maceMastery,
        [25, 50, 75, 100], ['Ember', 'Inferno', 'Magma', 'Hellfire'],
        ['#cc6620', '#dd3300', '#aa2200', '#ff4400'],
        items, maceMasterySkin, '#ff8830', '#cc5500');
}

function getQuestItems() {
    const items = [{ label: 'Main Quest', key: 'main' }];
    if (dragonKills > 0) items.push({ label: 'Void Quest', key: 'void' });
    if (jackFrostQuestActive) items.push({ label: 'Jack Frost Quest', key: 'frost' });
    items.push({ label: 'Back', key: 'back' });
    return items;
}

function drawQuestSelectMenu() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const items = getQuestItems();
    const bw = 280, bh = 80 + items.length * 44 + 30;
    const bx = canvas.width/2 - bw/2, by = canvas.height/2 - bh/2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);

    ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700'; ctx.fillText('QUESTS', bx + bw/2, by + 16);

    ctx.font = 'bold 16px monospace';
    for (let i = 0; i < items.length; i++) {
        const iy = by + 70 + i * 44;
        const isActive = items[i].key === activeQuest;
        const label = items[i].label + (isActive ? ' *' : '');
        if (i === questSelection) {
            ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 20, iy - 6, bw - 40, 32);
            ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + label + ' <', bx + bw/2, iy);
        } else {
            ctx.fillStyle = isActive ? '#FFD700' : '#ccc';
            ctx.fillText(label, bx + bw/2, iy);
        }
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw/2, by + bh - 24);
}



