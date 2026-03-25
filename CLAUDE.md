# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` in a browser. Works via `file://` or any static server (e.g. `python3 -m http.server`). No build system, bundler, or package manager — just vanilla JS with `<script>` tags.

## Architecture

This is a 2D canvas adventure game (~8,100 lines of JS across 12 files). **All variables share global scope** — there are no modules or imports. Script load order in `index.html` is critical:

1. **config.js** (123 lines) — Canvas, tile type constants (VOID=0 through DESIGN_RACK=44, plus ARENA_FLOOR=43), T=32px tile size, shared state declarations (`gameTime`, `inBoat`, `shieldActive`, `inArena`), `GAME_VERSION` constant, `drawVersion()`, and `kl()` key label helper
2. **map.js** (282 lines) — `buildMap()` generates the 240×30 tile grid (`map[][]`). World flows top-to-bottom: Castle (rows 1-28) → Outdoor/Bridge (29-43) → Forest (44-79) → Wizard Hut (80-84) → Lake/Beach (85-110) → Camp (113-118) → Mountain/Cave/Peak (119-195) → Arena (210-230, teleport only)
3. **entities.js** (249 lines) — Player, NPC positions, `isSolid()` collision (checks 4 corners against tile types + progression gates), proximity checks (`isNearWizard()`, `isNearJackFrost()`, etc.)
4. **npcs.js** (939 lines) — All NPC/enemy pixel-art draw functions. Includes snow-conditional rendering: `drawDragon` uses icy blue palette when `isSnowing()`, `drawOrc` renders caveman style during snow
5. **notifications.js** (26 lines) — Toast notification system
6. **systems.js** (3,072 lines) — **Largest file.** Contains all game logic: cooking, hunger/health/bathroom, quest tracking (main/void/frost), NPC dialog state machines, combat for all enemies, building system, weapon mastery, dagger abilities (stab/void rush), snow weather, ice trap mechanic, snowflake currency, Ice Traveler shop, Jack Frost quest
7. **rendering.js** (965 lines) — `drawTile()` for all tile types, `DESIGN_COLORS` (default/gold/void/ice), `dc()` theme helper, player sprite rendering (`drawKing`/`drawKingInBoat`), weapon drawing (sword/dagger/ice spear/void star per mastery skin), stab animation, snow overlay/particles, ice trap visual
8. **hud.js** (871 lines) — Health/hunger bars, quest panel, interaction prompts, pause/death screens, shop menu, admin panel, mastery screens (sword/dagger/spear), settings screen, snowflake counter
9. **menu.js** (340 lines) — Main menu, `saveGame()`/`loadGame()`/`resetGameState()`/`newGame()` using localStorage (`kingGame_saves`). **When adding new persistent state, add it to all three: `saveGame()`, `loadGame()`, and `resetGameState()`.**
10. **touch.js** (268 lines) — Touch controls overlay for mobile/tablet. Virtual joystick (bottom-right) for movement with diagonal support, ACT/HIT/BLK/HEAL buttons (bottom-left). Only activates on touch-capable devices (`isTouchDevice`). Fires synthetic key events for menu navigation; sets `touchState.*` flags for continuous movement. HUD elements in hud.js shift up via `touchOffsetL`/`touchOffsetR` when touch is active.
11. **pathfinding.js** (128 lines) — A* pathfinding for NPC movement
12. **main.js** (868 lines) — `gameLoop()` via requestAnimationFrame, keyboard input, WASD movement with collision, camera follow, all E/H/F/B/Y key press routing, NPC interaction triggers, render pipeline ordering

## Versioning — IMPORTANT

**Every change to the game must update the version in two places:**

1. `GAME_VERSION` in **config.js** (e.g. `'v3.1'` → `'v3.2'`)
2. All `?v=N` query strings on `<script>` tags in **index.html** (e.g. `?v=3.1` → `?v=3.2`)

The version is displayed in the top-right corner of the screen at all times (menu, playing, paused, dead) via `drawVersion()`. This helps detect stale caches on iPad/mobile. The query strings on script tags are the cache-busting mechanism — without updating them, iPad Safari may serve old JS files.

