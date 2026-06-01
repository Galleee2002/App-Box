export type Capsule = {
  id: string;
  title: string;
  body: string;
  unlockAt: Date;
  createdAt: Date;
};

export type CreateCapsuleValidationErrors = {
  title?: string;
  body?: string;
  unlockAt?: string;
};

const TITLE_MAX_LENGTH = 120;
const BODY_MAX_LENGTH = 10_000;

export function isCapsuleLocked(unlockAt: Date, now: Date = new Date()): boolean {
  return unlockAt.getTime() > now.getTime();
}

export function validateCreateCapsuleInput(input: {
  title: string;
  body: string;
  unlockAt: Date | null;
}): { ok: true } | { ok: false; errors: CreateCapsuleValidationErrors } {
  const errors: CreateCapsuleValidationErrors = {};
  const title = input.title.trim();
  const body = input.body.trim();

  if (!title) {
    errors.title = "El título es obligatorio.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Máximo ${TITLE_MAX_LENGTH} caracteres.`;
  }

  if (!body) {
    errors.body = "El mensaje es obligatorio.";
  } else if (body.length > BODY_MAX_LENGTH) {
    errors.body = `Máximo ${BODY_MAX_LENGTH} caracteres.`;
  }

  if (!input.unlockAt) {
    errors.unlockAt = "Indica cuándo se desbloquea la cápsula.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}

export function sortCapsules(items: Capsule[], now: Date = new Date()): Capsule[] {
  const locked: Capsule[] = [];
  const unlocked: Capsule[] = [];

  for (const capsule of items) {
    if (isCapsuleLocked(capsule.unlockAt, now)) {
      locked.push(capsule);
    } else {
      unlocked.push(capsule);
    }
  }

  locked.sort((a, b) => a.unlockAt.getTime() - b.unlockAt.getTime());
  unlocked.sort((a, b) => b.unlockAt.getTime() - a.unlockAt.getTime());

  return [...locked, ...unlocked];
}
