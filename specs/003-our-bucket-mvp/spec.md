# Feature Specification: Our Bucket MVP

**Feature Branch**: `003-our-bucket-mvp`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "Continuar tras Lovebox MVP validado en iOS. Our Bucket MVP: lista de planes compartidos, crear ítem (título, descripción, categoría), estados pendiente/completado, persistencia local. Sin pairing, confirmación de pareja, imagen de portada, foto de recuerdo ni archivo de memorias en MVP. Fuente: docs/SPEC.md Feature 2."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a wish list item (Priority: P1)

As a user, I want to add a plan or goal with a title, description, and category so my partner and I can remember what we want to do together.

**Why this priority**: Adding items is the core value of Our Bucket; without creation, the board stays empty and useless.

**Independent Test**: Create an item with valid fields, leave the flow, and confirm the item still exists with the same title, description, and category after returning to the app.

**Acceptance Scenarios**:

1. **Given** the user is on the create-item flow, **When** they enter a non-empty title, non-empty description, select a category, and confirm, **Then** the item is saved and the user receives clear confirmation of success.
2. **Given** required fields are missing or invalid, **When** the user attempts to save, **Then** the system blocks save and shows which fields need correction without creating a partial record.
3. **Given** a saved item, **When** the user fully closes and reopens the app, **Then** the item remains available with the same title, description, category, and pending status.

---

### User Story 2 - Browse my bucket board (Priority: P2)

As a user, I want to see all our plans on one board so I can scan what is still to do and what we have already achieved.

**Why this priority**: The board makes saved items discoverable and motivates use of the feature over time.

**Independent Test**: With zero items, verify empty-state guidance; with one or more items, verify each card shows title, category, and a clear pending or completed indicator.

**Acceptance Scenarios**:

1. **Given** the user has no bucket items, **When** they open the Our Bucket area, **Then** they see an empty state that explains what the board is for and how to add the first item.
2. **Given** the user has one or more items, **When** they open the board, **Then** each item shows its title, category label, and whether it is pending or completed.
3. **Given** items in different states, **When** the board is shown, **Then** items are ordered so pending plans are easy to find first, with a consistent rule applied to all items (e.g., pending before completed, newest first within each group).

---

### User Story 3 - Mark an item as completed (Priority: P3)

As a user, I want to mark a plan as done and get a moment of celebration so completing shared goals feels rewarding.

**Why this priority**: Completion is the emotional payoff that differentiates a wish list from a static note.

**Independent Test**: Mark a pending item as completed from the board or detail view; confirm status updates everywhere and the user sees positive completion feedback.

**Acceptance Scenarios**:

1. **Given** a pending item, **When** the user marks it as completed, **Then** the item shows as completed on the board and in detail without requiring a second user to confirm in MVP.
2. **Given** a completed item, **When** the user views it, **Then** they can see when it was marked completed (date shown in a human-readable form).
3. **Given** a user marks an item completed by mistake, **When** they want to undo in MVP, **Then** the system does not require undo (out of scope); acceptance focuses on forward completion only.

---

### Edge Cases

- What happens when title or description is only whitespace?
- What happens when the user has many items (board remains scannable)?
- What happens if save fails due to local storage unavailability?
- What happens when the same title is used twice (allowed; no duplicate blocking in MVP)?
- What happens when marking complete while offline (must work; same as online for MVP)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a user to create a bucket item with title, description, and category.
- **FR-002**: The system MUST validate that title and description are non-empty before saving an item.
- **FR-003**: The system MUST require the user to choose one category from: Trips, Dates, Food, Milestones.
- **FR-004**: The system MUST persist all saved items on the device so they survive app restarts.
- **FR-005**: The system MUST present a board listing all bucket items in the current local user context.
- **FR-006**: The system MUST show an empty state when no items exist, including guidance to add the first item.
- **FR-007**: The system MUST indicate on the board whether each item is pending or completed.
- **FR-008**: The system MUST allow a user to mark a pending item as completed from the board or item detail.
- **FR-009**: The system MUST record the completion date when an item is marked completed and display it on completed items.
- **FR-010**: The system MUST provide clear positive feedback when an item is marked completed (celebration moment).
- **FR-011**: The system MUST NOT require couple pairing, invite codes, or a second user to confirm completion in this release.
- **FR-012**: The system MUST NOT require network connectivity to create, list, or complete items in MVP.

### Key Entities *(include if feature involves data)*

- **BucketItem**: A shared plan or goal; attributes include title, description, category (Trips | Dates | Food | Milestones), status (pending | completed), created timestamp, and optional completed-at timestamp when status is completed.
- **BucketBoard**: The ordered collection of bucket items shown in the Our Bucket area, including empty-state presentation when the collection has zero items.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a valid bucket item (title, description, category) and see it on the board within 2 minutes on first use without assistance.
- **SC-002**: 100% of manually created valid items remain available after force-closing and reopening the app during acceptance testing.
- **SC-003**: In acceptance testing, marking an item completed updates its status on the board and detail within one interaction, with completion date visible.
- **SC-004**: At least 90% of test participants correctly distinguish pending vs completed items from the board without written instructions.
- **SC-005**: The empty state is shown on a fresh install with zero items, and at least one test user successfully creates their first item from that state.

## Assumptions

- MVP operates in a single-user, single-device context; partner co-confirmation and dual-account sync are deferred.
- Cover images, memory photos on completion, and a separate memories archive are out of scope for MVP.
- Reverting completed items to pending, editing items after creation, and deleting items are out of scope unless added in a later spec.
- Remote sync, authentication, and couple pairing are out of scope; local persistence satisfies MVP.
- The Our Bucket area is reachable from existing app navigation (the **Planes** tab delivered by `001-mobile-foundation`, currently a placeholder).
- Category labels are fixed to the four product categories; custom categories are out of scope.
- Completion feedback is a lightweight in-app moment (not push notifications).

## Out of Scope (MVP)

- Couple pairing and invite codes
- Second-user confirmation before an item counts as completed
- Cover image on cards
- Memory photo attachment when completing an item
- Memories archive / history section separate from the main board
- Item editing and deletion after creation
- Cloud sync and conflict resolution
- Filters beyond pending/completed ordering on the main board