## Key Labels (`kl()`)

All user-facing key references (prompts, dialogs, notifications, HUD indicators) use `kl(action)` from config.js instead of hardcoded key names. This returns the keyboard key name (e.g. `'E'`, `'H'`) on desktop and the touch button label (e.g. `'ACT'`, `'HIT'`) on touch devices. Available actions: `'E'`, `'H'`, `'B'`, `'F'`, `'Y'`, `'nav'`. When adding new prompts or messages that reference controls, always use `kl()`.

## Key Patterns

**State machine:** `gameState` is `'menu'`/`'playing'`/`'paused'`/`'dead'`. The game loop in `main.js` branches on this. `pauseScreen` sub-states: `'main'`/`'quests'`/`'mastery'`/`'mastery_sword'`/`'mastery_dagger'`/`'mastery_spear'`/`'settings'`.

**Progression gates:** `isSolid()` in entities.js has special checks that block paths until quest milestones are reached (e.g., path to lake blocked until spider defeated). These gates use `questTasks.*` flags and are disabled after first dragon kill (`dragonKills > 0`).

**Map mutation:** Progression events modify `map[][]` directly at runtime (e.g., `openSecretPassage()` carves PATH tiles into TREE tiles, `buildWeaponryRoom()` creates a new room). The `loadGame()` function re-runs these mutations based on saved flags.

**NPC dialogs:** Each NPC has a dialog object with `active` and `stage` fields forming a state machine (e.g., `wizardDialog.stage` cycles through `'greeting'` → `'quest_info'` → `'passage_open'`). Dialog advances on E key press. NPC dialog objects: `dialog` (cook), `butlerDialog`, `messengerDialog`, `wizardDialog`, `campLeaderDialog`, `campScoutDialog`, `campBlacksmithDialog`, `campHealerDialog`, `iceTravelerDialog`, `jackFrostDialog`.

**Enemy respawn:** Spider, sea snake, and troll respawn 10 seconds after death (`MOB_RESPAWN_DELAY`). Dragon respawns after 2 minutes (`DRAGON_RESPAWN_DELAY`). All monsters respawn together when dragon is killed (`respawnMonsters()`).

**Time:** `gameTime` (milliseconds, pausable) drives gameplay timers. `performance.now()` is used only for visual animations (sword swing, walking, particle effects).

**Save/load:** `saveGame()` serializes ~40+ state variables into localStorage. `loadGame()` restores them and re-runs map mutations (secret passage, rooms). When adding new persistent state, it must be added to `saveGame()`, `loadGame()`, AND `resetGameState()` in menu.js.

## Weapon System

Weapons cycle via `getSwordOrder()` with G key. Maps in systems.js:
- `SWORD_DMG_MAP` — damage per weapon: legendary(2), kings(3), dagger(3), icespear(5), dragon(5), voidstar(7), admin(10)
- `SWORD_NAME_MAP` / `SWORD_COLOR_MAP` — display names and HUD colors
- Unlock flags: `kingSwordUnlocked`, `dragonSwordUnlocked`, `daggerUnlocked`, `iceSpearUnlocked`, `voidStarSwordUnlocked`

**Mastery system:** Each weapon category (sword/dagger/spear) has `{xp, level}` + milestones map + skin names. `addWeaponXP()` routes XP based on `currentSword`. `getActiveMasterySkin()` returns correct skin per weapon. Mastery level capped at 100 unless `extraLevels` is on.

**Dagger abilities:** `daggerStab` (Y key) — stance/thrust animation with backstab detection. `voidRush` (V key) — two-hit dash attack. Both grant invincibility via `isAbilityInvincible()`. Damage values are configurable: `stabFrontDmg`/`stabBackDmg`, `voidRushDmg1`/`voidRushDmg2`.

## Castle Design System

