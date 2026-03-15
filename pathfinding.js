// ── Pathfinding (A* on tile grid) ──────────────────────────

const PATHFIND_THRESHOLD = T * 3;

function isTileWalkableForNPC(col, row) {
    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return false;
    const tile = map[row][col];
    if (tile === VOID) return false;
    return !NPC_SOLID.has(tile);
}

// Binary min-heap for A* open set
function MinHeap() {
    this.data = [];
}
MinHeap.prototype.push = function(node) {
    this.data.push(node);
    let i = this.data.length - 1;
    while (i > 0) {
        const parent = (i - 1) >> 1;
        if (this.data[i].f < this.data[parent].f) {
            const tmp = this.data[i]; this.data[i] = this.data[parent]; this.data[parent] = tmp;
            i = parent;
        } else break;
    }
};
MinHeap.prototype.pop = function() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
        this.data[0] = last;
        let i = 0;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < this.data.length && this.data[l].f < this.data[smallest].f) smallest = l;
            if (r < this.data.length && this.data[r].f < this.data[smallest].f) smallest = r;
            if (smallest !== i) {
                const tmp = this.data[i]; this.data[i] = this.data[smallest]; this.data[smallest] = tmp;
                i = smallest;
            } else break;
        }
    }
    return top;
};
MinHeap.prototype.isEmpty = function() { return this.data.length === 0; };

function findPath(startCol, startRow, goalCol, goalRow, maxIter) {
    if (!maxIter) maxIter = 2000;
    if (startCol === goalCol && startRow === goalRow) return [];
    // If goal tile is blocked, find nearest walkable tile to goal
    if (!isTileWalkableForNPC(goalCol, goalRow)) {
        let best = null, bestDist = Infinity;
        for (let dr = -2; dr <= 2; dr++)
            for (let dc = -2; dc <= 2; dc++) {
                const r = goalRow + dr, c = goalCol + dc;
                if (isTileWalkableForNPC(c, r)) {
                    const d = Math.abs(dr) + Math.abs(dc);
                    if (d < bestDist) { best = { col: c, row: r }; bestDist = d; }
                }
            }
        if (!best) return null;
        goalCol = best.col; goalRow = best.row;
    }

    const key = (col, row) => row * MAP_COLS + col;
    const open = new MinHeap();
    const gScore = {};
    const cameFrom = {};
    const startKey = key(startCol, startRow);
    gScore[startKey] = 0;
    open.push({ col: startCol, row: startRow, f: Math.abs(goalCol - startCol) + Math.abs(goalRow - startRow) });

    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // 4-directional
    let iterations = 0;

    while (!open.isEmpty() && iterations < maxIter) {
        iterations++;
        const cur = open.pop();
        const curKey = key(cur.col, cur.row);

        if (cur.col === goalCol && cur.row === goalRow) {
            // Reconstruct path
            const path = [];
            let k = curKey;
            while (k !== undefined && k !== startKey) {
                const r = Math.floor(k / MAP_COLS), c = k % MAP_COLS;
                path.push({ col: c, row: r });
                k = cameFrom[k];
            }
            path.reverse();
            return path;
        }

        const curG = gScore[curKey];
        for (const [dc, dr] of dirs) {
            const nc = cur.col + dc, nr = cur.row + dr;
            if (!isTileWalkableForNPC(nc, nr)) continue;
            const nk = key(nc, nr);
            const ng = curG + 1;
            if (gScore[nk] === undefined || ng < gScore[nk]) {
                gScore[nk] = ng;
                cameFrom[nk] = curKey;
                const h = Math.abs(goalCol - nc) + Math.abs(goalRow - nr);
                open.push({ col: nc, row: nr, f: ng + h });
            }
        }
    }
    return null; // No path found
}

function moveAlongPath(entity, path, pathIndex, speed, dt) {
    if (!path || pathIndex >= path.length) return pathIndex;

    const wp = path[pathIndex];
    const tx = wp.col * T + T / 2 - entity.width / 2;
    const ty = wp.row * T + T / 2 - entity.height / 2;
    const dx = tx - entity.x, dy = ty - entity.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) return pathIndex + 1; // Reached waypoint

    const mx = (dx / dist) * speed * dt;
    const my = (dy / dist) * speed * dt;
    if (!isNPCBlocked(entity.x + mx, entity.y, entity.width, entity.height)) entity.x += mx;
    if (!isNPCBlocked(entity.x, entity.y + my, entity.width, entity.height)) entity.y += my;
    return pathIndex;
}
