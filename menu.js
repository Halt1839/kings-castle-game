// ── Main Menu ───────────────────────────────────────────────

let menuSelection = 0;
let slotSelection = 0;

function getSaves() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; }
}

function getLastSlot() {
    return localStorage.getItem(LAST_SLOT_KEY) || null;
}

function saveGame(slot) {
    const saves = getSaves();
    saves[slot] = {
        player: { x: player.x, y: player.y },
        hunger: { value: hunger.value, lastDeplete: hunger.lastDeplete },
        health: { value: health.value, lastDamage: health.lastDamage },
        bathroom: { ...bathroom },
        cooking: {
            active: cookingState.active, startTime: cookingState.startTime,
            meal: cookingState.meal, dessert: cookingState.dessert,
            done: cookingState.done, doneAcknowledged: cookingState.doneAcknowledged,
        },
        questTasks: { ...questTasks },
        messenger: { x: messenger.x, y: messenger.y, arrived: messenger.arrived, messageRead: messenger.messageRead, active: messenger.active },
        swordPickedUp,
        secretPassageOpen,
        hasGold,
        wizardQuestStage,
        spider: { hp: spider.hp, maxHp: spider.maxHp, alive: spider.alive, active: spider.active, deathTime: spiderDeathTime },
        seaSnake: { hp: seaSnake.hp, maxHp: seaSnake.maxHp, alive: seaSnake.alive, active: seaSnake.active, x: seaSnake.x, y: seaSnake.y, deathTime: seaSnakeDeathTime },
        inBoat,
        butlerFarewell: { triggered: butlerState.farewellTriggered, ready: butlerState.farewellReady },
        orcSiege: { active: orcSiege.active, complete: orcSiege.complete, shieldGiven: orcSiege.shieldGiven },
        shieldUnlocked,
        lastShieldTime,
        healPowerUnlocked,
        lastHealTime,
        troll: { hp: troll.hp, maxHp: troll.maxHp, alive: troll.alive, deathTime: trollDeathTime },
        peakPassageOpen,
        dragon: { x: dragon.x, y: dragon.y, hp: dragon.hp, maxHp: dragon.maxHp, alive: dragon.alive, fireTimer: dragon.fireTimer },
        goldCount,
        swordDamage,
        currentSword,
        kingSwordUnlocked,
        dragonSwordUnlocked,
        weaponryBuilt,
        guestRoomBuilt,
        dragonKills,
        dragonRespawnTime,
        npcCongrats: { ...npcCongrats },
        hungerMax: hunger.max,
        healthMax: health.max,
        voidStarSwordUnlocked,
        voidStarUnlocked,
        lastVoidStarTime,
        deathCount,
        inArena,
        arenaReturnX,
        arenaReturnY,
        designRoomBuilt,
        currentDesign,
        goldDesignUnlocked,
        voidDesignUnlocked,
        voidSentinel: { x: voidSentinel.x, y: voidSentinel.y, hp: voidSentinel.hp, maxHp: voidSentinel.maxHp, alive: voidSentinel.alive, aggro: voidSentinel.aggro, deathTime: voidSentinelDeathTime },
        activeQuest,
        voidQuestFoundEntrance,
        voidQuestNoliDefeated,
        gameTime,
        savedAt: new Date().toLocaleString(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
    localStorage.setItem(LAST_SLOT_KEY, slot);
}

function loadGame(slot) {
    const saves = getSaves();
    const s = saves[slot];
    if (!s) return false;
    player.x = s.player.x; player.y = s.player.y;
    hunger.value = s.hunger.value; hunger.lastDeplete = s.hunger.lastDeplete;
    health.value = s.health.value; health.lastDamage = s.health.lastDamage;
    Object.assign(bathroom, s.bathroom);
    Object.assign(cookingState, s.cooking);
    if (s.questTasks) Object.assign(questTasks, s.questTasks);
    if (s.messenger) {
        messenger.x = s.messenger.x; messenger.y = s.messenger.y;
        messenger.arrived = s.messenger.arrived; messenger.messageRead = s.messenger.messageRead;
        messenger.active = s.messenger.active;
    }
    if (s.swordPickedUp !== undefined) swordPickedUp = s.swordPickedUp;
    if (swordPickedUp) { map[39][14] = BRIDGE; map[39][15] = BRIDGE; }
    if (s.secretPassageOpen !== undefined) { secretPassageOpen = s.secretPassageOpen; if (secretPassageOpen) openSecretPassage(); }
    if (s.hasGold !== undefined) hasGold = s.hasGold;
    if (s.wizardQuestStage !== undefined) wizardQuestStage = s.wizardQuestStage;
    if (s.spider) { spider.hp = s.spider.hp; if (s.spider.maxHp) spider.maxHp = s.spider.maxHp; spider.alive = s.spider.alive; spider.active = s.spider.active; if (s.spider.deathTime !== undefined) spiderDeathTime = s.spider.deathTime; }
    if (s.seaSnake) { seaSnake.hp = s.seaSnake.hp; if (s.seaSnake.maxHp) seaSnake.maxHp = s.seaSnake.maxHp; seaSnake.alive = s.seaSnake.alive; seaSnake.active = s.seaSnake.active; seaSnake.x = s.seaSnake.x; seaSnake.y = s.seaSnake.y; if (s.seaSnake.deathTime !== undefined) seaSnakeDeathTime = s.seaSnake.deathTime; }
    if (s.inBoat !== undefined) inBoat = s.inBoat;
    if (s.butlerFarewell) { butlerState.farewellTriggered = s.butlerFarewell.triggered; butlerState.farewellReady = s.butlerFarewell.ready; }
    if (s.orcSiege) {
        orcSiege.active = s.orcSiege.active;
        orcSiege.complete = s.orcSiege.complete; orcSiege.shieldGiven = s.orcSiege.shieldGiven;
    }
    if (s.shieldUnlocked !== undefined) shieldUnlocked = s.shieldUnlocked;
    if (s.lastShieldTime !== undefined) lastShieldTime = s.lastShieldTime;
    orcs = [];
    guardCombat.active = false; guard1.x = guardCombat.guard1Home.x; guard1.y = guardCombat.guard1Home.y;
    guard2.x = guardCombat.guard2Home.x; guard2.y = guardCombat.guard2Home.y;
    if (s.healPowerUnlocked !== undefined) healPowerUnlocked = s.healPowerUnlocked;
    if (s.lastHealTime !== undefined) lastHealTime = s.lastHealTime;
    if (s.troll) { troll.hp = s.troll.hp; if (s.troll.maxHp) troll.maxHp = s.troll.maxHp; troll.alive = s.troll.alive; if (s.troll.deathTime !== undefined) trollDeathTime = s.troll.deathTime; }
    if (s.peakPassageOpen !== undefined) { peakPassageOpen = s.peakPassageOpen; if (peakPassageOpen) openPeakPassage(); }
    if (s.dragon) {
        dragon.x = s.dragon.x; dragon.y = s.dragon.y; dragon.hp = s.dragon.hp; dragon.alive = s.dragon.alive;
        dragon.fireTimer = s.dragon.fireTimer || 0;
        if (s.dragon.maxHp !== undefined) dragon.maxHp = s.dragon.maxHp;
    }
    if (s.goldCount !== undefined) goldCount = s.goldCount;
    if (s.swordDamage !== undefined) swordDamage = s.swordDamage;
    if (s.currentSword !== undefined) currentSword = s.currentSword;
    if (s.kingSwordUnlocked !== undefined) kingSwordUnlocked = s.kingSwordUnlocked;
    if (s.dragonSwordUnlocked !== undefined) dragonSwordUnlocked = s.dragonSwordUnlocked;
    if (s.weaponryBuilt !== undefined) { weaponryBuilt = false; if (s.weaponryBuilt) buildWeaponryRoom(true); }
    const savedGuestRoom = s.guestRoomBuilt !== undefined ? s.guestRoomBuilt : s.courtyardBuilt;
    if (savedGuestRoom !== undefined) { guestRoomBuilt = false; if (savedGuestRoom) buildGuestRoom(true); }
    if (s.designRoomBuilt !== undefined) { designRoomBuilt = false; if (s.designRoomBuilt) buildDesignRoom(true); }
    if (s.currentDesign !== undefined) currentDesign = s.currentDesign;
    if (s.goldDesignUnlocked !== undefined) goldDesignUnlocked = s.goldDesignUnlocked;
    if (s.voidDesignUnlocked !== undefined) voidDesignUnlocked = s.voidDesignUnlocked;
    if (s.dragonKills !== undefined) dragonKills = s.dragonKills;
    if (s.dragonRespawnTime !== undefined) dragonRespawnTime = s.dragonRespawnTime;
    if (s.npcCongrats) { npcCongrats.cook = s.npcCongrats.cook || 0; npcCongrats.butler = s.npcCongrats.butler || 0; npcCongrats.wizard = s.npcCongrats.wizard || 0; npcCongrats.campLeader = s.npcCongrats.campLeader || 0; }
    if (s.hungerMax !== undefined) hunger.max = s.hungerMax;
    if (s.healthMax !== undefined) health.max = s.healthMax;
    if (s.voidStarSwordUnlocked !== undefined) voidStarSwordUnlocked = s.voidStarSwordUnlocked;
    if (s.voidStarUnlocked !== undefined) voidStarUnlocked = s.voidStarUnlocked;
    if (s.lastVoidStarTime !== undefined) lastVoidStarTime = s.lastVoidStarTime;
    voidStarActive = false;
    if (s.deathCount !== undefined) deathCount = s.deathCount;
    if (s.inArena !== undefined) inArena = s.inArena;
    if (s.arenaReturnX !== undefined) arenaReturnX = s.arenaReturnX;
    if (s.arenaReturnY !== undefined) arenaReturnY = s.arenaReturnY;
    if (s.voidSentinel) {
        voidSentinel.x = s.voidSentinel.x; voidSentinel.y = s.voidSentinel.y;
        voidSentinel.hp = s.voidSentinel.hp; voidSentinel.alive = s.voidSentinel.alive;
        voidSentinel.aggro = s.voidSentinel.aggro || false;
        if (s.voidSentinel.maxHp) voidSentinel.maxHp = s.voidSentinel.maxHp;
        if (s.voidSentinel.deathTime !== undefined) voidSentinelDeathTime = s.voidSentinel.deathTime;
    }
    if (s.activeQuest !== undefined) activeQuest = s.activeQuest;
    if (s.voidQuestFoundEntrance !== undefined) voidQuestFoundEntrance = s.voidQuestFoundEntrance;
    if (s.voidQuestNoliDefeated !== undefined) voidQuestNoliDefeated = s.voidQuestNoliDefeated;
    // Restore gold block on map if spider defeated but gold not yet picked up
    if (questTasks.spiderDefeated && !hasGold && !questTasks.gaveGold) {
        const goldCol = Math.floor((spider.x + spider.width / 2) / T);
        const goldRow = Math.floor((spider.y + spider.height / 2) / T);
        map[goldRow][goldCol] = GOLD_BLOCK;
    }
    gameTime = s.gameTime;
    localStorage.setItem(LAST_SLOT_KEY, slot);
    return true;
}

let currentSlot = null;

function newGame(slot) {
    player.x = 14.5 * T; player.y = 6 * T;
    hunger.value = 10; hunger.lastDeplete = 0;
    health.value = 10; health.lastDamage = 0;
    bathroom.needsToGo = false; bathroom.needStartTime = 0;
    bathroom.lastAteTime = -Infinity; bathroom.hasAte = false; bathroom.pooped = false;
    cookingState.active = false; cookingState.done = false; cookingState.doneAcknowledged = false;
    cookingState.meal = null; cookingState.dessert = null;
    butlerState.fetching = false;
    activeAction = null; dialog.active = false; butlerDialog.active = false;
    questTasks.ateFood = false; questTasks.usedBathroom = false;
    questTasks.talkedCook = false; questTasks.talkedButler = false;
    questTasks.satThrone = false; questTasks.sleptBed = false;
    questTasks.usedToilet = false; questTasks.prepComplete = false;
    questTasks.findSword = false; questTasks.spiderDefeated = false;
    questTasks.gaveGold = false; questTasks.seaSnakeDefeated = false;
    questTasks.campHelped = false; questTasks.trollDefeated = false;
    questTasks.dragonDefeated = false; questTasks.allComplete = false;
    messenger.active = false; messenger.arrived = false; messenger.messageRead = false;
    messenger.y = 44 * T; swordPickedUp = false;
    secretPassageOpen = false; hasGold = false; wizardQuestStage = 'none';
    spider.hp = 20; spider.maxHp = 20; spider.alive = true; spider.active = false; spider.lastAttack = 0; spider.stunned = false; spider.stunUntil = 0; spiderDeathTime = -Infinity;
    seaSnake.hp = 40; seaSnake.maxHp = 40; seaSnake.alive = true; seaSnake.active = false; seaSnake.stunned = false; seaSnake.stunUntil = 0; seaSnakeDeathTime = -Infinity;
    seaSnake.x = 14 * T; seaSnake.y = 100 * T; seaSnake.lastAttack = 0;
    inBoat = false;
    orcSiege.active = false; orcSiege.complete = false; orcSiege.shieldGiven = false;
    orcs = [];
    guardCombat.active = false; guard1.x = guardCombat.guard1Home.x; guard1.y = guardCombat.guard1Home.y;
    guard2.x = guardCombat.guard2Home.x; guard2.y = guardCombat.guard2Home.y;
    shieldUnlocked = false; shieldActive = false; lastShieldTime = -Infinity;
    campLeaderDialog.active = false; campLeaderDialog.stage = null;
    wizardDialog.active = false; wizardDialog.stage = null;
    butlerState.farewellTriggered = false; butlerState.farewellReady = false;
    healPowerUnlocked = false; lastHealTime = -Infinity;
    troll.hp = 60; troll.maxHp = 60; troll.alive = true; troll.stunned = false; troll.stunUntil = 0; trollDeathTime = -Infinity;
    peakPassageOpen = false;
    dragon.x = 15 * T; dragon.y = 180 * T; dragon.hp = 140; dragon.maxHp = 140; dragon.alive = true;
    dragon.fireTimer = 0; dragon.windingUp = false; dragon.firing = false;
    dragon.stunned = false; dragon.stunUntil = 0;
    goldCount = 0; swordDamage = 2; currentSword = 'legendary'; kingSwordUnlocked = false; dragonSwordUnlocked = false;
    weaponryBuilt = false; guestRoomBuilt = false; designRoomBuilt = false;
    currentDesign = 'default'; goldDesignUnlocked = false; voidDesignUnlocked = false;
    dragonKills = 0; dragonRespawnTime = -Infinity;
    npcCongrats.cook = 0; npcCongrats.butler = 0; npcCongrats.wizard = 0; npcCongrats.campLeader = 0;
    hunger.max = 10; health.max = 10;
    voidStarSwordUnlocked = false;
    voidRush.state = 'idle'; voidRush.lastUseTime = -Infinity; voidRush.hitSet = new Set();
    voidStarUnlocked = false; voidStarActive = false; lastVoidStarTime = -Infinity;
    notifications = [];
    deathCount = 0;
    activeQuest = 'main'; voidQuestFoundEntrance = false; voidQuestNoliDefeated = false;
    inArena = false; arenaReturnX = 0; arenaReturnY = 0;
    voidSentinel.x = 14 * T; voidSentinel.y = 220 * T; voidSentinel.hp = 2500; voidSentinel.maxHp = 2500;
    voidSentinel.alive = true; voidSentinel.aggro = false; voidSentinel.stunned = false; voidSentinel.stunUntil = 0;
    voidSentinel.dashState = 'idle'; voidSentinel.lastDashTime = -Infinity; voidSentinel.dashHit = false;
    voidSentinelDeathTime = -Infinity;
    gameTime = 0;
    currentSlot = slot;
    buildMap();
}

function drawMainMenu() {
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Castle silhouette background
    ctx.fillStyle = '#2a2a4e';
    const cx = canvas.width / 2;
    // Towers
    ctx.fillRect(cx - 120, canvas.height / 2 + 20, 40, 100);
    ctx.fillRect(cx + 80, canvas.height / 2 + 20, 40, 100);
    ctx.fillRect(cx - 40, canvas.height / 2 + 40, 80, 80);
    // Battlements
    for (let i = 0; i < 5; i++) { ctx.fillRect(cx - 120 + i * 10, canvas.height / 2 + 10, 6, 14); }
    for (let i = 0; i < 5; i++) { ctx.fillRect(cx + 80 + i * 10, canvas.height / 2 + 10, 6, 14); }

    ctx.font = 'bold 36px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700'; ctx.fillText('The King\'s Castle', cx, canvas.height / 3 - 40);

    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#DAA520';
    ctx.fillText('A Royal Life Simulator', cx, canvas.height / 3);

    if (menuScreen === 'main') {
        const lastSlot = getLastSlot();
        const saves = getSaves();
        const hasLast = lastSlot && saves[lastSlot];

        const items = [];
        if (hasLast) items.push({ label: 'Resume Last', action: 'resume' });
        items.push({ label: 'New Game', action: 'new' });
        items.push({ label: 'Saved Games', action: 'slots' });

        ctx.font = 'bold 18px monospace';
        for (let i = 0; i < items.length; i++) {
            const iy = canvas.height / 2 - 20 + i * 48;
            if (i === menuSelection) {
                ctx.fillStyle = 'rgba(218,165,32,0.2)';
                ctx.fillRect(cx - 140, iy - 14, 280, 36);
                ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(cx - 140, iy - 14, 280, 36);
                ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + items[i].label + ' <', cx, iy + 4);
            } else {
                ctx.fillStyle = '#aaa'; ctx.fillText(items[i].label, cx, iy + 4);
            }
        }
        ctx.font = '12px monospace'; ctx.fillStyle = '#666';
        ctx.fillText(`${kl('nav')} to navigate, ${kl('E')} to select`, cx, canvas.height - 40);
    } else if (menuScreen === 'slots') {
        const saves = getSaves();
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#DAA520'; ctx.fillText('-- Saved Games --', cx, canvas.height / 2 - 60);

        for (let i = 0; i < 3; i++) {
            const slotKey = 'slot' + (i + 1);
            const s = saves[slotKey];
            const label = s ? `Slot ${i+1}: ${s.savedAt}` : `Slot ${i+1}: Empty`;
            const iy = canvas.height / 2 - 10 + i * 44;
            ctx.font = '14px monospace';
            if (i === slotSelection) {
                ctx.fillStyle = 'rgba(218,165,32,0.2)'; ctx.fillRect(cx - 160, iy - 12, 320, 32);
                ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 1; ctx.strokeRect(cx - 160, iy - 12, 320, 32);
                ctx.fillStyle = '#FFD700'; ctx.fillText('> ' + label, cx, iy + 4);
            } else {
                ctx.fillStyle = '#aaa'; ctx.fillText(label, cx, iy + 4);
            }
        }
        ctx.font = '12px monospace'; ctx.fillStyle = '#666';
        ctx.fillText(`${kl('nav')} to navigate, ${kl('E')} to load/create`, cx, canvas.height - 40);
    }
}
