export const clearReflectionCache = () => {
  sessionStorage.removeItem("reflection_text");
  sessionStorage.removeItem("reflection_feedback");
  sessionStorage.removeItem("reflection_submitted");
};
