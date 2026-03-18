// ── Input ───────────────────────────────────────────────────

const keys = new Set();
let ePressed = false;
let hPressed = false;
let fPressed = false;
let bPressed = false;

window.addEventListener('keydown', (e) => {
    keys.add(e.key);
    if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') ePressed = true;
    if (e.key === 'h' || e.key === 'H') hPressed = true;
    if (e.key === 'f' || e.key === 'F') fPressed = true;
    if (e.key === 'b' || e.key === 'B') bPressed = true;

    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();

    // Menu navigation
    if (gameState === 'menu') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            if (menuScreen === 'main') {
                const lastSlot = getLastSlot(), saves = getSaves();
                const count = (lastSlot && saves[lastSlot]) ? 3 : 2;
                menuSelection = (menuSelection - 1 + count) % count;
            } else slotSelection = (slotSelection - 1 + 3) % 3;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            if (menuScreen === 'main') {
                const lastSlot = getLastSlot(), saves = getSaves();
                const count = (lastSlot && saves[lastSlot]) ? 3 : 2;
                menuSelection = (menuSelection + 1) % count;
            } else slotSelection = (slotSelection + 1) % 3;
        }
        if (e.key === 'Escape' && menuScreen === 'slots') { menuScreen = 'main'; }
        return;
    }

    if (gameState === 'paused') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') pauseSelection = (pauseSelection + 1) % 2;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') pauseSelection = (pauseSelection + 1) % 2;
        if (e.key === 'Escape') { gameState = 'playing'; lastTime = performance.now(); }
        return;
    }

    if (gameState === 'dead') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') deathSelection = (deathSelection + 1) % 2;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') deathSelection = (deathSelection + 1) % 2;
        return;
    }

    // Admin panel navigation
    if (adminOpen) {
        const items = getAdminItems();
        if (e.key === 'Escape') { adminOpen = false; }
        else {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') adminSelection = (adminSelection - 1 + items.length) % items.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') adminSelection = (adminSelection + 1) % items.length;
            if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                items[adminSelection].action();
                ePressed = false;
            }
        }
        return;
    }

    // Shop navigation
    if (shopOpen) {
        const items = getShopItems();
        if (e.key === 'Escape') { shopOpen = false; }
        else if (items.length > 0) {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') shopSelection = (shopSelection - 1 + items.length) % items.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') shopSelection = (shopSelection + 1) % items.length;
            if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                const item = items[shopSelection];
                if (goldCount >= item.cost) {
                    item.action();
                    // Adjust selection if items changed
                    const newItems = getShopItems();
                    if (newItems.length === 0) shopOpen = false;
                    else if (shopSelection >= newItems.length) shopSelection = newItems.length - 1;
                } else {
                    addNotification(`Need ${item.cost} gold (have ${goldCount})`, 2000, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
                }
                ePressed = false;
            }
        }
        return;
    }

    // Playing state
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (dialog.active) { dialog.active = false; dialog.stage = null; }
        else if (butlerDialog.active) { butlerDialog.active = false; butlerDialog.stage = null; }
        else if (messengerDialog.active) { messengerDialog.active = false; messengerDialog.stage = null; }
        else if (wizardDialog.active) { wizardDialog.active = false; wizardDialog.stage = null; }
        else if (campLeaderDialog.active) { campLeaderDialog.active = false; campLeaderDialog.stage = null; }
        else { gameState = 'paused'; pauseSelection = 0; if (currentSlot) saveGame(currentSlot); }
        return;
    }

    if (dialog.active || butlerDialog.active || (campLeaderDialog.active && campLeaderDialog.stage === 'rematch_ask')) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            if (dialog.active) {
                if (dialog.stage === 'meal') dialog.selectedIndex = (dialog.selectedIndex - 1 + meals.length) % meals.length;
                else if (dialog.stage === 'dessert') dialog.selectedIndex = (dialog.selectedIndex - 1 + desserts.length) % desserts.length;
            } else if (butlerDialog.active && butlerDialog.stage === 'ask') butlerDialog.selectedIndex = (butlerDialog.selectedIndex + 1) % 2;
            else if (campLeaderDialog.active && campLeaderDialog.stage === 'rematch_ask') campLeaderDialog.selectedIndex = (campLeaderDialog.selectedIndex + 1) % 2;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            if (dialog.active) {
                if (dialog.stage === 'meal') dialog.selectedIndex = (dialog.selectedIndex + 1) % meals.length;
                else if (dialog.stage === 'dessert') dialog.selectedIndex = (dialog.selectedIndex + 1) % desserts.length;
            } else if (butlerDialog.active && butlerDialog.stage === 'ask') butlerDialog.selectedIndex = (butlerDialog.selectedIndex + 1) % 2;
            else if (campLeaderDialog.active && campLeaderDialog.stage === 'rematch_ask') campLeaderDialog.selectedIndex = (campLeaderDialog.selectedIndex + 1) % 2;
        }
    }
});

