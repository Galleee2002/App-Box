# Product specification (SPEC.md)

## 1. Product overview

A private, couples-only mobile app that unifies closeness, planning, and emotional sync in one secure, enjoyable place. The product prioritizes extreme simplicity, an intimate user experience (UX), and an **offline-first** approach for immediate availability.

---

## 2. Design and development pillars

- **Closed scope:** No features outside the three described here, to avoid over-engineering.
- **Privacy by design:** Data belongs to the couple. Primary storage is local (SQLite), synced securely via Neon (`apps/api`).
- **Zero friction:** Clean interfaces, smooth transitions, and optimistic UI (changes appear on screen immediately while syncing in the background).

---

## 3. Feature specification

### Feature 1: Lovebox Digital (time capsule)

- **Description:** Space to send and store messages, photos, or notes that stay locked until a specific condition is met.
- **Business rules:**
  - A user can create a "capsule" with a title, content (text/image), and an unlock condition.
  - **Condition types:**
    - _Temporal:_ Unlocks at a specific date and time.
    - _Geographic:_ Unlocks when the couple is at a given place (GPS coordinates).
  - The recipient can see the capsule in their inbox, but content renders in a "Locked" state with a counter or visual hint.
  - When the condition is met, a local notification fires and the capsule permanently moves to "Unlocked".

### Feature 2: Our Bucket (shared wish list)

- **Description:** An interactive visual board of plans, trips, and goals the couple wants to achieve together.
- **Business rules:**
  - Either partner can add a Bucket item with: Title, Description, Category (Trips, Dates, Food, Milestones), and a cover image.
  - **Card states:** `Pending` (to-do) and `Completed` (done).
  - To mark an item `Completed`, one partner marks it and the other confirms, or a direct check is allowed with an on-screen celebration animation.
  - On completion, attach a "memory photo" and the date it was fulfilled; move it to the memories archive/history.

### Feature 3: MoodSync (emotional sync)

- **Description:** A real-time emotional thermometer to know how the other person feels without asking, fostering empathy.
- **Business rules:**
  - The main screen shows both partners' current state.
  - A user can update their state by choosing among 5 predefined emotional levels (e.g. Radiant, Calm, Tired, Overwhelmed, Sad).
  - Each state subtly changes the background color or gradient of the couple section (color fusion).
  - Allows a "micro-status" text (max 30 characters, e.g. "In a long meeting").
  - State expires automatically after 12 hours if not updated, returning to neutral.

---

## 4. Non-functional requirements and constraints

- **Offline mode:** The app must allow recording MoodSync states, checking off Bucket items, or saving capsules without internet. Changes are queued locally in SQLite and sync when connectivity returns.
- **Authentication:** Exclusive pairing via a unique invite code. A user account can only be linked to one other account at a time.

---

## 5. Global acceptance criteria for AI (Cursor)

1. **Do not invent UI:** Every new screen or component must strictly use components defined in the architecture (Container + pure components with NativeWind).
2. **Data validation:** No record (message, Bucket item, state) may be saved with required fields empty or null.
3. **Error handling:** Any Neon/API sync network failure must be handled silently for the user; the local experience must not break.
