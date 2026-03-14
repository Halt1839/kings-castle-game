# The King's Castle

A 2D canvas adventure game where you play as a king managing daily royal duties — eating, sleeping, and eventually embarking on a quest to slay a dragon.

## How to Run

Open `index.html` in a browser (works via `file://` or any static server).

## File Overview

| File | Purpose | Key Contents |
|---|---|---|
| `config.js` | Global constants and canvas setup | Canvas/ctx, game state, tile constants, `gameTime` |
| `map.js` | Castle map generation | `buildMap()`, tile layout for all rooms and outdoors |
| `entities.js` | Player and NPC definitions | `player`, NPC objects, collision (`isSolid`), proximity checks |
| `npcs.js` | NPC drawing functions | `drawCook()`, `drawGuard()`, `drawButler()` |
| `notifications.js` | Toast notification system | `addNotification()`, `drawNotifications()` |
| `systems.js` | Game systems and logic | Cooking, butler, hunger, health, bathroom, quest tasks, messenger, sword, interactions, `eatFood()` |
| `rendering.js` | Tile and king rendering | `drawTile()` (27 tile types), king pose drawing, sleep overlay |
| `hud.js` | HUD and pause UI | Health/hunger bars, prompts, pause button/menu |
| `menu.js` | Main menu and save/load | `saveGame()`, `loadGame()`, `newGame()`, `drawMainMenu()` |
| `main.js` | Input handling and game loop | Keyboard/mouse listeners, `gameLoop()`, movement, camera |

## Load Order

Scripts are loaded via `<script>` tags in `index.html` — order matters because all variables share global scope (no build system or modules):

1. **config.js** — constants needed by everything
2. **map.js** — map array used by collision and rendering
3. **entities.js** — player/NPCs used by systems and rendering
4. **npcs.js** — NPC draw functions (reference `cookingState`/`butlerState` at call time)
5. **notifications.js** — `addNotification()` called by many systems
6. **systems.js** — game logic that references all above
7. **rendering.js** — tile/king drawing referencing map, entities, systems
8. **hud.js** — UI overlay referencing systems state
9. **menu.js** — save/load referencing all game state
10. **main.js** — orchestrates everything in `gameLoop()`
