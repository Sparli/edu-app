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

export interface LessonContent {
  lesson: {
    heading: string;
    content: string;
  }[];
  reflection: string;
  valid_topic?: string;
}

export interface QuizContent {
  quiz: {
    mcqs: {
      [key: string]: {
        statement: string;
        options: Record<string, string>;
        answer: string;
        
      };
    };
    true_false: {
      [key: string]: {
        statement: string;
        answer: boolean;
        
      };
    };
  };
  reflection: string;
  valid_topic?: string;
}

export type GeneratedContent = LessonContent & QuizContent;




/* -----------------------------------------------------------
   Extra shapes for the /content/generate/ endpoint
------------------------------------------------------------ */

/** What the frontend sends to POST /content/generate/ */
export type GenerateRequest = QuickGenerateFormData;

/** Exact structure your backend returns (success branch) */
export interface GenerateResponse {
  success: true;
  data: {
    valid_topic: string;
    generated_content: GeneratedContent;
    user_input: QuickGenerateFormData;
    is_valid: boolean;
    submitted_quiz: boolean;
    submitted_ref: boolean;
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
    true_false: number;
  };
  total: {
    mcqs: number;
    true_false: number;
  };
  details: {
    mcqs: {
      [questionId: string]: {
        correct: boolean;
        user_answer: string;         
        correct_answer: string;
        rationale?: string;     
      };
    };
    true_false: {
      [questionId: string]: {
        correct: boolean;
        user_answer: boolean;
        correct_answer: boolean;
        rationale?: string;
      };
    };
  };
};


