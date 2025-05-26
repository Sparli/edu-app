// types/content.ts

export type Subject =
  | "Mathematics"
  | "Science and Technology"
  | "History and Citizenship Education"
  | "Geography"
  | "Contemporary World"
  | "Visual Arts"
  | "Music"
  | "Drama"
  | "Dance"
  | "Ethics and Religious Culture"
  | "Physical Education and Health";

export type Level = "Primary" | "Secondary";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Language = "English" | "French";

export interface QuickGenerateFormData
 {
  subject: Subject;
  level: Level;
  difficulty: Difficulty;
  language: Language;
  topic: string;
}

export interface GeneratedContent {
  lesson: string;
  quiz: string;
  reflection: string;
}
