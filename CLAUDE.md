# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` in a browser. Works via `file://` or any static server (e.g. `python3 -m http.server`). No build system, bundler, or package manager — just vanilla JS with `<script>` tags.

## Architecture

This is a 2D canvas adventure game (~4,200 lines of JS across 10 files). **All variables share global scope** — there are no modules or imports. Script load order in `index.html` is critical:

1. **config.js** — Canvas, tile type constants (VOID=0 through WEAPON_RACK=42), T=32px tile size, shared state declarations (`gameTime`, `inBoat`, `shieldActive`)
2. **map.js** — `buildMap()` generates the 200×30 tile grid (`map[][]`). World flows top-to-bottom: Castle (rows 1-28) → Outdoor/Bridge (29-40) → Forest (44-79) → Wizard Hut (80-84) → Lake/Beach (85-110) → Camp (113-118) → Mountain/Cave/Peak (119-195)
3. **entities.js** — Player, NPC positions, `isSolid()` collision (checks 4 corners against tile types + progression gates), proximity checks (`isNearWizard()`, etc.)
4. **npcs.js** — All NPC/enemy pixel-art draw functions
5. **notifications.js** — Toast notification system
6. **systems.js** — **Largest file (~1,600 lines).** Contains all game logic: cooking, hunger/health/bathroom, quest task tracking, NPC dialog state machines, combat for all enemies, building system, save-relevant state
7. **rendering.js** — `drawTile()` for all 42 tile types, player sprite rendering
8. **hud.js** — Health/hunger bars, quest panel, interaction prompts, pause/death screens
9. **menu.js** — Main menu, `saveGame()`/`loadGame()`/`newGame()` using localStorage (`kingGame_saves`)
10. **touch.js** — Touch controls overlay for mobile/tablet (d-pad + action buttons). Only activates on touch-capable devices (`isTouchDevice`). Fires synthetic key events for menu navigation; sets `touchState.*` flags for continuous movement. HUD elements in hud.js shift up via `touchOffsetL`/`touchOffsetR` when touch is active.
11. **main.js** — `gameLoop()` via requestAnimationFrame, keyboard input, WASD movement with collision, camera follow

## Key Patterns

**State machine:** `gameState` is `'menu'`/`'playing'`/`'paused'`/`'dead'`. The game loop in `main.js` branches on this.

**Progression gates:** `isSolid()` in entities.js has special checks that block paths until quest milestones are reached (e.g., path to lake blocked until spider defeated). These gates use `questTasks.*` flags and are disabled after first dragon kill (`dragonKills > 0`).

**Map mutation:** Progression events modify `map[][]` directly at runtime (e.g., `openSecretPassage()` carves PATH tiles into TREE tiles, `buildWeaponryRoom()` creates a new room). The `loadGame()` function re-runs these mutations based on saved flags.

**NPC dialogs:** Each NPC has a dialog object with `active` and `stage` fields forming a state machine (e.g., `wizardDialog.stage` cycles through `'greeting'` → `'quest_info'` → `'passage_open'`). Dialog advances on E key press.

**Enemy respawn:** Spider, sea snake, and troll respawn 10 seconds after death (`MOB_RESPAWN_DELAY`). Dragon respawns after 2 minutes. All monsters respawn together when dragon is killed (`respawnMonsters()`).

**Time:** `gameTime` (milliseconds, pausable) drives gameplay timers. `performance.now()` is used only for visual animations (sword swing, walking).

**Save/load:** `saveGame()` serializes ~30 state variables into localStorage. `loadGame()` restores them and re-runs map mutations (secret passage, rooms). When adding new persistent state, it must be added to both `saveGame()` and `loadGame()` in menu.js, plus reset in `newGame()`.

## Controls

WASD/Arrows: Move | E: Interact/advance dialog | H: Attack | F: Heal | B: Shield | G: Switch sword | P/Esc: Pause | 1-3: Save slots (while paused)

**Touch (iPad/mobile):** D-pad (bottom-right) for movement, ACT/HIT/BLK/HEAL buttons (bottom-left). Pause and Shop buttons are tap-enabled. Controls only appear on touch devices.
