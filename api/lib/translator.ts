import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { generateObject, type LanguageModelV1 } from "ai"
import { z } from "zod"
import { logger } from "./pino"

type TranslationPair = {
  word: string
  possibleTranslations: string[]
}

export interface TranslatorService {
  /**
   * @param vocabText can be a single word or a phrase
   */
  translateVocab(vocabText: string, languageCode: string): Promise<string[]>
  translateMultiVocab(
    vocabTexts: string[],
    languageCode: string
  ): Promise<TranslationPair[]>
}

class LLMTranslatorService implements TranslatorService {
  constructor(
    private readonly db: PostgresJsDatabase,
    private readonly llm: LanguageModelV1
  ) {}

  async translateVocab(
    vocabText: string,
    languageCode: string
  ): Promise<string[]> {
    logger.info({ vocabText, languageCode }, "translateVocab")

    const result = await generateObject({
      model: this.llm,
      schema: z.object({
        possibleTranslations: z.array(z.string()),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Translate '${vocabText}' from language code=${languageCode} to english. Return all possible translations that would be used in modern day conversation or articles.`,
            },
          ],
        },
      ],
    })

    if (!result) {
      throw new Error("result is empty")
    }

    return result.object.possibleTranslations
  }

  async translateMultiVocab(
    vocabTexts: string[],
    languageCode: string
  ): Promise<TranslationPair[]> {
    const uniqueVocabTexts = [...new Set(vocabTexts)]

    logger.info(
      { uniqueVocabTexts: uniqueVocabTexts.length },
      "translateMultiVocab"
    )

    const result = await generateObject({
      model: this.llm,
      schema: z.object({
        items: z.array(
          z.object({
            word: z.string(),
            possibleTranslations: z.array(z.string()),
          })
        ),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Translate the following words from language code=${languageCode}) to English. Return all possible translations that would be used in modern day conversation or articles. Words:`,
            },
            {
              type: "text",
              text: uniqueVocabTexts.join("\n"),
            },
          ],
        },
      ],
    })

    if (!result) {
      throw new Error("result is empty")
    }

    return result.object.items
  }
}

export function newLLMTranslatorService(
  db: PostgresJsDatabase,
  llm: LanguageModelV1
): TranslatorService {
  return new LLMTranslatorService(db, llm)
}
