# Design System Foundations (Mobile)

## Objetivo

Definir una base visual consistente para la app de pareja: minimalista, cálida y fácil de usar, con decisiones predecibles de espaciado, radio, tipografía y color en `light/dark`.

## Registro de implementación

### Fase 1 - Tema semántico y escalas

Se amplió la capa de tema en `apps/mobile/src/core/theme/index.ts` con:

- Colores semánticos: `background`, `surface`, `surfaceMuted`, `borderSubtle`, `borderStrong`, `textPrimary`, `textSecondary`, `textTertiary`, `accent`, estados de `accent`, `success`, `warning`, `danger`, `focusRing`, `overlay`.
- Escala de `radius`: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `pill`.
- Escala de `spacing`: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`.
- Tipografía: `fontSize`, `lineHeight`, `fontWeight`.
- Motion: `duration` y `easing`.
- Primitivas transversales: `elevation`, `opacity`, `zIndex`.

También se agregaron utilidades:

- `getThemeTokens(mode)`
- `resolveSemanticColor(mode, token)`
- `themePrimitives`

### Fase 2 - Sincronización con NativeWind

Se sincronizó `apps/mobile/tailwind.config.js` para exponer la misma taxonomía semántica y escalas:

- `colors` para `light` y variantes `-dark`.
- `spacing`, `borderRadius`.
- `fontSize`, `lineHeight`.
- `opacity`, `zIndex`, `boxShadow`.

### Fase 3 - Adopción inicial en pantallas base

Se migraron pantallas de base para evitar nombres ambiguos y usar tokens semánticos:

- `apps/mobile/app/(tabs)/_layout.tsx`
- `apps/mobile/app/(tabs)/settings.tsx`
- `apps/mobile/src/presentation/ui/FoundationScreen.tsx`
- `apps/mobile/app/+not-found.tsx`

### Fase 4 - Helper de consumo en UI

Se creó `apps/mobile/src/core/theme/useAppTheme.ts` para centralizar acceso a:

- `mode`
- `tokens`
- `color(token)`

## Guía de uso rápida

- Usar siempre color por rol semántico (`textPrimary`, `borderSubtle`) en lugar de hex.
- Mantener densidad de espacios en múltiplos de escala (`sm`, `md`, `lg`) para consistencia.
- Preferir `radius-md` o `radius-lg` para tarjetas y contenedores principales.
- Reservar `accent` para acciones principales y foco visual; no usarlo como color de texto masivo.
- En modo oscuro, mantener jerarquía con `textPrimary` > `textSecondary` > `textTertiary`.

## Anti-patrones

- Hardcodear colores hex en pantallas.
- Mezclar nomenclaturas (`text`, `textMuted`) con nuevos roles semánticos.
- Introducir nuevos tamaños/radios fuera de escala sin justificar.
- Usar múltiples acentos en la misma pantalla.

## Próximos pasos recomendados

1. Persistir `ThemeMode` en almacenamiento local para mantener preferencia al reiniciar.
2. Construir componentes base (`Button`, `Input`, `Card`) consumiendo solo tokens semánticos.
3. Agregar una pantalla interna de referencia visual de foundations para QA rápido.
