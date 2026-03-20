// ── Cooking System ──────────────────────────────────────────

const cookingState = {
    active: false, startTime: 0, duration: 60000,
    meal: null, dessert: null, done: false, doneAcknowledged: false,
};

const dialog = {
    active: false, stage: null, selectedIndex: 0, meal: null, dessert: null,
};

const meals = ['Steak', 'Fish', 'Pasta'];
const desserts = ['Pumpkin Pie'];

function openCookDialog() {
    if ((cookingState.active && !cookingState.done) || (cookingState.done && !cookingState.doneAcknowledged)) return;
    dialog.active = true; dialog.selectedIndex = 0;
    dialog.meal = null; dialog.dessert = null;
    if (dragonKills > 0 && npcCongrats.cook < dragonKills) {
        dialog.stage = 'congrats';
    } else {
        dialog.stage = 'meal';
    }
}

function advanceDialog() {
    if (dialog.stage === 'congrats') {
        npcCongrats.cook = dragonKills;
        dialog.stage = 'meal'; dialog.selectedIndex = 0;
        return;
    }
    if (dialog.stage === 'meal') {
        dialog.meal = meals[dialog.selectedIndex]; dialog.stage = 'dessert'; dialog.selectedIndex = 0;
    } else if (dialog.stage === 'dessert') {
        dialog.dessert = desserts[dialog.selectedIndex]; dialog.stage = 'confirmed';
    } else if (dialog.stage === 'confirmed') {
        cookingState.active = true; cookingState.startTime = gameTime;
        cookingState.meal = dialog.meal; cookingState.dessert = dialog.dessert;
        cookingState.done = false; cookingState.doneAcknowledged = false;
        dialog.active = false; dialog.stage = null;
    }
}

