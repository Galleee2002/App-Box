# Lovebox Digital

**Time capsule and connection for couples**

---

## Table of contents

1. [Product overview](#1-product-overview)
2. [Tech stack](#2-tech-stack)
3. [Folder structure](#3-folder-structure)

---

## 1. Product overview

A **private, couples-only** mobile app designed to strengthen daily connection and preserve memories in a dynamic way.

| Aspect | Detail |
|--------|--------|
| **Usage mode** | Works **100% offline** |
| **Sync** | Automatic when connectivity is detected |

### Core features (modules)

#### Lovebox — Time capsule

A box of virtual notes, letters, or photos **locked** until specific conditions are met, for example:

- *"When you're having a bad day"*
- *"When you miss me"*
- On anniversary dates

#### MoodSync — Emotional thermometer

A visual space based on **colors and emojis** to share mood in real time, without long text.

#### Our Bucket — Dynamic wish list

Visual, interactive cards where both partners propose, filter, and plan upcoming goals, trips, or restaurants to visit.

---

## 2. Tech stack

Chosen to leverage web design skills, ensure **offline-first** support, and avoid infrastructure over-engineering.

| Layer | Technology | Role |
|-------|------------|------|
| **Mobile frontend** | React Native + Expo | Mobile-first; JavaScript/TypeScript ecosystem |
| **Styling & animation** | NativeWind (Tailwind) + Reanimated or Moti | Warm UI, smooth transitions, micro-interactions |
| **Local data** | Expo SQLite + Zustand | On-device storage (offline-first) |
| **Backend & sync** | Supabase | Cloud DB, secure couple auth, sync without a custom server |

---

## 3. Folder structure

**Screaming Architecture** — the project reflects app features and separates visual layout from data logic.

```text
/apps/mobile/src
├── core/                        # Global rules and configuration
│   ├── theme/                   # Colors, gradients, global styles
│   └── database/                # SQLite setup and sync configuration
│
├── features/                    # Main modules (feature-based architecture)
│   ├── lovebox/                 # --- TIME CAPSULE MODULE ---
│   │   ├── components/          # Pure visual components (cards, open buttons)
│   │   ├── containers/          # Orchestrators (Zustand/SQLite ↔ view)
│   │   └── store/               # Lovebox local state (save and read notes)
│   │
│   ├── emotional-status/        # --- MOODSYNC MODULE ---
│   │   ├── components/          # Emotion wheel, color pickers
│   │   ├── containers/          # Real-time status change logic
│   │   └── store/               # Emotional thermometer local state
│   │
│   └── wishlist/                # --- OUR BUCKET MODULE ---
│       ├── components/          # Card list, visual filters
│       ├── containers/          # Progress handling and wish CRUD
│       └── store/               # Wish list local state
│
└── presentation/                # Shared cross-cutting components
    ├── ui/                      # Buttons, inputs, design system typography
    └── navigation/              # Route configuration (Expo Router)
```

### Per-feature convention

Every module under `features/` follows the same structure:

| Folder | Responsibility |
|--------|----------------|
| `components/` | Pure UI, no business logic |
| `containers/` | Connect store and database to the view |
| `store/` | Module-local state (Zustand) |
