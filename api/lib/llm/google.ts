import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { type LanguageModel } from "ai"

export function createGoogleModel(): LanguageModel {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set")
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  })

  const model = google(process.env.GOOGLE_MODEL_ID || "gemini-2.0-flash-exp")

  return model
}
