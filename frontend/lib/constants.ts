import { LanguageCode } from "./api/vocabulary"

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
}

export interface Language {
  code: LanguageCode
  name: string
  flag: string
}

export const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: "fr",
    name: "French",
    flag: "🇫🇷",
  },
  {
    code: "es",
    name: "Spanish",
    flag: "🇪🇸",
  },
]

export const BACKEND_API_URL =
  process.env.EXPO_PUBLIC_BACKEND_API_URL ?? "http://localhost:3000"