`DESIGN_COLORS` in rendering.js defines color palettes: `default`, `gold`, `void`, `ice`. The `dc()` function returns current palette. `switchDesign()` in systems.js cycles through unlocked designs. Unlock flags: `goldDesignUnlocked` (first dragon kill), `voidDesignUnlocked` (void sentinel defeated), `icePalaceUnlocked` (Jack Frost quest complete).

## Ice/Snow Event System (v3.1)

**Snow weather:** 30-min cycle (`SNOW_CYCLE`), snows for last 15 min (`SNOW_DURATION`). `isSnowing()` checks gameTime modulo. Visual: `drawSnowOverlay()` tints outdoor tiles (rows > 28), `drawSnowParticles()` renders falling snowflakes. Castle interior excluded.

**During snow, mobs transform:**
- Dragon → Ice Dragon (blue palette, icy effects). Fire breath → ice ball with snow trail
- Orcs → Cavemen (fur clothing, bone clubs, tan skin)
- HUD shows "ICE DRAGON" label, "ICE BALL INCOMING!" warning

**Ice trap:** When ice ball hits player: 2 dmg + trapped in ice block. Must press H 20 times in 6 seconds to break free, or take 2 extra damage. `iceTrap` object in systems.js, visual in `drawIceTrap()` in rendering.js. Movement blocked during trap.

**Snowflake currency:** `snowflakeCount`, drops 1-3 per monster kill via `dropSnowflakes()`. Added to ALL kill handlers (both `handleStabKill` and regular hit functions).

**Ice Traveler NPC:** 40-min cycle (`ICE_TRAVELER_CYCLE`), present last 10 min. Appears at camp (row 117, col 22). Sells Ice Spear (20 snowflakes). Shop system in systems.js.

**Jack Frost NPC:** Appears during snow at row 35, col 8 (outdoor area). Gives quest to kill all 5 monsters (spider, sea snake, orcs, troll, dragon) during snow. Reward: 500 snowflakes + Ice Palace castle skin. Quest state: `jackFrostQuestActive`, `jackFrostQuestComplete`, `jackFrostKills` object. Kills only count when `isSnowing() && jackFrostQuestActive`.

## Quest System

`activeQuest` = `'main'` / `'void'` / `'frost'`. Selectable from pause menu. `drawQuestTasks()` routes to appropriate display function based on active quest. Quest items shown in `getQuestItems()` in hud.js.

## Render Pipeline (main.js)

Order matters for layering:
1. Background fill → tile loop (`drawTile`) → **snow overlay** → NPCs/enemies → player → dagger trail → void rush → shield → **ice trap** → sleep overlay → **snow particles** → HUD/dialogs/prompts → notifications → version → touch controls

## Adding New NPCs (checklist)

1. **entities.js** — Position object + `isNear*()` proximity function
2. **npcs.js** — `draw*()` pixel-art function
3. **systems.js** — Dialog object (`{ active, stage }`), `open*Dialog()`, `advance*Dialog()`, `draw*Dialog()`
4. **main.js** — Add `draw*()` call in render section, add dialog draw in dialog chain, add prompt in prompt chain, add E-press interaction trigger, add Escape close handler, add dialog advance in E-press handler
5. **menu.js** — Add any persistent state to `saveGame()`, `loadGame()`, `resetGameState()`

## Adding New Kill Tracking

When adding rewards/tracking to monster kills, there are TWO kill paths to update:
1. `handleStabKill()` in systems.js (~line 1040) — dagger stab kills
2. Individual `hit*()` functions (e.g., `hitSpider()`, `hitDragon()`) — regular combat kills

Both paths exist for: spider, seaSnake, troll, dragon, voidSentinel, orcs.

## Controls

WASD/Arrows: Move | E: Interact/advance dialog | H: Attack | F: Heal | B: Shield | G: Switch sword | V: Void Rush | Y: Dagger Stab | P/Esc: Pause | 1-3: Save slots (while paused)

**Touch (iPad/mobile):** Virtual joystick (bottom-right) for movement including diagonals, ACT/HIT/BLK/HEAL buttons (bottom-left). Pause and Shop buttons are tap-enabled. Controls only appear on touch devices.
