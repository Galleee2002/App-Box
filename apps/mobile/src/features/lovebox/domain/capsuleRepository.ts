import type { Capsule } from "./capsule";

export type CreateCapsuleInput = {
  title: string;
  body: string;
  unlockAt: Date;
};

export interface CapsuleRepository {
  list(): Promise<Capsule[]>;
  getById(id: string): Promise<Capsule | null>;
  create(input: CreateCapsuleInput): Promise<Capsule>;
}
