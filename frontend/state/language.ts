import { atom } from "jotai"
import { AVAILABLE_LANGUAGES, Language } from "~/lib/constants"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

const LANGUAGE_STORAGE_KEY = "selected_language"

// Helper function to get stored language
async function getStoredLanguage(): Promise<Language | null> {
  try {
    if (Platform.OS === "web") {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (storedLanguage) {
        return JSON.parse(storedLanguage)
      }
    } else {
      const storedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY)
      if (storedLanguage) {
        return JSON.parse(storedLanguage)
      }
    }
    return null
  } catch (error) {
    console.error("Error reading stored language:", error)
    return null
  }
}

// Helper function to store language
async function storeLanguage(language: Language): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(language))
    } else {
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, JSON.stringify(language))
    }
  } catch (error) {
    console.error("Error storing language:", error)
  }
}

// Create a base atom with the default language
const baseLanguageAtom = atom<Language>(AVAILABLE_LANGUAGES[0])

// Create a derived atom that handles storage
export const languageAtom = atom(
  (get) => get(baseLanguageAtom),
  async (get, set, newLanguage: Language) => {
    set(baseLanguageAtom, newLanguage)
    await storeLanguage(newLanguage)
  }
)

// Initialize the language from storage
getStoredLanguage().then((storedLanguage) => {
  if (storedLanguage) {
    baseLanguageAtom.init = storedLanguage
  }
})
