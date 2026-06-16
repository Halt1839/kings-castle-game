// ── Cooking System ──────────────────────────────────────────

const cookingState = {
    active: false, startTime: 0, duration: 60000,
    meal: null, dessert: null, done: false, doneAcknowledged: false,
};

const dialog = {
    active: false, stage: null, selectedIndex: 0, meal: null, dessert: null,
};

const meals = ['Steak', 'Fish', 'Pasta'];
const desserts = ['Pumpkin Pie', 'Ice Cream', 'Cake', 'Banana Split', 'Chocolate', 'Lollipop'];

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
    const listLen = dialog.stage === 'meal' ? meals.length : dialog.stage === 'dessert' ? desserts.length : 0;
    const bw = 320, bh = Math.max(180, 100 + listLen * 26);
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

// ── Quest System ────────────────────────────────────────────

let activeQuest = 'main'; // 'main', 'void', or 'frost'
let voidQuestFoundEntrance = false;
let voidQuestNoliDefeated = false;

// Jack Frost quest
let jackFrostQuestActive = false;
let jackFrostQuestComplete = false;
let icePalaceUnlocked = false;
const jackFrostKills = {
    spider: false,
    seaSnake: false,
    orcs: false,
    troll: false,
    dragon: false,
};
const jackFrostDialog = { active: false, stage: null };

function openJackFrostDialog() {
    jackFrostDialog.active = true;
    if (jackFrostQuestComplete) {
        jackFrostDialog.stage = 'done';
    } else if (jackFrostQuestActive) {
        jackFrostDialog.stage = 'progress';
    } else {
        jackFrostDialog.stage = 'intro';
    }
}

function advanceJackFrostDialog() {
    if (jackFrostDialog.stage === 'intro') {
        jackFrostDialog.stage = 'quest_offer';
    } else if (jackFrostDialog.stage === 'quest_offer') {
        jackFrostQuestActive = true;
        activeQuest = 'frost';
        jackFrostDialog.active = false;
        addNotification('Jack Frost Quest started!', 3000, 'rgba(150,210,255,1)', 'rgba(10,30,60,0.9)');
    } else {
        jackFrostDialog.active = false;
    }
}

function checkJackFrostQuestComplete() {
    if (!jackFrostQuestActive || jackFrostQuestComplete) return;
    if (jackFrostKills.spider && jackFrostKills.seaSnake && jackFrostKills.orcs && jackFrostKills.troll && jackFrostKills.dragon) {
        jackFrostQuestComplete = true;
        snowflakeCount += 500;
        icePalaceUnlocked = true;
        addNotification('Jack Frost Quest complete! +500 Snowflakes!', 6000, 'rgba(150,220,255,1)', 'rgba(10,30,60,0.9)');
        addNotification('Ice Palace castle skin unlocked!', 6000, 'rgba(180,230,255,1)', 'rgba(20,40,70,0.9)');
    }
}

function drawJackFrostDialog() {
    if (!jackFrostDialog.active) return;
    const bw = 360, bh = 150;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(10,20,40,0.94)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#66bbff'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeStyle = '#4488cc'; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#88ddff';
    ctx.fillText('Jack Frost', bx + 16, by + 14);

    ctx.font = '13px monospace'; ctx.fillStyle = '#ddeeff';
    if (jackFrostDialog.stage === 'intro') {
        ctx.fillText('"The evil Ice Dragon has taken over"', bx + 16, by + 44);
        ctx.fillText('"the land! Every monster has been"', bx + 16, by + 64);
        ctx.fillText('"corrupted by its icy power..."', bx + 16, by + 84);
    } else if (jackFrostDialog.stage === 'quest_offer') {
        ctx.fillText('"Defeat every monster on your road"', bx + 16, by + 44);
        ctx.fillText('"to break the curse. Slay them all!"', bx + 16, by + 64);
        ctx.fillText('"I will reward you handsomely."', bx + 16, by + 84);
    } else if (jackFrostDialog.stage === 'progress') {
        const count = [jackFrostKills.spider, jackFrostKills.seaSnake, jackFrostKills.orcs, jackFrostKills.troll, jackFrostKills.dragon].filter(Boolean).length;
        ctx.fillText(`"Keep going! ${count}/5 monsters slain."`, bx + 16, by + 44);
        ctx.fillText('"Rid the land of every last one!"', bx + 16, by + 64);
    } else if (jackFrostDialog.stage === 'done') {
        ctx.fillText('"You have freed the land from"', bx + 16, by + 44);
        ctx.fillText('"the icy curse! A true hero!"', bx + 16, by + 64);
        ctx.fillText('"Enjoy the Ice Palace, friend."', bx + 16, by + 84);
    }

    ctx.font = '11px monospace'; ctx.fillStyle = '#88aacc';
    ctx.fillText(`${kl('E')} to continue`, bx + 16, by + bh - 24);
}

// ── Savior Quest (alien camp leader, future world) ──────────
let saviorQuestActive = false;
let saviorQuestComplete = false;
const saviorKills = {
    spider: false,
    seaSnake: false,
    orcs: false,
    troll: false,
    dragon: false,
};
const alienDialog = { active: false, stage: null };

function openAlienDialog() {
    alienDialog.active = true;
    if (saviorQuestComplete) alienDialog.stage = 'done';
    else if (saviorQuestActive) alienDialog.stage = 'progress';
    else alienDialog.stage = 'intro';
    // Alien sics robot orcs on the player every visit (only if none alive).
    spawnSaviorOrcs();
}

function advanceAlienDialog() {
    if (alienDialog.stage === 'intro') {
        alienDialog.stage = 'plea';
    } else if (alienDialog.stage === 'plea') {
        alienDialog.stage = 'quest_offer';
    } else if (alienDialog.stage === 'quest_offer') {
        saviorQuestActive = true;
        activeQuest = 'savior';
        alienDialog.active = false;
        addNotification('Savior Quest started! Destroy the robots!', 4000, 'rgba(140,255,180,1)', 'rgba(10,40,20,0.9)');
        spawnSaviorOrcs();
    } else {
        alienDialog.active = false;
    }
}

// Summon a wave of robot orcs into the spaceport at the alien's command.
// The alien can call them at will — every visit while the quest is active
// brings another wave (as long as the previous one has been cleared).
function spawnSaviorOrcs() {
    if (typeof orcs !== 'undefined' && orcs.some(o => o.alive)) return;
    spawnOrcs('camp');
    orcSiege.active = true; orcSiege.complete = false;
    orcSiege.location = 'camp';
    addNotification('Robot orcs converge on the spaceport!', 4000, 'rgba(255,150,150,1)', 'rgba(60,0,0,0.9)');
}

function checkSaviorQuestComplete() {
    if (!saviorQuestActive || saviorQuestComplete) return;
    if (saviorKills.spider && saviorKills.seaSnake && saviorKills.orcs && saviorKills.troll && saviorKills.dragon) {
        saviorQuestComplete = true;
        saberUnlocked = true;
        infinitePortalUnlocked = true;
        futureDesignUnlocked = true;
        currentSword = 'saber';
        swordDamage = SWORD_DMG_MAP.saber;
        addNotification('Savior Quest complete!', 6000, 'rgba(140,255,180,1)', 'rgba(10,40,20,0.9)');
        addNotification('Saber unlocked! 12 dmg + Throw (press Y).', 6000, 'rgba(255,80,80,1)', 'rgba(60,0,0,0.9)');
        addNotification('Infinite Portal unlocked! Press L to place.', 6000, 'rgba(220,150,255,1)', 'rgba(40,10,60,0.9)');
        addNotification('Future castle design unlocked!', 6000, 'rgba(120,220,255,1)', 'rgba(10,30,50,0.9)');
    }
}

function drawAlienDialog() {
    if (!alienDialog.active) return;
    const bw = 380, bh = 160;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(8,20,12,0.94)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#7af0a0'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeStyle = '#4ac070'; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#9affc0';
    ctx.fillText('Alien Commander', bx + 16, by + 14);

    ctx.font = '13px monospace'; ctx.fillStyle = '#dfffdf';
    if (alienDialog.stage === 'intro') {
        ctx.fillText('"Greetings, traveler from the past."', bx + 16, by + 44);
        ctx.fillText('"I am the last of my kind on this"', bx + 16, by + 64);
        ctx.fillText('"world. The machines came... and"', bx + 16, by + 84);
        ctx.fillText('"now they rule everything."', bx + 16, by + 104);
    } else if (alienDialog.stage === 'plea') {
        ctx.fillText('"The robots have taken over the"', bx + 16, by + 44);
        ctx.fillText('"world. They corrupt every beast,"', bx + 16, by + 64);
        ctx.fillText('"every creature. No one can stop"', bx + 16, by + 84);
        ctx.fillText('"them — no one but you."', bx + 16, by + 104);
    } else if (alienDialog.stage === 'quest_offer') {
        ctx.fillText('"Destroy them all — the spider,"', bx + 16, by + 44);
        ctx.fillText('"the snake, the orc patrols,"', bx + 16, by + 64);
        ctx.fillText('"the troll, the dragon. Be our"', bx + 16, by + 84);
        ctx.fillText('"Savior. Two great prizes await."', bx + 16, by + 104);
    } else if (alienDialog.stage === 'progress') {
        const count = [saviorKills.spider, saviorKills.seaSnake, saviorKills.orcs, saviorKills.troll, saviorKills.dragon].filter(Boolean).length;
        ctx.fillText(`"You have destroyed ${count}/5 robots."`, bx + 16, by + 44);
        ctx.fillText('"Hunt down the rest! The machines"', bx + 16, by + 64);
        ctx.fillText('"must all be dismantled."', bx + 16, by + 84);
    } else if (alienDialog.stage === 'done') {
        ctx.fillText('"You did it! The robots fall silent."', bx + 16, by + 44);
        ctx.fillText('"You are our Savior, hero of two"', bx + 16, by + 64);
        ctx.fillText('"timelines. Your prizes await..."', bx + 16, by + 84);
    }

    ctx.font = '11px monospace'; ctx.fillStyle = '#7ac88a';
    ctx.fillText(`${kl('E')} to continue`, bx + 16, by + bh - 24);
}

function drawSaviorQuestTasks() {
    const tx = canvas.width - 250, ty = 54;
    const tasks = [
        { label: 'Destroy Robot Spider', done: saviorKills.spider },
        { label: 'Destroy Robot Snake', done: saviorKills.seaSnake },
        { label: 'Destroy Robot Orcs', done: saviorKills.orcs },
        { label: 'Destroy Robot Troll', done: saviorKills.troll },
        { label: 'Destroy Robot Dragon', done: saviorKills.dragon },
    ];
    const panelH = 40 + tasks.length * 22 + (saviorQuestComplete ? 26 : 0);
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(tx - 8, ty - 4, 240, panelH);
    ctx.strokeStyle = '#7af0a0'; ctx.lineWidth = 1;
    ctx.strokeRect(tx - 8, ty - 4, 240, panelH);

    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#9affc0';
    ctx.fillText('Savior Quest', tx, ty);

    ctx.font = '12px monospace';
    for (let i = 0; i < tasks.length; i++) {
        const iy = ty + 22 + i * 22;
        const check = tasks[i].done ? '[x]' : '[ ]';
        ctx.fillStyle = tasks[i].done ? '#4CAF50' : '#aaa';
        ctx.fillText(`${check} ${tasks[i].label}`, tx + 4, iy);
    }

    if (saviorQuestComplete) {
        ctx.font = 'bold 13px monospace'; ctx.fillStyle = '#4CAF50';
        ctx.fillText('Quest complete!', tx + 4, ty + 22 + tasks.length * 22 + 4);
    }
}

function drawFrostQuestTasks() {
    const tx = canvas.width - 250, ty = 54;
    const tasks = [
        { label: 'Defeat the spider', done: jackFrostKills.spider },
        { label: 'Defeat the sea snake', done: jackFrostKills.seaSnake },
        { label: 'Defeat the orcs', done: jackFrostKills.orcs },
        { label: 'Defeat the troll', done: jackFrostKills.troll },
        { label: 'Defeat the Ice Dragon', done: jackFrostKills.dragon },
    ];

    const panelH = 40 + tasks.length * 22 + (jackFrostQuestComplete ? 26 : 0);
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(tx - 8, ty - 4, 240, panelH);
    ctx.strokeStyle = '#66bbff'; ctx.lineWidth = 1;
    ctx.strokeRect(tx - 8, ty - 4, 240, panelH);

    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#88ddff';
    ctx.fillText('Jack Frost Quest', tx, ty);

    ctx.font = '12px monospace';
    for (let i = 0; i < tasks.length; i++) {
        const iy = ty + 22 + i * 22;
        const check = tasks[i].done ? '[x]' : '[ ]';
        ctx.fillStyle = tasks[i].done ? '#4CAF50' : '#aaa';
        ctx.fillText(`${check} ${tasks[i].label}`, tx + 4, iy);
    }

    if (jackFrostQuestComplete) {
        ctx.font = 'bold 13px monospace'; ctx.fillStyle = '#4CAF50';
        ctx.fillText('Quest complete!', tx + 4, ty + 22 + tasks.length * 22 + 4);
    }
}

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
    if (activeQuest === 'savior' && saviorQuestActive) {
        drawSaviorQuestTasks();
        return;
    }
    if (activeQuest === 'frost' && jackFrostQuestActive) {
        drawFrostQuestTasks();
        return;
    }
    if (activeQuest === 'void' && dragonKills > 0) {
        drawVoidQuestTasks();
        return;
    }
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

