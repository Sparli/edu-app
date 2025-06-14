export const clearSavedSessionData = () => {
  sessionStorage.removeItem("reflection_text");
  sessionStorage.removeItem("reflection_feedback");
  sessionStorage.removeItem("reflection_submitted");

  sessionStorage.removeItem("lesson_rating");
  sessionStorage.removeItem("lesson_feedback");

  sessionStorage.removeItem("save_flag");
  sessionStorage.removeItem("submitted_quiz_data");
};