window.addEventListener('keyup', (e) => keys.delete(e.key));

canvas.addEventListener('click', (e) => {
    const mx = e.clientX, my = e.clientY;
    if (gameState === 'playing') {
        if (adminOpen || shopOpen) return; // ignore clicks behind overlays
        // Admin button
        if (mx >= adminBtn.x && mx <= adminBtn.x + adminBtn.w &&
            my >= adminBtn.y && my <= adminBtn.y + adminBtn.h) {
            tryAdminLogin();
            return;
        }
        if (mx >= pauseBtn.x && mx <= pauseBtn.x + pauseBtn.w &&
            my >= pauseBtn.y && my <= pauseBtn.y + pauseBtn.h) {
            gameState = 'paused'; pauseSelection = 0;
            if (currentSlot) saveGame(currentSlot);
        }
        if (dragonKills > 0 && mx >= shopBtn.x && mx <= shopBtn.x + shopBtn.w &&
            my >= shopBtn.y && my <= shopBtn.y + shopBtn.h) {
            shopOpen = true; shopSelection = 0;
        }
        if (adminUnlocked && mx >= teleportBtn.x && mx <= teleportBtn.x + teleportBtn.w &&
            my >= teleportBtn.y && my <= teleportBtn.y + teleportBtn.h) {
            teleportToCastleGates();
        }
    }
});

// ── Game Loop ───────────────────────────────────────────────

let lastTime = performance.now();

