
import type { GenerateRequest, GeneratedContent } from "@/app/types/content";

const makeKey = (m: GenerateRequest) =>
  `gen:${m.language}|${m.level}|${m.subject}|${m.difficulty}|${m.topic.trim()}`;

export const saveGenerated = (meta: GenerateRequest, content: GeneratedContent) =>
  sessionStorage.setItem(makeKey(meta), JSON.stringify(content));

export const loadGenerated = (meta: GenerateRequest): GeneratedContent | null => {
  const raw = sessionStorage.getItem(makeKey(meta));
  return raw ? (JSON.parse(raw) as GeneratedContent) : null;
};
