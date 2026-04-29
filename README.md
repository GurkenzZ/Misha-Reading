# Misha Reading

Web-first alpha for a children's 2D reading game built with Phaser, TypeScript, and Vite.

## Install

```bash
npm install
```

If the default npm registry is unstable, use the same package versions from `package.json` with a reliable registry mirror.

## Development

```bash
npm run dev
```

Vite serves the game shell locally. The Phaser canvas mounts into `#game-root`.

## Build

```bash
npm run build
```

The build runs TypeScript in strict mode first, then creates the production bundle in `dist/`.

## Other Commands

```bash
npm run preview
npm run typecheck
```

## Folder Structure

- `src/game` - Phaser game bootstrap and configuration.
- `src/scenes` - isolated Phaser scenes.
- `src/systems` - small game systems.
- `src/state` - typed runtime state.
- `src/content` - typed content contracts and shared content/asset paths.
- `src/ui` - DOM and game-facing UI helpers.
- `public/content/levels` - data-driven level content.
- `public/content/letters.json` - early letter data for bootstrap testing.
- `public/assets` - local game assets.

## Current Flow

`BootScene` loads JSON content and moves to `StartScene`. `StartScene` shows the prototype title and a start zone. Pressing "Начать" opens `RunScene`, which reads `public/content/levels/bootstrap.json`, renders placeholder background/route/hero graphics, and launches the empty `ObstacleOverlayScene` above it.

## Next Threads

- Thread 2: content loading contracts, stronger debug screens, and first level selection.
- Thread 3: reading-route interaction loop with placeholder inputs and success states.
- Thread 4: obstacle overlay infrastructure, pause/retry flow, and lightweight scene transitions.
