// ── Touch Controls ──────────────────────────────────────────
// Virtual joystick (right side) + action buttons (left side)
// Only shown on touch-capable devices

let isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);

// Movement state — continuous, driven by joystick angle
const touchState = {
    up: false, down: false, left: false, right: false,
};

// Joystick state
const joystick = {
    active: false,       // is a finger currently on the joystick?
    touchId: null,       // which touch ID is controlling it
    cx: 0, cy: 0,       // center of joystick base (set dynamically)
    dx: 0, dy: 0,       // current stick offset from center (-1 to 1)
};

// Layout constants
const JOY_RADIUS = 60;       // outer ring radius
const JOY_KNOB_RADIUS = 24;  // inner knob radius
const JOY_DEADZONE = 0.15;   // ignore tiny movements
const BTN_SIZE = 52;
const BTN_GAP = 10;
const TOUCH_MARGIN = 20;

function getJoystickCenter() {
    return {
        x: canvas.width - TOUCH_MARGIN - JOY_RADIUS - 10,
        y: canvas.height - TOUCH_MARGIN - JOY_RADIUS - 10,
    };
}

function getActionLayout() {
    const baseX = TOUCH_MARGIN;
    const baseY = canvas.height - TOUCH_MARGIN - BTN_SIZE * 2 - BTN_GAP;
    return {
        btnE: { x: baseX, y: baseY, w: BTN_SIZE * 2 + BTN_GAP, h: BTN_SIZE },
        btnH: { x: baseX + BTN_SIZE * 2 + BTN_GAP * 2, y: baseY, w: BTN_SIZE, h: BTN_SIZE },
        btnB: { x: baseX, y: baseY + BTN_SIZE + BTN_GAP, w: BTN_SIZE, h: BTN_SIZE },
        btnF: { x: baseX + BTN_SIZE + BTN_GAP, y: baseY + BTN_SIZE + BTN_GAP, w: BTN_SIZE, h: BTN_SIZE },
    };
}

function touchHitTest(tx, ty, rect) {
    return tx >= rect.x && tx <= rect.x + rect.w && ty >= rect.y && ty <= rect.y + rect.h;
}

function isInJoystickZone(tx, ty) {
    const c = getJoystickCenter();
    const dx = tx - c.x;
    const dy = ty - c.y;
    // Generous hit area — 1.5x the visual radius
    return (dx * dx + dy * dy) <= (JOY_RADIUS * 1.8) * (JOY_RADIUS * 1.8);
}

function updateJoystickFromTouch(tx, ty) {
    const c = getJoystickCenter();
    let dx = tx - c.x;
    let dy = ty - c.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Clamp to radius
    if (dist > JOY_RADIUS) {
        dx = (dx / dist) * JOY_RADIUS;
        dy = (dy / dist) * JOY_RADIUS;
    }
    joystick.dx = dx / JOY_RADIUS; // normalize to -1..1
    joystick.dy = dy / JOY_RADIUS;

    // Update touchState based on joystick direction
    touchState.up = joystick.dy < -JOY_DEADZONE;
    touchState.down = joystick.dy > JOY_DEADZONE;
    touchState.left = joystick.dx < -JOY_DEADZONE;
    touchState.right = joystick.dx > JOY_DEADZONE;
}

function resetJoystick() {
    joystick.active = false;
    joystick.touchId = null;
    joystick.dx = 0;
    joystick.dy = 0;
    touchState.up = false;
    touchState.down = false;
    touchState.left = false;
    touchState.right = false;
}