function drawDialog() {
    if (!dialog.active) return;
    const bw = 320, bh = 180;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh); ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';

    if (dialog.stage === 'congrats') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700'; ctx.fillText('Cook:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Your Majesty! You slew the dragon!"', bx + 16, by + 40);
        ctx.fillText('"The whole castle is celebrating!"', bx + 16, by + 62);
        ctx.fillText('"Let me prepare a feast in your honor!"', bx + 16, by + 84);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('E')} to continue`, bx + bw / 2, by + bh - 22);
    } else if (dialog.stage === 'meal') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700'; ctx.fillText('Cook:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff'; ctx.fillText('"What shall I prepare, Your Majesty?"', bx + 16, by + 36);
        for (let i = 0; i < meals.length; i++) {
            const iy = by + 68 + i * 26;
            if (i === dialog.selectedIndex) {
                ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 12, iy - 4, bw - 24, 22);
                ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + meals[i], bx + 16, iy);
            } else { ctx.fillStyle = '#ccc'; ctx.fillText('  ' + meals[i], bx + 16, iy); }
        }
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw / 2, by + bh - 22);
    } else if (dialog.stage === 'dessert') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700'; ctx.fillText('Cook:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText(`"${dialog.meal}, excellent! And for dessert?"`, bx + 16, by + 36);
        for (let i = 0; i < desserts.length; i++) {
            const iy = by + 68 + i * 26;
            if (i === dialog.selectedIndex) {
                ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 12, iy - 4, bw - 24, 22);
                ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + desserts[i], bx + 16, iy);
            } else { ctx.fillStyle = '#ccc'; ctx.fillText('  ' + desserts[i], bx + 16, iy); }
        }
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('E')} to select`, bx + bw / 2, by + bh - 22);
    } else if (dialog.stage === 'confirmed') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700'; ctx.fillText('Cook:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText(`"${dialog.meal} with ${dialog.dessert}!"`, bx + 16, by + 40);
        ctx.fillText('"Right away, Your Majesty!"', bx + 16, by + 62);
        ctx.fillText('"It will take about a minute."', bx + 16, by + 84);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('E')} to confirm`, bx + bw / 2, by + bh - 22);
    }
}

function drawCookBusyPrompt() {
    const elapsed = gameTime - cookingState.startTime;
    const remaining = Math.max(0, Math.ceil((cookingState.duration - elapsed) / 1000));
    const mins = Math.floor(remaining / 60), secs = remaining % 60;
    const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
    drawPrompt(`Cook: "Still cooking... ${timeStr} remaining"`);
}

// ── Butler System ───────────────────────────────────────────

const butlerState = { fetching: false, fetchStart: 0, fetchDuration: 5000, farewellTriggered: false, farewellReady: false };
const butlerDialog = { active: false, stage: null, selectedIndex: 0 };

function openButlerDialog() {
    if (butlerState.fetching) return;
    butlerDialog.active = true;
    if (dragonKills > 0 && npcCongrats.butler < dragonKills) {
        butlerDialog.stage = 'congrats';
        return;
    }
    if (butlerState.farewellReady && !butlerState.farewellTriggered) {
        butlerDialog.stage = 'farewell_1';
        return;
    }
    if (!cookingState.active && !cookingState.done) butlerDialog.stage = 'no_food';
    else if (cookingState.active && !cookingState.done) butlerDialog.stage = 'not_ready';
    else if (cookingState.done && !cookingState.doneAcknowledged) { butlerDialog.stage = 'ask'; butlerDialog.selectedIndex = 0; }
    else butlerDialog.stage = 'no_food';
}

function advanceButlerDialog() {
    if (butlerDialog.stage === 'congrats') {
        npcCongrats.butler = dragonKills;
        butlerDialog.active = false; butlerDialog.stage = null;
        return;
    }
    if (butlerDialog.stage === 'no_food' || butlerDialog.stage === 'not_ready') {
        butlerDialog.active = false; butlerDialog.stage = null;
    } else if (butlerDialog.stage === 'ask') {
        if (butlerDialog.selectedIndex === 0) butlerDialog.stage = 'fetching_confirm';
        else { butlerDialog.active = false; butlerDialog.stage = null; }
    } else if (butlerDialog.stage === 'fetching_confirm') {
        butlerDialog.active = false; butlerDialog.stage = null;
        butlerState.fetching = true; butlerState.fetchStart = gameTime;
    } else if (butlerDialog.stage === 'farewell_1') {
        butlerDialog.stage = 'farewell_2';
    } else if (butlerDialog.stage === 'farewell_2') {
        butlerDialog.stage = 'farewell_3';
    } else if (butlerDialog.stage === 'farewell_3') {
        butlerDialog.active = false; butlerDialog.stage = null;
        butlerState.farewellTriggered = true;
        // Butler was a wizard — max out hunger to 1 billion
        hunger.max = 1000000000;
        hunger.value = 1000000000;
        addNotification('Hunger boosted to 1,000,000,000!', 6000, 'rgba(100,200,255,1)', 'rgba(0,20,60,0.9)');
        addNotification('You will never go hungry again!', 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.85)');
    }
}

function drawButlerDialog() {
    if (!butlerDialog.active) return;
    const isFarewell = butlerDialog.stage && butlerDialog.stage.startsWith('farewell');
    const bw = isFarewell ? 380 : 340, bh = isFarewell ? 200 : 160;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh); ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';

    if (butlerDialog.stage === 'congrats') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Your Majesty! Word has reached us"', bx + 16, by + 40);
        ctx.fillText('"that you have slain the dragon!"', bx + 16, by + 60);
        ctx.fillText('"The kingdom rejoices! Well done, sire!"', bx + 16, by + 80);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'no_food') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"No meal has been ordered yet,"', bx + 16, by + 40);
        ctx.fillText('"Your Majesty. Speak to the cook."', bx + 16, by + 60);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'not_ready') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"The food is not ready yet,"', bx + 16, by + 40);
        ctx.fillText('"Your Majesty."', bx + 16, by + 60);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'ask') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText(`"Your ${cookingState.meal} & ${cookingState.dessert}"`, bx + 16, by + 36);
        ctx.fillText('"is ready. Shall I bring it?"', bx + 16, by + 56);
        const opts = ['Yes, bring it', 'No, not now'];
        for (let i = 0; i < 2; i++) {
            const iy = by + 86 + i * 24;
            if (i === butlerDialog.selectedIndex) {
                ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 12, iy - 4, bw - 24, 20);
                ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + opts[i], bx + 16, iy);
            } else { ctx.fillStyle = '#ccc'; ctx.fillText('  ' + opts[i], bx + 16, iy); }
        }
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'fetching_confirm') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Very well, Your Majesty."', bx + 16, by + 40);
        ctx.fillText('"I shall fetch it at once."', bx + 16, by + 60);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'farewell_1') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#8A2BE2'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Wait, Your Majesty! Before you"', bx + 16, by + 40);
        ctx.fillText('"leave... I must tell you"', bx + 16, by + 60);
        ctx.fillText('"something."', bx + 16, by + 80);
        ctx.fillStyle = '#aaa'; ctx.fillText('"I have kept a secret..."', bx + 16, by + 108);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'farewell_2') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#8A2BE2'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"I was once a great wizard."', bx + 16, by + 40);
        ctx.fillText('"I gave up my powers to serve"', bx + 16, by + 62);
        ctx.fillText('"the crown. But for you, I shall"', bx + 16, by + 84);
        ctx.fillText('"use what little magic remains."', bx + 16, by + 106);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (butlerDialog.stage === 'farewell_3') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#8A2BE2'; ctx.fillText('Butler:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"I grant you immense vitality!"', bx + 16, by + 40);
        ctx.fillText('"Your body shall withstand any"', bx + 16, by + 62);
        ctx.fillText('"blow. And take this food for"', bx + 16, by + 84);
        ctx.fillText('"your journey, Your Majesty."', bx + 16, by + 106);
        ctx.font = '12px monospace'; ctx.fillStyle = '#4CAF50';
        ctx.fillText('"Go forth and save the kingdom!"', bx + 16, by + 130);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    }
}

function updateButlerFarewell() {
    if (butlerState.farewellTriggered || butlerState.farewellReady) return;
    if (!questTasks.prepComplete) return;
    // Trigger when king goes south past the castle gate (row 28+)
    const playerRow = Math.floor((player.y + player.height / 2) / T);
    if (playerRow >= 28) {
        butlerState.farewellReady = true;
        addNotification('The butler wants to speak with you!', 5000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.9)');
    }
}

// ── Hunger System ───────────────────────────────────────────

const hunger = {
    value: 10, max: 10,
    lastDeplete: 0,
    depleteInterval: 60000, // 1 minute
    depleteAmount: 0.5,
};

let hungerWarningShown = false, hungerWarningTime = 0;

function updateHunger() {
    const interval = hunger.value < 5 ? hunger.depleteInterval / 2 : hunger.depleteInterval;
    if (gameTime - hunger.lastDeplete >= interval) {
        hunger.value = Math.max(0, hunger.value - hunger.depleteAmount);
        hunger.lastDeplete = gameTime;
        if (hunger.value < 5 && hunger.value > 0) { hungerWarningShown = true; hungerWarningTime = gameTime; }
    }
}

// ── Health System ───────────────────────────────────────────

const health = { value: 10, max: 10, lastDamage: 0 };

function updateHealth() {
    // Damage from zero hunger: -0.5 per 2 seconds
    if (hunger.value <= 0) {
        if (gameTime - health.lastDamage >= 2000) {
            health.value = Math.max(0, health.value - 0.5);
            health.lastDamage = gameTime;
        }
    } else {
        health.lastDamage = gameTime;
    }
}

// ── Messenger NPC ───────────────────────────────────────────

const messenger = {
    x: 14 * T + 4,
    y: 44 * T,        // starts outside, far south
    width: 16,
    height: 16,
    speed: 80,
    targetY: 5 * T,   // stops on carpet in front of throne
    arrived: false,
    messageRead: false,
    active: false,     // becomes active after all prep tasks done
};

function updateMessenger() {
    if (!messenger.active || messenger.arrived) return;
    // Move north toward throne
    if (messenger.y > messenger.targetY) {
        messenger.y -= messenger.speed * (1 / 60); // approx per frame
        if (messenger.y <= messenger.targetY) {
            messenger.y = messenger.targetY;
            messenger.arrived = true;
            addNotification('A messenger has arrived!', 4000, 'rgba(255,255,100,1)', 'rgba(60,50,0,0.85)');
        }
    }
}

function drawMessenger(ox, oy) {
    if (!messenger.active) return;
    const sx = Math.round(messenger.x - ox), sy = Math.round(messenger.y - oy);
    const cx = sx + messenger.width / 2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, sy + messenger.height + 2, 8, 3, 0, 0, Math.PI * 2); ctx.fill();

    // Body - brown tunic
    ctx.fillStyle = '#8B6914'; ctx.fillRect(sx + 2, sy + 8, 12, 10);
    // Belt
    ctx.fillStyle = '#654321'; ctx.fillRect(sx + 2, sy + 13, 12, 2);

    // Head
    ctx.fillStyle = '#f5c6a0'; ctx.beginPath(); ctx.arc(cx, sy + 6, 5, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#333'; ctx.fillRect(cx - 3, sy + 5, 2, 2); ctx.fillRect(cx + 1, sy + 5, 2, 2);

    // Hood/cap
    ctx.fillStyle = '#5a4a20'; ctx.fillRect(sx + 3, sy - 1, 10, 4);
    ctx.fillRect(sx + 5, sy - 3, 6, 3);

    // Arms
    ctx.fillStyle = '#f5c6a0'; ctx.fillRect(sx, sy + 9, 3, 6); ctx.fillRect(sx + 13, sy + 9, 3, 6);

    // Scroll in hand
    ctx.fillStyle = '#F5F5DC'; ctx.fillRect(sx + 14, sy + 10, 5, 3);
    ctx.fillStyle = '#DAA520'; ctx.fillRect(sx + 14, sy + 10, 1, 3); ctx.fillRect(sx + 18, sy + 10, 1, 3);

    // Feet
    ctx.fillStyle = '#654321'; ctx.fillRect(sx + 3, sy + 17, 4, 3); ctx.fillRect(sx + 9, sy + 17, 4, 3);

    // Running animation (legs alternate if moving)
    if (!messenger.arrived) {
        const legPhase = Math.sin(performance.now() / 100) * 3;
        ctx.fillStyle = '#654321';
        ctx.fillRect(sx + 4, sy + 17 + Math.abs(legPhase), 3, 3);
        ctx.fillRect(sx + 9, sy + 17 + Math.abs(-legPhase), 3, 3);
    }

    // Exclamation mark above head (if arrived and not read)
    if (messenger.arrived && !messenger.messageRead) {
        const bounce = Math.sin(performance.now() / 300) * 3;
        ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        // Yellow bg circle
        ctx.fillStyle = 'rgba(255,215,0,0.9)';
        ctx.beginPath(); ctx.arc(cx, sy - 12 + bounce, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8B0000';
        ctx.fillText('!', cx, sy - 4 + bounce);
    }
}

function isNearMessenger() {
    if (!messenger.active || !messenger.arrived || messenger.messageRead) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const mcx = messenger.x + messenger.width / 2, mcy = messenger.y + messenger.height / 2;
    return Math.hypot(pcx - mcx, pcy - mcy) < T * 2;
}

// Messenger dialog
const messengerDialog = {
    active: false,
    stage: null, // 'message', 'accept'
};

function openMessengerDialog() {
    messengerDialog.active = true;
    messengerDialog.stage = 'message';
}

function advanceMessengerDialog() {
    if (messengerDialog.stage === 'message') {
        messengerDialog.stage = 'accept';
    } else if (messengerDialog.stage === 'accept') {
        messengerDialog.active = false;
        messengerDialog.stage = null;
        messenger.messageRead = true;
        addNotification('Quest: Travel to the mountain and defeat the dragon!', 6000, 'rgba(255,200,50,1)', 'rgba(60,30,0,0.9)');
    }
}

function drawMessengerDialog() {
    if (!messengerDialog.active) return;
    const bw = 380, bh = 220;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeStyle = '#8B0000'; ctx.lineWidth = 1; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';

    if (messengerDialog.stage === 'message') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700';
        ctx.fillText('Messenger:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Your Majesty! Urgent news!"', bx + 16, by + 40);
        ctx.fillText('"An evil dragon has been spotted"', bx + 16, by + 62);
        ctx.fillText('"near the mountain! It threatens"', bx + 16, by + 84);
        ctx.fillText('"to attack the kingdom!"', bx + 16, by + 106);
        ctx.font = '12px monospace'; ctx.fillStyle = '#FF6666';
        ctx.fillText('"We need you to slay the beast!"', bx + 16, by + 136);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('E')} to continue`, bx + bw / 2, by + bh - 22);
    } else if (messengerDialog.stage === 'accept') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700';
        ctx.fillText('Messenger:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Travel south through the castle"', bx + 16, by + 40);
        ctx.fillText('"gates and cross the field."', bx + 16, by + 62);
        ctx.fillText('"At the river bridge, you will"', bx + 16, by + 84);
        ctx.fillText('"find a legendary sword."', bx + 16, by + 106);
        ctx.font = '12px monospace'; ctx.fillStyle = '#4CAF50';
        ctx.fillText('"Take it and defeat the dragon!"', bx + 16, by + 136);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('E')} to accept quest`, bx + bw / 2, by + bh - 22);
    }
}

// ── Sword Pickup ────────────────────────────────────────────

function isNearSword() {
    if (swordPickedUp) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    // Sword is at row 39, cols 14-15
    const sx = 14.5 * T, sy = 39 * T + T / 2;
    return Math.hypot(pcx - sx, pcy - sy) < T * 1.8;
}

function pickUpSword() {
    swordPickedUp = true;
    // Replace sword tiles with regular bridge
    map[39][14] = BRIDGE; map[39][15] = BRIDGE;
    questTasks.findSword = true; checkAllTasks();
    addNotification('You found the Legendary Sword!', 5000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
}

// ── Quest Task System ───────────────────────────────────────

const questTasks = {
    ateFood: false,
    usedBathroom: false,
    talkedCook: false,
    talkedButler: false,
    satThrone: false,
    sleptBed: false,
    usedToilet: false,
    prepComplete: false,
    findSword: false,
    spiderDefeated: false,
    gaveGold: false,
    seaSnakeDefeated: false,
    campHelped: false,
    trollDefeated: false,
    dragonDefeated: false,
    allComplete: false,
};

function checkAllTasks() {
    const wasPrepDone = questTasks.prepComplete;
    questTasks.prepComplete = questTasks.ateFood && questTasks.usedBathroom &&
        questTasks.talkedCook && questTasks.talkedButler &&
        questTasks.satThrone && questTasks.sleptBed && questTasks.usedToilet;

    // Activate messenger when prep is done
    if (questTasks.prepComplete && !wasPrepDone) {
        addNotification('All preparations complete! A messenger approaches...', 5000, 'rgba(100,255,100,1)', 'rgba(0,60,0,0.9)');
        messenger.active = true;
    }

    questTasks.allComplete = questTasks.prepComplete && questTasks.findSword && questTasks.gaveGold;
}

function drawQuestTasks() {
    const tx = canvas.width - 250, ty = 54;

    // Build task list based on phase
    const tasks = [
        { label: 'Order & eat food', done: questTasks.ateFood },
        { label: 'Use the bathroom', done: questTasks.usedBathroom },
        { label: 'Talk to cook', done: questTasks.talkedCook },
        { label: 'Talk to butler', done: questTasks.talkedButler },
        { label: 'Sit on throne', done: questTasks.satThrone },
        { label: 'Sleep in bed', done: questTasks.sleptBed },
        { label: 'Use the toilet', done: questTasks.usedToilet },
    ];

    // Add quest tasks after messenger
    if (messenger.messageRead) {
        tasks.push({ label: 'Find the sword', done: questTasks.findSword });
    }
    // Add wizard quest tasks
    if (questTasks.findSword) {
        tasks.push({ label: 'Talk to the wizard', done: wizardQuestStage !== 'none' });
    }
    if (wizardQuestStage === 'asked') {
        tasks.push({ label: 'Defeat the spider', done: questTasks.spiderDefeated });
        if (questTasks.spiderDefeated) {
            tasks.push({ label: 'Bring gold to wizard', done: questTasks.gaveGold });
        }
    }
    if (questTasks.gaveGold) {
        tasks.push({ label: 'Slay the sea snake', done: questTasks.seaSnakeDefeated });
        tasks.push({ label: 'Defend the castle', done: questTasks.campHelped });
        tasks.push({ label: 'Kill the troll', done: questTasks.trollDefeated });
        tasks.push({ label: 'Defeat the dragon', done: questTasks.dragonDefeated });
    }

    const title = questTasks.gaveGold ? 'Dragon Quest - Ready!' : questTasks.prepComplete ? 'Dragon Quest' : 'Quest Preparations';
    const panelH = 40 + tasks.length * 22 + (questTasks.allComplete ? 26 : 0);

    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(tx - 8, ty - 4, 240, panelH);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1;
    ctx.strokeRect(tx - 8, ty - 4, 240, panelH);

    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(title, tx, ty);

    ctx.font = '12px monospace';
    for (let i = 0; i < tasks.length; i++) {
        const iy = ty + 22 + i * 22;
        const check = tasks[i].done ? '[x]' : '[ ]';
        ctx.fillStyle = tasks[i].done ? '#4CAF50' : '#aaa';
        ctx.fillText(`${check} ${tasks[i].label}`, tx + 4, iy);
    }

    if (questTasks.prepComplete && !messenger.messageRead && messenger.arrived) {
        ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#FFD700';
        ctx.fillText('! Speak to the messenger !', tx, ty + 22 + tasks.length * 22 + 4);
    }

    if (questTasks.allComplete) {
        ctx.font = 'bold 13px monospace'; ctx.fillStyle = '#4CAF50';
        ctx.fillText('Quest complete!', tx + 4, ty + 22 + tasks.length * 22 + 4);
    }
}

// ── Bathroom System ─────────────────────────────────────────

const bathroom = {
    needsToGo: false,
    needStartTime: 0,
    timeUntilNeed: 600000,   // 10 minutes after eating
    accidentTime: 1200000,   // 20 minutes after need starts
    lastAteTime: -Infinity,
    hasAte: false,
    pooped: false,
};

let poopNotifShown = false, poopNotifTime = 0;
let bathroomWarningShown = false, bathroomWarningTime = 0;

function updateBathroom() {
    // Check if need starts
    if (bathroom.hasAte && !bathroom.needsToGo && !bathroom.pooped) {
        if (gameTime - bathroom.lastAteTime >= bathroom.timeUntilNeed) {
            bathroom.needsToGo = true;
            bathroom.needStartTime = gameTime;
            bathroomWarningShown = true;
            bathroomWarningTime = gameTime;
        }
    }
    // Check for accident
    if (bathroom.needsToGo && !bathroom.pooped) {
        if (gameTime - bathroom.needStartTime >= bathroom.accidentTime) {
            bathroom.pooped = true;
            bathroom.needsToGo = false;
            health.value = Math.max(0, health.value - 1);
            poopNotifShown = true;
            poopNotifTime = gameTime;
        }
    }
}

function useBathroom() {
    bathroom.needsToGo = false;
    bathroom.hasAte = false;
    bathroom.pooped = false;
}

function isNearToilet() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const tx = 2 * T + T / 2, ty = 22 * T + T / 2;
    return Math.hypot(pcx - tx, pcy - ty) < T * 1.5;
}

// ── Interactions ────────────────────────────────────────────

const interactions = [
    { name: 'throne', tiles: [[2,14],[2,15]], get prompt() { return `${kl('E')} to sit on throne`; }, action: 'sitting', duration: Infinity, get message() { return `The king sits upon his throne... (${kl('E')} to get up)`; } },
    { name: 'bed', tiles: [[11,2],[11,3],[12,2],[12,3],[13,2],[13,3]], get prompt() { return `${kl('E')} to sleep`; }, action: 'sleeping', duration: Infinity, get message() { return `The king rests... Zzz... (${kl('E')} to wake up)`; } },
    { name: 'toilet', tiles: [[22,2]], get prompt() { return `${kl('E')} to use the toilet`; }, action: 'using_toilet', duration: Infinity, get message() { return `The king is on the throne... the other one. (${kl('E')} to finish)`; } },
];

let activeAction = null;

function getNearbyInteraction() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    for (const inter of interactions) {
        for (const [row, col] of inter.tiles) {
            const tx = col * T + T / 2, ty = row * T + T / 2;
            if (Math.hypot(pcx - tx, pcy - ty) < T * 1.5) return inter;
        }
    }
    return null;
}

// ── Eat helper ──────────────────────────────────────────────

function eatFood(source) {
    const healAmt = dragonKills > 0 ? 10 : 8;
    hunger.value = Math.min(hunger.max, hunger.value + 8);
    health.value = Math.min(health.max, health.value + healAmt);
    cookingState.doneAcknowledged = true; cookingState.active = false; cookingState.done = false;
    addNotification(`${source} ${cookingState.meal} & ${cookingState.dessert}! (+8 hunger, +${healAmt} HP)`, 3000, 'rgba(255,215,0,1)', 'rgba(40,30,5,0.85)');
    bathroom.hasAte = true; bathroom.lastAteTime = gameTime;
    bathroom.pooped = false;
    questTasks.ateFood = true; checkAllTasks();
}

// ── Wizard System ───────────────────────────────────────────

let secretPassageOpen = false;
let hasGold = false;
let wizardQuestStage = 'none'; // 'none', 'asked', 'gold_given'

const wizardDialog = { active: false, stage: null };

function openWizardDialog() {
    wizardDialog.active = true;
    if (dragonKills > 0 && npcCongrats.wizard < dragonKills) {
        wizardDialog.stage = 'congrats';
    } else if (wizardQuestStage === 'gold_given') {
        wizardDialog.stage = 'done';
    } else if (hasGold) {
        wizardDialog.stage = 'has_gold';
    } else if (wizardQuestStage === 'asked') {
        wizardDialog.stage = 'reminder';
    } else {
        wizardDialog.stage = 'greeting';
    }
}

function advanceWizardDialog() {
    if (wizardDialog.stage === 'greeting') {
        wizardDialog.stage = 'quest_info';
    } else if (wizardDialog.stage === 'quest_info') {
        wizardDialog.stage = 'passage_open';
    } else if (wizardDialog.stage === 'passage_open') {
        wizardDialog.active = false; wizardDialog.stage = null;
        wizardQuestStage = 'asked';
        openSecretPassage();
        addNotification('The wizard revealed a secret passage!', 5000, 'rgba(138,43,226,1)', 'rgba(30,10,60,0.9)');
    } else if (wizardDialog.stage === 'has_gold') {
        wizardDialog.stage = 'reward';
    } else if (wizardDialog.stage === 'reward') {
        wizardDialog.active = false; wizardDialog.stage = null;
        hasGold = false;
        wizardQuestStage = 'gold_given';
        questTasks.gaveGold = true; checkAllTasks();
        healPowerUnlocked = true;
        addNotification('The wizard grants you his blessing!', 5000, 'rgba(138,43,226,1)', 'rgba(30,10,60,0.9)');
        addNotification(`Heal power unlocked! ${kl('F')} to heal (5 min cooldown)`, 6000, 'rgba(100,255,200,1)', 'rgba(0,40,30,0.9)');
    } else if (wizardDialog.stage === 'congrats') {
        npcCongrats.wizard = dragonKills;
        wizardDialog.active = false; wizardDialog.stage = null;
    } else if (wizardDialog.stage === 'reminder' || wizardDialog.stage === 'done') {
        wizardDialog.active = false; wizardDialog.stage = null;
    }
}

function drawWizardDialog() {
    if (!wizardDialog.active) return;
    const bw = 380, bh = 200;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(10,5,30,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#8A2BE2'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';

    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#8A2BE2';
    ctx.fillText('Wizard:', bx + 16, by + 14);
    ctx.font = '13px monospace'; ctx.fillStyle = '#fff';

    if (wizardDialog.stage === 'congrats') {
        ctx.fillText('"The dragon falls! Magnificent!"', bx + 16, by + 40);
        ctx.fillText('"Your courage is unmatched,"', bx + 16, by + 62);
        ctx.fillText('"Your Majesty. The realm is safe!"', bx + 16, by + 84);
        ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${kl('E')}`, bx + bw / 2, by + bh - 22);
    } else if (wizardDialog.stage === 'greeting') {
        ctx.fillText('"Ah, Your Majesty! I have been"', bx + 16, by + 40);
        ctx.fillText('"expecting you. I can help you"', bx + 16, by + 62);
        ctx.fillText('"defeat the dragon..."', bx + 16, by + 84);
        ctx.fillStyle = '#aaa'; ctx.fillText('"But I require something first."', bx + 16, by + 114);
    } else if (wizardDialog.stage === 'quest_info') {
        ctx.fillText('"Bring me a block of pure gold."', bx + 16, by + 40);
        ctx.fillText('"A giant spider guards one deep"', bx + 16, by + 62);
        ctx.fillText('"in the forest. Defeat it and"', bx + 16, by + 84);
        ctx.fillText('"the gold is yours."', bx + 16, by + 106);
    } else if (wizardDialog.stage === 'passage_open') {
        ctx.fillText('"I shall reveal a secret passage"', bx + 16, by + 40);
        ctx.fillText('"in the forest. Follow it to find"', bx + 16, by + 62);
        ctx.fillText('"the spider\'s lair."', bx + 16, by + 84);
        ctx.font = '12px monospace'; ctx.fillStyle = '#8A2BE2';
        ctx.fillText('"Be careful — use H to strike!"', bx + 16, by + 114);
    } else if (wizardDialog.stage === 'reminder') {
        ctx.fillText('"The secret passage awaits you"', bx + 16, by + 40);
        ctx.fillText('"in the forest. Defeat the spider"', bx + 16, by + 62);
        ctx.fillText('"and bring me the gold!"', bx + 16, by + 84);
    } else if (wizardDialog.stage === 'has_gold') {
        ctx.fillText('"Excellent! You have the gold!"', bx + 16, by + 40);
        ctx.fillText('"You have proven yourself worthy,"', bx + 16, by + 62);
        ctx.fillText('"brave king."', bx + 16, by + 84);
    } else if (wizardDialog.stage === 'reward') {
        ctx.fillText('"Take my blessing. Your sword"', bx + 16, by + 40);
        ctx.fillText('"now glows with enchantment!"', bx + 16, by + 62);
        ctx.fillText('"Go forth and slay the dragon!"', bx + 16, by + 84);
        ctx.font = '12px monospace'; ctx.fillStyle = '#4CAF50';
        ctx.fillText('"The dragon awaits beyond the forest..."', bx + 16, by + 114);
    } else if (wizardDialog.stage === 'done') {
        ctx.fillText('"Go forth, Your Majesty!"', bx + 16, by + 40);
        ctx.fillText('"The dragon awaits."', bx + 16, by + 62);
    }

    ctx.fillStyle = '#888'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`${kl('E')} to continue`, bx + bw / 2, by + bh - 22);
}

