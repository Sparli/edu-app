import type { GenerateRequest } from "@/app/types/content";

export const buildQuery = (meta: GenerateRequest): string =>
  new URLSearchParams({
    language: meta.language,
    level: meta.level,
    subject: meta.subject,
    difficulty: meta.difficulty,
    topic: meta.topic,
  }).toString();