function gameLoop(now) {
    const realDt = now - lastTime;
    lastTime = now;

    // ── MENU ──
    if (gameState === 'menu') {
        drawMainMenu();
        drawTouchControls();
        if (ePressed) {
            ePressed = false;
            if (menuScreen === 'main') {
                const lastSlot = getLastSlot(), saves = getSaves();
                const hasLast = lastSlot && saves[lastSlot];
                const items = [];
                if (hasLast) items.push('resume');
                items.push('new'); items.push('slots');
                const action = items[menuSelection];
                if (action === 'resume') {
                    currentSlot = lastSlot;
                    loadGame(lastSlot);
                    gameState = 'playing'; lastTime = performance.now();
                } else if (action === 'new') {
                    menuScreen = 'slots'; slotSelection = 0;
                } else if (action === 'slots') {
                    menuScreen = 'slots'; slotSelection = 0;
                }
            } else if (menuScreen === 'slots') {
                const slotKey = 'slot' + (slotSelection + 1);
                const saves = getSaves();
                if (saves[slotKey]) {
                    currentSlot = slotKey;
                    loadGame(slotKey);
                    gameState = 'playing'; lastTime = performance.now();
                } else {
                    newGame(slotKey);
                    saveGame(slotKey);
                    gameState = 'playing'; lastTime = performance.now();
                }
                menuScreen = 'main'; menuSelection = 0;
            }
        } else { ePressed = false; }
        drawVersion();
        requestAnimationFrame(gameLoop);
        return;
    }

    // ── PAUSED ──
    if (gameState === 'paused') {
        drawPauseMenu();
        drawTouchControls();
        if (ePressed) {
            ePressed = false;
            if (pauseSelection === 0) {
                gameState = 'playing'; lastTime = performance.now();
            } else {
                if (currentSlot) saveGame(currentSlot);
                gameState = 'menu'; menuScreen = 'main'; menuSelection = 0;
            }
        } else { ePressed = false; }
        drawVersion();
        requestAnimationFrame(gameLoop);
        return;
    }

    // ── DEAD ──
    if (gameState === 'dead') {
        drawDeathScreen();
        drawTouchControls();
        if (ePressed) {
            ePressed = false;
            if (deathSelection === 0) {
                // Revive: restore health to max, resume playing
                health.value = health.max;
                gameState = 'playing'; lastTime = performance.now();
            } else {
                // Quit to menu
                if (currentSlot) saveGame(currentSlot);
                gameState = 'menu'; menuScreen = 'main'; menuSelection = 0;
            }
        } else { ePressed = false; }
        drawVersion();
        requestAnimationFrame(gameLoop);
        return;
    }

    // ── PLAYING ──
    const dt = realDt / 1000;
    gameTime += realDt;

    updateHunger();
    updateHealth();
    updateBathroom();

    // Cooking done check
    if (cookingState.active && !cookingState.done) {
        if (gameTime - cookingState.startTime >= cookingState.duration) {
            cookingState.done = true;
            addNotification(`Cook finished: ${cookingState.meal} & ${cookingState.dessert}!`, 5000, 'rgba(150,255,150,1)', 'rgba(10,40,10,0.85)');
        }
    }

    // Butler fetch done
    if (butlerState.fetching) {
        if (gameTime - butlerState.fetchStart >= butlerState.fetchDuration) {
            butlerState.fetching = false;
            eatFood('The butler serves');
        }
    }

    // Bathroom warning
    if (bathroomWarningShown && gameTime - bathroomWarningTime < 4000) {
        // already showing via notifications
    }
    if (bathroomWarningShown) {
        addNotification('You need to use the bathroom!', 4000, 'rgba(255,200,100,1)', 'rgba(60,40,0,0.85)');
        bathroomWarningShown = false;
    }
    if (poopNotifShown) {
        addNotification('You have pooped your pants!', 5000, 'rgba(255,100,100,1)', 'rgba(80,20,0,0.9)');
        poopNotifShown = false;
    }

    // Update messenger
    updateMessenger();

    // Check butler farewell trigger
    updateButlerFarewell();

    // Update spider combat
    updateSpider();

    // Update sea snake
    updateSeaSnake(dt);

    // Update orcs
    updateOrcs(dt);

    // Update troll
    updateTroll(dt);

    // Update dragon
    updateDragon(dt);

    // Update shield
    updateShield();

    // Check for death
    if (adminGodMode && health.value <= 0) health.value = health.max;
    if (health.value <= 0) {
        deathCount++;
        deathSelection = 0;
        gameState = 'dead';
        if (currentSlot) saveGame(currentSlot);
        requestAnimationFrame(gameLoop);
        return;
    }

    // Auto-exit boat only on dock; warn on sand
    if (inBoat && gameTime - boatBoardTime > 500) {
        const centerCol = Math.floor((player.x + player.width / 2) / T);
        const centerRow = Math.floor((player.y + player.height / 2) / T);
        const tile = map[centerRow][centerCol];
        if (tile === DOCK) {
            inBoat = false;
            boatSandWarnTime = 0;
            // Teleport one tile inland so player doesn't overlap water
            if (centerRow <= 91) player.y = (centerRow - 1) * T;
            else player.y = (centerRow + 1) * T;
            addNotification('You step off the boat.', 1500, 'rgba(100,200,255,1)', 'rgba(0,30,60,0.8)');
        } else if (tile === SAND && gameTime - boatSandWarnTime > 2000) {
            boatSandWarnTime = gameTime;
            addNotification('Try landing on the dock', 1500, 'rgba(255,200,100,1)', 'rgba(60,30,0,0.8)');
        }
    }

    // Handle H press (attack)
    if (hPressed) {
        if (swordPickedUp) swordSwingTime = performance.now();
        if (swordPickedUp && spider.alive && spider.active && isNearSpider()) {
            hitSpider();
        } else if (swordPickedUp && seaSnake.alive && seaSnake.active && isNearSeaSnake()) {
            hitSeaSnake();
        } else if (swordPickedUp && isNearAnyOrc()) {
            hitNearestOrc();
        } else if (swordPickedUp && troll.alive && isNearTroll()) {
            hitTroll();
        } else if (swordPickedUp && dragon.alive && isNearDragon()) {
            hitDragon();
        } else if (!swordPickedUp && ((spider.active && isNearSpider()) || (seaSnake.active && isNearSeaSnake()) || isNearAnyOrc() || (troll.alive && isNearTroll()) || (dragon.alive && isNearDragon()))) {
            addNotification('You need a sword to fight!', 1500, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
        }
        hPressed = false;
    }

    // Handle F press (heal)
    if (fPressed) {
        if (healPowerUnlocked) useHealPower();
        fPressed = false;
    }

    // Handle B press (shield)
    if (bPressed) {
        if (shieldUnlocked) useShield();
        bPressed = false;
    }

    // Handle E press
    if (ePressed) {
        if (dialog.active) {
            advanceDialog();
        } else if (butlerDialog.active) {
            advanceButlerDialog();
        } else if (messengerDialog.active) {
            advanceMessengerDialog();
        } else if (wizardDialog.active) {
            advanceWizardDialog();
        } else if (campLeaderDialog.active) {
            advanceCampLeaderDialog();
        } else if (activeAction) {
            // Track quest tasks on exit
            if (activeAction.name === 'toilet') {
                useBathroom();
                questTasks.usedToilet = true;
                questTasks.usedBathroom = true;
                checkAllTasks();
            } else if (activeAction.name === 'throne') {
                questTasks.satThrone = true; checkAllTasks();
            } else if (activeAction.name === 'bed') {
                questTasks.sleptBed = true; checkAllTasks();
            }
            activeAction = null;
        } else {
            const nearCook = isNearCook();
            const nearButlerNPC = isNearButler();
            const nearMsg = isNearMessenger();
            const nearSwd = isNearSword();
            const nearby = getNearbyInteraction();

            const nearWiz = isNearWizard();
            const nearGld = isNearGold();

            if (nearMsg) {
                openMessengerDialog();
            } else if (nearSwd) {
                pickUpSword();
            } else if (nearGld) {
                pickUpGold();
            } else if (nearWiz) {
                openWizardDialog();
            } else if (isNearWeaponRack()) {
                switchSword();
            } else if (isNearWeaponryBuildSite()) {
                if (goldCount >= 20) buildWeaponryRoom();
                else addNotification(`Need 20 gold (have ${goldCount})`, 2000, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
            } else if (isNearGuestRoomBuildSite()) {
                if (goldCount >= 30) buildGuestRoom();
                else addNotification(`Need 30 gold (have ${goldCount})`, 2000, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
            } else if (isNearCampLeader() && !orcSiege.active) {
                openCampLeaderDialog();
            } else if (isNearBoat()) {
                boardBoat();
            } else if (nearCook) {
                questTasks.talkedCook = true; checkAllTasks();
                if (cookingState.done && !cookingState.doneAcknowledged) {
                    eatFood('The king eats');
                } else if (cookingState.active && !cookingState.done) {
                    // busy
                } else { openCookDialog(); }
            } else if (nearButlerNPC) {
                questTasks.talkedButler = true; checkAllTasks();
                if (!butlerState.fetching) openButlerDialog();
            } else if (nearby) {
                activeAction = {
                    name: nearby.name, startTime: gameTime,
                    duration: nearby.duration, message: nearby.message,
                    realStart: performance.now(),
                };
            }
        }
        ePressed = false;
    }

    // Movement
    if (!activeAction && !dialog.active && !butlerDialog.active && !messengerDialog.active && !wizardDialog.active && !campLeaderDialog.active && !shopOpen) {
        let dx = 0, dy = 0;
        if (keys.has('ArrowUp') || keys.has('w') || keys.has('W') || touchState.up) dy -= 1;
        if (keys.has('ArrowDown') || keys.has('s') || keys.has('S') || touchState.down) dy += 1;
        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A') || touchState.left) dx -= 1;
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D') || touchState.right) dx += 1;
        if (dx !== 0 && dy !== 0) { const len = Math.SQRT2; dx /= len; dy /= len; }
        const newX = player.x + dx * player.speed * dt;
        const newY = player.y + dy * player.speed * dt;
        if (!isSolid(newX, player.y, player.width, player.height)) player.x = newX;
        if (!isSolid(player.x, newY, player.width, player.height)) player.y = newY;
        playerWalking = (dx !== 0 || dy !== 0);
        if (playerWalking) playerWalkPhase += dt * 10;
        else playerWalkPhase = 0;
    } else {
        playerWalking = false; playerWalkPhase = 0;
    }

    // Camera
    const camX = player.x + player.width/2 - canvas.width/2;
    const camY = player.y + player.height/2 - canvas.height/2;

    // Draw
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    const startCol = Math.max(0, Math.floor(camX / T));
    const endCol = Math.min(MAP_COLS - 1, Math.ceil((camX + canvas.width) / T));
    const startRow = Math.max(0, Math.floor(camY / T));
    const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camY + canvas.height) / T));

    for (let row = startRow; row <= endRow; row++)
        for (let col = startCol; col <= endCol; col++)
            drawTile(col, row, camX, camY);

    drawGuard(guard1, camX, camY);
    drawGuard(guard2, camX, camY);
    drawButler(camX, camY);
    drawCook(camX, camY);
    drawMessenger(camX, camY);
    drawWizard(camX, camY);
    drawSpider(camX, camY);
    drawSeaSnake(camX, camY);
    drawBoatAtDock(camX, camY);
    drawCampLeader(camX, camY);
    drawAllOrcs(camX, camY);
    drawTroll(camX, camY);
    drawDragon(camX, camY);
    drawFireBreath(camX, camY);
    drawGuestRoomNPCs(camX, camY);

    if (inBoat) drawKingInBoat(camX, camY);
    else if (activeAction && activeAction.name === 'sitting') drawKingSitting(camX, camY);
    else if (activeAction && activeAction.name === 'sleeping') drawKingSleeping(camX, camY);
    else if (activeAction && activeAction.name === 'toilet') drawKingOnToilet(camX, camY);
    else drawKing(camX, camY);

    drawShieldEffect(camX, camY);
    drawSleepOverlay();

    // HUD prompts
    if (dialog.active) drawDialog();
    else if (butlerDialog.active) drawButlerDialog();
    else if (messengerDialog.active) drawMessengerDialog();
    else if (wizardDialog.active) drawWizardDialog();
    else if (campLeaderDialog.active) drawCampLeaderDialog();
    else if (activeAction) drawActionMessage();
    else if (isNearWeaponRack()) {
        let other;
        if (currentSword === 'legendary') other = "King's Sword (3 dmg)";
        else if (currentSword === 'kings' && dragonSwordUnlocked) other = 'Dragon Sword (5 dmg)';
        else other = 'Legendary Sword (2 dmg)';
        drawPrompt(`${kl('E')} to switch to ${other}`);
    } else if (isNearWeaponryBuildSite()) {
        drawPrompt(`${kl('E')} to build Weaponry (20 gold) [${goldCount} gold]`);
    } else if (isNearGuestRoomBuildSite()) {
        drawPrompt(`${kl('E')} to build Guest Room (30 gold) [${goldCount} gold]`);
    } else if (isNearGold()) {
        drawPrompt(`${kl('E')} to pick up the gold block`);
    } else if (isNearDragon()) {
        drawPrompt(`${kl('H')} to attack the dragon!`);
    } else if (isNearTroll()) {
        drawPrompt(`${kl('H')} to attack the troll!`);
    } else if (isNearAnyOrc()) {
        drawPrompt(`${kl('H')} to attack the orc!`);
    } else if (isNearCampLeader() && !orcSiege.active) {
        drawPrompt(`${kl('E')} to talk to the Camp Leader`);
    } else if (isNearSeaSnake()) {
        drawPrompt(`${kl('H')} to attack the sea snake!`);
    } else if (isNearBoat()) {
        drawPrompt(`${kl('E')} to board the boat`);
    } else if (isNearSpider()) {
        drawPrompt(`${kl('H')} to attack the spider!`);
    } else if (isNearWizard()) {
        drawPrompt(`${kl('E')} to talk to the Wizard`);
    } else if (isNearMessenger()) {
        drawPrompt(`${kl('E')} to read the message`);
    } else if (isNearSword()) {
        drawPrompt(`${kl('E')} to pull the sword from the bridge`);
    } else if (isNearCook()) {
        if (cookingState.active && !cookingState.done) drawCookBusyPrompt();
        else if (cookingState.done && !cookingState.doneAcknowledged) drawPrompt(`${kl('E')} to eat ${cookingState.meal} & ${cookingState.dessert}`);
        else drawPrompt(`${kl('E')} to talk to Cook`);
    } else if (isNearButler()) {
        if (butlerState.fetching) drawPrompt('Butler: "Fetching your meal..."');
        else drawPrompt(`${kl('E')} to talk to Butler`);
    } else {
        const nearby = getNearbyInteraction();
        if (nearby) {
            if (nearby.name === 'toilet' && bathroom.needsToGo) {
                drawPrompt(`${kl('E')} to use the toilet (URGENT!)`);
            } else {
                drawPrompt(nearby.prompt);
            }
        }
    }

    drawHUD();
    drawQuestTasks();
    drawTeleportButton();
    drawPauseButton();
    drawAdminButton();
    drawShopButton();
    drawNotifications();

    if (adminOpen) drawAdminPanel();
    else if (shopOpen) drawShopMenu();

    drawTouchControls();

    // Auto-save periodically
    if (currentSlot && Math.floor(gameTime / 30000) > Math.floor((gameTime - realDt) / 30000)) {
        saveGame(currentSlot);
    }

    drawVersion();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
