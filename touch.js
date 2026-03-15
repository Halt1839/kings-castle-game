// ── Touch Controls ──────────────────────────────────────────
// D-pad (right side) + action buttons (left side)
// Only shown on touch-capable devices

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// Track active touches per button
const touchState = {
    up: false, down: false, left: false, right: false,
};

// Button layout constants
const DPAD_SIZE = 52;
const DPAD_GAP = 4;
const BTN_SIZE = 52;
const BTN_GAP = 10;
const TOUCH_MARGIN = 20;
const TOUCH_OPACITY = 0.45;

function getDpadLayout() {
    const baseX = canvas.width - TOUCH_MARGIN - DPAD_SIZE * 3 - DPAD_GAP * 2;
    const baseY = canvas.height - TOUCH_MARGIN - DPAD_SIZE * 3 - DPAD_GAP * 2;
    return {
        up:    { x: baseX + DPAD_SIZE + DPAD_GAP, y: baseY, w: DPAD_SIZE, h: DPAD_SIZE },
        down:  { x: baseX + DPAD_SIZE + DPAD_GAP, y: baseY + (DPAD_SIZE + DPAD_GAP) * 2, w: DPAD_SIZE, h: DPAD_SIZE },
        left:  { x: baseX, y: baseY + DPAD_SIZE + DPAD_GAP, w: DPAD_SIZE, h: DPAD_SIZE },
        right: { x: baseX + (DPAD_SIZE + DPAD_GAP) * 2, y: baseY + DPAD_SIZE + DPAD_GAP, w: DPAD_SIZE, h: DPAD_SIZE },
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

function updateDpadFromTouches(e) {
    const dpad = getDpadLayout();
    touchState.up = false;
    touchState.down = false;
    touchState.left = false;
    touchState.right = false;

    const touches = e.touches;
    for (let i = 0; i < touches.length; i++) {
        const tx = touches[i].clientX;
        const ty = touches[i].clientY;
        if (touchHitTest(tx, ty, dpad.up)) touchState.up = true;
        if (touchHitTest(tx, ty, dpad.down)) touchState.down = true;
        if (touchHitTest(tx, ty, dpad.left)) touchState.left = true;
        if (touchHitTest(tx, ty, dpad.right)) touchState.right = true;
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    updateDpadFromTouches(e);

    const dpad = getDpadLayout();
    const actions = getActionLayout();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const tx = e.changedTouches[i].clientX;
        const ty = e.changedTouches[i].clientY;

        // Action buttons (one-shot)
        if (touchHitTest(tx, ty, actions.btnE)) ePressed = true;
        if (touchHitTest(tx, ty, actions.btnH)) hPressed = true;
        if (touchHitTest(tx, ty, actions.btnB)) bPressed = true;
        if (touchHitTest(tx, ty, actions.btnF)) fPressed = true;

        // D-pad up/down for menu/dialog navigation (dispatch synthetic key event)
        if (touchHitTest(tx, ty, dpad.up)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', bubbles: true }));
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', bubbles: true })), 50);
        }
        if (touchHitTest(tx, ty, dpad.down)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }));
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', bubbles: true })), 50);
        }

        // Tap on pause button area
        if (touchHitTest(tx, ty, pauseBtn)) {
            if (gameState === 'playing' && !shopOpen) {
                gameState = 'paused'; pauseSelection = 0;
                if (currentSlot) saveGame(currentSlot);
            }
        }

        // Tap on shop button area
        if (dragonKills > 0 && touchHitTest(tx, ty, shopBtn)) {
            if (gameState === 'playing' && !shopOpen) {
                shopOpen = true; shopSelection = 0;
            }
        }
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    updateDpadFromTouches(e);
}

function handleTouchEnd(e) {
    e.preventDefault();
    updateDpadFromTouches(e);
}

if (isTouchDevice) {
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
}

// ── Draw touch controls ─────────────────────────────────────

function drawRoundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

function drawTouchButton(rect, label, pressed, color) {
    const alpha = pressed ? 0.7 : TOUCH_OPACITY;
    const bg = pressed ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)';

    drawRoundedRect(rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = `rgba(${color},${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = `bold ${rect.w > 80 ? 16 : 14}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(${color},${alpha + 0.2})`;
    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
}

function drawDpadArrow(rect, direction, pressed) {
    const alpha = pressed ? 0.8 : TOUCH_OPACITY;
    const bg = pressed ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)';

    drawRoundedRect(rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const s = 10;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    if (direction === 'up') {
        ctx.moveTo(cx, cy - s); ctx.lineTo(cx - s, cy + s * 0.6); ctx.lineTo(cx + s, cy + s * 0.6);
    } else if (direction === 'down') {
        ctx.moveTo(cx, cy + s); ctx.lineTo(cx - s, cy - s * 0.6); ctx.lineTo(cx + s, cy - s * 0.6);
    } else if (direction === 'left') {
        ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s * 0.6, cy - s); ctx.lineTo(cx + s * 0.6, cy + s);
    } else {
        ctx.moveTo(cx + s, cy); ctx.lineTo(cx - s * 0.6, cy - s); ctx.lineTo(cx - s * 0.6, cy + s);
    }
    ctx.closePath();
    ctx.fill();
}

function drawTouchControls() {
    if (!isTouchDevice) return;

    const dpad = getDpadLayout();
    const actions = getActionLayout();

    if (gameState === 'playing') {
        // Full controls during gameplay
        drawDpadArrow(dpad.up, 'up', touchState.up);
        drawDpadArrow(dpad.down, 'down', touchState.down);
        drawDpadArrow(dpad.left, 'left', touchState.left);
        drawDpadArrow(dpad.right, 'right', touchState.right);

        drawTouchButton(actions.btnE, 'ACT', false, '255,215,0');
        drawTouchButton(actions.btnH, 'HIT', false, '255,80,80');
        drawTouchButton(actions.btnB, 'BLK', false, '68,136,255');
        drawTouchButton(actions.btnF, 'HEAL', false, '138,43,226');
    } else {
        // Menu/pause/dead: just up/down + ACT for navigation
        drawDpadArrow(dpad.up, 'up', touchState.up);
        drawDpadArrow(dpad.down, 'down', touchState.down);
        drawTouchButton(actions.btnE, 'ACT', false, '255,215,0');
    }
}
