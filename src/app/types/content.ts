export type Subject = "English" | "Math" | "Science";
export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface GenerateFormData {
  subject: Subject;
  level: Level;
  topic: string;
}

export interface GeneratedContent {
  lesson: string;
  quiz: string;
  reflection: string;
}