function handleTouchStart(e) {
    e.preventDefault();

    const actions = getActionLayout();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const tx = touch.clientX;
        const ty = touch.clientY;

        // Joystick — claim this touch
        if (!joystick.active && isInJoystickZone(tx, ty)) {
            joystick.active = true;
            joystick.touchId = touch.identifier;
            updateJoystickFromTouch(tx, ty);

            // Also fire synthetic key for menu navigation
            if (touchState.up) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', bubbles: true }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', bubbles: true })), 50);
            }
            if (touchState.down) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', bubbles: true })), 50);
            }
            continue;
        }

        // Action buttons (one-shot)
        if (touchHitTest(tx, ty, actions.btnE)) {
            ePressed = true;
            if (shopOpen || adminOpen) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true })), 50);
            }
        }
        if (touchHitTest(tx, ty, actions.btnH)) hPressed = true;
        if (touchHitTest(tx, ty, actions.btnB)) bPressed = true;
        if (touchHitTest(tx, ty, actions.btnF)) fPressed = true;

        // Tap on pause button area
        if (touchHitTest(tx, ty, pauseBtn)) {
            if (gameState === 'playing' && !shopOpen) {
                gameState = 'paused'; pauseSelection = 0;
                if (currentSlot) saveGame(currentSlot);
            }
        }

        // Tap on teleport button area
        if (adminUnlocked && touchHitTest(tx, ty, teleportBtn)) {
            if (gameState === 'playing' && !shopOpen && !adminOpen) {
                teleportToCastleGates();
            }
        }

        // Tap on shop button area
        if (dragonKills > 0 && touchHitTest(tx, ty, shopBtn)) {
            if (gameState === 'playing' && !shopOpen) {
                shopOpen = true; shopSelection = 0;
            }
        }

        // Tap on admin button area
        if (touchHitTest(tx, ty, adminBtn)) {
            if (gameState === 'playing' && !shopOpen && !adminOpen) {
                tryAdminLogin();
            }
        }

        // Tap on admin close button
        if (adminOpen && touchHitTest(tx, ty, adminCloseBtn)) {
            adminOpen = false;
        }

        // Tap on shop close button
        if (shopOpen && touchHitTest(tx, ty, shopCloseBtn)) {
            shopOpen = false;
        }
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (joystick.active && touch.identifier === joystick.touchId) {
            updateJoystickFromTouch(touch.clientX, touch.clientY);
        }
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (joystick.active && touch.identifier === joystick.touchId) {
            resetJoystick();
        }
    }
}

// Always register touch listeners (harmless on non-touch devices)
canvas.addEventListener('touchstart', function(e) {
    isTouchDevice = true;
    handleTouchStart(e);
}, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

// ── Draw touch controls ─────────────────────────────────────

function drawTouchButton(rect, label, pressed, color) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = pressed ? 'rgba(255,255,255,0.3)' : 'rgba(30,30,40,0.75)';
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = 'rgba(' + color + ',' + (pressed ? 0.9 : 0.7) + ')';
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.font = 'bold ' + (rect.w > 80 ? 18 : 15) + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(' + color + ',1)';
    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
    ctx.restore();
}

function drawJoystick() {
    ctx.save();
    ctx.globalAlpha = 1;

    const c = getJoystickCenter();

    // Outer ring
    ctx.beginPath();
    ctx.arc(c.x, c.y, JOY_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30,30,40,0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Knob
    const knobX = c.x + joystick.dx * JOY_RADIUS;
    const knobY = c.y + joystick.dy * JOY_RADIUS;
    ctx.beginPath();
    ctx.arc(knobX, knobY, JOY_KNOB_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = joystick.active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)';
    ctx.fill();
    ctx.strokeStyle = joystick.active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}

function drawTouchControls() {
    if (!isTouchDevice) return;

    const actions = getActionLayout();

    if (gameState === 'playing') {
        drawJoystick();
        drawTouchButton(actions.btnE, 'ACT', false, '255,215,0');
        drawTouchButton(actions.btnH, 'HIT', false, '255,80,80');
        drawTouchButton(actions.btnB, 'BLK', false, '68,136,255');
        drawTouchButton(actions.btnF, 'HEAL', false, '138,43,226');
    } else {
        // Menu/pause/dead: joystick + ACT for navigation
        drawJoystick();
        drawTouchButton(actions.btnE, 'ACT', false, '255,215,0');
    }
}
