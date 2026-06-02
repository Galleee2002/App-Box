export type BucketCategory = "trips" | "dates" | "food" | "milestones";

export type BucketItemStatus = "pending" | "completed";

export type BucketItem = {
  id: string;
  title: string;
  description: string;
  category: BucketCategory;
  status: BucketItemStatus;
  createdAt: Date;
  completedAt: Date | null;
};

export type CreateBucketItemValidationErrors = {
  title?: string;
  description?: string;
  category?: string;
};

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 2000;

export const BUCKET_CATEGORIES: BucketCategory[] = ["trips", "dates", "food", "milestones"];

const CATEGORY_LABELS: Record<BucketCategory, string> = {
  trips: "Viajes",
  dates: "Citas",
  food: "Comida",
  milestones: "Hitos",
};

export function getBucketCategoryLabel(category: BucketCategory): string {
  return CATEGORY_LABELS[category];
}

export function isBucketItemCompleted(item: BucketItem): boolean {
  return item.status === "completed";
}

export function validateCreateBucketItemInput(input: {
  title: string;
  description: string;
  category: BucketCategory | null;
}): { ok: true } | { ok: false; errors: CreateBucketItemValidationErrors } {
  const errors: CreateBucketItemValidationErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title) {
    errors.title = "El título es obligatorio.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Máximo ${TITLE_MAX_LENGTH} caracteres.`;
  }

  if (!description) {
    errors.description = "La descripción es obligatoria.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  if (!input.category) {
    errors.category = "Elige una categoría.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}

export function sortBucketItems(items: BucketItem[]): BucketItem[] {
  const pending: BucketItem[] = [];
  const completed: BucketItem[] = [];

  for (const item of items) {
    if (item.status === "completed") {
      completed.push(item);
    } else {
      pending.push(item);
    }
  }

  pending.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  completed.sort((a, b) => {
    const aTime = a.completedAt?.getTime() ?? 0;
    const bTime = b.completedAt?.getTime() ?? 0;
    return bTime - aTime;
  });

  return [...pending, ...completed];
}

export function formatBucketCompletedDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
  }).format(date);
}
