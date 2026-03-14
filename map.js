let map;

function buildMap() {
    map = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(VOID));

    function fill(r, c, w, h, tile) {
        for (let y = r; y < r + h; y++)
            for (let x = c; x < c + w; x++)
                map[y][x] = tile;
    }
    function walls(r, c, w, h) {
        for (let x = c; x < c + w; x++) { map[r][x] = WALL; map[r + h - 1][x] = WALL; }
        for (let y = r; y < r + h; y++) { map[y][c] = WALL; map[y][c + w - 1] = WALL; }
    }

    // Throne Room
    fill(1, 5, 20, 10, FLOOR);
    walls(1, 5, 20, 10);
    fill(3, 14, 2, 6, CARPET);
    map[2][14] = THRONE; map[2][15] = THRONE;
    map[2][12] = TORCH; map[2][17] = TORCH;
    map[1][9] = WINDOW_TILE; map[1][12] = WINDOW_TILE;
    map[1][17] = WINDOW_TILE; map[1][20] = WINDOW_TILE;

    // Bedroom
    fill(10, 1, 12, 11, FLOOR);
    walls(10, 1, 12, 11);
    fill(14, 4, 4, 4, RUG);
    map[11][2] = BED_HEAD; map[11][3] = BED_HEAD;
    map[12][2] = PILLOW; map[12][3] = PILLOW;
    map[13][2] = BED_FOOT; map[13][3] = BED_FOOT;
    map[11][4] = NIGHTSTAND;
    map[11][6] = SHELF; map[11][7] = SHELF;
    map[10][5] = WINDOW_TILE; map[10][8] = WINDOW_TILE;
    map[13][10] = TORCH;

    // Bathroom (below bedroom)
    fill(21, 1, 8, 6, BATH_FLOOR);
    walls(21, 1, 8, 6);
    // Door connecting bedroom bottom to bathroom
    map[20][4] = DOOR; map[20][5] = DOOR;
    // Extend floor for corridor
    map[21][4] = DOOR; map[21][5] = DOOR;
    // Toilet
    map[22][2] = TOILET;
    // Bathtub
    map[22][6] = BATHTUB; map[23][6] = BATHTUB;
    // Sink + mirror
    map[22][4] = SINK;
    map[21][4] = MIRROR; // on wall above sink — re-do: mirror on top wall
    map[21][2] = WALL; map[21][3] = WALL; map[21][6] = WALL; map[21][7] = WALL;
    map[21][4] = DOOR; map[21][5] = DOOR;
    // Window
    map[26][3] = WINDOW_TILE; map[26][5] = WINDOW_TILE;
    // Torch
    map[23][7] = TORCH;

    // Kitchen
    fill(10, 17, 12, 11, FLOOR);
    walls(10, 17, 12, 11);
    map[11][26] = STOVE; map[11][25] = STOVE; map[12][26] = STOVE;
    fill(14, 20, 3, 2, TABLE);
    map[13][21] = CHAIR; map[16][21] = CHAIR;
    map[14][19] = CHAIR; map[15][23] = CHAIR;
    map[18][25] = BARREL; map[18][26] = BARREL; map[19][26] = BARREL;
    map[11][20] = SHELF; map[11][21] = SHELF;
    map[10][21] = WINDOW_TILE; map[10][24] = WINDOW_TILE;
    map[13][18] = TORCH;

    // Hallways
    map[10][8] = FLOOR; map[10][9] = FLOOR; map[10][10] = FLOOR;
    fill(10, 7, 1, 2, WALL); fill(10, 11, 1, 2, WALL);
    map[10][8] = DOOR; map[10][9] = DOOR; map[10][10] = DOOR;
    map[10][20] = DOOR; map[10][21] = DOOR; map[10][22] = DOOR;
    fill(13, 12, 5, 3, FLOOR);
    walls(13, 12, 5, 3);
    fill(12, 12, 5, 1, WALL); fill(16, 12, 5, 1, WALL);
    map[13][12] = DOOR; map[14][12] = DOOR; map[15][12] = DOOR;
    map[13][16] = DOOR; map[14][16] = DOOR; map[15][16] = DOOR;
    fill(13, 13, 3, 3, FLOOR);
    map[14][14] = TORCH;

    // ── Castle Entrance (bottom of throne room, cols 14-15) ──
    map[10][14] = DOOR; map[10][15] = DOOR;

    // ── Exit Corridor (cols 13-16 going south between rooms) ──
    fill(11, 13, 4, 1, FLOOR); // row 11
    map[11][12] = WALL; map[11][17] = WALL;
    // rows 12: wall above hallway is already there
    // Continue corridor south from hallway (row 16) downward
    for (let r = 16; r <= 28; r++) {
        map[r][12] = WALL; map[r][17] = WALL;
        fill(r, 13, 4, 1, FLOOR);
    }
    // Overwrite hallway bottom wall doors
    map[16][13] = FLOOR; map[16][14] = FLOOR; map[16][15] = FLOOR; map[16][16] = FLOOR;
    // Castle gate at row 28
    map[28][12] = WALL; map[28][13] = DOOR; map[28][14] = DOOR;
    map[28][15] = DOOR; map[28][16] = DOOR; map[28][17] = WALL;
    // Torches at gate
    map[27][12] = TORCH; map[27][17] = TORCH;

    // ── Outdoor Area ──
    // Path leading from castle gate (row 29+), 10 blocks to bridge
    for (let r = 29; r <= 38; r++) {
        for (let c = 0; c < MAP_COLS; c++) {
            map[r][c] = GRASS;
        }
        // Dirt path down the center
        map[r][13] = PATH; map[r][14] = PATH;
        map[r][15] = PATH; map[r][16] = PATH;
    }

    // ── River (row 39-40) ──
    for (let c = 0; c < MAP_COLS; c++) {
        map[39][c] = WATER;
        map[40][c] = WATER;
    }

    // ── Bridge over river (cols 13-16) ──
    map[39][13] = BRIDGE; map[39][14] = BRIDGE; map[39][15] = BRIDGE; map[39][16] = BRIDGE;
    map[40][13] = BRIDGE; map[40][14] = BRIDGE; map[40][15] = BRIDGE; map[40][16] = BRIDGE;

    // ── Sword stuck in bridge crack ──
    map[39][14] = SWORD_TILE; map[39][15] = SWORD_TILE;

    // Short grass strip after river, then forest
    for (let r = 41; r <= 43; r++) {
        for (let c = 0; c < MAP_COLS; c++) map[r][c] = GRASS;
        map[r][13] = PATH; map[r][14] = PATH; map[r][15] = PATH; map[r][16] = PATH;
    }

    // ── Forest with sharp right-angle turns ──
    // Fill entire forest area with trees first
    for (let r = 44; r <= 79; r++)
        for (let c = 0; c < MAP_COLS; c++) map[r][c] = TREE;

    // Helper to carve path rectangles
    function carvePath(r1, c1, r2, c2) {
        for (let r = r1; r <= r2; r++)
            for (let c = c1; c <= c2; c++) map[r][c] = PATH;
    }

    // Widen forest entry to connect with 4-wide grass path
    carvePath(44, 13, 44, 16);
    // Segment 1: south (cols 14-15, rows 44-51)
    carvePath(44, 14, 51, 15);
    // Turn east (rows 51-52, cols 14-23)
    carvePath(51, 14, 52, 23);
    // Segment 2: south (cols 22-23, rows 52-59)
    carvePath(52, 22, 59, 23);
    // Turn west (rows 59-60, cols 8-23)
    carvePath(59, 8, 60, 23);
    // Segment 3: south (cols 8-9, rows 60-67)
    carvePath(60, 8, 67, 9);
    // Turn east (rows 67-68, cols 8-15)
    carvePath(67, 8, 68, 15);
    // Segment 4: south to hut (cols 14-15, rows 68-79)
    carvePath(68, 14, 79, 15);

    // ── Hut clearing (rows 78-79, wider path area) ──
    carvePath(78, 12, 79, 18);

    // ── Hut (rows 80-84, cols 12-18) ──
    // Fill hut area with trees first
    for (let r = 80; r < MAP_ROWS; r++)
        for (let c = 0; c < MAP_COLS; c++) map[r][c] = TREE;

    // Hut walls
    for (let c = 12; c <= 18; c++) { map[80][c] = HUT_WALL; map[84][c] = HUT_WALL; }
    for (let r = 80; r <= 84; r++) { map[r][12] = HUT_WALL; map[r][18] = HUT_WALL; }
    // Hut floor
    for (let r = 81; r <= 83; r++)
        for (let c = 13; c <= 17; c++) map[r][c] = HUT_FLOOR;
    // Hut door (north wall, cols 14-15)
    map[80][14] = HUT_FLOOR; map[80][15] = HUT_FLOOR;

    // ── South exit from hut ──
    map[84][14] = HUT_FLOOR; map[84][15] = HUT_FLOOR;

    // ── Path south through forest to lake shore ──
    carvePath(85, 14, 89, 15);

    // ── Near beach (rows 90-91) ──
    for (let c = 0; c < MAP_COLS; c++) {
        map[90][c] = SAND;
        map[91][c] = SAND;
    }
    // Dock on near beach
    map[91][14] = DOCK; map[91][15] = DOCK;

    // ── Lake (rows 92-108) ──
    for (let r = 92; r <= 108; r++)
        for (let c = 0; c < MAP_COLS; c++) map[r][c] = WATER;

    // ── Far beach (rows 109-110) ──
    for (let c = 0; c < MAP_COLS; c++) {
        map[109][c] = SAND;
        map[110][c] = SAND;
    }
    // Dock on far beach
    map[109][14] = DOCK; map[109][15] = DOCK;

    // ── Landing area (rows 111-119) ──
    for (let r = 111; r < MAP_ROWS; r++)
        for (let c = 0; c < MAP_COLS; c++) map[r][c] = GRASS;
    // Path leading to camp
    for (let r = 111; r <= 112; r++) {
        map[r][13] = PATH; map[r][14] = PATH;
        map[r][15] = PATH; map[r][16] = PATH;
    }

    // ── Camp area (rows 113-118) ──
    for (let r = 113; r <= 118; r++)
        for (let c = 3; c <= 26; c++) map[r][c] = PATH;
    // Tents at corners
    map[113][4] = TENT; map[113][5] = TENT;
    map[113][24] = TENT; map[113][25] = TENT;
    map[117][4] = TENT; map[117][5] = TENT;
    map[117][24] = TENT; map[117][25] = TENT;
    // Campfire at center
    map[115][14] = CAMPFIRE; map[115][15] = CAMPFIRE;

    // ── Path from camp to mountain (rows 119-133, 15 blocks) ──
    for (let r = 119; r <= 133; r++) {
        map[r][14] = PATH; map[r][15] = PATH;
    }

    // ── Mountain (rows 134-164, cols 3-26) ──
    for (let r = 134; r <= 164; r++)
        for (let c = 3; c <= 26; c++) map[r][c] = MOUNTAIN;

    // Spiral path up the mountain (MOUNTAIN_PATH, 2 tiles wide)
    // Entry from north
    for (let r = 134; r <= 137; r++) { map[r][14] = MOUNTAIN_PATH; map[r][15] = MOUNTAIN_PATH; }
    // East along top
    for (let c = 14; c <= 24; c++) { map[136][c] = MOUNTAIN_PATH; map[137][c] = MOUNTAIN_PATH; }
    // South down east side
    for (let r = 136; r <= 160; r++) { map[r][23] = MOUNTAIN_PATH; map[r][24] = MOUNTAIN_PATH; }
    // West across bottom
    for (let c = 5; c <= 24; c++) { map[159][c] = MOUNTAIN_PATH; map[160][c] = MOUNTAIN_PATH; }
    // North up west side
    for (let r = 140; r <= 160; r++) { map[r][5] = MOUNTAIN_PATH; map[r][6] = MOUNTAIN_PATH; }
    // East along inner top
    for (let c = 5; c <= 18; c++) { map[140][c] = MOUNTAIN_PATH; map[141][c] = MOUNTAIN_PATH; }
    // South down inner right to cave door
    for (let r = 140; r <= 150; r++) { map[r][17] = MOUNTAIN_PATH; map[r][18] = MOUNTAIN_PATH; }

    // ── Cave (cols 10-20, rows 148-156) ──
    // Cave walls (perimeter)
    for (let c = 10; c <= 20; c++) { map[148][c] = CAVE_WALL; map[156][c] = CAVE_WALL; }
    for (let r = 148; r <= 156; r++) { map[r][10] = CAVE_WALL; map[r][20] = CAVE_WALL; }
    // Cave floor (interior)
    for (let r = 149; r <= 155; r++)
        for (let c = 11; c <= 19; c++) map[r][c] = CAVE_FLOOR;
    // Cave door (north wall, where spiral path arrives)
    map[148][17] = CAVE_DOOR; map[148][18] = CAVE_DOOR;

    // ── Peak area (rows 166-194, cols 2-27) ──
    // Fill with mountain border first
    for (let r = 165; r <= 195; r++)
        for (let c = 1; c <= 28; c++) map[r][c] = MOUNTAIN;
    // Open arena floor
    for (let r = 167; r <= 193; r++)
        for (let c = 3; c <= 26; c++) map[r][c] = PEAK_FLOOR;
    // The passage from cave to peak is blocked (CAVE_WALL/MOUNTAIN)
    // until troll is defeated — openPeakPassage() carves it open
}
buildMap();
