// ── Input ───────────────────────────────────────────────────

const keys = new Set();
let ePressed = false;
let hPressed = false;
let fPressed = false;
let bPressed = false;
let vPressed = false;
let rPressed = false;
let yPressed = false;

window.addEventListener('keydown', (e) => {
    keys.add(e.key);
    if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') ePressed = true;
    if (e.key === 'h' || e.key === 'H') hPressed = true;
    if (e.key === 'f' || e.key === 'F') fPressed = true;
    if (e.key === 'b' || e.key === 'B') bPressed = true;
    if (e.key === 'v' || e.key === 'V') vPressed = true;
    if (e.key === 'r' || e.key === 'R') rPressed = true;

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
        if (pauseScreen === 'quests') {
            const qItems = getQuestItems();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') questSelection = (questSelection - 1 + qItems.length) % qItems.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') questSelection = (questSelection + 1) % qItems.length;
            if (e.key === 'Escape') { pauseScreen = 'main'; }
        } else if (pauseScreen === 'mastery') {
            const mItems = getMasteryPickerItems();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') masterySelection = (masterySelection - 1 + mItems.length) % mItems.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') masterySelection = (masterySelection + 1) % mItems.length;
            if (e.key === 'Escape') { pauseScreen = 'main'; }
        } else if (pauseScreen === 'mastery_sword') {
            const msItems = getSwordMasteryItems();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') masterySelection = (masterySelection - 1 + msItems.length) % msItems.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') masterySelection = (masterySelection + 1) % msItems.length;
            if (e.key === 'Escape') { pauseScreen = 'mastery'; masterySelection = 0; }
        } else if (pauseScreen === 'mastery_dagger') {
            const mdItems = getDaggerMasteryItems();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') masterySelection = (masterySelection - 1 + mdItems.length) % mdItems.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') masterySelection = (masterySelection + 1) % mdItems.length;
            if (e.key === 'Escape') { pauseScreen = 'mastery'; masterySelection = 0; }
        } else if (pauseScreen === 'settings') {
            const setItems = getSettingsItems();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') settingsSelection = (settingsSelection - 1 + setItems.length) % setItems.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') settingsSelection = (settingsSelection + 1) % setItems.length;
            if (e.key === 'Escape') { pauseScreen = 'main'; settingsSelection = 0; }
        } else if (pauseScreen === 'mastery_spear') {
            const mspItems = getSpearMasteryItems();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') masterySelection = (masterySelection - 1 + mspItems.length) % mspItems.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') masterySelection = (masterySelection + 1) % mspItems.length;
            if (e.key === 'Escape') { pauseScreen = 'mastery'; masterySelection = 0; }
        } else {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') pauseSelection = (pauseSelection - 1 + PAUSE_ITEMS.length) % PAUSE_ITEMS.length;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') pauseSelection = (pauseSelection + 1) % PAUSE_ITEMS.length;
            if (e.key === 'Escape') { gameState = 'playing'; lastTime = performance.now(); }
        }
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
        else if (campScoutDialog.active) { campScoutDialog.active = false; }
        else if (campBlacksmithDialog.active) { campBlacksmithDialog.active = false; }
        else if (campHealerDialog.active) { campHealerDialog.active = false; }
        else if (iceTravelerDialog.active) { iceTravelerDialog.active = false; iceTravelerDialog.stage = null; iceTravelerShopOpen = false; }
        else { gameState = 'paused'; pauseSelection = 0; pauseScreen = 'main'; if (currentSlot) saveGame(currentSlot); }
        return;
    }

    // Jack Frost dialog close
    if (jackFrostDialog.active && e.key === 'Escape') {
        jackFrostDialog.active = false; jackFrostDialog.stage = null;
    }

    // Ice Traveler shop navigation
    if (iceTravelerShopOpen) {
        const items = getIceTravelerShopItems();
        if (e.key === 'Escape') { iceTravelerDialog.active = false; iceTravelerDialog.stage = null; iceTravelerShopOpen = false; }
        else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') iceTravelerShopSelection = (iceTravelerShopSelection - 1 + items.length) % items.length;
        else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') iceTravelerShopSelection = (iceTravelerShopSelection + 1) % items.length;
        return;
    }

    // Dagger stab — only set in playing state (menu/paused/dead/admin/shop returned above)
    if (e.key === 'y' || e.key === 'Y') yPressed = true;

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
            gameState = 'paused'; pauseSelection = 0; pauseScreen = 'main';
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
            if (pauseScreen === 'quests') {
                const qItems = getQuestItems();
                const selected = qItems[questSelection];
                if (selected.key === 'back') {
                    pauseScreen = 'main';
                } else {
                    activeQuest = selected.key;
                    pauseScreen = 'main';
                }
            } else if (pauseScreen === 'mastery') {
                const mItems = getMasteryPickerItems();
                const mSelected = mItems[masterySelection];
                if (mSelected.key === 'back') {
                    pauseScreen = 'main';
                } else if (mSelected.key === 'sword') {
                    pauseScreen = 'mastery_sword'; masterySelection = 0;
                } else if (mSelected.key === 'dagger') {
                    pauseScreen = 'mastery_dagger'; masterySelection = 0;
                } else if (mSelected.key === 'spear') {
                    pauseScreen = 'mastery_spear'; masterySelection = 0;
                }
            } else if (pauseScreen === 'mastery_sword') {
                const msItems = getSwordMasteryItems();
                const msSelected = msItems[masterySelection];
                if (msSelected.key === 'back') {
                    pauseScreen = 'mastery'; masterySelection = 0;
                } else {
                    masterySkin = msSelected.key;
                }
            } else if (pauseScreen === 'mastery_spear') {
                const mspItems = getSpearMasteryItems();
                const mspSelected = mspItems[masterySelection];
                if (mspSelected.key === 'back') {
                    pauseScreen = 'mastery'; masterySelection = 0;
                } else {
                    spearMasterySkin = mspSelected.key;
                }
            } else if (pauseScreen === 'mastery_dagger') {
                const mdItems = getDaggerMasteryItems();
                const mdSelected = mdItems[masterySelection];
                if (mdSelected.key === 'back') {
                    pauseScreen = 'mastery'; masterySelection = 0;
                } else {
                    daggerMasterySkin = mdSelected.key;
                }
            } else if (pauseScreen === 'settings') {
                const setItems = getSettingsItems();
                const setSelected = setItems[settingsSelection];
                if (setSelected.key === 'back') {
                    pauseScreen = 'main'; settingsSelection = 0;
                } else if (setSelected.key === 'extraLevels') {
                    extraLevels = !extraLevels;
                    addNotification(extraLevels ? 'Extra levels enabled!' : 'Extra levels disabled', 1500, 'rgba(255,215,0,1)', 'rgba(40,30,0,0.8)');
                }
            } else {
                if (pauseSelection === 0) {
                    gameState = 'playing'; lastTime = performance.now();
                } else if (pauseSelection === 1) {
                    pauseScreen = 'quests'; questSelection = 0;
                } else if (pauseSelection === 2) {
                    pauseScreen = 'mastery'; masterySelection = 0;
                } else if (pauseSelection === 3) {
                    pauseScreen = 'settings'; settingsSelection = 0;
                } else {
                    if (currentSlot) saveGame(currentSlot);
                    gameState = 'menu'; menuScreen = 'main'; menuSelection = 0;
                }
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

    updateSnowParticles(realDt);
    updateIceTrap();
    updateAfkPortal();

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

    // Update void star
    updateVoidStar();

    // Update void sentinel
    updateVoidSentinel(dt);

    // Update void rush
    updateVoidRush(dt);

    // Update dagger stab
    updateDaggerStab();

    // Ice Traveler arrival/departure notification
    if (typeof iceTravelerWasPresent === 'undefined') iceTravelerWasPresent = false;
    const travelerHere = isIceTravelerPresent();
    if (travelerHere && !iceTravelerWasPresent) {
        addNotification('The Ice Traveler has arrived at camp!', 5000, 'rgba(180,220,255,1)', 'rgba(20,40,60,0.9)');
    } else if (!travelerHere && iceTravelerWasPresent) {
        addNotification('The Ice Traveler has departed...', 3000, 'rgba(150,180,200,1)', 'rgba(20,30,40,0.8)');
    }
    iceTravelerWasPresent = travelerHere;

    // Snow weather arrival/departure notification
    if (typeof snowWasActive === 'undefined') snowWasActive = false;
    const snowNow = isSnowing();
    if (snowNow && !snowWasActive) {
        addNotification('Snow is falling across the land!', 4000, 'rgba(220,235,255,1)', 'rgba(20,30,50,0.9)');
        addNotification('Jack Frost has arrived at the throne room!', 5000, 'rgba(150,220,255,1)', 'rgba(10,30,60,0.9)');
    } else if (!snowNow && snowWasActive) {
        addNotification('The snow has stopped.', 3000, 'rgba(180,200,220,1)', 'rgba(20,30,40,0.8)');
        addNotification('Jack Frost has left the castle.', 3000, 'rgba(130,170,200,1)', 'rgba(10,20,40,0.8)');
    }
    snowWasActive = snowNow;

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

    // Handle H press — ice trap breaking
    if (hPressed && iceTrap.active) {
        hitIceTrap();
        hPressed = false;
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
        } else if (swordPickedUp && voidSentinel.alive && isNearVoidSentinel()) {
            hitVoidSentinel();
        } else if (!swordPickedUp && ((spider.active && isNearSpider()) || (seaSnake.active && isNearSeaSnake()) || isNearAnyOrc() || (troll.alive && isNearTroll()) || (dragon.alive && isNearDragon()) || (voidSentinel.alive && isNearVoidSentinel()))) {
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

    // Handle V press (void star buff)
    if (vPressed) {
        if (voidStarUnlocked) useVoidStar();
        vPressed = false;
    }

    // Handle R press (void rush)
    if (rPressed) {
        if (currentSword === 'voidstar' && voidStarSwordUnlocked) useVoidRush();
        rPressed = false;
    }

    // Handle Y press (dagger stab)
    if (yPressed) {
        if (currentSword === 'dagger' && swordPickedUp && !daggerStab.active && gameTime >= daggerStab.cooldownUntil) {
            const stabTarget = findNearestStabTarget();
            if (stabTarget) startDaggerStab(stabTarget);
        }
        yPressed = false;
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
        } else if (campScoutDialog.active) {
            advanceCampScoutDialog();
        } else if (campBlacksmithDialog.active) {
            advanceCampBlacksmithDialog();
        } else if (campHealerDialog.active) {
            advanceCampHealerDialog();
        } else if (jackFrostDialog.active) {
            advanceJackFrostDialog();
        } else if (iceTravelerDialog.active) {
            if (iceTravelerShopOpen) {
                buyIceTravelerItem();
            } else {
                advanceIceTravelerDialog();
            }
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
            } else if (isNearDesignRack()) {
                switchDesign();
            } else if (isNearDesignRoomBuildSite()) {
                if (goldCount >= 100) buildDesignRoom();
                else addNotification(`Need 100 gold (have ${goldCount})`, 2000, 'rgba(255,100,100,1)', 'rgba(60,0,0,0.8)');
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
            } else if (isNearCampScout()) {
                openCampScoutDialog();
            } else if (isNearCampBlacksmith()) {
                openCampBlacksmithDialog();
            } else if (isNearCampHealer()) {
                openCampHealerDialog();
            } else if (isNearJackFrost()) {
                openJackFrostDialog();
            } else if (isNearIceTraveler()) {
                openIceTravelerDialog();
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
    if (!activeAction && !dialog.active && !butlerDialog.active && !messengerDialog.active && !wizardDialog.active && !campLeaderDialog.active && !shopOpen && voidRush.state === 'idle' && !daggerStab.active && !iceTrap.active) {
        let dx = 0, dy = 0;
        if (keys.has('ArrowUp') || keys.has('w') || keys.has('W') || touchState.up) dy -= 1;
        if (keys.has('ArrowDown') || keys.has('s') || keys.has('S') || touchState.down) dy += 1;
        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A') || touchState.left) dx -= 1;
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D') || touchState.right) dx += 1;
        if (dx !== 0 && dy !== 0) { const len = Math.SQRT2; dx /= len; dy /= len; }
        const spd = player.speed * getVoidMultiplier();
        const newX = player.x + dx * spd * dt;
        const newY = player.y + dy * spd * dt;
        if (!isSolid(newX, player.y, player.width, player.height)) player.x = newX;
        if (!isSolid(player.x, newY, player.width, player.height)) player.y = newY;
        playerWalking = (dx !== 0 || dy !== 0);
        if (playerWalking) playerWalkPhase += dt * 10;
        else playerWalkPhase = 0;

        // Secret arena teleport: step on tree at row 44, col 28
        const pRow = Math.floor((player.y + player.height / 2) / T);
        const pCol = Math.floor((player.x + player.width / 2) / T);
        if (!inArena && pRow === 44 && pCol === 28) {
            arenaReturnX = player.x;
            arenaReturnY = player.y;
            player.x = 14 * T;
            player.y = 212 * T;
            inArena = true;
            if (!voidQuestFoundEntrance) voidQuestFoundEntrance = true;
            addNotification('You entered a secret arena!', 3000, 'rgba(200,150,255,1)', 'rgba(40,0,60,0.85)');
        }
        // Return from arena: step on door tiles at row 210, cols 14-15
        if (inArena && (pRow === 210 || pRow === 211) && (pCol === 14 || pCol === 15)) {
            player.x = arenaReturnX;
            player.y = arenaReturnY - T;
            inArena = false;
            addNotification('You returned from the arena.', 2000, 'rgba(150,200,255,1)', 'rgba(0,30,60,0.85)');
        }
        // AFK Island portal (near Ice Traveler) — enter
        if (!inAfkRoom && afkPortalOpen && pRow === 117 && pCol === 26) {
            afkReturnX = player.x;
            afkReturnY = player.y;
            player.x = 15 * T;
            player.y = 237 * T;
            inAfkRoom = true;
            addNotification('Welcome to AFK Island!', 3000, 'rgba(150,220,255,1)', 'rgba(10,30,60,0.85)');
        }
        // AFK Island portal — return (door at row 233, col 15)
        if (inAfkRoom && pRow === 233 && pCol === 15) {
            player.x = afkReturnX;
            player.y = afkReturnY - T;
            inAfkRoom = false;
            addNotification('You left AFK Island.', 2000, 'rgba(130,180,220,1)', 'rgba(10,20,40,0.85)');
        }
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

    drawSnowOverlay(camX, camY, startCol, endCol, startRow, endRow);

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
    drawCampScout(camX, camY);
    drawCampBlacksmith(camX, camY);
    drawCampHealer(camX, camY);
    drawAfkPortal(camX, camY);
    drawAfkRoomPortal(camX, camY);
    drawJackFrost(camX, camY);
    drawIceTraveler(camX, camY);
    drawAllOrcs(camX, camY);
    drawTroll(camX, camY);
    drawDragon(camX, camY);
    drawFireBreath(camX, camY);
    drawVoidSentinel(camX, camY);
    drawGuestRoomNPCs(camX, camY);

    if (inBoat) drawKingInBoat(camX, camY);
    else if (activeAction && activeAction.name === 'sitting') drawKingSitting(camX, camY);
    else if (activeAction && activeAction.name === 'sleeping') drawKingSleeping(camX, camY);
    else if (activeAction && activeAction.name === 'toilet') drawKingOnToilet(camX, camY);
    else drawKing(camX, camY);

    // Dagger stab trail
    if (daggerStab.active) {
        const t = (gameTime - daggerStab.startTime) / DAGGER_STAB_DURATION;
        ctx.save();
        ctx.globalAlpha = 0.4 * (1 - t);
        ctx.fillStyle = '#FFB030';
        const trailX = daggerStab.startX - camX;
        const trailY = daggerStab.startY - camY;
        const curX = player.x - camX;
        const curY = player.y - camY;
        for (let i = 0; i < 3; i++) {
            const f = i / 3;
            const tx = trailX + (curX - trailX) * f;
            const ty = trailY + (curY - trailY) * f;
            ctx.globalAlpha = 0.2 * (1 - f) * (1 - t);
            ctx.fillRect(tx + 4, ty + 4, player.width - 8, player.height - 8);
        }
        ctx.restore();
    }

    drawVoidRush(camX, camY);
    drawShieldEffect(camX, camY);
    drawIceTrap(camX, camY);
    drawSleepOverlay();
    drawSnowParticles();

    // HUD prompts
    if (dialog.active) drawDialog();
    else if (butlerDialog.active) drawButlerDialog();
    else if (messengerDialog.active) drawMessengerDialog();
    else if (wizardDialog.active) drawWizardDialog();
    else if (campLeaderDialog.active) drawCampLeaderDialog();
    else if (campScoutDialog.active) drawCampScoutDialog();
    else if (campBlacksmithDialog.active) drawCampBlacksmithDialog();
    else if (campHealerDialog.active) drawCampHealerDialog();
    else if (jackFrostDialog.active) drawJackFrostDialog();
    else if (iceTravelerDialog.active) drawIceTravelerDialog();
    else if (activeAction) drawActionMessage();
    else if (isNearDesignRack()) {
        const designs = ['default'];
        if (goldDesignUnlocked) designs.push('gold');
        if (voidDesignUnlocked) designs.push('void');
        if (icePalaceUnlocked) designs.push('ice');
        const idx = designs.indexOf(currentDesign);
        const nextKey = designs[(idx + 1) % designs.length];
        const names = { default: 'Default', gold: 'Gold', void: 'Void', ice: 'Ice Palace' };
        drawPrompt(`${kl('E')} to switch to ${names[nextKey]} design`);
    } else if (isNearDesignRoomBuildSite()) {
        drawPrompt(`${kl('E')} to build Design Room (100 gold) [${goldCount} gold]`);
    } else if (isNearWeaponRack()) {
        drawPrompt(`${kl('E')} to switch to ${getNextSwordName()}`);
    } else if (isNearWeaponryBuildSite()) {
        drawPrompt(`${kl('E')} to build Weaponry (20 gold) [${goldCount} gold]`);
    } else if (isNearGuestRoomBuildSite()) {
        drawPrompt(`${kl('E')} to build Guest Room (30 gold) [${goldCount} gold]`);
    } else if (isNearGold()) {
        drawPrompt(`${kl('E')} to pick up the gold block`);
    } else if (isNearVoidSentinel()) {
        const stabHint = currentSword === 'dagger' ? ` | ${kl('Y')} to stab` : '';
        drawPrompt(`${kl('H')} to attack Noli${stabHint}`);
    } else if (isNearDragon()) {
        const stabHint = currentSword === 'dagger' ? ` | ${kl('Y')} to stab` : '';
        drawPrompt(`${kl('H')} to attack the ${isSnowing() ? 'Ice Dragon' : 'dragon'}!${stabHint}`);
    } else if (isNearTroll()) {
        const stabHint = currentSword === 'dagger' ? ` | ${kl('Y')} to stab` : '';
        drawPrompt(`${kl('H')} to attack the troll!${stabHint}`);
    } else if (isNearAnyOrc()) {
        const stabHint = currentSword === 'dagger' ? ` | ${kl('Y')} to stab` : '';
        drawPrompt(`${kl('H')} to attack the orc!${stabHint}`);
    } else if (isNearCampLeader() && !orcSiege.active) {
        drawPrompt(`${kl('E')} to talk to the Camp Leader`);
    } else if (isNearCampScout()) {
        drawPrompt(`${kl('E')} to talk to the Scout`);
    } else if (isNearCampBlacksmith()) {
        drawPrompt(`${kl('E')} to talk to the Blacksmith`);
    } else if (isNearCampHealer()) {
        drawPrompt(`${kl('E')} to talk to the Healer`);
    } else if (afkPortalOpen && !inAfkRoom && Math.abs(player.x + player.width/2 - 26*T - T/2) < T*1.5 && Math.abs(player.y + player.height/2 - 117*T - T/2) < T*1.5) {
        drawPrompt('Step into the portal to visit AFK Island');
    } else if (isNearJackFrost()) {
        drawPrompt(`${kl('E')} to talk to Jack Frost`);
    } else if (isNearIceTraveler()) {
        drawPrompt(`${kl('E')} to talk to the Ice Traveler`);
    } else if (isNearSeaSnake()) {
        const stabHint = currentSword === 'dagger' ? ` | ${kl('Y')} to stab` : '';
        drawPrompt(`${kl('H')} to attack the sea snake!${stabHint}`);
    } else if (isNearBoat()) {
        drawPrompt(`${kl('E')} to board the boat`);
    } else if (isNearSpider()) {
        const stabHint = currentSword === 'dagger' ? ` | ${kl('Y')} to stab` : '';
        drawPrompt(`${kl('H')} to attack the spider!${stabHint}`);
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
    drawVoidSentinelBossBar();
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