// ── Secret Passage ──────────────────────────────────────────

function openSecretPassage() {
    secretPassageOpen = true;
    // Carve passage from main path (cols 8-9, row 63-64) west to arena
    for (let c = 1; c <= 7; c++) { map[63][c] = PATH; map[64][c] = PATH; }
    // Carve spider arena (rows 60-68, cols 1-6)
    for (let r = 60; r <= 68; r++)
        for (let c = 1; c <= 6; c++) map[r][c] = PATH;
    // Activate spider
    spider.active = true;
}

// ── Spider Combat System ────────────────────────────────────

const spider = {
    x: 3 * T + 2, y: 64 * T + 2,
    width: 28, height: 28,
    hp: 20, maxHp: 20,
    alive: true,
    active: false,
    lastAttack: 0,
    attackCooldown: 1500,
    damage: 1,
    stunned: false,
    stunUntil: 0,
};

let playerAttackCooldown = 0;
const PLAYER_ATTACK_RATE = 400; // ms between player attacks

// ── Gold & Sword System ────────────────────────────────────
let goldCount = 0;
let swordDamage = 2;
let currentSword = 'legendary'; // 'legendary' (2 dmg), 'kings' (3 dmg), 'dragon' (5 dmg), 'voidstar' (7 dmg)
let kingSwordUnlocked = false;
let dragonSwordUnlocked = false;
let voidStarSwordUnlocked = false;
let weaponryBuilt = false;
let guestRoomBuilt = false;
let dragonKills = 0;
let dragonRespawnTime = -Infinity;
let lastCongratsKill = 0; // tracks which dragon kill NPCs last congratulated for
const npcCongrats = { cook: 0, butler: 0, wizard: 0, campLeader: 0 };
const DRAGON_RESPAWN_DELAY = 120000; // 2 minutes
const MOB_RESPAWN_DELAY = 10000; // 10 seconds
let spiderDeathTime = -Infinity;
let seaSnakeDeathTime = -Infinity;
let trollDeathTime = -Infinity;

function respawnMonsters() {
    spider.hp = spider.maxHp; spider.alive = true; spider.active = true; spider.stunned = false; spider.stunUntil = 0;
    seaSnake.hp = seaSnake.maxHp; seaSnake.alive = true; seaSnake.active = false; seaSnake.stunned = false; seaSnake.stunUntil = 0;
    troll.hp = troll.maxHp; troll.alive = true; troll.stunned = false; troll.stunUntil = 0;
    voidSentinel.hp = voidSentinel.maxHp; voidSentinel.alive = true; voidSentinel.aggro = false; voidSentinel.stunned = false; voidSentinel.stunUntil = 0;
    voidSentinel.x = 14 * T; voidSentinel.y = 220 * T;
    if (!peakPassageOpen) openPeakPassage();
}

