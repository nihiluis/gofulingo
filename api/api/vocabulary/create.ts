import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { SingleVocabularyResponseSchema, VocabularySchema } from "./schema"
import type { TranslatorService } from "@/lib/translator"
import type { TranslationDBService } from "@/lib/translationDb"

export const createVocabularyRoute = createRoute({
  method: "post",
  path: `${BASE_PATH}/vocabulary`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: VocabularySchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: SingleVocabularyResponseSchema,
        },
      },
      description: "Create a new vocabulary",
    },
  },
})

export type CreateVocabularyRoute = typeof createVocabularyRoute

interface Props {
  vocabularyService: VocabularyService
  translatorService: TranslatorService
  translationDbService: TranslationDBService
}

export const createVocabularyHandler =
  ({
    vocabularyService,
    translatorService,
    translationDbService,
  }: Props): AppRouteHandler<CreateVocabularyRoute> =>
  async c => {
    const input = c.req.valid("json")

    const translationTexts = await translatorService.translateVocab(
      input.title,
      input.languageCode
    )

    const translation = await translationDbService.createTranslation({
      word: input.title,
      languageCode: input.languageCode,
      translations: translationTexts,
    })

    const inputWithTranslations = {
      ...input,
      translationId: translation.id,
    }
    const vocabulary = await vocabularyService.createVocabulary(
      inputWithTranslations
    )

    return c.json({ vocabulary }, 201)
  }
