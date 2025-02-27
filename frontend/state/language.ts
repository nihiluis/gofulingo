import { atom } from "jotai"
import { AVAILABLE_LANGUAGES, Language } from "~/lib/constants"

export const languageAtom = atom<Language>(AVAILABLE_LANGUAGES[0])
