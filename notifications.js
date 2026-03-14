// ── Notifications ───────────────────────────────────────────

let notifications = []; // { text, time, duration, color, bgColor }

function addNotification(text, duration, color, bgColor) {
    notifications.push({ text, time: gameTime, duration, color: color || '#fff', bgColor: bgColor || 'rgba(0,0,0,0.8)' });
}

function drawNotifications() {
    let yOff = 50;
    notifications = notifications.filter(n => {
        const elapsed = gameTime - n.time;
        if (elapsed > n.duration) return false;
        const alpha = elapsed < 300 ? elapsed / 300 : elapsed > n.duration - 300 ? (n.duration - elapsed) / 300 : 1;
        ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const tw = ctx.measureText(n.text).width + 32;
        const tx = canvas.width / 2;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = n.bgColor; ctx.fillRect(tx - tw/2, yOff - 16, tw, 32);
        ctx.strokeStyle = n.color; ctx.lineWidth = 2; ctx.strokeRect(tx - tw/2, yOff - 16, tw, 32);
        ctx.fillStyle = n.color; ctx.fillText(n.text, tx, yOff);
        ctx.globalAlpha = 1;
        yOff += 40;
        return true;
    });
}