function switchSword() {
    if (!kingSwordUnlocked) return;
    if (currentSword === 'admin') {
        currentSword = 'legendary'; swordDamage = 2;
        addNotification('Switched to Legendary Sword (2 dmg)', 2000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.9)');
    } else if (currentSword === 'legendary') {
        currentSword = 'kings'; swordDamage = 3;
        addNotification("Switched to King's Sword (3 dmg)", 2000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
    } else if (currentSword === 'kings' && dragonSwordUnlocked) {
        currentSword = 'dragon'; swordDamage = 5;
        addNotification('Switched to Dragon Sword (5 dmg)', 2000, 'rgba(255,100,50,1)', 'rgba(60,10,0,0.9)');
    } else if ((currentSword === 'kings' || currentSword === 'dragon') && voidStarSwordUnlocked) {
        currentSword = 'voidstar'; swordDamage = 7;
        addNotification('Switched to Void Star (7 dmg)', 2000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
    } else if ((currentSword === 'kings' || currentSword === 'dragon' || currentSword === 'voidstar') && adminSwordEquipped) {
        currentSword = 'admin'; swordDamage = 10;
        addNotification('Switched to Admin Sword (10 dmg)', 2000, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.9)');
    } else {
        currentSword = 'legendary'; swordDamage = 2;
        addNotification('Switched to Legendary Sword (2 dmg)', 2000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.9)');
    }
}

function buildWeaponryRoom(free) {
    if (weaponryBuilt && !free) return;
    if (!free && goldCount < 20) return;
    if (!free) goldCount -= 20;
    weaponryBuilt = true;
    // Open corridor east wall
    map[24][17] = DOOR; map[25][17] = DOOR;
    // Room: rows 22-27, cols 18-26
    for (let r = 22; r <= 27; r++)
        for (let c = 18; c <= 26; c++) map[r][c] = FLOOR;
    for (let c = 18; c <= 26; c++) { map[22][c] = WALL; map[27][c] = WALL; }
    for (let r = 22; r <= 27; r++) map[r][26] = WALL;
    map[22][18] = WALL; map[23][18] = WALL; map[26][18] = WALL; map[27][18] = WALL;
    map[24][18] = DOOR; map[25][18] = DOOR;
    // Weapon racks
    map[23][22] = WEAPON_RACK; map[23][24] = WEAPON_RACK;
    map[25][22] = WEAPON_RACK; map[25][24] = WEAPON_RACK;
    // Torch
    map[22][21] = TORCH;
    if (!free) addNotification('Weaponry built! Visit it in the castle.', 5000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
}

function buildGuestRoom(free) {
    if (guestRoomBuilt && !free) return;
    if (!free && goldCount < 30) return;
    if (!free) goldCount -= 30;
    guestRoomBuilt = true;
    // Guest room: east side of throne room, rows 1-10, cols 25-29
    // Walls
    for (let c = 25; c <= 29; c++) { map[1][c] = WALL; map[10][c] = WALL; }
    for (let r = 1; r <= 10; r++) map[r][29] = WALL;
    // Floor
    for (let r = 2; r <= 9; r++)
        for (let c = 25; c <= 28; c++) map[r][c] = FLOOR;
    // Door connecting to throne room east wall
    map[5][24] = DOOR; map[6][24] = DOOR;
    // Guest bed
    map[3][27] = BED_HEAD; map[3][28] = BED_HEAD;
    map[4][27] = PILLOW; map[4][28] = PILLOW;
    map[5][27] = BED_FOOT; map[5][28] = BED_FOOT;
    // Nightstand
    map[3][26] = NIGHTSTAND;
    // Rug
    map[7][26] = RUG; map[7][27] = RUG;
    map[8][26] = RUG; map[8][27] = RUG;
    // Table & chair
    map[9][26] = TABLE; map[9][27] = CHAIR;
    // Torches
    map[2][25] = TORCH; map[2][28] = TORCH;
    // Windows
    map[1][26] = WINDOW_TILE; map[1][27] = WINDOW_TILE;
    if (!free) addNotification('Guest room built! Your friends await.', 5000, 'rgba(100,255,150,1)', 'rgba(0,40,20,0.9)');
}

function isNearWeaponRack() {
    if (!weaponryBuilt || !kingSwordUnlocked) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && map[r][c] === WEAPON_RACK) return true;
        }
    return false;
}

function isNearWeaponryBuildSite() {
    if (weaponryBuilt || dragonKills === 0) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    return row >= 23 && row <= 26 && col >= 16 && col <= 17;
}

function isNearGuestRoomBuildSite() {
    if (guestRoomBuilt || dragonKills === 0) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    return row >= 5 && row <= 6 && col >= 22 && col <= 24;
}

function isNearSpider() {
    if (!spider.alive || !spider.active) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const scx = spider.x + spider.width / 2, scy = spider.y + spider.height / 2;
    return Math.hypot(pcx - scx, pcy - scy) < T * 1.5;
}

function hitSpider() {
    if (!swordPickedUp || !spider.alive || !spider.active) return;
    if (!isNearSpider()) return;
    // Only in forest area
    const pRow = Math.floor((player.y + player.height / 2) / T);
    if (pRow < 44 || pRow > 89) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    playerAttackCooldown = gameTime;
    const dmg = swordDamage * getVoidMultiplier();
    spider.hp -= dmg;
    addNotification(`Hit! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (spider.hp <= 0) {
        spider.hp = 0;
        spider.alive = false;
        spiderDeathTime = gameTime;
        spider.maxHp += 10;
        const gld = 3 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        // Drop gold block at spider position
        const goldCol = Math.floor((spider.x + spider.width / 2) / T);
        const goldRow = Math.floor((spider.y + spider.height / 2) / T);
        map[goldRow][goldCol] = GOLD_BLOCK;
        questTasks.spiderDefeated = true; checkAllTasks();
        addNotification('The giant spider is defeated! It dropped a gold block!', 5000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
    }
}

function updateSpider() {
    if (!spider.alive && spider.active && spiderDeathTime > 0 && gameTime >= spiderDeathTime + MOB_RESPAWN_DELAY) {
        spider.hp = spider.maxHp; spider.alive = true; spider.stunned = false; spider.stunUntil = 0;
        spider.x = 3 * T + 2; spider.y = 64 * T + 2;
        spiderDeathTime = -Infinity;
    }
    if (!spider.alive || !spider.active) return;
    // Handle stun
    if (spider.stunned) {
        if (gameTime >= spider.stunUntil) spider.stunned = false;
        return;
    }
    // Spider attacks player when in range
    if (isNearSpider()) {
        if (gameTime - spider.lastAttack >= spider.attackCooldown) {
            spider.lastAttack = gameTime;
            if (!shieldActive) {
                health.value = Math.max(0, health.value - spider.damage);
                addNotification('Spider bites! -1 HP', 800, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
            } else {
                spider.stunned = true;
                spider.stunUntil = gameTime + 2000;
                addNotification('Shield stuns the spider!', 1500, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
            }
        }
    }
}

// ── Gold Pickup ─────────────────────────────────────────────

function isNearGold() {
    if ((wizardQuestStage !== 'gold_given' && hasGold) || spider.alive) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    // Check nearby tiles for gold block
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && map[r][c] === GOLD_BLOCK) return true;
        }
    return false;
}

function pickUpGold() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && map[r][c] === GOLD_BLOCK) {
                map[r][c] = PATH;
                if (wizardQuestStage === 'gold_given') {
                    goldCount += 10;
                    addNotification('+10 Gold', 2000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
                } else {
                    hasGold = true;
                    addNotification('Picked up a block of pure gold!', 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
                }
                return;
            }
        }
}

// ── Sea Snake Combat System ─────────────────────────────────

const seaSnake = {
    x: 14 * T, y: 100 * T,
    width: 28, height: 28,
    hp: 40, maxHp: 40,
    alive: true,
    active: false,
    lastAttack: 0,
    attackCooldown: 2000,
    damage: 1,
    speed: 90, // 3/4 of player speed (120 * 0.75)
    stunned: false,
    stunUntil: 0,
};

function boardBoat() {
    inBoat = true;
    boatBoardTime = gameTime;
    if (seaSnake.alive && !seaSnake.active) {
        seaSnake.active = true;
    }
    addNotification('You board the boat!', 2000, 'rgba(100,200,255,1)', 'rgba(0,30,60,0.8)');
}

function updateSeaSnake(dt) {
    if (!seaSnake.alive && seaSnake.active && seaSnakeDeathTime > 0 && gameTime >= seaSnakeDeathTime + MOB_RESPAWN_DELAY) {
        seaSnake.hp = seaSnake.maxHp; seaSnake.alive = true; seaSnake.stunned = false; seaSnake.stunUntil = 0;
        seaSnake.x = 14 * T; seaSnake.y = 100 * T;
        seaSnakeDeathTime = -Infinity;
    }
    if (!seaSnake.alive || !seaSnake.active) return;
    // Handle stun
    if (seaSnake.stunned) {
        if (gameTime >= seaSnake.stunUntil) seaSnake.stunned = false;
        return;
    }
    // Move toward player
    const scx = seaSnake.x + seaSnake.width / 2;
    const scy = seaSnake.y + seaSnake.height / 2;
    const pcx = player.x + player.width / 2;
    const pcy = player.y + player.height / 2;
    const dx = pcx - scx, dy = pcy - scy;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
        seaSnake.x += (dx / dist) * seaSnake.speed * dt;
        seaSnake.y += (dy / dist) * seaSnake.speed * dt;
    }
    // Keep snake in water area
    seaSnake.x = Math.max(0, Math.min(seaSnake.x, MAP_COLS * T - seaSnake.width));
    seaSnake.y = Math.max(92 * T, Math.min(seaSnake.y, 108 * T - seaSnake.height));
    // Attack player when in range
    if (isNearSeaSnake()) {
        if (gameTime - seaSnake.lastAttack >= seaSnake.attackCooldown) {
            seaSnake.lastAttack = gameTime;
            if (!shieldActive) {
                health.value = Math.max(0, health.value - seaSnake.damage);
                addNotification('Sea snake bites! -1 HP', 800, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
            } else {
                seaSnake.stunned = true;
                seaSnake.stunUntil = gameTime + 3000;
                addNotification('Shield stuns the sea snake!', 1500, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
            }
        }
    }
}

function hitSeaSnake() {
    if (!swordPickedUp || !seaSnake.alive || !seaSnake.active) return;
    if (!isNearSeaSnake()) return;
    // Only in lake area
    const pRow = Math.floor((player.y + player.height / 2) / T);
    if (pRow < 90 || pRow > 110) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    playerAttackCooldown = gameTime;
    const dmg = swordDamage * getVoidMultiplier();
    seaSnake.hp -= dmg;
    addNotification(`Hit! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (seaSnake.hp <= 0) {
        seaSnake.hp = 0;
        seaSnake.alive = false;
        seaSnakeDeathTime = gameTime;
        seaSnake.maxHp += 10;
        const gld = 5 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        health.max = Math.max(health.max, 15);
        if (dragonKills === 0) health.value = health.max;
        questTasks.seaSnakeDefeated = true;
        addNotification('The sea snake is defeated!', 5000, 'rgba(100,255,150,1)', 'rgba(0,40,20,0.9)');
        if (dragonKills === 0) addNotification(`Health increased to ${health.max}/${health.max}!`, 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.85)');
    }
}

// ── Orc Siege System ────────────────────────────────────────

const orcSiege = {
    active: false,
    complete: false,
    shieldGiven: false,
    location: 'castle', // 'castle' or 'camp' — where the current fight is happening
};

let orcs = [];

const campLeaderDialog = { active: false, stage: null, selectedIndex: 0 };

function openCampLeaderDialog() {
    campLeaderDialog.active = true;
    // Determine location: if player row >= 100, they're at the camp; otherwise castle
    const playerRow = Math.floor((player.y + player.height / 2) / T);
    campLeaderDialog.location = playerRow >= 100 ? 'camp' : 'castle';
    if (dragonKills > 0 && npcCongrats.campLeader < dragonKills) {
        campLeaderDialog.stage = 'congrats';
    } else if (!orcSiege.complete && !orcSiege.active) {
        campLeaderDialog.stage = 'greeting';
    } else if (orcSiege.complete && !orcSiege.shieldGiven) {
        campLeaderDialog.stage = 'victory';
    } else if (orcSiege.shieldGiven) {
        campLeaderDialog.stage = 'rematch_ask';
        campLeaderDialog.selectedIndex = 0;
    } else {
        campLeaderDialog.active = false;
    }
}

function advanceCampLeaderDialog() {
    if (campLeaderDialog.stage === 'congrats') {
        npcCongrats.campLeader = dragonKills;
        campLeaderDialog.stage = 'rematch_ask';
        campLeaderDialog.selectedIndex = 0;
    } else if (campLeaderDialog.stage === 'greeting') {
        campLeaderDialog.stage = 'battle_start';
    } else if (campLeaderDialog.stage === 'battle_start') {
        campLeaderDialog.active = false; campLeaderDialog.stage = null;
        orcSiege.active = true; orcSiege.complete = false;
        orcSiege.location = campLeaderDialog.location;
        spawnOrcs(campLeaderDialog.location);
        const locName = campLeaderDialog.location === 'camp' ? 'camp' : 'castle';
        addNotification(`Orcs are attacking the ${locName}!`, 4000, 'rgba(255,100,100,1)', 'rgba(80,0,0,0.9)');
    } else if (campLeaderDialog.stage === 'victory') {
        campLeaderDialog.active = false; campLeaderDialog.stage = null;
        orcSiege.shieldGiven = true;
        shieldUnlocked = true;
        addNotification(`Shield unlocked! ${kl('B')} to activate!`, 5000, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.9)');
    } else if (campLeaderDialog.stage === 'rematch_ask') {
        if (campLeaderDialog.selectedIndex === 0) {
            // Yes - start orc fight
            campLeaderDialog.stage = 'battle_start';
        } else {
            // No
            campLeaderDialog.active = false; campLeaderDialog.stage = null;
        }
    } else if (campLeaderDialog.stage === 'done') {
        campLeaderDialog.active = false; campLeaderDialog.stage = null;
    }
}

function drawCampLeaderDialog() {
    if (!campLeaderDialog.active) return;
    const bw = 380, bh = 160;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';

    if (campLeaderDialog.stage === 'congrats') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0';
        ctx.fillText('Camp Leader:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"Your Majesty! The dragon is dead!"', bx + 16, by + 40);
        ctx.fillText('"You are the greatest warrior"', bx + 16, by + 60);
        ctx.fillText('"this land has ever known!"', bx + 16, by + 80);
        ctx.font = '11px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(`${kl('E')} to continue`, bx + 16, by + bh - 24);
    } else if (campLeaderDialog.stage === 'rematch_ask') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0';
        ctx.fillText('Camp Leader:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"More orcs approach the castle!"', bx + 16, by + 40);
        ctx.fillText('"Want to face them again, sire?"', bx + 16, by + 60);
        const choices = ['Yes, bring them on!', 'Not now'];
        ctx.font = 'bold 14px monospace';
        for (let i = 0; i < choices.length; i++) {
            const iy = by + 90 + i * 28;
            if (i === campLeaderDialog.selectedIndex) {
                ctx.fillStyle = 'rgba(218,165,32,0.3)'; ctx.fillRect(bx + 12, iy - 4, bw - 24, 24);
                ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + choices[i], bx + 16, iy);
            } else { ctx.fillStyle = '#ccc'; ctx.fillText('  ' + choices[i], bx + 16, iy); }
        }
        ctx.font = '11px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to select`, bx + 16, by + bh - 24);
    } else if (campLeaderDialog.stage === 'greeting') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0';
        ctx.fillText('Camp Leader:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"King! Thank the gods you\'re here."', bx + 16, by + 40);
        ctx.fillText('"A large orc war party approaches -"', bx + 16, by + 60);
        ctx.fillText('"we need your help to defend the castle!"', bx + 16, by + 80);
        ctx.font = '11px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(`${kl('E')} to continue`, bx + 16, by + bh - 24);
    } else if (campLeaderDialog.stage === 'battle_start') {
        ctx.font = 'bold 16px monospace'; ctx.fillStyle = '#FF4444';
        ctx.textAlign = 'center';
        ctx.fillText('TO ARMS!', bx + bw / 2, by + 30);
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700';
        ctx.fillText('Defend the castle!', bx + bw / 2, by + 60);
        ctx.font = '13px monospace'; ctx.fillStyle = '#ccc';
        ctx.fillText('Orcs approach the castle gate!', bx + bw / 2, by + 90);
        ctx.font = '11px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(`${kl('E')} to begin`, bx + bw / 2, by + bh - 24);
    } else if (campLeaderDialog.stage === 'victory') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0';
        ctx.fillText('Camp Leader:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"You saved the castle, Your Majesty!"', bx + 16, by + 40);
        ctx.fillText('"Take this enchanted shield as thanks."', bx + 16, by + 60);
        ctx.fillStyle = '#8888FF';
        ctx.fillText(`"${kl('B')} to raise it - it will protect"`, bx + 16, by + 80);
        ctx.fillText('"you from all harm for 2 seconds."', bx + 16, by + 100);
        ctx.font = '11px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(`${kl('E')} to accept`, bx + 16, by + bh - 24);
    } else if (campLeaderDialog.stage === 'done') {
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#C0C0C0';
        ctx.fillText('Camp Leader:', bx + 16, by + 14);
        ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
        ctx.fillText('"The shield will serve you well,"', bx + 16, by + 40);
        ctx.fillText('"Your Majesty. Safe travels!"', bx + 16, by + 60);
        ctx.font = '11px monospace'; ctx.fillStyle = '#888';
        ctx.fillText(`${kl('E')} to close`, bx + 16, by + bh - 24);
    }
}