function drawVoidQuestTasks() {
    const tx = canvas.width - 250, ty = 54;
    const tasks = [
        { label: 'Find the secret entrance', done: voidQuestFoundEntrance },
    ];
    if (voidQuestFoundEntrance) {
        tasks.push({ label: 'Defeat Noli', done: voidQuestNoliDefeated });
    }

    const allDone = voidQuestFoundEntrance && voidQuestNoliDefeated;
    const panelH = 40 + tasks.length * 22 + (allDone ? 26 : 0);

    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(tx - 8, ty - 4, 240, panelH);
    ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 1;
    ctx.strokeRect(tx - 8, ty - 4, 240, panelH);

    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#C084FC';
    ctx.fillText('Void Quest', tx, ty);

    ctx.font = '12px monospace';
    for (let i = 0; i < tasks.length; i++) {
        const iy = ty + 22 + i * 22;
        const check = tasks[i].done ? '[x]' : '[ ]';
        ctx.fillStyle = tasks[i].done ? '#4CAF50' : '#aaa';
        ctx.fillText(`${check} ${tasks[i].label}`, tx + 4, iy);
    }

    if (allDone) {
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
let designRoomBuilt = false;
let currentDesign = 'default'; // 'default', 'gold', 'void', 'ice', 'lava', 'future'
let goldDesignUnlocked = false;
let voidDesignUnlocked = false;
let lavaDesignUnlocked = false;
let futureDesignUnlocked = false;
let guestRoomBuilt = false;
// ── Dagger System ────────────────────────────────────────────
let daggerUnlocked = false;
const daggerStab = {
    active: false,
    startTime: 0,
    startX: 0,
    startY: 0,
    targetMob: null,
    mobStartX: 0,
    playerSideX: 0, // -1 = player left of mob, 1 = right
    cooldownUntil: 0,
};
const DAGGER_STAB_DURATION = 500;
const DAGGER_STAB_COOLDOWN = 800;
const DAGGER_STAB_RANGE = 80;
let stabFrontDmg = 5;
let stabBackDmg = 8;

// Ability invincibility — active during void rush/stab + 1 second after
let abilityInvincibleUntil = 0;
const ABILITY_INVINCIBLE_GRACE = 1000; // 1 second after ability ends
function isAbilityInvincible() {
    return daggerStab.active || maceSpin.active || ethanSpin.active || sashaSpin.active || (voidRush.state !== 'idle') || gameTime < abilityInvincibleUntil;
}

function findNearestStabTarget() {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    let nearest = null, nearestDist = Infinity;
    const checkMob = (mob) => {
        if (!mob.alive) return;
        const d = Math.hypot(pcx - (mob.x + mob.width / 2), pcy - (mob.y + mob.height / 2));
        if (d < DAGGER_STAB_RANGE && d < nearestDist) { nearest = mob; nearestDist = d; }
    };
    if (spider.active) checkMob(spider);
    if (seaSnake.active) checkMob(seaSnake);
    for (const orc of orcs) checkMob(orc);
    if (troll.alive) checkMob(troll);
    if (dragon.alive) checkMob(dragon);
    if (inArena && voidSentinel.alive) checkMob(voidSentinel);
    if (inLavaZone && lavaMonster.alive) checkMob(lavaMonster);
    return nearest;
}

function startDaggerStab(mob) {
    const pcx = player.x + player.width / 2;
    const mobCX = mob.x + mob.width / 2;
    daggerStab.active = true;
    daggerStab.startTime = gameTime;
    daggerStab.startX = player.x;
    daggerStab.startY = player.y;
    daggerStab.targetMob = mob;
    daggerStab.mobStartX = mob.x;
    daggerStab.playerSideX = pcx < mobCX ? -1 : 1;
    daggerStab.cooldownUntil = gameTime + DAGGER_STAB_DURATION + DAGGER_STAB_COOLDOWN;
}

function updateDaggerStab() {
    if (!daggerStab.active) return;
    const elapsed = gameTime - daggerStab.startTime;
    const mob = daggerStab.targetMob;
    if (!mob || !mob.alive) { daggerStab.active = false; return; }
    if (elapsed >= DAGGER_STAB_DURATION) {
        completeDaggerStab();
        return;
    }
    const t = elapsed / DAGGER_STAB_DURATION;
    const mobCX = mob.x + mob.width / 2, mobCY = mob.y + mob.height / 2;
    const startCX = daggerStab.startX + player.width / 2, startCY = daggerStab.startY + player.height / 2;
    const dx = mobCX - startCX, dy = mobCY - startCY;
    const dist = Math.hypot(dx, dy);
    // Stop one tile away from mob center so player doesn't overlap
    const stopDist = Math.max(0, dist - T);
    const targetX = daggerStab.startX + (stopDist / dist) * dx;
    const targetY = daggerStab.startY + (stopDist / dist) * dy;
    player.x = daggerStab.startX + (targetX - daggerStab.startX) * t;
    player.y = daggerStab.startY + (targetY - daggerStab.startY) * t;
}

function completeDaggerStab() {
    const mob = daggerStab.targetMob;
    daggerStab.active = false;
    abilityInvincibleUntil = gameTime + ABILITY_INVINCIBLE_GRACE;
    if (!mob || !mob.alive) return;
    // Aggro Noli on first hit
    if (mob === voidSentinel && !voidSentinel.aggro) {
        voidSentinel.aggro = true;
        addNotification('Noli awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
    }
    if (mob === lavaMonster && !lavaMonster.aggro) {
        lavaMonster.aggro = true;
        addNotification('The Lava Monster awakens!', 3000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
    }
    const pcx = player.x + player.width / 2;
    const mobCX = mob.x + mob.width / 2;
    const currentSide = pcx < mobCX ? -1 : 1;
    const isBackstab = (currentSide === daggerStab.playerSideX);
    const dmg = (isBackstab ? stabBackDmg : stabFrontDmg) * getRingMultiplier();
    swordSwingTime = performance.now();
    mob.hp -= dmg;
    addNotification(isBackstab ? `Backstab! -${dmg} HP` : `Dagger stab! -${dmg} HP`, 1000,
        isBackstab ? 'rgba(255,100,50,1)' : 'rgba(255,180,50,1)',
        isBackstab ? 'rgba(80,20,0,0.9)' : 'rgba(60,30,0,0.8)');
    if (mob.hp <= 0) { mob.hp = 0; handleStabKill(mob); }
}

function handleStabKill(mob) {
    if (mob === spider) {
        spider.alive = false; spiderDeathTime = gameTime; spider.maxHp += 10; addWeaponXP(25);
        const gld = 3 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        const gc = Math.floor((spider.x + spider.width / 2) / T), gr = Math.floor((spider.y + spider.height / 2) / T);
        map[gr][gc] = GOLD_BLOCK;
        questTasks.spiderDefeated = true; checkAllTasks();
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.spider = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.spider = true; checkSaviorQuestComplete(); }
        addNotification('The giant spider is defeated! It dropped a gold block!', 5000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
    } else if (mob === seaSnake) {
        seaSnake.alive = false; seaSnakeDeathTime = gameTime; seaSnake.maxHp += 10; addWeaponXP(30);
        const gld = 5 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        health.max = Math.max(health.max, 15);
        if (dragonKills === 0) health.value = health.max;
        questTasks.seaSnakeDefeated = true;
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.seaSnake = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.seaSnake = true; checkSaviorQuestComplete(); }
        addNotification('The sea snake is defeated!', 5000, 'rgba(100,255,150,1)', 'rgba(0,40,20,0.9)');
        if (dragonKills === 0) addNotification(`Health increased to ${health.max}/${health.max}!`, 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.85)');
    } else if (mob === troll) {
        troll.alive = false; trollDeathTime = gameTime; troll.maxHp += 10; addWeaponXP(45);
        const gld = 8 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        health.max = Math.max(health.max, 30);
        if (dragonKills === 0) health.value = health.max;
        questTasks.trollDefeated = true;
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.troll = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.troll = true; checkSaviorQuestComplete(); }
        addNotification('The mountain troll is defeated!', 5000, 'rgba(100,255,150,1)', 'rgba(0,40,20,0.9)');
        if (dragonKills === 0) addNotification('Health increased to 30/30!', 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.85)');
        addNotification('A secret passage to the peak opens!', 5000, 'rgba(255,200,100,1)', 'rgba(60,40,0,0.9)');
        openPeakPassage();
    } else if (mob === dragon) {
        dragon.alive = false; dragonKills++; addWeaponXP(100);
        const gld = 15 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        dragon.maxHp += 30; dragonRespawnTime = gameTime + DRAGON_RESPAWN_DELAY;
        if (dragonKills === 1) {
            kingSwordUnlocked = true; currentSword = 'kings'; swordDamage = 3;
            addNotification("King's Sword unlocked! 3 damage per hit!", 6000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
            addNotification('Build new rooms at the castle with gold!', 5000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.9)');
        }
        if (!goldDesignUnlocked) { goldDesignUnlocked = true; addNotification('Gold design unlocked!', 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)'); }
        respawnMonsters();
        questTasks.dragonDefeated = true;
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.dragon = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.dragon = true; checkSaviorQuestComplete(); }
        addNotification('The dragon is slain!', 8000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
        addNotification('All monsters have respawned!', 5000, 'rgba(255,150,100,1)', 'rgba(60,20,0,0.85)');
        addNotification('Dragon returns in 2 minutes...', 4000, 'rgba(200,100,100,1)', 'rgba(60,0,0,0.8)');
    } else if (mob === voidSentinel) {
        voidSentinel.alive = false; voidSentinel.aggro = false; voidSentinelDeathTime = gameTime;
        voidSentinel.maxHp = 2500; addWeaponXP(1000);
        const gld = 15 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        if (!voidQuestNoliDefeated) voidQuestNoliDefeated = true;
        addNotification('Noli is defeated!', 5000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
        if (!voidStarSwordUnlocked) {
            voidStarSwordUnlocked = true; currentSword = 'voidstar'; swordDamage = 7;
            addNotification('Void Star sword acquired! 7 dmg + Void Rush!', 6000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            addNotification('Press R to use Void Rush when equipped!', 5000, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.85)');
        }
        if (!voidDesignUnlocked) { voidDesignUnlocked = true; addNotification('Void design unlocked!', 4000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)'); }
        dropSnowflakes(); tempt();
    } else if (mob === lavaMonster) {
        lavaMonster.alive = false; lavaMonsterDeathTime = gameTime; lavaMonster.trail = [];
        addWeaponXP(150);
        const gld = 20 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        if (!firemaceUnlocked) {
            firemaceUnlocked = true; currentSword = 'firemace'; swordDamage = 10;
            addNotification('Firemace unlocked! 10 damage per hit!', 8000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
        }
        if (!lavaDesignUnlocked) { lavaDesignUnlocked = true; addNotification('Lava design unlocked!', 4000, 'rgba(255,120,30,1)', 'rgba(80,20,0,0.9)'); }
        addNotification('The Lava Monster is defeated!', 5000, 'rgba(255,200,50,1)', 'rgba(80,40,0,0.9)');
    } else {
        mob.alive = false; addWeaponXP(10);
        const gld = 2 * getVoidMultiplier(); goldCount += gld;
        addNotification(`+${gld} Gold`, 1200, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
    }
}

// ── Mace Spin Ability ────────────────────────────────────────
const maceSpin = {
    active: false,
    startTime: 0,
    cooldownUntil: 0,
    hitSet: new Set(),
};
const MACE_SPIN_DURATION = 600;
const MACE_SPIN_COOLDOWN = 10000;
const MACE_SPIN_RANGE = 64;
let maceSpinDmg = 12;

function useMaceSpin() {
    if (currentSword !== 'firemace') return;
    if (maceSpin.active) return;
    if (gameTime < maceSpin.cooldownUntil) {
        const remaining = Math.ceil((maceSpin.cooldownUntil - gameTime) / 1000);
        addNotification(`Mace Spin cooldown: ${remaining}s`, 1500, 'rgba(200,200,200,1)', 'rgba(40,40,40,0.8)');
        return;
    }
    maceSpin.active = true;
    maceSpin.startTime = gameTime;
    maceSpin.cooldownUntil = gameTime + MACE_SPIN_DURATION + MACE_SPIN_COOLDOWN;
    maceSpin.hitSet = new Set();
    abilityInvincibleUntil = gameTime + MACE_SPIN_DURATION + ABILITY_INVINCIBLE_GRACE;
    provokeOrcCircle(null); // rally the defense ring
}

function updateMaceSpin() {
    if (!maceSpin.active) return;
    const elapsed = gameTime - maceSpin.startTime;
    if (elapsed >= MACE_SPIN_DURATION) {
        maceSpin.active = false;
        return;
    }
    // Hit all enemies in range once
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    function spinHit(mob, id) {
        if (!mob.alive || maceSpin.hitSet.has(id)) return;
        const dx = (mob.x + mob.width / 2) - pcx, dy = (mob.y + mob.height / 2) - pcy;
        if (Math.hypot(dx, dy) < MACE_SPIN_RANGE + mob.width / 2) {
            maceSpin.hitSet.add(id);
            const spinDmg = maceSpinDmg * getRingMultiplier();
            mob.hp -= spinDmg;
            addNotification(`Mace Spin! -${spinDmg} HP`, 1000, 'rgba(255,120,30,1)', 'rgba(80,20,0,0.9)');
            if (mob === voidSentinel && !voidSentinel.aggro) {
                voidSentinel.aggro = true;
                addNotification('Noli awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            }
            if (mob === lavaMonster && !lavaMonster.aggro) {
                lavaMonster.aggro = true;
                addNotification('The Lava Monster awakens!', 3000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
            }
            if (mob.hp <= 0) { mob.hp = 0; handleStabKill(mob); }
        }
    }
    if (spider.active) spinHit(spider, 'spider');
    if (seaSnake.active) spinHit(seaSnake, 'seaSnake');
    for (let i = 0; i < orcs.length; i++) spinHit(orcs[i], 'orc' + i);
    if (troll.alive) spinHit(troll, 'troll');
    if (dragon.alive) spinHit(dragon, 'dragon');
    if (inArena && voidSentinel.alive) spinHit(voidSentinel, 'voidSentinel');
    if (inLavaZone && lavaMonster.alive) spinHit(lavaMonster, 'lavaMonster');
}

// ── Ethan Spin Ability (Ethanblade) ──────────────────────────
const ethanSpin = {
    active: false,
    startTime: 0,
    cooldownUntil: 0,
    hitSet: new Set(),
};
const ETHAN_SPIN_DURATION = 700;
const ETHAN_SPIN_COOLDOWN = 8000;
const ETHAN_SPIN_RANGE = 80;
let ethanSpinDmg = 50;

function useEthanSpin() {
    if (currentSword !== 'ethanblade') return;
    if (ethanSpin.active) return;
    if (gameTime < ethanSpin.cooldownUntil) {
        const remaining = Math.ceil((ethanSpin.cooldownUntil - gameTime) / 1000);
        addNotification(`Ethan Spin cooldown: ${remaining}s`, 1500, 'rgba(60,220,90,1)', 'rgba(0,50,10,0.8)');
        return;
    }
    ethanSpin.active = true;
    ethanSpin.startTime = gameTime;
    ethanSpin.cooldownUntil = gameTime + ETHAN_SPIN_DURATION + ETHAN_SPIN_COOLDOWN;
    ethanSpin.hitSet = new Set();
    abilityInvincibleUntil = gameTime + ETHAN_SPIN_DURATION + ABILITY_INVINCIBLE_GRACE;
    provokeOrcCircle(null); // rally the defense ring
}

function updateEthanSpin() {
    if (!ethanSpin.active) return;
    const elapsed = gameTime - ethanSpin.startTime;
    if (elapsed >= ETHAN_SPIN_DURATION) {
        ethanSpin.active = false;
        return;
    }
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    function spinHit(mob, id) {
        if (!mob.alive || ethanSpin.hitSet.has(id)) return;
        const dx = (mob.x + mob.width / 2) - pcx, dy = (mob.y + mob.height / 2) - pcy;
        if (Math.hypot(dx, dy) < ETHAN_SPIN_RANGE + mob.width / 2) {
            ethanSpin.hitSet.add(id);
            const spinDmg = ethanSpinDmg * getRingMultiplier();
            mob.hp -= spinDmg;
            addNotification(`Ethan Spin! -${spinDmg} HP`, 1000, 'rgba(60,220,90,1)', 'rgba(0,50,10,0.9)');
            if (mob === voidSentinel && !voidSentinel.aggro) {
                voidSentinel.aggro = true;
                addNotification('Noli awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            }
            if (mob === lavaMonster && !lavaMonster.aggro) {
                lavaMonster.aggro = true;
                addNotification('The Lava Monster awakens!', 3000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
            }
            if (mob.hp <= 0) { mob.hp = 0; handleStabKill(mob); }
        }
    }
    if (spider.active) spinHit(spider, 'spider');
    if (seaSnake.active) spinHit(seaSnake, 'seaSnake');
    for (let i = 0; i < orcs.length; i++) spinHit(orcs[i], 'orc' + i);
    if (troll.alive) spinHit(troll, 'troll');
    if (dragon.alive) spinHit(dragon, 'dragon');
    if (inArena && voidSentinel.alive) spinHit(voidSentinel, 'voidSentinel');
    if (inLavaZone && lavaMonster.alive) spinHit(lavaMonster, 'lavaMonster');
}

// ── Sasha Spin Ability (Sashablade) ──────────────────────────
const sashaSpin = {
    active: false,
    startTime: 0,
    cooldownUntil: 0,
    hitSet: new Set(),
};
const SASHA_SPIN_DURATION = 700;
const SASHA_SPIN_COOLDOWN = 8000;
const SASHA_SPIN_RANGE = 80;
let sashaSpinDmg = 50;

function useSashaSpin() {
    if (currentSword !== 'sashablade') return;
    if (sashaSpin.active) return;
    if (gameTime < sashaSpin.cooldownUntil) {
        const remaining = Math.ceil((sashaSpin.cooldownUntil - gameTime) / 1000);
        addNotification(`Sasha Spin cooldown: ${remaining}s`, 1500, 'rgba(255,60,60,1)', 'rgba(50,0,0,0.8)');
        return;
    }
    sashaSpin.active = true;
    sashaSpin.startTime = gameTime;
    sashaSpin.cooldownUntil = gameTime + SASHA_SPIN_DURATION + SASHA_SPIN_COOLDOWN;
    sashaSpin.hitSet = new Set();
    abilityInvincibleUntil = gameTime + SASHA_SPIN_DURATION + ABILITY_INVINCIBLE_GRACE;
    provokeOrcCircle(null); // rally the defense ring
}

function updateSashaSpin() {
    if (!sashaSpin.active) return;
    const elapsed = gameTime - sashaSpin.startTime;
    if (elapsed >= SASHA_SPIN_DURATION) {
        sashaSpin.active = false;
        return;
    }
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    function spinHit(mob, id) {
        if (!mob.alive || sashaSpin.hitSet.has(id)) return;
        const dx = (mob.x + mob.width / 2) - pcx, dy = (mob.y + mob.height / 2) - pcy;
        if (Math.hypot(dx, dy) < SASHA_SPIN_RANGE + mob.width / 2) {
            sashaSpin.hitSet.add(id);
            const spinDmg = sashaSpinDmg * getRingMultiplier();
            mob.hp -= spinDmg;
            addNotification(`Sasha Spin! -${spinDmg} HP`, 1000, 'rgba(255,60,60,1)', 'rgba(50,0,0,0.9)');
            if (mob === voidSentinel && !voidSentinel.aggro) {
                voidSentinel.aggro = true;
                addNotification('Noli awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            }
            if (mob === lavaMonster && !lavaMonster.aggro) {
                lavaMonster.aggro = true;
                addNotification('The Lava Monster awakens!', 3000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
            }
            if (mob.hp <= 0) { mob.hp = 0; handleStabKill(mob); }
        }
    }
    if (spider.active) spinHit(spider, 'spider');
    if (seaSnake.active) spinHit(seaSnake, 'seaSnake');
    for (let i = 0; i < orcs.length; i++) spinHit(orcs[i], 'orc' + i);
    if (troll.alive) spinHit(troll, 'troll');
    if (dragon.alive) spinHit(dragon, 'dragon');
    if (inArena && voidSentinel.alive) spinHit(voidSentinel, 'voidSentinel');
    if (inLavaZone && lavaMonster.alive) spinHit(lavaMonster, 'lavaMonster');
}

// ── Saber (Savior Quest reward) ──────────────────────────────
let saberUnlocked = false;
let infinitePortalUnlocked = false;
const SABER_THROW_COOLDOWN = 10 * 1000;
const SABER_THROW_SPEED = 380;       // px/sec
const SABER_THROW_RANGE = 220;       // px before it reverses
const SABER_THROW_DMG = 15;
const SABER_THROW_HIT_RADIUS = 18;
const saberThrow = {
    active: false,
    x: 0, y: 0,
    dx: 0, dy: 0,
    travelled: 0,
    returning: false,
    cooldownUntil: 0,
    hitSet: null,
    spin: 0,
};

function startSaberThrow() {
    if (currentSword !== 'saber' || !saberUnlocked) return;
    if (saberThrow.active) return;
    if (gameTime < saberThrow.cooldownUntil) {
        const remaining = Math.ceil((saberThrow.cooldownUntil - gameTime) / 1000);
        addNotification(`Saber Throw cooldown: ${remaining}s`, 1500, 'rgba(255,150,150,1)', 'rgba(60,0,0,0.8)');
        return;
    }
    let fx = 0, fy = 0;
    if (playerFacing === 'north') fy = -1;
    else if (playerFacing === 'south') fy = 1;
    else if (playerFacing === 'east') fx = 1;
    else fx = -1;
    saberThrow.active = true;
    saberThrow.x = player.x + player.width / 2;
    saberThrow.y = player.y + player.height / 2;
    saberThrow.dx = fx; saberThrow.dy = fy;
    saberThrow.travelled = 0;
    saberThrow.returning = false;
    saberThrow.hitSet = new Set();
    saberThrow.spin = 0;
    saberThrow.cooldownUntil = gameTime + SABER_THROW_COOLDOWN;
    addNotification('Saber thrown!', 1000, 'rgba(255,80,80,1)', 'rgba(60,0,0,0.8)');
}

function _saberCheckMobHit(mob) {
    if (!mob || !mob.alive) return;
    if (mob.active === false) return;
    if (saberThrow.hitSet.has(mob)) return;
    const mcx = mob.x + (mob.width || 16) / 2;
    const mcy = mob.y + (mob.height || 16) / 2;
    const d = Math.hypot(saberThrow.x - mcx, saberThrow.y - mcy);
    if (d < SABER_THROW_HIT_RADIUS) {
        saberThrow.hitSet.add(mob);
        mob.hp = Math.max(0, mob.hp - SABER_THROW_DMG * getRingMultiplier());
        if (mob.hp <= 0) handleStabKill(mob);
    }
}

function updateSaberThrow() {
    if (!saberThrow.active) return;
    const dt = 1 / 60; // approximate; movement scaled per-frame
    const stepX = saberThrow.dx * SABER_THROW_SPEED * dt;
    const stepY = saberThrow.dy * SABER_THROW_SPEED * dt;
    if (saberThrow.returning) {
        // Home back to player
        const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
        const vx = pcx - saberThrow.x, vy = pcy - saberThrow.y;
        const dist = Math.hypot(vx, vy);
        if (dist < 12) { saberThrow.active = false; return; }
        const nx = vx / dist, ny = vy / dist;
        saberThrow.x += nx * SABER_THROW_SPEED * dt;
        saberThrow.y += ny * SABER_THROW_SPEED * dt;
    } else {
        saberThrow.x += stepX;
        saberThrow.y += stepY;
        saberThrow.travelled += Math.hypot(stepX, stepY);
        if (saberThrow.travelled >= SABER_THROW_RANGE) {
            saberThrow.returning = true;
            saberThrow.hitSet = new Set(); // allow second pass damage on return
        }
    }
    saberThrow.spin += 0.6;
    // Hit detection
    if (typeof spider !== 'undefined') _saberCheckMobHit(spider);
    if (typeof seaSnake !== 'undefined') _saberCheckMobHit(seaSnake);
    if (typeof troll !== 'undefined') _saberCheckMobHit(troll);
    if (typeof dragon !== 'undefined') _saberCheckMobHit(dragon);
    if (typeof voidSentinel !== 'undefined') _saberCheckMobHit(voidSentinel);
    if (typeof lavaMonster !== 'undefined') _saberCheckMobHit(lavaMonster);
    if (typeof orcs !== 'undefined') for (const orc of orcs) _saberCheckMobHit(orc);
}

function drawSaberThrow(camX, camY) {
    if (!saberThrow.active) return;
    const sc = SABER_BLADE_COLORS[saberMasterySkin] || SABER_BLADE_COLORS.default;
    const x = saberThrow.x - camX, y = saberThrow.y - camY;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(saberThrow.spin);
    // Hilt
    ctx.fillStyle = '#2a2a2e'; ctx.fillRect(-2, -1, 4, 6);
    ctx.fillStyle = '#5a5a62'; ctx.fillRect(-2, -1, 4, 1);
    // Glow halo
    const p = 0.6 + 0.4 * Math.sin(performance.now() / 80);
    ctx.fillStyle = sc.glow.replace('X', (0.45 * p).toFixed(3));
    ctx.beginPath(); ctx.arc(0, -8, 12, 0, Math.PI * 2); ctx.fill();
    // Blade
    ctx.fillStyle = sc.blade; ctx.fillRect(-1.5, -20, 3, 18);
    ctx.fillStyle = sc.core; ctx.fillRect(-0.6, -20, 1.2, 18);
    ctx.restore();
}

// ── Infinite Portal (Savior Quest reward) ────────────────────
function tryInfinitePortalPlace() {
    if (!infinitePortalUnlocked) return;
    if (portal.active) {
        addNotification('A portal is already active!', 1500, 'rgba(220,150,255,1)', 'rgba(40,10,60,0.85)');
        return;
    }
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const pCol = Math.floor(pcx / T), pRow = Math.floor(pcy / T);
    let col = pCol - 1, row = pRow - 1;
    if (playerFacing === 'north') { col = pCol - 1; row = pRow - 4; }
    else if (playerFacing === 'south') { col = pCol - 1; row = pRow + 2; }
    else if (playerFacing === 'east')  { col = pCol + 2; row = pRow - 1; }
    else if (playerFacing === 'west')  { col = pCol - 5; row = pRow - 1; }
    col = Math.max(0, Math.min(MAP_COLS - PORTAL_W, col));
    row = Math.max(0, Math.min(MAP_ROWS - PORTAL_H, row));
    portal.active = true;
    portal.col = col;
    portal.row = row;
    portal.spawnTime = gameTime;
    portal.lastSpawnCheck = gameTime; // reset random cycle from here
    addNotification('Portal placed!', 1500, 'rgba(220,150,255,1)', 'rgba(40,10,60,0.85)');
}

// ── Snowflake Currency & Ice Traveler ────────────────────────
let snowflakeCount = 0;
const ICE_TRAVELER_STAY = 10 * 60 * 1000; // stays 10 min when spawned
const ICE_TRAVELER_CHECK = 60 * 60 * 1000; // check once per hour
const ICE_TRAVELER_CHANCE = 0.000000001; // 0.0000000001%
let iceTravelerSpawned = false;
let iceTravelerSpawnTime = 0;
let iceTravelerLastCheck = 0;
function updateIceTravelerSpawn() {
    if (iceTravelerSpawned) {
        if (gameTime - iceTravelerSpawnTime >= ICE_TRAVELER_STAY) iceTravelerSpawned = false;
        return;
    }
    if (gameTime - iceTravelerLastCheck >= ICE_TRAVELER_CHECK) {
        iceTravelerLastCheck = gameTime;
        if (Math.random() < ICE_TRAVELER_CHANCE) {
            iceTravelerSpawned = true;
            iceTravelerSpawnTime = gameTime;
        }
    }
}
let adminForceIceTraveler = false;
function isIceTravelerPresent() {
    if (adminForceIceTraveler) return true;
    return iceTravelerSpawned;
}
function getIceTravelerTimeLeft() {
    if (!iceTravelerSpawned) return 0;
    return Math.max(0, ICE_TRAVELER_STAY - (gameTime - iceTravelerSpawnTime));
}
function getIceTravelerNextArrival() {
    if (iceTravelerSpawned) return 0;
    return 0; // unpredictable — chance-based
}
function dropSnowflakes() {
    const amt = 1 + Math.floor(Math.random() * 3); // 1-3
    snowflakeCount += amt;
    addNotification(`+${amt} Snowflake${amt > 1 ? 's' : ''}`, 1200, 'rgba(180,220,255,1)', 'rgba(20,40,60,0.8)');
}

// ── The Ring (Ethanblade-only) ───────────────────────────────
// The Ring is only available to players wielding the Ethanblade.
let ringOwned = false;
const RING_TEMPT_WINDOW = 5000; // 5 sec to press R after a kill
const ringTempt = { active: false, startTime: 0 };

// ── Friendly Orcs (commandable via the C wheel) ──────────────
let friendlyOrcs = [];
const FRIENDLY_ORC_DETECT_RANGE = T * 8;
const FRIENDLY_ORC_ATTACK_RATE = 1000; // 1 dmg per sec

// ── Orc Command Wheel ────────────────────────────────────────
// Formation the friendly orcs hold. Chosen via the command wheel (C key).
//   'delta'  — Attack Delta: 6x5 grid behind player, auto-engage nearby enemies (default)
//   'square' — Square March: diamond formation behind player, still chases nearby enemies
//   'circle' — Defense Circle: ring around player that blocks enemies; charges the attacker
//              briefly when a projectile / void rush / mace spin strikes the ring, then reforms
let orcFormation = 'delta';
const ORC_FORMATION_LIST = ['delta', 'square', 'circle'];
const ORC_FORMATION_LABELS = { delta: 'Attack Delta', square: 'Square March', circle: 'Defense Circle' };
const orcWheel = { open: false, selection: 0 };
const ORC_CIRCLE_RADIUS = T * 1.6;
const ORC_CIRCLE_AGGRO_TIME = 5000; // how long orcs hunt the attacker before reforming the ring
const orcCircleAggro = { active: false, target: null, until: 0 };

function openOrcWheel() {
    orcWheel.open = true;
    orcWheel.selection = Math.max(0, ORC_FORMATION_LIST.indexOf(orcFormation));
}
function closeOrcWheel() { orcWheel.open = false; }
function moveOrcWheel(dir) {
    const n = ORC_FORMATION_LIST.length;
    orcWheel.selection = (orcWheel.selection + dir + n) % n;
}
function confirmOrcWheel() {
    orcFormation = ORC_FORMATION_LIST[orcWheel.selection];
    orcWheel.open = false;
    orcCircleAggro.active = false; orcCircleAggro.target = null;
    addNotification(`Orcs: ${ORC_FORMATION_LABELS[orcFormation]}`, 1800, 'rgba(180,255,180,1)', 'rgba(0,40,10,0.85)');
}

function canOpenOrcWheel() {
    return gameState === 'playing' && !dialog.active && !butlerDialog.active && !messengerDialog.active &&
        !wizardDialog.active && !campLeaderDialog.active && !campScoutDialog.active && !campBlacksmithDialog.active &&
        !campHealerDialog.active && !iceTravelerDialog.active && !jackFrostDialog.active && !alienDialog.active &&
        !shopOpen && !adminOpen && !iceTravelerShopOpen && !iceTrap.active;
}

// ── Execution ────────────────────────────────────────────────
// From the command wheel, "Execution" blacks out everything but the orcs. Click orcs to
// mark them, press D to condemn the marked ones — the king's guards then hunt them down.
const orcWheelExecBtn = { x: 0, y: 0, w: 0, h: 0 };
const executionKillAllBtn = { x: 0, y: 0, w: 0, h: 0 };
const executionInstantBtn = { x: 0, y: 0, w: 0, h: 0 }; // "I" instant pill
const executionExecBtn = { x: 0, y: 0, w: 0, h: 0 };     // "O" executioner pill
const executionMode = { active: false, selected: [] }; // selected = friendly-orc refs
let executionInstant = false; // I = instant kill, O = executioner guards hunt them down
let executioners = [];

// ── Commander Mode ───────────────────────────────────────────
// From the wheel, press P to pick a commander orc. The army forms square march
// behind that commander and sweeps the map killing hostile monsters, then reverts
// to normal once the dragon is slain (or no enemies remain).
const commanderPick = { active: false };
const commanderMode = { active: false, commander: null, prevFormation: 'delta', dragonWasAlive: false };
let spectateOrcArmy = false; // camera follows the army while a commander leads (P toggles)
const EXECUTIONER_SPEED_MULT = 1.4;
const EXECUTIONER_DMG = 5;

function enterExecutionMode() {
    orcWheel.open = false;
    if (!friendlyOrcs.some(o => o.alive)) {
        addNotification('No orcs to execute.', 1500, 'rgba(255,200,100,1)', 'rgba(60,30,0,0.85)');
        return;
    }
    executionMode.active = true;
    executionMode.selected = [];
}

function cancelExecution() {
    executionMode.active = false;
    executionMode.selected = [];
}

// Toggle the orc at world-space (wx, wy) in/out of the execution list.
function executionPickAt(wx, wy) {
    for (const o of friendlyOrcs) {
        if (!o.alive) continue;
        if (wx >= o.x - 3 && wx <= o.x + o.width + 3 && wy >= o.y - 3 && wy <= o.y + o.height + 3) {
            const i = executionMode.selected.indexOf(o);
            if (i >= 0) executionMode.selected.splice(i, 1);
            else executionMode.selected.push(o);
            return;
        }
    }
}

// Carry out the sentence on a set of orcs, honoring the instant/executioner mode.
function condemnOrcs(condemned, allText) {
    if (!condemned.length) return;
    const plural = condemned.length > 1 ? 's' : '';
    const prefix = allText ? `All ${condemned.length}` : `${condemned.length}`;
    if (executionInstant) {
        for (const o of condemned) { o.condemned = true; o.alive = false; }
        addNotification(`${prefix} orc${plural} executed instantly!`,
            2500, 'rgba(255,120,120,1)', 'rgba(60,0,0,0.85)');
    } else {
        for (const o of condemned) o.condemned = true;
        spawnExecutioners(condemned.length);
        addNotification(`${prefix} orc${plural} condemned! Guards move in.`,
            2500, 'rgba(255,120,120,1)', 'rgba(60,0,0,0.85)');
    }
}

function confirmExecution() {
    const condemned = executionMode.selected.filter(o => o && o.alive);
    executionMode.active = false;
    executionMode.selected = [];
    condemnOrcs(condemned, false);
}

// Condemn every living friendly orc at once (Kill All).
function executionKillAll() {
    if (!executionMode.active) return;
    const condemned = friendlyOrcs.filter(o => o.alive);
    executionMode.active = false;
    executionMode.selected = [];
    condemnOrcs(condemned, true);
}

function spawnExecutioners(condemnedCount) {
    const count = Math.max(2, Math.min(4, Math.ceil(condemnedCount / 2) + 1));
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        executioners.push({
            x: pcx + Math.cos(ang) * T * 3 - 8,
            y: pcy + Math.sin(ang) * T * 3 - 8,
            width: 16, height: 16,
            speed: player.speed * EXECUTIONER_SPEED_MULT,
            lastAttack: 0, attackCooldown: 500,
        });
    }
}

function updateExecutioners(dt) {
    if (!executioners.length) return;
    const prey = friendlyOrcs.filter(o => o.alive && o.condemned);
    if (!prey.length) { executioners = []; return; }
    for (const g of executioners) {
        const gcx = g.x + g.width / 2, gcy = g.y + g.height / 2;
        let best = null, bd = Infinity;
        for (const o of prey) {
            const d = Math.hypot((o.x + o.width / 2) - gcx, (o.y + o.height / 2) - gcy);
            if (d < bd) { bd = d; best = o; }
        }
        if (!best) continue;
        const dx = (best.x + best.width / 2) - gcx, dy = (best.y + best.height / 2) - gcy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > T * 0.7) {
            // Spectral guards walk straight through walls
            g.x += (dx / dist) * g.speed * dt;
            g.y += (dy / dist) * g.speed * dt;
        } else if (gameTime - g.lastAttack >= g.attackCooldown) {
            g.lastAttack = gameTime;
            best.hp -= EXECUTIONER_DMG;
            if (best.hp <= 0) {
                best.alive = false;
                addNotification('Orc executed!', 1200, 'rgba(255,120,120,1)', 'rgba(60,0,0,0.85)');
            }
        }
    }
}

// ── Commander Mode logic ─────────────────────────────────────
function enterCommanderPick() {
    if (!friendlyOrcs.some(o => o.alive)) {
        addNotification('No orcs to command.', 1500, 'rgba(255,200,100,1)', 'rgba(60,30,0,0.85)');
        return;
    }
    orcWheel.open = false;
    commanderPick.active = true;
}

function cancelCommanderPick() {
    commanderPick.active = false;
}

// Pick the orc at world-space (wx, wy) as the commander.
function commanderPickAt(wx, wy) {
    for (const o of friendlyOrcs) {
        if (!o.alive) continue;
        if (wx >= o.x - 3 && wx <= o.x + o.width + 3 && wy >= o.y - 3 && wy <= o.y + o.height + 3) {
            startCommanderMode(o);
            return;
        }
    }
}

function startCommanderMode(commander) {
    commanderPick.active = false;
    commanderMode.active = true;
    commanderMode.commander = commander;
    commanderMode.prevFormation = orcFormation;
    commanderMode.dragonWasAlive = (typeof dragon !== 'undefined' && dragon.alive);
    orcFormation = 'square';
    addNotification('Commander appointed! The orcs march to war.', 2500, 'rgba(255,215,0,1)', 'rgba(50,40,0,0.9)');
}

function endCommanderMode(msg) {
    commanderMode.active = false;
    commanderMode.commander = null;
    commanderMode.dragonWasAlive = false;
    spectateOrcArmy = false; // return the camera to the player
    orcFormation = commanderMode.prevFormation || 'delta';
    if (msg) addNotification(msg, 2500, 'rgba(255,215,0,1)', 'rgba(50,40,0,0.9)');
}

// One orc's move-and-attack step against a target (shared with the normal loop's logic).
function orcCombatStep(f, target, dt) {
    const fcx = f.x + f.width / 2, fcy = f.y + f.height / 2;
    const tcx = target.x + target.width / 2, tcy = target.y + target.height / 2;
    const dx = tcx - fcx, dy = tcy - fcy;
    const dist = Math.hypot(dx, dy);
    if (dist > T * 0.9) {
        f.x += (dx / dist) * f.speed * dt;
        f.y += (dy / dist) * f.speed * dt;
    } else if (gameTime - f.lastAttack >= f.attackCooldown) {
        f.lastAttack = gameTime;
        const playerDmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
        f.damage = Math.max(1, playerDmg);
        target.hp -= f.damage;
        if (target.hp <= 0) { target.hp = 0; handleStabKill(target); }
        else { f.hp -= 1; }
    }
}

// A follower's slot in the square/diamond trailing behind the commander, oriented
// along the commander's march direction.
function commanderFollowSlot(idx, ccx, ccy, dirx, diry) {
    const rows = ORC_DIAMOND_ROWS;
    let r = 0, k = idx;
    while (r < rows.length && k >= rows[r]) { k -= rows[r]; r++; }
    if (r >= rows.length) { r = rows.length - 1; k = 0; }
    const size = rows[r];
    const side = k - (size - 1) / 2;
    const gap = T * 0.8;
    const backx = -dirx, backy = -diry;     // behind the commander
    const sidex = -diry, sidey = dirx;       // perpendicular
    return {
        x: ccx + backx * (r + 1) * gap + sidex * side * gap,
        y: ccy + backy * (r + 1) * gap + sidey * side * gap,
    };
}

// The army's objective in a FIXED priority order, regardless of distance:
// spider → sea snake → troll → enemy orcs → void sentinel → lava monster → dragon (last).
function commanderObjective() {
    if (typeof spider !== 'undefined' && spider.active && spider.alive) return spider;
    if (typeof seaSnake !== 'undefined' && seaSnake.active && seaSnake.alive) return seaSnake;
    if (typeof troll !== 'undefined' && troll.alive) return troll;
    if (typeof orcs !== 'undefined') { for (const o of orcs) if (o.alive) return o; }
    if (typeof voidSentinel !== 'undefined' && inArena && voidSentinel.alive) return voidSentinel;
    if (typeof lavaMonster !== 'undefined' && inLavaZone && lavaMonster.alive) return lavaMonster;
    if (typeof dragon !== 'undefined' && dragon.alive) return dragon;
    return null;
}

function updateCommanderMode(dt) {
    let cmd = commanderMode.commander;
    if (!cmd || !cmd.alive) {
        cmd = friendlyOrcs.find(o => o.alive) || null;
        commanderMode.commander = cmd;
    }
    if (!cmd) { endCommanderMode('The orcs have fallen. Command ends.'); return; }

    const ccx = cmd.x + cmd.width / 2, ccy = cmd.y + cmd.height / 2;
    const dragonAlive = (typeof dragon !== 'undefined' && dragon.alive);
    if (dragonAlive) commanderMode.dragonWasAlive = true;

    const objective = commanderObjective(); // fixed priority order, ignore distance

    // End: dragon slain (primary goal) or no hostile monsters remain.
    if (commanderMode.dragonWasAlive && !dragonAlive) {
        endCommanderMode('The dragon falls! The orcs stand down.');
        return;
    }
    if (!objective) {
        endCommanderMode('All enemies slain! The orcs return to your side.');
        return;
    }

    const objCx = objective.x + objective.width / 2, objCy = objective.y + objective.height / 2;
    let dirx = objCx - ccx, diry = objCy - ccy;
    const dl = Math.hypot(dirx, diry) || 1; dirx /= dl; diry /= dl;

    let followIdx = 0;
    for (const f of friendlyOrcs) {
        if (!f.alive) continue;
        f.speed = player.speed;
        if (f === cmd) {
            orcCombatStep(f, objective, dt); // commander charges the priority target
        } else {
            const fcx = f.x + f.width / 2, fcy = f.y + f.height / 2;
            // The whole army focuses the same objective — pile on once close, else march behind the commander.
            const distToObj = Math.hypot(fcx - objCx, fcy - objCy);
            if (distToObj < FRIENDLY_ORC_DETECT_RANGE) {
                orcCombatStep(f, objective, dt);
            } else {
                const slot = commanderFollowSlot(followIdx, ccx, ccy, dirx, diry);
                const dx = slot.x - fcx, dy = slot.y - fcy;
                const dist = Math.hypot(dx, dy);
                if (dist > 3) {
                    const step = Math.min(dist, f.speed * dt);
                    f.x += (dx / dist) * step;
                    f.y += (dy / dist) * step;
                }
            }
            followIdx++;
        }
        if (f.hp <= 0) f.alive = false;
    }
    friendlyOrcs = friendlyOrcs.filter(o => o.alive);
}

// Provoke the defense circle: orcs break the ring and hunt the attacker, then reform.
function provokeOrcCircle(target) {
    if (orcFormation !== 'circle' || orcCircleAggro.active) return;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    if (!target || !target.alive) target = findNearestEnemyForOrc(pcx, pcy, T * 16);
    if (!target || !target.alive) return;
    orcCircleAggro.active = true;
    orcCircleAggro.target = target;
    orcCircleAggro.until = gameTime + ORC_CIRCLE_AGGRO_TIME;
    addNotification('Orcs charge the attacker!', 1500, 'rgba(180,255,180,1)', 'rgba(0,40,10,0.85)');
}

// The Ring only empowers a player actively wielding the Ethanblade.
// The Ring is available to Ethanblade and Sashablade wielders.
function hasRingSword() { return ethanBladeEquipped || sashaBladeEquipped; }
function getRingMultiplier() { return (ringOwned && hasRingSword()) ? 2 : 1; }

function tempt() {
    if (!ringOwned || !hasRingSword()) return;
    health.value = Math.min(health.max, health.value + 1);
    for (const f of friendlyOrcs) if (f.alive) f.hp = f.maxHp;
    ringTempt.active = true;
    ringTempt.startTime = gameTime;
}

function acceptTempt() {
    if (!ringTempt.active) return false;
    if (gameTime - ringTempt.startTime > RING_TEMPT_WINDOW) { ringTempt.active = false; return false; }
    if (nextFreeOrcSlot() < 0) {
        ringTempt.active = false;
        addNotification(`Army already full (${FRIENDLY_ORC_MAX} max)`, 1800, 'rgba(255,200,100,1)', 'rgba(60,30,0,0.85)');
        return false;
    }
    ringTempt.active = false;
    health.value = Math.max(0, health.value - 3);
    addNotification('The Ring takes 3 HP...', 1800, 'rgba(220,150,255,1)', 'rgba(30,10,40,0.9)');
    spawnFriendlyOrcs(3);
    return true;
}

const FRIENDLY_ORC_MAX = 30;
const FRIENDLY_ORC_COLS = 6;

function nextFreeOrcSlot() {
    const used = new Set(friendlyOrcs.filter(o => o.alive).map(o => o.slot));
    for (let i = 0; i < FRIENDLY_ORC_MAX; i++) if (!used.has(i)) return i;
    return -1;
}

function orcSlotPosition(slot) {
    // Formation: 6x5 grid behind the player. Row 1 nearest, row 5 farthest.
    const row = Math.floor(slot / FRIENDLY_ORC_COLS) + 1;     // 1..5
    const side = (slot % FRIENDLY_ORC_COLS) - (FRIENDLY_ORC_COLS - 1) / 2; // -2.5..+2.5
    const pcx = player.x + player.width / 2;
    const pcy = player.y + player.height / 2;
    const gap = T * 0.9;
    let bx = 0, by = 0, sxv = 0, syv = 0;
    if (playerFacing === 'south')      { bx = 0; by = -1; sxv = 1; syv = 0; }
    else if (playerFacing === 'north') { bx = 0; by = 1;  sxv = 1; syv = 0; }
    else if (playerFacing === 'east')  { bx = -1; by = 0; sxv = 0; syv = 1; }
    else /* west */                    { bx = 1;  by = 0; sxv = 0; syv = 1; }
    return {
        x: pcx + bx * row * gap + sxv * side * gap,
        y: pcy + by * row * gap + syv * side * gap,
    };
}

// Facing basis: bx/by point "behind" the player, sxv/syv run side-to-side across the formation.
function orcFormationBasis() {
    if (playerFacing === 'south')      return { bx: 0,  by: -1, sxv: 1, syv: 0 };
    else if (playerFacing === 'north') return { bx: 0,  by: 1,  sxv: 1, syv: 0 };
    else if (playerFacing === 'east')  return { bx: -1, by: 0,  sxv: 0, syv: 1 };
    else /* west */                    return { bx: 1,  by: 0,  sxv: 0, syv: 1 };
}

// Square March: a diamond of rows 1,2,3,4,5,5,4,3,2,1 (30 orcs) trailing behind the player.
// The tip (slot 0, "corner man") follows the player; the diamond widens then narrows behind it.
const ORC_DIAMOND_ROWS = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1];
function orcSquareSlotPosition(slot) {
    let r = 0, idx = slot;
    while (r < ORC_DIAMOND_ROWS.length && idx >= ORC_DIAMOND_ROWS[r]) { idx -= ORC_DIAMOND_ROWS[r]; r++; }
    if (r >= ORC_DIAMOND_ROWS.length) { r = ORC_DIAMOND_ROWS.length - 1; idx = 0; }
    const size = ORC_DIAMOND_ROWS[r];
    const side = idx - (size - 1) / 2;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const gap = T * 0.8;
    const b = orcFormationBasis();
    return {
        x: pcx + b.bx * (r + 1) * gap + b.sxv * side * gap,
        y: pcy + b.by * (r + 1) * gap + b.syv * side * gap,
    };
}

// Defense Circle: evenly spaced ring around the player. The ring widens with the
// army size so orcs don't pile on top of each other.
function orcCircleRadius(count) {
    const minSpacingR = (count * T * 0.95) / (2 * Math.PI); // keep ~T between neighbours
    return Math.max(ORC_CIRCLE_RADIUS, minSpacingR);
}
function orcCircleSlotPosition(idx, count) {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const ang = (idx / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2;
    const r = orcCircleRadius(count);
    return { x: pcx + Math.cos(ang) * r, y: pcy + Math.sin(ang) * r };
}

// Where a given orc should stand when not chasing, based on the active formation.
function orcFormationSlotPosition(f, aliveList) {
    if (orcFormation === 'square') return orcSquareSlotPosition(f.slot != null ? f.slot : 0);
    if (orcFormation === 'circle') return orcCircleSlotPosition(aliveList.indexOf(f), aliveList.length);
    return orcSlotPosition(f.slot != null ? f.slot : 0);
}

function spawnFriendlyOrcs(n) {
    let spawned = 0;
    for (let i = 0; i < n; i++) {
        const slot = nextFreeOrcSlot();
        if (slot < 0) break;
        const pos = orcSlotPosition(slot);
        friendlyOrcs.push({
            x: pos.x - 10, y: pos.y - 10,
            width: 20, height: 20,
            hp: 10, maxHp: 10, alive: true,
            lastAttack: 0, attackCooldown: FRIENDLY_ORC_ATTACK_RATE,
            damage: 1, speed: player.speed,
            target: null, targetId: null,
            path: null, pathIndex: 0, pathTime: 0,
            slot,
        });
        spawned++;
    }
    if (spawned > 0) addNotification(`${spawned} orc${spawned > 1 ? 's' : ''} follow you!`, 2200, 'rgba(180,255,180,1)', 'rgba(0,40,10,0.85)');
}

// ── Snow Weather ─────────────────────────────────────────────
const SNOW_STAY = 15 * 60 * 1000;     // lasts 15 min when it comes
const SNOW_CHECK = 60 * 60 * 1000;    // check once per hour
const SNOW_CHANCE = 0.000000001;       // 0.0000001%
const SNOW_CASTLE_ROW = 28;           // rows <= this are indoors (no snow)
let snowActive = false;
let snowStartTime = 0;
let snowLastCheck = 0;

function updateSnowSpawn() {
    if (snowActive) {
        if (gameTime - snowStartTime >= SNOW_STAY) snowActive = false;
        return;
    }
    if (gameTime - snowLastCheck >= SNOW_CHECK) {
        snowLastCheck = gameTime;
        if (Math.random() < SNOW_CHANCE) {
            snowActive = true;
            snowStartTime = gameTime;
        }
    }
}
let adminForceSnow = false;
function isSnowing() {
    if (adminForceSnow) return true;
    return snowActive;
}
function getSnowTimeLeft() {
    if (!snowActive) return 0;
    return Math.max(0, SNOW_STAY - (gameTime - snowStartTime));
}
function getNextSnowfall() {
    if (snowActive) return 0;
    return 0; // unpredictable — chance-based
}

// ── Volcano Event ───────────────────────────────────────────
const VOLCANO_CYCLE = 20 * 60 * 1000;    // 20 min full cycle
const VOLCANO_DURATION = 10 * 60 * 1000; // erupts for last 10 min
const FIREBALL_INTERVAL_CAMP = 60 * 1000; // camp+mountain: every 60s
const FIREBALL_INTERVAL_PEAK = 30 * 1000; // peak+arena: every 30s
const FIREBALLS_PER_WAVE = 5;
const FIREBALL_DAMAGE = 5;
const FIREBALL_FALL_TIME = 1500; // 1.5s fall animation
const FIREBALL_LINGER = 20000;   // fire patch stays 20s after landing

let lastCampFireballTime = 0;
let lastPeakFireballTime = 0;
const activeFireballs = [];

let adminForceEruption = false;
function isErupting() {
    if (adminForceEruption) return true;
    return (gameTime % VOLCANO_CYCLE) >= (VOLCANO_CYCLE - VOLCANO_DURATION);
}
function getEruptionTimeLeft() {
    const phase = gameTime % VOLCANO_CYCLE;
    if (phase >= VOLCANO_CYCLE - VOLCANO_DURATION) return VOLCANO_CYCLE - phase;
    return 0;
}

// Walkable tiles for fireball spawning
const FIREBALL_WALKABLE = new Set([PATH, MOUNTAIN_PATH, CAVE_FLOOR, CAVE_DOOR, PEAK_FLOOR, ARENA_FLOOR, CAMPFIRE]);

function spawnFireballs(rowMin, rowMax, colMin, colMax) {
    // Collect walkable positions in this zone
    const spots = [];
    for (let r = rowMin; r <= rowMax; r++)
        for (let c = colMin; c <= colMax; c++)
            if (FIREBALL_WALKABLE.has(map[r][c])) spots.push({ r, c });
    if (spots.length === 0) return;
    for (let i = 0; i < FIREBALLS_PER_WAVE; i++) {
        const s = spots[Math.floor(Math.random() * spots.length)];
        activeFireballs.push({
            col: s.c, row: s.r,
            spawnTime: gameTime,
            landed: false,
            damageDealt: false,
            expired: false,
        });
    }
}

function updateVolcano() {
    if (!isErupting()) {
        // Clear any lingering fireballs when eruption ends
        activeFireballs.length = 0;
        lastCampFireballTime = 0;
        lastPeakFireballTime = 0;
        return;
    }

    // Camp + Mountain path fireballs (every 60s)
    if (gameTime - lastCampFireballTime >= FIREBALL_INTERVAL_CAMP) {
        lastCampFireballTime = gameTime;
        spawnFireballs(113, 118, 3, 26);  // camp
        spawnFireballs(134, 164, 3, 26);  // mountain path + cave
    }

    // Peak + Arena fireballs (every 30s)
    if (gameTime - lastPeakFireballTime >= FIREBALL_INTERVAL_PEAK) {
        lastPeakFireballTime = gameTime;
        spawnFireballs(167, 193, 3, 26);  // peak
        if (inArena) spawnFireballs(211, 229, 4, 25); // arena
    }

    // Update individual fireballs
    const pCol = Math.floor((player.x + player.width / 2) / T);
    const pRow = Math.floor((player.y + player.height / 2) / T);
    for (let i = activeFireballs.length - 1; i >= 0; i--) {
        const fb = activeFireballs[i];
        const elapsed = gameTime - fb.spawnTime;

        // Landing
        if (!fb.landed && elapsed >= FIREBALL_FALL_TIME) {
            fb.landed = true;
            fb.landTime = gameTime;
        }

        // Damage check — on landing impact + every 2s while standing in fire
        if (fb.landed) {
            const inFire = (pCol >= fb.col && pCol <= fb.col + 1) && (pRow >= fb.row && pRow <= fb.row + 1);
            if (inFire) {
                if (!fb.damageDealt) {
                    // Impact damage
                    fb.damageDealt = true;
                    fb.lastBurnTime = gameTime;
                    if (!adminGodMode) health.value = Math.max(0, health.value - FIREBALL_DAMAGE);
                    addNotification('Hit by a fireball!', 1500, 'rgba(255,100,50,1)', 'rgba(80,20,0,0.9)');
                } else if (gameTime - (fb.lastBurnTime || fb.landTime) >= 1000) {
                    // Burn tick every 1s while standing in fire
                    fb.lastBurnTime = gameTime;
                    if (!adminGodMode) health.value = Math.max(0, health.value - 1);
                    addNotification('Burning!', 800, 'rgba(255,150,50,1)', 'rgba(80,30,0,0.8)');
                }
            }
            if (!fb.damageDealt) fb.damageDealt = true; // mark checked even if missed
        }

        // Expire after linger
        if (fb.landed && gameTime - fb.landTime >= FIREBALL_LINGER) {
            activeFireballs.splice(i, 1);
        }
    }
}

// ── Future Portal (random spawn every 30 min) ────────────────
const PORTAL_CYCLE = 30 * 60 * 1000; // 30 min between spawns
const PORTAL_DURATION = 60 * 1000;   // stays for 1 min
const PORTAL_W = 4; // tiles wide
const PORTAL_H = 3; // tiles tall
const portal = { active: false, col: 0, row: 0, spawnTime: 0, lastSpawnCheck: -Infinity };

// Return portal — anchor in the future-world camp (cols 4-7, rows 113-115)
const RETURN_PORTAL_COL = 4;
const RETURN_PORTAL_ROW = 113;

// Future-world arrival spot (camp center, south of campfire)
const FUTURE_ARRIVAL_COL = 14;
const FUTURE_ARRIVAL_ROW = 116;

const PORTAL_WALKABLE = new Set([
    FLOOR, PATH, DOOR, CARPET, RUG, BATH_FLOOR, HUT_FLOOR,
    SAND, MOUNTAIN_PATH, CAVE_FLOOR, PEAK_FLOOR, BRIDGE, DOCK,
]);

function findRandomPortalSpot() {
    const candidates = [];
    const maxRow = Math.min(MAP_ROWS, 196) - PORTAL_H; // exclude arena/lava zones (rows 200+)
    for (let r = 1; r <= maxRow; r++) {
        for (let c = 0; c <= MAP_COLS - PORTAL_W; c++) {
            let ok = true;
            for (let dr = 0; dr < PORTAL_H && ok; dr++) {
                for (let dc = 0; dc < PORTAL_W && ok; dc++) {
                    if (!PORTAL_WALKABLE.has(map[r + dr][c + dc])) ok = false;
                }
            }
            if (ok) candidates.push({ row: r, col: c });
        }
    }
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function spawnPortal() {
    const spot = findRandomPortalSpot();
    if (!spot) return;
    portal.active = true;
    portal.col = spot.col;
    portal.row = spot.row;
    portal.spawnTime = gameTime;
    addNotification('A mysterious purple portal has appeared!', 5000, 'rgba(220,150,255,1)', 'rgba(40,10,60,0.9)');
}

function updatePortal() {
    if (portal.active && gameTime - portal.spawnTime >= PORTAL_DURATION) {
        portal.active = false;
        addNotification('The purple portal has vanished.', 3000, 'rgba(180,140,220,1)', 'rgba(30,10,50,0.85)');
    }
    if (gameTime - portal.lastSpawnCheck >= PORTAL_CYCLE) {
        portal.lastSpawnCheck = gameTime;
        spawnPortal();
    }
}

function drawPortalAt(col, row, camX, camY) {
    const sx = col * T - camX;
    const sy = row * T - camY;
    const w = PORTAL_W * T;
    const h = PORTAL_H * T;
    const cx = sx + w / 2, cy = sy + h / 2;
    const rx = w / 2, ry = h / 2;
    const t = performance.now() / 1000;

    ctx.save();
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
    ctx.globalAlpha = 0.25 + 0.15 * pulse;
    ctx.fillStyle = '#C040FF';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx + 8, ry + 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.max(rx, ry));
    grad.addColorStop(0, '#FFB8FF');
    grad.addColorStop(0.35, '#C040E0');
    grad.addColorStop(0.75, '#5010A0');
    grad.addColorStop(1, '#1A0040');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 4; i++) {
        const phase = ((i / 4) + (t * 0.4) % 1) % 1;
        const k = 1 - phase;
        ctx.globalAlpha = 0.55 * phase;
        ctx.strokeStyle = '#FFD8FF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * k, ry * k, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    for (let i = 0; i < 6; i++) {
        const angle = t * 1.5 + i * (Math.PI * 2 / 6);
        const px = cx + Math.cos(angle) * (rx - 3);
        const py = cy + Math.sin(angle) * (ry - 3);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#FFE0FF';
        ctx.fillRect(px - 1, py - 1, 2, 2);
    }
    ctx.restore();
}

function drawPortal(camX, camY) {
    if (portal.active) drawPortalAt(portal.col, portal.row, camX, camY);
}

function drawReturnPortal(camX, camY) {
    if (!inFutureWorld) return;
    drawPortalAt(RETURN_PORTAL_COL, RETURN_PORTAL_ROW, camX, camY);
}

// Player overlap with a portal anchored at (col, row) of size PORTAL_W x PORTAL_H
function isPlayerOnPortal(col, row) {
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const x1 = col * T, y1 = row * T;
    const x2 = (col + PORTAL_W) * T, y2 = (row + PORTAL_H) * T;
    return pcx >= x1 && pcx < x2 && pcy >= y1 && pcy < y2;
}

// ── Spaceport (future-world camp ship) ─────────────────────
// Big saucer-style ship drawn in pixel art on the open grass just
// south-west of the camp, so it doesn't overlap the campfire (cols
// 14-15 row 115) or the alien camp leader (col 17 row 115).
function drawSpaceship(camX, camY) {
    if (!inFutureWorld) return;
    const baseCol = 3, baseRow = 119;
    const x = baseCol * T - camX, y = baseRow * T - camY;
    const w = 10 * T, h = 6 * T;
    const cx = x + w / 2, cy = y + h / 2;
    const t = performance.now() / 1000;

    ctx.save();

    // Landing shadow
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(cx, cy + h * 0.35, w * 0.45, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Landing pad ring
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = '#4FE0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + h * 0.32, w * 0.42, h * 0.14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.3 + 0.2 * Math.sin(t * 3);
    ctx.beginPath();
    ctx.ellipse(cx, cy + h * 0.32, w * 0.36, h * 0.11, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;

    // Lower hull (dark band)
    ctx.fillStyle = '#1f2a36';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, w * 0.46, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main saucer body
    const hullGrad = ctx.createLinearGradient(cx, cy - h * 0.25, cx, cy + h * 0.2);
    hullGrad.addColorStop(0, '#9aaab8');
    hullGrad.addColorStop(0.5, '#6a7886');
    hullGrad.addColorStop(1, '#2c3540');
    ctx.fillStyle = hullGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, w * 0.45, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hull highlight stripe
    ctx.fillStyle = '#b6c5d2';
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.05, cy - 4, w * 0.30, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // Side running lights
    const lightCount = 7;
    for (let i = 0; i < lightCount; i++) {
        const a = -Math.PI + (i / (lightCount - 1)) * Math.PI;
        const lx = cx + Math.cos(a) * w * 0.42;
        const ly = cy + 6 + Math.sin(a) * h * 0.26;
        const on = ((i + Math.floor(t * 4)) % 2) === 0;
        ctx.fillStyle = on ? '#FFE066' : '#553A10';
        ctx.beginPath();
        ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Cockpit dome
    const domeCx = cx, domeCy = cy - h * 0.18;
    const domeGrad = ctx.createRadialGradient(domeCx - 10, domeCy - 8, 2, domeCx, domeCy, w * 0.22);
    domeGrad.addColorStop(0, '#CFF5FF');
    domeGrad.addColorStop(0.4, '#4FB8E0');
    domeGrad.addColorStop(1, '#103850');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.ellipse(domeCx, domeCy, w * 0.22, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dome outline
    ctx.strokeStyle = '#0a1e2c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(domeCx, domeCy, w * 0.22, h * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Dome highlight
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.ellipse(domeCx - w * 0.08, domeCy - h * 0.08, w * 0.06, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    // Antenna
    ctx.strokeStyle = '#c0c8d0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(domeCx, domeCy - h * 0.20);
    ctx.lineTo(domeCx, domeCy - h * 0.40);
    ctx.stroke();
    // Antenna tip blinking
    const blink = (Math.floor(t * 2) % 2) === 0;
    ctx.fillStyle = blink ? '#FF4040' : '#700000';
    ctx.beginPath();
    ctx.arc(domeCx, domeCy - h * 0.42, 3, 0, Math.PI * 2);
    ctx.fill();

    // Engine thrust glow (pulsing)
    const epulse = 0.6 + 0.4 * Math.sin(t * 6);
    for (let i = -1; i <= 1; i++) {
        const ex = cx + i * w * 0.22;
        const ey = cy + h * 0.20;
        const eg = ctx.createRadialGradient(ex, ey, 1, ex, ey, 12);
        eg.addColorStop(0, `rgba(180,230,255,${0.9 * epulse})`);
        eg.addColorStop(0.6, `rgba(80,180,255,${0.5 * epulse})`);
        eg.addColorStop(1, 'rgba(0,40,90,0)');
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(ex, ey, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ── Ice Trap (Ice Dragon's ice ball hit) ─────────────────────
const iceTrap = {
    active: false,
    startTime: 0,
    hits: 0,
    hitsNeeded: 20,
    duration: 6000,   // 6 seconds to break free
    dmgOnHit: 2,
    dmgOnFail: 2,
};

function startIceTrap() {
    iceTrap.active = true;
    iceTrap.startTime = gameTime;
    iceTrap.hits = 0;
    health.value = Math.max(0, health.value - iceTrap.dmgOnHit);
    addNotification(`Frozen! Press ${kl('H')} 20 times to break free!`, 3000, 'rgba(100,180,255,1)', 'rgba(10,20,40,0.9)');
}

function hitIceTrap() {
    if (!iceTrap.active) return;
    iceTrap.hits++;
    if (iceTrap.hits >= iceTrap.hitsNeeded) {
        iceTrap.active = false;
        addNotification('You broke free from the ice!', 2000, 'rgba(150,220,255,1)', 'rgba(20,40,60,0.85)');
    }
}

function updateIceTrap() {
    if (!iceTrap.active) return;
    if (gameTime - iceTrap.startTime >= iceTrap.duration) {
        iceTrap.active = false;
        health.value = Math.max(0, health.value - iceTrap.dmgOnFail);
        addNotification('The ice explodes! -2 HP', 2000, 'rgba(100,150,255,1)', 'rgba(10,20,50,0.9)');
    }
}

// Snowflake particles (visual only)
const snowParticles = [];
const MAX_SNOW_PARTICLES = 120;

function updateSnowParticles(dt) {
    if (!isSnowing()) { snowParticles.length = 0; return; }
    // Spawn new particles
    while (snowParticles.length < MAX_SNOW_PARTICLES) {
        snowParticles.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            size: 1 + Math.random() * 3,
            speed: 20 + Math.random() * 40,
            drift: -15 + Math.random() * 30,
            opacity: 0.4 + Math.random() * 0.5
        });
    }
    // Update positions
    for (let i = snowParticles.length - 1; i >= 0; i--) {
        const p = snowParticles[i];
        p.y += p.speed * (dt / 1000);
        p.x += p.drift * (dt / 1000);
        if (p.y > canvas.height || p.x < -10 || p.x > canvas.width + 10) {
            snowParticles[i] = {
                x: Math.random() * canvas.width,
                y: -5,
                size: 1 + Math.random() * 3,
                speed: 20 + Math.random() * 40,
                drift: -15 + Math.random() * 30,
                opacity: 0.4 + Math.random() * 0.5
            };
        }
    }
}

// Ice Spear
let iceSpearUnlocked = false;

// Firemace
let firemaceUnlocked = false;

// Ice Traveler dialog
const iceTravelerDialog = { active: false, stage: null };
let iceTravelerShopOpen = false;

// ── Mastery System ──────────────────────────────────────────

let extraLevels = false;

const swordMastery = { xp: 0, level: 0 };
let masterySkin = 'default';
const MASTERY_SKINS = ['default', 'bronze', 'silver', 'gold', 'diamond'];
const MASTERY_MILESTONES = { 25: 'bronze', 50: 'silver', 75: 'gold', 100: 'diamond' };

const daggerMastery = { xp: 0, level: 0 };
let daggerMasterySkin = 'default';
const DAGGER_MASTERY_SKINS = ['default', 'shadow', 'crimson', 'phantom', 'nightblade'];
const DAGGER_MASTERY_MILESTONES = { 25: 'shadow', 50: 'crimson', 75: 'phantom', 100: 'nightblade' };

const spearMastery = { xp: 0, level: 0 };
let spearMasterySkin = 'default';
const SPEAR_MASTERY_SKINS = ['default', 'frost', 'blizzard', 'glacier', 'aurora'];
const SPEAR_MASTERY_MILESTONES = { 25: 'frost', 50: 'blizzard', 75: 'glacier', 100: 'aurora' };

function xpForLevel(level) {
    return Math.floor(100 * Math.pow(1.1, level - 1));
}

function addSwordXP(amount) {
    if (swordMastery.level >= 100 && !extraLevels) return;
    swordMastery.xp += amount;
    let leveled = false;
    while (swordMastery.level < 100 || extraLevels) {
        const needed = xpForLevel(swordMastery.level + 1);
        if (swordMastery.xp >= needed) {
            swordMastery.xp -= needed;
            swordMastery.level++;
            leveled = true;
            const milestone = MASTERY_MILESTONES[swordMastery.level];
            if (milestone) {
                masterySkin = milestone;
                addNotification(`Sword Mastery ${swordMastery.level}! ${milestone.charAt(0).toUpperCase() + milestone.slice(1)} skin unlocked!`, 6000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
            }
        } else break;
    }
    if (leveled && !MASTERY_MILESTONES[swordMastery.level]) {
        addNotification(`Sword Mastery Level ${swordMastery.level}!`, 2000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.8)');
    }
    if (swordMastery.level >= 100 && !extraLevels) swordMastery.xp = 0;
}

function addDaggerXP(amount) {
    if (daggerMastery.level >= 100 && !extraLevels) return;
    daggerMastery.xp += amount;
    let leveled = false;
    while (daggerMastery.level < 100 || extraLevels) {
        const needed = xpForLevel(daggerMastery.level + 1);
        if (daggerMastery.xp >= needed) {
            daggerMastery.xp -= needed;
            daggerMastery.level++;
            leveled = true;
            const milestone = DAGGER_MASTERY_MILESTONES[daggerMastery.level];
            if (milestone) {
                daggerMasterySkin = milestone;
                addNotification(`Dagger Mastery ${daggerMastery.level}! ${milestone.charAt(0).toUpperCase() + milestone.slice(1)} skin unlocked!`, 6000, 'rgba(255,180,50,1)', 'rgba(60,30,0,0.9)');
            }
        } else break;
    }
    if (leveled && !DAGGER_MASTERY_MILESTONES[daggerMastery.level]) {
        addNotification(`Dagger Mastery Level ${daggerMastery.level}!`, 2000, 'rgba(255,200,150,1)', 'rgba(40,20,0,0.8)');
    }
    if (daggerMastery.level >= 100 && !extraLevels) daggerMastery.xp = 0;
}

function addSpearXP(amount) {
    if (spearMastery.level >= 100 && !extraLevels) return;
    spearMastery.xp += amount;
    let leveled = false;
    while (spearMastery.level < 100 || extraLevels) {
        const needed = xpForLevel(spearMastery.level + 1);
        if (spearMastery.xp >= needed) {
            spearMastery.xp -= needed;
            spearMastery.level++;
            leveled = true;
            const milestone = SPEAR_MASTERY_MILESTONES[spearMastery.level];
            if (milestone) {
                spearMasterySkin = milestone;
                addNotification(`Spear Mastery ${spearMastery.level}! ${milestone.charAt(0).toUpperCase() + milestone.slice(1)} skin unlocked!`, 6000, 'rgba(180,220,255,1)', 'rgba(20,40,60,0.9)');
            }
        } else break;
    }
    if (leveled && !SPEAR_MASTERY_MILESTONES[spearMastery.level]) {
        addNotification(`Spear Mastery Level ${spearMastery.level}!`, 2000, 'rgba(180,220,255,1)', 'rgba(20,40,60,0.8)');
    }
    if (spearMastery.level >= 100 && !extraLevels) spearMastery.xp = 0;
}

function addWeaponXP(amount) {
    if (currentSword === 'dagger') addDaggerXP(amount);
    else if (currentSword === 'icespear') addSpearXP(amount);
    else if (currentSword === 'firemace') addMaceXP(amount);
    else if (currentSword === 'saber') addSaberXP(amount);
    else if (currentSword === 'voidstar') addVoidstarXP(amount);
    else addSwordXP(amount);
}

function getMasteryUnlockedSkins() {
    const skins = ['default'];
    if (swordMastery.level >= 25) skins.push('bronze');
    if (swordMastery.level >= 50) skins.push('silver');
    if (swordMastery.level >= 75) skins.push('gold');
    if (swordMastery.level >= 100) skins.push('diamond');
    return skins;
}

function getDaggerMasteryUnlockedSkins() {
    const skins = ['default'];
    if (daggerMastery.level >= 25) skins.push('shadow');
    if (daggerMastery.level >= 50) skins.push('crimson');
    if (daggerMastery.level >= 75) skins.push('phantom');
    if (daggerMastery.level >= 100) skins.push('nightblade');
    return skins;
}

function getSpearMasteryUnlockedSkins() {
    const skins = ['default'];
    if (spearMastery.level >= 25) skins.push('frost');
    if (spearMastery.level >= 50) skins.push('blizzard');
    if (spearMastery.level >= 75) skins.push('glacier');
    if (spearMastery.level >= 100) skins.push('aurora');
    return skins;
}

// ── Mace Mastery ───────────────────────────────────────────
const maceMastery = { xp: 0, level: 0 };
let maceMasterySkin = 'default';
const MACE_MASTERY_SKINS = ['default', 'ember', 'inferno', 'magma', 'hellfire'];
const MACE_MASTERY_MILESTONES = { 25: 'ember', 50: 'inferno', 75: 'magma', 100: 'hellfire' };

function addMaceXP(amount) {
    if (maceMastery.level >= 100 && !extraLevels) return;
    maceMastery.xp += amount;
    let leveled = false;
    while (maceMastery.level < 100 || extraLevels) {
        const needed = xpForLevel(maceMastery.level + 1);
        if (maceMastery.xp >= needed) {
            maceMastery.xp -= needed;
            maceMastery.level++;
            leveled = true;
            const milestone = MACE_MASTERY_MILESTONES[maceMastery.level];
            if (milestone) {
                maceMasterySkin = milestone;
                addNotification(`Mace Mastery ${maceMastery.level}! ${milestone.charAt(0).toUpperCase() + milestone.slice(1)} skin unlocked!`, 6000, 'rgba(255,120,30,1)', 'rgba(80,20,0,0.9)');
            }
        } else break;
    }
    if (leveled && !MACE_MASTERY_MILESTONES[maceMastery.level]) {
        addNotification(`Mace Mastery Level ${maceMastery.level}!`, 2000, 'rgba(255,150,50,1)', 'rgba(80,30,0,0.8)');
    }
    if (maceMastery.level >= 100 && !extraLevels) maceMastery.xp = 0;
}

function getMaceMasteryUnlockedSkins() {
    const skins = ['default'];
    if (maceMastery.level >= 25) skins.push('ember');
    if (maceMastery.level >= 50) skins.push('inferno');
    if (maceMastery.level >= 75) skins.push('magma');
    if (maceMastery.level >= 100) skins.push('hellfire');
    return skins;
}

// ── Saber Mastery ──────────────────────────────────────────
const saberMastery = { xp: 0, level: 0 };
let saberMasterySkin = 'default';
const SABER_MASTERY_SKINS = ['default', 'padawan', 'apprentice', 'knight', 'master'];
const SABER_MASTERY_MILESTONES = { 25: 'padawan', 50: 'apprentice', 75: 'knight', 100: 'master' };

function addSaberXP(amount) {
    if (saberMastery.level >= 100 && !extraLevels) return;
    saberMastery.xp += amount;
    let leveled = false;
    while (saberMastery.level < 100 || extraLevels) {
        const needed = xpForLevel(saberMastery.level + 1);
        if (saberMastery.xp >= needed) {
            saberMastery.xp -= needed;
            saberMastery.level++;
            leveled = true;
            const milestone = SABER_MASTERY_MILESTONES[saberMastery.level];
            if (milestone) {
                saberMasterySkin = milestone;
                addNotification(`Saber Mastery ${saberMastery.level}! ${milestone.charAt(0).toUpperCase() + milestone.slice(1)} skin unlocked!`, 6000, 'rgba(255,70,70,1)', 'rgba(60,0,0,0.9)');
            }
        } else break;
    }
    if (leveled && !SABER_MASTERY_MILESTONES[saberMastery.level]) {
        addNotification(`Saber Mastery Level ${saberMastery.level}!`, 2000, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    }
    if (saberMastery.level >= 100 && !extraLevels) saberMastery.xp = 0;
}

function getSaberMasteryUnlockedSkins() {
    const skins = ['default'];
    if (saberMastery.level >= 25) skins.push('padawan');
    if (saberMastery.level >= 50) skins.push('apprentice');
    if (saberMastery.level >= 75) skins.push('knight');
    if (saberMastery.level >= 100) skins.push('master');
    return skins;
}

// Saber blade colors per mastery skin — used by the wielded + thrown render.
const SABER_BLADE_COLORS = {
    default:    { glow: 'rgba(255,60,60,X)', blade: '#FF2020', core: '#FFD0D0' },
    padawan:    { glow: 'rgba(255,80,80,X)', blade: '#FF3030', core: '#FFE0E0' },
    apprentice: { glow: 'rgba(220,30,40,X)', blade: '#C8101A', core: '#FFB0B8' },
    knight:     { glow: 'rgba(255,90,40,X)', blade: '#FF4020', core: '#FFD6B8' },
    master:     { glow: 'rgba(255,120,120,X)', blade: '#FF1010', core: '#FFFFFF' },
};

// ── Void Star Mastery ──────────────────────────────────────
const voidstarMastery = { xp: 0, level: 0 };
let voidstarMasterySkin = 'default';
const VOIDSTAR_MASTERY_SKINS = ['default', 'shade', 'rift', 'nebula', 'singularity'];
const VOIDSTAR_MASTERY_MILESTONES = { 25: 'shade', 50: 'rift', 75: 'nebula', 100: 'singularity' };

function addVoidstarXP(amount) {
    if (voidstarMastery.level >= 100 && !extraLevels) return;
    voidstarMastery.xp += amount;
    let leveled = false;
    while (voidstarMastery.level < 100 || extraLevels) {
        const needed = xpForLevel(voidstarMastery.level + 1);
        if (voidstarMastery.xp >= needed) {
            voidstarMastery.xp -= needed;
            voidstarMastery.level++;
            leveled = true;
            const milestone = VOIDSTAR_MASTERY_MILESTONES[voidstarMastery.level];
            if (milestone) {
                voidstarMasterySkin = milestone;
                addNotification(`Void Star Mastery ${voidstarMastery.level}! ${milestone.charAt(0).toUpperCase() + milestone.slice(1)} skin unlocked!`, 6000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            }
        } else break;
    }
    if (leveled && !VOIDSTAR_MASTERY_MILESTONES[voidstarMastery.level]) {
        addNotification(`Void Star Mastery Level ${voidstarMastery.level}!`, 2000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.8)');
    }
    if (voidstarMastery.level >= 100 && !extraLevels) voidstarMastery.xp = 0;
}

function getVoidstarMasteryUnlockedSkins() {
    const skins = ['default'];
    if (voidstarMastery.level >= 25) skins.push('shade');
    if (voidstarMastery.level >= 50) skins.push('rift');
    if (voidstarMastery.level >= 75) skins.push('nebula');
    if (voidstarMastery.level >= 100) skins.push('singularity');
    return skins;
}

function getActiveMasterySkin() {
    if (currentSword === 'dagger') return daggerMasterySkin;
    if (currentSword === 'icespear') return spearMasterySkin;
    if (currentSword === 'firemace') return maceMasterySkin;
    if (currentSword === 'saber') return saberMasterySkin;
    if (currentSword === 'voidstar') return voidstarMasterySkin;
    return masterySkin;
}

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

const SWORD_DMG_MAP = { legendary: 2, kings: 3, dagger: 3, icespear: 5, dragon: 5, firemace: 10, voidstar: 7, saber: 12, ethanblade: 20, sashablade: 20, admin: 1000 };
const SWORD_NAME_MAP = { legendary: 'Legendary Sword (2 dmg)', kings: "King's Sword (3 dmg)", dagger: 'Dagger (3 dmg + Stab)', icespear: 'Ice Spear (5 dmg)', dragon: 'Dragon Sword (5 dmg)', firemace: 'Firemace (10 dmg)', voidstar: 'Void Star (7 dmg)', saber: 'Saber (12 dmg + Throw)', ethanblade: 'Ethanblade (20 dmg + Ethan Spin)', sashablade: 'Sashablade (20 dmg + Sasha Spin)', admin: 'Admin Sword (1k dmg)' };
const SWORD_COLOR_MAP = { legendary: ['rgba(200,200,255,1)', 'rgba(20,20,60,0.9)'], kings: ['rgba(255,215,0,1)', 'rgba(40,30,0,0.9)'], dagger: ['rgba(255,180,50,1)', 'rgba(60,30,0,0.9)'], icespear: ['rgba(180,220,255,1)', 'rgba(20,40,60,0.9)'], dragon: ['rgba(255,100,50,1)', 'rgba(60,10,0,0.9)'], firemace: ['rgba(255,100,20,1)', 'rgba(80,20,0,0.9)'], voidstar: ['rgba(200,140,255,1)', 'rgba(40,0,60,0.9)'], saber: ['rgba(255,70,70,1)', 'rgba(60,0,0,0.9)'], ethanblade: ['rgba(60,220,90,1)', 'rgba(0,50,10,0.9)'], sashablade: ['rgba(255,45,45,1)', 'rgba(50,0,0,0.9)'], admin: ['rgba(255,50,50,1)', 'rgba(60,0,0,0.9)'] };

function getSwordOrder() {
    const order = ['legendary', 'kings'];
    if (daggerUnlocked) order.push('dagger');
    if (iceSpearUnlocked) order.push('icespear');
    if (dragonSwordUnlocked) order.push('dragon');
    if (firemaceUnlocked) order.push('firemace');
    if (voidStarSwordUnlocked) order.push('voidstar');
    if (saberUnlocked) order.push('saber');
    if (ethanBladeEquipped) order.push('ethanblade');
    if (sashaBladeEquipped) order.push('sashablade');
    if (adminSwordEquipped) order.push('admin');
    return order;
}

function switchSword() {
    if (!kingSwordUnlocked) return;
    const order = getSwordOrder();
    const idx = order.indexOf(currentSword);
    const next = order[(idx + 1) % order.length];
    currentSword = next;
    swordDamage = SWORD_DMG_MAP[next];
    addNotification(`Switched to ${SWORD_NAME_MAP[next]}`, 2000, SWORD_COLOR_MAP[next][0], SWORD_COLOR_MAP[next][1]);
}

function getNextSwordName() {
    const order = getSwordOrder();
    const idx = order.indexOf(currentSword);
    return SWORD_NAME_MAP[order[(idx + 1) % order.length]];
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

function buildDesignRoom(free) {
    if (designRoomBuilt && !free) return;
    if (!free && goldCount < 100) return;
    if (!free) goldCount -= 100;
    designRoomBuilt = true;
    // Open corridor west wall at rows 24-25
    map[24][12] = DOOR; map[25][12] = DOOR;
    // Room: rows 22-27, cols 9-12
    for (let r = 22; r <= 27; r++)
        for (let c = 9; c <= 12; c++) map[r][c] = FLOOR;
    for (let c = 9; c <= 12; c++) { map[22][c] = WALL; map[27][c] = WALL; }
    for (let r = 22; r <= 27; r++) map[r][9] = WALL;
    map[22][12] = WALL; map[23][12] = WALL; map[26][12] = WALL; map[27][12] = WALL;
    map[24][12] = DOOR; map[25][12] = DOOR;
    // Design racks
    map[23][10] = DESIGN_RACK; map[25][10] = DESIGN_RACK;
    // Torch
    map[22][11] = TORCH;
    if (!free) addNotification('Design Room built! Switch castle themes.', 5000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
}

function isNearDesignRack() {
    if (!designRoomBuilt) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && map[r][c] === DESIGN_RACK) return true;
        }
    return false;
}

function isNearDesignRoomBuildSite() {
    if (designRoomBuilt || dragonKills === 0) return false;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const col = Math.floor(pcx / T), row = Math.floor(pcy / T);
    return row >= 23 && row <= 26 && col >= 12 && col <= 13;
}

function switchDesign() {
    const designs = ['default'];
    if (goldDesignUnlocked) designs.push('gold');
    if (voidDesignUnlocked) designs.push('void');
    if (icePalaceUnlocked) designs.push('ice');
    if (lavaDesignUnlocked) designs.push('lava');
    if (futureDesignUnlocked) designs.push('future');
    const idx = designs.indexOf(currentDesign);
    const next = designs[(idx + 1) % designs.length];
    currentDesign = next;
    const names = { default: 'Default', gold: 'Gold', void: 'Void', ice: 'Ice Palace', lava: 'Lava', future: 'Future' };
    const colors = { default: ['rgba(200,200,255,1)', 'rgba(20,20,60,0.9)'], gold: ['rgba(255,215,0,1)', 'rgba(40,30,0,0.9)'], void: ['rgba(200,140,255,1)', 'rgba(40,0,60,0.9)'], ice: ['rgba(150,210,255,1)', 'rgba(10,30,60,0.9)'], lava: ['rgba(255,120,30,1)', 'rgba(80,20,0,0.9)'], future: ['rgba(120,220,255,1)', 'rgba(10,30,50,0.9)'] };
    const c = colors[next] || colors.default;
    addNotification(`Switched to ${names[next]} design!`, 2000, c[0], c[1]);
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
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    spider.hp -= dmg;
    addNotification(`Hit! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (spider.hp <= 0) {
        spider.hp = 0;
        spider.alive = false;
        spiderDeathTime = gameTime;
        spider.maxHp += 10;
        addWeaponXP(25);
        const gld = 3 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        // Drop gold block at spider position
        const goldCol = Math.floor((spider.x + spider.width / 2) / T);
        const goldRow = Math.floor((spider.y + spider.height / 2) / T);
        map[goldRow][goldCol] = GOLD_BLOCK;
        questTasks.spiderDefeated = true; checkAllTasks();
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.spider = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.spider = true; checkSaviorQuestComplete(); }
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
            if (isAbilityInvincible()) {
                // invincible during ability
            } else if (!shieldActive) {
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
            if (isAbilityInvincible()) {
                // invincible during ability
            } else if (!shieldActive) {
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
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    seaSnake.hp -= dmg;
    addNotification(`Hit! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (seaSnake.hp <= 0) {
        seaSnake.hp = 0;
        seaSnake.alive = false;
        seaSnakeDeathTime = gameTime;
        seaSnake.maxHp += 10;
        addWeaponXP(30);
        const gld = 5 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        health.max = Math.max(health.max, 15);
        if (dragonKills === 0) health.value = health.max;
        questTasks.seaSnakeDefeated = true;
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.seaSnake = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.seaSnake = true; checkSaviorQuestComplete(); }
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

// ── Camp Member Dialogs ─────────────────────────────────────

const campScoutDialog = { active: false };
const campBlacksmithDialog = { active: false };
const campHealerDialog = { active: false };

function openCampScoutDialog() {
    campScoutDialog.active = true;
}
function advanceCampScoutDialog() {
    campScoutDialog.active = false;
}
function drawCampScoutDialog() {
    if (!campScoutDialog.active) return;
    const bw = 380, bh = 140;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#3a5a2a'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#7aaa5a';
    ctx.fillText('Scout:', bx + 16, by + 14);
    ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
    if (dragonKills > 0) {
        ctx.fillText('"The dragon is slain... but I still"', bx + 16, by + 40);
        ctx.fillText('"keep watch. Strange things stir"', bx + 16, by + 60);
        ctx.fillText('"in the void beyond the mountains."', bx + 16, by + 80);
    } else if (questTasks.trollDefeated) {
        ctx.fillText('"A dragon nests atop the peak."', bx + 16, by + 40);
        ctx.fillText('"Its fire can be seen for miles."', bx + 16, by + 60);
        ctx.fillText('"Be ready for anything up there."', bx + 16, by + 80);
    } else if (questTasks.spiderDefeated) {
        ctx.fillText('"I\'ve scouted the trails ahead."', bx + 16, by + 40);
        ctx.fillText('"There\'s a sea snake in the lake"', bx + 16, by + 60);
        ctx.fillText('"and a troll guards the mountain."', bx + 16, by + 80);
    } else {
        ctx.fillText('"I patrol these woods day and night."', bx + 16, by + 40);
        ctx.fillText('"Orc war bands have been spotted"', bx + 16, by + 60);
        ctx.fillText('"moving north. Stay on your guard."', bx + 16, by + 80);
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('E')} to close`, bx + 16, by + bh - 24);
}

function openCampBlacksmithDialog() {
    campBlacksmithDialog.active = true;
}
function advanceCampBlacksmithDialog() {
    campBlacksmithDialog.active = false;
}
function drawCampBlacksmithDialog() {
    if (!campBlacksmithDialog.active) return;
    const bw = 380, bh = 140;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#888'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#caa060';
    ctx.fillText('Blacksmith:', bx + 16, by + 14);
    ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
    if (currentSword === 'kings' || currentSword === 'dragon' || currentSword === 'voidstar' || currentSword === 'admin') {
        ctx.fillText('"That\'s a fine blade you carry!"', bx + 16, by + 40);
        ctx.fillText('"I\'ve never forged anything like it."', bx + 16, by + 60);
        ctx.fillText('"Take good care of it, Your Majesty."', bx + 16, by + 80);
    } else if (swordPickedUp) {
        ctx.fillText('"That bridge sword is decent work."', bx + 16, by + 40);
        ctx.fillText('"I keep the camp\'s weapons sharp."', bx + 16, by + 60);
        ctx.fillText('"You\'ll need a stronger blade soon."', bx + 16, by + 80);
    } else {
        ctx.fillText('"I\'m the camp blacksmith. I forge"', bx + 16, by + 40);
        ctx.fillText('"swords, shields, arrowheads..."', bx + 16, by + 60);
        ctx.fillText('"You should find yourself a weapon."', bx + 16, by + 80);
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('E')} to close`, bx + 16, by + bh - 24);
}

function openCampHealerDialog() {
    campHealerDialog.active = true;
}
function advanceCampHealerDialog() {
    campHealerDialog.active = false;
}
function drawCampHealerDialog() {
    if (!campHealerDialog.active) return;
    const bw = 380, bh = 140;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(20,10,5,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#cc3333'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#ee8888';
    ctx.fillText('Healer:', bx + 16, by + 14);
    ctx.font = '13px monospace'; ctx.fillStyle = '#fff';
    if (healPowerUnlocked) {
        ctx.fillText('"The wizard taught you well."', bx + 16, by + 40);
        ctx.fillText('"Your healing power is strong."', bx + 16, by + 60);
        ctx.fillText('"Don\'t forget to eat — food heals too."', bx + 16, by + 80);
    } else if (health.value < health.max * 0.5) {
        ctx.fillText('"You look hurt, Your Majesty!"', bx + 16, by + 40);
        ctx.fillText('"Eat some food to restore health."', bx + 16, by + 60);
        ctx.fillText('"The cook at the castle can help."', bx + 16, by + 80);
    } else {
        ctx.fillText('"I tend to the wounded here."', bx + 16, by + 40);
        ctx.fillText('"These herbs from the forest"', bx + 16, by + 60);
        ctx.fillText('"keep our soldiers fighting."', bx + 16, by + 80);
    }
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('E')} to close`, bx + 16, by + bh - 24);
}

// ── Ice Traveler Dialog & Shop ───────────────────────────────

function openIceTravelerDialog() {
    iceTravelerDialog.active = true;
    iceTravelerDialog.stage = 'greeting';
    iceTravelerShopOpen = false;
}
function advanceIceTravelerDialog() {
    if (iceTravelerShopOpen) return; // shop handles its own input
    if (iceTravelerDialog.stage === 'greeting') {
        iceTravelerDialog.stage = 'shop';
        iceTravelerShopOpen = true;
    } else {
        iceTravelerDialog.active = false;
        iceTravelerDialog.stage = null;
        iceTravelerShopOpen = false;
    }
}
function getIceTravelerShopItems() {
    const items = [];
    if (!iceSpearUnlocked) items.push({ name: 'Ice Spear (5 dmg)', cost: 20 });
    items.push({ name: 'Close', cost: 0 });
    return items;
}
let iceTravelerShopSelection = 0;
function buyIceTravelerItem() {
    const items = getIceTravelerShopItems();
    const item = items[iceTravelerShopSelection];
    if (item.name === 'Close') {
        iceTravelerDialog.active = false;
        iceTravelerDialog.stage = null;
        iceTravelerShopOpen = false;
        return;
    }
    if (snowflakeCount < item.cost) {
        addNotification('Not enough snowflakes!', 1500, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
        return;
    }
    if (item.name.startsWith('Ice Spear') && !iceSpearUnlocked) {
        snowflakeCount -= item.cost;
        iceSpearUnlocked = true;
        currentSword = 'icespear';
        swordDamage = 5;
        addNotification('Ice Spear acquired! 5 damage per hit!', 5000, 'rgba(180,220,255,1)', 'rgba(20,40,60,0.9)');
        iceTravelerDialog.active = false;
        iceTravelerDialog.stage = null;
        iceTravelerShopOpen = false;
    }
}
function drawIceTravelerDialog() {
    if (!iceTravelerDialog.active) return;
    if (iceTravelerShopOpen) { drawIceTravelerShop(); return; }
    const bw = 380, bh = 140;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;
    ctx.fillStyle = 'rgba(10,20,30,0.92)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#66aadd'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#88ccff';
    ctx.fillText('Ice Traveler:', bx + 16, by + 14);
    ctx.font = '13px monospace'; ctx.fillStyle = '#ddeeff';
    ctx.fillText('"Greetings, traveler. I come from"', bx + 16, by + 40);
    ctx.fillText('"the frozen north with rare wares."', bx + 16, by + 60);
    ctx.fillText('"Snowflakes are my currency."', bx + 16, by + 80);
    ctx.font = '11px monospace'; ctx.fillStyle = '#888';
    ctx.fillText(`${kl('E')} to browse`, bx + 16, by + bh - 24);
}
function drawIceTravelerShop() {
    const items = getIceTravelerShopItems();
    const itemH = 32;
    const headerH = 56;
    const footerH = 28;
    const maxVisible = Math.max(3, Math.floor((canvas.height - 80 - headerH - footerH) / itemH));
    const visCount = Math.min(items.length, maxVisible);
    const bw = 340, bh = headerH + visCount * itemH + footerH;
    const bx = canvas.width / 2 - bw / 2, by = canvas.height / 2 - bh / 2;

    // Scroll offset
    let scrollTop = 0;
    if (iceTravelerShopSelection >= maxVisible) scrollTop = iceTravelerShopSelection - maxVisible + 1;
    if (scrollTop > items.length - maxVisible) scrollTop = items.length - maxVisible;
    if (scrollTop < 0) scrollTop = 0;

    ctx.fillStyle = 'rgba(10,20,30,0.95)'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#66aadd'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#88ccff'; ctx.fillText('ICE TRAVELER SHOP', bx + bw / 2, by + 12);
    ctx.font = '12px monospace'; ctx.fillStyle = '#aaddff';
    ctx.fillText(`Snowflakes: ${snowflakeCount}`, bx + bw / 2, by + 36);

    // Scroll up indicator
    if (scrollTop > 0) {
        ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#88ccff';
        ctx.fillText('\u25B2 more', bx + bw / 2, by + headerH - 12);
    }

    // Items
    ctx.save();
    ctx.beginPath();
    ctx.rect(bx, by + headerH, bw, visCount * itemH);
    ctx.clip();
    ctx.font = 'bold 14px monospace';
    for (let i = scrollTop; i < Math.min(scrollTop + maxVisible, items.length); i++) {
        const iy = by + headerH + (i - scrollTop) * itemH;
        const label = items[i].cost > 0 ? `${items[i].name} — ${items[i].cost} flakes` : items[i].name;
        if (i === iceTravelerShopSelection) {
            ctx.fillStyle = 'rgba(100,180,255,0.25)'; ctx.fillRect(bx + 16, iy, bw - 32, itemH - 4);
            ctx.fillStyle = '#88ccff'; ctx.fillText('> ' + label + ' <', bx + bw / 2, iy + 5);
        } else {
            ctx.fillStyle = '#ccc'; ctx.fillText(label, bx + bw / 2, iy + 5);
        }
    }
    ctx.restore();

    // Scroll down indicator
    if (scrollTop + maxVisible < items.length) {
        ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#88ccff';
        ctx.fillText('\u25BC more', bx + bw / 2, by + headerH + visCount * itemH + 2);
    }

    ctx.font = '11px monospace'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText(`${kl('nav')} to choose, ${kl('E')} to buy`, bx + bw / 2, by + bh - 16);
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
            if (isSnowing() && jackFrostQuestActive) { jackFrostKills.orcs = true; checkJackFrostQuestComplete(); }
            if (inFutureWorld && saviorQuestActive) { saviorKills.orcs = true; checkSaviorQuestComplete(); }
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
                if (isAbilityInvincible()) {
                    // invincible during ability
                } else if (!shieldActive) {
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

// ── Friendly Orcs ────────────────────────────────────────────
function findNearestEnemyForOrc(cx, cy, range) {
    let nearest = null, bestD = range;
    function tryMob(m) {
        if (!m || !m.alive) return;
        const mcx = m.x + m.width / 2, mcy = m.y + m.height / 2;
        const d = Math.hypot(cx - mcx, cy - mcy);
        if (d < bestD) { bestD = d; nearest = m; }
    }
    if (typeof spider !== 'undefined' && spider.active) tryMob(spider);
    if (typeof seaSnake !== 'undefined' && seaSnake.active) tryMob(seaSnake);
    if (typeof troll !== 'undefined') tryMob(troll);
    if (typeof dragon !== 'undefined') tryMob(dragon);
    if (typeof voidSentinel !== 'undefined' && inArena) tryMob(voidSentinel);
    if (typeof lavaMonster !== 'undefined' && inLavaZone) tryMob(lavaMonster);
    if (typeof orcs !== 'undefined') for (const o of orcs) tryMob(o);
    return nearest;
}

// Detect a projectile striking the defense ring (dragon fire/ice line, or volcano fireballs).
function circleProjectileThreat(aliveList) {
    if (typeof dragon !== 'undefined' && dragon.alive && dragon.firing) {
        const dcx = dragon.x + dragon.width / 2, dcy = dragon.y + dragon.height / 2;
        for (const f of aliveList) {
            if (pointToSegmentDist(f.x + f.width / 2, f.y + f.height / 2, dcx, dcy, dragon.fireTargetX, dragon.fireTargetY) < T) return true;
        }
    }
    if (typeof activeFireballs !== 'undefined') {
        for (const fb of activeFireballs) {
            const fbx = (fb.col + 1) * T, fby = (fb.row + 1) * T;
            for (const f of aliveList) {
                if (Math.hypot((f.x + f.width / 2) - fbx, (f.y + f.height / 2) - fby) < T * 1.2) return true;
            }
        }
    }
    return false;
}

// Defense ring acts as a wall: shove enemies back out of the circle.
function blockEnemiesFromCircle(aliveList) {
    if (aliveList.length < 2) return; // need enough orcs to form a real ring
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const ringR = orcCircleRadius(aliveList.length);
    function block(m) {
        if (!m || !m.alive) return;
        const dx = (m.x + m.width / 2) - pcx, dy = (m.y + m.height / 2) - pcy;
        const dist = Math.hypot(dx, dy);
        const minR = ringR + m.width / 2;
        if (dist < minR && dist > 0.001) {
            const push = minR - dist;
            m.x += (dx / dist) * push;
            m.y += (dy / dist) * push;
        }
    }
    if (typeof spider !== 'undefined' && spider.active) block(spider);
    if (typeof seaSnake !== 'undefined' && seaSnake.active) block(seaSnake);
    if (typeof troll !== 'undefined') block(troll);
    if (typeof dragon !== 'undefined') block(dragon);
    if (typeof lavaMonster !== 'undefined' && inLavaZone) block(lavaMonster);
    if (typeof orcs !== 'undefined') for (const o of orcs) block(o);
}

function updateFriendlyOrcs(dt) {
    if (commanderMode.active) {
        if (!friendlyOrcs.some(o => o.alive)) { endCommanderMode('The orcs have fallen. Command ends.'); return; }
        updateCommanderMode(dt);
        return;
    }
    if (!friendlyOrcs.length) return;
    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const aliveList = friendlyOrcs.filter(o => o.alive);

    // Defense Circle: provocation + aggro timer
    if (orcFormation === 'circle') {
        if (!orcCircleAggro.active && circleProjectileThreat(aliveList)) {
            provokeOrcCircle(findNearestEnemyForOrc(pcx, pcy, T * 16));
        }
        if (orcCircleAggro.active) {
            const t = orcCircleAggro.target;
            if (!t || !t.alive || gameTime > orcCircleAggro.until) {
                orcCircleAggro.active = false; orcCircleAggro.target = null;
            }
        }
    }

    for (const f of aliveList) {
        const fcx = f.x + f.width / 2, fcy = f.y + f.height / 2;
        f.speed = player.speed; // match player speed live
        // Condemned orcs flee from the nearest executioner until cut down.
        if (f.condemned) {
            let ex = null, bd = Infinity;
            for (const g of executioners) {
                const d = Math.hypot((g.x + g.width / 2) - fcx, (g.y + g.height / 2) - fcy);
                if (d < bd) { bd = d; ex = g; }
            }
            if (ex) {
                const dx = fcx - (ex.x + ex.width / 2), dy = fcy - (ex.y + ex.height / 2);
                const dist = Math.hypot(dx, dy) || 1;
                // Living orcs can't run through walls — axis-separated collision
                const mx = (dx / dist) * f.speed * dt, my = (dy / dist) * f.speed * dt;
                if (!isNPCBlocked(f.x + mx, f.y, f.width, f.height)) f.x += mx;
                if (!isNPCBlocked(f.x, f.y + my, f.width, f.height)) f.y += my;
            }
            if (f.hp <= 0) f.alive = false;
            continue;
        }
        // Pick a target: Delta/Square auto-engage; Circle only hunts when provoked.
        let target;
        if (orcFormation === 'circle') {
            target = orcCircleAggro.active ? orcCircleAggro.target : null;
        } else {
            target = findNearestEnemyForOrc(fcx, fcy, FRIENDLY_ORC_DETECT_RANGE);
        }
        f.target = target;
        if (target && target.alive) {
            const tcx = target.x + target.width / 2, tcy = target.y + target.height / 2;
            const dx = tcx - fcx, dy = tcy - fcy;
            const dist = Math.hypot(dx, dy);
            if (dist > T * 0.9) {
                f.x += (dx / dist) * f.speed * dt;
                f.y += (dy / dist) * f.speed * dt;
            } else if (gameTime - f.lastAttack >= f.attackCooldown) {
                f.lastAttack = gameTime;
                const playerDmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
                f.damage = Math.max(1, playerDmg);
                target.hp -= f.damage;
                if (target.hp <= 0) {
                    // Killing blow is "free" — orc doesn't suicide finishing a target
                    target.hp = 0;
                    handleStabKill(target);
                } else {
                    f.hp -= 1; // retaliation cost on non-fatal hits
                }
            }
        } else {
            // Follow player in formation slot (Delta grid / Square diamond / Circle ring)
            const slotPos = orcFormationSlotPosition(f, aliveList);
            const dx = slotPos.x - fcx, dy = slotPos.y - fcy;
            const dist = Math.hypot(dx, dy);
            if (dist > 3) {
                const step = Math.min(dist, f.speed * dt);
                f.x += (dx / dist) * step;
                f.y += (dy / dist) * step;
            }
        }
        // Player separation — never overlap the player
        const sepCx = f.x + f.width / 2, sepCy = f.y + f.height / 2;
        const pdx = sepCx - pcx, pdy = sepCy - pcy;
        const pdist = Math.hypot(pdx, pdy);
        const minDist = (f.width + player.width) / 2 + 2;
        if (pdist < minDist && pdist > 0.001) {
            const push = (minDist - pdist);
            f.x += (pdx / pdist) * push;
            f.y += (pdy / pdist) * push;
        } else if (pdist <= 0.001) {
            f.x += T * 0.5;
        }
        if (f.hp <= 0) f.alive = false;
    }
    // While holding the ring, keep enemies from passing through it.
    if (orcFormation === 'circle' && !orcCircleAggro.active) blockEnemiesFromCircle(aliveList);
    friendlyOrcs = friendlyOrcs.filter(o => o.alive);
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
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    nearest.hp -= dmg;
    addNotification(`Hit orc! -${dmg} HP`, 600, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (nearest.hp <= 0) {
        nearest.hp = 0;
        nearest.alive = false;
        addWeaponXP(10);
        const gld = 2 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1200, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
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
            if (isAbilityInvincible()) {
                // invincible during ability
            } else if (shieldActive) {
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
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    troll.hp -= dmg;
    addNotification(`Hit troll! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (troll.hp <= 0) {
        troll.hp = 0;
        troll.alive = false;
        trollDeathTime = gameTime;
        troll.maxHp += 10;
        addWeaponXP(45);
        const gld = 8 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        health.max = Math.max(health.max, 30);
        if (dragonKills === 0) health.value = health.max;
        questTasks.trollDefeated = true;
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.troll = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.troll = true; checkSaviorQuestComplete(); }
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
        addNotification(isSnowing() ? 'The Ice Dragon has appeared!' : 'The dragon has returned!', 5000,
        isSnowing() ? 'rgba(100,180,255,1)' : 'rgba(255,100,100,1)',
        isSnowing() ? 'rgba(10,30,60,0.9)' : 'rgba(80,0,0,0.9)');
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
        // Check if player is hit by fire/ice line
        if (!dragon.fireHit) {
            const dist = pointToSegmentDist(pcx, pcy, dcx, dcy, dragon.fireTargetX, dragon.fireTargetY);
            if (dist < T * 0.8) {
                if (isAbilityInvincible()) {
                    // invincible during ability
                } else if (shieldActive) {
                    dragon.stunned = true;
                    dragon.stunUntil = gameTime + 4000;
                    addNotification(isSnowing() ? 'Shield blocks the ice! Dragon stunned!' : 'Shield blocks the fire! Dragon stunned!', 2000, 'rgba(100,150,255,1)', 'rgba(0,20,60,0.8)');
                } else if (isSnowing()) {
                    // Ice ball traps the player
                    startIceTrap();
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
            if (isAbilityInvincible()) {
                // invincible during ability
            } else if (shieldActive) {
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
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    dragon.hp -= dmg;
    addNotification(`Hit dragon! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (dragon.hp <= 0) {
        dragon.hp = 0;
        dragon.alive = false;
        dragonKills++;
        addWeaponXP(100);
        const gld = 15 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        dragon.maxHp += 30;
        dragonRespawnTime = gameTime + DRAGON_RESPAWN_DELAY;
        if (dragonKills === 1) {
            kingSwordUnlocked = true;
            currentSword = 'kings'; swordDamage = 3;
            addNotification("King's Sword unlocked! 3 damage per hit!", 6000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
            addNotification('Build new rooms at the castle with gold!', 5000, 'rgba(200,200,255,1)', 'rgba(20,20,60,0.9)');
        }
        if (!goldDesignUnlocked) {
            goldDesignUnlocked = true;
            addNotification('Gold design unlocked!', 4000, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.9)');
        }
        respawnMonsters();
        questTasks.dragonDefeated = true;
        if (isSnowing() && jackFrostQuestActive) { jackFrostKills.dragon = true; checkJackFrostQuestComplete(); }
        if (inFutureWorld && saviorQuestActive) { saviorKills.dragon = true; checkSaviorQuestComplete(); }
        addNotification('The dragon is slain!', 8000, 'rgba(255,215,0,1)', 'rgba(60,40,0,0.9)');
        addNotification('All monsters have respawned!', 5000, 'rgba(255,150,100,1)', 'rgba(60,20,0,0.85)');
        addNotification('Dragon returns in 2 minutes...', 4000, 'rgba(200,100,100,1)', 'rgba(60,0,0,0.8)');
    }
}

// ── Noli Combat System ──────────────────────────────────────

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
                if (isAbilityInvincible()) {
                    // invincible during ability
                } else if (shieldActive) {
                    voidSentinel.stunned = true;
                    voidSentinel.stunUntil = gameTime + 2000;
                    voidSentinel.dashState = 'idle';
                    voidSentinel.lastDashTime = gameTime;
                    addNotification('Shield blocks the dash!', 1500, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.8)');
                    return;
                } else {
                    health.value = Math.max(0, health.value - 10);
                    addNotification('Sentinel dash! -10 HP', 1000, 'rgba(200,100,255,1)', 'rgba(40,0,60,0.8)');
                }
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
                if (isAbilityInvincible()) {
                    // invincible during ability
                } else if (shieldActive) {
                    voidSentinel.stunned = true;
                    voidSentinel.stunUntil = gameTime + 2000;
                    voidSentinel.dashState = 'idle';
                    voidSentinel.lastDashTime = gameTime;
                    addNotification('Shield blocks the dash!', 1500, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.8)');
                    return;
                } else {
                    health.value = Math.max(0, health.value - 10);
                    addNotification('Sentinel dash! -10 HP', 1000, 'rgba(200,100,255,1)', 'rgba(40,0,60,0.8)');
                }
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
            if (isAbilityInvincible()) {
                // invincible during ability
            } else if (shieldActive) {
                voidSentinel.stunned = true;
                voidSentinel.stunUntil = gameTime + 2000;
                addNotification('Shield stuns the Sentinel!', 1500, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.8)');
            } else {
                health.value = Math.max(0, health.value - voidSentinel.damage);
                addNotification('Noli strikes! -' + voidSentinel.damage + ' HP', 800, 'rgba(200,100,255,1)', 'rgba(40,0,60,0.8)');
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
        addNotification('Noli awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
    }
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    voidSentinel.hp -= dmg;
    addNotification(`Hit Sentinel! -${dmg} HP`, 800, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.8)');
    if (voidSentinel.hp <= 0) {
        voidSentinel.hp = 0;
        voidSentinel.alive = false;
        voidSentinel.aggro = false;
        voidSentinelDeathTime = gameTime;
        voidSentinel.maxHp = 2500;
        addWeaponXP(1000);
        const gld = 15 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        if (!voidQuestNoliDefeated) voidQuestNoliDefeated = true;
        addNotification('Noli is defeated!', 5000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
        if (!voidStarSwordUnlocked) {
            voidStarSwordUnlocked = true;
            currentSword = 'voidstar'; swordDamage = 7;
            addNotification('Void Star sword acquired! 7 dmg + Void Rush!', 6000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
            addNotification('Press R to use Void Rush when equipped!', 5000, 'rgba(180,100,255,1)', 'rgba(40,0,60,0.85)');
        }
        if (!voidDesignUnlocked) {
            voidDesignUnlocked = true;
            addNotification('Void design unlocked!', 4000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
        }
        dropSnowflakes(); tempt();
    }
}

// ── Void Rush (player dash ability) ─────────────────────────
let voidRushDmg1 = 20;
let voidRushDmg2 = 30;

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
    provokeOrcCircle(null); // rally the defense ring
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
            voidRushHitEnemies(voidRushDmg1 * getRingMultiplier());
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
            if (inLavaZone && lavaMonster.alive) checkTarget2(lavaMonster.x + lavaMonster.width / 2, lavaMonster.y + lavaMonster.height / 2, true);
            if (tx2 !== null) { voidRush.targetX = tx2; voidRush.targetY = ty2; }
            else { voidRush.state = 'idle'; voidRush.lastUseTime = gameTime; abilityInvincibleUntil = gameTime + ABILITY_INVINCIBLE_GRACE; }
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
            voidRushHitEnemies(voidRushDmg2 * getRingMultiplier());
        } else {
            voidRush.state = 'idle';
            voidRush.lastUseTime = gameTime;
            abilityInvincibleUntil = gameTime + ABILITY_INVINCIBLE_GRACE;
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
    if (inArena && voidSentinel.alive) {
        tryHit(voidSentinel, 1.8, 'sentinel');
        if (!voidSentinel.aggro && voidRush.hitSet.has('sentinel')) {
            voidSentinel.aggro = true;
            addNotification('Noli awakens!', 3000, 'rgba(200,140,255,1)', 'rgba(40,0,60,0.9)');
        }
    }
    if (spider.alive && spider.active) tryHit(spider, 1.5, 'spider');
    if (typeof seaSnake !== 'undefined' && seaSnake.alive && seaSnake.active) tryHit(seaSnake, 1.5, 'seasnake');
    if (troll.alive) tryHit(troll, 1.5, 'troll');
    if (dragon.alive) tryHit(dragon, 1.8, 'dragon');
    if (typeof orcs !== 'undefined') for (let i = 0; i < orcs.length; i++) { if (orcs[i].alive) tryHit(orcs[i], 1.5, 'orc' + i); }
    if (inLavaZone && lavaMonster.alive) {
        tryHit(lavaMonster, 1.8, 'lavaMonster');
        if (!lavaMonster.aggro && voidRush.hitSet.has('lavaMonster')) {
            lavaMonster.aggro = true;
            addNotification('The Lava Monster awakens!', 3000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
        }
    }
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

// ── Lava Monster Combat ─────────────────────────────────────

const LAVA_TRAIL_DURATION = 3000;
const LAVA_TRAIL_DMG = 1;
const LAVA_TRAIL_TICK = 500;
let lavaTrailLastDmg = 0;
const LAVA_MONSTER_SPIN_DURATION = 800;
const LAVA_MONSTER_SPIN_RANGE = 72;

function updateLavaMonster(dt) {
    // Respawn after death
    if (!lavaMonster.alive && lavaMonsterDeathTime > 0 && gameTime >= lavaMonsterDeathTime + MOB_RESPAWN_DELAY) {
        lavaMonster.hp = lavaMonster.maxHp; lavaMonster.alive = true;
        lavaMonster.x = 14 * T; lavaMonster.y = 270 * T;
        lavaMonster.aggro = false;
        lavaMonster.spinning = false; lavaMonster.lastSpinTime = -Infinity;
        lavaMonster.trail = [];
        lavaMonsterDeathTime = -Infinity;
    }
    if (!lavaMonster.alive) return;
    if (!inLavaZone) return;
    if (!lavaMonster.aggro) return;

    const pcx = player.x + player.width / 2, pcy = player.y + player.height / 2;
    const mcx = lavaMonster.x + lavaMonster.width / 2, mcy = lavaMonster.y + lavaMonster.height / 2;
    const dist = Math.hypot(pcx - mcx, pcy - mcy);

    // Handle spinning attack
    if (lavaMonster.spinning) {
        const elapsed = gameTime - lavaMonster.spinStart;
        if (elapsed >= LAVA_MONSTER_SPIN_DURATION) {
            lavaMonster.spinning = false;
            return;
        }
        // Damage player if in range (once per spin)
        if (!lavaMonster.spinHit && dist < LAVA_MONSTER_SPIN_RANGE && !isAbilityInvincible()) {
            if (!shieldActive) {
                health.value -= lavaMonster.spinDmg;
                addNotification(`Lava Spin! -${lavaMonster.spinDmg} HP`, 1500, 'rgba(255,60,0,1)', 'rgba(80,0,0,0.9)');
                lavaMonster.spinHit = true;
            }
        }
        return;
    }

    // Try special attack (mace spin)
    if (dist < T * 3 && gameTime - lavaMonster.lastSpinTime >= lavaMonster.spinCooldown) {
        lavaMonster.spinning = true;
        lavaMonster.spinStart = gameTime;
        lavaMonster.lastSpinTime = gameTime;
        lavaMonster.spinHit = false;
        return;
    }

    // Chase player
    if (dist > T * 0.8) {
        const dx = pcx - mcx, dy = pcy - mcy;
        const nd = Math.hypot(dx, dy);
        lavaMonster.x += (dx / nd) * lavaMonster.speed * dt;
        lavaMonster.y += (dy / nd) * lavaMonster.speed * dt;
    }

    // Drop fire trail
    if (gameTime - lavaMonster.lastTrailDrop >= lavaMonster.trailInterval) {
        lavaMonster.trail.push({ x: lavaMonster.x + lavaMonster.width / 2, y: lavaMonster.y + lavaMonster.height / 2, time: gameTime });
        lavaMonster.lastTrailDrop = gameTime;
    }

    // Expire old trail
    lavaMonster.trail = lavaMonster.trail.filter(t => gameTime - t.time < LAVA_TRAIL_DURATION);

    // Trail damages player
    if (!isAbilityInvincible() && !shieldActive && gameTime - lavaTrailLastDmg >= LAVA_TRAIL_TICK) {
        for (const t of lavaMonster.trail) {
            if (Math.hypot(pcx - t.x, pcy - t.y) < T * 0.6) {
                health.value -= LAVA_TRAIL_DMG;
                addNotification(`Burning! -${LAVA_TRAIL_DMG} HP`, 800, 'rgba(255,150,30,1)', 'rgba(80,30,0,0.8)');
                lavaTrailLastDmg = gameTime;
                break;
            }
        }
    }

    // Melee attack
    if (dist < T * 1.2 && gameTime - lavaMonster.lastAttack >= lavaMonster.attackCooldown) {
        if (!isAbilityInvincible() && !shieldActive) {
            health.value -= lavaMonster.damage;
            addNotification(`Lava Monster hits! -${lavaMonster.damage} HP`, 1000, 'rgba(255,80,20,1)', 'rgba(80,10,0,0.9)');
            lavaMonster.lastAttack = gameTime;
        }
    }
}

function hitLavaMonster() {
    if (!swordPickedUp || !lavaMonster.alive) return;
    if (!isNearLavaMonster()) return;
    if (!inLavaZone) return;
    if (gameTime - playerAttackCooldown < PLAYER_ATTACK_RATE) return;
    playerAttackCooldown = gameTime;
    const dmg = swordDamage * getVoidMultiplier() * getRingMultiplier();
    lavaMonster.hp -= dmg;
    if (!lavaMonster.aggro) {
        lavaMonster.aggro = true;
        addNotification('The Lava Monster awakens!', 3000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
    }
    addNotification(`Hit Lava Monster! -${dmg} HP`, 800, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
    if (lavaMonster.hp <= 0) {
        lavaMonster.hp = 0;
        lavaMonster.alive = false;
        lavaMonsterDeathTime = gameTime;
        lavaMonster.trail = [];
        addWeaponXP(150);
        const gld = 20 * getVoidMultiplier();
        goldCount += gld;
        addNotification(`+${gld} Gold`, 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
        dropSnowflakes(); tempt();
        if (!firemaceUnlocked) {
            firemaceUnlocked = true; currentSword = 'firemace'; swordDamage = 10;
            addNotification('Firemace unlocked! 10 damage per hit!', 8000, 'rgba(255,100,20,1)', 'rgba(80,20,0,0.95)');
        }
        if (!lavaDesignUnlocked) { lavaDesignUnlocked = true; addNotification('Lava design unlocked!', 4000, 'rgba(255,120,30,1)', 'rgba(80,20,0,0.9)'); }
        addNotification('The Lava Monster is defeated!', 5000, 'rgba(255,200,50,1)', 'rgba(80,40,0,0.9)');
    }
}
