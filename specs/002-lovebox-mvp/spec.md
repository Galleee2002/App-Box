# Feature Specification: Lovebox Digital MVP

**Feature Branch**: `002-lovebox-mvp`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "Lovebox MVP: listar cápsulas, crear cápsula (título, texto, fecha de desbloqueo temporal), estados locked/unlocked, persistencia local. Sin pairing ni GPS en MVP. Fuente: docs/SPEC.md Feature 1 y specs/001-mobile-foundation/NEXT.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a time-locked capsule (Priority: P1)

As a user, I want to create a capsule with a title, a text message, and a date/time when it should unlock so I can save a private moment to open later.

**Why this priority**: Creating capsules is the core product promise; without it, Lovebox delivers no value.

**Independent Test**: Create a capsule with valid fields, leave the flow, and confirm the capsule still exists with the chosen unlock schedule after returning to the app.

**Acceptance Scenarios**:

1. **Given** the user is on the create-capsule flow, **When** they enter a non-empty title, non-empty text body, and a future unlock date/time and confirm, **Then** the capsule is saved and the user receives clear confirmation of success.
2. **Given** required fields are missing or invalid, **When** the user attempts to save, **Then** the system blocks save and shows which fields need correction without creating a partial record.
3. **Given** a saved capsule, **When** the user fully closes and reopens the app, **Then** the capsule remains available with the same title, text, and unlock schedule.

---

### User Story 2 - Browse my capsules (Priority: P2)

As a user, I want to see all my capsules in one list so I can find what I have saved and know when something is still locked.

**Why this priority**: A list makes saved capsules discoverable and sets context before opening any single capsule.

**Independent Test**: With zero capsules, verify empty-state guidance; with one or more capsules, verify each item appears with title and a clear locked or unlocked indicator.

**Acceptance Scenarios**:

1. **Given** the user has no capsules, **When** they open the Lovebox area, **Then** they see an empty state that explains what a capsule is and how to create the first one.
2. **Given** the user has one or more capsules, **When** they open the Lovebox list, **Then** each capsule shows its title and whether it is currently locked or unlocked.
3. **Given** capsules with different unlock times, **When** the list is shown, **Then** items are ordered so the user can scan upcoming unlocks intuitively (e.g., soonest unlock first among locked items, with a consistent rule applied to all items).

---

### User Story 3 - View locked vs unlocked content (Priority: P3)

As a user, I want to open a capsule and either see protected content with a time hint or read the full message once the unlock time has passed.

**Why this priority**: The emotional payoff depends on clearly different experiences before and after the unlock moment.

**Independent Test**: Open one capsule before its unlock time (locked presentation) and one after unlock time (full content visible); change device clock only in test environments if needed to validate the boundary.

**Acceptance Scenarios**:

1. **Given** a capsule whose unlock date/time is in the future, **When** the user opens it, **Then** the full message body is hidden, the title is visible, and a clear hint shows when it unlocks (countdown or formatted date/time).
2. **Given** a capsule whose unlock date/time is in the past or exactly now, **When** the user opens it, **Then** the full text content is readable and the capsule is shown as unlocked.
3. **Given** a capsule transitions from locked to unlocked because time has passed, **When** the user returns to the list or reopens the capsule, **Then** the unlocked state is reflected without requiring the user to recreate the capsule.

---

### Edge Cases

- What happens when the user sets an unlock date/time in the past at creation time? (Treat as immediately unlocked.)
- What happens when title or text is only whitespace?
- What happens when the device clock changes (user travels time zones or adjusts clock)?
- What happens with very long titles or message bodies at list and detail level?
- What happens when the user has many capsules (list remains usable without losing orientation)?
- What happens if save fails due to local storage unavailability?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a user to create a capsule with title, text content, and a temporal unlock date/time.
- **FR-002**: The system MUST validate that title and text content are non-empty before saving a capsule.
- **FR-003**: The system MUST validate that an unlock date/time is provided for every new capsule.
- **FR-004**: The system MUST persist all saved capsules on the device so they survive app restarts.
- **FR-005**: The system MUST present a list of all capsules belonging to the current local user context.
- **FR-006**: The system MUST show an empty state when no capsules exist, including guidance to create the first capsule.
- **FR-007**: The system MUST indicate on the list whether each capsule is locked or unlocked based solely on the temporal unlock rule.
- **FR-008**: The system MUST hide the full message body on capsule detail while locked and show a clear unlock-time hint.
- **FR-009**: The system MUST show the full message body on capsule detail once the unlock date/time has been reached.
- **FR-010**: The system MUST treat a capsule as unlocked immediately if its unlock date/time is already in the past at save time.
- **FR-011**: The system MUST NOT require couple pairing, invite codes, or a recipient account for MVP usage.
- **FR-012**: The system MUST NOT offer geographic (GPS) unlock conditions in this release.
- **FR-013**: The system MUST NOT require network connectivity to create, list, or open capsules in MVP.

### Key Entities *(include if feature involves data)*

- **Capsule**: A time-locked personal message; attributes include title, text content, unlock date/time, created timestamp, and derived locked/unlocked status from time comparison.
- **CapsuleList**: The ordered collection of capsules shown in the Lovebox area, including empty-state presentation when the collection has zero items.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a valid capsule (title, text, future unlock time) and see it in the list within 2 minutes on first use without assistance.
- **SC-002**: 100% of manually created valid capsules remain available after force-closing and reopening the app during acceptance testing.
- **SC-003**: In acceptance testing, locked capsules never show full message body before unlock time; unlocked capsules always show full body after unlock time.
- **SC-004**: At least 90% of test participants correctly distinguish locked vs unlocked capsules from list and detail screens without written instructions.
- **SC-005**: The empty state is shown on a fresh install with zero capsules, and at least one test user successfully creates their first capsule from that state.

## Assumptions

- MVP operates in a single-user, single-device context; multi-user inbox and partner delivery are deferred.
- Capsule content is text-only for MVP; photos, audio, and rich attachments are out of scope (aligned with bounded NEXT.md input).
- Only temporal unlock is in scope; geographic unlock and map-based conditions are explicitly excluded.
- Local push notifications when a capsule unlocks are out of scope for MVP; users discover unlock by opening the list or detail.
- Edit, delete, duplicate, and share actions on existing capsules are out of scope unless added in a later spec.
- Remote sync, authentication, and Supabase pairing are out of scope for this feature slice; local persistence satisfies MVP.
- The Lovebox area is reachable from existing app navigation delivered by `001-mobile-foundation`.
- Unlock status is evaluated from the device’s current date/time at view time; timezone follows the user’s device settings.

## Out of Scope (MVP)

- Couple pairing and invite codes
- Recipient-specific inbox or “sent vs received” views
- Geographic unlock (GPS)
- Image or file attachments in capsules
- Local notifications on unlock
- Cloud sync and conflict resolution
- Capsule editing and deletion after creation
