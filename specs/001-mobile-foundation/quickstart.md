# Quickstart: Mobile Foundation Sprint

**Feature**: 001-mobile-foundation | **Target**: iOS simulator (first run &lt; 15 min)

## Prerequisites

- Node.js 20+ and npm
- Xcode + iOS Simulator (for `npm run ios`)
- Repo cloned at `App-Box/`

## Install

```bash
cd apps/mobile
npm install
```

## Run on iOS

```bash
npm run ios
```

Expected: Metro starts, simulator opens, app shows **Inicio** tab with “Lovebox Foundation” card.

## Smoke test (manual)

1. Tap **Playground** — title “Playground de UI” visible.
2. Tap **Ajustes** — toggle dark mode; background and tab bar update.
3. From code or dev menu, open modal route if configured — “Informacion” screen loads.
4. Confirm no red error screen during tab switches.

## Quality gates

```bash
npm run lint
npm run typecheck
```

Both must exit with code `0`.

## Architecture verification

Confirm directories exist:

```text
apps/mobile/src/core/
apps/mobile/src/features/lovebox/
apps/mobile/src/features/emotional-status/
apps/mobile/src/features/wishlist/
apps/mobile/src/presentation/ui/
```

## Troubleshooting

| Issue | Action |
|-------|--------|
| Expo version mismatch warning | Run `npx expo install --fix` in `apps/mobile` |
| `expo-router/babel` deprecation | Ensure `babel.config.js` has no `expo-router/babel` plugin |
| Simulator not found | Open Xcode once; install a simulator runtime |

## Done criteria (SC-001–SC-004)

- [ ] App launches to initial screen in &lt; 15 min (first-time contributor path)
- [ ] All 3 tab screens reachable
- [ ] `lint` + `typecheck` pass
- [ ] Architecture folders match `docs/ARCHITECTURE.md`

When all checked, foundation sprint is closed — proceed to [NEXT.md](./NEXT.md).
