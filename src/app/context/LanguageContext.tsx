"use client";
import { createContext, useContext, useState } from "react";

type Language = "fr" | "en";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: "fr",
  setLanguage: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>("fr");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
