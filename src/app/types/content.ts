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
  user_datetime: string;
}

export type GeneratedContent = {
  lesson: Record<string, string | string[]>;
  quiz: {
    mcqs?: {
      statement: string;
      options: string[];
    }[];
    tf?: {
      statement: string;
      correct_answer: boolean;
    }[];
  };
  reflection: string;
};


/* -----------------------------------------------------------
   Extra shapes for the /content/generate/ endpoint
------------------------------------------------------------ */

/** What the frontend sends to POST /content/generate/ */
export type GenerateRequest = QuickGenerateFormData;

/** Exact structure your backend returns (success branch) */
export interface GenerateResponse {
  success: true;
  data: {
    response: GeneratedContent;
    is_valid: boolean;
  };
}

/** Structure if the backend signals an error */
export interface GenerateError {
  success: false;
  error: string;
}


export type QuizSubmitResult = {
  score: {
    mcqs: number;
    tf: number;
  };
  total: {
    mcqs: number;
    tf: number;
  };
  details: {
    mcqs: {
      question: string;
      correct: boolean;
      user_answer: number;
      correct_answer: number;
    }[];
    tf: {
      statement: string;
      correct: boolean;
      user_answer: boolean;
      correct_answer: boolean;
    }[];
  };
};

