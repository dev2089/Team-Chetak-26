"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type TranslationKey } from "./translations"
import type { Language } from "./types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && ["en", "hi", "te", "ta", "pa"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    console.log("[v0] Setting language to:", lang)
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.setAttribute("lang", lang)
  }

  const t = (key: TranslationKey): string => {
    const translation = translations[key]?.[language]
    if (!translation) {
      console.log("[v0] Missing translation for key:", key, "language:", language)
      return translations[key]?.en || key
    }
    return translation
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: "en" as Language,
      setLanguage: (lang: Language) => {
        console.log("[v0] useLanguage called outside provider, cannot set:", lang)
      },
      t: (key: TranslationKey) => translations[key]?.en || key,
    }
  }
  return context
}