// Guard combat state
const guardCombat = {
    active: false,
    guard1Target: null,
    guard2Target: null,
    guard1Home: { x: guard1.x, y: guard1.y },
    guard2Home: { x: guard2.x, y: guard2.y },
    attackCooldown1: 0,
    attackCooldown2: 0,
    guardDamage: 3,
    guardSpeed: 80,
    guardAttackRate: 1200,
    guard1Path: null, guard1PathIndex: 0, guard1PathTime: 0,
    guard2Path: null, guard2PathIndex: 0, guard2PathTime: 0,
};

function spawnOrcs(location) {
    orcs = [];
    // Castle: spawn at map edges near castle gate (rows 29-33)
    // Camp: spawn inside camp area on PATH tiles (rows 114-116, cols 6/23)
    const isCamp = location === 'camp';
    const spawnSides = [-1, 1, -1]; // alternate left/right
    for (let i = 0; i < 3; i++) {
        const fromLeft = spawnSides[i] < 0;
        let spawnX, spawnY;
        if (isCamp) {
            // Spawn well inside camp on PATH tiles, away from tents and edges
            const row = 114 + Math.floor(Math.random() * 3); // rows 114-116
            spawnX = (fromLeft ? 6 : 23) * T;
            spawnY = row * T;
        } else {
            const row = 29 + Math.floor(Math.random() * 5);
            spawnX = fromLeft ? 0 : (MAP_COLS - 1) * T;
            spawnY = row * T + Math.random() * T;
        }
        orcs.push({
            x: spawnX,
            y: spawnY,
            width: 20, height: 20,
            hp: 10, maxHp: 10, alive: true,
            lastAttack: 0, attackCooldown: 1500, damage: 1, speed: 70,
            stunned: false, stunUntil: 0,
            path: null, pathIndex: 0, pathTime: 0,
        });
    }
    // Only activate castle guards when fighting at the castle
    if (!isCamp) {
        guardCombat.active = true;
        guardCombat.guard1Target = null;
        guardCombat.guard2Target = null;
        guardCombat.attackCooldown1 = 0;
        guardCombat.attackCooldown2 = 0;
        guardCombat.guard1Path = null; guardCombat.guard1PathIndex = 0; guardCombat.guard1PathTime = 0;
        guardCombat.guard2Path = null; guardCombat.guard2PathIndex = 0; guardCombat.guard2PathTime = 0;
    }
}

function updateOrcs(dt) {
    if (orcSiege.active) {
        // Check if all orcs are dead
        if (orcs.every(o => !o.alive)) {
            orcSiege.active = false;
            orcSiege.complete = true;
            orcs = [];
            questTasks.campHelped = true;
            // Return guards home
            guardCombat.active = false;
            guardCombat.guard1Target = null;
            guardCombat.guard2Target = null;
            guard1.x = guardCombat.guard1Home.x; guard1.y = guardCombat.guard1Home.y;
            guard2.x = guardCombat.guard2Home.x; guard2.y = guardCombat.guard2Home.y;
            addNotification('The orcs have been defeated! Victory!', 6000, 'rgba(100,255,100,1)', 'rgba(0,40,0,0.9)');
            return;
        }
    }

    for (const orc of orcs) {
        if (!orc.alive) continue;
        // Handle stun
        if (orc.stunned) {
            if (gameTime >= orc.stunUntil) orc.stunned = false;
            continue;
        }
        const ocx = orc.x + orc.width / 2, ocy = orc.y + orc.height / 2;
        const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
        const dx = pcx - ocx, dy = pcy - ocy;
        const dist = Math.hypot(dx, dy);
        if (dist > 4) {
            if (dist > PATHFIND_THRESHOLD) {
                // Recompute path periodically (longer interval if no path found to avoid spam)
                const pathInterval = orc.path ? 1000 : 3000;
                if (!orc.path || orc.pathIndex >= orc.path.length || gameTime - orc.pathTime > pathInterval) {
                    const sc = Math.floor(ocx / T), sr = Math.floor(ocy / T);
                    const gc = Math.floor(pcx / T), gr = Math.floor(pcy / T);
                    orc.path = findPath(sc, sr, gc, gr, 500);
                    orc.pathIndex = 0;
                    orc.pathTime = gameTime;
                }
                if (orc.path && orc.pathIndex < orc.path.length) {
                    orc.pathIndex = moveAlongPath(orc, orc.path, orc.pathIndex, orc.speed, dt);
                } else {
                    // Fallback direct movement
                    const mx = (dx / dist) * orc.speed * dt;
                    const my = (dy / dist) * orc.speed * dt;
                    if (!isNPCBlocked(orc.x + mx, orc.y, orc.width, orc.height)) orc.x += mx;
                    if (!isNPCBlocked(orc.x, orc.y + my, orc.width, orc.height)) orc.y += my;
                }
            } else {
                // Close range: direct movement
                orc.path = null;
                const mx = (dx / dist) * orc.speed * dt;
                const my = (dy / dist) * orc.speed * dt;
                if (!isNPCBlocked(orc.x + mx, orc.y, orc.width, orc.height)) orc.x += mx;
                if (!isNPCBlocked(orc.x, orc.y + my, orc.width, orc.height)) orc.y += my;
            }
        }
        if (dist < T * 1.5) {
            if (gameTime - orc.lastAttack >= orc.attackCooldown) {
                orc.lastAttack = gameTime;
                if (!shieldActive) {
                    health.value = Math.max(0, health.value - orc.damage);
                    addNotification('Orc hits! -1 HP', 600, 'rgba(255,80,80,1)', 'rgba(60,0,0,0.8)');
                } else {
                    orc.stunned = true;
                    orc.stunUntil = gameTime + 2000;
                    addNotification('Shield stuns the orc!', 1500, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
                }
            }
        }
    }

    // Guard AI — chase and attack orcs
    if (guardCombat.active && orcSiege.active) {
        updateGuardCombat(guard1, 'guard1Target', 'attackCooldown1', dt);
        updateGuardCombat(guard2, 'guard2Target', 'attackCooldown2', dt);
    }

    orcs = orcs.filter(o => o.alive);
}

function updateGuardCombat(g, targetKey, cdKey, dt) {
    const pathKey = targetKey.replace('Target', 'Path');
    const pathIndexKey = targetKey.replace('Target', 'PathIndex');
    const pathTimeKey = targetKey.replace('Target', 'PathTime');

    // Pick closest alive orc as target
    let target = guardCombat[targetKey];
    if (!target || !target.alive) {
        let best = null, bestDist = Infinity;
        for (const orc of orcs) {
            if (!orc.alive) continue;
            const d = Math.hypot(g.x - orc.x, g.y - orc.y);
            if (d < bestDist) { best = orc; bestDist = d; }
        }
        guardCombat[targetKey] = best;
        guardCombat[pathKey] = null; // new target, clear path
        target = best;
    }
    if (!target) return;

    const gcx = g.x + g.width / 2, gcy = g.y + g.height / 2;
    const ocx = target.x + target.width / 2, ocy = target.y + target.height / 2;
    const dx = ocx - gcx, dy = ocy - gcy;
    const dist = Math.hypot(dx, dy);

    // Move toward target with pathfinding
    if (dist > T * 1.2) {
        if (dist > PATHFIND_THRESHOLD) {
            if (!guardCombat[pathKey] || guardCombat[pathIndexKey] >= guardCombat[pathKey].length || gameTime - guardCombat[pathTimeKey] > 1000) {
                const sc = Math.floor(gcx / T), sr = Math.floor(gcy / T);
                const gc = Math.floor(ocx / T), gr = Math.floor(ocy / T);
                guardCombat[pathKey] = findPath(sc, sr, gc, gr);
                guardCombat[pathIndexKey] = 0;
                guardCombat[pathTimeKey] = gameTime;
            }
            if (guardCombat[pathKey] && guardCombat[pathIndexKey] < guardCombat[pathKey].length) {
                guardCombat[pathIndexKey] = moveAlongPath(g, guardCombat[pathKey], guardCombat[pathIndexKey], guardCombat.guardSpeed, dt);
            } else {
                const mx = (dx / dist) * guardCombat.guardSpeed * dt;
                const my = (dy / dist) * guardCombat.guardSpeed * dt;
                if (!isNPCBlocked(g.x + mx, g.y, g.width, g.height)) g.x += mx;
                if (!isNPCBlocked(g.x, g.y + my, g.width, g.height)) g.y += my;
            }
        } else {
            guardCombat[pathKey] = null;
            const mx = (dx / dist) * guardCombat.guardSpeed * dt;
            const my = (dy / dist) * guardCombat.guardSpeed * dt;
            if (!isNPCBlocked(g.x + mx, g.y, g.width, g.height)) g.x += mx;
            if (!isNPCBlocked(g.x, g.y + my, g.width, g.height)) g.y += my;
        }
    }
    // Attack
    if (dist < T * 1.5) {
        if (gameTime - guardCombat[cdKey] >= guardCombat.guardAttackRate) {
            guardCombat[cdKey] = gameTime;
            target.hp -= guardCombat.guardDamage;
            if (target.hp <= 0) {
                target.hp = 0;
                target.alive = false;
                guardCombat[targetKey] = null;
                goldCount += 2;
                addNotification('Guard slays an orc! +2 Gold', 1200, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
            }
        }
    }
}


function hitNearestOrc() {
    if (!swordPickedUp) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    let nearest = null, nearestDist = Infinity;
    for (const orc of orcs) {
        if (!orc.alive) continue;
        const d = Math.hypot(pcx - (orc.x + orc.width / 2), pcy - (orc.y + orc.height / 2));
        if (d < T * 1.5 && d < nearestDist) { nearest = orc; nearestDist = d; }
    }
    if (!nearest) return;
    playerAttackCooldown = gameTime;
    const dmg = swordDamage * getVoidMultiplier();
    nearest.hp -= dmg;
    addNotification(`Hit orc! -${dmg} HP`, 600, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (nearest.hp <= 0) {
        nearest.hp = 0;
        nearest.alive = false;
        const gld = 2 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1200, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
    }
}

// ── Shield System ───────────────────────────────────────────

let shieldUnlocked = false;
let lastShieldTime = -Infinity;
const SHIELD_COOLDOWN = 8000;

function useShield() {
    if (!shieldUnlocked) return;
    if (shieldActive) return;
    if (gameTime - lastShieldTime < SHIELD_COOLDOWN) {
        const remaining = Math.ceil((SHIELD_COOLDOWN - (gameTime - lastShieldTime)) / 1000);
        addNotification(`Shield recharging: ${remaining}s`, 1000, 'rgba(150,150,200,1)', 'rgba(30,30,50,0.8)');
        return;
    }
    shieldActive = true;
    shieldStartTime = gameTime;
    lastShieldTime = gameTime;
    addNotification('Shield raised!', 1000, 'rgba(100,150,255,1)', 'rgba(0,20,80,0.9)');
}

function updateShield() {
    if (shieldActive && gameTime - shieldStartTime >= SHIELD_DURATION) {
        shieldActive = false;
    }
}

// ── Mountain Troll Combat System ────────────────────────────

const troll = {
    x: 15 * T, y: 152 * T,
    width: 28, height: 28,
    hp: 60, maxHp: 60,
    alive: true,
    lastAttack: 0,
    attackCooldown: 2000,
    damage: 1,
    speed: 60,
    stunned: false,
    stunUntil: 0,
};

function updateTroll(dt) {
    if (!troll.alive && trollDeathTime > 0 && gameTime >= trollDeathTime + MOB_RESPAWN_DELAY) {
        troll.hp = troll.maxHp; troll.alive = true;
        troll.x = 15 * T; troll.y = 152 * T;
        troll.stunned = false; troll.stunUntil = 0;
        trollDeathTime = -Infinity;
    }
    if (!troll.alive) return;
    // Check if player is in the cave area
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const pRow = Math.floor(pcy / T);
    if (pRow < 148 || pRow > 156) return; // only active when player is in cave

    // Handle stun
    if (troll.stunned) {
        if (gameTime >= troll.stunUntil) {
            troll.stunned = false;
        }
        return; // can't move or attack while stunned
    }

    // Move toward player
    const tcx = troll.x + troll.width / 2, tcy = troll.y + troll.height / 2;
    const dx = pcx - tcx, dy = pcy - tcy;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
        const nx = troll.x + (dx / dist) * troll.speed * dt;
        const ny = troll.y + (dy / dist) * troll.speed * dt;
        // Keep troll inside cave
        troll.x = Math.max(11 * T, Math.min(nx, 19 * T - troll.width));
        troll.y = Math.max(149 * T, Math.min(ny, 155 * T - troll.height));
    }

    // Attack player when in range
    if (isNearTroll()) {
        if (gameTime - troll.lastAttack >= troll.attackCooldown) {
            troll.lastAttack = gameTime;
            if (shieldActive) {
                // Shield block stuns the troll
                troll.stunned = true;
                troll.stunUntil = gameTime + 2000;
                addNotification('Shield stuns the troll!', 1500, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
            } else {
                health.value = Math.max(0, health.value - troll.damage);
                addNotification('Troll smashes! -1 HP', 800, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
            }
        }
    }
}

function hitTroll() {
    if (!swordPickedUp || !troll.alive) return;
    if (!isNearTroll()) return;
    // Only in cave area
    const pRow = Math.floor((player.y + player.height / 2) / T);
    if (pRow < 148 || pRow > 156) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    playerAttackCooldown = gameTime;
    const dmg = swordDamage * getVoidMultiplier();
    troll.hp -= dmg;
    addNotification(`Hit troll! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (troll.hp <= 0) {
        troll.hp = 0;
        troll.alive = false;
        trollDeathTime = gameTime;
        troll.maxHp += 10;
        const gld = 8 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        health.max = Math.max(health.max, 30);
        if (dragonKills === 0) health.value = health.max;
        questTasks.trollDefeated = true;
        addNotification('The mountain troll is defeated!', 5000, 'rgba(100,255,150,1)', 'rgba(0,40,20,0.9)');
        if (dragonKills === 0) addNotification('Health increased to 30/30!', 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.85)');
        addNotification('A secret passage to the peak opens!', 5000, 'rgba(255,200,100,1)', 'rgba(60,40,0,0.9)');
        openPeakPassage();
    }
}

function openPeakPassage() {
    peakPassageOpen = true;
    // Open south wall of cave
    map[156][14] = CAVE_FLOOR; map[156][15] = CAVE_FLOOR;
    // Carve passage through mountain to peak
    for (let r = 157; r <= 166; r++) {
        map[r][14] = MOUNTAIN_PATH; map[r][15] = MOUNTAIN_PATH;
    }
}

// ── Dragon Combat System ───────────────────────────────────

let peakPassageOpen = false;

const dragon = {
    x: 15 * T, y: 180 * T,
    width: 32, height: 32,
    hp: 140, maxHp: 140,
    alive: true,
    lastMeleeAttack: 0,
    meleeCooldown: 2000,
    meleeDamage: 1,
    speed: 90,
    stunned: false,
    stunUntil: 0,
    // Fire breath
    fireTimer: 0,
    fireCooldown: 10000,
    windingUp: false,
    windupStart: 0,
    windupDuration: 2000,
    fireTargetX: 0,
    fireTargetY: 0,
    firing: false,
    fireStart: 0,
    fireDuration: 500,
    fireDamage: 3,
    fireHit: false,
};

function isNearDragon() {
    if (!dragon.alive) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const dcx = dragon.x + dragon.width / 2, dcy = dragon.y + dragon.height / 2;
    return Math.hypot(pcx - dcx, pcy - dcy) < T * 1.8;
}

function pointToSegmentDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// Raycast from (ax,ay) through (bx,by) until hitting a wall tile
function raycastToWall(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return { x: ax, y: ay };
    const nx = dx / dist, ny = dy / dist;
    const step = T / 2;
    let cx = ax, cy = ay;
    for (let d = 0; d < MAP_COLS * T; d += step) {
        cx = ax + nx * d; cy = ay + ny * d;
        const col = Math.floor(cx / T), row = Math.floor(cy / T);
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return { x: cx, y: cy };
        const tile = map[row][col];
        if (tile === MOUNTAIN || tile === CAVE_WALL || tile === WALL) return { x: cx, y: cy };
    }
    return { x: cx, y: cy };
}

function updateDragon(dt) {
    // Dragon respawn timer
    if (!dragon.alive && dragonRespawnTime > 0 && gameTime >= dragonRespawnTime) {
        dragon.alive = true;
        dragon.hp = dragon.maxHp;
        dragon.x = 15 * T; dragon.y = 180 * T;
        dragon.stunned = false; dragon.windingUp = false; dragon.firing = false;
        dragon.fireTimer = 0; dragon.lastMeleeAttack = 0;
        dragonRespawnTime = -Infinity;
        addNotification('The dragon has returned!', 5000, 'rgba(255,100,100,1)', 'rgba(80,0,0,0.9)');
    }
    if (!dragon.alive) return;
    // Only active when player is in peak area
    const pcy = player.y + player.height / 2;
    const pRow = Math.floor(pcy / T);
    if (pRow < 167 || pRow > 193) return;

    const dcx = dragon.x + dragon.width / 2, dcy = dragon.y + dragon.height / 2;
    const pcx = player.x + player.width / 2;

    // Handle stun
    if (dragon.stunned) {
        if (gameTime >= dragon.stunUntil) dragon.stunned = false;
        // Still process active fire even when stunned
        if (dragon.firing) {
            if (gameTime - dragon.fireStart >= dragon.fireDuration) {
                dragon.firing = false;
            }
        }
        return;
    }

    // Fire breath system
    dragon.fireTimer += dt * 1000;
    if (!dragon.windingUp && !dragon.firing && dragon.fireTimer >= dragon.fireCooldown) {
        // Start windup — aim at player, extend fire line to wall
        dragon.windingUp = true;
        dragon.windupStart = gameTime;
        const wallHit = raycastToWall(dcx, dcy, pcx, pcy);
        dragon.fireTargetX = wallHit.x;
        dragon.fireTargetY = wallHit.y;
        dragon.fireTimer = 0;
    }

    if (dragon.windingUp) {
        if (gameTime - dragon.windupStart >= dragon.windupDuration) {
            // Fire!
            dragon.windingUp = false;
            dragon.firing = true;
            dragon.fireStart = gameTime;
            dragon.fireHit = false;
        }
    }

    if (dragon.firing) {
        // Check if player is hit by fire line
        if (!dragon.fireHit) {
            const dist = pointToSegmentDist(pcx, pcy, dcx, dcy, dragon.fireTargetX, dragon.fireTargetY);
            if (dist < T * 0.8) {
                if (shieldActive) {
                    dragon.stunned = true;
                    dragon.stunUntil = gameTime + 4000;
                    addNotification('Shield blocks the fire! Dragon stunned!', 2000, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
                } else {
                    health.value = Math.max(0, health.value - dragon.fireDamage);
                    addNotification('Dragon fire! -3 HP', 1200, 'rgba(255,100,0,1)', 'rgba(80,20,0,0.9)');
                }
                dragon.fireHit = true;
            }
        }
        if (gameTime - dragon.fireStart >= dragon.fireDuration) {
            dragon.firing = false;
        }
    }

    // Movement (don't move during windup or firing)
    if (!dragon.windingUp && !dragon.firing) {
        const dx = pcx - dcx, dy = pcy - dcy;
        const dist = Math.hypot(dx, dy);
        if (dist > 4) {
            const nx = dragon.x + (dx / dist) * dragon.speed * dt;
            const ny = dragon.y + (dy / dist) * dragon.speed * dt;
            dragon.x = Math.max(3 * T, Math.min(nx, 26 * T - dragon.width));
            dragon.y = Math.max(167 * T, Math.min(ny, 193 * T - dragon.height));
        }
    }

    // Melee attack
    if (isNearDragon()) {
        if (gameTime - dragon.lastMeleeAttack >= dragon.meleeCooldown) {
            dragon.lastMeleeAttack = gameTime;
            if (shieldActive) {
                dragon.stunned = true;
                dragon.stunUntil = gameTime + 4000;
                addNotification('Shield stuns the dragon!', 2000, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
            } else {
                health.value = Math.max(0, health.value - dragon.meleeDamage);
                addNotification('Dragon claws! -1 HP', 800, 'rgba(255,50,50,1)', 'rgba(60,0,0,0.8)');
            }
        }
    }
}

function hitDragon() {
    if (!swordPickedUp || !dragon.alive) return;
    if (!isNearDragon()) return;
    // Only in peak area
    const pRow = Math.floor((player.y + player.height / 2) / T);
    if (pRow < 167 || pRow > 193) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    playerAttackCooldown = gameTime;
    const dmg = swordDamage * getVoidMultiplier();
    dragon.hp -= dmg;
    addNotification(`Hit dragon! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (dragon.hp <= 0) {
        dragon.hp = 0;
        dragon.alive = false;
        dragonKills++;
        const gld = 15 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dragon.maxHp += 30;
        dragonRespawnTime = gameTime + DRAGON_RESPAWN_DELAY;
        if (dragonKills === 1) {
            kingSwordUnlocked = true;
            currentSword = 'kings'; swordDamage = 3;
            addNotification("King's Sword unlocked! 3 damage per hit!", 6000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
            addNotification('Build new rooms at the castle with gold!', 5000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.9)');
        }
        respawnMonsters();
        questTasks.dragonDefeated = true;
        addNotification('The dragon is slain!', 8000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
        addNotification('All monsters have respawned!', 5000, 'rgba(255,150,100,1)', 'rgba(60,20,0,0.85)');
        addNotification('Dragon returns in 2 minutes...', 4000, 'rgba(200,100,100,1)', 'rgba(60,0,0,0.8)');
    }
}

// ── Void Sentinel Combat System ─────────────────────────────

function updateVoidSentinel(dt) {
    // Respawn after death
    if (!voidSentinel.alive && voidSentinelDeathTime > 0 && gameTime >= voidSentinelDeathTime + MOB_RESPAWN_DELAY) {
        voidSentinel.hp = voidSentinel.maxHp; voidSentinel.alive = true;
        voidSentinel.x = 14 * T; voidSentinel.y = 220 * T;
        voidSentinel.aggro = false;
        voidSentinel.stunned = false; voidSentinel.stunUntil = 0;
        voidSentinel.dashState = 'idle'; voidSentinel.lastDashTime = -Infinity;
        voidSentinelDeathTime = -Infinity;
    }
    if (!voidSentinel.alive) return;
    if (!inArena) return;
    if (!voidSentinel.aggro) return;

    // Handle stun
    if (voidSentinel.stunned) {
        if (gameTime >= voidSentinel.stunUntil) voidSentinel.stunned = false;
        return;
    }

    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const vcx = voidSentinel.x + voidSentinel.width / 2, vcy = voidSentinel.y + voidSentinel.height / 2;

    // ── Dash ability ──
    if (voidSentinel.dashState === 'idle') {
        // Start windup if cooldown is ready
        if (gameTime - voidSentinel.lastDashTime >= voidSentinel.dashCooldown) {
            voidSentinel.dashState = 'windup1';
            voidSentinel.dashWindupStart = gameTime;
            // Lock onto player's current position
            voidSentinel.dashTargetX = pcx;
            voidSentinel.dashTargetY = pcy;
            voidSentinel.dashHit = false;
        }
    }

    if (voidSentinel.dashState === 'windup1') {
        // 1 second windup — sentinel stands still
        if (gameTime - voidSentinel.dashWindupStart >= 1000) {
            voidSentinel.dashState = 'dashing1';
        }
        return; // don't move during windup
    }

    if (voidSentinel.dashState === 'dashing1') {
        // Dash toward target at 500 speed
        const dx = voidSentinel.dashTargetX - vcx;
        const dy = voidSentinel.dashTargetY - vcy;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
            voidSentinel.x += (dx / dist) * voidSentinel.dashSpeed * dt;
            voidSentinel.y += (dy / dist) * voidSentinel.dashSpeed * dt;
            // Clamp inside arena
            voidSentinel.x = Math.max(4 * T, Math.min(voidSentinel.x, 25 * T - voidSentinel.width));
            voidSentinel.y = Math.max(211 * T, Math.min(voidSentinel.y, 229 * T - voidSentinel.height));
            // Check if hits player during dash
            if (!voidSentinel.dashHit && isNearVoidSentinel()) {
                voidSentinel.dashHit = true;
                if (shieldActive) {
                    voidSentinel.stunned = true;
                    voidSentinel.stunUntil = gameTime + 2000;
                    voidSentinel.dashState = 'idle';
                    voidSentinel.lastDashTime = gameTime;
                    addNotification('Shield blocks the dash!', 1500, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.8)');
                    return;
                }
                health.value = Math.max(0, health.value - 10);
                addNotification('Sentinel dash! -10 HP', 1000, 'rgba(200,100,255,1)', 'rgba(40,0,60,0.8)');
            }
        } else {
            // Reached target — start second windup
            voidSentinel.dashState = 'windup2';
            voidSentinel.dashWindupStart = gameTime;
            // Lock onto player again
            voidSentinel.dashTargetX = pcx;
            voidSentinel.dashTargetY = pcy;
            voidSentinel.dashHit = false;
        }
        return;
    }

    if (voidSentinel.dashState === 'windup2') {
        // 2 second windup
        if (gameTime - voidSentinel.dashWindupStart >= 2000) {
            voidSentinel.dashState = 'dashing2';
        }
        return;
    }

    if (voidSentinel.dashState === 'dashing2') {
        const dx = voidSentinel.dashTargetX - vcx;
        const dy = voidSentinel.dashTargetY - vcy;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
            voidSentinel.x += (dx / dist) * voidSentinel.dashSpeed * dt;
            voidSentinel.y += (dy / dist) * voidSentinel.dashSpeed * dt;
            voidSentinel.x = Math.max(4 * T, Math.min(voidSentinel.x, 25 * T - voidSentinel.width));
            voidSentinel.y = Math.max(211 * T, Math.min(voidSentinel.y, 229 * T - voidSentinel.height));
            if (!voidSentinel.dashHit && isNearVoidSentinel()) {
                voidSentinel.dashHit = true;
                if (shieldActive) {
                    voidSentinel.stunned = true;
                    voidSentinel.stunUntil = gameTime + 2000;
                    voidSentinel.dashState = 'idle';
                    voidSentinel.lastDashTime = gameTime;
                    addNotification('Shield blocks the dash!', 1500, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.8)');
                    return;
                }
                health.value = Math.max(0, health.value - 10);
                addNotification('Sentinel dash! -10 HP', 1000, 'rgba(200,100,255,1)', 'rgba(40,0,60,0.8)');
            }
        } else {
            // Done — back to normal
            voidSentinel.dashState = 'idle';
            voidSentinel.lastDashTime = gameTime;
        }
        return;
    }

    // ── Normal movement (when not dashing) ──
    const dx = pcx - vcx, dy = pcy - vcy;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
        const nx = voidSentinel.x + (dx / dist) * voidSentinel.speed * dt;
        const ny = voidSentinel.y + (dy / dist) * voidSentinel.speed * dt;
        voidSentinel.x = Math.max(4 * T, Math.min(nx, 25 * T - voidSentinel.width));
        voidSentinel.y = Math.max(211 * T, Math.min(ny, 229 * T - voidSentinel.height));
    }

    // Normal melee attack
    if (isNearVoidSentinel()) {
        if (gameTime - voidSentinel.lastAttack >= voidSentinel.attackCooldown) {
            voidSentinel.lastAttack = gameTime;
            if (shieldActive) {
                voidSentinel.stunned = true;
                voidSentinel.stunUntil = gameTime + 2000;
                addNotification('Shield stuns the Sentinel!', 1500, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.8)');
            } else {
                health.value = Math.max(0, health.value - voidSentinel.damage);
                addNotification('Void Sentinel strikes! -' + voidSentinel.damage + ' HP', 800, 'rgba(200,100,255,1)', 'rgba(40,0,60,0.8)');
            }
        }
    }
}

function hitVoidSentinel() {
    if (!swordPickedUp || !voidSentinel.alive) return;
    if (!isNearVoidSentinel()) return;
    if (!inArena) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    playerAttackCooldown = gameTime;
    // Aggro on first hit
    if (!voidSentinel.aggro) {
        voidSentinel.aggro = true;
        addNotification('The Void Sentinel awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
    }
    const dmg = swordDamage * getVoidMultiplier();
    voidSentinel.hp -= dmg;
    addNotification(`Hit Sentinel! -${dmg} HP`, 800, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.8)');
    if (voidSentinel.hp <= 0) {
        voidSentinel.hp = 0;
        voidSentinel.alive = false;
        voidSentinel.aggro = false;
        voidSentinelDeathTime = gameTime;
        voidSentinel.maxHp = 10000;
        const gld = 15 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        addNotification('The Void Sentinel is defeated!', 5000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
        if (!voidStarSwordUnlocked) {
            voidStarSwordUnlocked = true;
            currentSword = 'voidstar'; swordDamage = 7;
            addNotification('Void Star sword acquired! 7 dmg + Void Rush!', 6000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            addNotification('Press R to use Void Rush when equipped!', 5000, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.85)');
        }
    }
}

// ── Void Rush (player dash ability) ─────────────────────────

const voidRush = {
    state: 'idle', // 'idle', 'windup1', 'dashing1', 'windup2', 'dashing2'
    cooldown: 20000,
    lastUseTime: -Infinity,
    windupStart: 0,
    targetX: 0,
    targetY: 0,
    dashSpeed: 500,
    hitSet: new Set(), // tracks which enemies were hit during current dash
};

function useVoidRush() {
    if (currentSword !== 'voidstar') return;
    if (voidRush.state !== 'idle') return;
    if (gameTime - voidRush.lastUseTime < voidRush.cooldown) {
        const remaining = Math.ceil((voidRush.cooldown - (gameTime - voidRush.lastUseTime)) / 1000);
        addNotification(`Void Rush cooldown: ${remaining}s`, 1500, 'rgba(200,200,200,1)', 'rgba(40,40,40,0.8)');
        return;
    }
    // Find nearest enemy to target
    let tx = null, ty = null, bestDist = Infinity;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    function checkTarget(ex, ey, alive) {
        if (!alive) return;
        const d = Math.hypot(ex - pcx, ey - pcy);
        if (d < bestDist) { bestDist = d; tx = ex; ty = ey; }
    }
    if (inArena && voidSentinel.alive) checkTarget(voidSentinel.x + voidSentinel.width / 2, voidSentinel.y + voidSentinel.height / 2, true);
    if (spider.alive && spider.active) checkTarget(spider.x + spider.width / 2, spider.y + spider.height / 2, true);
    if (typeof seaSnake !== 'undefined' && seaSnake.alive && seaSnake.active) checkTarget(seaSnake.x + seaSnake.width / 2, seaSnake.y + seaSnake.height / 2, true);
    if (troll.alive) checkTarget(troll.x + troll.width / 2, troll.y + troll.height / 2, true);
    if (dragon.alive) checkTarget(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2, true);
    if (typeof orcs !== 'undefined') for (const orc of orcs) { if (orc.alive) checkTarget(orc.x + orc.width / 2, orc.y + orc.height / 2, true); }
    if (tx === null) {
        addNotification('No target nearby!', 1000, 'rgba(200,200,200,1)', 'rgba(40,40,40,0.8)');
        return;
    }
    voidRush.state = 'windup1';
    voidRush.windupStart = gameTime;
    voidRush.targetX = tx;
    voidRush.targetY = ty;
    voidRush.hitSet = new Set();
}

function updateVoidRush(dt) {
    if (voidRush.state === 'idle') return;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;

    if (voidRush.state === 'windup1') {
        if (gameTime - voidRush.windupStart >= 1000) {
            voidRush.state = 'dashing1';
        }
        return;
    }

    if (voidRush.state === 'dashing1') {
        const dx = voidRush.targetX - pcx, dy = voidRush.targetY - pcy;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
            player.x += (dx / dist) * voidRush.dashSpeed * dt;
            player.y += (dy / dist) * voidRush.dashSpeed * dt;
            // Hit ALL enemies along the line of fire
            voidRushHitEnemies(20);
        } else {
            // Reached target — start second windup, retarget nearest enemy
            voidRush.state = 'windup2';
            voidRush.windupStart = gameTime;
            voidRush.hitSet = new Set(); // reset hit tracking for second dash
            // Retarget
            let tx2 = null, ty2 = null, bestDist2 = Infinity;
            const px2 = player.x + player.width / 2, py2 = player.y + player.height / 2;
            function checkTarget2(ex, ey, alive, id) {
                if (!alive) return;
                const d = Math.hypot(ex - px2, ey - py2);
                if (d < bestDist2) { bestDist2 = d; tx2 = ex; ty2 = ey; }
            }
            if (inArena && voidSentinel.alive) checkTarget2(voidSentinel.x + voidSentinel.width / 2, voidSentinel.y + voidSentinel.height / 2, true);
            if (spider.alive && spider.active) checkTarget2(spider.x + spider.width / 2, spider.y + spider.height / 2, true);
            if (typeof seaSnake !== 'undefined' && seaSnake.alive && seaSnake.active) checkTarget2(seaSnake.x + seaSnake.width / 2, seaSnake.y + seaSnake.height / 2, true);
            if (troll.alive) checkTarget2(troll.x + troll.width / 2, troll.y + troll.height / 2, true);
            if (dragon.alive) checkTarget2(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2, true);
            if (typeof orcs !== 'undefined') for (const orc of orcs) { if (orc.alive) checkTarget2(orc.x + orc.width / 2, orc.y + orc.height / 2, true); }
            if (tx2 !== null) { voidRush.targetX = tx2; voidRush.targetY = ty2; }
            else { voidRush.state = 'idle'; voidRush.lastUseTime = gameTime; }
        }
        return;
    }

    if (voidRush.state === 'windup2') {
        if (gameTime - voidRush.windupStart >= 2000) {
            voidRush.state = 'dashing2';
        }
        return;
    }

    if (voidRush.state === 'dashing2') {
        const dx = voidRush.targetX - pcx, dy = voidRush.targetY - pcy;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
            player.x += (dx / dist) * voidRush.dashSpeed * dt;
            player.y += (dy / dist) * voidRush.dashSpeed * dt;
            voidRushHitEnemies(30); // 20 + 10 extra
        } else {
            voidRush.state = 'idle';
            voidRush.lastUseTime = gameTime;
        }
        return;
    }
}

// Hits any enemy near the player during dash — each enemy only hit once per dash
function voidRushHitEnemies(dmg) {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    function tryHit(enemy, range, id) {
        if (voidRush.hitSet.has(id)) return; // already hit this dash
        const ecx = enemy.x + enemy.width / 2, ecy = enemy.y + enemy.height / 2;
        if (Math.hypot(pcx - ecx, pcy - ecy) < T * range) {
            voidRush.hitSet.add(id);
            enemy.hp -= dmg;
            addNotification(`Void Rush! -${dmg} HP`, 1000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.8)');
            if (enemy.hp <= 0) enemy.hp = 0;
        }
    }
    if (inArena && voidSentinel.alive) tryHit(voidSentinel, 1.8, 'sentinel');
    if (spider.alive && spider.active) tryHit(spider, 1.5, 'spider');
    if (typeof seaSnake !== 'undefined' && seaSnake.alive && seaSnake.active) tryHit(seaSnake, 1.5, 'seasnake');
    if (troll.alive) tryHit(troll, 1.5, 'troll');
    if (dragon.alive) tryHit(dragon, 1.8, 'dragon');
    if (typeof orcs !== 'undefined') for (let i = 0; i < orcs.length; i++) { if (orcs[i].alive) tryHit(orcs[i], 1.5, 'orc' + i); }
}

// ── Void Star ──────────────────────────────────────────────

let voidStarUnlocked = false;
let voidStarActive = false;
let voidStarStartTime = 0;
let lastVoidStarTime = -Infinity;
const VOID_STAR_DURATION = 60000; // 1 minute active
const VOID_STAR_COOLDOWN = 180000; // 3 minutes

function getVoidMultiplier() {
    return voidStarActive ? 4 : 1;
}

function useVoidStar() {
    if (!voidStarUnlocked) return;
    if (voidStarActive) return;
    if (gameTime - lastVoidStarTime < VOID_STAR_COOLDOWN) {
        const remaining = Math.ceil((VOID_STAR_COOLDOWN - (gameTime - lastVoidStarTime)) / 1000);
        const mins = Math.floor(remaining / 60), secs = remaining % 60;
        addNotification(`Void Star on cooldown: ${mins}:${secs.toString().padStart(2, '0')}`, 2000, 'rgba(200,200,200,1)', 'rgba(40,40,40,0.8)');
        return;
    }
    voidStarActive = true;
    voidStarStartTime = gameTime;
    lastVoidStarTime = gameTime;
    addNotification('Void Star activated! 4x buff for 1 min!', 3000, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.9)');
}

function updateVoidStar() {
    if (voidStarActive && gameTime - voidStarStartTime >= VOID_STAR_DURATION) {
        voidStarActive = false;
        addNotification('Void Star faded.', 2000, 'rgba(150,100,200,1)', 'rgba(30,0,40,0.8)');
    }
}

// ── Wizard Heal Power ───────────────────────────────────────

let healPowerUnlocked = false;
let lastHealTime = -Infinity;
const HEAL_COOLDOWN = 300000; // 5 minutes in ms

function useHealPower() {
    if (!healPowerUnlocked) return;
    if (gameTime - lastHealTime < HEAL_COOLDOWN) {
        const remaining = Math.ceil((HEAL_COOLDOWN - (gameTime - lastHealTime)) / 1000);
        const mins = Math.floor(remaining / 60), secs = remaining % 60;
        addNotification(`Heal on cooldown: ${mins}:${secs.toString().padStart(2, '0')}`, 2000, 'rgba(200,200,200,1)', 'rgba(40,40,40,0.8)');
        return;
    }
    lastHealTime = gameTime;
    health.value = health.max;
    addNotification('Healed to full health!', 3000, 'rgba(100,255,150,1)', 'rgba(0,40,20,0.9)');
}
